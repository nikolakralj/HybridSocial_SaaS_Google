import { useEffect, useState } from "react";

interface UseScrollSpyOptions {
  sectionIds: string[];
  offset?: number;
  throttle?: number;
}

export function useScrollSpy({ sectionIds, offset = 0, throttle = 100 }: UseScrollSpyOptions) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        const scrollPosition = window.scrollY + offset;
        
        // Find the section that is currently in view
        let currentSection: string | null = null;
        
        for (const id of sectionIds) {
          const element = document.getElementById(id);
          if (element) {
            const { top, bottom } = element.getBoundingClientRect();
            const elementTop = top + window.scrollY;
            const elementBottom = bottom + window.scrollY;
            
            // Check if scroll position is within this section
            if (scrollPosition >= elementTop - offset && scrollPosition < elementBottom - offset) {
              currentSection = id;
              break;
            }
          }
        }
        
        setActiveSection(currentSection);
      }, throttle);
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, [sectionIds, offset, throttle]);

  return activeSection;
}
