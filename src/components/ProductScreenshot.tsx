import { Users, Briefcase, FileText, MessageSquare, Clock, DollarSign } from "lucide-react";

export function ProductScreenshot() {
  return (
    <section className="py-20 md:py-32 px-6 bg-gradient-to-b from-background to-accent/20">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Your network meets your work.
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to find work, ship it, and get paid — in one place.
          </p>
        </div>

        {/* Main product visual - Browser window mockup */}
        <div className="relative">
          {/* Browser chrome */}
          <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
            {/* Top bar */}
            <div className="bg-muted/50 border-b border-border px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-warning/60" />
                <div className="w-3 h-3 rounded-full bg-success/60" />
              </div>
              <div className="flex-1 bg-background/80 rounded-md px-3 py-1 mx-4">
                <p className="text-xs text-muted-foreground m-0">app.workgraph.com</p>
              </div>
            </div>

            {/* Product screenshot mockup - split view showing social + work */}
            <div className="bg-background">
              <div className="grid md:grid-cols-2">
                {/* Left: Social feed */}
                <div className="border-r border-border p-6 space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <Users className="w-5 h-5 text-accent-brand" />
                    <h3 className="m-0 text-lg font-semibold">Your Feed</h3>
                  </div>

                  {/* Mock post 1 */}
                  <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent-brand/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-accent-brand">SC</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium m-0">Sarah Chen</p>
                        <p className="text-xs text-muted-foreground m-0">Senior React Developer</p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">2h</span>
                    </div>
                    <p className="text-sm m-0">Just shipped a new feature using React Server Components. The performance improvements are incredible 🚀</p>
                    <div className="flex items-center gap-4 pt-2">
                      <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent-brand transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        <span>12</span>
                      </button>
                      <button className="text-xs text-muted-foreground hover:text-accent-brand transition-colors">
                        Share
                      </button>
                    </div>
                  </div>

                  {/* Mock job post */}
                  <div className="bg-card border-2 border-accent-brand/20 rounded-xl p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-brand to-accent-brand/60 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium m-0">TechCorp</p>
                        <p className="text-xs text-muted-foreground m-0">Posted a contract role</p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">1d</span>
                    </div>
                    <div>
                      <p className="font-semibold m-0 mb-1">Senior Frontend Engineer (3 months)</p>
                      <p className="text-sm text-muted-foreground m-0">Remote · $150-200/hr · React, TypeScript</p>
                    </div>
                    <button className="w-full py-2 px-4 bg-accent-brand text-white rounded-lg text-sm font-medium hover:bg-accent-brand-hover transition-colors">
                      Apply now
                    </button>
                  </div>

                  {/* Mock update */}
                  <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-success">MJ</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium m-0">Mike Johnson</p>
                        <p className="text-xs text-muted-foreground m-0">Updated availability</p>
                        <p className="text-sm mt-2 m-0">Now available for part-time projects (20h/week)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Work tools */}
                <div className="p-6 space-y-4 bg-accent/5">
                  <div className="flex items-center gap-3 mb-6">
                    <Briefcase className="w-5 h-5 text-accent-brand" />
                    <h3 className="m-0 text-lg font-semibold">Your Work</h3>
                  </div>

                  {/* Active project */}
                  <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold m-0">TechCorp - Q4 Platform</p>
                      <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full font-medium">Active</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground m-0 mb-1">This week</p>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-accent-brand" />
                          <p className="font-semibold m-0">32.5h</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground m-0 mb-1">Rate</p>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-success" />
                          <p className="font-semibold m-0">$175/hr</p>
                        </div>
                      </div>
                    </div>
                    <button className="w-full py-2 px-4 border border-border rounded-lg text-sm font-medium hover:bg-accent transition-colors">
                      Log time
                    </button>
                  </div>

                  {/* Pending invoice */}
                  <div className="bg-gradient-to-br from-accent-brand/5 to-accent-brand/10 border border-accent-brand/20 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-accent-brand" />
                      <p className="font-semibold m-0">Invoice ready</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <p className="text-sm text-muted-foreground m-0">Oct 1-15, 2025</p>
                        <p className="text-sm font-semibold m-0">$5,600.00</p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-sm text-muted-foreground m-0">32 hours logged</p>
                        <p className="text-xs text-success m-0">Approved ✓</p>
                      </div>
                    </div>
                    <button className="w-full py-2 px-4 bg-accent-brand text-white rounded-lg text-sm font-medium hover:bg-accent-brand-hover transition-colors">
                      Send invoice
                    </button>
                  </div>

                  {/* Quick stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-card border border-border rounded-lg p-3">
                      <p className="text-xs text-muted-foreground m-0 mb-1">This month</p>
                      <p className="text-xl font-semibold m-0">$12,400</p>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-3">
                      <p className="text-xs text-muted-foreground m-0 mb-1">Open offers</p>
                      <p className="text-xl font-semibold m-0">3</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating UI elements for emphasis */}
          <div className="absolute -right-4 -top-4 hidden lg:block">
            <div className="bg-success text-success-foreground px-4 py-2 rounded-full shadow-lg font-medium text-sm">
              ✓ Invoice sent
            </div>
          </div>
          <div className="absolute -left-4 top-1/3 hidden lg:block">
            <div className="bg-accent-brand text-white px-4 py-2 rounded-full shadow-lg font-medium text-sm">
              3 new opportunities
            </div>
          </div>
        </div>

        {/* Feature highlights below screenshot */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-accent-brand/10 flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-accent-brand" />
            </div>
            <h4 className="mb-2 font-semibold">Social network</h4>
            <p className="text-sm text-muted-foreground m-0">
              Follow people, companies, share updates, discover opportunities
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-accent-brand/10 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-accent-brand" />
            </div>
            <h4 className="mb-2 font-semibold">Work tools</h4>
            <p className="text-sm text-muted-foreground m-0">
              Time tracking, contracts, approvals — built in
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-accent-brand/10 flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-6 h-6 text-accent-brand" />
            </div>
            <h4 className="mb-2 font-semibold">Get paid</h4>
            <p className="text-sm text-muted-foreground m-0">
              Auto-generate invoices from approved time
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
