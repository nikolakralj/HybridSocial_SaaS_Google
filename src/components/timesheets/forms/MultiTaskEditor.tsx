import { useState, useEffect } from 'react';
import { Clock, ChevronDown, ChevronUp, Plus, X, Zap, AlertCircle, CheckCircle2, Trash2, Car, Moon } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Badge } from '../../ui/badge';
import { Switch } from '../../ui/switch';
import { cn } from '../../ui/utils';
import type { TimesheetEntry } from '../../../utils/api/timesheets';
import { format } from 'date-fns';

// Work types with rate multipliers
type WorkType = "regular" | "travel" | "overtime" | "oncall";

interface WorkTypeConfig {
  label: string;
  icon: React.ReactNode;
  rateMultiplier: number;
  description: string;
}

const workTypeConfigs: Record<WorkType, WorkTypeConfig> = {
  regular: {
    label: "Regular Work",
    icon: <Clock className="w-4 h-4" />,
    rateMultiplier: 1.0,
    description: "Standard billable hours"
  },
  travel: {
    label: "Travel Time",
    icon: <Car className="w-4 h-4" />,
    rateMultiplier: 0.5,
    description: "50% of standard rate"
  },
  overtime: {
    label: "Overtime",
    icon: <Zap className="w-4 h-4" />,
    rateMultiplier: 1.5,
    description: "1.5x standard rate"
  },
  oncall: {
    label: "On-Call",
    icon: <Moon className="w-4 h-4" />,
    rateMultiplier: 0.75,
    description: "75% of standard rate"
  }
};

// Task categories
type TaskCategory = "Development" | "Design" | "Meeting" | "Code Review" | "Testing" | "Documentation" | "Planning" | "Bug Fixes" | "Research" | "Travel" | "On-Call Support";

const taskCategories: TaskCategory[] = [
  "Development",
  "Design",
  "Meeting",
  "Code Review",
  "Testing",
  "Documentation",
  "Planning",
  "Bug Fixes",
  "Research",
  "Travel",
  "On-Call Support"
];

interface Task {
  id: string;
  hours: number;
  workType: WorkType;
  taskCategory: TaskCategory;
  task: string;
  notes: string;
  billable: boolean;
  detailsExpanded: boolean;
  entryId?: string;
  // Time tracking fields
  startTime?: string;
  endTime?: string;
  breakMinutes?: number;
  showTimeCalculator?: boolean;
  // Entry mode: "hours-first" when user enters hours, "time-first" when user enters times
  entryMode?: "hours-first" | "time-first";
}

type UserRole = 
  | "individual-contributor"
  | "team-lead"
  | "company-owner"
  | "agency-owner"
  | "client";

interface MultiTaskEditorProps {
  personId: string;
  personName: string;
  date: Date;
  existingEntries?: TimesheetEntry[];
  onSave: (tasks: any[]) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  userRole?: UserRole;
  hourlyRate?: number;
}

