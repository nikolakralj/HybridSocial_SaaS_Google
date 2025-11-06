import { Eye, Building2, User, Globe } from "lucide-react";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useState } from "react";

type ViewMode = "public" | "company" | "personal";

interface ViewAsToggleProps {
  profileType: "personal" | "company";
  onChange?: (mode: ViewMode) => void;
}

export function ViewAsToggle({ profileType, onChange }: ViewAsToggleProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("personal");

  const viewModes = {
    personal: [
      { id: "personal" as ViewMode, label: "My View", icon: User },
      { id: "public" as ViewMode, label: "Public View", icon: Globe },
      { id: "company" as ViewMode, label: "As Company", icon: Building2 },
    ],
    company: [
      { id: "personal" as ViewMode, label: "Member View", icon: User },
      { id: "public" as ViewMode, label: "Public View", icon: Globe },
    ],
  };

  const modes = viewModes[profileType];
  const currentMode = modes.find((m) => m.id === viewMode) || modes[0];

  const handleChange = (mode: ViewMode) => {
    setViewMode(mode);
    onChange?.(mode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Badge
          variant="outline"
          className="gap-1.5 cursor-pointer hover:bg-accent transition-colors h-7"
        >
          <Eye className="w-3 h-3" />
          <span className="text-xs">View as: {currentMode.label}</span>
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {modes.map((mode) => (
          <DropdownMenuItem
            key={mode.id}
            onClick={() => handleChange(mode.id)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <mode.icon className="w-4 h-4" />
            <span>{mode.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
