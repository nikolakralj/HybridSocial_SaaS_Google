import { useState } from "react";
import { CalendarDays, LayoutList, Download, Users, User, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar } from "../ui/avatar";
import { TimesheetCalendarView } from "./TimesheetCalendarView";
import { TimesheetListView } from "./TimesheetListView";
import { TimesheetManagerCalendarView } from "./TimesheetManagerCalendarView";
import { TimesheetManagerListView } from "./TimesheetManagerListView";

interface Contractor {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

interface UnifiedTimesheetViewProps {
  userRole?: "individual-contributor" | "company-owner" | "agency-owner";
  currentUserId?: string;
  currentUserName?: string;
  hourlyRate?: number;
}

export function UnifiedTimesheetView({
  userRole = "individual-contributor",
  currentUserId = "c1",
  currentUserName = "Sarah Chen",
  hourlyRate = 95
}: UnifiedTimesheetViewProps) {
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [selectedContractorId, setSelectedContractorId] = useState<string>(
    userRole === "individual-contributor" ? currentUserId : "all"
  );

  // Mock contractors list (in real app, this would be fetched based on permissions)
  // TODO: For scalability with large teams (50+ contractors):
  // - Add search/autocomplete in contractor dropdown
  // - Group contractors by department/role (Design, Dev, QA)
  // - Add "Recently Viewed" section
  // - Implement virtual scrolling for dropdown
  const contractors: Contractor[] = [
    { id: "c1", name: "Sarah Chen", role: "Senior Developer", avatar: "SC" },
    { id: "c2", name: "Mike Johnson", role: "UI Designer", avatar: "MJ" },
    { id: "c3", name: "Lisa Park", role: "Frontend Dev", avatar: "LP" },
  ];

  // Filter contractors based on role
  const getAvailableContractors = () => {
    if (userRole === "individual-contributor") {
      // Individual contributors only see themselves
      return contractors.filter(c => c.id === currentUserId);
    }
    // Managers/owners see everyone
    return contractors;
  };

  const availableContractors = getAvailableContractors();
  const selectedContractor = contractors.find(c => c.id === selectedContractorId);
  
  // Check if we're in aggregate mode
  const isAggregateMode = selectedContractorId === "all";
  
  // Show aggregate option only for managers/owners
  const canSeeAggregate = userRole !== "individual-contributor";

  // Mock status data (in real app, this would be calculated from actual timesheet data)
  const getStatusData = () => {
    if (isAggregateMode) {
      return {
        totalHours: 392,
        approvedHours: 280,
        pendingHours: 72,
        rejectedHours: 8,
        draftHours: 32,
      };
    } else {
      return {
        totalHours: 160,
        approvedHours: 120,
        pendingHours: 24,
        rejectedHours: 0,
        draftHours: 16,
      };
    }
  };

  const statusData = getStatusData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="mb-1">My Timesheet</h2>
        <p className="text-sm text-muted-foreground">
          {isAggregateMode 
            ? `Team overview for October 2025`
            : `Individual timesheet for October 2025`
          }
        </p>
      </div>

      {/* Prominent Contractor Selector */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-accent/50">
              {isAggregateMode ? (
                <Users className="w-6 h-6 text-primary" />
              ) : (
                <User className="w-6 h-6 text-primary" />
              )}
            </div>
            <div className="flex-1">
              <label className="text-sm text-muted-foreground block mb-1">
                Viewing Timesheet
              </label>
              <Select value={selectedContractorId} onValueChange={setSelectedContractorId}>
                <SelectTrigger className="w-full h-12 text-lg">
                  <SelectValue placeholder="Select contractor" />
                </SelectTrigger>
                <SelectContent>
                  {canSeeAggregate && (
                    <SelectItem value="all">
                      <div className="flex items-center gap-3 py-1">
                        <div className="p-2 rounded-md bg-accent">
                          <Users className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-medium">All Contractors</div>
                          <div className="text-xs text-muted-foreground">
                            Team aggregate view
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  )}
                  {availableContractors.map(contractor => (
                    <SelectItem key={contractor.id} value={contractor.id}>
                      <div className="flex items-center gap-3 py-1">
                        <Avatar className="w-8 h-8">
                          <div className="w-full h-full flex items-center justify-center bg-accent text-xs font-medium">
                            {contractor.avatar}
                          </div>
                        </Avatar>
                        <div>
                          <div className="font-medium">{contractor.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {contractor.role}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status Ribbon */}
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-2xl font-semibold mb-1">
                    {statusData.totalHours}h
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Total Logged
                  </div>
                </div>
                
                <div className="h-12 w-px bg-border" />
                
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <div>
                    <div className="font-semibold">
                      {statusData.approvedHours}h
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Approved
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-warning" />
                  <div>
                    <div className="font-semibold">
                      {statusData.pendingHours}h
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Pending
                    </div>
                  </div>
                </div>

                {statusData.rejectedHours > 0 && (
                  <div className="flex items-center gap-1">
                    <XCircle className="w-4 h-4 text-destructive" />
                    <div>
                      <div className="font-semibold">
                        {statusData.rejectedHours}h
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Rejected
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                  </div>
                  <div>
                    <div className="font-semibold">
                      {statusData.draftHours}h
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Draft
                    </div>
                  </div>
                </div>
              </div>

              {isAggregateMode && (
                <Badge variant="secondary" className="gap-1">
                  <Users className="w-3 h-3" />
                  {availableContractors.length} contractors
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Controls Bar */}
      <div className="flex items-center justify-between">
        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-accent/30 rounded-lg p-1 border border-border">
          <Button
            variant={viewMode === "calendar" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("calendar")}
            className="gap-2"
          >
            <CalendarDays className="w-4 h-4" />
            Calendar
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="gap-2"
          >
            <LayoutList className="w-4 h-4" />
            List
          </Button>
        </div>

        {/* Export Button */}
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          Export {isAggregateMode ? "All" : selectedContractor?.name}
        </Button>
      </div>

      {/* Conditional Rendering Based on Selection */}
      {isAggregateMode ? (
        // Aggregate View - Show all contractors combined
        <>
          {viewMode === "calendar" ? (
            <TimesheetManagerCalendarView 
              selectedContractor={selectedContractorId}
            />
          ) : (
            <TimesheetManagerListView 
              selectedContractor={selectedContractorId}
            />
          )}
        </>
      ) : (
        // Individual View - Show selected contractor's timesheet
        <>
          {viewMode === "calendar" ? (
            <TimesheetCalendarView
              contractorName={selectedContractor?.name || currentUserName}
              hourlyRate={hourlyRate}
              mode={selectedContractorId === currentUserId ? "contractor" : "manager"}
              userRole={userRole}
            />
          ) : (
            <TimesheetListView
              contractorName={selectedContractor?.name || currentUserName}
              hourlyRate={hourlyRate}
            />
          )}
        </>
      )}
    </div>
  );
}
