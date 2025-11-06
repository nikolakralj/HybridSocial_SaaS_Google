import { useState } from "react";
import { Users, Building2, Briefcase } from "lucide-react";

export type PersonaType = "freelancer" | "company" | "agency";

interface IntentChipsProps {
  selected?: PersonaType | null;
  onSelect?: (persona: PersonaType) => void;
}

const personas = [
  { type: "freelancer" as PersonaType, label: "Freelancer", icon: Users },
  { type: "company" as PersonaType, label: "Company", icon: Building2 },
  { type: "agency" as PersonaType, label: "Agency", icon: Briefcase },
];

export function IntentChips({ selected, onSelect }: IntentChipsProps) {
  const [selectedPersona, setSelectedPersona] = useState<PersonaType | null>(selected || null);

  const handleSelect = (persona: PersonaType) => {
    setSelectedPersona(persona);
    onSelect?.(persona);
  };

  return (
    <div className="flex gap-3 flex-wrap justify-center">
      {personas.map(({ type, label }) => (
        <button
          key={type}
          onClick={() => handleSelect(type)}
          aria-label={`Select ${label} persona`}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
            selectedPersona === type
              ? "bg-foreground text-background"
              : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-accent/50"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
