import React, { useState, useEffect } from 'react';
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Copy, Calendar, Users, CheckCircle2, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { cn } from "../ui/utils";
import type { Person } from "../../types/people";
import type { TimesheetEntry } from "../../utils/api/timesheets";

interface ApplyToOthersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templatePerson: Person;
  templateDate: Date;
  templateEntries: TimesheetEntry[];
  allPeople: Person[];
  onApply: (params: {
    targetPersonIds: string[];
    dateRangeType: 'day' | 'week' | 'month';
    overwriteExisting: boolean;
  }) => Promise<void>;
}

export function ApplyToOthersDialog({
  open,
  onOpenChange,
  templatePerson,
  templateDate,
  templateEntries,
  allPeople,
  onApply,
}: ApplyToOthersDialogProps) {
  const [selectedPersonIds, setSelectedPersonIds] = useState<Set<string>>(new Set());
  const [dateRangeType, setDateRangeType] = useState<'day' | 'week' | 'month'>('day');
  const [overwriteExisting, setOverwriteExisting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter out the template person from the list
  // ✅ CHANGED: Allow same person to be selected for date range copying
  // Use case: Copy Monday's data to Tue-Sun for the same person
  const availablePeople = allPeople; // Don't filter out template person anymore

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      // ✅ AUTO-SELECT: If only one person is available, automatically check them
      if (availablePeople.length === 1) {
        setSelectedPersonIds(new Set([availablePeople[0].id]));
      } else {
        setSelectedPersonIds(new Set());
      }
      setDateRangeType('day');
      setOverwriteExisting(false);
    }
  }, [open, availablePeople]);

  // Calculate totals
  const totalHours = templateEntries.reduce((sum, e) => sum + e.hours, 0);
  const totalTasks = templateEntries.length;

  // Calculate date range
  const getDateRange = (): Date[] => {
    if (dateRangeType === 'day') {
      return [templateDate];
    }

    if (dateRangeType === 'week') {
      // Week: From today to end of current month
      const year = templateDate.getFullYear();
      const month = templateDate.getMonth();
      const lastDayOfMonth = new Date(year, month + 1, 0);
      const currentDay = templateDate.getDate();
      const lastDay = lastDayOfMonth.getDate();
      
      const dates: Date[] = [];
      for (let day = currentDay; day <= lastDay; day++) {
        dates.push(new Date(year, month, day));
      }
      return dates;
    }

    // Month: Full month (1st to last day)
    const year = templateDate.getFullYear();
    const month = templateDate.getMonth();
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    return Array.from({ length: daysInMonth }, (_, i) => {
      return new Date(year, month, i + 1);
    });
  };

  const dateRange = getDateRange();
  const numDays = dateRange.length;
  const numPeople = selectedPersonIds.size;
  const totalEntries = numPeople * numDays;

  const formatDate = (date: Date, format: 'short' | 'long' = 'long') => {
    if (format === 'short') {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateRange = (): string => {
    if (dateRange.length === 1) {
      return formatDate(dateRange[0], 'short');
    }
    return `${formatDate(dateRange[0], 'short')} - ${formatDate(dateRange[dateRange.length - 1], 'short')}`;
  };

  // Calculate specific date ranges for display (independent of selection)
  const getRestOfMonthRange = (): string => {
    const year = templateDate.getFullYear();
    const month = templateDate.getMonth();
    const lastDayOfMonth = new Date(year, month + 1, 0);
    if (templateDate.getDate() === lastDayOfMonth.getDate()) {
      // If it's the last day, just show that day
      return formatDate(templateDate, 'short');
    }
    return `${formatDate(templateDate, 'short')} - ${formatDate(lastDayOfMonth, 'short')}`;
  };

  const getFullMonthRange = (): string => {
    const year = templateDate.getFullYear();
    const month = templateDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return `${formatDate(firstDay, 'short')} - ${formatDate(lastDay, 'short')}`;
  };

  const handleTogglePerson = (personId: string) => {
    const newSelection = new Set(selectedPersonIds);
    if (newSelection.has(personId)) {
      newSelection.delete(personId);
    } else {
      newSelection.add(personId);
    }
    setSelectedPersonIds(newSelection);
  };

  const handleSelectAll = () => {
    setSelectedPersonIds(new Set(availablePeople.map(p => p.id)));
  };

  const handleClearAll = () => {
    setSelectedPersonIds(new Set());
  };

  const handleApply = async () => {
    setIsSubmitting(true);
    try {
      console.log('🚀 DIALOG: Applying timesheet with params:', {
        targetPersonIds: Array.from(selectedPersonIds),
        dateRangeType,
        overwriteExisting,
        templatePerson: templatePerson.id,
        templateDate: templateDate.toISOString(),
      });
      
      await onApply({
        targetPersonIds: Array.from(selectedPersonIds),
        dateRangeType,
        overwriteExisting,
      });
      
      console.log('✅ DIALOG: Apply completed successfully');
      onOpenChange(false);
    } catch (error) {
      console.error('❌ DIALOG: Failed to apply timesheet:', error);
      // Re-throw so the parent can handle it
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col gap-0">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-2">
            <Copy className="w-5 h-5 text-accent-brand" />
            Apply Timesheet to Other Employees
          </DialogTitle>
          <DialogDescription>
            Copy this timesheet to multiple employees at once
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto -mx-6 px-6 min-h-0">
          <div className="space-y-6 pb-4">
            {/* Template Summary */}
            <div className="bg-accent/5 border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="font-medium">
                  📋 Template
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent-brand/10 flex items-center justify-center font-medium text-accent-brand">
                  {templatePerson.initials}
                </div>
                <div>
                  <div className="font-medium">{templatePerson.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(templateDate, 'short')}
                  </div>
                </div>
              </div>
              <div className="pt-2 space-y-1">
                {templateEntries.map((entry, index) => (
                  <div key={entry.id || index} className="text-sm flex items-center gap-2">
                    <span className="text-muted-foreground">•</span>
                    <span className="font-medium">{entry.hours}h</span>
                    <span className="text-muted-foreground">{entry.projectId || 'Development'}</span>
                    {entry.notes && (
                      <span className="text-muted-foreground text-xs italic">
                        "{entry.notes.length > 40 ? entry.notes.substring(0, 40) + '...' : entry.notes}"
                      </span>
                    )}
                  </div>
                ))}
                <div className="pt-1 text-sm font-medium text-accent-brand">
                  Total: {totalHours}h · {totalTasks} {totalTasks === 1 ? 'task' : 'tasks'}
                </div>
              </div>
            </div>

            {/* Employee Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">
                  <Users className="w-4 h-4 inline mr-2" />
                  Select Employees
                </Label>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSelectAll}
                    className="h-8 text-xs"
                  >
                    Select All
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAll}
                    className="h-8 text-xs"
                    disabled={selectedPersonIds.size === 0}
                  >
                    Clear
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg">
                <ScrollArea className="h-[200px] p-3">
                  {availablePeople.length > 0 ? (
                    <div className="space-y-2">
                      {availablePeople.map((person) => (
                        <div
                          key={person.id}
                          className={cn(
                            "flex items-center gap-3 p-2 rounded-md hover:bg-accent/5 cursor-pointer apple-transition",
                            selectedPersonIds.has(person.id) && "bg-accent/10"
                          )}
                          onClick={() => handleTogglePerson(person.id)}
                        >
                          <Checkbox
                            checked={selectedPersonIds.has(person.id)}
                            onCheckedChange={() => handleTogglePerson(person.id)}
                          />
                          <div className="w-8 h-8 rounded-full bg-accent-brand/10 flex items-center justify-center text-sm font-medium text-accent-brand">
                            {person.initials}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">{person.name}</div>
                            {person.role && (
                              <div className="text-xs text-muted-foreground">{person.role}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No other employees available
                    </div>
                  )}
                </ScrollArea>
              </div>

              {selectedPersonIds.size > 0 && (
                <div className="text-sm text-muted-foreground">
                  {selectedPersonIds.size} {selectedPersonIds.size === 1 ? 'employee' : 'employees'} selected
                </div>
              )}
            </div>

            {/* Date Range Selection */}
            <div className="space-y-3">
              <Label className="text-base font-medium">
                <Calendar className="w-4 h-4 inline mr-2" />
                Date Range
              </Label>
              <RadioGroup value={dateRangeType} onValueChange={(v) => setDateRangeType(v as 'day' | 'week' | 'month')}>
                <div 
                  className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent/5 cursor-pointer"
                  onClick={() => setDateRangeType('day')}
                >
                  <RadioGroupItem value="day" id="day" />
                  <Label htmlFor="day" className="flex-1 cursor-pointer">
                    <div className="font-medium">This day only</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(templateDate, 'short')}
                    </div>
                  </Label>
                </div>
                <div 
                  className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent/5 cursor-pointer"
                  onClick={() => setDateRangeType('week')}
                >
                  <RadioGroupItem value="week" id="week" />
                  <Label htmlFor="week" className="flex-1 cursor-pointer">
                    <div className="font-medium">Rest of month</div>
                    <div className="text-sm text-muted-foreground">
                      {getRestOfMonthRange()}
                    </div>
                  </Label>
                </div>
                <div 
                  className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent/5 cursor-pointer"
                  onClick={() => setDateRangeType('month')}
                >
                  <RadioGroupItem value="month" id="month" />
                  <Label htmlFor="month" className="flex-1 cursor-pointer">
                    <div className="font-medium">This month</div>
                    <div className="text-sm text-muted-foreground">
                      {getFullMonthRange()}
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Preview Summary */}
            {selectedPersonIds.size > 0 && (
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="flex-1 space-y-2">
                    <div className="font-medium text-blue-900 dark:text-blue-100">
                      Preview
                    </div>
                    <div className="text-sm text-blue-800 dark:text-blue-200">
                      Will create <span className="font-semibold">{totalEntries}</span> timesheet {totalEntries === 1 ? 'entry' : 'entries'}
                    </div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">
                      {numPeople} {numPeople === 1 ? 'employee' : 'employees'} × {numDays} {numDays === 1 ? 'day' : 'days'} × {totalHours}h
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Conflict Warning (always shown for transparency) */}
            <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div className="flex-1 space-y-3">
                  <div>
                    <div className="font-medium text-yellow-900 dark:text-yellow-100 mb-1">
                      If entries already exist
                    </div>
                    <div className="text-sm text-yellow-800 dark:text-yellow-200">
                      Some employees may already have entries for these dates
                    </div>
                  </div>
                  <RadioGroup 
                    value={overwriteExisting ? 'overwrite' : 'skip'} 
                    onValueChange={(v) => setOverwriteExisting(v === 'overwrite')}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="skip" id="skip" />
                      <Label htmlFor="skip" className="text-sm cursor-pointer text-yellow-900 dark:text-yellow-100">
                        Skip existing entries (safer)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="overwrite" id="overwrite" />
                      <Label htmlFor="overwrite" className="text-sm cursor-pointer text-yellow-900 dark:text-yellow-100">
                        Overwrite existing entries
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            disabled={selectedPersonIds.size === 0 || isSubmitting}
            className="gap-2"
          >
            <Copy className="w-4 h-4" />
            {isSubmitting ? 'Applying...' : `Apply to ${selectedPersonIds.size || 0} ${selectedPersonIds.size === 1 ? 'person' : 'people'}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}