import { useState } from "react";
import { User, Building2, Users, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner@2.0.3";

interface WelcomeProps {
  onContinue: (intent: "freelancer" | "company" | "agency") => void;
  onClaimInvite?: () => void;
}

type Intent = "freelancer" | "company" | "agency" | null;

export function Welcome({ onContinue, onClaimInvite }: WelcomeProps) {
  const [selectedIntent, setSelectedIntent] = useState<Intent>(null);

  const handleIntentSelect = (intent: Intent) => {
    setSelectedIntent(intent);
  };

  const handleContinue = () => {
    if (selectedIntent) {
      toast.success(`Starting as ${selectedIntent === "freelancer" ? "Freelancer" : selectedIntent === "company" ? "Company" : "Agency"}`);
      onContinue(selectedIntent);
    }
  };

  const intents = [
    {
      id: "freelancer" as const,
      icon: User,
      title: "I'm a freelancer",
      description: "Create a profile, share updates, find work.",
      gradient: "from-blue-500/10 to-blue-600/10",
      hoverGradient: "hover:from-blue-500/20 hover:to-blue-600/20",
      border: "border-blue-500/20",
      selectedBorder: "border-blue-500",
      iconColor: "text-blue-500",
    },
    {
      id: "company" as const,
      icon: Building2,
      title: "I hire for my company",
      description: "Post roles, manage contractors, approve time.",
      gradient: "from-purple-500/10 to-purple-600/10",
      hoverGradient: "hover:from-purple-500/20 hover:to-purple-600/20",
      border: "border-purple-500/20",
      selectedBorder: "border-purple-500",
      iconColor: "text-purple-500",
    },
    {
      id: "agency" as const,
      icon: Users,
      title: "I'm an agency",
      description: "Submit candidates, run deal rooms, invoice.",
      gradient: "from-green-500/10 to-green-600/10",
      hoverGradient: "hover:from-green-500/20 hover:to-green-600/20",
      border: "border-green-500/20",
      selectedBorder: "border-green-500",
      iconColor: "text-green-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <div className="w-12 h-12 rounded-xl bg-accent-brand flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="mb-3">Welcome to WorkGraph</h1>
          <p className="text-muted-foreground">
            Join the network. It's free.
          </p>
        </div>

        {/* Intent Cards - 3-up grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {intents.map((intent) => {
            const Icon = intent.icon;
            const isSelected = selectedIntent === intent.id;

            return (
              <button
                key={intent.id}
                onClick={() => handleIntentSelect(intent.id)}
                className={`
                  relative group p-6 rounded-xl border-2 text-left
                  transition-all duration-200
                  bg-gradient-to-br ${intent.gradient}
                  ${isSelected 
                    ? `${intent.selectedBorder} shadow-lg scale-[1.02]` 
                    : `${intent.border} ${intent.hoverGradient} hover:shadow-md hover:scale-[1.01]`
                  }
                `}
              >
                {/* Icon */}
                <div className={`
                  w-12 h-12 rounded-lg mb-4 flex items-center justify-center
                  transition-colors
                  ${isSelected ? 'bg-white shadow-sm' : 'bg-white/50 group-hover:bg-white/80'}
                `}>
                  <Icon className={`w-6 h-6 ${intent.iconColor}`} />
                </div>

                {/* Title */}
                <h3 className="mb-2">{intent.title}</h3>

                {/* Description */}
                <p className="text-muted-foreground">
                  {intent.description}
                </p>

                {/* Selected indicator */}
                {isSelected && (
                  <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-accent-brand flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="flex flex-col items-center gap-4">
          <Button
            onClick={handleContinue}
            disabled={!selectedIntent}
            className="w-full md:w-auto min-w-[200px] h-12"
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          {/* Claim invite link */}
          {onClaimInvite && (
            <button
              onClick={onClaimInvite}
              className="text-accent-brand hover:text-accent-brand-hover transition-colors"
            >
              I have an invite
            </button>
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-muted-foreground mt-12 text-sm">
          You can always add more workspaces later.
        </p>
      </div>
    </div>
  );
}
