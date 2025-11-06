import { useState } from "react";
import { FocusStrip } from "./FocusStrip";
import { QuickActionsWidget } from "./widgets/QuickActionsWidget";
import { MyWeekWidget } from "./widgets/MyWeekWidget";
import { ActiveProjectsWidget } from "./widgets/ActiveProjectsWidget";
import { UpcomingDeadlinesWidget } from "./widgets/UpcomingDeadlinesWidget";
import { AIInsightsWidget } from "./widgets/AIInsightsWidget";
import { InboxWidget } from "./widgets/InboxWidget";
import { Button } from "./ui/button";
import { Settings, Sparkles, X } from "lucide-react";
import { useWorkGraph } from "../contexts/WorkGraphContext";

export function Dashboard() {
  const [showAISidebar, setShowAISidebar] = useState(false);
  const { currentContext } = useWorkGraph();

  // Get context-specific dashboard title
  const getDashboardTitle = () => {
    switch (currentContext.type) {
      case "personal":
        return "My Dashboard";
      case "company":
        return `${currentContext.name} Dashboard`;
      case "agency":
        return `${currentContext.name} Dashboard`;
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1280px] mx-auto px-6 py-6">
        {/* Focus Strip */}
        <FocusStrip
          priority="3 tasks due today"
          deadline="Contract review - 2 days"
          unreadMessages={2}
          aiSummary="You're free 3–4pm"
          onAIClick={() => setShowAISidebar(!showAISidebar)}
        />

        {/* Dashboard Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="m-0">{getDashboardTitle()}</h1>
          <Button variant="outline" size="sm" className="gap-2 min-h-[44px]">
            <Settings className="w-4 h-4" />
            Edit
          </Button>
        </div>

        {/* Main Grid - 12 columns */}
        <div className="relative">
          <div className="grid grid-cols-12 gap-6">
            {/* Row 1: Quick Actions (4) · My Week (5) · AI Insights (3) */}
            <div className="col-span-12 lg:col-span-4">
              <QuickActionsWidget />
            </div>
            <div className="col-span-12 lg:col-span-5">
              <MyWeekWidget />
            </div>
            <div className="col-span-12 lg:col-span-3">
              <AIInsightsWidget />
            </div>

            {/* Row 2: Projects (6) · Deadlines (6) */}
            <div className="col-span-12 lg:col-span-6">
              <ActiveProjectsWidget />
            </div>
            <div className="col-span-12 lg:col-span-6">
              <UpcomingDeadlinesWidget />
            </div>

            {/* Row 3: Inbox (4) */}
            <div className="col-span-12 lg:col-span-4">
              <InboxWidget />
            </div>
          </div>

          {/* AI Sidebar */}
          {showAISidebar && (
            <div className="hidden lg:block fixed right-0 top-0 h-screen w-80 bg-card border-l border-border p-6 overflow-y-auto">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles
                      className="w-5 h-5"
                      style={{ color: "var(--ai-accent)" }}
                    />
                    <h3 className="m-0">AI Assistant</h3>
                  </div>
                  <p className="text-sm text-muted-foreground m-0">
                    Smart suggestions and help
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShowAISidebar(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {/* Suggested Actions */}
                <div className="p-4 rounded-lg border border-ai-accent/20 bg-ai-accent/5">
                  <p className="text-sm font-medium mb-2">Suggested Action</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    I can move 'Deadlines' widget to the top of your dashboard for
                    better visibility.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 h-8"
                      style={{
                        backgroundColor: "var(--ai-accent)",
                        color: "var(--ai-accent-foreground)",
                      }}
                    >
                      Apply
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8">
                      Dismiss
                    </Button>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border bg-accent/50">
                  <p className="text-sm font-medium mb-2">Why this?</p>
                  <p className="text-sm text-muted-foreground">
                    You've checked deadlines 12 times this week, more than any
                    other widget. Moving it up will save you time.
                  </p>
                </div>

                {/* Chat Thread Preview */}
                <div className="pt-4 border-t border-border">
                  <p className="text-sm font-medium mb-3">Recent Activity</p>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <p className="text-muted-foreground mb-1">2 hours ago</p>
                      <p>Generated invoice draft for TechCorp project</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-muted-foreground mb-1">Yesterday</p>
                      <p>Matched 3 candidates to "Senior Developer" job posting</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
