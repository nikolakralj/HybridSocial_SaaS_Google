import { useState } from "react";
import { ArrowLeft, Mail, Key, CheckCircle, Building2, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { toast } from "sonner@2.0.3";

type FlowStep = "email" | "found" | "invite-code" | "pending";

interface JoinWorkspaceFlowProps {
  onBack: () => void;
  onComplete: () => void;
}

export function JoinWorkspaceFlow({ onBack, onComplete }: JoinWorkspaceFlowProps) {
  const [step, setStep] = useState<FlowStep>("email");
  const [email, setEmail] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [foundWorkspace, setFoundWorkspace] = useState<{
    name: string;
    type: "company" | "agency";
    domain: string;
  } | null>(null);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock: Check if email domain matches known workspace
    const domain = email.split("@")[1];
    
    // Simulate finding a workspace
    if (domain === "eliterecruiters.com") {
      setFoundWorkspace({
        name: "Elite Recruiters",
        type: "agency",
        domain: domain
      });
      setStep("found");
    } else if (domain === "techventures.com") {
      setFoundWorkspace({
        name: "TechVentures Inc.",
        type: "company",
        domain: domain
      });
      setStep("found");
    } else {
      // No match found
      toast.info("No workspace found for this domain");
      setStep("invite-code");
    }
  };

  const handleRequestAccess = () => {
    toast.success(`Access request sent to ${foundWorkspace?.name} admins`);
    setStep("pending");
  };

  const handleInviteCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inviteCode.length < 6) {
      toast.error("Please enter a valid invite code");
      return;
    }
    
    // Mock: Validate invite code
    toast.success("Invite code accepted! Joining workspace...");
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Button 
          variant="ghost" 
          className="mb-6 gap-2"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <Card className="p-6">
          {/* Email Step */}
          {step === "email" && (
            <div>
              <div className="mb-6">
                <h2 className="m-0 mb-2">Join existing workspace</h2>
                <p className="text-sm text-muted-foreground m-0">
                  Enter your work email to find your organization
                </p>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Work Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-2 min-h-[44px]"
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-accent-brand hover:bg-accent-brand-hover min-h-[44px]"
                >
                  Continue
                </Button>
              </form>

              <div className="mt-4 text-center">
                <Button 
                  variant="link" 
                  className="text-sm"
                  onClick={() => setStep("invite-code")}
                >
                  Have an invite code instead?
                </Button>
              </div>
            </div>
          )}

          {/* Found Workspace Step */}
          {step === "found" && foundWorkspace && (
            <div>
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-success to-emerald-600 flex items-center justify-center text-white mx-auto mb-4">
                  {foundWorkspace.type === "agency" ? (
                    <Users className="w-8 h-8" />
                  ) : (
                    <Building2 className="w-8 h-8" />
                  )}
                </div>
                <h2 className="m-0 mb-2">We found {foundWorkspace.name}!</h2>
                <p className="text-sm text-muted-foreground m-0">
                  Request access from their admins
                </p>
              </div>

              <div className="p-4 rounded-lg bg-accent mb-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium m-0">{foundWorkspace.name}</p>
                  <Badge variant="outline" className="capitalize">
                    {foundWorkspace.type}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground m-0">
                  @{foundWorkspace.domain}
                </p>
              </div>

              <div className="space-y-3">
                <Button 
                  className="w-full bg-accent-brand hover:bg-accent-brand-hover gap-2 min-h-[44px]"
                  onClick={handleRequestAccess}
                >
                  <Mail className="w-4 h-4" />
                  Request Access
                </Button>

                <Button 
                  variant="outline"
                  className="w-full min-h-[44px]"
                  onClick={() => setStep("email")}
                >
                  Try different email
                </Button>
              </div>
            </div>
          )}

          {/* Invite Code Step */}
          {step === "invite-code" && (
            <div>
              <div className="mb-6">
                <h2 className="m-0 mb-2">Enter invite code</h2>
                <p className="text-sm text-muted-foreground m-0">
                  Ask your admin for an invite code
                </p>
              </div>

              <form onSubmit={handleInviteCodeSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="invite-code">Invite Code</Label>
                  <Input
                    id="invite-code"
                    type="text"
                    placeholder="ABC123XYZ"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    required
                    className="mt-2 min-h-[44px] font-mono"
                  />
                  <p className="text-xs text-muted-foreground mt-2 m-0">
                    Usually 6-10 characters
                  </p>
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-accent-brand hover:bg-accent-brand-hover min-h-[44px]"
                >
                  Join Workspace
                </Button>
              </form>

              <div className="mt-4 text-center">
                <Button 
                  variant="link" 
                  className="text-sm"
                  onClick={() => setStep("email")}
                >
                  Try with email instead
                </Button>
              </div>
            </div>
          )}

          {/* Pending Approval Step */}
          {step === "pending" && foundWorkspace && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-warning to-orange-600 flex items-center justify-center text-white mx-auto mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              
              <h2 className="m-0 mb-2">Request sent!</h2>
              <p className="text-sm text-muted-foreground mb-6">
                We've notified the admins at {foundWorkspace.name}. You'll get an email when they approve your request.
              </p>

              <div className="p-4 rounded-lg bg-accent mb-6">
                <p className="text-sm m-0">
                  <span className="font-medium">Your email:</span> {email}
                </p>
              </div>

              <Button 
                variant="outline"
                className="w-full min-h-[44px]"
                onClick={onBack}
              >
                Back to workspaces
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
