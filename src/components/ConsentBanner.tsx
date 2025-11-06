import { AlertCircle, CheckCircle2, Clock, XCircle, FileText, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface ConsentBannerProps {
  type: "request" | "approved" | "declined" | "expired";
  candidateName: string;
  clientName?: string;
  jobTitle?: string;
  expiryDate?: string;
  onRequestConsent?: () => void;
  onShareMaskedCV?: () => void;
  onDismiss?: () => void;
}

export function ConsentBanner({
  type,
  candidateName,
  clientName,
  jobTitle,
  expiryDate,
  onRequestConsent,
  onShareMaskedCV,
  onDismiss,
}: ConsentBannerProps) {
  
  // Request consent (agency wants to share candidate with client)
  if (type === "request") {
    return (
      <div className="p-4 rounded-xl border-2 border-accent-brand/20 bg-accent-brand/5">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-accent-brand/10 flex-shrink-0">
            <Send className="w-5 h-5 text-accent-brand" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="m-0 mb-1">Share {candidateName} with {clientName}?</h4>
            <p className="text-sm text-muted-foreground m-0 mb-3">
              {jobTitle 
                ? `For the "${jobTitle}" position. The candidate will approve before details are revealed.`
                : "The candidate will approve before details are revealed."
              }
            </p>
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                className="bg-accent-brand hover:bg-accent-brand-hover gap-2 min-h-[44px]"
                onClick={onRequestConsent}
              >
                <Send className="w-4 h-4" />
                Request Consent
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 min-h-[44px]"
                onClick={onShareMaskedCV}
              >
                <FileText className="w-4 h-4" />
                Share Masked CV
              </Button>
              {onDismiss && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="min-h-[44px]"
                  onClick={onDismiss}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Consent approved
  if (type === "approved") {
    return (
      <div className="p-4 rounded-xl border border-success/20 bg-success/5">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-success/10 flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-success" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-1">
              <h4 className="m-0">Consent Approved</h4>
              <Badge className="bg-success text-success-foreground flex-shrink-0">
                Active
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground m-0">
              {candidateName} approved sharing their profile with {clientName}
              {jobTitle && ` for the "${jobTitle}" position`}.
            </p>
            {expiryDate && (
              <p className="text-xs text-muted-foreground mt-2 m-0">
                Consent expires {expiryDate}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Consent declined
  if (type === "declined") {
    return (
      <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-destructive/10 flex-shrink-0">
            <XCircle className="w-5 h-5 text-destructive" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-1">
              <h4 className="m-0">Consent Declined</h4>
              <Badge variant="destructive" className="flex-shrink-0">
                Declined
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground m-0">
              {candidateName} declined to share their profile with {clientName}
              {jobTitle && ` for the "${jobTitle}" position`}.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3 gap-2 min-h-[44px]"
              onClick={onShareMaskedCV}
            >
              <FileText className="w-4 h-4" />
              Share Masked CV Instead
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Consent expired
  if (type === "expired") {
    return (
      <div className="p-4 rounded-xl border border-warning/20 bg-warning/5">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-warning/10 flex-shrink-0">
            <Clock className="w-5 h-5 text-warning" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-1">
              <h4 className="m-0">Consent Expired</h4>
              <Badge variant="outline" className="border-warning text-warning flex-shrink-0">
                Expired
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground m-0 mb-3">
              Consent to share {candidateName}'s profile expired on {expiryDate}.
            </p>
            <Button 
              size="sm" 
              className="bg-accent-brand hover:bg-accent-brand-hover gap-2 min-h-[44px]"
              onClick={onRequestConsent}
            >
              <Send className="w-4 h-4" />
              Request New Consent
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
