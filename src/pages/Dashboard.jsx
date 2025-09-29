import { FileText, CheckCircle, Clock, Banknote } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Card from '@/components/ui/Card';
import PageHeader from '@/components/PageHeader';
import useJobsStore from '@/store/jobsStore';
import { toast } from 'sonner';

const kpiData = [
  { name: 'Jobs In-Progress', value: '12', icon: Clock, color: 'text-blue-500' },
  { name: 'Jobs Completed', value: '88', icon: CheckCircle, color: 'text-green-500' },
  { name: 'Vendor Spend (Month)', value: '₹1,25,000', icon: Banknote, color: 'text-red-500' },
  { name: 'Approvals Pending', value: '3', icon: FileText, color: 'text-amber-500' },
];

const overviewData = [
  { name: 'Jan', revenue: 4000, expenses: 2400 }, { name: 'Feb', revenue: 3000, expenses: 1398 },
  { name: 'Mar', revenue: 5000, expenses: 4800 }, { name: 'Apr', revenue: 4780, expenses: 3908 },
  { name: 'May', revenue: 5890, expenses: 4800 }, { name: 'Jun', revenue: 4390, expenses: 3800 },
];

const categorySplitData = [ { name: 'Vendor', value: 400 }, { name: 'Labour', value: 300 }, { name: 'Stock', value: 300 } ];
const COLORS = ['#1E3A8A', '#D32F2F', '#FFC107'];

const Dashboard = () => {
  const { jobs, approveEstimate } = useJobsStore();
  const approvalRequests = Object.values(jobs).filter(job => job.estimate.approvalNeeded);

  const handleApprove = (jobId) => {
    approveEstimate(jobId);
    toast.success(`Estimate for job ${jobs[jobId].vehicleNo} approved!`);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-dark-text-secondary">{kpi.name}</p>
              <p className="text-3xl font-bold text-brand-dark dark:text-dark-text mt-1">{kpi.value}</p>
            </div>
            <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-700 ${kpi.color}`}>
              <kpi.icon className="h-6 w-6" />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Approval Requests" className="lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-dark-text-secondary">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Vehicle</th><th scope="col" className="px-6 py-3">Type</th>
                  <th scope="col" className="px-6 py-3">Status</th><th scope="col" className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {approvalRequests.length > 0 ? approvalRequests.map(job => (
                  <tr key={job.id} className="bg-white dark:bg-dark-card border-b dark:border-gray-700 even:bg-gray-50 dark:even:bg-gray-800">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{job.vehicleNo}</td>
                    <td className="px-6 py-4">Discount</td>
                    <td className="px-6 py-4"><span className="px-2 py-1 text-xs font-medium text-amber-800 bg-amber-100 rounded-full dark:bg-amber-900 dark:text-amber-300">Pending</span></td>
                    <td className="px-6 py-4 space-x-2">
                        <button onClick={() => handleApprove(job.id)} className="font-medium text-green-600 hover:underline">Approve</button>
                        <button className="font-medium text-red-600 hover:underline">Reject</button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" className="text-center p-4">No pending approvals.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Expense Category Split">
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Pie data={categorySplitData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name">
                        {categorySplitData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(30,30,30,0.8)', border: 'none', borderRadius: '14px' }} itemStyle={{ color: 'white' }} />
                </PieChart>
            </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Revenue vs Expenses">
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={overviewData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" stroke='gray' />
                <YAxis stroke='gray' />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(30,30,30,0.8)', border: 'none', borderRadius: '14px' }} itemStyle={{ color: 'white' }} />
                <Area type="monotone" dataKey="revenue" stackId="1" stroke="#1E3A8A" fill="#1E3A8A" fillOpacity={0.6} />
                <Area type="monotone" dataKey="expenses" stackId="1" stroke="#D32F2F" fill="#D32F2F" fillOpacity={0.6}/>
            </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};
export default Dashboard;
