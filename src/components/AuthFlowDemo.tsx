import { useState } from "react";
import { ArrowRight, Check, User, Building2, Users } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

/**
 * AuthFlowDemo - Visual explanation of the authentication and context flow
 * Shows how one login leads to context chooser and context-specific navigation
 */

export function AuthFlowDemo() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 0,
      title: "One Login",
      description: "User signs in with a single email/password",
      visual: (
        <div className="p-8 bg-accent rounded-xl text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-brand mb-4">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8 text-white"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h3 className="m-0 mb-2">sarah@example.com</h3>
          <p className="text-sm text-muted-foreground m-0">Authenticating...</p>
        </div>
      ),
      microcopy: "One login, multiple workspaces. Switch contexts anytime from the header."
    },
    {
      id: 1,
      title: "Context Chooser",
      description: "If user has >1 context, they choose which workspace to enter",
      visual: (
        <div className="grid grid-cols-3 gap-4">
          {[
            { name: "Sarah Chen", type: "personal" as const, role: null, icon: User, color: "from-accent-brand to-purple-600" },
            { name: "TechVentures Inc.", type: "company" as const, role: "Owner", icon: Building2, color: "from-warning to-orange-600" },
            { name: "Elite Recruiters", type: "agency" as const, role: "Admin", icon: Users, color: "from-success to-emerald-600" }
          ].map((ctx) => (
            <Card key={ctx.name} className="p-4 text-center hover:shadow-lg transition-all cursor-pointer">
              <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${ctx.color} flex items-center justify-center`}>
                <ctx.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="m-0 mb-1 text-sm">{ctx.name}</h4>
              <div className="flex items-center justify-center gap-1 mb-2">
                <Badge variant="outline" className="text-xs capitalize">{ctx.type}</Badge>
                {ctx.role && <Badge className="text-xs bg-accent-brand text-white">{ctx.role}</Badge>}
              </div>
            </Card>
          ))}
        </div>
      ),
      microcopy: "Single context users skip this and go straight to their workspace."
    },
    {
      id: 2,
      title: "Context-Specific Navigation (Personal)",
      description: "Personal context shows freelancer-focused navigation",
      visual: (
        <div className="p-6 bg-accent rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-accent-brand" />
            <span className="font-medium">Sarah Chen</span>
            <Badge variant="outline" className="text-xs">Personal</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Dashboard", "Deliver", "Contracts", "Finance", "Messages", "Profile"].map((item) => (
              <Badge key={item} variant="secondary" className="text-xs">{item}</Badge>
            ))}
          </div>
        </div>
      ),
      microcopy: "\"Deliver\" = my projects & time; \"Finance\" = invoices I issue as supplier"
    },
    {
      id: 3,
      title: "Context-Specific Navigation (Company)",
      description: "Company context shows team management tools",
      visual: (
        <div className="p-6 bg-accent rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-warning" />
            <span className="font-medium">TechVentures Inc.</span>
            <Badge variant="outline" className="text-xs">Company</Badge>
            <Badge className="text-xs bg-warning text-white">Owner</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Dashboard", "Recruit", "Deliver", "Contracts", "Finance", "Directory", "Messages", "Settings"].map((item) => (
              <Badge key={item} variant="secondary" className="text-xs">{item}</Badge>
            ))}
          </div>
        </div>
      ),
      microcopy: "Directory = internal Worker Records; Recruit = jobs & candidates"
    },
    {
      id: 4,
      title: "Context-Specific Navigation (Agency)",
      description: "Agency context shows candidate and client management",
      visual: (
        <div className="p-6 bg-accent rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-success" />
            <span className="font-medium">Elite Recruiters</span>
            <Badge variant="outline" className="text-xs">Agency</Badge>
            <Badge className="text-xs bg-success text-white">Admin</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Dashboard", "Recruit", "Candidates", "Clients", "Contracts", "Finance", "Messages", "Settings"].map((item) => (
              <Badge key={item} variant="secondary" className="text-xs">{item}</Badge>
            ))}
          </div>
        </div>
      ),
      microcopy: "Candidates = agency-owned Worker Records; Clients = companies we place with"
    },
    {
      id: 5,
      title: "Always-Visible Context Switcher",
      description: "User can switch context anytime from header",
      visual: (
        <div className="space-y-4">
          <div className="p-4 bg-accent rounded-xl">
            <p className="text-sm text-muted-foreground mb-2 m-0">Header shows current context:</p>
            <div className="flex items-center gap-2 p-2 rounded-lg border border-border bg-card">
              <Building2 className="w-4 h-4 text-warning" />
              <span className="font-medium text-sm">TechVentures Inc.</span>
              <Badge variant="outline" className="text-xs">Company</Badge>
            </div>
          </div>
          
          <div className="p-4 bg-accent rounded-xl">
            <p className="text-sm text-muted-foreground mb-2 m-0">Click to see all workspaces + create new:</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-accent-brand" />
                <span>Act as: Me, My Company, My Agency</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-accent-brand" />
                <span>Search if you have many workspaces</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-accent-brand" />
                <span>Create new Company or Agency</span>
              </div>
            </div>
          </div>
        </div>
      ),
      microcopy: "Switching changes navigation, dashboard, and sender identity in messages"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1280px] mx-auto px-6 py-6 space-y-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="m-0 mb-2">Authentication & Context Flow</h1>
          <p className="text-muted-foreground">
            How WorkGraph implements "one login, multiple workspaces" with context switching
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-2">
              <button
                onClick={() => setCurrentStep(index)}
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  index === currentStep
                    ? "border-accent-brand bg-accent-brand text-white"
                    : index < currentStep
                    ? "border-success bg-success text-white"
                    : "border-border bg-card"
                }`}
              >
                {index < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </button>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 ${index < currentStep ? "bg-success" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Current Step */}
        <Card className="p-8 max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent-brand text-white">
                {currentStep + 1}
              </div>
              <h2 className="m-0">{steps[currentStep].title}</h2>
            </div>
            <p className="text-muted-foreground m-0">{steps[currentStep].description}</p>
          </div>

          {/* Visual */}
          <div className="mb-6">
            {steps[currentStep].visual}
          </div>

          {/* Microcopy */}
          <div className="p-4 rounded-lg bg-accent/50 border border-border">
            <p className="text-sm text-muted-foreground m-0">
              💡 <strong>Design Note:</strong> {steps[currentStep].microcopy}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className={`px-4 py-2 rounded-lg border-0 transition-colors min-h-[44px] ${
                currentStep === 0
                  ? "bg-accent text-muted-foreground cursor-not-allowed"
                  : "bg-accent hover:bg-accent/70"
              }`}
            >
              Previous
            </button>

            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </span>

            <button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              disabled={currentStep === steps.length - 1}
              className={`px-4 py-2 rounded-lg border-0 transition-colors flex items-center gap-2 min-h-[44px] ${
                currentStep === steps.length - 1
                  ? "bg-accent text-muted-foreground cursor-not-allowed"
                  : "bg-accent-brand hover:bg-accent-brand-hover text-white"
              }`}
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </Card>

        {/* Key Principles */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-4">
          <Card className="p-6">
            <h3 className="m-0 mb-2">One Account</h3>
            <p className="text-sm text-muted-foreground m-0">
              Single authentication for all workspaces. No need to log out and back in.
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="m-0 mb-2">Multiple Contexts</h3>
            <p className="text-sm text-muted-foreground m-0">
              Be a freelancer, company owner, and agency admin with the same login.
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="m-0 mb-2">Context-Aware UI</h3>
            <p className="text-sm text-muted-foreground m-0">
              Navigation, dashboard, and actions change based on which workspace you're in.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
