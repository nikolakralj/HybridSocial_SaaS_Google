import { useState } from "react";
import { Eye, Lock, Building2 } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { CompanyPublicProfile } from "./CompanyPublicProfile";
import { CompanyPrivateWorkspace } from "./CompanyPrivateWorkspace";
import { toast } from "sonner@2.0.3";

export function CompanyProfileDemo() {
  const [view, setView] = useState<"public" | "private">("public");

  const handleFollow = () => {
    toast.success("Following Acme Engineering!");
  };

  const handleMessage = () => {
    toast.info("Opening message composer...");
  };

  const handleApplyToRole = (roleId: string) => {
    toast.success("Application submitted!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <div className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-brand/10 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-accent-brand" />
              </div>
              <div>
                <h2 className="m-0">Company Profile Demo</h2>
                <p className="text-sm text-muted-foreground m-0">
                  Explore public vs. private views
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex bg-muted rounded-lg p-1">
                <Button
                  variant={view === "public" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("public")}
                  className="gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Public Profile
                </Button>
                <Button
                  variant={view === "private" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("private")}
                  className="gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Private Workspace
                </Button>
              </div>

              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/30 border border-border">
                {view === "public" ? (
                  <>
                    <Eye className="w-4 h-4 text-success" />
                    <span className="text-sm font-medium">Visible to all</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-warning" />
                    <span className="text-sm font-medium">Company members only</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="border-b border-border bg-gradient-to-r from-accent-brand/5 to-purple-500/5">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {view === "public" ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-success/10 text-success border-success/20">
                  Public View
                </Badge>
                <h3 className="m-0">What freelancers and partners see</h3>
              </div>
              <p className="text-sm text-muted-foreground m-0 max-w-3xl">
                This is your company's storefront on WorkGraph. It builds trust through portfolio work, client testimonials, 
                reputation metrics, and open job postings. Helps freelancers decide if they want to work with you.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="secondary">Brand showcase</Badge>
                <Badge variant="secondary">Portfolio & case studies</Badge>
                <Badge variant="secondary">Reviews & ratings</Badge>
                <Badge variant="secondary">Open positions</Badge>
                <Badge variant="secondary">Company details</Badge>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-warning/10 text-warning border-warning/20">
                  Private Workspace
                </Badge>
                <h3 className="m-0">What only your team sees</h3>
              </div>
              <p className="text-sm text-muted-foreground m-0 max-w-3xl">
                Your operational command center. Manage projects, review timesheets, process payments, collaborate with 
                contractors and agencies, handle contracts/NDAs, and track analytics—all in one secure workspace.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="secondary">Project management</Badge>
                <Badge variant="secondary">Contractor oversight</Badge>
                <Badge variant="secondary">Timesheet approval</Badge>
                <Badge variant="secondary">Payment processing</Badge>
                <Badge variant="secondary">Team collaboration</Badge>
                <Badge variant="secondary">Analytics & reporting</Badge>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-12">
        {view === "public" ? (
          <CompanyPublicProfile
            onFollow={handleFollow}
            onMessage={handleMessage}
            onApplyToRole={handleApplyToRole}
          />
        ) : (
          <CompanyPrivateWorkspace />
        )}
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-card border border-border rounded-xl p-4 apple-shadow-xl max-w-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-brand/10 flex items-center justify-center flex-shrink-0">
              {view === "public" ? (
                <Eye className="w-5 h-5 text-accent-brand" />
              ) : (
                <Lock className="w-5 h-5 text-accent-brand" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium mb-1">
                {view === "public" ? "Switch to Private Workspace" : "Switch to Public Profile"}
              </p>
              <p className="text-sm text-muted-foreground mb-3">
                {view === "public" 
                  ? "See how you manage contractors, projects, and payments"
                  : "See how your company appears to freelancers and partners"
                }
              </p>
              <Button 
                size="sm" 
                onClick={() => setView(view === "public" ? "private" : "public")}
                className="w-full gap-2"
              >
                {view === "public" ? (
                  <>
                    <Lock className="w-4 h-4" />
                    View Private Workspace
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    View Public Profile
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
