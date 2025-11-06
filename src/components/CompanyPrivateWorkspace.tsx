import { useState } from "react";
import { 
  LayoutDashboard, Briefcase, Users, FileText, Clock, DollarSign, 
  BarChart3, Settings, Plus, Search, Filter, Download, 
  CheckCircle2, AlertCircle, TrendingUp, Calendar, MessageSquare
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar } from "./ui/avatar";
import { Progress } from "./ui/progress";

interface CompanyPrivateWorkspaceProps {
  companyId?: string;
  onNavigate?: (section: string) => void;
}

export function CompanyPrivateWorkspace({ onNavigate }: CompanyPrivateWorkspaceProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data - replace with real data from API
  const stats = {
    activeContractors: 15,
    monthlySpend: 42500,
    weeklyHours: 320,
    avgRating: 4.8,
    openProjects: 8,
    pendingTimesheets: 3,
    upcomingPayments: 2,
  };

  const recentActivity = [
    { 
      id: "1", 
      type: "timesheet", 
      actor: "Sarah Chen", 
      action: "submitted timesheet for Week 2", 
      time: "2 hours ago",
      avatar: "SC"
    },
    { 
      id: "2", 
      type: "payment", 
      actor: "System", 
      action: "Invoice #WG-2024-0123 paid successfully", 
      time: "5 hours ago",
      avatar: "💰"
    },
    { 
      id: "3", 
      type: "milestone", 
      actor: "Mike Johnson", 
      action: "completed Milestone 3: API Integration", 
      time: "1 day ago",
      avatar: "MJ"
    },
    { 
      id: "4", 
      type: "message", 
      actor: "Lisa Park", 
      action: "sent a message in Project Mobile App", 
      time: "1 day ago",
      avatar: "LP"
    },
  ];

  const projects = [
    {
      id: "1",
      name: "Mobile App Redesign",
      status: "active",
      progress: 65,
      budget: 15000,
      spent: 9750,
      team: ["Sarah Chen", "Lisa Park"],
      dueDate: "Jan 20, 2024",
      priority: "high",
    },
    {
      id: "2",
      name: "Factory Automation System",
      status: "active",
      progress: 40,
      budget: 30000,
      spent: 12000,
      team: ["Mike Johnson", "Alex Kim"],
      dueDate: "Feb 5, 2024",
      priority: "medium",
    },
    {
      id: "3",
      name: "API Integration",
      status: "review",
      progress: 90,
      budget: 8000,
      spent: 7200,
      team: ["Mike Johnson"],
      dueDate: "Jan 15, 2024",
      priority: "high",
    },
  ];

  const contractors = [
    {
      id: "1",
      name: "Sarah Chen",
      role: "Senior Robotics Engineer",
      avatar: "SC",
      rating: 4.9,
      hourlyRate: 120,
      hoursThisWeek: 40,
      activeProjects: 2,
      status: "active",
    },
    {
      id: "2",
      name: "Mike Johnson",
      role: "Controls Engineer",
      avatar: "MJ",
      rating: 4.8,
      hourlyRate: 110,
      hoursThisWeek: 35,
      activeProjects: 2,
      status: "active",
    },
    {
      id: "3",
      name: "Lisa Park",
      role: "UI/UX Designer",
      avatar: "LP",
      rating: 5.0,
      hourlyRate: 95,
      hoursThisWeek: 20,
      activeProjects: 1,
      status: "active",
    },
  ];

  const pendingTimesheets = [
    {
      id: "1",
      contractor: "Sarah Chen",
      avatar: "SC",
      week: "Jan 8-14, 2024",
      hours: 40,
      amount: 4800,
      project: "Mobile App Redesign",
    },
    {
      id: "2",
      contractor: "Mike Johnson",
      avatar: "MJ",
      week: "Jan 8-14, 2024",
      hours: 35,
      amount: 3850,
      project: "Factory Automation",
    },
    {
      id: "3",
      contractor: "Lisa Park",
      avatar: "LP",
      week: "Jan 8-14, 2024",
      hours: 20,
      amount: 1900,
      project: "Mobile App Redesign",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-1">Company Workspace</h1>
              <p className="text-sm text-muted-foreground">
                Manage projects, contractors, and payments
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Post New Role
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview" className="gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="projects" className="gap-2">
              <Briefcase className="w-4 h-4" />
              Projects ({stats.openProjects})
            </TabsTrigger>
            <TabsTrigger value="contractors" className="gap-2">
              <Users className="w-4 h-4" />
              Contractors ({stats.activeContractors})
            </TabsTrigger>
            <TabsTrigger value="timesheets" className="gap-2">
              <Clock className="w-4 h-4" />
              Timesheets
              {stats.pendingTimesheets > 0 && (
                <Badge variant="destructive" className="ml-1 px-1.5 py-0.5 text-xs">
                  {stats.pendingTimesheets}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="payments" className="gap-2">
              <DollarSign className="w-4 h-4" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Active Contractors</p>
                  <Users className="w-4 h-4 text-muted-foreground" />
                </div>
                <p className="text-3xl font-semibold mb-1">{stats.activeContractors}</p>
                <p className="text-xs text-success flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +2 this month
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Monthly Spend</p>
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                </div>
                <p className="text-3xl font-semibold mb-1">${(stats.monthlySpend / 1000).toFixed(1)}k</p>
                <p className="text-xs text-muted-foreground">
                  vs. $38.2k last month
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Hours This Week</p>
                  <Clock className="w-4 h-4 text-muted-foreground" />
                </div>
                <p className="text-3xl font-semibold mb-1">{stats.weeklyHours}</p>
                <p className="text-xs text-muted-foreground">
                  Across {stats.openProjects} projects
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Avg. Rating</p>
                  <BarChart3 className="w-4 h-4 text-muted-foreground" />
                </div>
                <p className="text-3xl font-semibold mb-1">{stats.avgRating}</p>
                <p className="text-xs text-success">
                  Excellent performance
                </p>
              </Card>
            </div>

            {/* Action Items */}
            {(stats.pendingTimesheets > 0 || stats.upcomingPayments > 0) && (
              <Card className="p-6">
                <h3 className="mb-4">Action Required</h3>
                <div className="space-y-3">
                  {stats.pendingTimesheets > 0 && (
                    <div className="flex items-center justify-between p-4 bg-warning/10 border border-warning/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-warning" />
                        <div>
                          <p className="font-medium">Review {stats.pendingTimesheets} pending timesheets</p>
                          <p className="text-sm text-muted-foreground">Submitted by contractors this week</p>
                        </div>
                      </div>
                      <Button variant="outline" onClick={() => setActiveTab("timesheets")}>
                        Review Now
                      </Button>
                    </div>
                  )}
                  {stats.upcomingPayments > 0 && (
                    <div className="flex items-center justify-between p-4 bg-accent-brand/10 border border-accent-brand/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-5 h-5 text-accent-brand" />
                        <div>
                          <p className="font-medium">{stats.upcomingPayments} invoices due this week</p>
                          <p className="text-sm text-muted-foreground">Total: $12,650</p>
                        </div>
                      </div>
                      <Button onClick={() => setActiveTab("payments")}>
                        Process Payments
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Active Projects */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3>Active Projects</h3>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("projects")}>
                    View All
                  </Button>
                </div>
                <div className="space-y-4">
                  {projects.slice(0, 3).map((project) => (
                    <div key={project.id} className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{project.name}</p>
                            <Badge 
                              variant={project.priority === "high" ? "destructive" : "secondary"}
                              className="text-xs"
                            >
                              {project.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Due {project.dueDate}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{project.progress}%</p>
                        </div>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                      <div className="flex items-center justify-between text-sm">
                        <p className="text-muted-foreground">
                          ${project.spent.toLocaleString()} of ${project.budget.toLocaleString()}
                        </p>
                        <p className="text-muted-foreground">
                          {project.team.length} member{project.team.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Recent Activity */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3>Recent Activity</h3>
                </div>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex gap-3">
                      <Avatar className="w-10 h-10 bg-accent-brand/10 text-accent-brand flex items-center justify-center flex-shrink-0">
                        {activity.avatar}
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-medium">{activity.actor}</span>{" "}
                          <span className="text-muted-foreground">{activity.action}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search projects..." className="pl-9" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  New Project
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="p-6 hover:apple-shadow-lg apple-transition cursor-pointer">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h4>{project.name}</h4>
                          <Badge 
                            variant={
                              project.status === "active" ? "default" :
                              project.status === "review" ? "secondary" :
                              "outline"
                            }
                          >
                            {project.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          Due {project.dueDate}
                        </p>
                      </div>
                      <Badge 
                        variant={project.priority === "high" ? "destructive" : "secondary"}
                      >
                        {project.priority}
                      </Badge>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} />
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Budget</span>
                        <span className="font-medium">
                          ${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={(project.spent / project.budget) * 100} />
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex -space-x-2">
                        {project.team.slice(0, 3).map((member, idx) => (
                          <Avatar 
                            key={idx}
                            className="w-8 h-8 border-2 border-card bg-accent-brand/10 text-accent-brand flex items-center justify-center"
                          >
                            {member.split(' ').map(n => n[0]).join('')}
                          </Avatar>
                        ))}
                        {project.team.length > 3 && (
                          <div className="w-8 h-8 rounded-full border-2 border-card bg-muted flex items-center justify-center text-xs">
                            +{project.team.length - 3}
                          </div>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Messages
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Contractors Tab */}
          <TabsContent value="contractors" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search contractors..." className="pl-9" />
              </div>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Invite Contractor
              </Button>
            </div>

            <div className="space-y-4">
              {contractors.map((contractor) => (
                <Card key={contractor.id} className="p-6">
                  <div className="flex items-center gap-6">
                    <Avatar className="w-16 h-16 bg-accent-brand/10 text-accent-brand flex items-center justify-center text-xl">
                      {contractor.avatar}
                    </Avatar>
                    
                    <div className="flex-1 grid md:grid-cols-4 gap-4">
                      <div>
                        <p className="font-semibold mb-1">{contractor.name}</p>
                        <p className="text-sm text-muted-foreground">{contractor.role}</p>
                        <div className="flex items-center gap-1 mt-2">
                          <span className="text-sm font-medium">{contractor.rating}</span>
                          <span className="text-warning">★</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Hourly Rate</p>
                        <p className="font-semibold">${contractor.hourlyRate}/hr</p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-1">This Week</p>
                        <p className="font-semibold">{contractor.hoursThisWeek} hours</p>
                        <p className="text-sm text-muted-foreground">
                          ${(contractor.hoursThisWeek * contractor.hourlyRate).toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Active Projects</p>
                        <p className="font-semibold">{contractor.activeProjects}</p>
                        <Badge 
                          variant={contractor.status === "active" ? "default" : "secondary"}
                          className="mt-2"
                        >
                          {contractor.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Message
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Timesheets Tab */}
          <TabsContent value="timesheets" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2>Pending Timesheets</h2>
                <p className="text-sm text-muted-foreground">
                  Review and approve contractor hours
                </p>
              </div>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export All
              </Button>
            </div>

            <div className="space-y-4">
              {pendingTimesheets.map((timesheet) => (
                <Card key={timesheet.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <Avatar className="w-12 h-12 bg-accent-brand/10 text-accent-brand flex items-center justify-center">
                        {timesheet.avatar}
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold mb-1">{timesheet.contractor}</p>
                        <p className="text-sm text-muted-foreground">{timesheet.project}</p>
                      </div>
                      <div className="text-center px-6 border-l border-r border-border">
                        <p className="text-sm text-muted-foreground mb-1">Week</p>
                        <p className="font-medium">{timesheet.week}</p>
                      </div>
                      <div className="text-center px-6 border-r border-border">
                        <p className="text-sm text-muted-foreground mb-1">Hours</p>
                        <p className="font-semibold text-lg">{timesheet.hours}</p>
                      </div>
                      <div className="text-center px-6">
                        <p className="text-sm text-muted-foreground mb-1">Amount</p>
                        <p className="font-semibold text-lg">${timesheet.amount.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Reject
                      </Button>
                      <Button size="sm" className="gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Approve
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {pendingTimesheets.length === 0 && (
              <Card className="p-12 text-center">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="mb-2">No pending timesheets</h3>
                <p className="text-muted-foreground">
                  All timesheets have been reviewed
                </p>
              </Card>
            )}
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card className="p-6 text-center">
              <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="mb-2">Payments Dashboard</h3>
              <p className="text-muted-foreground">
                Payment management features coming soon
              </p>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="p-6 text-center">
              <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="mb-2">Analytics Dashboard</h3>
              <p className="text-muted-foreground">
                Advanced analytics and reporting coming soon
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
