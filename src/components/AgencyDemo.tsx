import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { AgencyRoleBadge, type AgencyRole } from "./AgencyRoleBadge";
import { VisibilityScopeBadge, type VisibilityScope } from "./VisibilityScopeBadge";
import { Users, Building2, Briefcase } from "lucide-react";

const allRoles: AgencyRole[] = [
  "owner",
  "admin",
  "account-manager",
  "recruiter",
  "sourcer",
  "finance",
  "viewer"
];

const allScopes: VisibilityScope[] = ["participants", "team", "agency-wide"];

export function AgencyDemo() {
  const [selectedRole, setSelectedRole] = useState<AgencyRole>("account-manager");
  const [selectedScope, setSelectedScope] = useState<VisibilityScope>("participants");

  // Mock team members with different roles
  const teamMembers = [
    { id: "1", name: "James Wilson", role: "account-manager" as AgencyRole, deals: 8 },
    { id: "2", name: "Lisa Chen", role: "recruiter" as AgencyRole, deals: 12 },
    { id: "3", name: "Mike Rodriguez", role: "sourcer" as AgencyRole, deals: 0 },
    { id: "4", name: "Sarah Kim", role: "finance" as AgencyRole, deals: 0 },
    { id: "5", name: "Tom Anderson", role: "admin" as AgencyRole, deals: 0 },
  ];

  // Mock deals with different visibility scopes
  const deals = [
    {
      id: "1",
      title: "RetailCo · Senior Developer",
      status: "interview",
      scope: "participants" as VisibilityScope,
      teamName: null,
      participants: ["James Wilson", "Lisa Chen", "Sarah Chen (Candidate)"]
    },
    {
      id: "2",
      title: "TechCorp · Product Manager",
      status: "submitted",
      scope: "team" as VisibilityScope,
      teamName: "Enterprise Team",
      participants: ["James Wilson", "Mike Rodriguez"]
    },
    {
      id: "3",
      title: "StartupX · Designer",
      status: "offer",
      scope: "agency-wide" as VisibilityScope,
      teamName: null,
      participants: ["Lisa Chen", "Tom Anderson"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1280px] mx-auto px-6 py-6 space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="mb-2">Agency System Demo</h1>
          <p className="text-muted-foreground">
            Role-based access control and visibility scopes for agency workspaces
          </p>
        </div>

        <Tabs defaultValue="roles" className="w-full">
          <TabsList className="w-full justify-start mb-6">
            <TabsTrigger value="roles">Agency Roles</TabsTrigger>
            <TabsTrigger value="scopes">Visibility Scopes</TabsTrigger>
            <TabsTrigger value="team">Team Members</TabsTrigger>
            <TabsTrigger value="deals">Deal Rooms</TabsTrigger>
          </TabsList>

          {/* Roles Tab */}
          <TabsContent value="roles" className="space-y-6">
            <Card className="p-6">
              <h3 className="m-0 mb-4">Agency Roles Overview</h3>
              <p className="text-sm text-muted-foreground mb-6">
                WorkGraph uses role-based permissions to control what agency members can see and do.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {allRoles.map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedRole === role
                        ? "border-accent-brand bg-accent-brand/5"
                        : "border-border hover:border-accent-brand/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <AgencyRoleBadge role={role} />
                    </div>
                    <p className="text-sm text-muted-foreground m-0">
                      {role === "owner" && "Full access to everything"}
                      {role === "admin" && "Members, teams, settings"}
                      {role === "account-manager" && "Client relationships & deals"}
                      {role === "recruiter" && "Manages candidates, submits to clients"}
                      {role === "sourcer" && "Adds candidates, proposes to recruiters"}
                      {role === "finance" && "Rates & invoices, not candidate PII"}
                      {role === "viewer" && "Read-only on assigned work"}
                    </p>
                  </button>
                ))}
              </div>
            </Card>

            {/* Selected Role Details */}
            <Card className="p-6 border-accent-brand/20 bg-accent-brand/5">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-accent-brand" />
                <div className="flex-1">
                  <h3 className="m-0">Selected Role</h3>
                  <AgencyRoleBadge role={selectedRole} className="mt-2" />
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium m-0 mb-1">Permissions:</p>
                  <ul className="space-y-1 m-0 pl-4 text-sm text-muted-foreground">
                    {selectedRole === "owner" && (
                      <>
                        <li>Full access to all agency data and settings</li>
                        <li>Can create and manage teams</li>
                        <li>Can assign and change roles</li>
                        <li>Billing and subscription management</li>
                      </>
                    )}
                    {selectedRole === "admin" && (
                      <>
                        <li>Manage team members and permissions</li>
                        <li>Configure agency settings</li>
                        <li>View all teams and deals</li>
                        <li>Cannot access billing</li>
                      </>
                    )}
                    {selectedRole === "account-manager" && (
                      <>
                        <li>Manage client relationships</li>
                        <li>Create and manage deal rooms</li>
                        <li>Submit candidates to clients</li>
                        <li>View deals they're assigned to</li>
                      </>
                    )}
                    {selectedRole === "recruiter" && (
                      <>
                        <li>Manage candidate database</li>
                        <li>Submit candidates to deals</li>
                        <li>View deals where they're participants</li>
                        <li>Cannot create new clients</li>
                      </>
                    )}
                    {selectedRole === "sourcer" && (
                      <>
                        <li>Add new candidates to database</li>
                        <li>Propose candidates to recruiters</li>
                        <li>Cannot submit externally</li>
                        <li>View only assigned candidates</li>
                      </>
                    )}
                    {selectedRole === "finance" && (
                      <>
                        <li>View rates and invoices</li>
                        <li>Generate financial reports</li>
                        <li>No access to candidate PII by default</li>
                        <li>View billing information</li>
                      </>
                    )}
                    {selectedRole === "viewer" && (
                      <>
                        <li>Read-only access</li>
                        <li>View assigned work only</li>
                        <li>Cannot create or edit</li>
                        <li>Cannot submit candidates</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Scopes Tab */}
          <TabsContent value="scopes" className="space-y-6">
            <Card className="p-6">
              <h3 className="m-0 mb-4">Visibility Scopes</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Control who can see each deal room. Agency members only see deals they're part of or shared with their team.
              </p>

              <div className="space-y-4">
                {allScopes.map((scope) => (
                  <button
                    key={scope}
                    onClick={() => setSelectedScope(scope)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      selectedScope === scope
                        ? "border-accent-brand bg-accent-brand/5"
                        : "border-border hover:border-accent-brand/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <VisibilityScopeBadge scope={scope} teamName={scope === "team" ? "Enterprise Team" : undefined} />
                      {scope === "participants" && (
                        <Badge variant="outline" className="text-xs">Default</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground m-0">
                      {scope === "participants" && "Only people listed on the deal can see it"}
                      {scope === "team" && "Visible to a named team inside the agency"}
                      {scope === "agency-wide" && "All agency members can see this (rare)"}
                    </p>
                  </button>
                ))}
              </div>
            </Card>

            {/* Selected Scope Example */}
            <Card className="p-6 border-purple-500/20 bg-purple-500/5">
              <div className="flex items-center gap-3 mb-4">
                <Briefcase className="w-6 h-6 text-purple-500" />
                <div className="flex-1">
                  <h3 className="m-0">Example Deal Room</h3>
                  <VisibilityScopeBadge 
                    scope={selectedScope} 
                    teamName={selectedScope === "team" ? "Enterprise Team" : undefined}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium m-0 mb-2">Who can see this deal:</p>
                  {selectedScope === "participants" && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">James Wilson (Account Manager)</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">Lisa Chen (Recruiter)</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">Client Contact</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">Candidate</Badge>
                      </div>
                    </div>
                  )}
                  {selectedScope === "team" && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground m-0">Everyone on "Enterprise Team":</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">James Wilson</Badge>
                        <Badge variant="outline" className="text-xs">Mike Rodriguez</Badge>
                        <Badge variant="outline" className="text-xs">Sarah Kim</Badge>
                        <Badge variant="outline" className="text-xs">+5 more team members</Badge>
                      </div>
                    </div>
                  )}
                  {selectedScope === "agency-wide" && (
                    <p className="text-sm text-muted-foreground m-0">
                      All agency members (except Viewers without specific access)
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Team Members Tab */}
          <TabsContent value="team" className="space-y-6">
            <Card className="p-6">
              <h3 className="m-0 mb-4">Agency Team Members</h3>
              
              <div className="space-y-2">
                {teamMembers.map((member) => (
                  <div 
                    key={member.id}
                    className="p-4 rounded-lg bg-accent flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-medium">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium m-0">{member.name}</p>
                        <AgencyRoleBadge role={member.role} className="mt-1" />
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {member.deals > 0 && (
                        <Badge variant="outline">
                          {member.deals} active {member.deals === 1 ? "deal" : "deals"}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Deal Rooms Tab */}
          <TabsContent value="deals" className="space-y-6">
            <Card className="p-6">
              <h3 className="m-0 mb-4">Deal Rooms</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Each deal has its own visibility scope controlling who can see it.
              </p>
              
              <div className="space-y-3">
                {deals.map((deal) => (
                  <div key={deal.id} className="p-4 rounded-lg border border-border">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="m-0 mb-2">{deal.title}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="capitalize text-xs">
                            {deal.status}
                          </Badge>
                          <VisibilityScopeBadge 
                            scope={deal.scope} 
                            teamName={deal.teamName || undefined}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground m-0 mb-2">Participants:</p>
                      <div className="flex flex-wrap gap-1">
                        {deal.participants.map((participant, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {participant}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
