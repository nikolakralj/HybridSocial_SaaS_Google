import { useState } from "react";
import { 
  Building2, User, Users, FileText, Clock, DollarSign,
  MessageSquare, Send, UserPlus, Settings, ChevronDown,
  CheckCircle, Circle, ArrowRight, Paperclip
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { AgencyRoleBadge, type AgencyRole } from "./AgencyRoleBadge";
import { VisibilityScopeBadge, type VisibilityScope } from "./VisibilityScopeBadge";
import { MoneyFlowDiagram } from "./MoneyFlowDiagram";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

type DealType = "placement" | "t-m" | "outstaff";
type DealStatus = "prospect" | "submitted" | "interview" | "offer" | "signed" | "active" | "closed";

interface Participant {
  id: string;
  name: string;
  role: string;
  type: "agency" | "client" | "candidate" | "supplier";
  agencyRole?: AgencyRole;
  avatar?: string;
}

interface DealRoomProps {
  dealType?: DealType;
  status?: DealStatus;
}

export function DealRoom({ 
  dealType = "placement",
  status = "submitted"
}: DealRoomProps) {
  const [currentTab, setCurrentTab] = useState("overview");
  const [scope, setScope] = useState<VisibilityScope>("participants");
  const [showParticipants, setShowParticipants] = useState(false);
  const [internalNotesOnly, setInternalNotesOnly] = useState(false);

  // Mock data
  const deal = {
    id: "deal-123",
    title: "RetailCo · Senior Full-Stack Developer",
    client: "RetailCo",
    role: "Senior Full-Stack Developer",
    type: dealType,
    status: status,
    createdDate: "Oct 1, 2024",
    lastUpdate: "2 hours ago"
  };

  const participants: Participant[] = [
    {
      id: "1",
      name: "James Wilson",
      role: "Account Manager",
      type: "agency",
      agencyRole: "account-manager"
    },
    {
      id: "2",
      name: "Lisa Chen",
      role: "Recruiter",
      type: "agency",
      agencyRole: "recruiter"
    },
    {
      id: "3",
      name: "Alex Martinez",
      role: "Hiring Manager",
      type: "client"
    },
    {
      id: "4",
      name: "Sarah Chen",
      role: "Candidate",
      type: "candidate"
    }
  ];

  const timeline = [
    { id: "1", date: "Oct 9", event: "Candidate responded to interview request", status: "completed" },
    { id: "2", date: "Oct 8", event: "Interview scheduled for Oct 12", status: "completed" },
    { id: "3", date: "Oct 5", event: "Client requested candidate profile", status: "completed" },
    { id: "4", date: "Oct 3", event: "Candidate consented to submission", status: "completed" },
    { id: "5", date: "Oct 1", event: "Deal created", status: "completed" },
  ];

  const messages = [
    {
      id: "1",
      author: "James Wilson",
      role: "Account Manager",
      content: "Great news! Alex has confirmed the interview for next Thursday at 2pm.",
      timestamp: "2 hours ago",
      internal: false
    },
    {
      id: "2",
      author: "Lisa Chen",
      role: "Recruiter",
      content: "Internal note: Sarah mentioned she's also interviewing with CompanyX. We should follow up quickly.",
      timestamp: "5 hours ago",
      internal: true
    }
  ];

  const documents = [
    { id: "1", name: "Candidate_Profile_Sarah_Chen.pdf", date: "Oct 3", visibleTo: ["agency", "client"] },
    { id: "2", name: "NDA_RetailCo.pdf", date: "Oct 1", visibleTo: ["agency", "client", "candidate"] },
    { id: "3", name: "Job_Description.pdf", date: "Oct 1", visibleTo: ["agency", "client"] },
  ];

  const getStatusColor = (status: DealStatus) => {
    switch (status) {
      case "prospect": return "bg-gray-500 text-white";
      case "submitted": return "bg-blue-500 text-white";
      case "interview": return "bg-purple-500 text-white";
      case "offer": return "bg-warning text-white";
      case "signed": return "bg-success text-white";
      case "active": return "bg-emerald-500 text-white";
      case "closed": return "bg-gray-400 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getParticipantIcon = (type: string) => {
    switch (type) {
      case "agency": return <Users className="w-3 h-3" />;
      case "client": return <Building2 className="w-3 h-3" />;
      case "candidate": return <User className="w-3 h-3" />;
      default: return <User className="w-3 h-3" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1280px] mx-auto px-6 py-6 space-y-6">
        {/* Header */}
        <Card className="p-6">
          <div className="space-y-4">
            {/* Title Row */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="m-0">{deal.title}</h1>
                  <Badge className={getStatusColor(deal.status) + " capitalize"}>
                    {deal.status}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {deal.type === "t-m" ? "T&M" : deal.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground m-0">
                  Created {deal.createdDate} · Updated {deal.lastUpdate}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2 min-h-[44px]">
                      <Settings className="w-4 h-4" />
                      Actions
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Participant
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Users className="w-4 h-4 mr-2" />
                      Change Scope
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Candidate
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="w-4 h-4 mr-2" />
                      Draft Contract
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Sheet open={showParticipants} onOpenChange={setShowParticipants}>
                  <SheetTrigger asChild>
                    <Button className="gap-2 min-h-[44px] bg-accent-brand hover:bg-accent-brand-hover">
                      <Users className="w-4 h-4" />
                      Participants ({participants.length})
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Participants</SheetTitle>
                      <SheetDescription>
                        Grouped by party · Changes are logged
                      </SheetDescription>
                    </SheetHeader>
                    
                    <div className="mt-6 space-y-6">
                      {/* Visibility Scope */}
                      <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="m-0">Visibility</Label>
                          <VisibilityScopeBadge scope={scope} />
                        </div>
                        <p className="text-xs text-muted-foreground m-0">
                          Only participants listed below can see this deal
                        </p>
                      </div>

                      {/* Agency Participants */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Users className="w-4 h-4 text-purple-500" />
                          <Label className="m-0">Agency</Label>
                          <Badge variant="secondary" className="text-xs">
                            {participants.filter(p => p.type === "agency").length}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          {participants.filter(p => p.type === "agency").map((participant) => (
                            <div 
                              key={participant.id}
                              className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/10 flex items-center gap-3"
                            >
                              <Avatar className="w-10 h-10 rounded-lg">
                                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-lg">
                                  {participant.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium m-0 text-sm truncate">
                                  {participant.name}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  {participant.agencyRole && (
                                    <AgencyRoleBadge role={participant.agencyRole} className="text-xs" />
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Client Participants */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Building2 className="w-4 h-4 text-blue-500" />
                          <Label className="m-0">Client</Label>
                          <Badge variant="secondary" className="text-xs">
                            {participants.filter(p => p.type === "client").length}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          {participants.filter(p => p.type === "client").map((participant) => (
                            <div 
                              key={participant.id}
                              className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10 flex items-center gap-3"
                            >
                              <Avatar className="w-10 h-10 rounded-lg">
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-lg">
                                  {participant.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium m-0 text-sm truncate">
                                  {participant.name}
                                </p>
                                <p className="text-xs text-muted-foreground m-0 mt-0.5">
                                  {participant.role}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Supplier/Candidate Participants */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <User className="w-4 h-4 text-emerald-500" />
                          <Label className="m-0">{deal.type === "placement" ? "Candidate" : "Supplier"}</Label>
                          <Badge variant="secondary" className="text-xs">
                            {participants.filter(p => p.type === "candidate" || p.type === "supplier").length}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          {participants.filter(p => p.type === "candidate" || p.type === "supplier").map((participant) => (
                            <div 
                              key={participant.id}
                              className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-3"
                            >
                              <Avatar className="w-10 h-10 rounded-lg">
                                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-blue-500 text-white rounded-lg">
                                  {participant.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium m-0 text-sm truncate">
                                  {participant.name}
                                </p>
                                <Badge variant="outline" className="text-xs mt-1 capitalize">
                                  {participant.type}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <Button variant="outline" className="w-full gap-2 min-h-[44px]">
                        <UserPlus className="w-4 h-4" />
                        Add Participant
                      </Button>

                      <div className="p-3 rounded-lg bg-muted">
                        <p className="text-xs text-muted-foreground m-0">
                          <span className="font-medium text-foreground">Audit:</span> All participant changes are logged and visible to agency owners.
                        </p>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Participants Preview */}
            <div className="flex items-center gap-2 flex-wrap">
              <VisibilityScopeBadge scope={scope} />
              <Separator orientation="vertical" className="h-5" />
              {participants.slice(0, 3).map((participant) => (
                <Badge key={participant.id} variant="outline" className="gap-1.5">
                  {getParticipantIcon(participant.type)}
                  {participant.name}
                </Badge>
              ))}
              {participants.length > 3 && (
                <Badge variant="outline">
                  +{participants.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="w-full justify-start">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            {(deal.type === "t-m" || deal.type === "outstaff") && (
              <TabsTrigger value="billing">Time & Billing</TabsTrigger>
            )}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="p-6">
              <h3 className="m-0 mb-4">Timeline</h3>
              
              <div className="space-y-4">
                {timeline.map((item, index) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      {index < timeline.length - 1 && (
                        <div className="w-0.5 h-full bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium m-0 mb-1">{item.event}</p>
                      <p className="text-xs text-muted-foreground m-0">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="m-0 mb-4">Deal Details</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <Label className="text-muted-foreground">Client</Label>
                    <p className="font-medium mt-1">{deal.client}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Role</Label>
                    <p className="font-medium mt-1">{deal.role}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Type</Label>
                    <p className="font-medium mt-1 capitalize">
                      {deal.type === "t-m" ? "Time & Materials" : deal.type}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="m-0 mb-4">Key Contacts</h3>
                <div className="space-y-2">
                  {participants.filter(p => p.type !== "candidate").map((participant) => (
                    <div key={participant.id} className="flex items-center gap-2 text-sm">
                      <Avatar className="w-8 h-8 rounded-lg">
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-lg text-xs">
                          {participant.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium m-0 text-sm truncate">{participant.name}</p>
                        <p className="text-xs text-muted-foreground m-0">{participant.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="m-0">Messages</h3>
                <div className="flex items-center gap-2">
                  <Switch 
                    id="internal-toggle"
                    checked={internalNotesOnly}
                    onCheckedChange={setInternalNotesOnly}
                  />
                  <Label htmlFor="internal-toggle" className="cursor-pointer text-sm m-0">
                    Internal notes only
                  </Label>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                {messages
                  .filter(msg => !internalNotesOnly || msg.internal)
                  .map((message) => (
                    <div 
                      key={message.id} 
                      className={`p-4 rounded-lg ${
                        message.internal 
                          ? "bg-warning/5 border border-warning/20" 
                          : "bg-accent"
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <Avatar className="w-8 h-8 rounded-lg">
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-lg text-xs">
                            {message.author.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium m-0 text-sm">{message.author}</p>
                            <span className="text-xs text-muted-foreground">·</span>
                            <p className="text-xs text-muted-foreground m-0">{message.timestamp}</p>
                            {message.internal && (
                              <Badge variant="outline" className="border-warning text-warning text-xs">
                                Internal
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm m-0">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Message Composer */}
              <div className="space-y-3">
                <Textarea 
                  placeholder="Write a message..."
                  className="min-h-[100px]"
                />
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Paperclip className="w-4 h-4" />
                    Attach
                  </Button>
                  <div className="flex items-center gap-2">
                    <Switch id="send-internal" />
                    <Label htmlFor="send-internal" className="cursor-pointer text-sm m-0">
                      Internal only
                    </Label>
                    <Button className="bg-accent-brand hover:bg-accent-brand-hover gap-2 min-h-[44px]">
                      <Send className="w-4 h-4" />
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="m-0">Documents</h3>
                <Button variant="outline" className="gap-2 min-h-[44px]">
                  <Paperclip className="w-4 h-4" />
                  Upload
                </Button>
              </div>

              <div className="space-y-2">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-4 rounded-lg bg-accent">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium m-0 text-sm truncate">{doc.name}</p>
                        <p className="text-xs text-muted-foreground m-0">Uploaded {doc.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Label className="text-xs text-muted-foreground m-0">Visible to:</Label>
                      {doc.visibleTo.map((party, index) => (
                        <Badge key={index} variant="outline" className="text-xs capitalize">
                          {party}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Candidates Tab */}
          <TabsContent value="candidates" className="space-y-6">
            <Card className="p-6">
              <h3 className="m-0 mb-4">Candidate</h3>
              
              {participants
                .filter(p => p.type === "candidate" || p.type === "supplier")
                .map((candidate) => (
                  <div key={candidate.id} className="p-4 rounded-lg bg-accent">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12 rounded-lg">
                        <AvatarFallback className="bg-gradient-to-br from-accent-brand to-blue-600 text-white rounded-lg">
                          {candidate.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium m-0">{candidate.name}</p>
                        <p className="text-sm text-muted-foreground m-0">Submitted Oct 3, 2024</p>
                      </div>
                      <Button variant="outline" className="min-h-[44px]">
                        View Profile
                      </Button>
                    </div>
                  </div>
                ))}
            </Card>
          </TabsContent>

          {/* Finance Tab (Placement) */}
          {deal.type === "placement" && currentTab === "billing" && (
            <TabsContent value="billing" className="space-y-6">
              {/* Money Flow Diagram */}
              <MoneyFlowDiagram
                dealType="placement"
                parties={{
                  agency: "Elite Recruiters",
                  client: "RetailCo"
                }}
                amounts={{
                  placementFee: "$22,500 (25%)"
                }}
              />

              <Card className="p-6">
                <h3 className="m-0 mb-4">Placement Fee Details</h3>
                
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 rounded-lg bg-accent">
                    <Label className="text-muted-foreground">Base Salary</Label>
                    <p className="text-2xl font-semibold mt-1">$90,000</p>
                    <p className="text-sm text-muted-foreground mt-1 m-0">Annual</p>
                  </div>
                  <div className="p-4 rounded-lg bg-accent">
                    <Label className="text-muted-foreground">Fee Rate</Label>
                    <p className="text-2xl font-semibold mt-1">25%</p>
                    <p className="text-sm text-muted-foreground mt-1 m-0">Of first year salary</p>
                  </div>
                  <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                    <Label className="text-muted-foreground">Placement Fee</Label>
                    <p className="text-2xl font-semibold mt-1 text-success">$22,500</p>
                    <p className="text-sm text-muted-foreground mt-1 m-0">Due on start date</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-purple-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium m-0 mb-1">Guarantee Period</p>
                      <p className="text-sm text-muted-foreground m-0 mb-3">
                        90 days from start date (Oct 15, 2024 - Jan 13, 2025)
                      </p>
                      <p className="text-xs text-muted-foreground m-0">
                        If the candidate leaves or is terminated within the guarantee period, 
                        a pro-rated refund or replacement applies per the placement agreement.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h4 className="m-0 mb-4">Payment Schedule</h4>
                <div className="space-y-2">
                  {[
                    { milestone: "Candidate starts", date: "Oct 15, 2024", amount: "$22,500", status: "Pending" },
                    { milestone: "30-day check-in", date: "Nov 14, 2024", amount: "—", status: "Scheduled" },
                    { milestone: "Guarantee period ends", date: "Jan 13, 2025", amount: "—", status: "Scheduled" },
                  ].map((payment, i) => (
                    <div key={i} className="p-3 rounded-lg bg-accent flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium m-0 text-sm">{payment.milestone}</p>
                        <p className="text-xs text-muted-foreground m-0">{payment.date}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {payment.amount !== "—" && (
                          <p className="font-semibold m-0">{payment.amount}</p>
                        )}
                        <Badge 
                          variant={payment.status === "Pending" ? "default" : "outline"}
                          className={payment.status === "Pending" ? "bg-warning" : ""}
                        >
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          )}

          {/* Time & Billing Tab (T&M only) */}
          {(deal.type === "t-m" || deal.type === "outstaff") && (
            <TabsContent value="billing" className="space-y-6">
              {/* Money Flow Diagram */}
              <MoneyFlowDiagram
                dealType={deal.type}
                parties={{
                  agency: "Elite Recruiters",
                  client: "RetailCo",
                  supplier: "Sarah Chen (Freelancer)"
                }}
                amounts={{
                  clientToAgency: "$100/hr",
                  agencyToSupplier: "$75/hr"
                }}
              />

              <Card className="p-6">
                <h3 className="m-0 mb-4">Hours & Invoices</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Timesheet tracking and invoice management for this engagement.
                </p>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-accent">
                    <Label className="text-muted-foreground">This Week</Label>
                    <p className="text-2xl font-semibold mt-1">32h</p>
                    <p className="text-sm text-success mt-1 m-0">+8% vs last week</p>
                  </div>
                  <div className="p-4 rounded-lg bg-accent">
                    <Label className="text-muted-foreground">This Month</Label>
                    <p className="text-2xl font-semibold mt-1">128h</p>
                    <p className="text-sm text-muted-foreground mt-1 m-0">~32h/week avg</p>
                  </div>
                  <div className="p-4 rounded-lg bg-accent">
                    <Label className="text-muted-foreground">Pending Invoices</Label>
                    <p className="text-2xl font-semibold mt-1">$12,800</p>
                    <p className="text-sm text-warning mt-1 m-0">Awaiting approval</p>
                  </div>
                </div>
              </Card>

              {/* Recent Timesheets */}
              <Card className="p-6">
                <h4 className="m-0 mb-4">Recent Timesheets</h4>
                <div className="space-y-2">
                  {[
                    { week: "Oct 1-7", hours: 40, status: "Approved" },
                    { week: "Oct 8-14", hours: 38, status: "Approved" },
                    { week: "Oct 15-21", hours: 32, status: "Pending" },
                  ].map((sheet, i) => (
                    <div key={i} className="p-3 rounded-lg bg-accent flex items-center justify-between">
                      <div>
                        <p className="font-medium m-0 text-sm">{sheet.week}</p>
                        <p className="text-xs text-muted-foreground m-0">{sheet.hours} hours</p>
                      </div>
                      <Badge 
                        variant={sheet.status === "Approved" ? "default" : "outline"}
                        className={sheet.status === "Approved" ? "bg-success" : ""}
                      >
                        {sheet.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
