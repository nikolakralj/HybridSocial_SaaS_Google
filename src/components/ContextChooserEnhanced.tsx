import { useState } from "react";
import { User, Building2, Users, ChevronRight, Plus, LogIn } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import type { WorkGraphContext } from "../types";

interface ContextChooserEnhancedProps {
  availableContexts: WorkGraphContext[];
  onSelectContext: (context: WorkGraphContext) => void;
  onJoinWorkspace?: () => void;
  onCreateWorkspace?: () => void;
}

export function ContextChooserEnhanced({ 
  availableContexts, 
  onSelectContext,
  onJoinWorkspace,
  onCreateWorkspace
}: ContextChooserEnhancedProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const getContextIcon = (type: string) => {
    switch (type) {
      case "personal":
        return <User className="w-5 h-5" />;
      case "company":
        return <Building2 className="w-5 h-5" />;
      case "agency":
        return <Users className="w-5 h-5" />;
      default:
        return <Building2 className="w-5 h-5" />;
    }
  };

  const getContextColor = (type: string) => {
    switch (type) {
      case "personal":
        return "from-accent-brand to-blue-600";
      case "company":
        return "from-emerald-500 to-teal-600";
      case "agency":
        return "from-purple-500 to-pink-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="mb-2">Choose your workspace</h1>
          <p className="text-muted-foreground">
            Select which workspace you'd like to enter
          </p>
        </div>

        {/* Available Contexts Grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {availableContexts.map((context) => (
            <button
              key={context.id}
              onClick={() => onSelectContext(context)}
              onMouseEnter={() => setHoveredId(context.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group relative"
            >
              <Card className="p-6 hover:border-accent-brand transition-all hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div 
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getContextColor(context.type)} flex items-center justify-center text-white flex-shrink-0`}
                  >
                    {getContextIcon(context.type)}
                  </div>
                  
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="m-0 truncate">{context.name}</h3>
                      <ChevronRight 
                        className={`w-4 h-4 text-muted-foreground transition-transform ${
                          hoveredId === context.id ? "translate-x-1" : ""
                        }`}
                      />
                    </div>
                    
                    {context.role && (
                      <p className="text-sm text-muted-foreground m-0 mb-2">
                        {context.role}
                      </p>
                    )}
                    
                    <p className="text-xs text-muted-foreground m-0">
                      Last active {context.lastActive}
                    </p>
                  </div>
                </div>
              </Card>
            </button>
          ))}
        </div>

        <Separator className="my-6" />

        {/* Join or Create Actions */}
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground text-center mb-4">
            Don't see your workspace?
          </p>
          
          <div className="grid md:grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 min-h-[56px]"
              onClick={onJoinWorkspace}
            >
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                <LogIn className="w-5 h-5" />
              </div>
              <div className="text-left flex-1">
                <p className="font-medium m-0 text-sm">Join existing workspace</p>
                <p className="text-xs text-muted-foreground m-0">Enter email or invite code</p>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 min-h-[56px]"
              onClick={onCreateWorkspace}
            >
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                <Plus className="w-5 h-5" />
              </div>
              <div className="text-left flex-1">
                <p className="font-medium m-0 text-sm">Create new workspace</p>
                <p className="text-xs text-muted-foreground m-0">For company or agency owners</p>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
