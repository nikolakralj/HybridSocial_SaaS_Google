import { WidgetCard } from "../WidgetCard";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { MailPlus, Users, Building2 } from "lucide-react";

export function InboxWidget() {
  const threads = [
    {
      subject: "Contract renewal discussion",
      participants: ["TechCorp Team"],
      participantCount: 3,
      lastMessage: "Let's schedule a call",
      time: "2h ago",
      unread: 2,
      icon: Building2,
    },
    {
      subject: "Q4 deliverables timeline",
      participants: ["RetailCo", "You"],
      participantCount: 2,
      lastMessage: "Updated the timeline",
      time: "5h ago",
      unread: 0,
      icon: Users,
    },
    {
      subject: "Invoice #3421 approved",
      participants: ["FinServ Finance"],
      participantCount: 1,
      lastMessage: "Payment processed",
      time: "Yesterday",
      unread: 0,
      icon: Building2,
    },
  ];

  return (
    <WidgetCard
      title="Inbox"
      tooltip="Recent message threads"
      size="M"
      action={
        <Button variant="ghost" size="sm" className="h-8 gap-1.5">
          <MailPlus className="w-4 h-4" />
          Compose
        </Button>
      }
      footer={
        <Button variant="ghost" size="sm" className="w-full h-8">
          View all messages
        </Button>
      }
    >
      <div className="space-y-3">
        {threads.map((thread, idx) => (
          <button
            key={idx}
            className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors border-0 bg-transparent"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-accent flex-shrink-0">
                <thread.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-medium m-0 truncate text-sm">
                    {thread.subject}
                  </p>
                  {thread.unread > 0 && (
                    <Badge className="bg-accent-brand text-white flex-shrink-0">
                      {thread.unread}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground m-0 mb-1">
                  {thread.participants.join(", ")}
                  {thread.participantCount > 2 && ` +${thread.participantCount - 2}`}
                </p>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-muted-foreground m-0 truncate">
                    {thread.lastMessage}
                  </p>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {thread.time}
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </WidgetCard>
  );
}
