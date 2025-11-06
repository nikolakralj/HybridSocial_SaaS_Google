import { Users, Briefcase, Layers } from "lucide-react";
import { Card } from "./ui/card";

export function WhySocialSaaS() {
  const features = [
    {
      icon: Users,
      title: "Networked Profiles",
      description: "Follow talent and teams. Share updates and wins.",
      gradient: "from-blue-500/10 to-cyan-500/10"
    },
    {
      icon: Briefcase,
      title: "Work OS",
      description: "Move from 'interview' to 'invoice' without context switching.",
      gradient: "from-purple-500/10 to-pink-500/10"
    },
    {
      icon: Layers,
      title: "Built for Teams",
      description: "One login, multiple workspaces and permissions.",
      gradient: "from-emerald-500/10 to-teal-500/10"
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-accent/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="m-0 mb-6 text-4xl md:text-5xl font-semibold tracking-tight">
            Why people choose WorkGraph
          </h2>
          <p className="text-xl text-muted-foreground m-0">
            The only platform that combines professional networking with complete work management
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-card border border-border/60 rounded-2xl p-8 hover:shadow-lg hover:border-border transition-all duration-200 group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6`}>
                  <Icon className="w-7 h-7 text-accent-brand" />
                </div>
                <h3 className="m-0 mb-3 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground m-0 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
