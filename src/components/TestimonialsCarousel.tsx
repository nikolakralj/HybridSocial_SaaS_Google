import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "./ui/button";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
}

export function TestimonialsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials: Testimonial[] = [
    {
      quote: "WorkGraph replaced 4 tools for me. I now find work, log hours, and invoice clients all in one place. Game changer.",
      author: "Sarah Chen",
      role: "Senior React Developer",
      company: "Independent",
      avatar: "SC"
    },
    {
      quote: "Finally, a platform that gets freelancing. The automatic invoicing from approved timesheets alone saves me 10 hours a month.",
      author: "Marcus Rivera",
      role: "Full-Stack Engineer",
      company: "Independent",
      avatar: "MR"
    },
    {
      quote: "Hiring contractors used to be a nightmare. WorkGraph gives us proper audit trails and compliance without the overhead.",
      author: "Alex Morgan",
      role: "Engineering Manager",
      company: "TechCorp",
      avatar: "AM"
    },
    {
      quote: "As an agency, the 3-party deal rooms with consent tracking are exactly what we needed. No more spreadsheet chaos.",
      author: "Jamie Lee",
      role: "Founder",
      company: "Elite Recruiters",
      avatar: "JL"
    }
  ];

  const next = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-rotate every 6 seconds
  useEffect(() => {
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, []);

  const active = testimonials[activeIndex];

  return (
    <section className="py-20 md:py-24 px-6 bg-accent/20 relative overflow-hidden">
      {/* Subtle section gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-transparent pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">
            See what people are saying
          </h2>
          <p className="text-muted-foreground">
            Freelancers, companies, and agencies love WorkGraph
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="bg-card border border-border rounded-3xl p-8 md:p-12 apple-shadow-lg apple-transition hover:apple-shadow-xl">
            {/* Quote icon */}
            <Quote className="w-12 h-12 text-accent-brand/15 mb-6" strokeWidth={1.5} />

            {/* Quote text */}
            <p className="text-xl md:text-2xl mb-8 leading-relaxed text-foreground/90">
              "{active.quote}"
            </p>

            {/* Author info */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent-brand/20 to-accent-brand/10 flex items-center justify-center flex-shrink-0 apple-shadow-sm">
                <span className="text-lg font-semibold text-accent-brand">{active.avatar}</span>
              </div>
              <div>
                <p className="font-semibold m-0">{active.author}</p>
                <p className="text-sm text-muted-foreground m-0">
                  {active.role} · {active.company}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              className="rounded-full apple-shadow-sm hover:apple-shadow-md apple-transition hover:bg-accent"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" strokeWidth={2} />
            </Button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-2 rounded-full apple-transition ${
                    idx === activeIndex
                      ? "bg-accent-brand w-8"
                      : "bg-muted hover:bg-accent-brand/50 w-2"
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={next}
              className="rounded-full apple-shadow-sm hover:apple-shadow-md apple-transition hover:bg-accent"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" strokeWidth={2} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
