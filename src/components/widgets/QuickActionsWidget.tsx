import { Plus, Clock, FileText, Send } from "lucide-react";
import { WidgetCard } from "../WidgetCard";

export function QuickActionsWidget() {
  const actions = [
    { icon: Plus, label: "New project", isPrimary: true },
    { icon: Clock, label: "Log time", isPrimary: false },
    { icon: FileText, label: "Invoice", isPrimary: false },
    { icon: Send, label: "Report", isPrimary: false },
  ];

  return (
    <WidgetCard title="Quick Actions" size="S">
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, idx) => (
          <button
            key={idx}
            className={`
              rounded-lg flex flex-col items-center justify-center gap-2 
              transition-colors border min-h-[112px]
              ${
                action.isPrimary
                  ? "bg-accent-brand hover:bg-accent-brand-hover text-white border-transparent"
                  : "bg-card hover:bg-accent border-border"
              }
            `}
            style={{ minHeight: "112px" }}
          >
            <action.icon className="w-5 h-5" />
            <span className="text-sm">{action.label}</span>
          </button>
        ))}
      </div>
    </WidgetCard>
  );
}
