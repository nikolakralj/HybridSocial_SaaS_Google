import { useState } from "react";
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2,
  Circle,
  LogIn,
  Building2,
  Users,
  FileText,
  UserPlus,
  Handshake,
  ClipboardCheck,
  Clock,
  DollarSign,
  Shield
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner@2.0.3";
import { AgencyRoleBadge } from "./AgencyRoleBadge";

type WorkflowStep = 
  | "login"
  | "context-chooser"
  | "agency-roles"
  | "rbac-validation"
  | "create-deal"
  | "submit-candidate"
  | "offer-hired"
  | "create-contract"
  | "create-worker-record"
  | "worker-record-claimed"
  | "fill-employment-details"
  | "org-approvals"
  | "log-time"
  | "approve-time"
  | "generate-invoice";

const steps: { id: WorkflowStep; title: string; icon: any; description: string }[] = [
  {
    id: "login",
    title: "Login",
    icon: LogIn,
    description: "Sign in as James Wilson"
  },
  {
    id: "context-chooser",
    title: "Choose Context",
    icon: Building2,
    description: "Select Elite Recruiters agency"
  },
  {
    id: "agency-roles",
    title: "Agency Roles",
    icon: Shield,
    description: "Assign roles: Account Manager, Recruiter, Finance"
  },
  {
    id: "rbac-validation",
    title: "RBAC Validation",
    icon: Shield,
    description: "Test role permissions (rates visibility)"
  },
  {
    id: "create-deal",
    title: "Create Deal Room",
    icon: FileText,
    description: "RetailCo - Senior Full-Stack Developer"
  },
  {
    id: "submit-candidate",
    title: "Submit Candidate",
    icon: UserPlus,
    description: "Submit Sarah Chen with consent"
  },
  {
    id: "offer-hired",
    title: "Offer → Hired",
    icon: Handshake,
    description: "Advance deal stage to Hired"
  },
  {
    id: "create-contract",
    title: "Create Contract",
    icon: FileText,
    description: "MSA/SOW between parties"
  },
  {
    id: "create-worker-record",
    title: "Create Worker Record",
    icon: Users,
    description: "At TechVentures Inc (Unclaimed)"
  },
  {
    id: "worker-record-claimed",
    title: "Worker Record Claimed",
    icon: CheckCircle2,
    description: "Sarah accepts invite"
  },
  {
    id: "fill-employment-details",
    title: "Employment Details",
    icon: ClipboardCheck,
    description: "Title, department, rates, manager"
  },
  {
    id: "org-approvals",
    title: "Org Timesheet Settings",
    icon: Clock,
    description: "Weekly cadence, approval chain"
  },
  {
    id: "log-time",
    title: "Log Time",
    icon: Clock,
    description: "Sarah logs 40 hours"
  },
  {
    id: "approve-time",
    title: "Approve Time",
    icon: CheckCircle2,
    description: "Manager → Finance approval"
  },
  {
    id: "generate-invoice",
    title: "Generate Invoice",
    icon: DollarSign,
    description: "Create invoice from approved hours"
  }
];

