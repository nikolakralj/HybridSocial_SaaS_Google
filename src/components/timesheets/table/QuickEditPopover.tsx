import { useState, useEffect } from "react";
import { Clock, Save, X, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Badge } from "../../ui/badge";
import { cn } from "../../ui/utils";

// TODO: Import project config when implementing project settings
// import type { TimesheetConfig } from "../../../types/project-config";

interface QuickEditPopoverProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
  initialStartTime?: string;
  initialEndTime?: string;
  initialBreakMinutes?: number;
  initialTotalHours?: number;
  onSave: (data: {
    startTime?: string;
    endTime?: string;
    breakMinutes?: number;
    totalHours: number;
  }) => void;
  onDelete?: () => void; // NEW: Optional delete handler
  personName: string;
  date: string;
  // TODO: Add project config prop
  // projectConfig?: TimesheetConfig;
}

export function QuickEditPopover({
  isOpen,
  onOpenChange,
  trigger,
  initialStartTime = "09:00",
  initialEndTime = "17:00",
  initialBreakMinutes = 30,
  initialTotalHours = 0,
  onSave,
  onDelete, // NEW: Accept delete handler
  personName,
  date,
  // TODO: Add project config prop
  // projectConfig,
}: QuickEditPopoverProps) {
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);
  const [breakMinutes, setBreakMinutes] = useState(initialBreakMinutes.toString());
  const [manualHours, setManualHours] = useState(initialTotalHours.toString());
  const [entryMode, setEntryMode] = useState<"hours-first" | "time-first">("time-first");

  // Calculate hours from time inputs
  const calculateHours = () => {
    if (!startTime || !endTime) return 0;

    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    const workMinutes = endMinutes - startMinutes;
    const breakMins = parseInt(breakMinutes) || 0;

    return Math.max(0, (workMinutes - breakMins) / 60);
  };

  // Get total hours based on mode
  const totalHours = entryMode === "time-first" ? calculateHours() : parseFloat(manualHours) || 0;

  // When time inputs change, switch to time-first mode and auto-calculate
  const handleTimeChange = (field: "start" | "end" | "break", value: string) => {
    if (field === "start") setStartTime(value);
    if (field === "end") setEndTime(value);
    if (field === "break") setBreakMinutes(value);
    setEntryMode("time-first");
  };

  // When hours are manually changed, switch to hours-first mode
  const handleHoursChange = (value: string) => {
    setManualHours(value);
    setEntryMode("hours-first");
  };

  const handleSave = () => {
    if (entryMode === "time-first") {
      onSave({
        startTime,
        endTime,
        breakMinutes: parseInt(breakMinutes) || 0,
        totalHours,
      });
    } else {
      // Hours-first mode: only save total hours
      onSave({
        totalHours,
      });
    }
    onOpenChange(false);
  };

  const handleCancel = () => {
    // Reset to initial values
    setStartTime(initialStartTime);
    setEndTime(initialEndTime);
    setBreakMinutes(initialBreakMinutes.toString());
    setManualHours(initialTotalHours.toString());
    onOpenChange(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-80" align="start" side="right" sideOffset={8}>
        <div className="space-y-4">
          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent-brand" />
              <h4 className="font-medium">Quick Time Edit</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              {personName} · {new Date(date).toLocaleDateString()}
            </p>
          </div>

          {/* Total Hours Input */}
          <div className="space-y-1.5">
            <Label htmlFor="manual-hours" className="text-xs flex items-center gap-2">
              Total Hours
              {entryMode === "time-first" && (
                <Badge variant="secondary" className="text-xs py-0 h-4">
                  Auto
                </Badge>
              )}
            </Label>
            <Input
              id="manual-hours"
              type="number"
              min="0"
              max="24"
              step="0.25"
              value={entryMode === "time-first" ? totalHours.toFixed(2) : manualHours}
              onChange={(e) => handleHoursChange(e.target.value)}
              onFocus={() => {
                // When user clicks to edit hours, switch to hours-first mode
                if (entryMode === "time-first") {
                  setManualHours(totalHours.toFixed(2));
                  setEntryMode("hours-first");
                }
              }}
              className={cn(
                "h-9",
                entryMode === "time-first" && "bg-gray-50 text-gray-600 cursor-pointer"
              )}
              placeholder="8"
            />
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className={cn(
                "px-2 transition-colors",
                entryMode === "time-first" ? "bg-background text-foreground" : "bg-background text-muted-foreground"
              )}>
                {entryMode === "hours-first" ? "or add time details (optional)" : "Time Details"}
              </span>
            </div>
          </div>

          {/* Time Inputs */}
          <div className={cn(
            "space-y-3 transition-opacity",
            entryMode === "hours-first" && "opacity-60"
          )}>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="start-time" className="text-xs">
                  Start Time
                </Label>
                <Input
                  id="start-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => handleTimeChange("start", e.target.value)}
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="end-time" className="text-xs">
                  End Time
                </Label>
                <Input
                  id="end-time"
                  type="time"
                  value={endTime}
                  onChange={(e) => handleTimeChange("end", e.target.value)}
                  className="h-9"
                />
              </div>
            </div>

            {/* Break Input */}
            <div className="space-y-1.5">
              <Label htmlFor="break-time" className="text-xs">
                Break (minutes)
              </Label>
              <Input
                id="break-time"
                type="number"
                min="0"
                step="15"
                value={breakMinutes}
                onChange={(e) => handleTimeChange("break", e.target.value)}
                className="h-9"
                placeholder="30"
              />
            </div>
          </div>

          {/* Summary Badge */}
          {entryMode === "time-first" && startTime && endTime && (
            <div className="flex items-center gap-2 p-2 bg-blue-50/50 dark:bg-blue-950/20 rounded text-xs border border-blue-200 dark:border-blue-800">
              <span className="text-blue-900 dark:text-blue-100">
                {startTime} - {endTime} 
                {parseInt(breakMinutes) > 0 && ` (${breakMinutes}m break)`} = {totalHours.toFixed(1)}h
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm" className="flex-1 gap-1.5">
              <Save className="w-3.5 h-3.5" />
              Save
            </Button>
            {onDelete && (
              <Button
                onClick={onDelete}
                size="sm"
                variant="outline"
                className="gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </Button>
            )}
            <Button
              onClick={handleCancel}
              size="sm"
              variant="outline"
              className="gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              Cancel
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}