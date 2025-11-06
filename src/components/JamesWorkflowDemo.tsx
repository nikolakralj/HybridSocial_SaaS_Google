import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  CheckCircle, Circle, ArrowRight, Users, FileUp, 
  Building2, Send, Clock, ArrowLeft
} from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Input } from "./ui/input";

type WorkflowStep = 
  | "login" 
  | "context-chooser" 
  | "dashboard" 
  | "directory" 
  | "parse-cv" 
  | "candidate-created"
  | "select-client"
  | "deal-created"
  | "participants-only";

export function JamesWorkflowDemo() {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>("login");

  const steps = [
    { id: "login", label: "Login", description: "james@eliterecruiters.com" },
    { id: "context-chooser", label: "Context Chooser", description: "Select Elite Recruiters" },
    { id: "dashboard", label: "Agency Dashboard", description: "View My pipeline" },
    { id: "directory", label: "Open Directory", description: "Or Candidates tab" },
    { id: "parse-cv", label: "Parse CV", description: "Upload or paste resume" },
    { id: "candidate-created", label: "Candidate Created", description: "Sarah Chen added" },
    { id: "select-client", label: "Submit to Client", description: "Select RetailCo job" },
    { id: "deal-created", label: "Deal Room Created", description: "Placement deal" },
    { id: "participants-only", label: "Private Deal", description: "Only participants see it" },
  ] as const;

  const getStepIndex = (step: WorkflowStep) => steps.findIndex(s => s.id === step);
  const currentStepIndex = getStepIndex(currentStep);

  const nextStep = () => {
    const currentIndex = getStepIndex(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const prevStep = () => {
    const currentIndex = getStepIndex(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1280px] mx-auto px-6 py-6 space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="mb-2">James's Workflow</h1>
          <p className="text-muted-foreground">
            Step-by-step: From login to creating a private deal room
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="p-6">
          <div className="space-y-4">
            {/* Steps List */}
            <div className="flex flex-wrap gap-2 justify-center">
              {steps.map((step, index) => {
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;
                
                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(step.id)}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all
                      ${isCurrent 
                        ? "border-accent-brand bg-accent-brand/5" 
                        : isCompleted
                        ? "border-success bg-success/5"
                        : "border-border bg-accent hover:bg-accent/70"
                      }
                    `}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4 text-success" />
                    ) : isCurrent ? (
                      <Circle className="w-4 h-4 text-accent-brand fill-accent-brand" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className={`text-sm font-medium ${isCurrent ? "text-accent-brand" : ""}`}>
                      {index + 1}. {step.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Progress */}
            <div className="relative h-2 bg-accent rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-accent-brand transition-all duration-300"
                style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Current Step Detail */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Visual */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-accent-brand/10 flex items-center justify-center">
                <span className="text-accent-brand font-semibold">{currentStepIndex + 1}</span>
              </div>
              <div className="flex-1">
                <h3 className="m-0">{steps[currentStepIndex].label}</h3>
                <p className="text-sm text-muted-foreground m-0">
                  {steps[currentStepIndex].description}
                </p>
              </div>
            </div>

            {/* Step-specific UI mockup */}
            <div className="rounded-lg border-2 border-border bg-accent/50 p-6 min-h-[300px] flex items-center justify-center">
              {currentStep === "login" && (
                <div className="w-full max-w-xs space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                      ER
                    </div>
                    <h4 className="m-0">Welcome to WorkGraph</h4>
                  </div>
                  <Input placeholder="james@eliterecruiters.com" disabled />
                  <Input type="password" placeholder="••••••••" disabled />
                  <Button className="w-full bg-accent-brand" disabled>Sign In</Button>
                </div>
              )}

              {currentStep === "context-chooser" && (
                <div className="w-full space-y-3">
                  <h4 className="m-0 text-center mb-4">Choose your workspace</h4>
                  <div className="grid gap-3">
                    <div className="p-4 rounded-lg bg-card border-2 border-border">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 rounded-lg">
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
                            JW
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium m-0 text-sm">James Wilson</p>
                          <p className="text-xs text-muted-foreground m-0">Personal</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-accent-brand/10 border-2 border-accent-brand">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                          ER
                        </div>
                        <div className="flex-1">
                          <p className="font-medium m-0 text-sm">Elite Recruiters</p>
                          <Badge className="text-xs mt-1">Account Manager</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === "dashboard" && (
                <div className="w-full space-y-3">
                  <div className="text-center mb-3">
                    <h4 className="m-0">Agency Dashboard</h4>
                    <p className="text-sm text-muted-foreground m-0">Elite Recruiters</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-3 rounded-lg bg-card border border-border text-center">
                      <p className="text-sm text-muted-foreground m-0">Active</p>
                      <p className="text-xl font-semibold m-0">8</p>
                    </div>
                    <div className="p-3 rounded-lg bg-card border border-border text-center">
                      <p className="text-sm text-muted-foreground m-0">This Month</p>
                      <p className="text-xl font-semibold m-0">3</p>
                    </div>
                    <div className="p-3 rounded-lg bg-card border border-border text-center">
                      <p className="text-sm text-muted-foreground m-0">Revenue</p>
                      <p className="text-xl font-semibold m-0">$45K</p>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === "directory" && (
                <div className="w-full">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="m-0">Candidates</h4>
                    <Button size="sm" className="bg-accent-brand">Add Candidate</Button>
                  </div>
                  <div className="space-y-2">
                    {[1, 2].map((i) => (
                      <div key={i} className="p-3 rounded-lg bg-card border border-border flex items-center gap-3">
                        <Avatar className="w-8 h-8 rounded-lg">
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg text-xs">
                            C{i}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium m-0">Candidate {i}</p>
                          <p className="text-xs text-muted-foreground m-0">Role · Location</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === "parse-cv" && (
                <div className="w-full text-center space-y-4">
                  <FileUp className="w-12 h-12 text-accent-brand mx-auto" />
                  <div>
                    <h4 className="m-0 mb-2">Upload CV</h4>
                    <p className="text-sm text-muted-foreground m-0">
                      Drag & drop or paste resume
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-card border-2 border-dashed border-border">
                    <p className="text-sm m-0">CV parsing extracts:</p>
                    <p className="text-xs text-muted-foreground m-0 mt-1">
                      Name, skills, experience, contact
                    </p>
                  </div>
                </div>
              )}

              {currentStep === "candidate-created" && (
                <div className="w-full text-center space-y-4">
                  <CheckCircle className="w-12 h-12 text-success mx-auto" />
                  <div>
                    <h4 className="m-0 mb-2">Candidate Created</h4>
                    <div className="p-4 rounded-lg bg-card border border-border text-left">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="w-10 h-10 rounded-lg">
                          <AvatarFallback className="bg-gradient-to-br from-accent-brand to-blue-600 rounded-lg">
                            SC
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium m-0 text-sm">Sarah Chen</p>
                          <p className="text-xs text-muted-foreground m-0">Senior Full-Stack Developer</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="secondary" className="text-xs">React</Badge>
                        <Badge variant="secondary" className="text-xs">Node.js</Badge>
                        <Badge variant="secondary" className="text-xs">TypeScript</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === "select-client" && (
                <div className="w-full space-y-3">
                  <h4 className="m-0">Submit to Client</h4>
                  <div className="space-y-2">
                    <div className="p-3 rounded-lg bg-card border-2 border-accent-brand">
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className="w-4 h-4 text-blue-500" />
                        <p className="font-medium m-0 text-sm">RetailCo</p>
                      </div>
                      <p className="text-xs text-muted-foreground m-0">Senior Full-Stack Developer</p>
                      <Badge variant="outline" className="text-xs mt-2">Open</Badge>
                    </div>
                    <div className="p-3 rounded-lg bg-card border border-border opacity-50">
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className="w-4 h-4" />
                        <p className="font-medium m-0 text-sm">TechCorp</p>
                      </div>
                      <p className="text-xs text-muted-foreground m-0">Product Manager</p>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === "deal-created" && (
                <div className="w-full text-center space-y-4">
                  <CheckCircle className="w-12 h-12 text-success mx-auto" />
                  <div>
                    <h4 className="m-0 mb-2">Deal Room Created</h4>
                    <Card className="p-4 text-left">
                      <p className="font-medium m-0 mb-3">RetailCo · Senior Developer</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-success" />
                          <span>Type: Placement</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-success" />
                          <span>Participants added</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-success" />
                          <span>Scope: Participants only</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {currentStep === "participants-only" && (
                <div className="w-full space-y-4">
                  <div className="text-center">
                    <h4 className="m-0 mb-2">Private Deal Room</h4>
                    <Badge className="bg-purple-500">Participants Only</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium m-0">Who can see this:</p>
                    <div className="space-y-2">
                      <div className="p-2 rounded-lg bg-purple-500/5 border border-purple-500/20 flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-500" />
                        <span className="text-sm">James Wilson</span>
                      </div>
                      <div className="p-2 rounded-lg bg-blue-500/5 border border-blue-500/20 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">RetailCo Contact</span>
                      </div>
                      <div className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20 flex items-center gap-2">
                        <Avatar className="w-4 h-4 rounded">
                          <AvatarFallback className="bg-emerald-500 text-white text-xs">
                            SC
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">Sarah Chen</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                    <p className="text-xs font-medium m-0 mb-1">🔒 Privacy</p>
                    <p className="text-xs text-muted-foreground m-0">
                      Other recruiters at Elite Recruiters do NOT see this deal
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Explanation */}
          <Card className="p-6">
            <h3 className="m-0 mb-4">What's happening</h3>
            
            <div className="space-y-4">
              {currentStep === "login" && (
                <div>
                  <p className="m-0 mb-2">
                    James logs in with his work email <strong>james@eliterecruiters.com</strong>
                  </p>
                  <p className="text-sm text-muted-foreground m-0">
                    One account per person. He'll see all workspaces he belongs to after login.
                  </p>
                </div>
              )}

              {currentStep === "context-chooser" && (
                <div>
                  <p className="m-0 mb-2">
                    James selects <strong>Elite Recruiters</strong> from the Context Chooser
                  </p>
                  <p className="text-sm text-muted-foreground m-0 mb-3">
                    He has access to his Personal Profile and his Agency workspace. No second account needed.
                  </p>
                  <Badge className="bg-accent-brand">Account Manager</Badge>
                </div>
              )}

              {currentStep === "dashboard" && (
                <div>
                  <p className="m-0 mb-2">
                    Lands on <strong>Agency Dashboard</strong> with "My pipeline" view
                  </p>
                  <p className="text-sm text-muted-foreground m-0">
                    Shows his active deals, awaiting responses, and documents to sign. By default, he only sees deals where he's a participant.
                  </p>
                </div>
              )}

              {currentStep === "directory" && (
                <div>
                  <p className="m-0 mb-2">
                    Opens <strong>Directory</strong> or <strong>Candidates</strong> tab
                  </p>
                  <p className="text-sm text-muted-foreground m-0">
                    He can browse existing candidates or add a new one. The "My/Team/Agency" toggle lets him filter what he sees.
                  </p>
                </div>
              )}

              {currentStep === "parse-cv" && (
                <div>
                  <p className="m-0 mb-2">
                    James uploads or pastes a <strong>CV</strong>
                  </p>
                  <p className="text-sm text-muted-foreground m-0 mb-3">
                    WorkGraph parses the CV to extract name, skills, experience, and contact info.
                  </p>
                  <div className="p-3 rounded-lg bg-accent">
                    <p className="text-xs font-medium m-0 mb-1">AI-powered extraction</p>
                    <p className="text-xs text-muted-foreground m-0">
                      Automatically creates a structured candidate profile
                    </p>
                  </div>
                </div>
              )}

              {currentStep === "candidate-created" && (
                <div>
                  <p className="m-0 mb-2">
                    <strong>Candidate created:</strong> Sarah Chen
                  </p>
                  <p className="text-sm text-muted-foreground m-0 mb-3">
                    The candidate is now in the agency's database. James owns this record.
                  </p>
                  <div className="space-y-2">
                    <Badge variant="outline">Owner: James Wilson</Badge>
                    <Badge variant="outline">Status: Available</Badge>
                  </div>
                </div>
              )}

              {currentStep === "select-client" && (
                <div>
                  <p className="m-0 mb-2">
                    James clicks <strong>"Submit to Client"</strong>
                  </p>
                  <p className="text-sm text-muted-foreground m-0 mb-3">
                    He selects the RetailCo job from the list of open roles. This action will create a Deal Room.
                  </p>
                  <div className="p-3 rounded-lg bg-accent">
                    <p className="text-xs font-medium m-0 mb-1">Consent check</p>
                    <p className="text-xs text-muted-foreground m-0">
                      System ensures candidate has consented to submission before proceeding
                    </p>
                  </div>
                </div>
              )}

              {currentStep === "deal-created" && (
                <div>
                  <p className="m-0 mb-2">
                    System creates a <strong>Deal Room</strong> (Placement)
                  </p>
                  <p className="text-sm text-muted-foreground m-0 mb-3">
                    The deal room is the hub where all communication, documents, and status tracking happen.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-purple-500" />
                      <span>James (Account Manager)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="w-4 h-4 text-blue-500" />
                      <span>RetailCo Contact</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Avatar className="w-4 h-4 rounded">
                        <AvatarFallback className="bg-emerald-500 text-white text-xs">SC</AvatarFallback>
                      </Avatar>
                      <span>Sarah Chen (Candidate)</span>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === "participants-only" && (
                <div>
                  <p className="m-0 mb-2">
                    <strong>Default scope: Participants only</strong>
                  </p>
                  <p className="text-sm text-muted-foreground m-0 mb-3">
                    Only the 3 participants can see messages, documents, and deal details.
                  </p>
                  <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                    <p className="text-xs font-medium m-0 mb-1">🔐 Privacy by default</p>
                    <p className="text-xs text-muted-foreground m-0">
                      Lisa Chen (another recruiter) and other agency members do NOT see this deal unless James explicitly shares it with his team or promotes it to agency-wide.
                    </p>
                  </div>
                  <div className="mt-3 p-3 rounded-lg bg-accent">
                    <p className="text-xs font-medium m-0 mb-1">Need to share?</p>
                    <p className="text-xs text-muted-foreground m-0">
                      James can change scope to "Team" or add specific recruiters as participants if collaboration is needed.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-2 mt-6 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStepIndex === 0}
                className="gap-2 min-h-[44px]"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button
                onClick={nextStep}
                disabled={currentStepIndex === steps.length - 1}
                className="flex-1 gap-2 bg-accent-brand hover:bg-accent-brand-hover min-h-[44px]"
              >
                Next Step
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
