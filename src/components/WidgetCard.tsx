import { ReactNode } from "react";
import { Info, MoreVertical } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface WidgetCardProps {
  title: string;
  tooltip?: string;
  size?: "S" | "M" | "L";
  children: ReactNode;
  footer?: ReactNode;
  action?: ReactNode;
  onEdit?: () => void;
  onRemove?: () => void;
  className?: string;
}

export function WidgetCard({
  title,
  tooltip,
  size = "M",
  children,
  footer,
  action,
  onEdit,
  onRemove,
  className = "",
}: WidgetCardProps) {
  const sizeClasses = {
    S: "col-span-1",
    M: "col-span-2",
    L: "col-span-2",
  };

  return (
    <div
      className={`bg-card border border-border rounded-xl flex flex-col ${sizeClasses[size]} ${className}`}
      style={{ boxShadow: "var(--card-shadow)", padding: "24px" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between" style={{ marginBottom: "16px" }}>
        <div className="flex items-center gap-2">
          <h3 className="m-0">{title}</h3>
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground hover:text-foreground transition-colors p-0 bg-transparent border-0 min-h-[44px] min-w-[44px] flex items-center justify-center -ml-3">
                    <Info className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <div className="flex items-center gap-2">
          {action}
          {(onEdit || onRemove) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && <DropdownMenuItem onClick={onEdit}>Resize</DropdownMenuItem>}
                <DropdownMenuItem>Move to top</DropdownMenuItem>
                <DropdownMenuItem>Collapse</DropdownMenuItem>
                {onRemove && (
                  <DropdownMenuItem onClick={onRemove} className="text-destructive">
                    Remove
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">{children}</div>

      {/* Footer */}
      {footer && (
        <div className="border-t border-border" style={{ marginTop: "16px", paddingTop: "16px" }}>
          {footer}
        </div>
      )}
    </div>
  );
}
