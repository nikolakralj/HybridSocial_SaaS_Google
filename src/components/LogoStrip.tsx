export function LogoStrip() {
  const companies = [
    "TechCorp",
    "StartupX",
    "DevShop",
    "CloudCo",
    "BuildLabs",
    "ScaleVentures"
  ];

  return (
    <section className="py-10 px-6 border-b border-border/30">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-xs text-muted-foreground mb-6">
          Used by high-growth startups
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {companies.map((company) => (
            <div
              key={company}
              className="text-sm font-medium text-muted-foreground/50 hover:text-muted-foreground/80 transition-colors"
            >
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
