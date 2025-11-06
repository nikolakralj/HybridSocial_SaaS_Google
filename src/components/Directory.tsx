import { useState } from "react";
import { Search, MapPin, DollarSign, Briefcase, Filter } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function Directory() {
  const [activeTab, setActiveTab] = useState("people");

  const people = [
    {
      name: "Emma Wilson",
      title: "Senior React Developer",
      location: "New York, NY",
      rate: 180,
      availability: "Available now",
      skills: ["React", "TypeScript", "Node.js", "GraphQL"],
      match: 95,
    },
    {
      name: "James Chen",
      title: "Full-Stack Engineer",
      location: "San Francisco, CA",
      rate: 165,
      availability: "Available in 2 weeks",
      skills: ["Python", "Django", "React", "AWS"],
      match: 88,
    },
    {
      name: "Sofia Martinez",
      title: "DevOps Engineer",
      location: "Austin, TX",
      rate: 175,
      availability: "Limited availability",
      skills: ["Kubernetes", "Docker", "AWS", "Terraform"],
      match: 82,
    },
  ];

  const companies = [
    {
      name: "TechStart Solutions",
      type: "Agency",
      location: "San Francisco, CA",
      specialties: ["Web Development", "Mobile Apps", "Cloud"],
      teamSize: "15-20",
    },
    {
      name: "InnovateLabs",
      type: "Company",
      location: "New York, NY",
      specialties: ["AI/ML", "Data Science", "Analytics"],
      teamSize: "50+",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="m-0 mb-1">Directory</h1>
          <p className="text-muted-foreground m-0">
            Search and discover talent, companies, and agencies
          </p>
        </div>

        {/* Search & Filters */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, skills, location..."
                className="pl-10"
              />
            </div>
            <Button className="bg-accent-brand hover:bg-accent-brand-hover">
              Search
            </Button>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Skills" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Skills</SelectItem>
                <SelectItem value="react">React</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="node">Node.js</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="sf">San Francisco</SelectItem>
                <SelectItem value="ny">New York</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="now">Available now</SelectItem>
                <SelectItem value="soon">Within 2 weeks</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="match">
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="match">Best match</SelectItem>
                <SelectItem value="rate-low">Rate: Low to High</SelectItem>
                <SelectItem value="rate-high">Rate: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="people">People ({people.length})</TabsTrigger>
            <TabsTrigger value="companies">
              Organizations ({companies.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="people" className="space-y-4">
            {people.map((person, idx) => (
              <div
                key={idx}
                className="bg-card border border-border rounded-xl p-6 hover:border-accent-brand/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-14 h-14">
                      <AvatarFallback>
                        {person.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="m-0 mb-1">{person.name}</h3>
                      <p className="text-muted-foreground m-0 mb-2">
                        {person.title}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {person.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          ${person.rate}/hr
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {person.availability}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant="secondary"
                      className="bg-success/10 text-success border-success/20"
                    >
                      {person.match}% match
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {person.skills.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    View profile
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-accent-brand hover:bg-accent-brand-hover"
                  >
                    Contact
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="companies" className="space-y-4">
            {companies.map((company, idx) => (
              <div
                key={idx}
                className="bg-card border border-border rounded-xl p-6 hover:border-accent-brand/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-lg bg-accent flex items-center justify-center">
                      <span className="text-xl font-semibold">
                        {company.name.substring(0, 2)}
                      </span>
                    </div>
                    <div>
                      <h3 className="m-0 mb-1">{company.name}</h3>
                      <p className="text-muted-foreground m-0 mb-2">
                        {company.type}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {company.location}
                        </div>
                        <span>Team: {company.teamSize}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {company.specialties.map((specialty) => (
                    <Badge key={specialty} variant="outline">
                      {specialty}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View profile
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-accent-brand hover:bg-accent-brand-hover"
                  >
                    Connect
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
