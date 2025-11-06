import { useState } from "react";
import { DollarSign, Download, Send, Eye, FileText, Calendar } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner@2.0.3";

type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

interface InvoiceLineItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  from: {
    name: string;
    address?: string;
    email?: string;
  };
  to: {
    name: string;
    address?: string;
    email?: string;
  };
  issueDate: string;
  dueDate: string;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  tax?: number;
  total: number;
  status: InvoiceStatus;
  notes?: string;
  contractReference?: string;
  assignmentReference?: string;
  timesheetReference?: string;
}

interface InvoiceGenerationProps {
  invoice?: Invoice;
  onGenerate?: (invoice: Invoice) => void;
  onSend?: (invoice: Invoice) => void;
}

export function InvoiceGeneration({ invoice, onGenerate, onSend }: InvoiceGenerationProps) {
  const [isEditing, setIsEditing] = useState(!invoice);

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      case "sent":
        return <Badge className="bg-blue-500">Sent</Badge>;
      case "paid":
        return <Badge className="bg-success">Paid</Badge>;
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>;
      case "cancelled":
        return <Badge variant="outline">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleSend = () => {
    toast.success("Invoice sent to client");
  };

  const handleDownload = () => {
    toast.success("Invoice downloaded");
  };

  if (!invoice) {
    return (
      <Card className="p-6">
        <h3 className="m-0 mb-4">Generate Invoice</h3>
        <p className="text-sm text-muted-foreground m-0 mb-6">
          No invoice data available. Create a timesheet first.
        </p>
        <Button variant="outline" disabled>Generate Invoice</Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="m-0 mb-1">Invoice</h3>
          <p className="text-sm text-muted-foreground m-0">{invoice.invoiceNumber}</p>
        </div>
        {getStatusBadge(invoice.status)}
      </div>

      {/* Invoice Preview */}
      <Card className="p-8 border-2">
        {/* Invoice Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="m-0 mb-2">INVOICE</h2>
            <p className="text-sm text-muted-foreground m-0">{invoice.invoiceNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-sm m-0">Issue Date: {invoice.issueDate}</p>
            <p className="text-sm m-0">Due Date: {invoice.dueDate}</p>
          </div>
        </div>

        <Separator className="my-6" />

        {/* From/To */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <Label className="text-xs text-muted-foreground">FROM</Label>
            <p className="font-medium m-0 mt-1">{invoice.from.name}</p>
            {invoice.from.address && (
              <p className="text-sm text-muted-foreground m-0">{invoice.from.address}</p>
            )}
            {invoice.from.email && (
              <p className="text-sm text-muted-foreground m-0">{invoice.from.email}</p>
            )}
          </div>
          
          <div>
            <Label className="text-xs text-muted-foreground">TO</Label>
            <p className="font-medium m-0 mt-1">{invoice.to.name}</p>
            {invoice.to.address && (
              <p className="text-sm text-muted-foreground m-0">{invoice.to.address}</p>
            )}
            {invoice.to.email && (
              <p className="text-sm text-muted-foreground m-0">{invoice.to.email}</p>
            )}
          </div>
        </div>

        {/* Line Items */}
        <div className="mb-8">
          <div className="bg-accent p-3 rounded-t-lg grid grid-cols-12 gap-4 font-medium text-sm">
            <div className="col-span-5">Description</div>
            <div className="col-span-2 text-right">Quantity</div>
            <div className="col-span-2 text-right">Rate</div>
            <div className="col-span-3 text-right">Amount</div>
          </div>
          
          {invoice.lineItems.map((item, idx) => (
            <div key={idx} className="p-3 border-l border-r border-b grid grid-cols-12 gap-4 text-sm">
              <div className="col-span-5">{item.description}</div>
              <div className="col-span-2 text-right">{item.quantity}</div>
              <div className="col-span-2 text-right">${item.rate.toFixed(2)}</div>
              <div className="col-span-3 text-right font-medium">${item.amount.toFixed(2)}</div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-full md:w-1/2 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>${invoice.subtotal.toFixed(2)}</span>
            </div>
            {invoice.tax && invoice.tax > 0 && (
              <div className="flex justify-between text-sm">
                <span>Tax:</span>
                <span>${invoice.tax.toFixed(2)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between items-center">
              <span className="font-medium">Total:</span>
              <span className="text-2xl font-semibold text-accent-brand">
                ${invoice.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* References */}
        {(invoice.contractReference || invoice.assignmentReference || invoice.timesheetReference) && (
          <Card className="p-4 bg-muted">
            <p className="text-xs text-muted-foreground m-0 mb-2">REFERENCES</p>
            <div className="space-y-1 text-sm">
              {invoice.contractReference && (
                <p className="m-0">Contract: {invoice.contractReference}</p>
              )}
              {invoice.assignmentReference && (
                <p className="m-0">Assignment: {invoice.assignmentReference}</p>
              )}
              {invoice.timesheetReference && (
                <p className="m-0">Timesheet: {invoice.timesheetReference}</p>
              )}
            </div>
          </Card>
        )}

        {/* Notes */}
        {invoice.notes && (
          <div className="mt-6">
            <Label className="text-xs text-muted-foreground">NOTES</Label>
            <p className="text-sm m-0 mt-1">{invoice.notes}</p>
          </div>
        )}
      </Card>

      {/* Actions */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          {invoice.status === "draft" && (
            <Button onClick={handleSend}>
              <Send className="w-4 h-4 mr-2" />
              Send to Client
            </Button>
          )}
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
      </Card>
    </div>
  );
}

// Example Invoice
export function InvoiceGenerationExample() {
  const sampleInvoice: Invoice = {
    id: "inv-001",
    invoiceNumber: "INV-2025-001",
    from: {
      name: "Elite Recruiters",
      address: "123 Agency St, San Francisco, CA 94105",
      email: "billing@eliterecruiters.com"
    },
    to: {
      name: "TechVentures Inc",
      address: "456 Tech Blvd, San Francisco, CA 94107",
      email: "ap@techventures.com"
    },
    issueDate: "Oct 26, 2025",
    dueDate: "Nov 9, 2025",
    lineItems: [
      {
        description: "Sarah Chen - Senior Full-Stack Developer (Week of Oct 21-25, 2025)",
        quantity: 40,
        rate: 100,
        amount: 4000
      }
    ],
    subtotal: 4000,
    tax: 0,
    total: 4000,
    status: "draft",
    notes: "Payment terms: Net 15 days. Please reference invoice number on payment.",
    contractReference: "SOW-2025-001",
    assignmentReference: "A-001",
    timesheetReference: "TS-001"
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <InvoiceGeneration invoice={sampleInvoice} />
    </div>
  );
}

// Invoice List Component
interface InvoiceListProps {
  invoices: Invoice[];
  onSelectInvoice?: (invoice: Invoice) => void;
}

export function InvoiceList({ invoices, onSelectInvoice }: InvoiceListProps) {
  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      case "sent":
        return <Badge className="bg-blue-500">Sent</Badge>;
      case "paid":
        return <Badge className="bg-success">Paid</Badge>;
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>;
      case "cancelled":
        return <Badge variant="outline">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-3">
      {invoices.map(invoice => (
        <Card 
          key={invoice.id} 
          className="p-4 hover:bg-accent/50 transition-colors cursor-pointer"
          onClick={() => onSelectInvoice?.(invoice)}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-muted-foreground" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium m-0">{invoice.invoiceNumber}</p>
                  {getStatusBadge(invoice.status)}
                </div>
                
                <p className="text-sm text-muted-foreground m-0 mb-2">
                  {invoice.to.name}
                </p>
                
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>Issued: {invoice.issueDate}</span>
                  <span>Due: {invoice.dueDate}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-xl font-semibold m-0">${invoice.total.toFixed(2)}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
