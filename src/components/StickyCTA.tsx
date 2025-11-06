import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { PersonaType } from "./social/IntentChips";

interface StickyCtaProps {
  onGetStarted?: (persona?: PersonaType) => void;
  persona?: PersonaType | null;
}

export function StickyCTA({ onGetStarted, persona }: StickyCtaProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA after hero is scrolled past (roughly 85vh)
      const heroHeight = window.innerHeight * 0.85;
      setIsVisible(window.scrollY > heroHeight);
    };

    handleScroll(); // Initial check
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getCtaText = () => {
    switch (persona) {
      case "freelancer":
        return "Create profile";
      case "company":
        return "Post a role";
      case "agency":
        return "Create agency";
      default:
        return "Get started";
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 md:hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
      <Button
        onClick={() => onGetStarted?.(persona || undefined)}
        size="lg"
        className="rounded-2xl shadow-2xl hover:shadow-xl transition-all duration-200 hover:-translate-y-1 font-medium group"
      >
        {getCtaText()}
        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
}
