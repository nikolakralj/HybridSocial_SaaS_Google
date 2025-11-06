import { useState } from "react";
import { 
  User, MapPin, Clock, Mail, Phone, Globe, 
  Edit, Share2, Link2, Eye, Briefcase, 
  GraduationCap, Award, FileText, Building2,
  ExternalLink
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { ViewAsToggle } from "./ViewAsToggle";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface PersonalProfileViewProps {
  isOwnProfile?: boolean;
  viewMode?: "personal" | "public" | "company";
}

export function PersonalProfileView({ 
  isOwnProfile = true,
  viewMode = "personal" 
}: PersonalProfileViewProps) {
  const [isPublic, setIsPublic] = useState(false);
  const [showEmployer, setShowEmployer] = useState(false);

  // Mock data - in production from context/API
  const profile = {
    name: "Sarah Chen",
    headline: "Senior Full-Stack Developer • React, Node.js, TypeScript",
    location: "San Francisco, CA",
    timezone: "PST (UTC-8)",
    email: "sarah.chen@example.com",
    phone: "+1 (415) 555-0123",
    website: "https://sarahchen.dev",
    preferredContact: "Email",
    availability: "available" as const,
    availableFrom: null,
    preferredRoles: ["Full-Stack Developer", "Technical Lead", "Engineering Manager"],
    workType: ["Remote", "Hybrid"],
    standardRate: 150,
    currency: "USD",
    minimumEngagement: "1 week",
    skills: [
      "React", "TypeScript", "Node.js", "PostgreSQL", "GraphQL",
      "AWS", "Docker", "Tailwind CSS", "Next.js", "Python"
    ],
    experience: [
      {
        id: "1",
        title: "Senior Full-Stack Developer",
        company: "TechVentures Inc.",
        location: "San Francisco, CA",
        startDate: "Jan 2022",
        endDate: null,
        current: true,
        description: "Leading development of enterprise SaaS platform"
      },
      {
        id: "2",
        title: "Full-Stack Developer",
        company: "StartupCo",
        location: "Remote",
        startDate: "Mar 2020",
        endDate: "Dec 2021",
        current: false,
        description: "Built customer-facing web applications"
      }
    ],
    education: [
      {
        id: "1",
        institution: "Stanford University",
        degree: "BS",
        field: "Computer Science",
        endDate: "2020"
      }
    ],
    certifications: [
      {
        id: "1",
        name: "AWS Solutions Architect",
        issuer: "Amazon Web Services",
        issueDate: "2023"
      }
    ],
    portfolio: [
      {
        id: "1",
        title: "E-commerce Platform Redesign",
        description: "Led frontend architecture for 500K+ user platform",
        tags: ["React", "TypeScript", "AWS"],
        date: "2023"
      }
    ],
    linkedRecords: [
      {
        id: "1",
        company: "TechVentures Inc.",
        role: "Senior Full-Stack Developer",
        status: "active" as const
      }
    ],
    representation: null,
    completionPercentage: 85
  };

  const showPrivateFields = viewMode === "personal";
  const showPublicFields = viewMode === "public" || (isPublic && viewMode !== "personal");

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1280px] mx-auto px-6 py-6 space-y-6">
        {/* Header Card */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-6 flex-1">
              <Avatar className="w-24 h-24 rounded-xl">
                <AvatarFallback className="bg-gradient-to-br from-accent-brand to-purple-600 text-white text-2xl rounded-xl">
                  SC
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="m-0">{profile.name}</h1>
                  {isOwnProfile && (
                    <Badge variant="outline" className="gap-1.5">
                      <User className="w-3 h-3" />
                      <span className="text-xs">Acting as Me</span>
                    </Badge>
                  )}
                </div>

                <p className="text-muted-foreground mb-4">{profile.headline}</p>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{profile.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{profile.timezone}</span>
                  </div>
                  {(showPrivateFields || showPublicFields) && (
                    <>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{profile.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <a href={profile.website} className="text-accent-brand hover:underline">
                          Portfolio
                        </a>
                      </div>
                    </>
                  )}
                </div>

                {/* Availability Badge */}
                <div className="mt-4">
                  <Badge className="bg-success text-success-foreground gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-white" />
                    Available for new projects
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isOwnProfile && <ViewAsToggle profileType="personal" />}
              {isOwnProfile ? (
                <Button className="gap-2 min-h-[44px]">
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </Button>
              ) : (
                <Button className="bg-accent-brand hover:bg-accent-brand-hover gap-2 min-h-[44px]">
                  <Mail className="w-4 h-4" />
                  Contact
                </Button>
              )}
            </div>
          </div>

          {/* Visibility Controls (only for owner) */}
          {isOwnProfile && showPrivateFields && (
            <div className="pt-6 border-t border-border space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-accent">
                <div className="flex-1">
                  <Label htmlFor="public-toggle" className="cursor-pointer">
                    Make my profile findable by companies and agencies
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    When enabled, your profile appears in public directory searches
                  </p>
                </div>
                <Switch
                  id="public-toggle"
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                />
              </div>

              {isPublic && (
                <div className="flex items-center justify-between p-4 rounded-lg bg-accent">
                  <div className="flex-1">
                    <Label htmlFor="employer-toggle" className="cursor-pointer">
                      Show my current employer on my public profile
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Display "{profile.experience[0]?.company}" on your public profile
                    </p>
                  </div>
                  <Switch
                    id="employer-toggle"
                    checked={showEmployer}
                    onCheckedChange={setShowEmployer}
                  />
                </div>
              )}

              {!isPublic && (
                <div className="p-4 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground m-0">
                    Your profile is <strong>Private</strong>. Only you and organizations 
                    you've linked to can see your information.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Completion Meter (only for owner if incomplete) */}
          {isOwnProfile && profile.completionPercentage < 100 && (
            <div className="mt-6 p-4 rounded-lg bg-accent-brand/5 border border-accent-brand/20">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium m-0">Profile {profile.completionPercentage}% complete</p>
                <Button variant="ghost" size="sm" className="h-8">
                  Complete profile
                </Button>
              </div>
              <div className="h-2 bg-accent rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent-brand transition-all"
                  style={{ width: `${profile.completionPercentage}%` }}
                />
              </div>
            </div>
          )}
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Availability & Preferences */}
            <Card className="p-6">
              <h3 className="m-0 mb-4">Availability & Preferences</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Preferred Roles</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profile.preferredRoles.map((role) => (
                      <Badge key={role} variant="outline">{role}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground">Work Type</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profile.workType.map((type) => (
                      <Badge key={type} variant="outline">{type}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              {(showPrivateFields || showPublicFields) && (
                <>
                  <Separator className="my-4" />
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Standard Rate</Label>
                      <p className="font-medium mt-1">
                        ${profile.standardRate}/{profile.currency === "USD" ? "hour" : "hr"}
                      </p>
                    </div>

                    <div>
                      <Label className="text-muted-foreground">Minimum Engagement</Label>
                      <p className="font-medium mt-1">{profile.minimumEngagement}</p>
                    </div>
                  </div>
                </>
              )}
            </Card>

            {/* Skills */}
            <Card className="p-6">
              <h3 className="m-0 mb-4">Skills & Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </Card>

            {/* Experience */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-5 h-5" />
                <h3 className="m-0">Experience</h3>
              </div>

              <div className="space-y-6">
                {profile.experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="m-0 mb-1">{exp.title}</h4>
                        <p className="text-muted-foreground m-0">
                          {exp.company} · {exp.location}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {exp.current ? "Current" : `${exp.startDate} - ${exp.endDate}`}
                      </Badge>
                    </div>
                    {exp.description && (
                      <p className="text-sm text-muted-foreground">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Portfolio */}
            {profile.portfolio.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5" />
                  <h3 className="m-0">Portfolio</h3>
                </div>

                <div className="space-y-4">
                  {profile.portfolio.map((item) => (
                    <div key={item.id} className="p-4 rounded-lg bg-accent">
                      <h4 className="m-0 mb-2">{item.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Education */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="w-5 h-5" />
                <h3 className="m-0">Education</h3>
              </div>

              <div className="space-y-4">
                {profile.education.map((edu) => (
                  <div key={edu.id}>
                    <h4 className="m-0 mb-1">{edu.institution}</h4>
                    <p className="text-sm text-muted-foreground m-0">
                      {edu.degree} in {edu.field}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{edu.endDate}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Certifications */}
            {profile.certifications.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5" />
                  <h3 className="m-0">Certifications</h3>
                </div>

                <div className="space-y-3">
                  {profile.certifications.map((cert) => (
                    <div key={cert.id}>
                      <h4 className="m-0 mb-1 text-sm">{cert.name}</h4>
                      <p className="text-xs text-muted-foreground m-0">{cert.issuer}</p>
                      <p className="text-xs text-muted-foreground mt-1">{cert.issueDate}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Linked Worker Records (only for owner) */}
            {isOwnProfile && showPrivateFields && profile.linkedRecords.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="w-5 h-5" />
                  <h3 className="m-0">Linked Organizations</h3>
                </div>

                <div className="space-y-3">
                  {profile.linkedRecords.map((record) => (
                    <div 
                      key={record.id} 
                      className="p-3 rounded-lg bg-accent flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium m-0 text-sm">{record.company}</p>
                        <p className="text-xs text-muted-foreground m-0">{record.role}</p>
                      </div>
                      <Badge variant="outline" className="text-xs capitalize">
                        {record.status}
                      </Badge>
                    </div>
                  ))}
                </div>

                <Button 
                  variant="outline" 
                  className="w-full mt-4 gap-2 min-h-[44px]"
                >
                  <Link2 className="w-4 h-4" />
                  Link to Company
                </Button>
              </Card>
            )}

            {/* Documents/CVs (only for owner) */}
            {isOwnProfile && showPrivateFields && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="m-0">Documents</h3>
                  <Button variant="ghost" size="sm" className="h-8">
                    <FileText className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-accent flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium m-0">Resume_2024.pdf</p>
                        <p className="text-xs text-muted-foreground m-0">Updated Oct 2024</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8">
                      <Share2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4 min-h-[44px]">
                  Upload Document
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
