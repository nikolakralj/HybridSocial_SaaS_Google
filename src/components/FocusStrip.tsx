import { Calendar, MessageSquare, Sparkles, CheckCircle2 } from "lucide-react";

interface FocusStripProps {
  priority?: string;
  deadline?: string;
  unreadMessages?: number;
  aiSummary?: string;
  onAIClick?: () => void;
}

export function FocusStrip({
  priority = "3 tasks due today",
  deadline = "Contract review - 2 days",
  unreadMessages = 2,
  aiSummary = "You're free 3–4pm",
  onAIClick,
}: FocusStripProps) {
  return (
    <div className="bg-card border border-border rounded-xl mb-6" style={{ padding: "12px 16px" }}>
      <div className="flex flex-wrap items-center gap-2">
        {/* Tasks due - priority first */}
        <button className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-accent-brand/10 text-accent-brand hover:bg-accent-brand/20 transition-colors border-0 min-h-[44px]">
          <CheckCircle2 className="w-4 h-4" />
          <span className="whitespace-nowrap">{priority} · Open</span>
        </button>

        {/* Contract review */}
        <button className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-warning/10 text-warning hover:bg-warning/20 transition-colors border-0 min-h-[44px]">
          <Calendar className="w-4 h-4" />
          <span className="whitespace-nowrap">{deadline} · Review</span>
        </button>

        {/* Unread Messages */}
        {unreadMessages > 0 && (
          <button className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-secondary hover:bg-accent transition-colors border-0 min-h-[44px]">
            <MessageSquare className="w-4 h-4" />
            <span className="whitespace-nowrap">{unreadMessages} unread · Open</span>
          </button>
        )}

        {/* AI Summary - rightmost */}
        {aiSummary && (
          <button 
            onClick={onAIClick}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-ai-accent/10 hover:bg-ai-accent/20 transition-colors border-0 min-h-[44px] ml-auto"
          >
            <Sparkles className="w-4 h-4" style={{ color: "var(--ai-accent)" }} />
            <span style={{ color: "var(--ai-accent)" }} className="whitespace-nowrap">
              {aiSummary} · Open
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
