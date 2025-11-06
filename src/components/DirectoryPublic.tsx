import { useState } from "react";
import { Search, MapPin, DollarSign, Users, Building2, Briefcase, Mail, MessageSquare, UserPlus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { AvailabilityBadge } from "./StatusBadges";
import { MatchExplainerTooltip } from "./MatchExplainerTooltip";
import { useWorkGraph } from "../contexts/WorkGraphContext";

export function DirectoryPublic() {
  const [searchQuery, setSearchQuery] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const { currentContext } = useWorkGraph();

  // Mock data - public Personal Profiles
  const people = [
    {
      id: "1",
      name: "Alex Thompson",
      headline: "Senior React Developer",
      location: "San Francisco, CA",
      availability: "available" as const,
      skills: ["React", "TypeScript", "Node.js", "AWS", "PostgreSQL"],
      rate: 150,
      currency: "USD",
      matchPercentage: 92,
      representedBy: null,
      matchReasons: [
        { label: "Has required React & TypeScript skills", matched: true },
        { label: "Available immediately", matched: true },
        { label: "Located in target region", matched: true },
        { label: "Rate within budget", matched: true },
      ],
    },
    {
      id: "2",
      name: "Maria Garcia",
      headline: "Full-Stack Developer & Technical Lead",
      location: "Austin, TX",
      availability: "limited" as const,
      skills: ["Vue.js", "Python", "Django", "Docker", "Kubernetes"],
      rate: 180,
      currency: "USD",
      matchPercentage: 78,
      representedBy: { name: "Elite Recruiters", exclusive: true },
      matchReasons: [
        { label: "Has required Python skills", matched: true },
        { label: "Available immediately", matched: false },
        { label: "Located in target region", matched: true },
        { label: "Rate within budget", matched: true },
      ],
    },
    {
      id: "3",
      name: "David Kim",
      headline: "DevOps Engineer & Cloud Architect",
      location: "Remote",
      availability: "available" as const,
      skills: ["AWS", "Terraform", "Kubernetes", "CI/CD", "Python"],
      rate: 160,
      currency: "USD",
      matchPercentage: 85,
      representedBy: null,
      matchReasons: [
        { label: "Has required AWS & Kubernetes skills", matched: true },
        { label: "Available immediately", matched: true },
        { label: "Located in target region", matched: true },
        { label: "Rate within budget", matched: false },
      ],
    },
  ];

  // Mock data - public Organizations
  const organizations = [
    {
      id: "1",
      name: "TechVentures Inc.",
      type: "company" as const,
      industry: "SaaS",
      size: "50-200",
      location: "San Francisco, CA",
      openRoles: 5,
      description: "Building the future of team collaboration",
    },
    {
      id: "2",
      name: "Elite Recruiters",
      type: "agency" as const,
      industry: "Tech Staffing",
      size: "10-50",
      location: "New York, NY",
      openRoles: 0,
      description: "Connecting top tech talent with leading companies",
    },
    {
      id: "3",
      name: "CloudScale Systems",
      type: "company" as const,
      industry: "Cloud Infrastructure",
      size: "200-500",
      location: "Seattle, WA",
      openRoles: 12,
      description: "Enterprise cloud solutions provider",
    },
  ];

  const getContextAwareAction = (person: typeof people[0]) => {
    switch (currentContext.type) {
      case "company":
        if (person.representedBy) {
          return (
            <Button variant="outline" size="sm" className="gap-2 min-h-[44px]">
              <MessageSquare className="w-4 h-4" />
              Request intro
            </Button>
          );
        }
        return (
          <Button variant="outline" size="sm" className="gap-2 min-h-[44px]">
            <Briefcase className="w-4 h-4" />
            Invite to Job
          </Button>
        );
      case "agency":
        return (
          <Button variant="outline" size="sm" className="gap-2 min-h-[44px]">
            <UserPlus className="w-4 h-4" />
            Add Candidate
          </Button>
        );
      default: // personal
        return (
          <Button variant="outline" size="sm" className="gap-2 min-h-[44px]">
            <Mail className="w-4 h-4" />
            Message
          </Button>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1280px] mx-auto px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="m-0 mb-2">Discovery</h1>
          <p className="text-muted-foreground">
            Find talented professionals and companies
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, skills, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 min-h-[44px]"
            />
          </div>
          <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
            <SelectTrigger className="w-[180px] min-h-[44px]">
              <SelectValue placeholder="Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All availability</SelectItem>
              <SelectItem value="available">Available now</SelectItem>
              <SelectItem value="limited">Limited availability</SelectItem>
            </SelectContent>
          </Select>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-[180px] min-h-[44px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All locations</SelectItem>
              <SelectItem value="remote">Remote</SelectItem>
              <SelectItem value="us">United States</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="people" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="people">People</TabsTrigger>
            <TabsTrigger value="organizations">Organizations</TabsTrigger>
          </TabsList>

          {/* People Tab */}
          <TabsContent value="people" className="space-y-4">
            {people.map((person) => (
              <Card key={person.id} className="p-6">
                <div className="flex items-start gap-6">
                  {/* Avatar */}
                  <Avatar className="w-16 h-16 rounded-xl flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-accent-brand to-purple-600 text-white rounded-xl">
                      {person.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="m-0 mb-1">{person.name}</h3>
                        <p className="text-muted-foreground m-0 mb-2">{person.headline}</p>
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            {person.location}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <DollarSign className="w-4 h-4" />
                            ${person.rate}/hr
                          </div>
                          <AvailabilityBadge status={person.availability} />
                          {person.representedBy && (
                            <Badge variant="outline" className="gap-1.5 border-purple-500 text-purple-500">
                              <Users className="w-3 h-3" />
                              Represented by {person.representedBy.name}
                              {person.representedBy.exclusive && " • Exclusive"}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {/* Match percentage (only for company/agency contexts) */}
                      {(currentContext.type === "company" || currentContext.type === "agency") && (
                        <div className="flex-shrink-0">
                          <MatchExplainerTooltip 
                            matchPercentage={person.matchPercentage}
                            matchReasons={person.matchReasons}
                          />
                        </div>
                      )}
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {person.skills.slice(0, 5).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {person.skills.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{person.skills.length - 5} more
                        </Badge>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {getContextAwareAction(person)}
                      <Button variant="ghost" size="sm" className="gap-2 min-h-[44px]">
                        View Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Organizations Tab */}
          <TabsContent value="organizations" className="space-y-4">
            {organizations.map((org) => (
              <Card key={org.id} className="p-6">
                <div className="flex items-start gap-6">
                  {/* Logo */}
                  <Avatar className="w-16 h-16 rounded-xl flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-warning to-orange-600 text-white rounded-xl">
                      {org.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <h3 className="m-0 mb-1">{org.name}</h3>
                        <p className="text-muted-foreground m-0 mb-2">{org.description}</p>
                        <div className="flex flex-wrap items-center gap-3">
                          <Badge variant="outline" className="capitalize">
                            {org.type}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{org.industry}</span>
                          <span className="text-sm text-muted-foreground">{org.size} employees</span>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            {org.location}
                          </div>
                          {org.openRoles > 0 && (
                            <Badge className="bg-success text-success-foreground">
                              {org.openRoles} open roles
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-4">
                      <Button variant="outline" size="sm" className="gap-2 min-h-[44px]">
                        <Building2 className="w-4 h-4" />
                        View Company
                      </Button>
                      {org.openRoles > 0 && (
                        <Button size="sm" className="bg-accent-brand hover:bg-accent-brand-hover gap-2 min-h-[44px]">
                          View Open Roles
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
