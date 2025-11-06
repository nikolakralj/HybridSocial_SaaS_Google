import { 
  Building2, Mail, User, Calendar, DollarSign, 
  FileText, Clock, CheckCircle, AlertCircle, Send, Link2, Eye,
  Copy, Settings, UserMinus, Briefcase, Shield, Users
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner@2.0.3";

type WorkerRecordStatus = "unclaimed" | "claimed" | "active" | "pending-offboarding" | "archived";

interface WorkerRecordViewEnhancedProps {
  status?: WorkerRecordStatus;
  isCompanyView?: boolean;
  isPersonView?: boolean;
}

export function WorkerRecordViewEnhanced({ 
  status = "unclaimed",
  isCompanyView = true,
  isPersonView = false
}: WorkerRecordViewEnhancedProps) {
  // Mock data
  const workerRecord = {
    id: "wr-123",
    personName: "Sarah Chen",
    personalProfileLinked: status === "claimed" || status === "active",
    personalProfileId: status === "claimed" || status === "active" ? "pp-456" : null,
    
    legalName: "Sarah Chen",
    workEmail: "sarah.chen@techventures.com",
    internalId: "EMP-2024-089",
    
    internalTitle: "Senior Full-Stack Developer",
    relationshipType: "contractor" as const,
    department: "Engineering",
    manager: "Alex Martinez",
    team: "Platform Team",
    startDate: "October 15, 2024",
    endDate: null,
    
    costRate: 120,
    billableRate: 180,
    currency: "USD",
    overtimeRules: "1.5x after 40h/week",
    
    timesheetApprover: "Alex Martinez (Manager)",
    invoiceApprover: "Finance Team",
    
    currentProjects: [
      {
        id: "1",
        name: "Enterprise Dashboard Redesign",
        role: "Lead Developer",
        allocation: 80,
        client: "RetailCo"
      }
    ],
    
    contracts: [
      {
        id: "c-1",
        name: "MSA-2024-089.pdf",
        type: "MSA/SOW" as const,
        status: "active" as const,
        startDate: "Oct 15, 2024",
        endDate: "Apr 15, 2025",
        parties: ["TechVentures Inc.", "RetailCo", "Sarah Chen"]
      }
    ],
    
    timesheetSettings: {
      period: "weekly" as const,
      submissionDay: "Friday",
      approvalChain: ["Alex Martinez (Manager)", "Finance Team"]
    },
    
    documents: [
      {
        id: "1",
        name: "Contract_MSA.pdf",
        date: "Oct 15, 2024",
        visibleTo: ["TechVentures Inc.", "Sarah Chen"]
      },
      {
        id: "2",
        name: "NDA.pdf",
        date: "Oct 15, 2024",
        visibleTo: ["TechVentures Inc.", "RetailCo", "Sarah Chen"]
      }
    ],
    
    totalHoursThisWeek: 32,
    ownerOrg: "TechVentures Inc.",
    createdAt: "September 28, 2024",
    lastUpdated: "October 9, 2024"
  };

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(`https://workgraph.com/claim/${workerRecord.id}`);
    toast.success("Invite link copied to clipboard");
  };

  const handleSendInvite = () => {
    toast.success("Invite email sent to " + workerRecord.workEmail);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1280px] mx-auto px-6 py-6 space-y-6">
        {/* Claim Banner (unclaimed state) */}
        {status === "unclaimed" && isCompanyView && (
          <div className="p-4 rounded-xl border-2 border-accent-brand/20 bg-accent-brand/5">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-accent-brand/10 flex-shrink-0">
                <Link2 className="w-5 h-5 text-accent-brand" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="m-0 mb-1">
                  We created a private Worker Record for {workerRecord.personName} at {workerRecord.ownerOrg}.
                </h4>
                <p className="text-sm text-muted-foreground m-0 mb-3">
                  Invite them to claim and link their personal profile.
                </p>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    className="bg-accent-brand hover:bg-accent-brand-hover gap-2 min-h-[44px]"
                    onClick={handleSendInvite}
                  >
                    <Send className="w-4 h-4" />
                    Send Invite
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2 min-h-[44px]"
                    onClick={handleCopyInviteLink}
                  >
                    <Copy className="w-4 h-4" />
                    Copy Invite Link
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header Card */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-6 flex-1">
              <Avatar className="w-20 h-20 rounded-xl">
                <AvatarFallback className="bg-gradient-to-br from-accent-brand to-purple-600 text-white text-xl rounded-xl">
                  SC
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="m-0">{workerRecord.personName}</h1>
                  <Badge variant="outline" className={
                    status === "claimed" || status === "active"
                      ? "border-success text-success"
                      : "border-warning text-warning"
                  }>
                    {status === "unclaimed" && "Unclaimed"}
                    {status === "claimed" && "Claimed"}
                    {status === "active" && "Active"}
                    {status === "pending-offboarding" && "Offboarding"}
                    {status === "archived" && "Archived"}
                  </Badge>
                </div>

                <p className="text-muted-foreground mb-3">{workerRecord.internalTitle}</p>

                {/* Identity Chip */}
                {workerRecord.personalProfileLinked && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent border border-border mb-3">
                    <Link2 className="w-3.5 h-3.5 text-accent-brand" />
                    <span className="text-sm">Linked to Personal Profile</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2 text-xs -mr-1"
                      onClick={() => toast.info("Opening personal profile...")}
                    >
                      View as Person →
                    </Button>
                  </div>
                )}

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span>{workerRecord.ownerOrg}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{workerRecord.workEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Started {workerRecord.startDate}</span>
                  </div>
                </div>
              </div>
            </div>

            {isCompanyView && (
              <div className="flex items-center gap-2">
                <Button variant="outline" className="gap-2 min-h-[44px]">
                  <Eye className="w-4 h-4" />
                  Privacy
                </Button>
                <Button className="gap-2 min-h-[44px]">
                  <Settings className="w-4 h-4" />
                  Edit
                </Button>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          {isCompanyView && (
            <div className="pt-4 border-t border-border">
              <Label className="text-muted-foreground mb-2 block">Actions</Label>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="gap-2 min-h-[44px]">
                  <Briefcase className="w-4 h-4" />
                  Assign to Contract
                </Button>
                <Button variant="outline" size="sm" className="gap-2 min-h-[44px]">
                  <User className="w-4 h-4" />
                  Change Manager
                </Button>
                <Button variant="outline" size="sm" className="gap-2 min-h-[44px] text-destructive border-destructive hover:bg-destructive/10">
                  <UserMinus className="w-4 h-4" />
                  Offboard
                </Button>
              </div>
            </div>
          )}
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Employment Details */}
            <Card className="p-6">
              <h3 className="m-0 mb-4">Employment Details</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Internal Title</Label>
                  <p className="font-medium mt-1">{workerRecord.internalTitle}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">Relationship Type</Label>
                  <p className="font-medium mt-1 capitalize">{workerRecord.relationshipType}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">Department</Label>
                  <p className="font-medium mt-1">{workerRecord.department}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">Team</Label>
                  <p className="font-medium mt-1">{workerRecord.team}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">Manager</Label>
                  <p className="font-medium mt-1">{workerRecord.manager}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">Internal ID</Label>
                  <p className="font-medium mt-1">{workerRecord.internalId}</p>
                </div>
              </div>
            </Card>

            {/* Rates & Billing */}
            <Card className="p-6">
              <h3 className="m-0 mb-4">Rates & Billing</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Cost Rate</Label>
                  <p className="font-medium mt-1">
                    ${workerRecord.costRate}/{workerRecord.currency === "USD" ? "hour" : "hr"}
                  </p>
                </div>

                <div>
                  <Label className="text-muted-foreground">Billable Rate</Label>
                  <p className="font-medium mt-1">
                    ${workerRecord.billableRate}/{workerRecord.currency === "USD" ? "hour" : "hr"}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <Label className="text-muted-foreground">Overtime Rules</Label>
                  <p className="font-medium mt-1">{workerRecord.overtimeRules}</p>
                </div>
              </div>
            </Card>

            {/* Timesheet Settings */}
            <Card className="p-6">
              <h3 className="m-0 mb-2">Timesheet Settings</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Period, submission schedule, and approval workflow
              </p>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Period</Label>
                    <p className="font-medium mt-1 capitalize">{workerRecord.timesheetSettings.period}</p>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">Submission Day</Label>
                    <p className="font-medium mt-1">{workerRecord.timesheetSettings.submissionDay}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground">Approval Chain</Label>
                  <div className="flex items-center gap-2 mt-2">
                    {workerRecord.timesheetSettings.approvalChain.map((approver, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Badge variant="outline">{approver}</Badge>
                        {index < workerRecord.timesheetSettings.approvalChain.length - 1 && (
                          <span className="text-muted-foreground">→</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {isCompanyView && (
                  <Button variant="outline" size="sm" className="gap-2 min-h-[44px]">
                    <Settings className="w-4 h-4" />
                    Edit Settings
                  </Button>
                )}
              </div>
            </Card>

            {/* Current Projects */}
            <Card className="p-6">
              <h3 className="m-0 mb-4">Current Assignments</h3>
              
              <div className="space-y-3">
                {workerRecord.currentProjects.map((project) => (
                  <div key={project.id} className="p-4 rounded-lg bg-accent">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="m-0 mb-1">{project.name}</h4>
                        <p className="text-sm text-muted-foreground m-0">{project.role}</p>
                      </div>
                      <Badge variant="outline">{project.allocation}% allocated</Badge>
                    </div>
                    {project.client && (
                      <p className="text-xs text-muted-foreground m-0 flex items-center gap-1.5">
                        <Building2 className="w-3 h-3" />
                        Client: {project.client}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Documents with Contract Party Badges */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="m-0">Documents</h3>
                {isCompanyView && (
                  <Button variant="ghost" size="sm" className="h-8">
                    <FileText className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                {workerRecord.documents.map((doc) => (
                  <div key={doc.id} className="p-4 rounded-lg bg-accent">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium m-0 text-sm truncate">{doc.name}</p>
                        <p className="text-xs text-muted-foreground m-0">Updated {doc.date}</p>
                      </div>
                    </div>
                    
                    {/* Contract Party Badges */}
                    <div className="flex items-start gap-2">
                      <Shield className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground m-0 mb-1">Visible to:</p>
                        <div className="flex flex-wrap gap-1">
                          {doc.visibleTo.map((party, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {party}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Privacy & Visibility */}
            <Card className="p-6 border-purple-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-purple-500" />
                <h3 className="m-0">Privacy & Visibility</h3>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="p-3 rounded-lg bg-purple-500/5">
                  <p className="font-medium m-0 mb-1">Organization-Owned</p>
                  <p className="text-xs text-muted-foreground m-0">
                    {workerRecord.ownerOrg} controls this record
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-accent">
                  <p className="font-medium m-0 mb-1">Always Private</p>
                  <p className="text-xs text-muted-foreground m-0">
                    Only visible to authorized users within {workerRecord.ownerOrg}
                  </p>
                </div>

                {workerRecord.personalProfileLinked && (
                  <div className="p-3 rounded-lg bg-accent-brand/5 border border-accent-brand/20">
                    <p className="font-medium m-0 mb-1">Linked Profile</p>
                    <p className="text-xs text-muted-foreground m-0">
                      This person can view their own Worker Record
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Time Tracking */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5" />
                <h3 className="m-0">This Week</h3>
              </div>
              
              <div>
                <p className="text-3xl font-semibold">{workerRecord.totalHoursThisWeek}h</p>
                <p className="text-sm text-muted-foreground mt-1">logged so far</p>
              </div>

              <Button variant="outline" className="w-full mt-4 gap-2 min-h-[44px]">
                <Clock className="w-4 h-4" />
                View Timesheets
              </Button>
            </Card>

            {/* Contracts */}
            <Card className="p-6">
              <h3 className="m-0 mb-4">Contracts</h3>
              
              <div className="space-y-3">
                {workerRecord.contracts.map((contract) => (
                  <div key={contract.id} className="p-3 rounded-lg bg-accent">
                    <div className="flex items-center justify-between mb-2">
                      <Badge 
                        variant="outline"
                        className={contract.status === "active" ? "border-success text-success" : ""}
                      >
                        {contract.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{contract.type}</span>
                    </div>
                    <p className="text-sm font-medium m-0 mb-1">{contract.name}</p>
                    <p className="text-xs text-muted-foreground m-0">
                      {contract.startDate} – {contract.endDate}
                    </p>
                    
                    {/* Contract parties */}
                    <div className="mt-2 pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground m-0 mb-1">Parties:</p>
                      <div className="flex flex-wrap gap-1">
                        {contract.parties.map((party, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {party}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Metadata */}
            <Card className="p-6">
              <h3 className="m-0 mb-4">Record Info</h3>
              
              <div className="space-y-3 text-sm">
                <div>
                  <Label className="text-muted-foreground">Record ID</Label>
                  <p className="font-mono text-xs mt-1">{workerRecord.id}</p>
                </div>

                <Separator />

                <div>
                  <Label className="text-muted-foreground">Created</Label>
                  <p className="mt-1">{workerRecord.createdAt}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">Last Updated</Label>
                  <p className="mt-1">{workerRecord.lastUpdated}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
