import { useState } from 'react';
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Save, Printer, FileText } from "lucide-react";
import Modal from '@/components/ui/Modal';
import useCustomerStore from '@/store/customerStore';

const GenerateInvoiceModal = ({ isOpen, onClose }) => {
    const { customers } = useCustomerStore();
    const [isNewParty, setIsNewParty] = useState(false);
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Generate Invoice" size="lg">
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium">Party</label>
                    <div className="flex items-center space-x-4 mt-1">
                        <button onClick={() => setIsNewParty(false)} className={`px-3 py-1 text-sm rounded-full ${!isNewParty ? 'bg-brand-blue text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Select Existing</button>
                        <button onClick={() => setIsNewParty(true)} className={`px-3 py-1 text-sm rounded-full ${isNewParty ? 'bg-brand-blue text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Add New</button>
                    </div>
                </div>

                {isNewParty ? (
                    <div className="p-4 border rounded-lg dark:border-gray-600">
                        <h4 className="font-semibold mb-2">Add New Party</h4>
                        <p className="text-xs text-gray-500">A full form to add a new customer on the fly will be here.</p>
                    </div>
                ) : (
                    <select className="w-full mt-1 p-2 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-brand-red">
                        <option>Select a customer...</option>
                        {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                     </select>
                )}

                <div>
                    <label className="text-sm font-medium">Payment Options</label>
                    <select className="w-full mt-1 p-2 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-brand-red">
                        <option>Advance Payment</option>
                        <option>Full Payment</option>
                        <option>Partial Payment</option>
                    </select>
                </div>

                <div className="flex justify-end pt-4">
                    <Button>Save & Generate</Button>
                </div>
            </div>
        </Modal>
    );
};

const ChalanStep = () => {
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    return (
        <>
            <GenerateInvoiceModal isOpen={isInvoiceModalOpen} onClose={() => setIsInvoiceModalOpen(false)} />
            <div className="space-y-4 text-brand-dark dark:text-dark-text">
                <h3 className="text-xl font-bold">Chalan</h3>
                <Card>
                    <p className="dark:text-dark-text-secondary">
                        The challan is generated after the JobSheet is finalized. The table of items here is non-editable.
                    </p>
                    <div className="flex flex-wrap gap-4 mt-6">
                        <Button variant="secondary"><Save className="h-4 w-4 mr-2"/> Save Challan</Button>
                        <Button onClick={() => setIsInvoiceModalOpen(true)}><FileText className="h-4 w-4 mr-2"/> Generate Invoice</Button>
                        <Button variant="secondary"><Printer className="h-4 w-4 mr-2"/> Print Challan</Button>
                    </div>
                </Card>
            </div>
        </>
    );
};
export default ChalanStep;
