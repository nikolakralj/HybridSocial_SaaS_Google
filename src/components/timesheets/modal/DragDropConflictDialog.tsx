import { useState } from "react";
import { AlertTriangle, Copy, Users, Calendar, ArrowRight, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Label } from "../../ui/label";
import { Separator } from "../../ui/separator";
import { ScrollArea } from "../../ui/scroll-area";
import { cn } from "../../ui/utils";

export interface DraggedData {
  sourceDate: Date;
  targetDate: Date;
  entries: {
    personId: string;
    personName: string;
    personInitials: string;
    hours: number;
    task: string;
    notes?: string;
  }[];
}

export interface ConflictingEntry {
  personId: string;
  personName: string;
  existingHours: number;
  existingTask: string;
  newHours: number;
  newTask: string;
}

export type ConflictResolution = "replace" | "merge" | "skip";

interface DragDropConflictDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draggedData: DraggedData | null;
  conflicts: ConflictingEntry[];
  onConfirm: (resolution: ConflictResolution, selectedPeopleIds?: Set<string>) => void;
  onCancel: () => void;
}

export function DragDropConflictDialog({
  open,
  onOpenChange,
  draggedData,
  conflicts,
  onConfirm,
  onCancel,
}: DragDropConflictDialogProps) {
  const [resolution, setResolution] = useState<ConflictResolution>("merge");
  const [skipPeopleIds, setSkipPeopleIds] = useState<Set<string>>(new Set());

  if (!draggedData) return null;

  const hasConflicts = conflicts.length > 0;
  const totalEntries = draggedData.entries.length;
  const conflictCount = conflicts.length;
  const cleanEntries = totalEntries - conflictCount;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { 
      weekday: "short",
      month: "short", 
      day: "numeric"
    });
  };

  const handleConfirm = () => {
    if (resolution === "skip") {
      // Skip conflicting people
      const conflictIds = new Set(conflicts.map(c => c.personId));
      onConfirm(resolution, conflictIds);
    } else {
      onConfirm(resolution);
    }
    onOpenChange(false);
  };

  const handleCancel = () => {
    onCancel();
    onOpenChange(false);
  };

  const toggleSkipPerson = (personId: string) => {
    const newSkip = new Set(skipPeopleIds);
    if (newSkip.has(personId)) {
      newSkip.delete(personId);
    } else {
      newSkip.add(personId);
    }
    setSkipPeopleIds(newSkip);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {hasConflicts ? (
              <>
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                Copy Entries - Conflicts Detected
              </>
            ) : (
              <>
                <Copy className="w-5 h-5 text-accent-brand" />
                Confirm Copy Entries
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {hasConflicts ? (
              <>
                {conflictCount} {conflictCount === 1 ? "person" : "people"} already {conflictCount === 1 ? "has" : "have"} entries on the target day. Choose how to handle conflicts.
              </>
            ) : (
              <>
                Copy {totalEntries} {totalEntries === 1 ? "entry" : "entries"} to the target day?
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-6">
            {/* Date Range */}
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{formatDate(draggedData.sourceDate)}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{formatDate(draggedData.targetDate)}</span>
              </div>
              <div className="ml-auto">
                <Badge variant="secondary" className="gap-1.5">
                  <Users className="w-3 h-3" />
                  {totalEntries} {totalEntries === 1 ? "person" : "people"}
                </Badge>
              </div>
            </div>

            {/* Conflict Resolution Options */}
            {hasConflicts && (
              <div>
                <h3 className="font-medium mb-3">How to handle conflicts?</h3>
                <RadioGroup value={resolution} onValueChange={(v) => setResolution(v as ConflictResolution)}>
                  <div className="space-y-3">
                    {/* Replace */}
                    <div className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent/5 apple-transition cursor-pointer">
                      <RadioGroupItem value="replace" id="replace" className="mt-1" />
                      <Label htmlFor="replace" className="flex-1 cursor-pointer">
                        <div className="font-medium mb-1">Replace existing entries</div>
                        <div className="text-sm text-muted-foreground">
                          Delete existing entries and create new ones ({conflictCount} {conflictCount === 1 ? "person" : "people"} affected)
                        </div>
                      </Label>
                    </div>

                    {/* Merge */}
                    <div className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent/5 apple-transition cursor-pointer">
                      <RadioGroupItem value="merge" id="merge" className="mt-1" />
                      <Label htmlFor="merge" className="flex-1 cursor-pointer">
                        <div className="font-medium mb-1">Merge entries (add hours)</div>
                        <div className="text-sm text-muted-foreground">
                          Keep existing entries and add new ones as separate tasks ({conflictCount} {conflictCount === 1 ? "person will" : "people will"} have multiple entries)
                        </div>
                      </Label>
                    </div>

                    {/* Skip */}
                    <div className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent/5 apple-transition cursor-pointer">
                      <RadioGroupItem value="skip" id="skip" className="mt-1" />
                      <Label htmlFor="skip" className="flex-1 cursor-pointer">
                        <div className="font-medium mb-1">Skip conflicting people</div>
                        <div className="text-sm text-muted-foreground">
                          Only copy entries for people without existing entries ({cleanEntries} {cleanEntries === 1 ? "person" : "people"} will be copied)
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            )}

            <Separator />

            {/* Conflicts Table */}
            {hasConflicts && (
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  Conflicting Entries ({conflictCount})
                </h3>
                <div className="space-y-2">
                  {conflicts.map((conflict) => (
                    <div
                      key={conflict.personId}
                      className="border rounded-lg p-3 bg-yellow-50/50"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium mb-2">{conflict.personName}</p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground mb-1">Existing:</p>
                              <p className="font-medium">{conflict.existingHours}h · {conflict.existingTask}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground mb-1">New:</p>
                              <p className="font-medium text-accent-brand">{conflict.newHours}h · {conflict.newTask}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Clean Entries (No Conflicts) */}
            {cleanEntries > 0 && (
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  {hasConflicts ? `Clean Entries (${cleanEntries})` : `Entries to Copy (${cleanEntries})`}
                </h3>
                <div className="space-y-2">
                  {draggedData.entries
                    .filter(entry => !conflicts.some(c => c.personId === entry.personId))
                    .map((entry) => (
                      <div
                        key={entry.personId}
                        className={cn(
                          "border rounded-lg p-3",
                          hasConflicts ? "bg-green-50/50" : "bg-muted/50"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent-brand/10 flex items-center justify-center text-sm font-medium text-accent-brand">
                            {entry.personInitials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium">{entry.personName}</p>
                            <p className="text-sm text-muted-foreground">
                              {entry.hours}h · {entry.task}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="gap-2">
            <Copy className="w-4 h-4" />
            {hasConflicts 
              ? resolution === "replace" 
                ? `Replace & Copy (${totalEntries})`
                : resolution === "merge"
                ? `Merge & Copy (${totalEntries})`
                : `Copy (${cleanEntries})`
              : `Copy (${totalEntries})`
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
