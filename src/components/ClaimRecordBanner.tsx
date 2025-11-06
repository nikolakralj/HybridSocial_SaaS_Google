import { AlertCircle, Check, X } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface ClaimRecordBannerProps {
  companyName: string;
  recordData: {
    title: string;
    startDate: string;
    email: string;
  };
  onClaim?: () => void;
  onDismiss?: () => void;
}

export function ClaimRecordBanner({
  companyName,
  recordData,
  onClaim,
  onDismiss,
}: ClaimRecordBannerProps) {
  return (
    <div className="bg-accent-brand/5 border-2 border-accent-brand rounded-xl p-6 mb-6">
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg bg-accent-brand/10">
          <AlertCircle className="w-5 h-5 text-accent-brand" />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="m-0">Worker Record Created</h3>
            <Badge variant="outline" className="border-accent-brand text-accent-brand">
              Unclaimed
            </Badge>
          </div>

          <p className="text-muted-foreground mb-4">
            <strong>{companyName}</strong> has created a Worker Record for you.
            Claim it to review your data and link it to your Personal Profile.
          </p>

          <div className="bg-card rounded-lg p-4 mb-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Title:</span>
              <span className="font-medium">{recordData.title}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Start Date:</span>
              <span className="font-medium">{recordData.startDate}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Work Email:</span>
              <span className="font-medium">{recordData.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={onClaim}
              className="bg-accent-brand hover:bg-accent-brand-hover gap-2"
            >
              <Check className="w-4 h-4" />
              Claim & Create My Profile
            </Button>
            <Button variant="outline" onClick={onClaim}>
              Use Privately (No Public Profile)
            </Button>
            <Button variant="ghost" size="sm" onClick={onDismiss}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-3">
            Your Worker Record is private to {companyName}. It helps with
            contracts, approvals, and payroll. You can claim it now or later.
          </p>
        </div>
      </div>
    </div>
  );
}
