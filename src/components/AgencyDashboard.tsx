import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  Briefcase, Clock, FileText, ChevronRight, 
  TrendingUp, Users, Building2, DollarSign,
  Plus, ArrowRight
} from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { AgencyRoleBadge, type AgencyRole } from "./AgencyRoleBadge";
import { VisibilityScopeBadge } from "./VisibilityScopeBadge";

interface AgencyDashboardProps {
  userRole?: AgencyRole;
  userName?: string;
}

export function AgencyDashboard({ 
  userRole = "account-manager",
  userName = "James Wilson"
}: AgencyDashboardProps) {
  const [selectedTeam, setSelectedTeam] = useState("my");

  // Mock data
  const myDeals = [
    {
      id: "1",
      title: "RetailCo · Senior Full-Stack Developer",
      status: "interview",
      candidate: "Sarah Chen",
      lastUpdate: "2 hours ago",
      scope: "participants" as const
    },
    {
      id: "2",
      title: "TechCorp · Product Manager",
      status: "submitted",
      candidate: "Mike Rodriguez",
      lastUpdate: "1 day ago",
      scope: "participants" as const
    },
    {
      id: "3",
      title: "StartupX · Senior Designer",
      status: "offer",
      candidate: "Alex Kim",
      lastUpdate: "3 hours ago",
      scope: "team" as const,
      teamName: "Enterprise Team"
    }
  ];

  const awaitingResponse = [
    {
      id: "1",
      client: "RetailCo",
      role: "Senior Developer",
      action: "Profile review",
      daysWaiting: 2
    },
    {
      id: "2",
      client: "FinanceCo",
      role: "Data Analyst",
      action: "Interview feedback",
      daysWaiting: 5
    }
  ];

  const documentsToSign = [
    {
      id: "1",
      title: "Placement Agreement - Sarah Chen @ RetailCo",
      type: "Placement Agreement",
      uploadedBy: "Lisa Chen",
      uploadedAt: "Today"
    },
    {
      id: "2",
      title: "MSA - TechCorp",
      type: "MSA",
      uploadedBy: "Tom Anderson",
      uploadedAt: "Yesterday"
    }
  ];

  const stats = {
    activeDealsMy: 8,
    activeDealsTea: 23,
    thisMonthPlacements: 3,
    thisMonthRevenue: "$45,200"
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "interview": return "bg-purple-500 text-white";
      case "submitted": return "bg-blue-500 text-white";
      case "offer": return "bg-warning text-white";
      case "signed": return "bg-success text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with team switcher */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-1">Dashboard</h1>
          <p className="text-muted-foreground m-0">
            Welcome back, <span className="font-medium text-foreground">{userName}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <AgencyRoleBadge role={userRole} />
          <Select value={selectedTeam} onValueChange={setSelectedTeam}>
            <SelectTrigger className="w-48 min-h-[44px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="my">My Pipeline</SelectItem>
              <SelectItem value="enterprise">Enterprise Team</SelectItem>
              <SelectItem value="smb">SMB Team</SelectItem>
              <SelectItem value="all">All Agency</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-brand/10 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-accent-brand" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground m-0">Active Deals</p>
              <p className="text-2xl font-semibold m-0 mt-1">
                {selectedTeam === "my" ? stats.activeDealsMy : stats.activeDealsTea}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground m-0">This Month</p>
              <p className="text-2xl font-semibold m-0 mt-1">{stats.thisMonthPlacements}</p>
              <p className="text-xs text-muted-foreground m-0">Placements</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground m-0">Revenue</p>
              <p className="text-2xl font-semibold m-0 mt-1">{stats.thisMonthRevenue}</p>
              <p className="text-xs text-muted-foreground m-0">This Month</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground m-0">Team Size</p>
              <p className="text-2xl font-semibold m-0 mt-1">20</p>
              <p className="text-xs text-muted-foreground m-0">Members</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Pipeline Cards Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* My Deals */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="m-0">My Deals</h3>
            <Badge variant="secondary">{myDeals.length}</Badge>
          </div>

          <div className="space-y-3">
            {myDeals.map((deal) => (
              <button
                key={deal.id}
                className="w-full p-3 rounded-lg bg-accent hover:bg-accent/70 transition-colors text-left border-0"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="font-medium m-0 text-sm flex-1">{deal.title}</p>
                  <Badge className={getStatusColor(deal.status) + " text-xs capitalize"}>
                    {deal.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="w-6 h-6 rounded-lg">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-lg text-xs">
                      {deal.candidate.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm text-muted-foreground m-0">{deal.candidate}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground m-0">{deal.lastUpdate}</p>
                  <VisibilityScopeBadge scope={deal.scope} teamName={deal.teamName} className="text-xs" />
                </div>
              </button>
            ))}
          </div>

          <Button variant="outline" className="w-full mt-4 gap-2 min-h-[44px]">
            <Plus className="w-4 h-4" />
            New Deal
          </Button>
        </Card>

        {/* Awaiting Client Response */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="m-0">Awaiting Response</h3>
            <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
              {awaitingResponse.length}
            </Badge>
          </div>

          <div className="space-y-3">
            {awaitingResponse.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg bg-accent"
              >
                <div className="flex items-start gap-2 mb-2">
                  <Clock className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium m-0 text-sm">{item.client}</p>
                    <p className="text-xs text-muted-foreground m-0">{item.role}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground m-0">{item.action}</p>
                  <Badge variant="outline" className="text-xs">
                    {item.daysWaiting}d waiting
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full mt-4 gap-2 min-h-[44px]">
            View All
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Card>

        {/* Documents to Sign */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="m-0">Documents to Sign</h3>
            <Badge variant="secondary" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
              {documentsToSign.length}
            </Badge>
          </div>

          <div className="space-y-3">
            {documentsToSign.map((doc) => (
              <button
                key={doc.id}
                className="w-full p-3 rounded-lg bg-accent hover:bg-accent/70 transition-colors text-left border-0"
              >
                <div className="flex items-start gap-2 mb-2">
                  <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium m-0 text-sm truncate">{doc.title}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {doc.type}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground m-0">
                    By {doc.uploadedBy}
                  </p>
                  <p className="text-xs text-muted-foreground m-0">{doc.uploadedAt}</p>
                </div>
              </button>
            ))}
          </div>

          <Button variant="outline" className="w-full mt-4 gap-2 min-h-[44px]">
            View All
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="m-0 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button variant="outline" className="gap-2 justify-start min-h-[44px]">
            <Plus className="w-4 h-4" />
            New Candidate
          </Button>
          <Button variant="outline" className="gap-2 justify-start min-h-[44px]">
            <Building2 className="w-4 h-4" />
            New Client
          </Button>
          <Button variant="outline" className="gap-2 justify-start min-h-[44px]">
            <Briefcase className="w-4 h-4" />
            New Deal
          </Button>
          <Button variant="outline" className="gap-2 justify-start min-h-[44px]">
            <FileText className="w-4 h-4" />
            Upload Document
          </Button>
        </div>
      </Card>
    </div>
  );
}
