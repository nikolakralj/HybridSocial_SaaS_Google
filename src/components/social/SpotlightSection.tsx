import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface SpotlightSectionProps {
  onViewCaseStudy?: () => void;
}

export function SpotlightSection({ onViewCaseStudy }: SpotlightSectionProps) {
  return (
    <section className="py-24 md:py-32 px-6 bg-accent/10">
      <div className="max-w-6xl mx-auto">
        <div className="bg-card border border-border/60 rounded-3xl overflow-hidden shadow-lg">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image section */}
            <div className="relative min-h-[400px] md:min-h-[500px]">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=600&fit=crop"
                alt="Sarah Chen"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
            </div>

            {/* Content section */}
            <div className="p-10 md:p-12 flex flex-col justify-center">
              {/* Headline */}
              <div className="space-y-6 mb-8">
                <h3 className="text-3xl md:text-4xl text-foreground font-semibold tracking-tight leading-tight">
                  "From post to paid in 6 days."
                </h3>
                <p className="text-lg text-muted-foreground m-0 leading-relaxed">
                  Sarah landed a 12-week contract, onboarded smoothly, and got paid faster than any platform she'd used before.
                </p>
              </div>

              {/* Author info */}
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop"
                  alt="Sarah Chen"
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-border"
                />
                <div>
                  <h4 className="font-semibold text-foreground text-lg">Sarah Chen</h4>
                  <p className="text-sm text-muted-foreground m-0">
                    Product Designer · San Francisco
                  </p>
                </div>
              </div>

              {/* Metric pills */}
              <div className="flex flex-wrap gap-2 mb-8">
                <Badge className="bg-success/10 text-success border-success/20 hover:bg-success/20 px-3 py-1.5">
                  Paid Net-3 via auto-invoice
                </Badge>
                <Badge className="bg-accent-brand/10 text-accent-brand border-accent-brand/20 hover:bg-accent-brand/20 px-3 py-1.5">
                  12-week contract
                </Badge>
              </div>

              {/* CTA */}
              <Button 
                onClick={onViewCaseStudy}
                variant="ghost"
                size="lg"
                className="w-fit group text-base"
              >
                View Sarah's case study
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
