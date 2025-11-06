import { useState } from "react";
import { 
  Building2, MapPin, Globe, Mail, Users, 
  Edit, Eye, Settings, Link2, UserPlus, 
  Clock, CheckCircle2, AlertCircle
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useWorkGraph } from "../contexts/WorkGraphContext";

interface OrganizationProfileEnhancedProps {
  isOwner?: boolean;
  viewMode?: "internal" | "public";
  orgType?: "company" | "agency";
}

export function OrganizationProfileEnhanced({ 
  isOwner = true,
  viewMode = "internal",
  orgType = "company"
}: OrganizationProfileEnhancedProps) {
  const [isPublic, setIsPublic] = useState(false);
  const { currentContext } = useWorkGraph();

  // Mock data
  const organization = {
    name: "TechVentures Inc.",
    tagline: "Building the future of team collaboration",
    industry: "SaaS",
    size: "50-200 employees",
    location: "San Francisco, CA",
    website: "https://techventures.com",
    email: "contact@techventures.com",
    founded: "2019",
    domains: ["techventures.com", "techventures.io"],
    timesheetSettings: {
      cadence: "weekly" as const,
      approvers: ["Manager", "Finance"],
      overtimeThreshold: 40,
    },
    teamMembers: [
      {
        id: "1",
        name: "Sarah Chen",
        role: "Senior Developer",
        status: "claimed" as const,
        linkedProfile: true,
        email: "sarah@techventures.com",
      },
      {
        id: "2",
        name: "Alex Thompson",
        role: "DevOps Engineer",
        status: "unclaimed" as const,
        linkedProfile: false,
        email: "alex@external.com",
      },
      {
        id: "3",
        name: "Maria Garcia",
        role: "Product Manager",
        status: "claimed" as const,
        linkedProfile: true,
        email: "maria@techventures.com",
      },
    ],
    openRoles: 3,
    activeContracts: 12,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1280px] mx-auto px-6 py-6 space-y-6">
        {/* Public/Private Toggle Card (only for owner) */}
        {isOwner && viewMode === "internal" && (
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="org-public-toggle" className="cursor-pointer">
                  Make organization page public
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5 m-0">
                  {isPublic 
                    ? "Your company page is visible in public directory" 
                    : "Keep profile private until you're ready"}
                </p>
              </div>
              <Switch
                id="org-public-toggle"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>
          </Card>
        )}

        {/* Header Card */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6 flex-1">
              <Avatar className="w-24 h-24 rounded-xl">
                <AvatarFallback className="bg-gradient-to-br from-accent-brand to-blue-600 text-white text-2xl rounded-xl">
                  TV
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="m-0">{organization.name}</h1>
                  <Badge variant="outline" className="capitalize">
                    {orgType}
                  </Badge>
                  {isPublic && (
                    <Badge className="bg-success text-success-foreground gap-1.5">
                      <Globe className="w-3 h-3" />
                      Public
                    </Badge>
                  )}
                </div>

                <p className="text-muted-foreground mb-4">{organization.tagline}</p>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span>{organization.industry}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{organization.size}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{organization.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <a href={organization.website} className="text-accent-brand hover:underline">
                      {organization.website}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <Badge variant="outline">{organization.openRoles} open roles</Badge>
                  <Badge variant="outline">{organization.activeContracts} active contracts</Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isOwner && (
                <>
                  <Button variant="outline" className="gap-2 min-h-[44px]">
                    <Eye className="w-4 h-4" />
                    Preview
                  </Button>
                  <Button className="gap-2 min-h-[44px]">
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="p-6">
              <h3 className="m-0 mb-4">Organization Details</h3>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Legal Name</Label>
                  <p className="font-medium mt-1">{organization.name}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="mt-1">{organization.tagline}</p>
                </div>

                <Separator />

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Industry</Label>
                    <p className="font-medium mt-1">{organization.industry}</p>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">Founded</Label>
                    <p className="font-medium mt-1">{organization.founded}</p>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">Company Size</Label>
                    <p className="font-medium mt-1">{organization.size}</p>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">Headquarters</Label>
                    <p className="font-medium mt-1">{organization.location}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Email Domains */}
            {isOwner && viewMode === "internal" && (
              <Card className="p-6">
                <h3 className="m-0 mb-2">Email Domains</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Auto-link team members with these email domains (e.g., @company.com)
                </p>

                <div className="space-y-2">
                  {organization.domains.map((domain, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input value={domain} readOnly className="flex-1" />
                      <Button variant="ghost" size="sm" className="h-9">
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="gap-2 min-h-[44px]">
                    <UserPlus className="w-4 h-4" />
                    Add Domain
                  </Button>
                </div>
              </Card>
            )}

            {/* Timesheet & Approvals Defaults */}
            {isOwner && viewMode === "internal" && orgType === "company" && (
              <Card className="p-6">
                <h3 className="m-0 mb-2">Timesheet & Approvals</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Default settings for worker timesheets and approval workflows
                </p>

                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Timesheet Cadence</Label>
                      <Select defaultValue={organization.timesheetSettings.cadence}>
                        <SelectTrigger className="mt-2 min-h-[44px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="biweekly">Bi-weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Overtime Threshold (hours/week)</Label>
                      <Input 
                        type="number" 
                        defaultValue={organization.timesheetSettings.overtimeThreshold}
                        className="mt-2 min-h-[44px]"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Approval Chain</Label>
                    <p className="text-xs text-muted-foreground mt-1 mb-2">
                      Define who approves timesheets in order
                    </p>
                    <div className="flex items-center gap-2">
                      {organization.timesheetSettings.approvers.map((approver, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Badge variant="outline">{approver}</Badge>
                          {index < organization.timesheetSettings.approvers.length - 1 && (
                            <span className="text-muted-foreground">→</span>
                          )}
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" className="mt-3 min-h-[44px]">
                      Edit Approval Chain
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Team Members */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="m-0">Team Members</h3>
                {isOwner && (
                  <Button variant="outline" size="sm" className="gap-2 min-h-[44px]">
                    <UserPlus className="w-4 h-4" />
                    Add Member
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                {organization.teamMembers.map((member) => (
                  <button
                    key={member.id}
                    className="w-full p-4 rounded-lg hover:bg-accent transition-colors border border-border bg-card text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Avatar className="w-10 h-10 rounded-lg">
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-lg">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium m-0 truncate">{member.name}</p>
                            {member.linkedProfile && (
                              <Link2 className="w-3.5 h-3.5 text-accent-brand flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground m-0">{member.role}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge 
                          variant="outline"
                          className={`text-xs ${
                            member.status === "claimed"
                              ? "border-success text-success"
                              : "border-warning text-warning"
                          }`}
                        >
                          {member.status === "claimed" ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Claimed
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Unclaimed
                            </>
                          )}
                        </Badge>
                        {isOwner && viewMode === "internal" && (
                          <Button variant="ghost" size="sm" className="h-8">
                            View Record
                          </Button>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="p-6">
              <h3 className="m-0 mb-4">Quick Stats</h3>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Active Contracts</Label>
                  <p className="text-2xl font-semibold mt-1">{organization.activeContracts}</p>
                </div>

                <Separator />

                <div>
                  <Label className="text-muted-foreground">Team Members</Label>
                  <p className="text-2xl font-semibold mt-1">{organization.teamMembers.length}</p>
                </div>

                <Separator />

                <div>
                  <Label className="text-muted-foreground">Open Positions</Label>
                  <p className="text-2xl font-semibold mt-1">{organization.openRoles}</p>
                </div>
              </div>
            </Card>

            {/* Contact Information */}
            <Card className="p-6">
              <h3 className="m-0 mb-4">Contact</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground mt-1" />
                  <div>
                    <Label className="text-muted-foreground text-xs">Email</Label>
                    <p className="text-sm m-0">{organization.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Globe className="w-4 h-4 text-muted-foreground mt-1" />
                  <div>
                    <Label className="text-muted-foreground text-xs">Website</Label>
                    <a 
                      href={organization.website} 
                      className="text-sm text-accent-brand hover:underline block"
                    >
                      {organization.website}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                  <div>
                    <Label className="text-muted-foreground text-xs">Location</Label>
                    <p className="text-sm m-0">{organization.location}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Settings (owner only) */}
            {isOwner && viewMode === "internal" && (
              <Card className="p-6">
                <h3 className="m-0 mb-4">Settings</h3>
                
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start gap-2 min-h-[44px]">
                    <Settings className="w-4 h-4" />
                    Organization Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2 min-h-[44px]">
                    <Users className="w-4 h-4" />
                    Team & Permissions
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2 min-h-[44px]">
                    <Building2 className="w-4 h-4" />
                    Billing & Plans
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
