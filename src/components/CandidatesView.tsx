import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { 
  Search, Filter, Plus, User, Mail, Phone,
  MapPin, Briefcase, Star, Award
} from "lucide-react";
import { ScopeToggle, type ScopeFilter } from "./ScopeToggle";
import { MaskedCandidateCard } from "./MaskedCandidateCard";
import { AgencyRoleBadge } from "./AgencyRoleBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner@2.0.3";

interface Candidate {
  id: string;
  name: string;
  role: string;
  skills: string[];
  location: string;
  experience: string;
  owner: string;
  ownerRole: string;
  team?: string;
  representation?: {
    type: "exclusive" | "non-exclusive";
    client?: string;
    endDate?: string;
  };
  status: "available" | "interviewing" | "placed" | "unavailable";
  isRestricted?: boolean;
}

export function CandidatesView() {
  const [scopeFilter, setScopeFilter] = useState<ScopeFilter>("my");
  const [searchQuery, setSearchQuery] = useState("");
  const [skillFilter, setSkillFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data
  const candidates: Candidate[] = [
    {
      id: "1",
      name: "Sarah Chen",
      role: "Senior Full-Stack Developer",
      skills: ["React", "Node.js", "TypeScript", "AWS"],
      location: "San Francisco, CA",
      experience: "8 years",
      owner: "James Wilson",
      ownerRole: "Account Manager",
      status: "interviewing",
      representation: {
        type: "exclusive",
        client: "RetailCo",
        endDate: "Dec 31, 2025"
      }
    },
    {
      id: "2",
      name: "Mike Rodriguez",
      role: "Product Manager",
      skills: ["Product Strategy", "Agile", "Analytics"],
      location: "New York, NY",
      experience: "6 years",
      owner: "James Wilson",
      ownerRole: "Account Manager",
      team: "Enterprise Team",
      status: "available"
    },
    {
      id: "3",
      name: "Alex Kim",
      role: "Senior Designer",
      skills: ["UI/UX", "Figma", "Design Systems"],
      location: "Austin, TX",
      experience: "5 years",
      owner: "Lisa Chen",
      ownerRole: "Recruiter",
      team: "Enterprise Team",
      status: "placed",
      isRestricted: scopeFilter !== "my" // Restricted if not "my"
    },
    {
      id: "4",
      name: "Emma Thompson",
      role: "Data Scientist",
      skills: ["Python", "ML", "TensorFlow", "SQL"],
      location: "Seattle, WA",
      experience: "7 years",
      owner: "Lisa Chen",
      ownerRole: "Recruiter",
      status: "available",
      isRestricted: scopeFilter === "agency" // Restricted for agency-wide view
    }
  ];

  const scopeCounts = {
    my: 2,
    team: 3,
    agency: 12
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "available": return "bg-success text-success-foreground";
      case "interviewing": return "bg-blue-500 text-white";
      case "placed": return "bg-purple-500 text-white";
      case "unavailable": return "bg-gray-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const filteredCandidates = candidates.filter((candidate) => {
    // Scope filter
    if (scopeFilter === "my" && candidate.owner !== "James Wilson") return false;
    if (scopeFilter === "team" && !candidate.team) return false;
    
    // Search filter
    if (searchQuery && !candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !candidate.role.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Skill filter
    if (skillFilter !== "all" && !candidate.skills.some(s => s.toLowerCase().includes(skillFilter.toLowerCase()))) {
      return false;
    }

    // Status filter
    if (statusFilter !== "all" && candidate.status !== statusFilter) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-1">Candidates</h1>
          <p className="text-muted-foreground m-0">
            Your candidate pool with {filteredCandidates.length} profiles
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ScopeToggle 
            value={scopeFilter} 
            onChange={setScopeFilter}
            counts={scopeCounts}
          />
          <Button className="gap-2 bg-accent-brand hover:bg-accent-brand-hover min-h-[44px]">
            <Plus className="w-4 h-4" />
            Add Candidate
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 min-h-[44px]"
            />
          </div>

          <Select value={skillFilter} onValueChange={setSkillFilter}>
            <SelectTrigger className="w-full md:w-48 min-h-[44px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Skills" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Skills</SelectItem>
              <SelectItem value="react">React</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="product">Product</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48 min-h-[44px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="interviewing">Interviewing</SelectItem>
              <SelectItem value="placed">Placed</SelectItem>
              <SelectItem value="unavailable">Unavailable</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Candidates List */}
      <div className="grid gap-4">
        {filteredCandidates.map((candidate) => {
          // Show masked card if restricted
          if (candidate.isRestricted) {
            return (
              <MaskedCandidateCard
                key={candidate.id}
                ownerName={candidate.owner}
                skills={candidate.skills}
                yearsExperience={candidate.experience}
                location={candidate.location}
                onRequestAccess={() => {
                  toast.success(`Access request sent to ${candidate.owner}`);
                }}
              />
            );
          }

          // Show full card if not restricted
          return (
            <Card key={candidate.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex gap-4">
                {/* Avatar */}
                <Avatar className="w-16 h-16 rounded-xl flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-xl">
                    {candidate.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  {/* Name and Status */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <h4 className="m-0 mb-1">{candidate.name}</h4>
                      <p className="text-sm text-muted-foreground m-0">{candidate.role}</p>
                    </div>
                    <Badge className={getStatusBadgeColor(candidate.status) + " capitalize"}>
                      {candidate.status}
                    </Badge>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {candidate.skills.map((skill, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  {/* Info Row */}
                  <div className="flex flex-wrap gap-x-4 gap-y-2 mb-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {candidate.location}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4" />
                      {candidate.experience} experience
                    </div>
                  </div>

                  {/* Owner and Team */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <p className="text-sm m-0">
                        <span className="font-medium text-foreground">{candidate.owner}</span>
                        <span className="text-muted-foreground"> · {candidate.ownerRole}</span>
                      </p>
                    </div>
                    {candidate.team && (
                      <Badge variant="outline" className="text-xs">
                        {candidate.team}
                      </Badge>
                    )}
                  </div>

                  {/* Representation Status */}
                  {candidate.representation && (
                    <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/20 mb-3">
                      <div className="flex items-start gap-2">
                        <Award className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-medium m-0">
                              {candidate.representation.type === "exclusive" ? "Exclusive" : "Non-exclusive"} Representation
                            </p>
                            <Badge variant="outline" className="border-purple-500/30 text-xs">
                              Active
                            </Badge>
                          </div>
                          {candidate.representation.client && (
                            <p className="text-xs text-muted-foreground m-0">
                              With {candidate.representation.client} until {candidate.representation.endDate}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <User className="w-4 h-4" />
                      View Profile
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Mail className="w-4 h-4" />
                      Message
                    </Button>
                    {candidate.status === "available" && (
                      <Button size="sm" className="gap-2 bg-accent-brand hover:bg-accent-brand-hover">
                        <Star className="w-4 h-4" />
                        Submit to Client
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredCandidates.length === 0 && (
        <Card className="p-12 text-center">
          <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="m-0 mb-2">No candidates found</h3>
          <p className="text-sm text-muted-foreground m-0 mb-4">
            Try adjusting your filters or add a new candidate
          </p>
          <Button className="gap-2 bg-accent-brand hover:bg-accent-brand-hover min-h-[44px]">
            <Plus className="w-4 h-4" />
            Add Candidate
          </Button>
        </Card>
      )}
    </div>
  );
}
