import { ArrowRight, Building2, Users, User, DollarSign } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

type DealType = "placement" | "t-m" | "outstaff";

interface MoneyFlowDiagramProps {
  dealType: DealType;
  parties: {
    agency: string;
    client: string;
    supplier?: string; // For T&M/outstaff
  };
  amounts?: {
    clientToAgency?: string;
    agencyToSupplier?: string;
    placementFee?: string;
  };
}

export function MoneyFlowDiagram({ dealType, parties, amounts }: MoneyFlowDiagramProps) {
  if (dealType === "placement") {
    return (
      <Card className="p-6 bg-accent">
        <h4 className="m-0 mb-4">Placement Fee Structure</h4>
        
        <div className="flex items-center justify-between gap-4">
          {/* Client */}
          <div className="flex-1">
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
              <Building2 className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="font-medium m-0 mb-1">{parties.client}</p>
              <Badge variant="outline" className="text-xs border-blue-500/30">Client</Badge>
            </div>
          </div>

          {/* Arrow with fee */}
          <div className="flex flex-col items-center">
            <ArrowRight className="w-6 h-6 text-muted-foreground mb-1" />
            {amounts?.placementFee && (
              <Badge className="bg-success text-success-foreground whitespace-nowrap">
                {amounts.placementFee}
              </Badge>
            )}
            <p className="text-xs text-muted-foreground mt-1 m-0">Placement Fee</p>
          </div>

          {/* Agency */}
          <div className="flex-1">
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20 text-center">
              <Users className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <p className="font-medium m-0 mb-1">{parties.agency}</p>
              <Badge variant="outline" className="text-xs border-purple-500/30">Agency</Badge>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-lg bg-muted">
          <p className="text-sm m-0">
            <span className="font-medium">One-time fee:</span> Agency receives placement fee when candidate starts. 
            Guarantee period applies (typically 90 days).
          </p>
        </div>
      </Card>
    );
  }

  // T&M / Outstaff flow
  return (
    <Card className="p-6 bg-accent">
      <h4 className="m-0 mb-4">Time & Materials Flow</h4>
      
      <div className="flex items-center justify-between gap-3">
        {/* Client */}
        <div className="flex-1">
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
            <Building2 className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <p className="font-medium m-0 mb-1 text-sm">{parties.client}</p>
            <Badge variant="outline" className="text-xs border-blue-500/30">Client</Badge>
          </div>
        </div>

        {/* Arrow 1: Client to Agency */}
        <div className="flex flex-col items-center">
          <ArrowRight className="w-5 h-5 text-muted-foreground mb-1" />
          {amounts?.clientToAgency && (
            <Badge className="bg-success text-success-foreground text-xs whitespace-nowrap">
              {amounts.clientToAgency}
            </Badge>
          )}
          <p className="text-xs text-muted-foreground mt-1 m-0">Invoice</p>
        </div>

        {/* Agency */}
        <div className="flex-1">
          <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20 text-center">
            <Users className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <p className="font-medium m-0 mb-1 text-sm">{parties.agency}</p>
            <Badge variant="outline" className="text-xs border-purple-500/30">Agency</Badge>
          </div>
        </div>

        {/* Arrow 2: Agency to Supplier (if exists) */}
        {parties.supplier && (
          <>
            <div className="flex flex-col items-center">
              <ArrowRight className="w-5 h-5 text-muted-foreground mb-1" />
              {amounts?.agencyToSupplier && (
                <Badge className="bg-warning text-warning-foreground text-xs whitespace-nowrap">
                  {amounts.agencyToSupplier}
                </Badge>
              )}
              <p className="text-xs text-muted-foreground mt-1 m-0">Payment</p>
            </div>

            {/* Supplier */}
            <div className="flex-1">
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
                <User className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                <p className="font-medium m-0 mb-1 text-sm">{parties.supplier}</p>
                <Badge variant="outline" className="text-xs border-emerald-500/30">Supplier</Badge>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mt-4 p-3 rounded-lg bg-muted">
        <div className="flex items-start gap-2">
          <DollarSign className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium m-0 mb-1">Recurring Revenue</p>
            <p className="text-xs text-muted-foreground m-0">
              {parties.supplier 
                ? "Freelancer logs time → Agency approves → Client approves → Invoice generated monthly"
                : "Agency employee logs time → Client approves → Invoice generated monthly"
              }
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
