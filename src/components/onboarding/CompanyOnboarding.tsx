import { useState } from "react";
import { ArrowRight, ArrowLeft, Building2, Briefcase, Users, Search, Info } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner@2.0.3";

interface CompanyOnboardingProps {
  userEmail: string;
  userName: string;
  onComplete: (companyName?: string) => void;
  onPostRole?: () => void;
  onSkip?: () => void;
}

type Step = 1 | 2;

export function CompanyOnboarding({ userEmail, userName, onComplete, onPostRole, onSkip }: CompanyOnboardingProps) {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    country: "",
    timezone: "",
    emailDomain: "",
  });

  const handleCreateCompany = () => {
    if (formData.companyName) {
      toast.success(`${formData.companyName} created!`);
      setCurrentStep(2);
    }
  };

  const handleObjectiveSelect = (objective: "post-role" | "invite-team" | "explore") => {
    console.log("🎯 Objective selected:", objective, "Company:", formData.companyName);
    if (objective === "post-role" && onPostRole) {
      toast.success("Opening job creation...");
      onPostRole();
    } else if (objective === "invite-team") {
      toast.success("Team invite coming soon");
      onComplete(formData.companyName);
    } else {
      toast.info("Welcome! Explore your workspace");
      onComplete(formData.companyName);
    }
  };

  const objectives = [
    {
      id: "post-role" as const,
      icon: Briefcase,
      title: "Post a contractor role",
      description: "Find and hire freelancers for your project",
      gradient: "from-blue-500/10 to-blue-600/10",
      hoverGradient: "hover:from-blue-500/20 hover:to-blue-600/20",
      border: "border-blue-500/20",
      iconColor: "text-blue-500",
    },
    {
      id: "invite-team" as const,
      icon: Users,
      title: "Invite a teammate",
      description: "Add managers or finance team members",
      gradient: "from-purple-500/10 to-purple-600/10",
      hoverGradient: "hover:from-purple-500/20 hover:to-purple-600/20",
      border: "border-purple-500/20",
      iconColor: "text-purple-500",
    },
    {
      id: "explore" as const,
      icon: Search,
      title: "Just look around",
      description: "Explore the platform at your own pace",
      gradient: "from-green-500/10 to-green-600/10",
      hoverGradient: "hover:from-green-500/20 hover:to-green-600/20",
      border: "border-green-500/20",
      iconColor: "text-green-500",
    },
  ];

  const timezones = [
    "America/New_York (EST)",
    "America/Chicago (CST)",
    "America/Los_Angeles (PST)",
    "Europe/London (GMT)",
    "Europe/Paris (CET)",
    "Asia/Tokyo (JST)",
    "Australia/Sydney (AEST)",
  ];

  const canCreateCompany = formData.companyName && formData.country && formData.timezone;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Step Content */}
        <div className="bg-card rounded-xl border border-border p-8">
          {/* Step 1: Company Basics */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-accent-brand/10 flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6 text-accent-brand" />
                </div>
                <h2 className="mb-2">Create your company workspace</h2>
                <p className="text-muted-foreground">
                  Set up a workspace to post roles and manage contractors
                </p>
                <div className="mt-4 bg-accent/30 border border-border rounded-xl p-3">
                  <p className="text-sm m-0">
                    ✓ Personal profile created for {userName}
                  </p>
                </div>
              </div>

              {/* Info callout explaining Country vs Timezone */}
              <div className="flex gap-3 p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
                <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" strokeWidth={2} />
                <div>
                  <p className="text-sm m-0 mb-1 font-medium">Why we ask for both country and timezone</p>
                  <p className="text-xs text-muted-foreground m-0">
                    <strong className="text-foreground">Country</strong> determines tax rules and legal requirements. 
                    <strong className="text-foreground ml-1">Timezone</strong> helps match you with contractors who work in compatible hours—especially important since many countries span multiple timezones (USA has 6, Russia has 11!).
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="companyName">Company name *</Label>
                  <Input
                    id="companyName"
                    placeholder="Acme Inc."
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://acme.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="country" className="flex items-center gap-2">
                    Country *
                    <span className="text-xs text-muted-foreground font-normal">Legal entity location</span>
                  </Label>
                  <Input
                    id="country"
                    placeholder="United States"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="mt-1.5"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5 m-0">
                    For tax, compliance, and payment processing
                  </p>
                </div>

                <div>
                  <Label htmlFor="timezone" className="flex items-center gap-2">
                    Time zone *
                    <span className="text-xs text-muted-foreground font-normal">Primary work hours</span>
                  </Label>
                  <select
                    id="timezone"
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    className="w-full mt-1.5 px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select timezone...</option>
                    {timezones.map((tz) => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground mt-1.5 m-0">
                    Helps match you with contractors in compatible hours
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border bg-muted/30">
                  <Label htmlFor="emailDomain">Email domain (optional)</Label>
                  <Input
                    id="emailDomain"
                    placeholder="acme.com"
                    value={formData.emailDomain}
                    onChange={(e) => setFormData({ ...formData, emailDomain: e.target.value })}
                    className="mt-1.5"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Team members with this email domain can auto-join
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex gap-3 pt-6 border-t border-border">
                {onSkip && (
                  <Button
                    variant="ghost"
                    onClick={onSkip}
                    className="flex-1"
                  >
                    I'll do this later
                  </Button>
                )}
                <Button
                  onClick={handleCreateCompany}
                  disabled={!canCreateCompany}
                  className="flex-1"
                >
                  Create company
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: First Objective */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="mb-2">What do you want to do first?</h2>
                <p className="text-muted-foreground">
                  Choose how you'd like to get started
                </p>
              </div>

              {/* Objective Cards - 3 equal cards */}
              <div className="space-y-3">
                {objectives.map((objective) => {
                  const Icon = objective.icon;

                  return (
                    <button
                      key={objective.id}
                      onClick={() => handleObjectiveSelect(objective.id)}
                      className={`
                        w-full group p-5 rounded-xl border-2 text-left
                        transition-all duration-200
                        bg-gradient-to-br ${objective.gradient}
                        ${objective.border} ${objective.hoverGradient}
                        hover:shadow-md hover:scale-[1.01]
                      `}
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className="w-12 h-12 rounded-lg bg-white/80 flex items-center justify-center flex-shrink-0">
                          <Icon className={`w-6 h-6 ${objective.iconColor}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className="mb-1">{objective.title}</h3>
                          <p className="text-muted-foreground">
                            {objective.description}
                          </p>
                        </div>

                        {/* Arrow */}
                        <ArrowRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Back button only */}
              <div className="flex items-center justify-between pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <div />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
