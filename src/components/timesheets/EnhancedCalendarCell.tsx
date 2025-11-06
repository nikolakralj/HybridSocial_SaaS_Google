import { CheckCircle2, Clock, XCircle, DollarSign, Users } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Badge } from "../ui/badge";

interface ContractorEntry {
  id: string;
  name: string;
  avatar: string;
  hours: number;
  status: "draft" | "submitted" | "approved" | "rejected";
}

interface EnhancedCalendarCellProps {
  date: Date;
  totalHours: number;
  totalCost: number;
  contractors: ContractorEntry[];
  statusBreakdown: {
    approved: number;
    pending: number;
    rejected: number;
    draft: number;
  };
  isToday?: boolean;
  isWeekend?: boolean;
  showContractorAvatars?: boolean;
  onClick?: () => void;
}

export function EnhancedCalendarCell({
  date,
  totalHours,
  totalCost,
  contractors,
  statusBreakdown,
  isToday = false,
  isWeekend = false,
  showContractorAvatars = true,
  onClick,
}: EnhancedCalendarCellProps) {
  const hasEntries = totalHours > 0;

  // Determine primary status
  const getPrimaryStatus = () => {
    if (statusBreakdown.rejected > 0) return "rejected";
    if (statusBreakdown.pending > 0) return "pending";
    if (statusBreakdown.approved > 0) return "approved";
    return "draft";
  };

  const primaryStatus = getPrimaryStatus();

  // Status colors
  const getStatusColor = () => {
    switch (primaryStatus) {
      case "approved":
        return "border-success bg-success/10";
      case "pending":
        return "border-warning bg-warning/10";
      case "rejected":
        return "border-destructive bg-destructive/10";
      default:
        return "";
    }
  };

  const getStatusIcon = () => {
    switch (primaryStatus) {
      case "approved":
        return <CheckCircle2 className="w-3 h-3 text-success" />;
      case "pending":
        return <Clock className="w-3 h-3 text-warning" />;
      case "rejected":
        return <XCircle className="w-3 h-3 text-destructive" />;
      default:
        return null;
    }
  };

  // Unique contractors (avoid duplicates)
  const uniqueContractors = Array.from(
    new Map(contractors.map(c => [c.id, c])).values()
  );

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            disabled={!hasEntries}
            className={`
              aspect-square rounded-lg border-2 p-2 apple-transition w-full
              ${isToday ? 'border-accent-brand bg-accent-brand/5' : 'border-border'}
              ${isWeekend ? 'bg-accent/20' : 'bg-card'}
              ${hasEntries ? 'hover:border-accent-brand hover:apple-shadow-md cursor-pointer' : 'cursor-default'}
              ${hasEntries ? getStatusColor() : ''}
              flex flex-col items-center justify-between
            `}
          >
            {/* Day Number */}
            <div
              className={`
                text-sm font-semibold
                ${isToday ? 'text-accent-brand' : ''}
              `}
            >
              {date.getDate()}
            </div>

            {/* Content */}
            {hasEntries ? (
              <div className="space-y-1.5 w-full">
                {/* Hours */}
                <div className="text-center">
                  <p className="font-semibold text-accent-brand">{totalHours}h</p>
                </div>

                {/* Contractor Avatars */}
                {showContractorAvatars && uniqueContractors.length > 0 && (
                  <div className="flex items-center justify-center gap-0.5">
                    {uniqueContractors.slice(0, 3).map((contractor, idx) => (
                      <div
                        key={idx}
                        className="w-5 h-5 rounded-full bg-accent border border-background flex items-center justify-center text-[8px] font-medium"
                        title={contractor.name}
                      >
                        {contractor.avatar}
                      </div>
                    ))}
                    {uniqueContractors.length > 3 && (
                      <div className="w-5 h-5 rounded-full bg-muted border border-background flex items-center justify-center text-[8px] font-medium">
                        +{uniqueContractors.length - 3}
                      </div>
                    )}
                  </div>
                )}

                {/* Status Icon */}
                <div className="flex items-center justify-center">
                  {getStatusIcon()}
                </div>
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">--</div>
            )}
          </button>
        </TooltipTrigger>

        {hasEntries && (
          <TooltipContent
            side="top"
            className="w-[280px] p-0"
            sideOffset={5}
          >
            <div className="p-4 space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <p className="font-semibold">
                  {date.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <Badge variant="secondary" className="text-xs">
                  {uniqueContractors.length} contractor{uniqueContractors.length !== 1 ? 's' : ''}
                </Badge>
              </div>

              {/* Totals */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-accent-brand" />
                  <div>
                    <p className="text-xs text-muted-foreground">Total Hours</p>
                    <p className="font-semibold">{totalHours}h</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-success" />
                  <div>
                    <p className="text-xs text-muted-foreground">Total Cost</p>
                    <p className="font-semibold">${totalCost.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Status Breakdown */}
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">Status</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {statusBreakdown.approved > 0 && (
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-success" />
                      <span>{statusBreakdown.approved} approved</span>
                    </div>
                  )}
                  {statusBreakdown.pending > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-warning" />
                      <span>{statusBreakdown.pending} pending</span>
                    </div>
                  )}
                  {statusBreakdown.rejected > 0 && (
                    <div className="flex items-center gap-1.5">
                      <XCircle className="w-3 h-3 text-destructive" />
                      <span>{statusBreakdown.rejected} rejected</span>
                    </div>
                  )}
                  {statusBreakdown.draft > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span>{statusBreakdown.draft} draft</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Contractors List */}
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">Contributors</p>
                <div className="space-y-1.5">
                  {uniqueContractors.slice(0, 4).map((contractor) => (
                    <div
                      key={contractor.id}
                      className="flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-accent-brand/10 flex items-center justify-center text-[8px] font-medium text-accent-brand">
                          {contractor.avatar}
                        </div>
                        <span>{contractor.name}</span>
                      </div>
                      <span className="font-mono font-medium text-accent-brand">
                        {contractor.hours}h
                      </span>
                    </div>
                  ))}
                  {uniqueContractors.length > 4 && (
                    <p className="text-xs text-muted-foreground italic">
                      +{uniqueContractors.length - 4} more...
                    </p>
                  )}
                </div>
              </div>

              {/* Click to view hint */}
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground italic text-center">
                  Click to view details
                </p>
              </div>
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
