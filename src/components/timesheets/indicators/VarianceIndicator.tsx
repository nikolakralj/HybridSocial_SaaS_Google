import { AlertTriangle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";

interface VarianceIndicatorProps {
  hasVariance: boolean;
  details?: {
    personName: string;
    hours: number;
  }[];
  size?: 'sm' | 'md' | 'lg';
}

export function VarianceIndicator({ 
  hasVariance, 
  details,
  size = 'md' 
}: VarianceIndicatorProps) {
  if (!hasVariance) return null;

  const sizeClasses = {
    sm: 'w-3 h-3 text-[10px]',
    md: 'w-4 h-4 text-xs',
    lg: 'w-5 h-5 text-sm',
  };

  const iconSizes = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  };

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`
              ${sizeClasses[size]}
              rounded-full bg-warning/20 border border-warning/40
              flex items-center justify-center
              text-warning font-bold
              cursor-help
              apple-transition
              hover:bg-warning/30 hover:border-warning/60
            `}
            aria-label="Hours vary across people"
          >
            ≠
          </div>
        </TooltipTrigger>
        {details && details.length > 0 && (
          <TooltipContent side="top" className="max-w-[200px]">
            <div className="space-y-2">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <AlertTriangle className={iconSizes[size]} />
                <p className="font-medium text-xs">Hours Vary</p>
              </div>
              <div className="space-y-1">
                {details.map((person, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{person.personName}:</span>
                    <span className="font-mono font-semibold">{person.hours}h</span>
                  </div>
                ))}
              </div>
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Calculate if there's variance in hours across people
 */
export function hasHoursVariance(hours: number[]): boolean {
  if (hours.length <= 1) return false;
  
  const first = hours[0];
  return hours.some(h => h !== first);
}

/**
 * Get variance details for display
 */
export function getVarianceDetails(
  entries: Array<{ personName: string; hours: number }>
): { hasVariance: boolean; details: Array<{ personName: string; hours: number }> } {
  const hours = entries.map(e => e.hours);
  const hasVariance = hasHoursVariance(hours);
  
  return {
    hasVariance,
    details: hasVariance ? entries : [],
  };
}
