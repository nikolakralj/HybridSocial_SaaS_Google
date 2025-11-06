import { HelpCircle, Check } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Badge } from "./ui/badge";

interface MatchExplainerTooltipProps {
  matchPercentage: number;
  matchReasons: {
    label: string;
    matched: boolean;
  }[];
}

export function MatchExplainerTooltip({ matchPercentage, matchReasons }: MatchExplainerTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="inline-flex items-center gap-1 px-2 py-1 rounded bg-accent-brand/10 text-accent-brand hover:bg-accent-brand/20 transition-colors border-0">
            <span className="text-xs font-medium">{matchPercentage}% match</span>
            <HelpCircle className="w-3 h-3" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs p-4">
          <div className="space-y-3">
            <div>
              <p className="font-medium mb-1 m-0">{matchPercentage}% Match</p>
              <p className="text-xs text-muted-foreground m-0">
                Based on your requirements and their profile
              </p>
            </div>
            
            <div className="space-y-2">
              {matchReasons.map((reason, index) => (
                <div key={index} className="flex items-start gap-2">
                  {reason.matched ? (
                    <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                  ) : (
                    <div className="w-4 h-4 flex-shrink-0 mt-0.5">
                      <div className="w-3 h-3 rounded-full border-2 border-muted" />
                    </div>
                  )}
                  <span className={`text-xs ${reason.matched ? "text-foreground" : "text-muted-foreground"}`}>
                    {reason.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
