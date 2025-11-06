import { 
  Building2, Mail, User, Calendar, DollarSign, 
  FileText, Clock, CheckCircle, AlertCircle, Send, Link2, Eye
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { ClaimRecordBanner } from "./ClaimRecordBanner";

type WorkerRecordStatus = "unclaimed" | "claimed" | "active" | "pending-offboarding" | "archived";

interface WorkerRecordViewProps {
  status?: WorkerRecordStatus;
  isCompanyView?: boolean; // true if viewing as the owning company
  isPersonView?: boolean; // true if viewing as the linked person
}

export function WorkerRecordView({ 
  status = "claimed",
  isCompanyView = true,
  isPersonView = false
}: WorkerRecordViewProps) {
  // Mock data
  const workerRecord = {
    id: "wr-123",
    personName: "Sarah Chen",
    personalProfileLinked: status === "claimed" || status === "active",
    personalProfileId: status === "claimed" || status === "active" ? "pp-456" : null,
    
    // Basic identity (org-owned)
    legalName: "Sarah Chen",
    workEmail: "sarah.chen@techventures.com",
    internalId: "EMP-2024-089",
    
    // Employment data
    internalTitle: "Senior Full-Stack Developer",
    relationshipType: "contractor" as const,
    department: "Engineering",
    manager: "Alex Martinez",
    team: "Platform Team",
    startDate: "October 15, 2024",
    endDate: null,
    
    // Rates & billing
    costRate: 120,
    billableRate: 180,
    currency: "USD",
    overtimeRules: "1.5x after 40h/week",
    
    // Approvers
    timesheetApprover: "Alex Martinez",
    invoiceApprover: "Finance Team",
    
    // Assignments
    currentProjects: [
      {
        id: "1",
        name: "Enterprise Dashboard Redesign",
        role: "Lead Developer",
        allocation: 80,
        location: "Remote"
      },
      {
        id: "2",
        name: "API Migration",
        role: "Consultant",
        allocation: 20,
        location: "Remote"
      }
    ],
    
    // Contracts
    contracts: [
      {
        id: "c-1",
        type: "MSA/SOW" as const,
        status: "active" as const,
        startDate: "Oct 15, 2024",
        endDate: "Apr 15, 2025"
      }
    ],
    
    // Timesheet settings
    timesheetSchedule: "weekly" as const,
    submissionDay: "Friday",
    totalHoursThisWeek: 32,
    
    // Metadata
    ownerOrg: "TechVentures Inc.",
    createdAt: "September 28, 2024",
    lastUpdated: "October 9, 2024"
  };

  const getStatusBadge = () => {
    switch (status) {
      case "unclaimed":
        return (
          <Badge variant="outline" className="border-warning text-warning gap-1.5">
            <AlertCircle className="w-3 h-3" />
            Unclaimed
          </Badge>
        );
      case "claimed":
      case "active":
        return (
          <Badge variant="outline" className="border-success text-success gap-1.5">
            <CheckCircle className="w-3 h-3" />
            Active
          </Badge>
        );
      case "pending-offboarding":
        return (
          <Badge variant="outline" className="border-muted-foreground gap-1.5">
            <Clock className="w-3 h-3" />
            Pending Offboarding
          </Badge>
        );
      case "archived":
        return (
          <Badge variant="outline" className="border-muted gap-1.5">
            Archived
          </Badge>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1280px] mx-auto px-6 py-6 space-y-6">
        {/* Claim Banner (unclaimed + company view) */}
        {status === "unclaimed" && isCompanyView && (
          <div className="bg-warning/5 border-2 border-warning rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-warning/10">
                <AlertCircle className="w-5 h-5 text-warning" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="m-0">Worker Record Created</h3>
                  <Badge variant="outline" className="border-warning text-warning">
                    Unclaimed
                  </Badge>
                </div>

                <p className="text-muted-foreground mb-4">
                  We created this Worker Record for <strong>{workerRecord.personName}</strong>. 
                  It's private to {workerRecord.ownerOrg}. Send invite to let them claim and 
                  link their personal profile.
                </p>

                <div className="flex items-center gap-3">
                  <Button className="bg-accent-brand hover:bg-accent-brand-hover gap-2 min-h-[44px]">
                    <Send className="w-4 h-4" />
                    Send Invite
                  </Button>
                  <Button variant="outline" className="min-h-[44px]">
                    Copy Invite Link
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground mt-3">
                  You can start contracts and capture time using this Worker Record 
                  immediately. The person can claim it later.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header Card */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-6 flex-1">
              <Avatar className="w-24 h-24 rounded-xl">
                <AvatarFallback className="bg-gradient-to-br from-warning to-orange-600 text-white text-2xl rounded-xl">
                  {workerRecord.personName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="m-0">
                    {status === "unclaimed" ? `${workerRecord.personName} (Unclaimed)` : workerRecord.personName}
                  </h1>
                  {getStatusBadge()}
                </div>

                <p className="text-muted-foreground mb-2">{workerRecord.internalTitle}</p>

                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{workerRecord.ownerOrg}</span>
                  <Badge variant="outline" className="text-xs ml-2">
                    <Eye className="w-3 h-3 mr-1" />
                    Private
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{workerRecord.workEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Started {workerRecord.startDate}</span>
                  </div>
                </div>

                {/* Link to Personal Profile (if claimed) */}
                {workerRecord.personalProfileLinked && (
                  <div className="mt-4 p-3 rounded-lg bg-accent flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Link2 className="w-4 h-4 text-accent-brand" />
                      <span className="text-sm">
                        Linked to Personal Profile
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 gap-2">
                      View as Person
                      <User className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isCompanyView && (
                <>
                  <Button variant="outline" className="min-h-[44px]">
                    Assign to Contract
                  </Button>
                  <Button className="min-h-[44px]">
                    Edit
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 pt-6 border-t border-border">
            <div className="p-4 rounded-lg bg-accent">
              <p className="text-sm text-muted-foreground mb-1">Billable Rate</p>
              <p className="font-medium m-0">
                ${workerRecord.billableRate}/{workerRecord.currency === "USD" ? "hr" : "hour"}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-accent">
              <p className="text-sm text-muted-foreground mb-1">Hours This Week</p>
              <p className="font-medium m-0">{workerRecord.totalHoursThisWeek}h</p>
            </div>
            <div className="p-4 rounded-lg bg-accent">
              <p className="text-sm text-muted-foreground mb-1">Active Projects</p>
              <p className="font-medium m-0">{workerRecord.currentProjects.length}</p>
            </div>
            <div className="p-4 rounded-lg bg-accent">
              <p className="text-sm text-muted-foreground mb-1">Contracts</p>
              <p className="font-medium m-0">{workerRecord.contracts.length}</p>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Employment Details */}
            <Card className="p-6">
              <h3 className="m-0 mb-4">Employment Details</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Relationship Type</p>
                  <p className="font-medium capitalize">{workerRecord.relationshipType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Internal ID</p>
                  <p className="font-medium">{workerRecord.internalId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Department</p>
                  <p className="font-medium">{workerRecord.department}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Team</p>
                  <p className="font-medium">{workerRecord.team}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Manager</p>
                  <p className="font-medium">{workerRecord.manager}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Start Date</p>
                  <p className="font-medium">{workerRecord.startDate}</p>
                </div>
              </div>
            </Card>

            {/* Rates & Billing */}
            {isCompanyView && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5" />
                  <h3 className="m-0">Rates & Billing</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Cost Rate (Internal)</p>
                    <p className="font-medium">${workerRecord.costRate}/hr</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Billable Rate (Client)</p>
                    <p className="font-medium">${workerRecord.billableRate}/hr</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Currency</p>
                    <p className="font-medium">{workerRecord.currency}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Overtime Rules</p>
                    <p className="font-medium">{workerRecord.overtimeRules}</p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Timesheet Approver</p>
                    <p className="font-medium">{workerRecord.timesheetApprover}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Invoice Approver</p>
                    <p className="font-medium">{workerRecord.invoiceApprover}</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Current Projects */}
            <Card className="p-6">
              <h3 className="m-0 mb-4">Current Projects & Assignments</h3>

              <div className="space-y-3">
                {workerRecord.currentProjects.map((project) => (
                  <div 
                    key={project.id} 
                    className="p-4 rounded-lg bg-accent flex items-center justify-between"
                  >
                    <div>
                      <h4 className="m-0 mb-1">{project.name}</h4>
                      <p className="text-sm text-muted-foreground m-0">
                        {project.role} · {project.location}
                      </p>
                    </div>
                    <Badge variant="outline">{project.allocation}% allocated</Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Contracts */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5" />
                <h3 className="m-0">Contracts & Documents</h3>
              </div>

              <div className="space-y-3">
                {workerRecord.contracts.map((contract) => (
                  <div 
                    key={contract.id} 
                    className="p-4 rounded-lg border border-border flex items-center justify-between hover:bg-accent transition-colors cursor-pointer"
                  >
                    <div>
                      <h4 className="m-0 mb-1">{contract.type}</h4>
                      <p className="text-sm text-muted-foreground m-0">
                        {contract.startDate} - {contract.endDate || "Ongoing"}
                      </p>
                    </div>
                    <Badge variant="outline" className="capitalize border-success text-success">
                      {contract.status}
                    </Badge>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-4 min-h-[44px]">
                Add Contract
              </Button>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Timesheet Settings */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5" />
                <h3 className="m-0">Timesheet Settings</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Schedule</p>
                  <p className="font-medium capitalize">{workerRecord.timesheetSchedule}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Submission Day</p>
                  <p className="font-medium">{workerRecord.submissionDay}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">This Week</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium m-0">{workerRecord.totalHoursThisWeek}h logged</p>
                    {workerRecord.totalHoursThisWeek < 40 && (
                      <Badge variant="outline" className="text-xs">
                        In progress
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-4 min-h-[44px]">
                View Timesheets
              </Button>
            </Card>

            {/* Privacy Notice */}
            <Card className="p-6 bg-muted">
              <div className="flex items-start gap-3">
                <Eye className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="m-0 mb-2 text-sm">Privacy & Visibility</h4>
                  <p className="text-xs text-muted-foreground m-0">
                    This Worker Record is private to {workerRecord.ownerOrg}. 
                    Only parties to each contract can see the relevant data.
                  </p>
                  {workerRecord.personalProfileLinked && (
                    <p className="text-xs text-muted-foreground mt-2 m-0">
                      The person controls their Personal Profile and what's public. 
                      {workerRecord.ownerOrg} controls this Work Record.
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* Actions (company view only) */}
            {isCompanyView && (
              <Card className="p-6">
                <h4 className="m-0 mb-3">Actions</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start min-h-[44px]">
                    Change Manager
                  </Button>
                  <Button variant="outline" className="w-full justify-start min-h-[44px]">
                    Assign to Contract
                  </Button>
                  {status === "active" && (
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-destructive hover:text-destructive min-h-[44px]"
                    >
                      Begin Offboarding
                    </Button>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
