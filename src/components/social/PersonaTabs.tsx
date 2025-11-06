import { useState } from "react";
import { Button } from "../ui/button";
import { Check } from "lucide-react";

type PersonaType = "freelancer" | "company" | "agency";

interface PersonaTabsProps {
  onGetStarted?: (persona: PersonaType) => void;
}

const personaContent = {
  freelancer: {
    bullets: [
      "Get discovered by verified companies",
      "Apply once, reuse your profile",
      "Approvals → auto-invoice → get paid",
    ],
    cta: "Create your profile",
    subtext: "Free forever for individuals",
  },
  company: {
    bullets: [
      "Post contract roles in minutes",
      "Approval chains built-in",
      "Vendor/EoR friendly, audit-ready",
    ],
    cta: "Post a role",
    subtext: "No credit card to start",
  },
  agency: {
    bullets: [
      "Deal rooms with client & candidate",
      "Submission consent tracking",
      "Multi-party invoicing (Agency ↔ Client ↔ Worker)",
    ],
    cta: "Create your agency",
    subtext: "Designed for recruiting & staff-aug",
  },
};

export function PersonaTabs({ onGetStarted }: PersonaTabsProps) {
  const [activeTab, setActiveTab] = useState<PersonaType>("freelancer");

  const content = personaContent[activeTab];

  return (
    <section className="py-32 md:py-40 px-6 bg-accent/5">
      <div className="max-w-6xl mx-auto">
        {/* Section title - Apple style */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl mb-6 font-semibold tracking-tight">
            Built for everyone.
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            One platform. Three experiences.
          </p>
        </div>

        {/* Tab buttons - cleaner */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex gap-2 p-2 bg-background/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-sm">
            {(["freelancer", "company", "agency"] as PersonaType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-xl font-medium capitalize transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-foreground text-background shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content - simpler, more spacious */}
        <div className="max-w-3xl mx-auto">
          <div className="space-y-8 mb-12">
            {content.bullets.map((bullet, index) => (
              <div key={index} className="flex items-start gap-5">
                <div className="w-7 h-7 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-success" />
                </div>
                <p className="text-foreground m-0 leading-relaxed text-xl">
                  {bullet}
                </p>
              </div>
            ))}
          </div>

          {/* CTA - centered */}
          <div className="text-center space-y-4">
            <Button
              size="lg"
              onClick={() => onGetStarted?.(activeTab)}
              className="px-10 py-6 text-lg rounded-2xl h-auto"
            >
              {content.cta}
            </Button>
            <p className="text-sm text-muted-foreground m-0">
              {content.subtext}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
