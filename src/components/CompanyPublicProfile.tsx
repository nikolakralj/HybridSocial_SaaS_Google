import { Building2, MapPin, Calendar, Users, Star, Briefcase, Award, ExternalLink, Check, MessageCircle, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Avatar } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface CompanyPublicProfileProps {
  companyId?: string;
  onFollow?: () => void;
  onMessage?: () => void;
  onApplyToRole?: (roleId: string) => void;
}

export function CompanyPublicProfile({ onFollow, onMessage, onApplyToRole }: CompanyPublicProfileProps) {
  // Mock data - replace with real data from API
  const company = {
    name: "Acme Engineering",
    slug: "acme-engineering",
    tagline: "Building the future of robotics automation",
    logo: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200&h=200&fit=crop",
    banner: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=400&fit=crop",
    verified: true,
    founded: "2019",
    headquarters: "San Francisco, CA",
    size: "26-50 employees",
    website: "https://acme-eng.com",
    following: 1247,
    followers: 3450,
    industries: ["Manufacturing", "Logistics", "Healthcare"],
    services: ["Robotics Design", "Control Systems", "3D Simulation", "System Integration", "Automation Consulting"],
    skills: ["ROS", "Python", "C++", "CAD", "Computer Vision", "Motion Planning", "PLC Programming", "SCADA"],
    about: "Acme Engineering specializes in robotics automation for manufacturing, logistics, and healthcare. We design, build, and deploy custom robotics solutions that increase efficiency, reduce costs, and improve safety. Our team of 40+ engineers has delivered over 150 automation projects across North America.\n\nWe're passionate about making advanced robotics accessible to mid-sized manufacturers who want to compete with automation but don't have in-house robotics expertise.",
    reputation: {
      rating: 4.8,
      reviewCount: 47,
      jobSuccessScore: 95,
      projectsCompleted: 124,
      totalHoursBilled: 8450,
      memberSince: "March 2021",
      responseRate: 92,
      repeatHireRate: 68,
    },
    portfolio: [
      {
        id: "1",
        title: "Warehouse Picking Robot",
        client: "LogiCo Supply Chain",
        description: "Designed and deployed 12 collaborative picking robots that increased throughput by 3x",
        image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&h=400&fit=crop",
        tags: ["ROS", "Computer Vision", "Python"],
        metrics: "3x throughput increase, $2M annual savings",
      },
      {
        id: "2",
        title: "Medical Device Assembly Line",
        client: "MedTech Solutions",
        description: "Automated assembly line for surgical instruments with 99.9% quality rate",
        image: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=600&h=400&fit=crop",
        tags: ["PLC", "SCADA", "Quality Control"],
        metrics: "99.9% quality rate, 40% cost reduction",
      },
      {
        id: "3",
        title: "Food Processing Automation",
        client: "FreshPack Foods",
        description: "End-to-end automation of packaging line handling 10,000 units/hour",
        image: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&h=400&fit=crop",
        tags: ["Control Systems", "Safety", "Integration"],
        metrics: "10k units/hour, FDA compliant",
      },
    ],
    testimonials: [
      {
        id: "1",
        text: "Acme Engineering delivered a world-class robotics solution on time and under budget. Their team's expertise in computer vision was exceptional.",
        author: "Sarah Chen",
        role: "VP of Operations",
        company: "LogiCo Supply Chain",
        rating: 5,
        avatar: "SC",
      },
      {
        id: "2",
        text: "We've worked with Acme on 4 projects now. Their responsiveness and quality are unmatched. Highly recommend for any manufacturing automation.",
        author: "Michael Rodriguez",
        role: "Plant Manager",
        company: "MedTech Solutions",
        rating: 5,
        avatar: "MR",
      },
    ],
    awards: [
      { name: "Robotics Industry Association Excellence Award", year: "2023" },
      { name: "Inc. 5000 Fastest Growing Companies", year: "2022" },
      { name: "ISO 9001:2015 Certified", year: "2021" },
    ],
    openRoles: [
      {
        id: "1",
        title: "Senior Robotics Engineer",
        type: "Contract",
        duration: "6 months",
        rate: "$110-130/hr",
        posted: "2 days ago",
      },
      {
        id: "2",
        title: "Controls Engineer (PLC/SCADA)",
        type: "Contract",
        duration: "3 months",
        rate: "$95-115/hr",
        posted: "1 week ago",
      },
      {
        id: "3",
        title: "Computer Vision Specialist",
        type: "Contract",
        duration: "4 months",
        rate: "$120-140/hr",
        posted: "3 days ago",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Banner */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <ImageWithFallback
          src={company.banner}
          alt={`${company.name} banner`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      {/* Profile Header */}
      <div className="max-w-6xl mx-auto px-6 -mt-16 relative z-10">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-end mb-8">
          {/* Logo */}
          <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-background apple-shadow-lg bg-card flex-shrink-0">
            <ImageWithFallback
              src={company.logo}
              alt={company.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Name & Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl md:text-4xl">{company.name}</h1>
              {company.verified && (
                <div className="w-8 h-8 rounded-full bg-accent-brand flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" strokeWidth={3} />
                </div>
              )}
            </div>
            <p className="text-xl text-muted-foreground mb-4">{company.tagline}</p>
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {company.headquarters}
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                Founded {company.founded}
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                {company.size}
              </div>
              <div className="flex items-center gap-1.5">
                <ExternalLink className="w-4 h-4" />
                <a href={company.website} target="_blank" rel="noopener noreferrer" className="hover:text-accent-brand apple-transition">
                  Website
                </a>
              </div>
            </div>

            {/* Reputation Stats */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-accent/30 px-3 py-1.5 rounded-lg">
                <Star className="w-4 h-4 text-warning fill-warning" />
                <span className="font-semibold">{company.reputation.rating}</span>
                <span className="text-sm text-muted-foreground">({company.reputation.reviewCount} reviews)</span>
              </div>
              <Badge variant="secondary" className="px-3 py-1.5">
                {company.reputation.jobSuccessScore}% Job Success
              </Badge>
              <Badge variant="secondary" className="px-3 py-1.5">
                {company.reputation.projectsCompleted} Projects
              </Badge>
              <Badge variant="secondary" className="px-3 py-1.5">
                Member since {company.reputation.memberSince}
              </Badge>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 flex-shrink-0">
            <Button variant="outline" onClick={onFollow} className="gap-2">
              <Heart className="w-4 h-4" />
              Follow
            </Button>
            <Button onClick={onMessage} className="gap-2">
              <MessageCircle className="w-4 h-4" />
              Message
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="about" className="space-y-8">
          <TabsList className="border-b border-border w-full justify-start rounded-none bg-transparent p-0 h-auto">
            <TabsTrigger value="about" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent-brand data-[state=active]:bg-transparent">
              About
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent-brand data-[state=active]:bg-transparent">
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent-brand data-[state=active]:bg-transparent">
              Reviews
            </TabsTrigger>
            <TabsTrigger value="jobs" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent-brand data-[state=active]:bg-transparent">
              Open Roles ({company.openRoles.length})
            </TabsTrigger>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-8">
            {/* About Description */}
            <Card className="p-6">
              <h3 className="mb-4">About {company.name}</h3>
              <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                {company.about}
              </p>
            </Card>

            {/* Industries & Services */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h4 className="mb-4">Industries We Serve</h4>
                <div className="flex flex-wrap gap-2">
                  {company.industries.map((industry) => (
                    <Badge key={industry} variant="secondary">
                      {industry}
                    </Badge>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h4 className="mb-4">Services Offered</h4>
                <div className="flex flex-wrap gap-2">
                  {company.services.map((service) => (
                    <Badge key={service} variant="secondary">
                      {service}
                    </Badge>
                  ))}
                </div>
              </Card>
            </div>

            {/* Skills & Technologies */}
            <Card className="p-6">
              <h4 className="mb-4">Skills & Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {company.skills.map((skill) => (
                  <Badge key={skill} className="bg-accent-brand/10 text-accent-brand border-accent-brand/20">
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Awards & Certifications */}
            <Card className="p-6">
              <h4 className="mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-warning" />
                Awards & Certifications
              </h4>
              <div className="space-y-3">
                {company.awards.map((award) => (
                  <div key={award.name} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0">
                      <Award className="w-5 h-5 text-warning" />
                    </div>
                    <div>
                      <p className="font-medium">{award.name}</p>
                      <p className="text-sm text-muted-foreground">{award.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {company.portfolio.map((project) => (
                <Card key={project.id} className="overflow-hidden hover:apple-shadow-lg apple-transition group cursor-pointer">
                  <div className="aspect-video relative overflow-hidden">
                    <ImageWithFallback
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 apple-transition duration-500"
                    />
                  </div>
                  <div className="p-6 space-y-3">
                    <h4>{project.title}</h4>
                    <p className="text-sm text-muted-foreground">{project.client}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="pt-3 border-t border-border">
                      <p className="text-sm font-medium text-success">{project.metrics}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            {/* Overall Stats */}
            <Card className="p-6">
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-semibold mb-2">{company.reputation.rating}</div>
                  <div className="flex justify-center gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(company.reputation.rating) ? 'text-warning fill-warning' : 'text-muted-foreground'}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">{company.reputation.reviewCount} reviews</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-semibold mb-2">{company.reputation.responseRate}%</div>
                  <p className="text-sm text-muted-foreground">Response Rate</p>
                  <p className="text-xs text-muted-foreground mt-1">Replies in &lt;4 hours</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-semibold mb-2">{company.reputation.repeatHireRate}%</div>
                  <p className="text-sm text-muted-foreground">Repeat Hire Rate</p>
                  <p className="text-xs text-muted-foreground mt-1">Contractors hired 2+ times</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-semibold mb-2">{company.reputation.jobSuccessScore}%</div>
                  <p className="text-sm text-muted-foreground">Job Success Score</p>
                  <p className="text-xs text-muted-foreground mt-1">Projects completed successfully</p>
                </div>
              </div>
            </Card>

            {/* Individual Reviews */}
            <div className="space-y-4">
              {company.testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="p-6">
                  <div className="flex gap-4">
                    <Avatar className="w-12 h-12 bg-accent-brand/10 text-accent-brand flex items-center justify-center flex-shrink-0">
                      {testimonial.avatar}
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold">{testimonial.author}</p>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.role} at {testimonial.company}
                          </p>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-warning fill-warning" />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        "{testimonial.text}"
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-4">
            {company.openRoles.length > 0 ? (
              company.openRoles.map((role) => (
                <Card key={role.id} className="p-6 hover:apple-shadow-lg apple-transition">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4>{role.title}</h4>
                        <Badge variant="secondary">{role.type}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="w-4 h-4" />
                          {role.duration}
                        </div>
                        <div className="font-medium text-foreground">{role.rate}</div>
                        <div className="text-muted-foreground">Posted {role.posted}</div>
                      </div>
                    </div>
                    <Button onClick={() => onApplyToRole?.(role.id)}>
                      Apply Now
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-12 text-center">
                <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="mb-2">No open positions</h4>
                <p className="text-muted-foreground">
                  Follow {company.name} to get notified when they post new roles
                </p>
                <Button onClick={onFollow} className="mt-4">
                  Follow Company
                </Button>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
