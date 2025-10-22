import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import PageHeader from '@/components/PageHeader';
import { toast } from 'sonner';
import {
  Truck,
  Users,
  Package,
  Wrench,
  BarChart as BarChartIcon,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Download,
  Printer,
  Calendar,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

const Summary = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const [kpis, setKpis] = useState({
    totalExpenses: 0,
    totalRevenue: 0,
    totalVendors: 0,
    totalLabour: 0,
    totalPartsUsed: 0,
    totalStockValue: 0,
    totalWorkDone: 0,
  });

  const [profitLossData, setProfitLossData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchKPIs(),
        fetchProfitLossTrend(),
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchKPIs = async () => {
    try {
      const { startDate, endDate } = dateRange;

      const [
        expensesData,
        revenueData,
        vendorsData,
        labourData,
        stockMovementsData,
        inventoryData,
        jobsData,
      ] = await Promise.all([
        supabase
          .from('vouchers')
          .select('amount')
          .gte('voucher_date', startDate)
          .lte('voucher_date', endDate),

        supabase
          .from('invoices')
          .select('total_amount')
          .gte('invoice_date', startDate)
          .lte('invoice_date', endDate),

        supabase
          .from('vendors')
          .select('id', { count: 'exact', head: true }),

        supabase
          .from('labour')
          .select('id', { count: 'exact', head: true }),

        supabase
          .from('stock_movements')
          .select('quantity')
          .eq('movement_type', 'OUT')
          .gte('movement_date', startDate)
          .lte('movement_date', endDate),

        supabase
          .from('inventory_items')
          .select('current_stock, cost_price'),

        supabase
          .from('customer_jobs')
          .select('id', { count: 'exact', head: true })
          .gte('job_date', startDate)
          .lte('job_date', endDate),
      ]);

      const totalExpenses = expensesData.data?.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0) || 0;
      const totalRevenue = revenueData.data?.reduce((sum, item) => sum + parseFloat(item.total_amount || 0), 0) || 0;
      const totalVendors = vendorsData.count || 0;
      const totalLabour = labourData.count || 0;
      const totalPartsUsed = stockMovementsData.data?.reduce((sum, item) => sum + parseFloat(item.quantity || 0), 0) || 0;
      const totalStockValue = inventoryData.data?.reduce(
        (sum, item) => sum + (parseFloat(item.current_stock || 0) * parseFloat(item.cost_price || 0)),
        0
      ) || 0;
      const totalWorkDone = jobsData.count || 0;

      setKpis({
        totalExpenses,
        totalRevenue,
        totalVendors,
        totalLabour,
        totalPartsUsed,
        totalStockValue,
        totalWorkDone,
      });
    } catch (error) {
      console.error('Error fetching KPIs:', error);
      throw error;
    }
  };

  const fetchProfitLossTrend = async () => {
    try {
      const { startDate, endDate } = dateRange;

      const start = new Date(startDate);
      const end = new Date(endDate);
      const monthsData = [];

      const currentDate = new Date(start.getFullYear(), start.getMonth(), 1);
      const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);

      while (currentDate <= endMonth) {
        const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
          .toISOString()
          .split('T')[0];
        const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
          .toISOString()
          .split('T')[0];

        const [revenueData, expensesData] = await Promise.all([
          supabase
            .from('invoices')
            .select('total_amount')
            .gte('invoice_date', monthStart)
            .lte('invoice_date', monthEnd),

          supabase
            .from('vouchers')
            .select('amount')
            .gte('voucher_date', monthStart)
            .lte('voucher_date', monthEnd),
        ]);

        const revenue = revenueData.data?.reduce((sum, item) => sum + parseFloat(item.total_amount || 0), 0) || 0;
        const expenses = expensesData.data?.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0) || 0;
        const profit = revenue - expenses;

        const monthName = currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

        monthsData.push({
          name: monthName,
          profit: parseFloat(profit.toFixed(2)),
          revenue: parseFloat(revenue.toFixed(2)),
          expenses: parseFloat(expenses.toFixed(2)),
        });

        currentDate.setMonth(currentDate.getMonth() + 1);
      }

      setProfitLossData(monthsData);
    } catch (error) {
      console.error('Error fetching profit/loss trend:', error);
      throw error;
    }
  };

  const handleDatePreset = (preset) => {
    const today = new Date();
    let startDate, endDate;

    switch (preset) {
      case 'thisMonth':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = today;
        break;
      case 'lastMonth':
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 'thisQuarter':
        const quarter = Math.floor(today.getMonth() / 3);
        startDate = new Date(today.getFullYear(), quarter * 3, 1);
        endDate = today;
        break;
      case 'thisYear':
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = today;
        break;
      default:
        return;
    }

    setDateRange({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    });
  };

  const exportToCSV = () => {
    const headers = ['Metric', 'Value'];
    const kpiRows = [
      ['Total Revenue', `₹${kpis.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`],
      ['Total Expenses', `₹${kpis.totalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`],
      ['Net Profit', `₹${(kpis.totalRevenue - kpis.totalExpenses).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`],
      ['Total Vendors', kpis.totalVendors],
      ['Total Labour', kpis.totalLabour],
      ['Total Parts Used', kpis.totalPartsUsed.toFixed(2)],
      ['Total Stock Value', `₹${kpis.totalStockValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`],
      ['Total Work Done', `${kpis.totalWorkDone} Jobs`],
      ['', ''],
      ['Month', 'Profit/Loss'],
      ...profitLossData.map((item) => [item.name, `₹${item.profit.toLocaleString('en-IN')}`]),
    ];

    const csvContent = [
      `Summary Dashboard Report`,
      `Period: ${new Date(dateRange.startDate).toLocaleDateString('en-IN')} to ${new Date(dateRange.endDate).toLocaleDateString('en-IN')}`,
      '',
      headers.join(','),
      ...kpiRows.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `summary_dashboard_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Summary exported to CSV');
  };

  const handlePrint = () => {
    window.print();
    toast.success('Print dialog opened');
  };

  const netProfit = kpis.totalRevenue - kpis.totalExpenses;
  const profitMargin = kpis.totalRevenue > 0 ? ((netProfit / kpis.totalRevenue) * 100).toFixed(1) : 0;

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: `₹${kpis.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Total Expenses',
      value: `₹${kpis.totalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      icon: TrendingDown,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
    {
      title: 'Net Profit',
      value: `₹${netProfit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      icon: netProfit >= 0 ? TrendingUp : TrendingDown,
      color: netProfit >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: netProfit >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20',
      subtitle: `${profitMargin}% margin`,
    },
    {
      title: 'Total Vendors',
      value: kpis.totalVendors,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Total Labour',
      value: kpis.totalLabour,
      icon: Wrench,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    },
    {
      title: 'Total Parts Used',
      value: kpis.totalPartsUsed.toFixed(2),
      icon: Package,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      title: 'Total Stock Value',
      value: `₹${kpis.totalStockValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      icon: BarChartIcon,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
    },
    {
      title: 'Total Work Done',
      value: `${kpis.totalWorkDone} Jobs`,
      icon: Truck,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 dark:bg-gray-800/50',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Summary Dashboard" />
        <Card>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red"></div>
            <span className="ml-3 text-gray-600 dark:text-dark-text-secondary">Loading dashboard...</span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Summary Dashboard" />

      <Card>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary">
                Date Range:
              </span>
            </div>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="p-2 border border-gray-300 rounded-lg bg-white dark:bg-dark-card dark:border-gray-600 dark:text-dark-text text-sm focus:ring-2 focus:ring-brand-red"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="p-2 border border-gray-300 rounded-lg bg-white dark:bg-dark-card dark:border-gray-600 dark:text-dark-text text-sm focus:ring-2 focus:ring-brand-red"
            />
            <Button onClick={fetchDashboardData}>Apply Filter</Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => handleDatePreset('thisMonth')}>
              This Month
            </Button>
            <Button variant="secondary" onClick={() => handleDatePreset('lastMonth')}>
              Last Month
            </Button>
            <Button variant="secondary" onClick={() => handleDatePreset('thisQuarter')}>
              This Quarter
            </Button>
            <Button variant="secondary" onClick={() => handleDatePreset('thisYear')}>
              This Year
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <Button variant="secondary" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export Summary
            </Button>
            <Button variant="secondary" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((item) => (
          <Card key={item.title}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-dark-text-secondary">
                  {item.title}
                </p>
                <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-dark-text">
                  {item.value}
                </p>
                {item.subtitle && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{item.subtitle}</p>
                )}
              </div>
              <div className={`p-3 rounded-lg ${item.bgColor}`}>
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text mb-4">
          Profit / Loss Trend
        </h3>
        {profitLossData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={profitLossData}>
              <XAxis
                dataKey="name"
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(30, 30, 30, 0.95)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                }}
                formatter={(value) => [`₹${parseFloat(value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, '']}
                labelStyle={{ color: 'white', fontWeight: 'bold' }}
              />
              <Legend />
              <Bar
                dataKey="profit"
                name="Profit/Loss"
                radius={[8, 8, 0, 0]}
              >
                {profitLossData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.profit >= 0 ? '#22c55e' : '#ef4444'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center py-12 text-gray-500 dark:text-dark-text-secondary">
            <p>No data available for the selected period</p>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text mb-4">
            Financial Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-dark-text-secondary">Total Revenue</span>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                ₹{kpis.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-dark-text-secondary">Total Expenses</span>
              <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                ₹{kpis.totalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-base font-medium text-gray-900 dark:text-dark-text">Net Profit</span>
              <span
                className={`text-base font-bold ${
                  netProfit >= 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                ₹{netProfit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-dark-text-secondary">Profit Margin</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-dark-text">
                {profitMargin}%
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text mb-4">
            Operations Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-dark-text-secondary">Jobs Completed</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-dark-text">
                {kpis.totalWorkDone}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-dark-text-secondary">Parts Used</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-dark-text">
                {kpis.totalPartsUsed.toFixed(2)} units
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-dark-text-secondary">Active Vendors</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-dark-text">
                {kpis.totalVendors}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-dark-text-secondary">Active Labour</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-dark-text">
                {kpis.totalLabour}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Summary;