export function SarahPlacementWorkflow() {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>("login");
  
  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const goToStep = (stepId: WorkflowStep) => {
    setCurrentStep(stepId);
  };

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].id);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="m-0 mb-2">Complete Placement Workflow</h1>
          <p className="text-muted-foreground m-0">
            End-to-end flow: Agency submission → Worker record → Timesheet → Invoice
          </p>
        </div>

        {/* Progress */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium m-0">
              Step {currentStepIndex + 1} of {steps.length}
            </p>
            <p className="text-sm text-muted-foreground m-0">{Math.round(progress)}% complete</p>
          </div>
          <Progress value={progress} className="mb-4" />
          
          {/* Step Navigation */}
          <div className="flex flex-wrap gap-2">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = idx < currentStepIndex;
              
              return (
                <button
                  key={step.id}
                  onClick={() => goToStep(step.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors border-0 ${
                    isActive
                      ? "bg-accent-brand text-white"
                      : isCompleted
                      ? "bg-success/10 text-success hover:bg-success/20"
                      : "bg-accent hover:bg-accent/70"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                  <span className="hidden md:inline">{step.title}</span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: UI Mockup */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              {currentStep === "login" && <LoginStep />}
              {currentStep === "context-chooser" && <ContextChooserStep />}
              {currentStep === "agency-roles" && <AgencyRolesStep />}
              {currentStep === "rbac-validation" && <RBACValidationStep />}
              {currentStep === "create-deal" && <CreateDealStep />}
              {currentStep === "submit-candidate" && <SubmitCandidateStep />}
              {currentStep === "offer-hired" && <OfferHiredStep />}
              {currentStep === "create-contract" && <CreateContractStep />}
              {currentStep === "create-worker-record" && <CreateWorkerRecordStep />}
              {currentStep === "worker-record-claimed" && <WorkerRecordClaimedStep />}
              {currentStep === "fill-employment-details" && <FillEmploymentDetailsStep />}
              {currentStep === "org-approvals" && <OrgApprovalsStep />}
              {currentStep === "log-time" && <LogTimeStep />}
              {currentStep === "approve-time" && <ApproveTimeStep />}
              {currentStep === "generate-invoice" && <GenerateInvoiceStep />}
            </Card>
          </div>

          {/* Right: Explanation */}
          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="m-0 mb-4">{steps[currentStepIndex].title}</h3>
              <p className="text-sm text-muted-foreground m-0 mb-4">
                {steps[currentStepIndex].description}
              </p>
              <Separator className="my-4" />
              <div className="space-y-4 text-sm">
                {currentStep === "login" && (
                  <>
                    <p className="m-0">James Wilson logs in with his work email.</p>
                    <p className="m-0 text-muted-foreground">
                      james@eliterecruiters.com
                    </p>
                  </>
                )}
                
                {currentStep === "context-chooser" && (
                  <>
                    <p className="m-0">James selects Elite Recruiters from his available contexts.</p>
                    <p className="m-0 text-muted-foreground">
                      He also has access to his Personal Profile.
                    </p>
                  </>
                )}
                
                {currentStep === "agency-roles" && (
                  <>
                    <p className="m-0">Agency owner assigns roles to team members:</p>
                    <ul className="space-y-1 m-0 pl-4">
                      <li><strong>Account Manager</strong> - Client relationships, deal rooms</li>
                      <li><strong>Recruiter</strong> - Candidates & submissions</li>
                      <li><strong>Finance</strong> - Rates & invoices</li>
                    </ul>
                  </>
                )}
                
                {currentStep === "rbac-validation" && (
                  <>
                    <p className="m-0">Test role-based access control:</p>
                    <ul className="space-y-1 m-0 pl-4">
                      <li>✅ Finance can see bill rates</li>
                      <li>❌ Recruiter cannot see bill rates</li>
                      <li>✅ Account Manager sees deal finances</li>
                    </ul>
                  </>
                )}
                
                {currentStep === "create-deal" && (
                  <>
                    <p className="m-0">Create a new deal room for RetailCo's open position.</p>
                    <p className="m-0 text-muted-foreground">
                      Add participants: James (Account Manager), Lisa (Recruiter), Mike (Hiring Manager at RetailCo)
                    </p>
                  </>
                )}
                
                {currentStep === "submit-candidate" && (
                  <>
                    <p className="m-0">Submit Sarah Chen to the RetailCo deal.</p>
                    <p className="m-0 text-muted-foreground">
                      ✅ Candidate consented to submission<br/>
                      ✅ Non-exclusive representation<br/>
                      Timeline event: "Sarah Chen submitted"
                    </p>
                  </>
                )}
                
                {currentStep === "offer-hired" && (
                  <>
                    <p className="m-0">Progress the deal through stages:</p>
                    <ul className="space-y-1 m-0 pl-4">
                      <li>Profile Review → Interview → Offer → <strong>Hired</strong></li>
                    </ul>
                    <p className="m-0 text-muted-foreground mt-2">
                      Timeline tracks all stage changes with timestamps.
                    </p>
                  </>
                )}
                
                {currentStep === "create-contract" && (
                  <>
                    <p className="m-0">Generate contract documents:</p>
                    <ul className="space-y-1 m-0 pl-4">
                      <li><strong>MSA</strong> - Master Service Agreement (Agency ↔ Company)</li>
                      <li><strong>SOW</strong> - Statement of Work (specific engagement)</li>
                    </ul>
                    <p className="m-0 text-muted-foreground mt-2">
                      Parties: Elite Recruiters, TechVentures Inc, Sarah Chen
                    </p>
                  </>
                )}
                
                {currentStep === "create-worker-record" && (
                  <>
                    <p className="m-0">Create worker record at TechVentures Inc.</p>
                    <p className="m-0 text-muted-foreground">
                      Status: <strong>Unclaimed</strong><br/>
                      Send invite to sarah.chen@example.com<br/>
                      Banner shows "Send Invite / Copy Link"
                    </p>
                  </>
                )}
                
                {currentStep === "worker-record-claimed" && (
                  <>
                    <p className="m-0">Sarah accepts the invite and claims the worker record.</p>
                    <p className="m-0 text-muted-foreground">
                      ✅ Worker record now links to Sarah's Personal Profile<br/>
                      ✅ Two-way connection: Personal ↔ Worker Record<br/>
                      Banner removed
                    </p>
                  </>
                )}
                
                {currentStep === "fill-employment-details" && (
                  <>
                    <p className="m-0">Complete employment and billing details:</p>
                    <ul className="space-y-1 m-0 pl-4">
                      <li>Title: Senior Full-Stack Developer</li>
                      <li>Department: Engineering</li>
                      <li>Manager: Alex Martinez</li>
                      <li>Cost rate: $75/hr</li>
                      <li>Bill rate: $100/hr (margin: $25/hr)</li>
                    </ul>
                  </>
                )}
                
                {currentStep === "org-approvals" && (
                  <>
                    <p className="m-0">Configure timesheet settings:</p>
                    <ul className="space-y-1 m-0 pl-4">
                      <li>Period: Weekly</li>
                      <li>Submission day: Friday</li>
                      <li>Approval chain: Manager → Finance</li>
                    </ul>
                  </>
                )}
                
                {currentStep === "log-time" && (
                  <>
                    <p className="m-0">Sarah logs her hours for the week.</p>
                    <p className="m-0 text-muted-foreground">
                      Mon: 8h, Tue: 8h, Wed: 8h, Thu: 8h, Fri: 8h<br/>
                      Total: 40 hours<br/>
                      Status: Submitted
                    </p>
                  </>
                )}
                
                {currentStep === "approve-time" && (
                  <>
                    <p className="m-0">Approval chain:</p>
                    <ul className="space-y-1 m-0 pl-4">
                      <li>✅ Alex Martinez (Manager) - Approved</li>
                      <li>✅ Finance team - Approved</li>
                    </ul>
                    <p className="m-0 text-muted-foreground mt-2">
                      Dashboard badges update with approved hours
                    </p>
                  </>
                )}
                
                {currentStep === "generate-invoice" && (
                  <>
                    <p className="m-0">Generate invoice from approved hours:</p>
                    <ul className="space-y-1 m-0 pl-4">
                      <li>Hours: 40</li>
                      <li>Bill rate: $100/hr</li>
                      <li>Total: $4,000</li>
                    </ul>
                    <p className="m-0 text-muted-foreground mt-2">
                      Invoice references contract and assignment.<br/>
                      Sent to TechVentures Inc Finance team.
                    </p>
                  </>
                )}
              </div>
            </Card>

            {/* Navigation */}
            <Card className="p-4">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStepIndex === 0}
                  className="flex-1"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button
                  onClick={nextStep}
                  disabled={currentStepIndex === steps.length - 1}
                  className="flex-1"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step Components

function LoginStep() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="m-0 mb-2">Sign In</h2>
        <p className="text-muted-foreground m-0">Enter your work email to continue</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label>Work Email</Label>
          <Input 
            type="email" 
            placeholder="james@eliterecruiters.com" 
            defaultValue="james@eliterecruiters.com"
          />
        </div>
        
        <div>
          <Label>Password</Label>
          <Input type="password" placeholder="••••••••" defaultValue="password123" />
        </div>
        
        <Button className="w-full" onClick={() => toast.success("Signed in as James Wilson")}>
          Sign In
        </Button>
      </div>
    </div>
  );
}

function ContextChooserStep() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="m-0 mb-2">Choose Your Workspace</h2>
        <p className="text-muted-foreground m-0">Select which context you want to work in</p>
      </div>
      
      <div className="space-y-3">
        <Card className="p-4 hover:bg-accent cursor-pointer transition-colors">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-purple-500/10 text-purple-500">JW</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium m-0">James Wilson</p>
              <p className="text-sm text-muted-foreground m-0">Personal Profile</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-accent-brand/5 border-accent-brand cursor-pointer">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-purple-500 text-white">ER</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium m-0">Elite Recruiters</p>
              <p className="text-sm text-muted-foreground m-0">Agency</p>
            </div>
            <CheckCircle2 className="w-5 h-5 text-accent-brand" />
          </div>
        </Card>
      </div>
    </div>
  );
}

