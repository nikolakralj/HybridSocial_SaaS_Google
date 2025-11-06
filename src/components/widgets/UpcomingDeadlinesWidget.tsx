import { WidgetCard } from "../WidgetCard";
import { Button } from "../ui/button";
import { FileSignature, CheckSquare, Send, FileText } from "lucide-react";

export function UpcomingDeadlinesWidget() {
  // Group by time buckets with D-count
  const deadlines = [
    { 
      bucket: "Today",
      items: [
        { 
          task: "Contract review - TechCorp MSA", 
          type: "sign",
          daysOut: 0,
        },
      ]
    },
    { 
      bucket: "Tomorrow",
      items: [
        { 
          task: "Timesheet approval - StartupXYZ", 
          type: "approve",
          daysOut: 1,
        },
      ]
    },
    { 
      bucket: "This week",
      items: [
        { 
          task: "Invoice submission - RetailCo", 
          type: "deliver",
          daysOut: 3,
        },
        { 
          task: "Quarterly report", 
          type: "review",
          daysOut: 7,
        },
      ]
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "sign":
        return FileSignature;
      case "approve":
        return CheckSquare;
      case "deliver":
        return Send;
      default:
        return FileText;
    }
  };

  const getStatusLabel = (type: string) => {
    switch (type) {
      case "sign":
        return "needs signature";
      case "approve":
        return "needs approval";
      case "deliver":
        return "needs delivery";
      default:
        return "needs review";
    }
  };

  return (
    <WidgetCard
      title="Upcoming Deadlines"
      tooltip="Next 7–14 days timeline"
      size="M"
      footer={
        <Button variant="ghost" size="sm" className="h-8 w-full">
          View calendar
        </Button>
      }
    >
      <div className="space-y-4">
        {deadlines.map((bucket, bucketIdx) => (
          <div key={bucketIdx}>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              {bucket.bucket}
            </h4>
            <div className="space-y-2">
              {bucket.items.map((item, itemIdx) => {
                const Icon = getIcon(item.type);
                return (
                  <div
                    key={itemIdx}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent transition-colors cursor-pointer"
                  >
                    <Icon className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{item.task}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          D-{item.daysOut}
                        </span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">
                          {getStatusLabel(item.type)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}
