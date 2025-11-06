import { useState } from "react";
import {
  X,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MessageSquare,
  FileText,
  DollarSign,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Textarea } from "../../ui/textarea";
import { Avatar, AvatarFallback } from "../../ui/avatar";
import { ScrollArea } from "../../ui/scroll-area";
import { Separator } from "../../ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import type { TimesheetStatus } from "./PersonPeriodCard";

interface TimesheetEntry {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  hours: number;
  task?: string;
  category?: string;
  notes?: string;
  status: TimesheetStatus;
}

interface DayGroup {
  date: Date;
  entries: TimesheetEntry[];
  totalHours: number;
  isWeekend: boolean;
  isHoliday: boolean;
  status: TimesheetStatus;
}

interface Person {
  id: string;
  name: string;
  initials: string;
  role: string;
  company?: string;
}

interface Contract {
  id: string;
  rate: number;
  currency: string;
  dailyCap?: number;
  weeklyCap?: number;
  monthlyCap?: number;
  validFrom: Date;
  validTo: Date;
  poNumber?: string;
  costCenter?: string;
}

interface AuditEntry {
  id: string;
  action: "submit" | "approve" | "reject" | "request-changes" | "recall" | "amend";
  byUser: string;
  byUserRole: string;
  at: Date;
  comment?: string;
  previousVersion?: any;
}

interface ReviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  people: Person[];
  periodStart: Date;
  periodEnd: Date;
  dayGroups: DayGroup[];
  contract?: Contract;
  auditTrail: AuditEntry[];
  attachments?: string[];
  onApproveAll: (comment?: string) => void;
  onRejectAll: (reason: string) => void;
  onRequestChanges: (comment: string, checklist?: string[]) => void;
  onApproveDay: (date: Date) => void;
  onRejectDay: (date: Date, reason: string) => void;
  onApproveEntry: (entryId: string) => void;
  onRejectEntry: (entryId: string, reason: string) => void;
  showCost?: boolean;
  slaDueAt?: Date;
}

