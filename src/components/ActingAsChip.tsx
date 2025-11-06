import { ChevronDown, User, Building2, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useWorkGraph } from "../contexts/WorkGraphContext";
import { Badge } from "./ui/badge";

export function ActingAsChip() {
  const { currentContext, availableContexts, switchContext } = useWorkGraph();

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

  const CurrentIcon = getContextIcon(currentContext.type);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Badge
          variant="outline"
          className="gap-1.5 cursor-pointer hover:bg-accent transition-colors"
        >
          <CurrentIcon className="w-3 h-3" />
          <span className="text-xs">{currentContext.name}</span>
          <ChevronDown className="w-3 h-3" />
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {availableContexts.map((ctx) => {
          const Icon = getContextIcon(ctx.type);
          return (
            <DropdownMenuItem
              key={ctx.id}
              onClick={() => switchContext(ctx.id)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Icon className="w-4 h-4" />
              <span>{ctx.name}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
