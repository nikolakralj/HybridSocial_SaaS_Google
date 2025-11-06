import { useState } from "react";
import { 
  Search, Filter, Download, UserPlus, Mail, 
  User, Building2, MapPin, Briefcase, CheckCircle, 
  AlertCircle, Clock, Eye, Globe, Users
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Checkbox } from "./ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useWorkGraph } from "../contexts/WorkGraphContext";

type DirectoryView = "internal" | "public";
type WorkerStatus = "claimed" | "unclaimed" | "active" | "offboarded";

export function DirectoryEnhanced() {
  const { currentContext } = useWorkGraph();
  const [view, setView] = useState<DirectoryView>(
    currentContext.type === "personal" ? "public" : "internal"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Mock data for internal directory (Worker Records)
  const workerRecords = [
    {
      id: "wr-1",
      name: "Sarah Chen",
      role: "Senior Full-Stack Developer",
      status: "claimed" as WorkerStatus,
      manager: "Alex Martinez",
      department: "Engineering",
      projects: ["Dashboard Redesign", "API Migration"],
      lastSubmission: "2 hours ago",
      email: "sarah.chen@company.com"
    },
    {
      id: "wr-2",
      name: "Michael Torres",
      role: "UX Designer",
      status: "active" as WorkerStatus,
      manager: "Lisa Park",
      department: "Design",
      projects: ["Mobile App"],
      lastSubmission: "1 day ago",
      email: "michael.torres@company.com"
    },
    {
      id: "wr-3",
      name: "Emily Rodriguez",
      role: "Backend Engineer",
      status: "unclaimed" as WorkerStatus,
      manager: "Alex Martinez",
      department: "Engineering",
      projects: [],
      lastSubmission: "N/A",
      email: "emily.rodriguez@company.com"
    }
  ];

  // Mock data for public directory (Personal Profiles)
  const publicProfiles = [
    {
      id: "pp-1",
      name: "David Kim",
      title: "Senior Product Designer",
      location: "New York, NY",
      availability: "available" as const,
      skills: ["Figma", "UI/UX", "Product Strategy"],
      rate: 120,
      isPublic: true
    },
    {
      id: "pp-2",
      name: "Jennifer Walsh",
      title: "Full-Stack Developer",
      location: "Austin, TX",
      availability: "limited" as const,
      skills: ["React", "Node.js", "PostgreSQL"],
      rate: 150,
      isPublic: true
    }
  ];

  // Mock organizations for public directory
  const publicOrgs = [
    {
      id: "org-1",
      name: "TechVentures Inc.",
      type: "company" as const,
      industry: "SaaS",
      size: "50-200",
      location: "San Francisco, CA",
      openRoles: 5
    },
    {
      id: "org-2",
      name: "Elite Tech Recruiters",
      type: "agency" as const,
      industry: "Recruitment",
      size: "10-50",
      location: "Remote",
      openRoles: 12
    }
  ];

  const getStatusBadge = (status: WorkerStatus) => {
    switch (status) {
      case "claimed":
      case "active":
        return (
          <Badge variant="outline" className="border-success text-success">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        );
      case "unclaimed":
        return (
          <Badge variant="outline" className="border-warning text-warning">
            <AlertCircle className="w-3 h-3 mr-1" />
            Unclaimed
          </Badge>
        );
      case "offboarded":
        return (
          <Badge variant="outline" className="border-muted-foreground">
            <Clock className="w-3 h-3 mr-1" />
            Offboarded
          </Badge>
        );
    }
  };

  const renderInternalDirectory = () => (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-3">
        <Select defaultValue="all">
          <SelectTrigger className="w-48 min-h-[44px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="unclaimed">Unclaimed</SelectItem>
            <SelectItem value="offboarded">Offboarded</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all-teams">
          <SelectTrigger className="w-48 min-h-[44px]">
            <SelectValue placeholder="Team" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-teams">All Teams</SelectItem>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="design">Design</SelectItem>
            <SelectItem value="product">Product</SelectItem>
          </SelectContent>
        </Select>

        {selectedItems.length > 0 && (
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-muted-foreground">
              {selectedItems.length} selected
            </span>
            <Button variant="outline" size="sm" className="min-h-[44px]">
              Assign to Project
            </Button>
            <Button variant="outline" size="sm" className="min-h-[44px]">
              <Mail className="w-4 h-4 mr-2" />
              Send Invite
            </Button>
            <Button variant="outline" size="sm" className="min-h-[44px]">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        )}
      </div>

      {/* Worker Records Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-accent sticky top-0">
              <tr>
                <th className="text-left p-4 font-medium w-12">
                  <Checkbox />
                </th>
                <th className="text-left p-4 font-medium">Name</th>
                <th className="text-left p-4 font-medium">Role</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Manager</th>
                <th className="text-left p-4 font-medium">Projects</th>
                <th className="text-left p-4 font-medium">Last Activity</th>
                <th className="text-left p-4 font-medium w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {workerRecords.map((record) => (
                <tr 
                  key={record.id} 
                  className="border-t border-border hover:bg-accent/50 transition-colors"
                >
                  <td className="p-4">
                    <Checkbox 
                      checked={selectedItems.includes(record.id)}
                      onCheckedChange={(checked) => {
                        setSelectedItems(prev =>
                          checked 
                            ? [...prev, record.id]
                            : prev.filter(id => id !== record.id)
                        );
                      }}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 rounded-lg">
                        <AvatarFallback className="bg-gradient-to-br from-accent-brand to-purple-600 text-white rounded-lg">
                          {record.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium m-0">{record.name}</p>
                        <p className="text-xs text-muted-foreground m-0">
                          {record.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm m-0">{record.role}</p>
                    <p className="text-xs text-muted-foreground m-0">
                      {record.department}
                    </p>
                  </td>
                  <td className="p-4">{getStatusBadge(record.status)}</td>
                  <td className="p-4 text-sm">{record.manager}</td>
                  <td className="p-4">
                    {record.projects.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {record.projects.slice(0, 2).map((project) => (
                          <Badge key={project} variant="outline" className="text-xs">
                            {project}
                          </Badge>
                        ))}
                        {record.projects.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{record.projects.length - 2}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {record.lastSubmission}
                  </td>
                  <td className="p-4">
                    <Button variant="ghost" size="sm" className="h-9">
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderPublicDirectory = () => (
    <Tabs defaultValue="people" className="space-y-6">
      <TabsList>
        <TabsTrigger value="people" className="gap-2">
          <User className="w-4 h-4" />
          People
        </TabsTrigger>
        <TabsTrigger value="organizations" className="gap-2">
          <Building2 className="w-4 h-4" />
          Organizations
        </TabsTrigger>
      </TabsList>

      <TabsContent value="people" className="space-y-4">
        {/* Filters */}
        <div className="flex items-center gap-3">
          <Select defaultValue="all-avail">
            <SelectTrigger className="w-48 min-h-[44px]">
              <SelectValue placeholder="Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-avail">All</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="limited">Limited</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all-loc">
            <SelectTrigger className="w-48 min-h-[44px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-loc">All Locations</SelectItem>
              <SelectItem value="remote">Remote</SelectItem>
              <SelectItem value="us">United States</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* People Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          {publicProfiles.map((profile) => (
            <Card key={profile.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="w-16 h-16 rounded-xl">
                  <AvatarFallback className="bg-gradient-to-br from-accent-brand to-purple-600 text-white rounded-xl">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="m-0">{profile.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      <Globe className="w-3 h-3 mr-1" />
                      Public
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground m-0 mb-2">
                    {profile.title}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {profile.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      ${profile.rate}/hr
                    </div>
                  </div>
                </div>

                {profile.availability === "available" && (
                  <Badge className="bg-success text-success-foreground">
                    <div className="w-2 h-2 rounded-full bg-white mr-1" />
                    Available
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {profile.skills.slice(0, 5).map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 bg-accent-brand hover:bg-accent-brand-hover min-h-[44px]">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact
                </Button>
                <Button variant="outline" className="min-h-[44px]">
                  View Profile
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="organizations" className="space-y-4">
        {/* Organization Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          {publicOrgs.map((org) => (
            <Card key={org.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="w-16 h-16 rounded-xl">
                  <AvatarFallback className="bg-gradient-to-br from-warning to-orange-600 text-white rounded-xl">
                    {org.type === "company" ? (
                      <Building2 className="w-8 h-8" />
                    ) : (
                      <Users className="w-8 h-8" />
                    )}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="m-0">{org.name}</h4>
                    <Badge variant="outline" className="text-xs capitalize">
                      {org.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground m-0 mb-2">
                    {org.industry} · {org.size} employees
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {org.location}
                  </div>
                </div>
              </div>

              {org.openRoles > 0 && (
                <div className="p-3 rounded-lg bg-accent mb-4">
                  <p className="text-sm font-medium m-0">
                    {org.openRoles} open {org.openRoles === 1 ? "role" : "roles"}
                  </p>
                </div>
              )}

              <Button variant="outline" className="w-full min-h-[44px]">
                View Profile
              </Button>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1280px] mx-auto px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="m-0 mb-2">
              {currentContext.type === "personal" 
                ? "Find Opportunities" 
                : currentContext.type === "company"
                ? "Team Directory"
                : "Candidate Network"}
            </h1>
            <p className="text-muted-foreground">
              {currentContext.type === "personal"
                ? "Discover companies, agencies, and job opportunities"
                : "Manage your team members and worker records"}
            </p>
          </div>

          {currentContext.type !== "personal" && (
            <Button className="bg-accent-brand hover:bg-accent-brand-hover gap-2 min-h-[44px]">
              <UserPlus className="w-4 h-4" />
              Add Person
            </Button>
          )}
        </div>

        {/* Search Bar */}
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder={
                  currentContext.type === "personal"
                    ? "Search people, companies, roles..."
                    : "Search by name, role, skills, or department..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 min-h-[44px]"
              />
            </div>
            <Button variant="outline" className="gap-2 min-h-[44px]">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </Card>

        {/* Directory Content */}
        {currentContext.type === "personal" 
          ? renderPublicDirectory()
          : renderInternalDirectory()
        }
      </div>
    </div>
  );
}
