import { Badge } from "./ui/badge";
import { Lock, Users, Building2 } from "lucide-react";

export type VisibilityScope = "participants" | "team" | "agency-wide";

interface VisibilityScopeBadgeProps {
  scope: VisibilityScope;
  teamName?: string;
  className?: string;
}

const scopeConfig = {
  participants: {
    label: "Participants only",
    description: "Only people listed on this deal can see it",
    icon: Lock,
    color: "border-purple-500 text-purple-500 bg-purple-500/5"
  },
  team: {
    label: "Team",
    description: "Visible to a named team inside the agency",
    icon: Users,
    color: "border-blue-500 text-blue-500 bg-blue-500/5"
  },
  "agency-wide": {
    label: "Agency-wide",
    description: "All agency members can see this",
    icon: Building2,
    color: "border-warning text-warning bg-warning/5"
  }
};

export function VisibilityScopeBadge({ scope, teamName, className }: VisibilityScopeBadgeProps) {
  const config = scopeConfig[scope];
  const Icon = config.icon;
  
  const displayLabel = scope === "team" && teamName 
    ? `Team: ${teamName}` 
    : config.label;
  
  return (
    <Badge 
      variant="outline" 
      className={`gap-1.5 ${config.color} ${className || ""}`}
    >
      <Icon className="w-3 h-3" />
      {displayLabel}
    </Badge>
  );
}

export function getScopeDescription(scope: VisibilityScope): string {
  return scopeConfig[scope].description;
}
