import { useState } from "react";
import { Play, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { IntentChips, PersonaType } from "./social/IntentChips";

interface HeroProps {
  onGetStarted?: (persona?: PersonaType) => void;
  onWatchDemo?: () => void;
  onPersonaSelect?: (persona: PersonaType | null) => void;
}

export function Hero({ onGetStarted, onWatchDemo, onPersonaSelect }: HeroProps) {
  const [selectedPersona, setSelectedPersona] = useState<PersonaType | null>(null);

  const handlePersonaChange = (persona: PersonaType | null) => {
    setSelectedPersona(persona);
    onPersonaSelect?.(persona);
  };

  const handleGetStarted = () => {
    if (selectedPersona) {
      onGetStarted?.(selectedPersona);
    } else {
      onGetStarted?.();
    }
  };

  // 1. CTA adapts to selected persona
  const getCtaText = () => {
    switch (selectedPersona) {
      case "freelancer":
        return "Create your profile — free";
      case "company":
        return "Post a role";
      case "agency":
        return "Create your agency";
      default:
        return "Get started free";
    }
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center px-6 py-32">
      <div className="max-w-5xl mx-auto text-center">
        {/* Main headline - huge and bold */}
        <div className="space-y-8 mb-12">
          <h1 className="text-7xl md:text-8xl lg:text-9xl m-0 leading-[1.05] tracking-tight font-semibold">
            Connect your
            <br />
            work graph.
          </h1>

          <p className="text-2xl md:text-3xl text-muted-foreground m-0 leading-relaxed font-normal max-w-3xl mx-auto">
            Where people, posts, jobs—and your actual work—live together.
          </p>

          {/* 2. What it includes - factual, 1 line */}
          <p className="text-base text-muted-foreground/80 m-0 max-w-2xl mx-auto">
            Profiles, posts, jobs, contracts, time, invoices — in one place.
          </p>
        </div>

        {/* Single primary CTA */}
        <div className="flex flex-col items-center gap-6 mb-12">
          <Button 
            size="lg" 
            onClick={handleGetStarted}
            aria-label={getCtaText()}
            className="text-lg h-16 px-10 rounded-2xl transition-all duration-200 hover:shadow-2xl hover:-translate-y-1 font-medium group focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {getCtaText()}
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          {/* 3. Micro-trust under CTA */}
          <p className="text-xs text-muted-foreground m-0">
            Free forever for individuals · No credit card · GDPR ready
          </p>
          
          {/* Secondary action - much lighter */}
          <button 
            onClick={onWatchDemo}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
          >
            <Play className="w-3.5 h-3.5" />
            Watch demo
          </button>
        </div>

        {/* Optional persona selection - minimal */}
        <div className="mb-6">
          <IntentChips 
            selected={selectedPersona}
            onSelect={handlePersonaChange}
          />
        </div>
      </div>
    </section>
  );
}
