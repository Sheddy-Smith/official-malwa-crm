import Card from "@/components/ui/Card";

const LedgerTab = () => (
    <Card>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold dark:text-dark-text">Customer Ledger</h3>
            <input type="search" placeholder="Search by Customer/Vehicle..." className="p-2 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-brand-red"/>
        </div>
        <p className="dark:text-dark-text-secondary text-sm">This table will automatically update after an Estimate, JobSheet, Challan, or Invoice is created, showing Date, Document Type, Number, Amount, Discount, and Payment Status.</p>
    </Card>
);
export default LedgerTab;