function AgencyRolesStep() {
  const teamMembers = [
    { name: "James Wilson", email: "james@eliterecruiters.com", role: "account-manager" as const },
    { name: "Lisa Chen", email: "lisa@eliterecruiters.com", role: "recruiter" as const },
    { name: "David Park", email: "david@eliterecruiters.com", role: "finance" as const },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="m-0 mb-2">Team Roles</h2>
        <p className="text-muted-foreground m-0">Assign roles to control access and permissions</p>
      </div>
      
      <div className="space-y-3">
        {teamMembers.map(member => (
          <Card key={member.email} className="p-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-accent">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium m-0">{member.name}</p>
                <p className="text-sm text-muted-foreground m-0">{member.email}</p>
              </div>
              <AgencyRoleBadge role={member.role} />
            </div>
          </Card>
        ))}
      </div>
      
      <Card className="p-4 bg-muted">
        <p className="text-sm text-muted-foreground m-0">
          💡 Each role has specific permissions. Account Managers manage deals, 
          Recruiters handle candidates, Finance sees all rates and invoices.
        </p>
      </Card>
    </div>
  );
}

function RBACValidationStep() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="m-0 mb-2">Role Permissions Test</h2>
        <p className="text-muted-foreground m-0">Validate that role-based access control works correctly</p>
      </div>
      
      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-purple-500/10 text-purple-500">LC</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium m-0">Lisa Chen</p>
              <AgencyRoleBadge role="recruiter" />
            </div>
          </div>
          <Separator className="my-3" />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <p className="text-sm m-0">Can view candidates</p>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <p className="text-sm m-0">Can submit to clients</p>
            </div>
            <div className="flex items-center gap-2">
              <Circle className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm m-0 text-muted-foreground line-through">Cannot see bill rates</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-emerald-500/10 text-emerald-500">DP</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium m-0">David Park</p>
              <AgencyRoleBadge role="finance" />
            </div>
          </div>
          <Separator className="my-3" />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <p className="text-sm m-0">Can see all rates</p>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <p className="text-sm m-0">Can generate invoices</p>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <p className="text-sm m-0">Can approve timesheets</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function CreateDealStep() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="m-0 mb-2">Create Deal Room</h2>
        <p className="text-muted-foreground m-0">Set up a new placement deal for RetailCo</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label>Client</Label>
          <Input value="RetailCo" disabled />
        </div>
        
        <div>
          <Label>Position</Label>
          <Input value="Senior Full-Stack Developer" disabled />
        </div>
        
        <div>
          <Label>Deal Type</Label>
          <Input value="Placement" disabled />
        </div>
        
        <div>
          <Label>Participants</Label>
          <div className="space-y-2 mt-2">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-purple-500/5">
              <Badge className="bg-purple-500">Agency</Badge>
              <p className="text-sm m-0">James Wilson - Account Manager</p>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-purple-500/5">
              <Badge className="bg-purple-500">Agency</Badge>
              <p className="text-sm m-0">Lisa Chen - Recruiter</p>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-500/5">
              <Badge className="bg-blue-500">Client</Badge>
              <p className="text-sm m-0">Mike Johnson - Hiring Manager</p>
            </div>
          </div>
        </div>
        
        <Button className="w-full" onClick={() => toast.success("Deal room created")}>
          Create Deal Room
        </Button>
      </div>
    </div>
  );
}

