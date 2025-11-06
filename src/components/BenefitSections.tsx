import { Users, Briefcase, Clock, DollarSign, Shield, Zap } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function BenefitSections() {
  const benefits = [
    {
      icon: Users,
      title: "Network like LinkedIn, but for work",
      description: "Follow people and companies, share updates, discover opportunities — all in your professional feed.",
      features: [
        "Public or private profiles",
        "Post updates and portfolio work",
        "Job listings in your feed",
        "Direct applications"
      ],
      image: "https://images.unsplash.com/photo-1690264421892-46e3af5c3455?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMG9mZmljZXxlbnwxfHx8fDE3NjAxODg1MDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      imageAlt: "Team collaboration in modern workspace"
    },
    {
      icon: Briefcase,
      title: "Manage contractors without the chaos",
      description: "Companies get private Worker Records, approval workflows, and compliance tools built in.",
      features: [
        "Post unlimited contract roles",
        "Approval chains for timesheets",
        "Worker Records (always private)",
        "EoR and vendor compatible"
      ],
      image: "https://images.unsplash.com/photo-1532211779254-6ef4e2b8454c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXZlbG9wZXIlMjB3b3Jrc3BhY2UlMjBtYWNib29rfGVufDF8fHx8MTc2MDE5NTQzN3ww&ixlib=rb-4.1.0&q=80&w=1080",
      imageAlt: "Professional developer workspace with MacBook"
    },
    {
      icon: Clock,
      title: "Track time, approve work, done",
      description: "Log hours against projects. Clients approve with one click. No spreadsheets, no email chains.",
      features: [
        "Built-in time tracking",
        "One-click approvals",
        "Audit trails included",
        "Project-level breakdowns"
      ],
      image: "https://images.unsplash.com/photo-1658274474930-bb27a64022c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RpbmclMjBsYXB0b3AlMjBzY3JlZW58ZW58MXx8fHwxNzYwMDcwNjI3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      imageAlt: "Developer coding on laptop screen"
    },
    {
      icon: DollarSign,
      title: "Get paid faster",
      description: "Invoices auto-generate from approved timesheets. Send them with one click. Track payment status.",
      features: [
        "Auto-generated invoices",
        "Professional PDF output",
        "Payment tracking",
        "Multi-party invoicing for agencies"
      ],
      image: "https://images.unsplash.com/photo-1674291707242-84b519075308?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVlbGFuY2VyJTIwd29ya2luZyUyMHJlbW90ZXxlbnwxfHx8fDE3NjAxOTU0Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      imageAlt: "Freelancer working remotely"
    }
  ];

  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto space-y-24 md:space-y-32">
        {benefits.map((benefit, idx) => {
          const Icon = benefit.icon;
          const isEven = idx % 2 === 0;

          return (
            <div
              key={idx}
              className={`grid md:grid-cols-2 gap-12 md:gap-16 items-center ${
                isEven ? "" : "md:flex-row-reverse"
              }`}
            >
              {/* Icon + Content */}
              <div className={isEven ? "md:order-1" : "md:order-2"}>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-brand/15 to-accent-brand/5 flex items-center justify-center mb-6 apple-shadow-sm">
                  <Icon className="w-8 h-8 text-accent-brand" strokeWidth={2} />
                </div>
                <h3 className="text-2xl md:text-3xl font-semibold mb-4 tracking-tight">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground mb-8 leading-relaxed text-base">
                  {benefit.description}
                </p>
                <div className="space-y-3">
                  {benefit.features.map((feature, fidx) => (
                    <div key={fidx} className="flex items-center gap-3 group">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-brand flex-shrink-0 group-hover:scale-150 apple-transition" />
                      <p className="text-sm text-muted-foreground m-0 group-hover:text-foreground apple-transition">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual mockup */}
              <div className={isEven ? "md:order-2" : "md:order-1"}>
                <div className="bg-card border border-border/50 rounded-3xl overflow-hidden apple-shadow-lg hover:apple-shadow-xl apple-transition group">
                  {/* Real image with subtle overlay */}
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <ImageWithFallback
                      src={benefit.image}
                      alt={benefit.imageAlt}
                      className="w-full h-full object-cover group-hover:scale-105 apple-transition duration-700"
                    />
                    {/* Subtle gradient overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-card/40 via-transparent to-transparent pointer-events-none" />
                    {/* Subtle icon badge in corner */}
                    <div className="absolute bottom-4 right-4 w-12 h-12 rounded-xl bg-card/90 backdrop-blur-sm border border-border/50 flex items-center justify-center apple-shadow-md">
                      <Icon className="w-6 h-6 text-accent-brand" strokeWidth={2} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
