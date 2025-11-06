import { useState } from "react";
import { Building2, User, Users, ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import type { WorkGraphContext } from "../types";

interface ContextChooserProps {
  availableContexts: WorkGraphContext[];
  onSelectContext: (context: WorkGraphContext) => void;
}

export function ContextChooser({ availableContexts, onSelectContext }: ContextChooserProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const getContextIcon = (type: WorkGraphContext["type"]) => {
    switch (type) {
      case "personal":
        return <User className="w-8 h-8" />;
      case "company":
        return <Building2 className="w-8 h-8" />;
      case "agency":
        return <Users className="w-8 h-8" />;
    }
  };

  const getContextGradient = (type: WorkGraphContext["type"]) => {
    switch (type) {
      case "personal":
        return "from-accent-brand to-purple-600";
      case "company":
        return "from-warning to-orange-600";
      case "agency":
        return "from-success to-emerald-600";
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "owner":
        return "bg-accent-brand text-white";
      case "admin":
        return "bg-warning text-white";
      default:
        return "bg-accent";
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-brand mb-4">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8 text-white"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h1 className="m-0 mb-2">Choose your workspace</h1>
          <p className="text-muted-foreground">
            Select which context you'd like to enter
          </p>
        </div>

        {/* Context Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableContexts.map((context) => (
            <Card
              key={context.id}
              className={`p-6 cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] ${
                hoveredId === context.id ? "border-accent-brand" : ""
              }`}
              onMouseEnter={() => setHoveredId(context.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onSelectContext(context)}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                {/* Avatar/Logo */}
                <Avatar className="w-20 h-20 rounded-xl">
                  <AvatarFallback 
                    className={`bg-gradient-to-br ${getContextGradient(context.type)} text-white rounded-xl`}
                  >
                    {context.type === "personal" ? (
                      getContextIcon(context.type)
                    ) : (
                      <span className="text-2xl">
                        {context.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    )}
                  </AvatarFallback>
                </Avatar>

                {/* Name */}
                <div className="flex-1 w-full">
                  <h3 className="m-0 mb-1">{context.name}</h3>
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="outline" className="text-xs capitalize">
                      {context.type}
                    </Badge>
                    {context.role && (
                      <Badge className={`text-xs ${getRoleBadgeColor(context.role)}`}>
                        {context.role}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Last Active */}
                {context.lastActive && (
                  <p className="text-xs text-muted-foreground m-0">
                    Last active {context.lastActive}
                  </p>
                )}

                {/* Enter Button */}
                <Button
                  className="w-full bg-accent-brand hover:bg-accent-brand-hover gap-2 min-h-[44px]"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectContext(context);
                  }}
                >
                  Enter
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Create New Context */}
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Need to create a new workspace?
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button variant="outline" className="gap-2 min-h-[44px]">
              <Building2 className="w-4 h-4" />
              New Company
            </Button>
            <Button variant="outline" className="gap-2 min-h-[44px]">
              <Users className="w-4 h-4" />
              New Agency
            </Button>
          </div>
        </div>

        {/* Switch Account */}
        <div className="text-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-sm text-muted-foreground hover:text-foreground gap-2"
          >
            Switch account
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