function SubmitCandidateStep() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="m-0 mb-2">Submit Candidate</h2>
        <p className="text-muted-foreground m-0">Add Sarah Chen to the RetailCo deal</p>
      </div>
      
      <Card className="p-4 bg-accent">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="w-12 h-12">
            <AvatarFallback className="bg-emerald-500/10 text-emerald-500">SC</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium m-0">Sarah Chen</p>
            <p className="text-sm text-muted-foreground m-0">Senior Full-Stack Developer</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline">React</Badge>
          <Badge variant="outline">Node.js</Badge>
          <Badge variant="outline">TypeScript</Badge>
        </div>
      </Card>
      
      <div className="space-y-4">
        <Card className="p-4 bg-success/5 border-success/20">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-success mt-0.5" />
            <div>
              <p className="font-medium m-0 mb-1">Representation Confirmed</p>
              <p className="text-sm text-muted-foreground m-0">
                Non-exclusive representation<br/>
                Valid until: Dec 31, 2025
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-success/5 border-success/20">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-success mt-0.5" />
            <div>
              <p className="font-medium m-0 mb-1">Consent Obtained</p>
              <p className="text-sm text-muted-foreground m-0">
                Candidate consented to submission on Oct 8, 2025
              </p>
            </div>
          </div>
        </Card>
        
        <Button className="w-full" onClick={() => toast.success("Sarah Chen submitted to deal")}>
          Submit to Deal
        </Button>
      </div>
    </div>
  );
}

