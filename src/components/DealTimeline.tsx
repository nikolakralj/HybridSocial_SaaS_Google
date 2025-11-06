import { 
  Clock, 
  UserPlus, 
  FileText, 
  CheckCircle, 
  MessageSquare,
  TrendingUp,
  Handshake
} from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

export interface TimelineEvent {
  id: string;
  type: "submission" | "interview" | "offer" | "contract" | "message" | "stage_change" | "participant_added";
  title: string;
  description?: string;
  timestamp: string;
  actor: string;
  metadata?: {
    fromStage?: string;
    toStage?: string;
    fileName?: string;
    participantName?: string;
  };
}

interface DealTimelineProps {
  events: TimelineEvent[];
  compact?: boolean;
}

export function DealTimeline({ events, compact = false }: DealTimelineProps) {
  const getEventIcon = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "submission":
        return UserPlus;
      case "interview":
        return MessageSquare;
      case "offer":
        return Handshake;
      case "contract":
        return FileText;
      case "message":
        return MessageSquare;
      case "stage_change":
        return TrendingUp;
      case "participant_added":
        return UserPlus;
      default:
        return Clock;
    }
  };

  const getEventColor = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "submission":
        return "text-blue-500";
      case "interview":
        return "text-purple-500";
      case "offer":
        return "text-emerald-500";
      case "contract":
        return "text-orange-500";
      case "stage_change":
        return "text-accent-brand";
      default:
        return "text-muted-foreground";
    }
  };

  if (compact) {
    return (
      <div className="space-y-2">
        {events.slice(0, 5).map((event, idx) => {
          const Icon = getEventIcon(event.type);
          const colorClass = getEventColor(event.type);
          
          return (
            <div key={event.id} className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <Icon className={`w-3 h-3 ${colorClass}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium m-0 truncate">{event.title}</p>
                <p className="text-xs text-muted-foreground m-0">{event.timestamp}</p>
              </div>
            </div>
          );
        })}
        {events.length > 5 && (
          <p className="text-xs text-muted-foreground text-center m-0 pt-2">
            +{events.length - 5} more events
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {events.map((event, idx) => {
        const Icon = getEventIcon(event.type);
        const colorClass = getEventColor(event.type);
        const isLast = idx === events.length - 1;
        
        return (
          <div key={event.id} className="relative">
            <div className="flex items-start gap-4 pb-6">
              {/* Timeline line */}
              {!isLast && (
                <div className="absolute left-5 top-10 w-0.5 h-full bg-border" />
              )}
              
              {/* Icon */}
              <div className={`w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0 relative z-10`}>
                <Icon className={`w-5 h-5 ${colorClass}`} />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex items-start justify-between gap-4 mb-1">
                  <p className="font-medium m-0">{event.title}</p>
                  <p className="text-xs text-muted-foreground m-0 whitespace-nowrap">{event.timestamp}</p>
                </div>
                
                {event.description && (
                  <p className="text-sm text-muted-foreground m-0 mb-2">{event.description}</p>
                )}
                
                <p className="text-xs text-muted-foreground m-0">by {event.actor}</p>
                
                {/* Metadata badges */}
                {event.metadata && (
                  <div className="flex gap-2 mt-2">
                    {event.metadata.fromStage && event.metadata.toStage && (
                      <Badge variant="outline" className="text-xs">
                        {event.metadata.fromStage} → {event.metadata.toStage}
                      </Badge>
                    )}
                    {event.metadata.fileName && (
                      <Badge variant="outline" className="text-xs">
                        {event.metadata.fileName}
                      </Badge>
                    )}
                    {event.metadata.participantName && (
                      <Badge variant="outline" className="text-xs">
                        {event.metadata.participantName}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Example usage with mock data
export function DealTimelineExample() {
  const sampleEvents: TimelineEvent[] = [
    {
      id: "1",
      type: "submission",
      title: "Candidate submitted",
      description: "Sarah Chen was submitted for the Senior Full-Stack Developer position",
      timestamp: "Oct 8, 2025 2:30 PM",
      actor: "Lisa Chen",
      metadata: { participantName: "Sarah Chen" }
    },
    {
      id: "2",
      type: "stage_change",
      title: "Deal stage updated",
      timestamp: "Oct 10, 2025 10:15 AM",
      actor: "James Wilson",
      metadata: { fromStage: "Submitted", toStage: "Interview" }
    },
    {
      id: "3",
      type: "interview",
      title: "Interview scheduled",
      description: "Technical interview set for Oct 12 at 2:00 PM",
      timestamp: "Oct 10, 2025 11:30 AM",
      actor: "Mike Johnson"
    },
    {
      id: "4",
      type: "message",
      title: "Client feedback received",
      description: "Great technical skills, moving forward with offer",
      timestamp: "Oct 12, 2025 4:45 PM",
      actor: "Mike Johnson"
    },
    {
      id: "5",
      type: "offer",
      title: "Offer extended",
      description: "$120,000 base salary + benefits",
      timestamp: "Oct 15, 2025 9:00 AM",
      actor: "Mike Johnson"
    },
    {
      id: "6",
      type: "stage_change",
      title: "Deal stage updated",
      timestamp: "Oct 20, 2025 3:15 PM",
      actor: "James Wilson",
      metadata: { fromStage: "Offer", toStage: "Hired" }
    },
    {
      id: "7",
      type: "contract",
      title: "Contract generated",
      description: "MSA and SOW created for signature",
      timestamp: "Oct 21, 2025 10:00 AM",
      actor: "James Wilson",
      metadata: { fileName: "MSA-2025-001.pdf" }
    }
  ];

  return (
    <Card className="p-6">
      <h3 className="m-0 mb-6">Deal Timeline</h3>
      <DealTimeline events={sampleEvents} />
    </Card>
  );
}