export function MultiTaskEditor({
  personId,
  personName,
  date,
  existingEntries = [],
  onSave,
  onCancel,
  isSubmitting = false,
  userRole = "individual-contributor",
  hourlyRate = 75,
}: MultiTaskEditorProps) {
  // Initialize tasks from existing entries
  const initializeTasks = (): Task[] => {
    if (existingEntries.length > 0) {
      console.log('🔄 MultiTaskEditor: Loading entries from database:', existingEntries);
      return existingEntries.map(entry => {
        const task = {
          id: entry.taskId || `task-${Date.now()}-${Math.random()}`,
          hours: entry.hours,
          // ✅ FIX: Load workType from database instead of hardcoding
          workType: (entry.workType || "regular") as WorkType,
          // ✅ FIX: Load taskCategory from database instead of hardcoding
          taskCategory: (entry.taskCategory || "Development") as TaskCategory,
          // ✅ FIX: Load task description from taskDescription field, not projectId
          task: entry.taskDescription || '',
          notes: entry.notes || '',
          // ✅ FIX: Load billable flag from database
          billable: entry.billable ?? true,
          detailsExpanded: false, // Start collapsed by default to save space
          entryId: entry.id,
          // ✅ Load time fields from database if they exist
          startTime: entry.startTime || undefined,
          endTime: entry.endTime || undefined,
          breakMinutes: entry.breakMinutes || 0,
          showTimeCalculator: !!(entry.startTime || entry.endTime), // ✅ Auto-show if times exist
          entryMode: (entry.startTime || entry.endTime) ? "time-first" : "hours-first", // ✅ Detect mode
        };
        console.log('📦 Loaded task from entry:', { 
          entryId: entry.id,
          workType: entry.workType, 
          taskCategory: entry.taskCategory, 
          taskDescription: entry.taskDescription,
          loadedTask: task 
        });
        return task;
      });
    }
    return [{
      id: `task-${Date.now()}`,
      hours: 0,
      workType: "regular",
      taskCategory: "Development",
      task: "",
      notes: "",
      billable: true,
      detailsExpanded: false,
      startTime: undefined,
      endTime: undefined,
      breakMinutes: 0,
      showTimeCalculator: false,
      entryMode: "hours-first",
    }];
  };

  const [tasks, setTasks] = useState<Task[]>(initializeTasks());
  
  // Validation state
  const [validationError, setValidationError] = useState("");
  
  // Role-based visibility
  const canSeeBilling = userRole === "company-owner" || userRole === "agency-owner";
  const showRates = canSeeBilling && hourlyRate;
  const showBreakdown = canSeeBilling;

  // Reset when entries change
  useEffect(() => {
    setTasks(initializeTasks());
    setValidationError("");
  }, [existingEntries.length]);

  // Add new task
  const handleAddTask = () => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      hours: 0,
      workType: "regular",
      taskCategory: "Development",
      task: "",
      notes: "",
      billable: true,
      detailsExpanded: false,
      startTime: undefined,
      endTime: undefined,
      breakMinutes: 0,
      showTimeCalculator: false,
      entryMode: "hours-first",
    };
    setTasks([...tasks, newTask]);
  };

  // Remove task
  const handleRemoveTask = (id: string) => {
    if (tasks.length === 1) {
      // Reset the last task instead of removing
      setTasks([{
        ...tasks[0],
        hours: 0,
        task: "",
        notes: "",
        startTime: undefined,
        endTime: undefined,
        breakMinutes: 0,
        showTimeCalculator: false,
        entryMode: "hours-first",
      }]);
    } else {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  // Update task field
  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    console.log('📝 MultiTaskEditor handleUpdateTask:', { taskId: id, updates });
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
    setValidationError("");
    
    // Auto-calculate hours when time fields change (TIME-FIRST mode)
    if (updates.startTime !== undefined || updates.endTime !== undefined || updates.breakMinutes !== undefined) {
      // Switch to time-first mode
      setTasks(prevTasks => prevTasks.map(t => 
        t.id === id ? { ...t, entryMode: "time-first" } : t
      ));
      
      // Use setTimeout to ensure state is updated first
      setTimeout(() => {
        const task = tasks.find(t => t.id === id);
        const updatedTask = { ...task, ...updates } as Task;
        
        if (updatedTask.startTime && updatedTask.endTime) {
          const [startHour, startMin] = updatedTask.startTime.split(':').map(Number);
          const [endHour, endMin] = updatedTask.endTime.split(':').map(Number);
          
          if (!isNaN(startHour) && !isNaN(endHour)) {
            const startTotalMin = startHour * 60 + (startMin || 0);
            const endTotalMin = endHour * 60 + (endMin || 0);
            
            let workMinutes = endTotalMin - startTotalMin;
            if (workMinutes < 0) workMinutes += 24 * 60;
            
            workMinutes -= (updatedTask.breakMinutes || 0);
            const hours = Math.max(0, workMinutes / 60);
            
            setTasks(prevTasks => prevTasks.map(t => 
              t.id === id ? { ...t, hours: parseFloat(hours.toFixed(2)), entryMode: "time-first" } : t
            ));
          }
        }
      }, 0);
    }
    
    // When hours are manually changed, recalculate END TIME if start time exists
    if (updates.hours !== undefined) {
      setTimeout(() => {
        const task = tasks.find(t => t.id === id);
        const updatedTask = { ...task, ...updates } as Task;
        
        // If we have a start time and hours, calculate new end time
        if (updatedTask.startTime && updatedTask.hours > 0) {
          const [startHour, startMin] = updatedTask.startTime.split(':').map(Number);
          
          if (!isNaN(startHour)) {
            // Calculate end time from start time + hours + break
            const startTotalMin = startHour * 60 + (startMin || 0);
            const workMinutes = updatedTask.hours * 60;
            const breakMinutes = updatedTask.breakMinutes || 0;
            const endTotalMin = startTotalMin + workMinutes + breakMinutes;
            
            const endHour = Math.floor(endTotalMin / 60) % 24;
            const endMin = endTotalMin % 60;
            
            const endTime = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;
            
            setTasks(prevTasks => prevTasks.map(t => 
              t.id === id ? { ...t, endTime, entryMode: "hours-first" } : t
            ));
          }
        } else {
          // No start time, just switch to hours-first mode
          setTasks(prevTasks => prevTasks.map(t => 
            t.id === id ? { ...t, entryMode: "hours-first" } : t
          ));
        }
      }, 0);
    }
  };

  // Auto-fill time calculator when hours are entered
  const handleHoursBlur = (taskId: string, hours: number) => {
    if (hours > 0 && hours <= 24) {
      const task = tasks.find(t => t.id === taskId);
      // Only auto-fill if times aren't already set
      if (task && !task.startTime && !task.endTime) {
        const startHour = 9; // 9 AM
        const endHour = startHour + Math.floor(hours);
        const endMin = Math.round((hours % 1) * 60);
        
        const startTime = `${String(startHour).padStart(2, '0')}:00`;
        const endTimeHour = endHour >= 12 ? endHour : endHour + 12; // Ensure PM
        const endTime = `${String(endTimeHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;
        
        handleUpdateTask(taskId, {
          startTime,
          endTime,
          breakMinutes: 0,
        });
      }
    }
  };

  // Time calculator per task
  const calculateFromTimes = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !task.startTime || !task.endTime) return;
    
    const [startHour, startMin] = task.startTime.split(':').map(Number);
    const [endHour, endMin] = task.endTime.split(':').map(Number);
    
    if (isNaN(startHour) || isNaN(endHour)) return;
    
    const startTotalMin = startHour * 60 + (startMin || 0);
    const endTotalMin = endHour * 60 + (endMin || 0);
    
    let workMinutes = endTotalMin - startTotalMin;
    if (workMinutes < 0) workMinutes += 24 * 60;
    
    workMinutes -= (task.breakMinutes || 0);
    const hours = Math.max(0, workMinutes / 60);
    
    handleUpdateTask(taskId, { hours: parseFloat(hours.toFixed(2)) });
  };

  // Validation
  const validateEntry = (): boolean => {
    const totalHours = tasks.reduce((sum, t) => sum + (t.hours || 0), 0);
    
    if (totalHours === 0) {
      setValidationError("Please enter hours worked");
      return false;
    }
    
    if (totalHours > 24) {
      setValidationError("Total hours cannot exceed 24 in a day");
      return false;
    }
    
    setValidationError("");
    return true;
  };

  // Calculate totals with rates
  const calculateTotals = () => {
    const breakdown = tasks
      .filter(t => t.hours > 0)
      .map(t => {
        const rate = showRates && hourlyRate
          ? hourlyRate * workTypeConfigs[t.workType].rateMultiplier
          : 0;
        const pay = showRates && t.billable ? t.hours * rate : 0;
        return {
          task: t,
          hours: t.hours,
          rate,
          pay,
          billable: t.billable
        };
      });
    
    return {
      totalHours: breakdown.reduce((sum, b) => sum + b.hours, 0),
      totalPay: breakdown.reduce((sum, b) => sum + b.pay, 0),
      breakdown
    };
  };

  const totals = calculateTotals();

  // Handle save
  const handleSave = async () => {
    if (!validateEntry()) return;
    
    const tasksToSave = tasks
      .filter(t => t.hours > 0)
      .map(t => ({
        taskId: t.id,
        hours: t.hours.toString(),
        task: t.task || t.taskCategory,
        notes: t.notes,
        entryId: t.entryId,
        date: format(date, 'yyyy-MM-dd'), // ✅ IMPORTANT: Include date for each task
        // ✅ Save work type and task category
        workType: t.workType,
        taskCategory: t.taskCategory,
        // ✅ FIX: Also need to save taskDescription
        taskDescription: t.task,
        billable: t.billable,
        // Save time tracking data if available
        startTime: t.startTime,
        endTime: t.endTime,
        breakMinutes: t.breakMinutes,
      }));
    
    console.log('💾 MultiTaskEditor handleSave - About to save tasks:', tasksToSave);
    await onSave(tasksToSave);
  };

  const formatDate = (date: Date, short?: boolean) => {
    if (short) {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric' 
      });
    }
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Edit Tasks for {personName}</h4>
          <p className="text-sm text-muted-foreground">
            {formatDate(date)}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        {/* Tasks */}
        <div className="space-y-3">
          {tasks.map((task, index) => (
            <div key={task.id} className="border border-border rounded-lg overflow-hidden">
              {/* Task Header */}
              <div className="p-3 bg-accent/10 space-y-3">
                {tasks.length > 1 && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Task {index + 1}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveTask(task.id)}
                      className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {/* Hours + Work Type */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <Label htmlFor={`hours-${task.id}`} className="text-xs mb-1 flex items-center gap-2">
                      Hours
                    </Label>
                    <Input
                      id={`hours-${task.id}`}
                      type="number"
                      value={task.hours || ""}
                      onChange={(e) => handleUpdateTask(task.id, { hours: parseFloat(e.target.value) || 0 })}
                      onBlur={(e) => handleHoursBlur(task.id, parseFloat(e.target.value) || 0)}
                      placeholder="8"
                      min="0"
                      max="24"
                      step="0.25"
                      autoFocus={index === 0}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`work-type-${task.id}`} className="text-xs mb-1 flex items-center gap-1">
                      Work Type
                      {showBreakdown && (
                        <span className="text-muted-foreground">({workTypeConfigs[task.workType].rateMultiplier}x)</span>
                      )}
                    </Label>
                    <Select 
                      value={task.workType} 
                      onValueChange={(v) => handleUpdateTask(task.id, { workType: v as WorkType })}
                    >
                      <SelectTrigger id={`work-type-${task.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(workTypeConfigs).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              {config.icon}
                              <span>{config.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Show rate if applicable */}
                {showRates && task.hours > 0 && (
                  <div className="flex items-center justify-between p-2 bg-accent/30 rounded text-sm">
                    <div className="text-muted-foreground">
                      {task.hours}h @ ${(hourlyRate * workTypeConfigs[task.workType].rateMultiplier).toFixed(2)}/hr
                    </div>
                    {task.billable ? (
                      <div className="font-semibold text-accent-brand">
                        ${(task.hours * hourlyRate * workTypeConfigs[task.workType].rateMultiplier).toFixed(2)}
                      </div>
                    ) : (
                      <Badge variant="secondary" className="text-xs">Non-billable</Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Time Calculator (OUTSIDE expandable details) */}
              <div className="border-t border-border">
                {task.showTimeCalculator ? (
                  <div className={cn(
                    "p-3 space-y-3 transition-colors",
                    task.entryMode === "time-first" 
                      ? "bg-blue-50/50 dark:bg-blue-950/20" 
                      : "bg-gray-50/50 dark:bg-gray-900/20"
                  )}>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium flex items-center gap-2">
                        <Clock className={cn(
                          "w-4 h-4",
                          task.entryMode === "time-first" 
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-500"
                        )} />
                        Time Details
                        {task.entryMode === "hours-first" && (
                          <span className="text-xs text-muted-foreground font-normal">(optional)</span>
                        )}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUpdateTask(task.id, { showTimeCalculator: false })}
                        className="h-7 px-2 text-xs"
                      >
                        Hide
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label htmlFor={`start-time-${task.id}`} className="text-xs mb-1 block">Start Time</Label>
                        <Input
                          id={`start-time-${task.id}`}
                          type="time"
                          value={task.startTime || ""}
                          onChange={(e) => handleUpdateTask(task.id, { startTime: e.target.value })}
                          className="h-9"
                          placeholder="09:00"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`end-time-${task.id}`} className="text-xs mb-1 block">End Time</Label>
                        <Input
                          id={`end-time-${task.id}`}
                          type="time"
                          value={task.endTime || ""}
                          onChange={(e) => handleUpdateTask(task.id, { endTime: e.target.value })}
                          className="h-9"
                          placeholder="17:00"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`break-${task.id}`} className="text-xs mb-1 block">Break (min)</Label>
                        <Input
                          id={`break-${task.id}`}
                          type="number"
                          value={task.breakMinutes || 0}
                          onChange={(e) => handleUpdateTask(task.id, { breakMinutes: parseInt(e.target.value) || 0 })}
                          className="h-9"
                          min="0"
                          step="15"
                          placeholder="60"
                        />
                      </div>
                    </div>
                    
                    {task.startTime && task.endTime && (
                      <div className="flex items-center gap-2 p-2 bg-blue-100/50 dark:bg-blue-900/20 rounded text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span className="text-blue-900 dark:text-blue-100">
                          {task.startTime} - {task.endTime} 
                          {task.breakMinutes > 0 && ` (${task.breakMinutes}m break)`} = {task.hours}h
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUpdateTask(task.id, { showTimeCalculator: true })}
                    className="w-full text-xs text-muted-foreground hover:text-foreground hover:bg-blue-50/50 dark:hover:bg-blue-950/20 border-b border-border rounded-none h-10 gap-1.5 apple-transition"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Add time details (optional)
                    {(task.startTime || task.endTime) && (
                      <Badge variant="secondary" className="ml-1 text-xs">
                        {task.startTime || "?"} - {task.endTime || "?"}
                      </Badge>
                    )}
                  </Button>
                )}
              </div>

              {/* Expandable Details */}
              <div className="border-t border-border">
                <button
                  onClick={() => handleUpdateTask(task.id, { detailsExpanded: !task.detailsExpanded })}
                  className="w-full p-3 flex items-center justify-between bg-accent/5 hover:bg-accent/10 apple-transition"
                >
                  <span className="text-sm font-medium flex items-center gap-2">
                    {task.detailsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    Add Details
                    {(task.task || task.notes || task.taskCategory !== "Development") && !task.detailsExpanded && (
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    )}
                  </span>
                </button>

                {task.detailsExpanded && (
                  <div className="p-3 space-y-3 border-t border-border">
                    {/* Task Category (MOVED INSIDE expandable details) */}
                    <div>
                      <Label htmlFor={`category-${task.id}`} className="text-xs mb-1">Task Category</Label>
                      <Select 
                        value={task.taskCategory} 
                        onValueChange={(v) => handleUpdateTask(task.id, { taskCategory: v as TaskCategory })}
                      >
                        <SelectTrigger id={`category-${task.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {taskCategories.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Specific Task */}
                    <div>
                      <Label htmlFor={`task-${task.id}`} className="text-xs mb-1">
                        Specific Task <span className="text-muted-foreground">(optional)</span>
                      </Label>
                      <Input
                        id={`task-${task.id}`}
                        value={task.task}
                        onChange={(e) => handleUpdateTask(task.id, { task: e.target.value })}
                        placeholder="e.g., Authentication module, Client site visit..."
                      />
                    </div>

                    {/* Notes */}
                    <div>
                      <Label htmlFor={`notes-${task.id}`} className="text-xs mb-1">
                        Notes <span className="text-muted-foreground">(optional)</span>
                      </Label>
                      <Textarea
                        id={`notes-${task.id}`}
                        value={task.notes}
                        onChange={(e) => handleUpdateTask(task.id, { notes: e.target.value })}
                        placeholder="What did you work on?"
                        rows={2}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Another Task */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddTask}
          className="w-full gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Another Task
        </Button>

        {/* Validation Error */}
        {validationError && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {validationError}
            </p>
          </div>
        )}

        {/* Summary */}
        {totals.totalHours > 0 && (
          <div className="space-y-3">
            {/* Breakdown by work type */}
            {totals.breakdown.length > 1 && (
              <div className="p-3 bg-accent/20 rounded-lg space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Breakdown by Type</p>
                {totals.breakdown.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {workTypeConfigs[item.task.workType].icon}
                      <span>{workTypeConfigs[item.task.workType].label}</span>
                      {item.task.startTime && item.task.endTime && (
                        <span className="text-xs text-muted-foreground">
                          ({item.task.startTime} - {item.task.endTime})
                        </span>
                      )}
                      {!item.billable && showRates && (
                        <Badge variant="secondary" className="text-xs h-5">Non-billable</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground">{item.hours.toFixed(2)}h</span>
                      {showRates && item.billable && item.rate > 0 && (
                        <>
                          <span className="text-muted-foreground">×</span>
                          <span className="text-muted-foreground">${item.rate.toFixed(2)}/hr</span>
                          <span className="text-muted-foreground">=</span>
                          <span className="font-medium">${item.pay.toFixed(2)}</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Total */}

          </div>
        )}

        {/* Tips */}
        {userRole === "individual-contributor" && tasks.length === 1 && !tasks[0].detailsExpanded && (
          <div className="p-3 bg-accent/20 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground">
              💡 <strong>Multiple work types?</strong> Use "Add Another Task" to log travel time, overtime, or on-call separately with different time ranges.
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2 border-t">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1"
        >
          Cancel
        </Button>
        {tasks.length > 0 && (
          <Button
            variant="destructive"
            onClick={async () => {
              if (window.confirm(`Delete all ${tasks.length} task(s) for ${personName} on this date?`)) {
                try {
                  // ✅ FIX: Pass a single empty task with just the date so handleSavePersonTasks knows which date to delete
                  await onSave([{ date: format(date, 'yyyy-MM-dd'), hours: '0' }]);
                  onCancel(); // Close the modal after deletion
                } catch (error) {
                  console.error('Failed to delete tasks:', error);
                }
              }
            }}
            disabled={isSubmitting}
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete All
          </Button>
        )}
        <Button
          onClick={handleSave}
          disabled={isSubmitting}
          size="sm"
          className="flex-1"
        >
          {isSubmitting ? 'Saving...' : 'Save Tasks'}
        </Button>
      </div>
    </div>
  );
}