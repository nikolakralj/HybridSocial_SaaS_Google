import { useWorkGraph } from "../contexts/WorkGraphContext";
import { MessageComposer } from "./MessageComposer";
import { ViewAsToggle } from "./ViewAsToggle";
import { ClaimRecordBanner } from "./ClaimRecordBanner";
import { ProfileRelationshipDiagram } from "./ProfileRelationshipDiagram";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Building2, User, Users, Mail, MapPin, Globe } from "lucide-react";

export function ContextDemo() {
  const { currentContext } = useWorkGraph();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1280px] mx-auto px-6 py-6 space-y-6">
        {/* Context Info Card */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="m-0 mb-2">Current Context</h2>
              <p className="text-muted-foreground">
                You're viewing WorkGraph as{" "}
                <strong>{currentContext.name}</strong>
              </p>
            </div>
            <Badge variant="outline" className="gap-2">
              {currentContext.type === "personal" && <User className="w-4 h-4" />}
              {currentContext.type === "company" && <Building2 className="w-4 h-4" />}
              {currentContext.type === "agency" && <Users className="w-4 h-4" />}
              {currentContext.type === "personal"
                ? "Personal"
                : currentContext.type === "company"
                ? "Company"
                : "Agency"}
            </Badge>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-accent">
              <p className="text-sm text-muted-foreground mb-1">Navigation</p>
              <p className="font-medium">
                {currentContext.type === "personal" && "Dashboard, Deliver, Contracts, Finance, Messages, Profile"}
                {currentContext.type === "company" && "Dashboard, Recruit, Deliver, Contracts, Finance, Directory, Messages"}
                {currentContext.type === "agency" && "Dashboard, Recruit, Candidates, Clients, Contracts, Finance, Messages"}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-accent">
              <p className="text-sm text-muted-foreground mb-1">Primary Focus</p>
              <p className="font-medium">
                {currentContext.type === "personal" && "Finding work, delivering projects"}
                {currentContext.type === "company" && "Hiring talent, managing projects"}
                {currentContext.type === "agency" && "Placing candidates, managing clients"}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-accent">
              <p className="text-sm text-muted-foreground mb-1">Data Visibility</p>
              <p className="font-medium">
                {currentContext.type === "personal" && "Your profile, your contracts"}
                {currentContext.type === "company" && "Worker Records, company contracts"}
                {currentContext.type === "agency" && "Candidates, client jobs, placements"}
              </p>
            </div>
          </div>
        </Card>

        {/* Claim Record Banner (only shown in personal context) */}
        {currentContext.type === "personal" && (
          <ClaimRecordBanner
            companyName="TechVentures Inc."
            recordData={{
              title: "Senior Full-Stack Developer",
              startDate: "October 15, 2024",
              email: "john.doe@techventures.com",
            }}
            onClaim={() => alert("Claiming record...")}
            onDismiss={() => alert("Dismissed")}
          />
        )}

        {/* Profile Preview with View As Toggle */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="m-0 mb-1">
                {currentContext.type === "personal"
                  ? "Personal Profile"
                  : currentContext.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                Preview how others see your profile
              </p>
            </div>
            <ViewAsToggle
              profileType={currentContext.type === "personal" ? "personal" : "company"}
            />
          </div>

          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-accent-brand to-purple-600 flex items-center justify-center text-white">
              {currentContext.type === "personal" ? (
                <User className="w-12 h-12" />
              ) : currentContext.type === "company" ? (
                <Building2 className="w-12 h-12" />
              ) : (
                <Users className="w-12 h-12" />
              )}
            </div>

            <div className="flex-1">
              <h2 className="m-0 mb-2">
                {currentContext.type === "personal"
                  ? "John Doe"
                  : currentContext.name}
              </h2>
              <p className="text-muted-foreground mb-4">
                {currentContext.type === "personal"
                  ? "Senior Full-Stack Developer • React, Node.js, TypeScript"
                  : currentContext.type === "company"
                  ? "Technology Consulting & Development • 50-200 employees"
                  : "Executive Search & Tech Recruitment • 10+ years experience"}
              </p>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {currentContext.type === "personal"
                      ? "john@example.com"
                      : "contact@techventures.com"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {currentContext.type === "personal"
                      ? "Available for contract work"
                      : "Hiring for 5 open positions"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Message Composer with Acting As Chip */}
        <Card className="p-6">
          <h3 className="m-0 mb-4">Send Message</h3>
          <p className="text-sm text-muted-foreground mb-4">
            The "Acting As" chip lets you choose which identity sends this message.
          </p>
          <MessageComposer placeholder="Type your message here..." />
        </Card>

        {/* Profile Relationship Diagram */}
        <ProfileRelationshipDiagram />

        {/* Personal Profile vs Worker Record Explanation */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-accent-brand/10">
                <User className="w-5 h-5 text-accent-brand" />
              </div>
              <div>
                <h3 className="m-0">Personal Profile</h3>
                <Badge variant="outline" className="text-xs mt-1">
                  You Own This
                </Badge>
              </div>
            </div>

            <ul className="space-y-2 text-sm">
              <li>• Your public identity (optional)</li>
              <li>• Portfolio, rates, availability</li>
              <li>• Skills, experience, certifications</li>
              <li>• You control visibility (Public/Private)</li>
              <li>• Searchable when you enable it</li>
            </ul>

            <div className="mt-4 p-3 rounded-lg bg-accent">
              <p className="text-xs text-muted-foreground">
                Your Personal Profile is yours. Companies can view it if you make it
                public or share it with them.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-warning/10">
                <Building2 className="w-5 h-5 text-warning" />
              </div>
              <div>
                <h3 className="m-0">Worker Record</h3>
                <Badge variant="outline" className="text-xs mt-1">
                  Company Owns This
                </Badge>
              </div>
            </div>

            <ul className="space-y-2 text-sm">
              <li>• Internal employment data</li>
              <li>• Role, title, department</li>
              <li>• Contract rates, assignments</li>
              <li>• Timesheets, approvals</li>
              <li>• Always private to the company</li>
            </ul>

            <div className="mt-4 p-3 rounded-lg bg-accent">
              <p className="text-xs text-muted-foreground">
                Worker Records are private to the company. Only parties to each
                contract can see the data.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
