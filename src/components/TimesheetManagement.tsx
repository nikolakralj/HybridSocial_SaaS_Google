import { useState } from "react";
import { Clock, CheckCircle, XCircle, AlertCircle, Calendar } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { toast } from "sonner@2.0.3";

type TimesheetStatus = "draft" | "submitted" | "manager_approved" | "finance_approved" | "rejected";

interface TimesheetEntry {
  day: string;
  date: string;
  hours: number;
  notes?: string;
}

interface Timesheet {
  id: string;
  workerId: string;
  workerName: string;
  weekStart: string;
  weekEnd: string;
  entries: TimesheetEntry[];
  totalHours: number;
  status: TimesheetStatus;
  submittedAt?: string;
  managerApprovedAt?: string;
  managerApprovedBy?: string;
  financeApprovedAt?: string;
  financeApprovedBy?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  rejectionReason?: string;
}

interface TimesheetManagementProps {
  timesheet?: Timesheet;
  viewMode?: "worker" | "manager" | "finance";
  onSubmit?: (timesheet: Timesheet) => void;
  onApprove?: (timesheet: Timesheet, approver: string) => void;
  onReject?: (timesheet: Timesheet, rejector: string, reason: string) => void;
}

export function TimesheetManagement({ 
  timesheet, 
  viewMode = "worker",
  onSubmit,
  onApprove,
  onReject
}: TimesheetManagementProps) {
  const [entries, setEntries] = useState<TimesheetEntry[]>(
    timesheet?.entries || [
      { day: "Monday", date: "Oct 21", hours: 0 },
      { day: "Tuesday", date: "Oct 22", hours: 0 },
      { day: "Wednesday", date: "Oct 23", hours: 0 },
      { day: "Thursday", date: "Oct 24", hours: 0 },
      { day: "Friday", date: "Oct 25", hours: 0 },
    ]
  );
  const [rejectionReason, setRejectionReason] = useState("");

  const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);

  const updateHours = (index: number, hours: string) => {
    const newEntries = [...entries];
    newEntries[index].hours = parseFloat(hours) || 0;
    setEntries(newEntries);
  };

  const handleSubmit = () => {
    if (totalHours === 0) {
      toast.error("Please log some hours before submitting");
      return;
    }
    toast.success("Timesheet submitted for approval");
  };

  const handleApprove = () => {
    toast.success(`Timesheet approved as ${viewMode}`);
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    toast.error("Timesheet rejected");
    setRejectionReason("");
  };

  const getStatusBadge = (status: TimesheetStatus) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      case "submitted":
        return <Badge className="bg-warning">Pending Approval</Badge>;
      case "manager_approved":
        return <Badge className="bg-blue-500">Manager Approved</Badge>;
      case "finance_approved":
        return <Badge className="bg-success">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const canEdit = viewMode === "worker" && (!timesheet || timesheet.status === "draft");
  const canApprove = 
    (viewMode === "manager" && timesheet?.status === "submitted") ||
    (viewMode === "finance" && timesheet?.status === "manager_approved");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="m-0 mb-1">Weekly Timesheet</h3>
          <p className="text-sm text-muted-foreground m-0">
            Week of {timesheet?.weekStart || "Oct 21"} - {timesheet?.weekEnd || "Oct 25, 2025"}
          </p>
        </div>
        {timesheet && getStatusBadge(timesheet.status)}
      </div>

      {/* Timesheet Entries */}
      <Card className="p-6">
        <div className="space-y-3">
          {entries.map((entry, idx) => (
            <div key={entry.day} className="flex items-center gap-4">
              <div className="w-28 flex-shrink-0">
                <p className="text-sm font-medium m-0">{entry.day}</p>
                <p className="text-xs text-muted-foreground m-0">{entry.date}</p>
              </div>
              <div className="flex-1">
                <Input
                  type="number"
                  min="0"
                  max="24"
                  step="0.5"
                  value={entry.hours || ""}
                  onChange={(e) => updateHours(idx, e.target.value)}
                  placeholder="0"
                  disabled={!canEdit}
                  className="w-24"
                />
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">hours</span>
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-6" />

        {/* Total */}
        <div className="flex items-center justify-between">
          <p className="font-medium m-0">Total Hours</p>
          <p className="text-2xl font-semibold m-0">{totalHours}h</p>
        </div>

        {/* Worker Actions */}
        {canEdit && (
          <div className="mt-6">
            <Button className="w-full" onClick={handleSubmit}>
              Submit for Approval
            </Button>
          </div>
        )}
      </Card>

      {/* Approval Section */}
      {timesheet && timesheet.status !== "draft" && (
        <Card className="p-6">
          <h4 className="m-0 mb-4">Approval Status</h4>
          
          <div className="space-y-3">
            {/* Manager Approval */}
            <div className="flex items-start gap-3">
              {timesheet.status === "submitted" ? (
                <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
              ) : timesheet.managerApprovedAt ? (
                <CheckCircle className="w-5 h-5 text-success mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-muted-foreground mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-medium m-0">Manager Approval</p>
                {timesheet.managerApprovedAt ? (
                  <p className="text-sm text-muted-foreground m-0">
                    Approved by {timesheet.managerApprovedBy} on {timesheet.managerApprovedAt}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground m-0">
                    {timesheet.status === "submitted" ? "Pending review" : "Not yet submitted"}
                  </p>
                )}
              </div>
            </div>

            {/* Finance Approval */}
            <div className="flex items-start gap-3">
              {timesheet.status === "manager_approved" ? (
                <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
              ) : timesheet.financeApprovedAt ? (
                <CheckCircle className="w-5 h-5 text-success mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-muted-foreground mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-medium m-0">Finance Approval</p>
                {timesheet.financeApprovedAt ? (
                  <p className="text-sm text-muted-foreground m-0">
                    Approved by {timesheet.financeApprovedBy} on {timesheet.financeApprovedAt}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground m-0">
                    {timesheet.status === "manager_approved" ? "Pending review" : "Awaiting manager approval"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Rejection Info */}
          {timesheet.status === "rejected" && timesheet.rejectionReason && (
            <Card className="p-4 bg-destructive/5 border-destructive mt-4">
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-destructive mt-0.5" />
                <div>
                  <p className="font-medium m-0 mb-1">Rejected</p>
                  <p className="text-sm text-muted-foreground m-0">
                    By {timesheet.rejectedBy} on {timesheet.rejectedAt}
                  </p>
                  <p className="text-sm mt-2 m-0">{timesheet.rejectionReason}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Approval/Reject Actions */}
          {canApprove && (
            <div className="mt-6 space-y-4">
              <Button className="w-full" onClick={handleApprove}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve Timesheet
              </Button>
              
              <div className="space-y-2">
                <Label>Or reject with reason:</Label>
                <Textarea
                  placeholder="Reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={handleReject}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject Timesheet
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

// Example: Worker View
export function WorkerTimesheetExample() {
  const draftTimesheet: Timesheet = {
    id: "ts-001",
    workerId: "sarah-chen",
    workerName: "Sarah Chen",
    weekStart: "Oct 21, 2025",
    weekEnd: "Oct 25, 2025",
    entries: [
      { day: "Monday", date: "Oct 21", hours: 8 },
      { day: "Tuesday", date: "Oct 22", hours: 8 },
      { day: "Wednesday", date: "Oct 23", hours: 8 },
      { day: "Thursday", date: "Oct 24", hours: 8 },
      { day: "Friday", date: "Oct 25", hours: 8 },
    ],
    totalHours: 40,
    status: "draft"
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <TimesheetManagement timesheet={draftTimesheet} viewMode="worker" />
    </div>
  );
}

// Example: Manager View
export function ManagerTimesheetExample() {
  const submittedTimesheet: Timesheet = {
    id: "ts-001",
    workerId: "sarah-chen",
    workerName: "Sarah Chen",
    weekStart: "Oct 21, 2025",
    weekEnd: "Oct 25, 2025",
    entries: [
      { day: "Monday", date: "Oct 21", hours: 8 },
      { day: "Tuesday", date: "Oct 22", hours: 8 },
      { day: "Wednesday", date: "Oct 23", hours: 8 },
      { day: "Thursday", date: "Oct 24", hours: 8 },
      { day: "Friday", date: "Oct 25", hours: 8 },
    ],
    totalHours: 40,
    status: "submitted",
    submittedAt: "Oct 25, 2025"
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <TimesheetManagement timesheet={submittedTimesheet} viewMode="manager" />
    </div>
  );
}

// Example: Finance View
export function FinanceTimesheetExample() {
  const managerApprovedTimesheet: Timesheet = {
    id: "ts-001",
    workerId: "sarah-chen",
    workerName: "Sarah Chen",
    weekStart: "Oct 21, 2025",
    weekEnd: "Oct 25, 2025",
    entries: [
      { day: "Monday", date: "Oct 21", hours: 8 },
      { day: "Tuesday", date: "Oct 22", hours: 8 },
      { day: "Wednesday", date: "Oct 23", hours: 8 },
      { day: "Thursday", date: "Oct 24", hours: 8 },
      { day: "Friday", date: "Oct 25", hours: 8 },
    ],
    totalHours: 40,
    status: "manager_approved",
    submittedAt: "Oct 25, 2025",
    managerApprovedAt: "Oct 25, 2025",
    managerApprovedBy: "Alex Martinez"
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <TimesheetManagement timesheet={managerApprovedTimesheet} viewMode="finance" />
    </div>
  );
}
