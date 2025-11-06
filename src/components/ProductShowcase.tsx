import { FileText, Clock, DollarSign, Users, TrendingUp, CheckCircle } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

export function ProductShowcase() {
  return (
    <section className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header with Process Diagram */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h2 className="m-0 mb-4">Everything you need to run your work</h2>
          <p className="text-lg text-muted-foreground m-0 mb-8">
            One platform for the complete workflow
          </p>
          
          {/* Mini process diagram */}
          <div className="flex items-center justify-center gap-2 flex-wrap text-sm">
            {["Post", "Interview", "Offer", "Contract", "Time", "Invoice"].map((step, i, arr) => (
              <div key={step} className="flex items-center gap-2">
                <div className="px-3 py-1 rounded-full bg-accent-brand/10 text-accent-brand font-medium">
                  {step}
                </div>
                {i < arr.length - 1 && <span className="text-accent-brand">→</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-32">
        {/* Recruit & Deals */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 order-2 lg:order-1">
            <Badge className="bg-accent-brand/10 text-accent-brand">Recruit & Deals</Badge>
            <h2 className="m-0">From job post to signed contract</h2>
            <p className="text-lg text-muted-foreground m-0">
              Manage your entire recruitment pipeline in one place. Create jobs, 
              agencies submit candidates, interview, make offers, and generate contracts—all 
              tracked in deal rooms with full timeline visibility.
            </p>
            
            <div className="space-y-4">
              {[
                "Create job postings with one click",
                "Agency submissions with consent tracking",
                "Interview scheduling and feedback",
                "Automated contract generation"
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                  <p className="m-0">{feature}</p>
                </div>
              ))}
            </div>
          </div>

          <Card className="p-8 order-1 lg:order-2">
            <div className="space-y-4">
              {/* Storyboard */}
              {[
                { label: "Create Job", icon: FileText, status: "complete" },
                { label: "Agency Submits", icon: Users, status: "complete" },
                { label: "Interview", icon: MessageCircle, status: "complete" },
                { label: "Offer", icon: TrendingUp, status: "active" },
                { label: "Contract", icon: FileText, status: "pending" }
              ].map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.label} className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        step.status === "complete"
                          ? "bg-success/10 text-success"
                          : step.status === "active"
                          ? "bg-accent-brand/10 text-accent-brand"
                          : "bg-accent"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium m-0">{step.label}</p>
                    </div>
                    {step.status === "complete" && (
                      <CheckCircle className="w-5 h-5 text-success" />
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Worker Records & Time */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <Card className="p-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                <div>
                  <p className="font-medium m-0">Sarah Chen</p>
                  <p className="text-sm text-muted-foreground m-0">Senior Developer</p>
                </div>
                <Badge className="bg-success">Active</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-accent rounded-lg">
                  <p className="text-sm text-muted-foreground m-0 mb-1">Cost Rate</p>
                  <p className="text-xl font-semibold m-0">$75/hr</p>
                </div>
                <div className="p-4 bg-accent rounded-lg">
                  <p className="text-sm text-muted-foreground m-0 mb-1">Bill Rate</p>
                  <p className="text-xl font-semibold m-0">$100/hr</p>
                </div>
              </div>

              <div className="p-4 bg-accent-brand/5 border border-accent-brand/20 rounded-lg">
                <p className="text-sm m-0">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Approval chain: Manager → Finance
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Contract</span>
                  <span className="font-medium">SOW-2025-001</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Allocation</span>
                  <span className="font-medium">100% (40h/week)</span>
                </div>
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <Badge className="bg-emerald-500/10 text-emerald-500">Worker Records & Time</Badge>
            <h2 className="m-0">Manage your team and track time</h2>
            <p className="text-lg text-muted-foreground m-0">
              Create worker records with detailed employment info, rates, and contracts. 
              Track time with approval chains, and maintain full visibility into who's working 
              on what.
            </p>
            
            <div className="space-y-4">
              {[
                "Claimed/unclaimed worker records with two-way linking",
                "Cost and bill rates with margin tracking",
                "Timesheet approval chains (Manager → Finance)",
                "Contract and assignment references"
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                  <p className="m-0">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Invoices & Finance */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 order-2 lg:order-1">
            <Badge className="bg-purple-500/10 text-purple-500">Invoices & Finance</Badge>
            <h2 className="m-0">From approved hours to invoice</h2>
            <p className="text-lg text-muted-foreground m-0">
              Automate your billing process. Approved timesheets automatically generate invoices 
              with contract references, making it easy to get paid and track revenue.
            </p>
            
            <div className="space-y-4">
              {[
                "Automated invoice generation from timesheets",
                "Contract and assignment references",
                "Multi-party invoicing (Agency ↔ Client ↔ Worker)",
                "Payment tracking and revenue analytics"
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                  <p className="m-0">{feature}</p>
                </div>
              ))}
            </div>
          </div>

          <Card className="p-8 order-1 lg:order-2">
            {/* Money flow diagram */}
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                <span className="font-medium">Approved Hours</span>
                <span className="text-2xl font-semibold">40h</span>
              </div>

              <div className="flex items-center justify-center">
                <div className="text-4xl text-accent-brand">↓</div>
              </div>

              <div className="p-4 bg-accent-brand/5 border border-accent-brand/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Bill Rate</span>
                  <span className="font-medium">$100/hr</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Invoice Total</span>
                  <span className="text-2xl font-semibold text-accent-brand">$4,000</span>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="text-4xl text-accent-brand">↓</div>
              </div>

              <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Status</span>
                  <Badge className="bg-success">Sent to Client</Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>
        </div>
      </div>
    </section>
  );
}

function MessageCircle({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2C5.58172 2 2 5.58172 2 10C2 11.3132 2.34771 12.5525 2.95939 13.6269L2 18L6.37309 17.0406C7.44754 17.6523 8.68678 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  );
}
