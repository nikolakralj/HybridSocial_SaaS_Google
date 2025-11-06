import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

const flowSteps = [
  "Post",
  "Interview",
  "Offer",
  "Contract",
  "Time",
  "Invoice",
];

export function ProductFlow() {
  const [activeStep, setActiveStep] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Animate through steps
          let step = 0;
          const interval = setInterval(() => {
            setActiveStep(step);
            step++;
            if (step >= flowSteps.length) {
              clearInterval(interval);
            }
          }, 200);

          return () => clearInterval(interval);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="py-8">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {flowSteps.map((step, index) => (
            <div key={step} className="flex items-center flex-1">
              {/* Step */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    index <= activeStep
                      ? "bg-accent-brand text-white shadow-lg scale-110"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index < activeStep ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-semibold">{index + 1}</span>
                  )}
                </div>
                <span
                  className={`text-xs font-medium transition-colors ${
                    index <= activeStep ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step}
                </span>
              </div>

              {/* Connector line */}
              {index < flowSteps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 mb-6">
                  <div
                    className={`h-full transition-all duration-500 ${
                      index < activeStep ? "bg-accent-brand" : "bg-muted"
                    }`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
