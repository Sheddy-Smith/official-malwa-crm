import Card from "@/components/ui/Card";
import PageHeader from "@/components/PageHeader";
import { Truck, Users, Package, Wrench, BarChart as BarChartIcon, TrendingDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const kpiData = [
    { title: "Total Expenses", value: "₹2,50,000", icon: TrendingDown, color: "text-red-500" },
    { title: "Total Vendors", value: "15", icon: Users, color: "text-blue-500" },
    { title: "Total Labour", value: "25", icon: Wrench, color: "text-green-500" },
    { title: "Total Parts Used", value: "120", icon: Package, color: "text-amber-500" },
    { title: "Total Stock Value", value: "₹5,80,000", icon: BarChartIcon, color: "text-indigo-500" },
    { title: "Total Work Done", value: "88 Jobs", icon: Truck, color: "text-gray-500" },
];

const profitLossData = [
    { name: 'Jan', profit: 1500 }, { name: 'Feb', profit: 2200 }, { name: 'Mar', profit: -500 },
    { name: 'Apr', profit: 3000 }, { name: 'May', profit: 1800 }, { name: 'Jun', profit: 4200 },
]

const Summary = () => {
    return (
        <div className="space-y-6">
            <PageHeader title="Summary Dashboard" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {kpiData.map(item => (
                    <Card key={item.title}>
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-500 dark:text-dark-text-secondary">{item.title}</p>
                            <item.icon className={`h-6 w-6 ${item.color}`} />
                        </div>
                        <p className="mt-2 text-3xl font-bold text-brand-dark dark:text-dark-text">{item.value}</p>
                    </Card>
                ))}
            </div>
            <Card>
                <h3 className="text-lg font-bold dark:text-dark-text mb-4">Profit / Loss Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={profitLossData}>
                        <XAxis dataKey="name" stroke="gray" />
                        <YAxis stroke="gray" />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(30,30,30,0.8)', border: 'none', borderRadius: '14px' }} itemStyle={{ color: 'white' }} />
                        <Bar dataKey="profit" name="Profit/Loss">
                            {profitLossData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.profit >= 0 ? '#22c55e' : '#ef4444'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
};
export default Summary;
