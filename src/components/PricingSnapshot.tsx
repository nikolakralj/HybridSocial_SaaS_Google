import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { PersonaType } from "./social/IntentChips";

interface PricingSnapshotProps {
  onGetStarted?: (persona?: PersonaType) => void;
}

interface Plan {
  name: string;
  price: string;
  annualPrice: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  isFree?: boolean;
  persona?: PersonaType;
}

const plans: Plan[] = [
  {
    name: "Personal",
    price: "Free",
    annualPrice: "Free",
    description: "For freelancers building their career",
    features: [
      "Personal profile (public or private)",
      "Unlimited applications",
      "Auto-invoice from timesheets",
      "Community access",
    ],
    cta: "Create your profile",
    isFree: true,
    persona: "freelancer",
  },
  {
    name: "Team",
    price: "$29",
    annualPrice: "$24",
    description: "For companies hiring and managing contractors",
    features: [
      "Post unlimited contract roles",
      "Worker Records (private)",
      "Approval chains",
      "Timesheets & invoicing",
      "Vendor/EoR compatible",
    ],
    cta: "Start free trial",
    highlighted: true,
    persona: "company",
  },
  {
    name: "Agency",
    price: "$99",
    annualPrice: "$79",
    description: "For agencies & headhunters placing talent",
    features: [
      "Deal rooms (3-party)",
      "Consent tracking",
      "Multi-party invoicing",
      "Agency fee automation",
      "Unlimited placements",
    ],
    cta: "Start free trial",
    persona: "agency",
  },
];

export function PricingSnapshot({ onGetStarted }: PricingSnapshotProps) {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="m-0 mb-4 text-3xl md:text-4xl font-semibold tracking-tight">
            Simple, transparent pricing
          </h2>
          <p className="text-muted-foreground m-0 mb-6">
            Start free. Upgrade as you grow.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-2 p-1.5 bg-accent/50 rounded-xl">
            <button
              onClick={() => setBillingPeriod("monthly")}
              aria-label="Select monthly billing"
              className={`px-4 py-2 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                billingPeriod === "monthly" 
                  ? "bg-card shadow-sm text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("annual")}
              aria-label="Select annual billing and save 20 percent"
              className={`px-4 py-2 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                billingPeriod === "annual" 
                  ? "bg-card shadow-sm text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Annual
              <span 
                className="ml-2 text-xs font-semibold" 
                style={{ color: billingPeriod === "annual" ? "#10B981" : "#10B981" }}
              >
                Save 20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`p-10 relative rounded-3xl transition-all duration-200 ${
                plan.highlighted 
                  ? "border-2 border-accent-brand shadow-2xl scale-[1.03]" 
                  : "border-border/50 hover:border-border"
              }`}
            >
              {plan.highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-brand">
                  Most Popular
                </Badge>
              )}
              
              {plan.isFree && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-success">
                  Free Forever
                </Badge>
              )}

              <div className="mb-6">
                <h3 className="m-0 mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground m-0 mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-semibold">
                    {billingPeriod === "annual" ? plan.annualPrice : plan.price}
                  </span>
                  {plan.price !== "Free" && (
                    <span className="text-sm text-muted-foreground">/seat/mo</span>
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                className="w-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                style={{ minHeight: "44px" }}
                variant={plan.highlighted ? "default" : "outline"}
                onClick={() => onGetStarted?.(plan.persona)}
              >
                {plan.cta}
              </Button>
            </Card>
          ))}
        </div>

        <div className="text-center space-y-3">
          <p className="text-xs text-muted-foreground m-0">
            SOC 2 in progress · GDPR ready · All plans include priority support
          </p>
        </div>
      </div>
    </section>
  );
}
