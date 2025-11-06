// Phase 5 Day 1-2: Policy Version Badge
// Shows "Pinned to vN" badge on timesheets

import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Pin, AlertCircle, CheckCircle } from 'lucide-react';

export interface PolicyVersionBadgeProps {
  version: number;
  versionName?: string;
  isCurrentVersion: boolean;
  onClick?: () => void;
  showRebindHint?: boolean;
  className?: string;
}

export function PolicyVersionBadge({
  version,
  versionName,
  isCurrentVersion,
  onClick,
  showRebindHint = false,
  className,
}: PolicyVersionBadgeProps) {
  const badgeVariant = isCurrentVersion ? 'default' : 'secondary';
  const badgeText = `v${version}`;
  
  const tooltipContent = isCurrentVersion
    ? `Current active version (v${version})${versionName ? `: ${versionName}` : ''}`
    : `Pinned to v${version}${versionName ? `: ${versionName}` : ''}. ${showRebindHint ? 'Click to rebind to current version.' : ''}`;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant={badgeVariant}
            className={`
              cursor-pointer transition-all hover:scale-105
              ${isCurrentVersion ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-600 hover:bg-yellow-700'}
              ${className}
            `}
            onClick={onClick}
          >
            <Pin className="w-3 h-3 mr-1" />
            {badgeText}
            {!isCurrentVersion && showRebindHint && (
              <AlertCircle className="w-3 h-3 ml-1" />
            )}
            {isCurrentVersion && (
              <CheckCircle className="w-3 h-3 ml-1" />
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Compact version badge for table rows
 */
export function CompactPolicyVersionBadge({
  version,
  isCurrentVersion,
  onClick,
}: {
  version: number;
  isCurrentVersion: boolean;
  onClick?: () => void;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={`
              inline-flex items-center px-2 py-0.5 rounded text-xs font-medium cursor-pointer
              ${isCurrentVersion ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
            `}
            onClick={onClick}
          >
            v{version}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isCurrentVersion ? 'Current version' : `Pinned to v${version}`}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Policy version status indicator
 */
export function PolicyVersionStatus({
  isActive,
  isPublished,
}: {
  isActive: boolean;
  isPublished: boolean;
}) {
  if (isActive) {
    return (
      <Badge variant="default" className="bg-green-600">
        <CheckCircle className="w-3 h-3 mr-1" />
        Active
      </Badge>
    );
  }

  if (isPublished) {
    return (
      <Badge variant="secondary">
        Published
      </Badge>
    );
  }

  return (
    <Badge variant="outline">
      Draft
    </Badge>
  );
}
