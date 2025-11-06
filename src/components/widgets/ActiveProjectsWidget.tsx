import { WidgetCard } from "../WidgetCard";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { AlertCircle, Clock } from "lucide-react";

export function ActiveProjectsWidget() {
  // Sort by risk (high risk first) and deadline (nearest first)
  const projects = [
    {
      name: "TechCorp Portal",
      progress: 34,
      status: "At risk",
      statusColor: "destructive",
      dueDate: "Dec 15",
      daysUntilDue: 6,
      risk: "high",
    },
    {
      name: "RetailCo Dashboard",
      progress: 67,
      status: "On track",
      statusColor: "success",
      dueDate: "Dec 22",
      daysUntilDue: 13,
      risk: "low",
    },
    {
      name: "FinServ Integration",
      progress: 89,
      status: "On track",
      statusColor: "success",
      dueDate: "Dec 28",
      daysUntilDue: 19,
      risk: "low",
    },
  ].sort((a, b) => {
    // Sort by risk first (high risk first)
    const riskOrder = { high: 0, medium: 1, low: 2 };
    const riskDiff = riskOrder[a.risk as keyof typeof riskOrder] - riskOrder[b.risk as keyof typeof riskOrder];
    if (riskDiff !== 0) return riskDiff;
    
    // Then by days until due (nearest first)
    return a.daysUntilDue - b.daysUntilDue;
  });

  return (
    <WidgetCard
      title="Projects"
      tooltip="Active projects and their status"
      size="L"
      footer={
        <div className="flex items-center gap-2">
          <Button size="sm" className="h-8 bg-accent-brand hover:bg-accent-brand-hover flex-1">
            View all
          </Button>
          <Button variant="ghost" size="sm" className="h-8">
            View calendar
          </Button>
        </div>
      }
    >
      <div className="space-y-3">
        {projects.slice(0, 3).map((project, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium m-0 truncate">{project.name}</p>
                  {project.risk === "high" && (
                    <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant={project.statusColor === "destructive" ? "destructive" : "outline"}
                    className={`text-xs ${
                      project.statusColor === "success"
                        ? "border-success text-success"
                        : ""
                    }`}
                  >
                    {project.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Due {project.dueDate}
                  </span>
                </div>
              </div>
              <span className="text-sm text-muted-foreground flex-shrink-0">
                {project.progress}%
              </span>
            </div>
            <Progress value={project.progress} className="h-1.5" />
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}
