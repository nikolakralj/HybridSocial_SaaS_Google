import { ImageWithFallback } from "./figma/ImageWithFallback";

interface HeroProductPreviewProps {
  imageUrl?: string;
}

/**
 * Optional: Add this below the hero to show a product screenshot
 * Apple-style with subtle shadow and minimal chrome
 */
export function HeroProductPreview({ 
  imageUrl = "https://images.unsplash.com/photo-1587522630593-3b9e5f3255f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwd29ya3NwYWNlJTIwZGVza3xlbnwxfHx8fDE3NjAxNDM4Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080"
}: HeroProductPreviewProps) {
  return (
    <section className="relative py-12 px-6 -mt-12">
      <div className="max-w-5xl mx-auto">
        {/* Browser chrome mockup */}
        <div className="rounded-2xl overflow-hidden apple-shadow-xl bg-card border border-border/50">
          {/* Fake browser bar */}
          <div className="bg-muted/30 border-b border-border/50 px-4 py-3 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-warning/60" />
              <div className="w-3 h-3 rounded-full bg-success/60" />
            </div>
            <div className="flex-1 mx-4 h-6 bg-muted/50 rounded-md flex items-center px-3">
              <span className="text-xs text-muted-foreground">workgraph.app</span>
            </div>
          </div>
          
          {/* Product screenshot placeholder */}
          <div className="aspect-[16/10] bg-gradient-to-br from-accent/5 to-accent/20 relative overflow-hidden">
            <ImageWithFallback
              src={imageUrl}
              alt="WorkGraph platform preview"
              className="w-full h-full object-cover object-top"
            />
            {/* Subtle overlay to blend */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card/20 pointer-events-none" />
          </div>
        </div>

        {/* Optional: Feature badges below screenshot */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {[
            "SOC 2 Compliant",
            "Bank-level security",
            "99.9% uptime"
          ].map((badge) => (
            <div
              key={badge}
              className="px-4 py-2 rounded-full bg-card border border-border/50 text-sm text-muted-foreground apple-shadow-sm"
            >
              {badge}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
