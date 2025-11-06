import { useState } from "react";
import { 
  LayoutDashboard, Target, Users, Building2, FileText, 
  DollarSign, MessageSquare, Settings, ChevronRight
} from "lucide-react";
import { AgencyDashboard } from "./AgencyDashboard";
import { CandidatesView } from "./CandidatesView";
import { DealRoom } from "./DealRoom";
import { AgencyWorkspaceWelcome } from "./AgencyWorkspaceWelcome";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ActingAsChip } from "./ActingAsChip";
import { AgencyRoleBadge, type AgencyRole } from "./AgencyRoleBadge";
import { Avatar, AvatarFallback } from "./ui/avatar";

type AgencyTab = 
  | "dashboard" 
  | "recruit" 
  | "candidates" 
  | "clients" 
  | "contracts" 
  | "finance" 
  | "messages" 
  | "settings"
  | "deal-room"; // Special state for viewing a deal

interface AgencyWorkspaceProps {
  userName?: string;
  userRole?: AgencyRole;
  agencyName?: string;
}

export function AgencyWorkspace({ 
  userName = "James Wilson",
  userRole = "account-manager",
  agencyName = "Elite Recruiters"
}: AgencyWorkspaceProps) {
  const [currentTab, setCurrentTab] = useState<AgencyTab>("dashboard");

  const tabs = [
    { id: "dashboard" as AgencyTab, label: "Dashboard", icon: LayoutDashboard },
    { id: "recruit" as AgencyTab, label: "Recruit", icon: Target },
    { id: "candidates" as AgencyTab, label: "Candidates", icon: Users },
    { id: "clients" as AgencyTab, label: "Clients", icon: Building2 },
    { id: "contracts" as AgencyTab, label: "Contracts", icon: FileText },
    { id: "finance" as AgencyTab, label: "Finance", icon: DollarSign },
    { id: "messages" as AgencyTab, label: "Messages", icon: MessageSquare },
    { id: "settings" as AgencyTab, label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            {/* Logo and Context */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                  {agencyName.split(' ').map(w => w[0]).join('')}
                </div>
                <div>
                  <h4 className="m-0">{agencyName}</h4>
                  <ActingAsChip 
                    userName={userName} 
                    contextName={agencyName}
                    contextType="agency"
                  />
                </div>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <AgencyRoleBadge role={userRole} />
              <Avatar className="w-10 h-10 rounded-lg cursor-pointer">
                <AvatarFallback className="bg-gradient-to-br from-accent-brand to-blue-600 text-white rounded-lg">
                  {userName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap
                    ${currentTab === tab.id
                      ? "border-accent-brand text-accent-brand font-medium"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1440px] mx-auto px-6 py-6">
        {/* Welcome Banner - only shown on dashboard */}
        {currentTab === "dashboard" && (
          <div className="mb-6">
            <AgencyWorkspaceWelcome />
          </div>
        )}

        {currentTab === "dashboard" && (
          <AgencyDashboard userName={userName} userRole={userRole} />
        )}

        {currentTab === "candidates" && (
          <CandidatesView />
        )}

        {currentTab === "deal-room" && (
          <DealRoom dealType="placement" status="interview" />
        )}

        {currentTab === "recruit" && (
          <RecruitPlaceholder onViewDeal={() => setCurrentTab("deal-room")} />
        )}

        {currentTab === "clients" && (
          <ClientsPlaceholder />
        )}

        {currentTab === "contracts" && (
          <ContractsPlaceholder />
        )}

        {currentTab === "finance" && (
          <FinancePlaceholder />
        )}

        {currentTab === "messages" && (
          <MessagesPlaceholder />
        )}

        {currentTab === "settings" && (
          <SettingsPlaceholder />
        )}
      </div>
    </div>
  );
}

// Placeholder components for other views
function RecruitPlaceholder({ onViewDeal }: { onViewDeal: () => void }) {
  const jobs = [
    { id: "1", client: "RetailCo", role: "Senior Full-Stack Developer", stage: "Interview", candidates: 2 },
    { id: "2", client: "TechCorp", role: "Product Manager", stage: "Submitted", candidates: 1 },
    { id: "3", client: "StartupX", role: "Senior Designer", stage: "Offer", candidates: 1 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-1">Recruit</h1>
        <p className="text-muted-foreground m-0">
          Client roles and active recruitment pipelines
        </p>
      </div>

      <div className="grid gap-4">
        {jobs.map((job) => (
          <Card key={job.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <p className="font-medium m-0">{job.client}</p>
                  <span className="text-muted-foreground">·</span>
                  <p className="text-muted-foreground m-0">{job.role}</p>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant="outline">{job.stage}</Badge>
                  <Badge variant="secondary">{job.candidates} candidates</Badge>
                </div>
              </div>
              <Button variant="outline" onClick={onViewDeal} className="gap-2 min-h-[44px]">
                View Pipeline
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ClientsPlaceholder() {
  const clients = [
    { id: "1", name: "RetailCo", type: "Enterprise", activeJobs: 3, revenue: "$125K" },
    { id: "2", name: "TechCorp", type: "Mid-Market", activeJobs: 2, revenue: "$85K" },
    { id: "3", name: "StartupX", type: "Startup", activeJobs: 1, revenue: "$45K" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-1">Clients</h1>
          <p className="text-muted-foreground m-0">
            Your client accounts and active roles
          </p>
        </div>
        <Button className="gap-2 bg-accent-brand hover:bg-accent-brand-hover min-h-[44px]">
          <Building2 className="w-4 h-4" />
          Add Client
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {clients.map((client) => (
          <Card key={client.id} className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                {client.name.substring(0, 2)}
              </div>
              <div className="flex-1">
                <h3 className="m-0 mb-1">{client.name}</h3>
                <Badge variant="outline">{client.type}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground m-0">Active Jobs</p>
                <p className="font-semibold m-0 mt-1">{client.activeJobs}</p>
              </div>
              <div>
                <p className="text-muted-foreground m-0">Revenue (YTD)</p>
                <p className="font-semibold m-0 mt-1">{client.revenue}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ContractsPlaceholder() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-1">Contracts</h1>
        <p className="text-muted-foreground m-0">
          Placement agreements, MSAs, and SOWs
        </p>
      </div>

      <Card className="p-12 text-center">
        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="m-0 mb-2">Contracts view coming soon</h3>
        <p className="text-sm text-muted-foreground m-0">
          Track placement agreements, MSAs, SOWs, and guarantee periods
        </p>
      </Card>
    </div>
  );
}

function FinancePlaceholder() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-1">Finance</h1>
        <p className="text-muted-foreground m-0">
          Fees, invoices, and revenue tracking
        </p>
      </div>

      <Card className="p-12 text-center">
        <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="m-0 mb-2">Finance view coming soon</h3>
        <p className="text-sm text-muted-foreground m-0">
          View placement fees, T&M invoices, and revenue reports
        </p>
      </Card>
    </div>
  );
}

function MessagesPlaceholder() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-1">Messages</h1>
        <p className="text-muted-foreground m-0">
          Threaded conversations by Deal Room
        </p>
      </div>

      <Card className="p-12 text-center">
        <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="m-0 mb-2">Messages view coming soon</h3>
        <p className="text-sm text-muted-foreground m-0">
          All your deal room conversations in one place
        </p>
      </Card>
    </div>
  );
}

function SettingsPlaceholder() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-1">Settings</h1>
        <p className="text-muted-foreground m-0">
          Agency configuration and team management
        </p>
      </div>

      <Card className="p-12 text-center">
        <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="m-0 mb-2">Settings view coming soon</h3>
        <p className="text-sm text-muted-foreground m-0">
          Manage team members, roles, and agency preferences
        </p>
      </Card>
    </div>
  );
}
