import { Badge } from "./ui/badge";

export type AgencyRole = 
  | "owner" 
  | "admin" 
  | "account-manager" 
  | "recruiter" 
  | "sourcer" 
  | "finance" 
  | "viewer";

interface AgencyRoleBadgeProps {
  role: AgencyRole;
  className?: string;
}

const roleConfig = {
  owner: {
    label: "Owner",
    description: "Full access to everything",
    color: "bg-purple-500 text-white border-purple-500"
  },
  admin: {
    label: "Admin",
    description: "Members, teams, settings",
    color: "bg-accent-brand text-white border-accent-brand"
  },
  "account-manager": {
    label: "Account Manager",
    description: "Client relationships & deals",
    color: "bg-emerald-500 text-white border-emerald-500"
  },
  recruiter: {
    label: "Recruiter",
    description: "Manages candidates, submits to clients",
    color: "bg-blue-500 text-white border-blue-500"
  },
  sourcer: {
    label: "Sourcer",
    description: "Adds candidates, proposes to recruiters",
    color: "bg-cyan-500 text-white border-cyan-500"
  },
  finance: {
    label: "Finance",
    description: "Rates & invoices, not candidate PII",
    color: "bg-orange-500 text-white border-orange-500"
  },
  viewer: {
    label: "Viewer",
    description: "Read-only on assigned work",
    color: "bg-gray-500 text-white border-gray-500"
  }
};

export function AgencyRoleBadge({ role, className }: AgencyRoleBadgeProps) {
  const config = roleConfig[role];
  
  return (
    <Badge 
      variant="outline" 
      className={`${config.color} ${className || ""}`}
    >
      {config.label}
    </Badge>
  );
}

export function getRoleDescription(role: AgencyRole): string {
  return roleConfig[role].description;
}
