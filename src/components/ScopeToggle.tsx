import { User, Users, Building2 } from "lucide-react";
import { Badge } from "./ui/badge";

export type ScopeFilter = "my" | "team" | "agency";

interface ScopeToggleProps {
  value: ScopeFilter;
  onChange: (value: ScopeFilter) => void;
  counts?: {
    my: number;
    team: number;
    agency: number;
  };
  className?: string;
}

export function ScopeToggle({ value, onChange, counts, className = "" }: ScopeToggleProps) {
  return (
    <div className={`inline-flex rounded-lg bg-accent p-1 ${className}`}>
      <button
        onClick={() => onChange("my")}
        className={`
          inline-flex items-center gap-2 px-3 py-1.5 rounded-md transition-all text-sm font-medium
          ${value === "my" 
            ? "bg-accent-brand text-white shadow-sm" 
            : "text-muted-foreground hover:text-foreground"
          }
        `}
      >
        <User className="w-4 h-4" />
        My
        {counts && (
          <Badge 
            variant={value === "my" ? "secondary" : "outline"} 
            className={`ml-1 ${value === "my" ? "bg-white/20 text-white border-0" : ""}`}
          >
            {counts.my}
          </Badge>
        )}
      </button>

      <button
        onClick={() => onChange("team")}
        className={`
          inline-flex items-center gap-2 px-3 py-1.5 rounded-md transition-all text-sm font-medium
          ${value === "team" 
            ? "bg-accent-brand text-white shadow-sm" 
            : "text-muted-foreground hover:text-foreground"
          }
        `}
      >
        <Users className="w-4 h-4" />
        Team
        {counts && (
          <Badge 
            variant={value === "team" ? "secondary" : "outline"}
            className={`ml-1 ${value === "team" ? "bg-white/20 text-white border-0" : ""}`}
          >
            {counts.team}
          </Badge>
        )}
      </button>

      <button
        onClick={() => onChange("agency")}
        className={`
          inline-flex items-center gap-2 px-3 py-1.5 rounded-md transition-all text-sm font-medium
          ${value === "agency" 
            ? "bg-accent-brand text-white shadow-sm" 
            : "text-muted-foreground hover:text-foreground"
          }
        `}
      >
        <Building2 className="w-4 h-4" />
        Agency
        {counts && (
          <Badge 
            variant={value === "agency" ? "secondary" : "outline"}
            className={`ml-1 ${value === "agency" ? "bg-white/20 text-white border-0" : ""}`}
          >
            {counts.agency}
          </Badge>
        )}
      </button>
    </div>
  );
}
