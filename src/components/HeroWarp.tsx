import { useState } from "react";
import { ArrowRight, Star, Building2, Users, Network } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { PersonaType } from "./social/IntentChips";

interface HeroWarpProps {
  onGetStarted?: (email: string, intent?: PersonaType) => void;
}

export function HeroWarp({ onGetStarted }: HeroWarpProps) {
  const [email, setEmail] = useState("");
  const [selectedIntent, setSelectedIntent] = useState<PersonaType | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onGetStarted?.(email, selectedIntent || undefined);
    }
  };

  const intents = [
    { id: "freelancer" as PersonaType, label: "I'm freelancing", icon: Users },
    { id: "company" as PersonaType, label: "I'm hiring contractors", icon: Building2 },
    { id: "agency" as PersonaType, label: "I'm placing talent", icon: Network }
  ];

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center px-6 py-20 gradient-subtle overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-brand/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-brand/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl w-full mx-auto text-center relative z-10">
        {/* Main headline - clear value prop */}
        <h1 className="text-5xl md:text-7xl mb-6 font-semibold tracking-tight leading-[1.1] fade-in-up">
          The work platform built for technical freelancers
        </h1>

        {/* Supporting subtext - benefit in one breath */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed fade-in-up-delay-1">
          Social network meets work tools. Find jobs, ship work, and get paid — all in one place.
        </p>

        {/* Intent selection - optional but helpful */}
        <div className="flex flex-wrap justify-center gap-3 mb-8 fade-in-up-delay-2">
          {intents.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSelectedIntent(id === selectedIntent ? null : id)}
              className={`
                px-5 py-3 rounded-xl font-medium apple-transition text-sm
                flex items-center gap-2
                ${selectedIntent === id
                  ? "bg-accent-brand text-white apple-shadow-md hover:bg-accent-brand-hover hover:apple-shadow-lg"
                  : "bg-card border border-border hover:border-accent-brand/50 text-foreground apple-shadow-sm hover:apple-shadow-md"
                }
              `}
            >
              <Icon className="w-4 h-4" strokeWidth={2} />
              {label}
            </button>
          ))}
        </div>

        {/* Single email + CTA */}
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8 fade-in-up-delay-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 text-base px-6 bg-card apple-shadow-sm border-border focus:apple-shadow-md apple-transition"
              required
            />
            <Button
              type="submit"
              size="lg"
              className="h-14 px-8 text-base rounded-xl font-medium whitespace-nowrap bg-gradient-to-r from-accent-brand to-accent-brand-hover hover:shadow-lg hover:shadow-accent-brand/25 apple-transition hover:scale-[1.02] active:scale-[0.98]"
            >
              Get started
              <ArrowRight className="w-5 h-5 ml-2" strokeWidth={2.5} />
            </Button>
          </div>
        </form>

        {/* Trust signal below CTA */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground fade-in-up-delay-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-warning text-warning" strokeWidth={0} />
            <Star className="w-4 h-4 fill-warning text-warning" strokeWidth={0} />
            <Star className="w-4 h-4 fill-warning text-warning" strokeWidth={0} />
            <Star className="w-4 h-4 fill-warning text-warning" strokeWidth={0} />
            <Star className="w-4 h-4 fill-warning text-warning" strokeWidth={0} />
          </div>
          <span className="font-medium text-foreground">4.9/5</span>
          <span>from 280+ freelancers</span>
        </div>

        {/* Secondary micro-trust */}
        <p className="text-xs text-muted-foreground mt-4 fade-in-up-delay-3">
          Free forever for individuals · No credit card · SOC 2 in progress
        </p>
      </div>
    </section>
  );
}