function OfferHiredStep() {
  const stages = [
    { label: "Profile Review", status: "complete" },
    { label: "Interview", status: "complete" },
    { label: "Offer", status: "complete" },
    { label: "Hired", status: "active" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="m-0 mb-2">Deal Progress</h2>
        <p className="text-muted-foreground m-0">Advance through stages to Hired</p>
      </div>
      
      <div className="space-y-3">
        {stages.map((stage, idx) => (
          <Card 
            key={stage.label} 
            className={`p-4 ${stage.status === 'active' ? 'bg-success/5 border-success' : ''}`}
          >
            <div className="flex items-center gap-3">
              {stage.status === 'complete' ? (
                <CheckCircle2 className="w-5 h-5 text-success" />
              ) : (
                <Circle className="w-5 h-5 text-success" />
              )}
              <p className="font-medium m-0 flex-1">{stage.label}</p>
              {stage.status === 'active' && (
                <Badge className="bg-success">Current</Badge>
              )}
            </div>
          </Card>
        ))}
      </div>
      
      <Card className="p-4 bg-muted">
        <h4 className="m-0 mb-2">Timeline</h4>
        <div className="space-y-2 text-sm">
          <p className="m-0">Oct 8: Sarah Chen submitted</p>
          <p className="m-0">Oct 10: Interview scheduled</p>
          <p className="m-0">Oct 12: Interview completed</p>
          <p className="m-0">Oct 15: Offer extended</p>
          <p className="m-0 text-success">Oct 20: Offer accepted → Hired ✓</p>
        </div>
      </Card>
    </div>
  );
}

function CreateContractStep() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="m-0 mb-2">Create Contract</h2>
        <p className="text-muted-foreground m-0">Generate MSA and SOW for the engagement</p>
      </div>
      
      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-500" />
            </div>
            <div className="flex-1">
              <p className="font-medium m-0">Master Service Agreement (MSA)</p>
              <p className="text-sm text-muted-foreground m-0">Agency ↔ Company framework</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Parties:</span>
              <span>Elite Recruiters ↔ TechVentures Inc</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Term:</span>
              <span>2 years</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <p className="font-medium m-0">Statement of Work (SOW)</p>
              <p className="text-sm text-muted-foreground m-0">Specific engagement terms</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Worker:</span>
              <span>Sarah Chen</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Position:</span>
              <span>Senior Full-Stack Developer</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Start Date:</span>
              <span>Nov 1, 2025</span>
            </div>
          </div>
        </Card>
        
        <Button className="w-full" onClick={() => toast.success("Contracts generated")}>
          Generate Contracts
        </Button>
      </div>
    </div>
  );
}

function CreateWorkerRecordStep() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="m-0 mb-2">Create Worker Record</h2>
        <p className="text-muted-foreground m-0">At TechVentures Inc (Unclaimed state)</p>
      </div>
      
      <Card className="p-4 bg-warning/5 border-warning">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-warning" />
          </div>
          <div className="flex-1">
            <p className="font-medium m-0">Unclaimed Worker Record</p>
            <p className="text-sm text-muted-foreground m-0">Invite pending</p>
          </div>
        </div>
        <p className="text-sm m-0 mb-3">
          This worker record was created for Sarah Chen but hasn't been claimed yet.
        </p>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => toast.success("Invite sent to sarah.chen@example.com")}>
            Send Invite
          </Button>
          <Button size="sm" variant="outline" onClick={() => toast.success("Link copied")}>
            Copy Invite Link
          </Button>
        </div>
      </Card>
      
      <div className="space-y-4">
        <div>
          <Label>Name</Label>
          <Input value="Sarah Chen" disabled />
        </div>
        
        <div>
          <Label>Email</Label>
          <Input value="sarah.chen@example.com" disabled />
        </div>
        
        <div>
          <Label>Position</Label>
          <Input value="Senior Full-Stack Developer" disabled />
        </div>
        
        <div>
          <Label>Organization</Label>
          <Input value="TechVentures Inc" disabled />
        </div>
      </div>
    </div>
  );
}

