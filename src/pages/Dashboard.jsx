import { useState, useEffect } from 'react';
import { FileText, CheckCircle, Clock, Banknote, TrendingUp, Users, AlertCircle, DollarSign, CreditCard, TrendingDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, CartesianGrid } from 'recharts';
import Card from '@/components/ui/Card';
import PageHeader from '@/components/PageHeader';
import useJobsStore from '@/store/jobsStore';
import { toast } from 'sonner';

const COLORS = ['#1E3A8A', '#D32F2F', '#FFC107', '#4CAF50'];

const Dashboard = () => {
  const { jobs, approveEstimate } = useJobsStore();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    kpiData: [],
    overviewData: [],
    categorySplitData: [],
    recentJobs: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [
        jobsResult,
        invoicesResult,
        vendorLedgerResult,
        labourLedgerResult,
        customersResult,
      ] = await Promise.all([
        supabase.from('customer_jobs').select('*'),
        supabase.from('invoices').select('total_amount, created_at, payment_status'),
        supabase.from('vendor_ledger_entries').select('debit, entry_date'),
        supabase.from('labour_ledger_entries').select('debit, entry_date'),
        supabase.from('customers').select('id'),
      ]);

      const jobs = jobsResult.data || [];
      const invoices = invoicesResult.data || [];
      const vendorLedger = vendorLedgerResult.data || [];
      const labourLedger = labourLedgerResult.data || [];
      const customers = customersResult.data || [];

      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      const jobsInProgress = jobs.filter(j => j.status === 'in_progress' || j.status === 'estimate_pending').length;
      const jobsCompleted = jobs.filter(j => j.status === 'completed').length;

      const vendorSpendThisMonth = vendorLedger
        .filter(entry => {
          const entryDate = new Date(entry.entry_date);
          return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
        })
        .reduce((sum, entry) => sum + parseFloat(entry.debit || 0), 0);

      const totalRevenue = invoices.reduce((sum, inv) => sum + parseFloat(inv.total_amount || 0), 0);
      const paidRevenue = invoices
        .filter(inv => inv.payment_status === 'paid')
        .reduce((sum, inv) => sum + parseFloat(inv.total_amount || 0), 0);

      const approvalRequests = Object.values(jobs).filter(job => job?.estimate?.approvalNeeded || false);

      const todayInvoices = invoices.filter(inv => {
        const invDate = new Date(inv.created_at);
        return invDate.toDateString() === today.toDateString();
      });

      const pendingPayments = invoices
        .filter(inv => inv.payment_status === 'pending' || inv.payment_status === 'partial')
        .reduce((sum, inv) => sum + parseFloat(inv.total_amount || 0), 0);

      const totalExpenses = vendorSpendThisMonth + labourLedger
        .filter(entry => {
          const entryDate = new Date(entry.entry_date);
          return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
        })
        .reduce((sum, entry) => sum + parseFloat(entry.debit || 0), 0);

      const kpiData = [
        {
          name: 'Approvals',
          value: approvalRequests.length.toString(),
          icon: CheckCircle,
          color: 'text-white',
          bgColor: 'bg-[#4CAF50]',
          iconBgColor: 'bg-[#4CAF50]'
        },
        {
          name: "Today's Invoices",
          value: todayInvoices.length.toString(),
          icon: CreditCard,
          color: 'text-white',
          bgColor: 'bg-[#EF5350]',
          iconBgColor: 'bg-[#EF5350]'
        },
        {
          name: 'Pending Payments',
          value: `₹ ${(pendingPayments / 1000).toFixed(1)}K`,
          icon: DollarSign,
          color: 'text-white',
          bgColor: 'bg-[#FFC107]',
          iconBgColor: 'bg-[#FFC107]'
        },
        {
          name: 'Expenses',
          value: `₹ ${(totalExpenses / 1000).toFixed(1)}K`,
          icon: TrendingDown,
          color: 'text-white',
          bgColor: 'bg-[#EF5350]',
          iconBgColor: 'bg-[#EF5350]'
        },
      ];

      const last6Months = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date(currentYear, currentMonth - i, 1);
        const monthName = date.toLocaleString('default', { month: 'short' });
        const month = date.getMonth();
        const year = date.getFullYear();

        const monthRevenue = invoices
          .filter(inv => {
            const invDate = new Date(inv.created_at);
            return invDate.getMonth() === month && invDate.getFullYear() === year;
          })
          .reduce((sum, inv) => sum + parseFloat(inv.total_amount || 0), 0);

        const monthVendorExpense = vendorLedger
          .filter(entry => {
            const entryDate = new Date(entry.entry_date);
            return entryDate.getMonth() === month && entryDate.getFullYear() === year;
          })
          .reduce((sum, entry) => sum + parseFloat(entry.debit || 0), 0);

        const monthLabourExpense = labourLedger
          .filter(entry => {
            const entryDate = new Date(entry.entry_date);
            return entryDate.getMonth() === month && entryDate.getFullYear() === year;
          })
          .reduce((sum, entry) => sum + parseFloat(entry.debit || 0), 0);

        last6Months.push({
          name: monthName,
          revenue: Math.round(monthRevenue),
          expenses: Math.round(monthVendorExpense + monthLabourExpense),
        });
      }

      const totalVendorSpend = vendorLedger.reduce((sum, entry) => sum + parseFloat(entry.debit || 0), 0);
      const totalLabourSpend = labourLedger.reduce((sum, entry) => sum + parseFloat(entry.debit || 0), 0);

      const categorySplitData = [
        { name: 'Vendor Services', value: Math.round(totalVendorSpend) },
        { name: 'Labour Cost', value: Math.round(totalLabourSpend) },
        { name: 'Materials', value: Math.round(totalVendorSpend * 0.3) },
      ].filter(item => item.value > 0);

      setDashboardData({
        kpiData,
        overviewData: last6Months,
        categorySplitData,
        recentJobs: jobs.slice(0, 5),
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const approvalRequests = Object.values(jobs).filter(job => job?.estimate?.approvalNeeded || false);

  const handleApprove = (jobId) => {
    approveEstimate(jobId);
    toast.success(`Estimate for job ${jobs[jobId]?.vehicleNo || jobId} approved!`);
  };

  const handleReject = (jobId) => {
    toast.info(`Estimate for job ${jobs[jobId]?.vehicleNo || jobId} rejected.`);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {dashboardData.kpiData.map((kpi, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200 p-6">
            <div className="flex flex-col items-center justify-center text-center space-y-3">
              <div className={`p-4 rounded-full ${kpi.iconBgColor}`}>
                <kpi.icon className={`h-8 w-8 md:h-10 md:w-10 ${kpi.color}`} />
              </div>
              <div>
                <p className="text-base md:text-lg font-semibold text-gray-900 dark:text-dark-text mb-1">
                  {kpi.name}
                </p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-dark-text">
                  {kpi.value}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Approval Requests" className="lg:col-span-2">
          <div className="overflow-x-auto">
            {approvalRequests.length > 0 ? (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">Vehicle</th>
                    <th scope="col" className="px-6 py-3">Type</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {approvalRequests.map(job => (
                    <tr
                      key={job.id}
                      className="bg-white dark:bg-dark-card border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {job.vehicleNo || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-dark-text-secondary">
                        Discount Approval
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Pending
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleApprove(job.id)}
                            className="font-medium text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(job.id)}
                            className="font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mb-3" />
                <p className="text-gray-600 dark:text-dark-text-secondary font-medium">
                  No pending approvals
                </p>
                <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">
                  All estimates have been reviewed
                </p>
              </div>
            )}
          </div>
        </Card>

        <Card title="Expense Category Split">
          {dashboardData.categorySplitData.length > 0 ? (
            <div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={dashboardData.categorySplitData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dashboardData.categorySplitData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(30, 30, 30, 0.9)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px'
                    }}
                    itemStyle={{ color: 'white' }}
                    formatter={(value) => `₹${value.toLocaleString()}`}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {dashboardData.categorySplitData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-gray-700 dark:text-dark-text-secondary">{item.name}</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-dark-text">
                      ₹{item.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-dark-text-secondary">
              No expense data available
            </div>
          )}
        </Card>
      </div>

      <Card title="Revenue vs Expenses">
        {dashboardData.overviewData.length > 0 ? (
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart
              data={dashboardData.overviewData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D32F2F" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#D32F2F" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis
                dataKey="name"
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(30, 30, 30, 0.95)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px'
                }}
                labelStyle={{ color: 'white', fontWeight: 'bold', marginBottom: '8px' }}
                itemStyle={{ color: 'white' }}
                formatter={(value) => `₹${value.toLocaleString()}`}
              />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#1E3A8A"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                name="Revenue"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="#D32F2F"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorExpenses)"
                name="Expenses"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-80 text-gray-500 dark:text-dark-text-secondary">
            No revenue data available
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
