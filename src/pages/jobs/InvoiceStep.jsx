import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Share2, Printer, Mail } from "lucide-react";
const InvoiceStep = () => <div><h3 className="text-xl font-bold text-brand-dark dark:text-dark-text mb-4">Invoice</h3><Card><p className="dark:text-dark-text-secondary">Final invoice screen. It reflects all final changes from the Estimate and JobSheet. From here you can print or email the invoice to the customer.</p><div className="flex space-x-2 mt-4"><Button><Printer className="h-4 w-4 mr-2"/> Print Invoice</Button><Button variant="secondary"><Mail className="h-4 w-4 mr-2"/> Email</Button></div></Card></div>;
export default InvoiceStep;