function WorkerRecordClaimedStep() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="m-0 mb-2">Worker Record Claimed</h2>
        <p className="text-muted-foreground m-0">Sarah accepted the invite</p>
      </div>
      
      <Card className="p-4 bg-success/5 border-success">
        <div className="flex items-center gap-3 mb-3">
          <CheckCircle2 className="w-10 h-10 text-success" />
          <div className="flex-1">
            <p className="font-medium m-0">Record Claimed Successfully</p>
            <p className="text-sm text-muted-foreground m-0">Linked to Personal Profile</p>
          </div>
        </div>
        <p className="text-sm m-0">
          Sarah Chen accepted the invite on Oct 22, 2025. The worker record is now 
          connected to her personal profile.
        </p>
      </Card>
      
      <Card className="p-4">
        <h4 className="m-0 mb-3">Two-Way Connection</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-accent">
            <Avatar>
              <AvatarFallback className="bg-emerald-500/10 text-emerald-500">SC</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium m-0">Sarah Chen</p>
              <p className="text-sm text-muted-foreground m-0">Personal Profile</p>
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="flex flex-col items-center gap-1">
              <ChevronRight className="w-5 h-5 text-muted-foreground rotate-90" />
              <p className="text-xs text-muted-foreground m-0">Linked</p>
              <ChevronRight className="w-5 h-5 text-muted-foreground -rotate-90" />
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg bg-accent">
            <Avatar>
              <AvatarFallback className="bg-blue-500/10 text-blue-500">TV</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium m-0">Worker Record</p>
              <p className="text-sm text-muted-foreground m-0">TechVentures Inc</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function FillEmploymentDetailsStep() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="m-0 mb-2">Employment Details</h2>
        <p className="text-muted-foreground m-0">Complete worker information and rates</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label>Job Title</Label>
          <Input value="Senior Full-Stack Developer" />
        </div>
        
        <div>
          <Label>Department</Label>
          <Input value="Engineering" />
        </div>
        
        <div>
          <Label>Manager</Label>
          <Input value="Alex Martinez" />
        </div>
        
        <Separator />
        
        <h4 className="m-0">Rates & Billing</h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Cost Rate</Label>
            <Input value="$75/hr" />
            <p className="text-xs text-muted-foreground mt-1 m-0">Agency pays to supplier</p>
          </div>
          
          <div>
            <Label>Bill Rate</Label>
            <Input value="$100/hr" />
            <p className="text-xs text-muted-foreground mt-1 m-0">Client pays to agency</p>
          </div>
        </div>
        
        <Card className="p-3 bg-success/5 border-success/20">
          <p className="text-sm m-0">
            💰 <strong>Margin:</strong> $25/hr ($100 - $75)
          </p>
        </Card>
        
        <div>
          <Label>Overtime Rules</Label>
          <Textarea 
            placeholder="1.5x after 40 hours/week"
            value="1.5x after 40 hours/week"
          />
        </div>
        
        <Button className="w-full" onClick={() => toast.success("Details saved")}>
          Save Employment Details
        </Button>
      </div>
    </div>
  );
}

function OrgApprovalsStep() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="m-0 mb-2">Timesheet Settings</h2>
        <p className="text-muted-foreground m-0">Configure approval cadence and chain</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label>Period</Label>
          <Input value="Weekly" disabled />
        </div>
        
        <div>
          <Label>Submission Day</Label>
          <Input value="Friday" disabled />
        </div>
        
        <Separator />
        
        <h4 className="m-0">Approval Chain</h4>
        
        <div className="space-y-3">
          <Card className="p-4 bg-accent">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent-brand text-white flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div className="flex-1">
                <p className="font-medium m-0">Manager Approval</p>
                <p className="text-sm text-muted-foreground m-0">Alex Martinez</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-accent">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent-brand text-white flex items-center justify-center text-sm font-medium">
                2
              </div>
              <div className="flex-1">
                <p className="font-medium m-0">Finance Approval</p>
                <p className="text-sm text-muted-foreground m-0">Finance Team</p>
              </div>
            </div>
          </Card>
        </div>
        
        <Card className="p-4 bg-muted">
          <p className="text-sm text-muted-foreground m-0">
            💡 Timesheets must be approved by both manager and finance before 
            invoicing. Notifications sent on submission day.
          </p>
        </Card>
      </div>
    </div>
  );
}