export function ReviewDrawer({
  isOpen,
  onClose,
  people,
  periodStart,
  periodEnd,
  dayGroups,
  contract,
  auditTrail,
  attachments = [],
  onApproveAll,
  onRejectAll,
  onRequestChanges,
  onApproveDay,
  onRejectDay,
  onApproveEntry,
  onRejectEntry,
  showCost = true,
  slaDueAt,
}: ReviewDrawerProps) {
  const [activeTab, setActiveTab] = useState<"entries" | "audit" | "contract">("entries");
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());
  const [comment, setComment] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showRequestChangesDialog, setShowRequestChangesDialog] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { 
      weekday: "short", 
      month: "short", 
      day: "numeric" 
    });
  };

  const formatPeriod = () => {
    return `${periodStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${periodEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  };

  const toggleDayExpansion = (date: Date) => {
    const dateKey = date.toISOString();
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(dateKey)) {
      newExpanded.delete(dateKey);
    } else {
      newExpanded.add(dateKey);
    }
    setExpandedDays(newExpanded);
  };

  const totalHours = dayGroups.reduce((sum, day) => sum + day.totalHours, 0);
  const totalCost = contract ? totalHours * contract.rate : 0;

  // Calculate SLA countdown
  const getSLADisplay = () => {
    if (!slaDueAt) return null;
    const now = new Date();
    const timeUntilDue = slaDueAt.getTime() - now.getTime();
    const hoursUntilDue = timeUntilDue / (1000 * 60 * 60);

    if (hoursUntilDue < 0) {
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="w-3 h-3" />
          Overdue by {Math.abs(Math.floor(hoursUntilDue))}h
        </Badge>
      );
    } else if (hoursUntilDue < 24) {
      return (
        <Badge variant="secondary" className="bg-amber-100 text-amber-700 gap-1">
          <Clock className="w-3 h-3" />
          Due in {Math.round(hoursUntilDue)}h
        </Badge>
      );
    } else {
      const days = Math.ceil(hoursUntilDue / 24);
      return (
        <Badge variant="outline">
          {days} day{days > 1 ? 's' : ''} remaining
        </Badge>
      );
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl h-[90vh] p-0 gap-0">
          {/* Header */}
          <DialogHeader className="p-6 pb-4 border-b">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DialogTitle className="text-xl mb-2">Review Timesheet</DialogTitle>
                <DialogDescription className="space-y-2">
                  {/* People chips */}
                  <div className="flex flex-wrap gap-2">
                    {people.map(person => (
                      <div
                        key={person.id}
                        className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full"
                      >
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                            {person.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-foreground">{person.name}</span>
                        {person.company && (
                          <span className="text-xs text-muted-foreground">· {person.company}</span>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Period & Status Row */}
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatPeriod()}</span>
                    </div>
                    {getSLADisplay()}
                  </div>
                </DialogDescription>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="ml-4"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Total Hours</p>
                <p className="text-2xl font-semibold">{totalHours.toFixed(1)}h</p>
              </div>
              {showCost && contract && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Total Cost</p>
                  <p className="text-2xl font-semibold">${totalCost.toLocaleString()}</p>
                </div>
              )}
            </div>
          </DialogHeader>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="h-full flex flex-col">
              <TabsList className="w-full justify-start rounded-none border-b px-6">
                <TabsTrigger value="entries" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Entries ({dayGroups.length} days)
                </TabsTrigger>
                <TabsTrigger value="audit" className="gap-2">
                  <Clock className="w-4 h-4" />
                  Audit Trail ({auditTrail.length})
                </TabsTrigger>
                {contract && (
                  <TabsTrigger value="contract" className="gap-2">
                    <DollarSign className="w-4 h-4" />
                    Contract
                  </TabsTrigger>
                )}
              </TabsList>

              {/* Entries Tab */}
              <TabsContent value="entries" className="flex-1 m-0 overflow-auto">
                <ScrollArea className="h-full">
                  <div className="p-6 space-y-3">
                    {dayGroups.map((day) => {
                      const isExpanded = expandedDays.has(day.date.toISOString());
                      const hasFlags = day.isWeekend || day.isHoliday || day.entries.some(e => !e.task);

                      return (
                        <div key={day.date.toISOString()} className="border rounded-lg">
                          {/* Day Header */}
                          <button
                            onClick={() => toggleDayExpansion(day.date)}
                            className="w-full p-4 flex items-center justify-between hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                                <span className="font-semibold text-sm">
                                  {day.date.getDate()}
                                </span>
                              </div>
                              <div className="text-left">
                                <p className="font-medium">{formatDate(day.date)}</p>
                                <p className="text-sm text-muted-foreground">
                                  {day.totalHours.toFixed(1)}h · {day.entries.length} {day.entries.length === 1 ? 'entry' : 'entries'}
                                </p>
                              </div>
                              {hasFlags && (
                                <div className="flex items-center gap-1">
                                  {day.isWeekend && <Badge variant="outline" className="text-xs">Weekend</Badge>}
                                  {day.isHoliday && <Badge variant="outline" className="text-xs">Holiday</Badge>}
                                  {day.entries.some(e => !e.task) && (
                                    <Badge variant="outline" className="text-xs text-amber-600">Missing task</Badge>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {day.status === "approved" ? (
                                <Badge variant="secondary" className="bg-green-100 text-green-700">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Approved
                                </Badge>
                              ) : day.status === "rejected" ? (
                                <Badge variant="destructive">
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Rejected
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="bg-blue-100 text-blue-700">Pending</Badge>
                              )}
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </div>
                          </button>

                          {/* Day Details (Expanded) */}
                          {isExpanded && (
                            <div className="border-t">
                              <div className="p-4 space-y-2">
                                {day.entries.map((entry) => (
                                  <div
                                    key={entry.id}
                                    className="flex items-start justify-between p-3 bg-muted/30 rounded-lg"
                                  >
                                    <div className="flex-1 space-y-1">
                                      <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm font-medium">
                                          {entry.startTime} - {entry.endTime}
                                        </span>
                                        <Badge variant="outline" className="text-xs">
                                          {entry.hours.toFixed(1)}h
                                        </Badge>
                                        {entry.breakMinutes > 0 && (
                                          <span className="text-xs text-muted-foreground">
                                            ({entry.breakMinutes}min break)
                                          </span>
                                        )}
                                      </div>
                                      {entry.task && (
                                        <p className="text-sm text-muted-foreground pl-6">
                                          {entry.task}
                                        </p>
                                      )}
                                      {entry.category && (
                                        <Badge variant="outline" className="text-xs ml-6">
                                          {entry.category}
                                        </Badge>
                                      )}
                                      {entry.notes && (
                                        <p className="text-sm text-muted-foreground pl-6 italic">
                                          "{entry.notes}"
                                        </p>
                                      )}
                                    </div>

                                    {entry.status !== "approved" && (
                                      <div className="flex items-center gap-1 ml-4">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => onApproveEntry(entry.id)}
                                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                        >
                                          <CheckCircle2 className="w-4 h-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => {
                                            const reason = prompt("Reason for rejecting this entry:");
                                            if (reason) onRejectEntry(entry.id, reason);
                                          }}
                                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                          <XCircle className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>

                              {/* Day Actions */}
                              {day.status !== "approved" && (
                                <div className="flex items-center justify-end gap-2 p-4 pt-0">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onApproveDay(day.date)}
                                    className="border-green-600 text-green-700 hover:bg-green-50"
                                  >
                                    <CheckCircle2 className="w-4 h-4 mr-1" />
                                    Approve Day
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const reason = prompt("Reason for rejecting this day:");
                                      if (reason) onRejectDay(day.date, reason);
                                    }}
                                    className="border-red-600 text-red-700 hover:bg-red-50"
                                  >
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Reject Day
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* Audit Trail Tab */}
              <TabsContent value="audit" className="flex-1 m-0 overflow-auto">
                <ScrollArea className="h-full">
                  <div className="p-6">
                    <div className="space-y-4">
                      {auditTrail.map((entry) => (
                        <div key={entry.id} className="flex gap-4">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{entry.byUser}</span>
                              <Badge variant="outline" className="text-xs">{entry.byUserRole}</Badge>
                              <span className="text-xs text-muted-foreground">
                                {entry.at.toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">
                              {entry.action === "submit" && "Submitted timesheet for review"}
                              {entry.action === "approve" && "Approved timesheet"}
                              {entry.action === "reject" && "Rejected timesheet"}
                              {entry.action === "request-changes" && "Requested changes"}
                              {entry.action === "recall" && "Recalled submission"}
                              {entry.action === "amend" && "Amended approved timesheet (v2 created)"}
                            </p>
                            {entry.comment && (
                              <p className="text-sm p-2 bg-muted rounded italic">
                                "{entry.comment}"
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* Contract Tab */}
              {contract && (
                <TabsContent value="contract" className="flex-1 m-0 overflow-auto">
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Hourly Rate</p>
                        <p className="text-2xl font-semibold">
                          ${contract.rate}/{contract.currency}
                        </p>
                      </div>
                      {contract.dailyCap && (
                        <div className="p-4 border rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">Daily Cap</p>
                          <p className="text-2xl font-semibold">{contract.dailyCap}h</p>
                        </div>
                      )}
                      {contract.weeklyCap && (
                        <div className="p-4 border rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">Weekly Cap</p>
                          <p className="text-2xl font-semibold">{contract.weeklyCap}h</p>
                        </div>
                      )}
                      {contract.monthlyCap && (
                        <div className="p-4 border rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">Monthly Cap</p>
                          <p className="text-2xl font-semibold">{contract.monthlyCap}h</p>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <p className="text-sm font-semibold">Contract Period</p>
                      <p className="text-sm text-muted-foreground">
                        {contract.validFrom.toLocaleDateString()} - {contract.validTo.toLocaleDateString()}
                      </p>
                    </div>

                    {(contract.poNumber || contract.costCenter) && (
                      <>
                        <Separator />
                        <div className="grid grid-cols-2 gap-4">
                          {contract.poNumber && (
                            <div>
                              <p className="text-sm font-semibold mb-1">PO Number</p>
                              <p className="text-sm text-muted-foreground">{contract.poNumber}</p>
                            </div>
                          )}
                          {contract.costCenter && (
                            <div>
                              <p className="text-sm font-semibold mb-1">Cost Center</p>
                              <p className="text-sm text-muted-foreground">{contract.costCenter}</p>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>

          {/* Footer Actions */}
          <div className="border-t p-6 space-y-3">
            {/* Comment Input */}
            <Textarea
              placeholder="Add a comment (optional)..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[60px]"
            />

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  onApproveAll(comment || undefined);
                  setComment("");
                }}
                className="flex-1 bg-green-600 hover:bg-green-700 gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve All
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowRequestChangesDialog(true)}
                className="flex-1 gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Request Changes
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowRejectDialog(true)}
                className="gap-2 border-red-600 text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
              >
                <XCircle className="w-4 h-4" />
                Reject All
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Timesheet</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejection. The contributor will be notified.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Reason for rejection (required)..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (rejectReason.trim()) {
                  onRejectAll(rejectReason);
                  setRejectReason("");
                  setShowRejectDialog(false);
                  onClose();
                }
              }}
              disabled={!rejectReason.trim()}
            >
              Reject Timesheet
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Request Changes Dialog */}
      <Dialog open={showRequestChangesDialog} onOpenChange={setShowRequestChangesDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Changes</DialogTitle>
            <DialogDescription>
              Send timesheet back to contributor with requested changes.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Describe what needs to be changed..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowRequestChangesDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (comment.trim()) {
                  onRequestChanges(comment);
                  setComment("");
                  setShowRequestChangesDialog(false);
                  onClose();
                }
              }}
              disabled={!comment.trim()}
            >
              Send Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
