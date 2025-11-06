import { useState } from "react";
import { X, Lightbulb, Users, Lock, Eye } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export function AgencyWorkspaceWelcome() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-500/5 to-blue-500/5 border-purple-500/20 relative">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-4 right-4 p-1 rounded-lg hover:bg-accent transition-colors border-0"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4 text-muted-foreground" />
      </button>

      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
          <Lightbulb className="w-5 h-5 text-purple-500" />
        </div>

        <div className="flex-1">
          <h3 className="m-0 mb-2">Welcome to Your Agency Workspace</h3>
          <p className="text-sm text-muted-foreground m-0 mb-4">
            You're viewing Elite Recruiters as <strong>James Wilson</strong> (Account Manager). 
            Here's what makes this workspace powerful:
          </p>

          <div className="grid md:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-purple-500" />
                <p className="font-medium m-0 text-sm">Privacy by Default</p>
              </div>
              <p className="text-xs text-muted-foreground m-0">
                New deals are private. Only participants see them unless you share.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-blue-500" />
                <p className="font-medium m-0 text-sm">Scope Control</p>
              </div>
              <p className="text-xs text-muted-foreground m-0">
                Filter by My/Team/Agency to see what's relevant to you.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-emerald-500" />
                <p className="font-medium m-0 text-sm">Party-Based</p>
              </div>
              <p className="text-xs text-muted-foreground m-0">
                Clear distinction between Agency, Client, and Candidate roles.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground m-0 flex-1">
              Try the <Badge variant="outline" className="text-xs mx-1">James Workflow Demo</Badge> 
              to see the full flow from CV parsing to deal creation.
            </p>
            <Button variant="outline" size="sm" onClick={() => setIsVisible(false)}>
              Got it
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
