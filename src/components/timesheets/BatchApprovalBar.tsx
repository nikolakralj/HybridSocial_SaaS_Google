import { CheckSquare, X, CheckCircle, XCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface SelectedTimesheet {
  contractorId: string;
  contractorName: string;
  hours: number;
  amount?: number; // Only shown to roles with rate visibility
  status: "draft" | "submitted" | "approved" | "rejected";
}

interface BatchApprovalBarProps {
  selectedTimesheets: SelectedTimesheet[];
  showRates: boolean; // Based on user role
  onApproveAll: () => void;
  onRejectAll: () => void;
  onClearSelection: () => void;
}

export function BatchApprovalBar({
  selectedTimesheets,
  showRates,
  onApproveAll,
  onRejectAll,
  onClearSelection,
}: BatchApprovalBarProps) {
  // Calculate cumulative totals
  const totalHours = selectedTimesheets.reduce((sum, ts) => sum + ts.hours, 0);
  const totalAmount = selectedTimesheets.reduce(
    (sum, ts) => sum + (ts.amount || 0),
    0
  );
  const submittedCount = selectedTimesheets.filter(
    (ts) => ts.status === "submitted"
  ).length;

  if (selectedTimesheets.length === 0) return null;

  return (
    <div className="sticky top-0 z-10 bg-accent-brand border-b border-accent-brand/20 apple-shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Selection info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-white" />
              <span className="font-semibold text-white">
                {selectedTimesheets.length} selected
              </span>
            </div>

            {/* Cumulative totals */}
            <div className="flex items-center gap-4 pl-4 border-l border-white/20">
              <div className="text-white/90">
                <span className="text-sm">Total Hours:</span>
                <span className="ml-2 font-semibold text-white">
                  {totalHours.toFixed(1)}h
                </span>
              </div>

              {showRates && totalAmount > 0 && (
                <div className="text-white/90">
                  <span className="text-sm">Total Amount:</span>
                  <span className="ml-2 font-semibold text-white">
                    ${totalAmount.toLocaleString(undefined, { 
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2 
                    })}
                  </span>
                </div>
              )}

              {submittedCount > 0 && submittedCount < selectedTimesheets.length && (
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {submittedCount} awaiting approval
                </Badge>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={onApproveAll}
              disabled={submittedCount === 0}
              className="gap-2 bg-success hover:bg-success/90 text-white border-success"
            >
              <CheckCircle className="w-4 h-4" />
              Approve {submittedCount > 0 ? `(${submittedCount})` : "All"}
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={onRejectAll}
              disabled={submittedCount === 0}
              className="gap-2 bg-destructive hover:bg-destructive/90 text-white border-destructive"
            >
              <XCircle className="w-4 h-4" />
              Reject {submittedCount > 0 ? `(${submittedCount})` : "All"}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              className="gap-2 text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
              Clear
            </Button>
          </div>
        </div>

        {/* Selected contractors list (collapsed view) */}
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedTimesheets.map((ts) => (
            <Badge 
              key={ts.contractorId} 
              variant="secondary"
              className="bg-white/10 text-white border-white/20"
            >
              {ts.contractorName} ({ts.hours}h
              {showRates && ts.amount && ` • $${ts.amount.toLocaleString()}`})
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
