import { useEffect, useRef, useState } from "react";

interface StatCardProps {
  number: string;
  label: string;
  sublabel?: string;
}

function StatCard({ number, label, sublabel }: StatCardProps) {
  const [displayNumber, setDisplayNumber] = useState("0");
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    // Animate the number
    const targetNumber = parseFloat(number.replace(/[^0-9.]/g, ""));
    const suffix = number.replace(/[0-9.]/g, "");
    const duration = 800;
    const steps = 30;
    const increment = targetNumber / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(current + increment, targetNumber);
      
      if (step >= steps) {
        setDisplayNumber(number);
        clearInterval(timer);
      } else {
        // Format number appropriately
        if (suffix.includes("k") || suffix.includes("+")) {
          setDisplayNumber(current.toFixed(1) + suffix);
        } else if (suffix.includes("M")) {
          setDisplayNumber("$" + current.toFixed(0) + "M");
        } else if (suffix.includes("×")) {
          setDisplayNumber(current.toFixed(1) + "×");
        } else {
          setDisplayNumber(Math.floor(current).toString() + suffix);
        }
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, number]);

  return (
    <div ref={ref} className="text-center space-y-2" style={{ minHeight: "140px" }}>
      <div className="text-5xl md:text-6xl font-semibold tracking-tight" style={{ minHeight: "72px" }}>
        {displayNumber}
      </div>
      <div className="text-base text-muted-foreground font-normal">
        {label}
      </div>
      {sublabel && (
        <div className="text-sm text-muted-foreground/70">
          {sublabel}
        </div>
      )}
    </div>
  );
}

export function ResultsStrip() {
  return (
    <section className="py-12 md:py-16 px-6 border-y border-border/30">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-sm text-muted-foreground mb-8">
          Trusted by freelancers, companies, and agencies
        </p>
        <div className="grid md:grid-cols-4 gap-12">
          <StatCard
            number="$50M+"
            label="savings"
          />
          <StatCard
            number="7,200+"
            label="roles filled"
          />
          <StatCard
            number="10hrs"
            label="saved/month"
          />
          <StatCard
            number="2 mins"
            label="to invoice"
          />
        </div>
      </div>
    </section>
  );
}
