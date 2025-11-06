import { Building2, UserCircle, Network } from "lucide-react";
import { Button } from "./ui/button";
import { PersonaType } from "./social/IntentChips";

interface VisualFeatureBlocksProps {
  onGetStarted?: (persona?: PersonaType) => void;
}

export function VisualFeatureBlocks({ onGetStarted }: VisualFeatureBlocksProps) {
  const features = [
    {
      persona: "freelancer" as PersonaType,
      icon: UserCircle,
      title: "Freelancers",
      subtitle: "Build your career",
      description: "Your professional profile, portfolio, and work history — all in one place.",
      visual: (
        <div className="space-y-3">
          {/* Profile card mockup */}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-accent-brand/10 flex items-center justify-center flex-shrink-0">
                <span className="font-semibold text-accent-brand">SC</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold m-0">Sarah Chen</p>
                <p className="text-sm text-muted-foreground m-0">Senior React Developer</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs bg-accent px-2 py-1 rounded-full">React</span>
              <span className="text-xs bg-accent px-2 py-1 rounded-full">TypeScript</span>
              <span className="text-xs bg-accent px-2 py-1 rounded-full">Node.js</span>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-success/5 border border-success/20 rounded-lg p-3">
              <p className="text-xs text-muted-foreground m-0">Invoiced (YTD)</p>
              <p className="text-lg font-semibold m-0 text-success">$127K</p>
            </div>
            <div className="bg-accent-brand/5 border border-accent-brand/20 rounded-lg p-3">
              <p className="text-xs text-muted-foreground m-0">Rate</p>
              <p className="text-lg font-semibold m-0 text-accent-brand">$175/hr</p>
            </div>
          </div>
        </div>
      ),
      features: [
        "Public profile with portfolio",
        "Apply to contract roles",
        "Auto-generate invoices",
        "Track time & earnings"
      ],
      cta: "Create your profile"
    },
    {
      persona: "company" as PersonaType,
      icon: Building2,
      title: "Companies",
      subtitle: "Hire contractors",
      description: "Post roles, manage contractors, approve work, and stay compliant.",
      visual: (
        <div className="space-y-3">
          {/* Worker card mockup */}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold m-0">Active contractors</p>
              <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full font-medium">12</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-accent/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-accent-brand/10" />
                  <div>
                    <p className="text-sm font-medium m-0">Alex Morgan</p>
                    <p className="text-xs text-muted-foreground m-0">Frontend Dev</p>
                  </div>
                </div>
                <p className="text-sm font-semibold m-0">40h</p>
              </div>
              <div className="flex items-center justify-between p-2 bg-accent/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-success/10" />
                  <div>
                    <p className="text-sm font-medium m-0">Jamie Lee</p>
                    <p className="text-xs text-muted-foreground m-0">Backend Dev</p>
                  </div>
                </div>
                <p className="text-sm font-semibold m-0">32h</p>
              </div>
            </div>
          </div>
          
          {/* Approval pending */}
          <div className="bg-warning/5 border border-warning/20 rounded-lg p-3">
            <p className="text-xs text-muted-foreground m-0 mb-1">Pending approval</p>
            <p className="text-sm font-semibold m-0">3 timesheets • $4,200</p>
          </div>
        </div>
      ),
      features: [
        "Post unlimited roles",
        "Private Worker Records",
        "Approval workflows",
        "EoR/vendor compatible"
      ],
      cta: "Post a role"
    },
    {
      persona: "agency" as PersonaType,
      icon: Network,
      title: "Agencies",
      subtitle: "Place talent",
      description: "3-party deal rooms with consent tracking and automated fee splits.",
      visual: (
        <div className="space-y-3">
          {/* Deal room mockup */}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold m-0">Active placements</p>
              <span className="text-xs bg-accent-brand/10 text-accent-brand px-2 py-1 rounded-full font-medium">8</span>
            </div>
            <div className="space-y-2">
              <div className="p-3 bg-gradient-to-br from-accent-brand/5 to-accent-brand/10 border border-accent-brand/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium m-0">TechCorp → Sarah Chen</p>
                  <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">Active</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground m-0">Client pays</p>
                    <p className="font-semibold m-0">$200/hr</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground m-0">Worker gets</p>
                    <p className="font-semibold m-0">$160/hr</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground m-0">Your fee</p>
                    <p className="font-semibold text-success m-0">$40/hr</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Monthly revenue */}
          <div className="bg-success/5 border border-success/20 rounded-lg p-3">
            <p className="text-xs text-muted-foreground m-0 mb-1">This month</p>
            <p className="text-xl font-semibold m-0 text-success">$18,200</p>
            <p className="text-xs text-muted-foreground m-0 mt-1">Agency fees collected</p>
          </div>
        </div>
      ),
      features: [
        "3-party deal rooms",
        "Consent tracking",
        "Automated fee splits",
        "Unlimited placements"
      ],
      cta: "Create your agency"
    }
  ];

  return (
    <section className="py-32 md:py-40 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl mb-6 font-semibold tracking-tight">
            Built for everyone.
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            One platform. Three complete experiences.
          </p>
        </div>

        {/* Feature blocks */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.persona}
                className="bg-card border border-border rounded-2xl p-8 hover:border-accent-brand/50 transition-all duration-200 hover:shadow-xl"
              >
                {/* Icon + Title */}
                <div className="mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-accent-brand/10 flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-accent-brand" />
                  </div>
                  <h3 className="mb-1 text-xl font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground m-0">{feature.subtitle}</p>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  {feature.description}
                </p>

                {/* Visual mockup */}
                <div className="mb-6">
                  {feature.visual}
                </div>

                {/* Feature list */}
                <div className="space-y-2 mb-6">
                  {feature.features.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-brand flex-shrink-0" />
                      <p className="text-sm text-muted-foreground m-0">{item}</p>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Button
                  onClick={() => onGetStarted?.(feature.persona)}
                  className="w-full rounded-xl"
                  variant={feature.persona === "company" ? "default" : "outline"}
                >
                  {feature.cta}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
