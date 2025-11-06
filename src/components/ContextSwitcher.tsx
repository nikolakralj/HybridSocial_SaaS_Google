import { useState } from "react";
import { ChevronDown, User, Building2, Users, Check, Search, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useWorkGraph } from "../contexts/WorkGraphContext";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";

export function ContextSwitcher() {
  const { currentContext, availableContexts, switchContext } = useWorkGraph();
  const [searchQuery, setSearchQuery] = useState("");

  const getContextIcon = (type: string) => {
    switch (type) {
      case "personal":
        return User;
      case "company":
        return Building2;
      case "agency":
        return Users;
      default:
        return User;
    }
  };

  const getContextColor = (type: string) => {
    switch (type) {
      case "personal":
        return "text-accent-brand";
      case "company":
        return "text-warning";
      case "agency":
        return "text-purple-500";
      default:
        return "text-accent-brand";
    }
  };

  const CurrentIcon = getContextIcon(currentContext.type);

  // Filter contexts based on search
  const filteredContexts = availableContexts.filter((ctx) =>
    ctx.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Separate pinned (recently used) contexts
  const pinnedContexts = filteredContexts.slice(0, 3);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent transition-colors border border-border bg-card min-h-[44px]">
          <CurrentIcon className={`w-4 h-4 ${getContextColor(currentContext.type)}`} />
          <span className="font-medium">{currentContext.name}</span>
          <Badge variant="outline" className="text-xs ml-1 capitalize">
            {currentContext.type}
          </Badge>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Act as
        </DropdownMenuLabel>
        
        {/* Search */}
        {availableContexts.length > 3 && (
          <div className="px-2 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search workspaces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
          </div>
        )}

        {/* Available Contexts */}
        {filteredContexts.map((ctx) => {
          const Icon = getContextIcon(ctx.type);
          const isActive = ctx.id === currentContext.id;
          
          return (
            <DropdownMenuItem
              key={ctx.id}
              onClick={() => switchContext(ctx.id)}
              className="flex items-center gap-3 cursor-pointer py-3 mx-1"
            >
              <Icon className={`w-4 h-4 ${getContextColor(ctx.type)}`} />
              <div className="flex-1">
                <p className="font-medium m-0">{ctx.name}</p>
                <p className="text-xs text-muted-foreground m-0">
                  {ctx.type === "personal"
                    ? "Personal"
                    : ctx.type === "company"
                    ? `Company${ctx.role ? ` • ${ctx.role}` : ""}`
                    : `Agency${ctx.role ? ` • ${ctx.role}` : ""}`}
                </p>
              </div>
              {isActive && <Check className="w-4 h-4 text-accent-brand" />}
            </DropdownMenuItem>
          );
        })}

        {filteredContexts.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            No workspaces found
          </div>
        )}

        <DropdownMenuSeparator />

        {/* Create New */}
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Create new workspace
        </DropdownMenuLabel>
        <DropdownMenuItem className="cursor-pointer gap-2 mx-1">
          <Building2 className="w-4 h-4 text-warning" />
          <span>New Company</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer gap-2 mx-1">
          <Users className="w-4 h-4 text-success" />
          <span>New Agency</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
