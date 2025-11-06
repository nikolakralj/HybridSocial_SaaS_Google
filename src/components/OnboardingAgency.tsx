import { useState } from "react";
import { Building2, Users, ArrowRight, Plus, LogIn, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { toast } from "sonner@2.0.3";

type AgencyOnboardingStep = "choice" | "create" | "join-email" | "join-code" | "complete";

interface OnboardingAgencyProps {
  onComplete: () => void;
}

export function OnboardingAgency({ onComplete }: OnboardingAgencyProps) {
  const [step, setStep] = useState<AgencyOnboardingStep>("choice");
  const [agencyName, setAgencyName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [foundAgency, setFoundAgency] = useState<string | null>(null);

  const handleCreateAgency = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agencyName.trim()) {
      toast.error("Please enter an agency name");
      return;
    }
    
    toast.success(`Creating ${agencyName}...`);
    setTimeout(() => {
      setStep("complete");
    }, 1500);
  };

  const handleJoinEmail = (e: React.FormEvent) => {
    e.preventDefault();
    
    const domain = workEmail.split("@")[1];
    
    // Mock: Check if domain matches known agency
    if (domain === "eliterecruiters.com") {
      setFoundAgency("Elite Recruiters");
      toast.success("Agency found! Requesting access...");
      setTimeout(() => {
        setStep("complete");
      }, 1500);
    } else {
      toast.info("No agency found for this domain");
      setStep("join-code");
    }
  };

  const handleJoinCode = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inviteCode.length < 6) {
      toast.error("Please enter a valid invite code");
      return;
    }
    
    toast.success("Invite code accepted! Joining agency...");
    setTimeout(() => {
      setStep("complete");
    }, 1500);
  };

  const progressValue = {
    "choice": 25,
    "create": 50,
    "join-email": 50,
    "join-code": 75,
    "complete": 100
  }[step];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground m-0">Agency Setup</p>
            <p className="text-sm text-muted-foreground m-0">{progressValue}%</p>
          </div>
          <Progress value={progressValue} className="h-1.5" />
        </div>

        {/* Choice Step */}
        {step === "choice" && (
          <div>
            <div className="text-center mb-8">
              <h1 className="mb-2">Let's set up your agency workspace</h1>
              <p className="text-muted-foreground">
                Are you creating a new agency or joining an existing one?
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => setStep("create")}
                className="group text-left"
              >
                <Card className="p-6 hover:border-accent-brand transition-all hover:shadow-lg h-full">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-brand to-blue-600 flex items-center justify-center text-white mb-4">
                    <Plus className="w-6 h-6" />
                  </div>
                  <h3 className="m-0 mb-2">Create Agency</h3>
                  <p className="text-sm text-muted-foreground m-0 mb-4">
                    Start your own agency workspace from scratch
                  </p>
                  <div className="flex items-center gap-2 text-accent-brand">
                    <span className="text-sm font-medium">Get started</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Card>
              </button>

              <button
                onClick={() => setStep("join-email")}
                className="group text-left"
              >
                <Card className="p-6 hover:border-accent-brand transition-all hover:shadow-lg h-full">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white mb-4">
                    <LogIn className="w-6 h-6" />
                  </div>
                  <h3 className="m-0 mb-2">Join Agency</h3>
                  <p className="text-sm text-muted-foreground m-0 mb-4">
                    Join an existing agency where you work or have an invite
                  </p>
                  <div className="flex items-center gap-2 text-accent-brand">
                    <span className="text-sm font-medium">Join now</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Card>
              </button>
            </div>
          </div>
        )}

        {/* Create Agency Step */}
        {step === "create" && (
          <Card className="p-8">
            <div className="mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-brand to-blue-600 flex items-center justify-center text-white mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <h2 className="m-0 mb-2">Create your agency</h2>
              <p className="text-sm text-muted-foreground m-0">
                You'll be the owner with full access to settings and team management
              </p>
            </div>

            <form onSubmit={handleCreateAgency} className="space-y-4">
              <div>
                <Label htmlFor="agency-name">Agency Name</Label>
                <Input
                  id="agency-name"
                  type="text"
                  placeholder="Elite Recruiters"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  required
                  className="mt-2 min-h-[44px]"
                />
              </div>

              <div className="p-4 rounded-lg bg-accent">
                <p className="text-sm font-medium m-0 mb-2">You'll be able to:</p>
                <ul className="space-y-1 m-0 pl-0 list-none">
                  <li className="text-sm flex items-center gap-2">
                    <Check className="w-4 h-4 text-success flex-shrink-0" />
                    Invite team members
                  </li>
                  <li className="text-sm flex items-center gap-2">
                    <Check className="w-4 h-4 text-success flex-shrink-0" />
                    Create deal rooms for placements
                  </li>
                  <li className="text-sm flex items-center gap-2">
                    <Check className="w-4 h-4 text-success flex-shrink-0" />
                    Manage candidates and clients
                  </li>
                  <li className="text-sm flex items-center gap-2">
                    <Check className="w-4 h-4 text-success flex-shrink-0" />
                    Set roles and permissions
                  </li>
                </ul>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button 
                  type="button"
                  variant="ghost"
                  className="min-h-[44px]"
                  onClick={() => setStep("choice")}
                >
                  Back
                </Button>
                <Button 
                  type="submit"
                  className="flex-1 bg-accent-brand hover:bg-accent-brand-hover min-h-[44px]"
                >
                  Create Agency
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Join Agency - Email Step */}
        {step === "join-email" && (
          <Card className="p-8">
            <div className="mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h2 className="m-0 mb-2">Join existing agency</h2>
              <p className="text-sm text-muted-foreground m-0">
                Enter your work email to find your agency
              </p>
            </div>

            <form onSubmit={handleJoinEmail} className="space-y-4">
              <div>
                <Label htmlFor="work-email">Work Email</Label>
                <Input
                  id="work-email"
                  type="email"
                  placeholder="you@agency.com"
                  value={workEmail}
                  onChange={(e) => setWorkEmail(e.target.value)}
                  required
                  className="mt-2 min-h-[44px]"
                />
                <p className="text-xs text-muted-foreground mt-2 m-0">
                  We'll check if this email matches a registered agency domain
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button 
                  type="button"
                  variant="ghost"
                  className="min-h-[44px]"
                  onClick={() => setStep("choice")}
                >
                  Back
                </Button>
                <Button 
                  type="submit"
                  className="flex-1 bg-accent-brand hover:bg-accent-brand-hover min-h-[44px]"
                >
                  Continue
                </Button>
              </div>

              <div className="text-center pt-2">
                <Button 
                  type="button"
                  variant="link" 
                  className="text-sm"
                  onClick={() => setStep("join-code")}
                >
                  Have an invite code instead?
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Join Agency - Invite Code Step */}
        {step === "join-code" && (
          <Card className="p-8">
            <div className="mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h2 className="m-0 mb-2">Enter invite code</h2>
              <p className="text-sm text-muted-foreground m-0">
                Ask your agency admin for an invite code
              </p>
            </div>

            <form onSubmit={handleJoinCode} className="space-y-4">
              <div>
                <Label htmlFor="invite-code">Invite Code</Label>
                <Input
                  id="invite-code"
                  type="text"
                  placeholder="ABC123XYZ"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  required
                  className="mt-2 min-h-[44px] font-mono text-center text-lg"
                />
                <p className="text-xs text-muted-foreground mt-2 m-0">
                  Usually 6-10 characters
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button 
                  type="button"
                  variant="ghost"
                  className="min-h-[44px]"
                  onClick={() => setStep("join-email")}
                >
                  Back
                </Button>
                <Button 
                  type="submit"
                  className="flex-1 bg-accent-brand hover:bg-accent-brand-hover min-h-[44px]"
                >
                  Join Agency
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Complete Step */}
        {step === "complete" && (
          <Card className="p-8 text-center">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-success to-emerald-600 flex items-center justify-center text-white mx-auto mb-4">
              <Check className="w-8 h-8" />
            </div>
            
            <h2 className="m-0 mb-2">
              {agencyName ? `${agencyName} created!` : "Request sent!"}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              {agencyName 
                ? "Your agency workspace is ready. You can now invite team members and create deals."
                : foundAgency 
                ? `We've sent your request to ${foundAgency}. You'll get notified when approved.`
                : "Your request has been sent. You'll receive an email when it's approved."}
            </p>

            <Button 
              className="bg-accent-brand hover:bg-accent-brand-hover min-h-[44px]"
              onClick={onComplete}
            >
              Continue to Dashboard
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
