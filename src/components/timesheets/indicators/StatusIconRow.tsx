import { CheckCircle2, Clock, XCircle, Circle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";

export type EntryStatus = "draft" | "submitted" | "approved" | "rejected" | "pending";

interface StatusIcon {
  personId: string;
  personName: string;
  status: EntryStatus;
  hours?: number;
}

interface StatusIconRowProps {
  icons?: StatusIcon[];
  entry?: any; // For backwards compatibility with table view
  maxVisible?: number;
  size?: 'sm' | 'md';
  showTooltip?: boolean;
}

export function StatusIconRow({
  icons,
  entry,
  maxVisible = 5,
  size = 'sm',
  showTooltip = true,
}: StatusIconRowProps) {
  // Handle entry prop from table view (convert to icons format)
  let statusIcons: StatusIcon[] = [];
  
  if (icons) {
    statusIcons = icons;
  } else if (entry?.entries) {
    // Convert entry to icons format for table view
    statusIcons = entry.entries.map((e: any, idx: number) => ({
      personId: `entry-${idx}`,
      personName: e.category || 'Task',
      status: e.status || 'draft',
      hours: e.hours,
    }));
  }
  
  if (!statusIcons || statusIcons.length === 0) return null;

  const visibleIcons = statusIcons.slice(0, maxVisible);
  const hiddenCount = Math.max(0, statusIcons.length - maxVisible);

  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

  return (
    <div className="flex items-center gap-0.5">
      {visibleIcons.map((icon, idx) => (
        <StatusIcon
          key={`status-${icon.personId}-${icon.status}-${icon.hours}-${idx}`}
          status={icon.status}
          personName={icon.personName}
          hours={icon.hours}
          size={iconSize}
          showTooltip={showTooltip}
        />
      ))}
      {hiddenCount > 0 && (
        <span className="text-[10px] text-muted-foreground ml-0.5">
          +{hiddenCount}
        </span>
      )}
    </div>
  );
}

interface StatusIconProps {
  status: EntryStatus;
  personName: string;
  hours?: number;
  size: string;
  showTooltip: boolean;
}

function StatusIcon({ status, personName, hours, size, showTooltip }: StatusIconProps) {
  const icon = getStatusIcon(status, size);

  if (!showTooltip) {
    return <div className="flex items-center">{icon}</div>;
  }

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center cursor-help">
            {icon}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          <div className="space-y-1">
            <p className="font-medium">{personName}</p>
            {hours !== undefined && (
              <p className="text-muted-foreground">
                {hours}h • {getStatusLabel(status)}
              </p>
            )}
            {hours === undefined && (
              <p className="text-muted-foreground">{getStatusLabel(status)}</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function getStatusIcon(status: EntryStatus, sizeClass: string) {
  switch (status) {
    case "approved":
      return <CheckCircle2 className={`${sizeClass} text-success`} />;
    case "submitted":
    case "pending":
      return <Clock className={`${sizeClass} text-warning`} />;
    case "rejected":
      return <XCircle className={`${sizeClass} text-destructive`} />;
    case "draft":
      return <Circle className={`${sizeClass} text-muted-foreground`} />;
  }
}

function getStatusLabel(status: EntryStatus): string {
  switch (status) {
    case "approved":
      return "Approved";
    case "submitted":
    case "pending":
      return "Pending";
    case "rejected":
      return "Rejected";
    case "draft":
      return "Draft";
  }
}

/**
 * Calculate aggregate status from multiple entries
 */
export function getAggregateStatus(statuses: EntryStatus[]): 'approved' | 'pending' | 'rejected' | 'mixed' | 'draft' {
  if (statuses.length === 0) return 'draft';

  const uniqueStatuses = new Set(statuses);
  
  // All same status
  if (uniqueStatuses.size === 1) {
    const status = statuses[0];
    if (status === 'submitted') return 'pending';
    return status as any;
  }

  // Mixed statuses
  if (uniqueStatuses.has('rejected')) return 'rejected';
  if (uniqueStatuses.has('submitted')) return 'pending';
  return 'mixed';
}

/**
 * Get border color for aggregate status
 */
export function getStatusBorderColor(status: 'approved' | 'pending' | 'rejected' | 'mixed' | 'draft'): string {
  switch (status) {
    case 'approved':
      return 'border-success';
    case 'pending':
      return 'border-warning';
    case 'rejected':
      return 'border-destructive';
    case 'mixed':
      return 'border-muted';
    case 'draft':
      return 'border-border';
  }
}