function LogTimeStep() {
  const weekDays = [
    { day: "Monday", hours: 8 },
    { day: "Tuesday", hours: 8 },
    { day: "Wednesday", hours: 8 },
    { day: "Thursday", hours: 8 },
    { day: "Friday", hours: 8 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="m-0 mb-2">Log Time</h2>
        <p className="text-muted-foreground m-0">Sarah logs her hours for the week</p>
      </div>
      
      <Card className="p-4 bg-accent">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-medium m-0">Week of Oct 21 - Oct 25, 2025</p>
            <p className="text-sm text-muted-foreground m-0">TechVentures Inc - Engineering</p>
          </div>
          <Badge>Submitted</Badge>
        </div>
        
        <div className="space-y-2">
          {weekDays.map(({ day, hours }) => (
            <div key={day} className="flex items-center justify-between p-2 rounded-lg bg-card">
              <span className="text-sm">{day}</span>
              <span className="font-medium">{hours}h</span>
            </div>
          ))}
        </div>
        
        <Separator className="my-4" />
        
        <div className="flex items-center justify-between">
          <span className="font-medium">Total Hours</span>
          <span className="text-2xl font-semibold">40h</span>
        </div>
      </Card>
      
      <Button className="w-full" onClick={() => toast.success("Timesheet submitted")}>
        Submit Timesheet
      </Button>
    </div>
  );
}

function ApproveTimeStep() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="m-0 mb-2">Approve Timesheet</h2>
        <p className="text-muted-foreground m-0">Manager and Finance review</p>
      </div>
      
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-medium m-0">Sarah Chen - Week of Oct 21</p>
            <p className="text-sm text-muted-foreground m-0">40 hours submitted</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <Card className="p-4 bg-success/5 border-success">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <div className="flex-1">
                <p className="font-medium m-0">Alex Martinez (Manager)</p>
                <p className="text-sm text-muted-foreground m-0">Approved on Oct 25, 2025</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-success/5 border-success">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <div className="flex-1">
                <p className="font-medium m-0">Finance Team</p>
                <p className="text-sm text-muted-foreground m-0">Approved on Oct 26, 2025</p>
              </div>
            </div>
          </Card>
        </div>
      </Card>
      
      <Card className="p-4 bg-muted">
        <p className="text-sm m-0">
          ✅ All approvals complete. Timesheet is now ready for invoicing.
        </p>
      </Card>
    </div>
  );
}

function GenerateInvoiceStep() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="m-0 mb-2">Generate Invoice</h2>
        <p className="text-muted-foreground m-0">Create invoice from approved hours</p>
      </div>
      
      <Card className="p-6 border-accent-brand">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground m-0 mb-1">Invoice #</p>
            <p className="font-medium m-0">INV-2025-001</p>
          </div>
          <Badge className="bg-accent-brand">Ready</Badge>
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">From:</span>
            <span>Elite Recruiters</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">To:</span>
            <span>TechVentures Inc</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Period:</span>
            <span>Oct 21 - Oct 25, 2025</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Worker:</span>
            <span>Sarah Chen</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Position:</span>
            <span>Senior Full-Stack Developer</span>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Hours worked:</span>
            <span>40h</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Bill rate:</span>
            <span>$100/hr</span>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="flex justify-between items-center">
          <span className="font-medium">Total Amount</span>
          <span className="text-2xl font-semibold text-accent-brand">$4,000</span>
        </div>
      </Card>
      
      <Card className="p-4 bg-muted">
        <p className="text-sm text-muted-foreground m-0">
          📄 Invoice references Contract #SOW-2025-001 and Assignment #A-001
        </p>
      </Card>
      
      <Button className="w-full" onClick={() => toast.success("Invoice generated and sent")}>
        Generate & Send Invoice
      </Button>
    </div>
  );
}
