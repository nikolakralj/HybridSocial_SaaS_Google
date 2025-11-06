import { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Badge } from '../../ui/badge';
import { AlertCircle, Check, X } from 'lucide-react';
import { HoursInputWithCalculator } from './HoursInputWithCalculator';
import type { TimesheetEntry } from '../../../utils/api/timesheets';

interface EntryEditFormProps {
  entry: TimesheetEntry;
  onSave: (updates: Partial<TimesheetEntry>) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

interface FormErrors {
  hours?: string;
  task?: string;
}

export function EntryEditForm({ entry, onSave, onCancel, isSubmitting = false }: EntryEditFormProps) {
  const [hours, setHours] = useState(entry.hours.toString());
  const [task, setTask] = useState(entry.task);
  const [notes, setNotes] = useState(entry.notes || '');
  const [status, setStatus] = useState(entry.status);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isDirty, setIsDirty] = useState(false);

  // Track if form has changes
  useEffect(() => {
    const hasChanges = 
      parseFloat(hours) !== entry.hours ||
      task !== entry.task ||
      notes !== (entry.notes || '') ||
      status !== entry.status;
    
    setIsDirty(hasChanges);
  }, [hours, task, notes, status, entry]);

  // Validate hours
  const validateHours = (value: string): string | undefined => {
    const num = parseFloat(value);
    
    if (isNaN(num)) {
      return 'Hours must be a valid number';
    }
    if (num <= 0) {
      return 'Hours must be greater than 0';
    }
    if (num > 24) {
      return 'Hours cannot exceed 24';
    }
    if (!/^\d+(\.\d{0,2})?$/.test(value)) {
      return 'Hours can have at most 2 decimal places';
    }
    
    return undefined;
  };

  // Validate task
  const validateTask = (value: string): string | undefined => {
    if (!value.trim()) {
      return 'Task is required';
    }
    if (value.length < 3) {
      return 'Task must be at least 3 characters';
    }
    if (value.length > 200) {
      return 'Task cannot exceed 200 characters';
    }
    
    return undefined;
  };

  // Validate all fields
  const validate = (): boolean => {
    const newErrors: FormErrors = {
      hours: validateHours(hours),
      task: validateTask(task),
    };

    setErrors(newErrors);
    return !newErrors.hours && !newErrors.task;
  };

  // Handle hours change with validation
  const handleHoursChange = (value: string) => {
    setHours(value);
    
    // Clear error when user starts typing
    if (errors.hours) {
      setErrors(prev => ({ ...prev, hours: undefined }));
    }
  };

  // Handle task change with validation
  const handleTaskChange = (value: string) => {
    setTask(value);
    
    // Clear error when user starts typing
    if (errors.task) {
      setErrors(prev => ({ ...prev, task: undefined }));
    }
  };

  // Handle save
  const handleSave = async () => {
    if (!validate()) return;

    try {
      await onSave({
        hours: parseFloat(hours),
        projectId: task.trim(), // Map task to projectId for database storage
        notes: notes.trim() || null,
        status,
      });
    } catch (error) {
      console.error('Failed to save entry:', error);
    }
  };

  // Keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  };

  return (
    <div className="space-y-4" onKeyDown={handleKeyDown}>
      {/* Person Info (Read-only) */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="w-8 h-8 rounded-full bg-accent-brand/10 flex items-center justify-center font-medium text-accent-brand">
          {entry.personName.split(' ').map(n => n[0]).join('').toUpperCase()}
        </div>
        <div>
          <div className="font-medium text-foreground">{entry.personName}</div>
          <div className="text-xs">
            {new Date(entry.date).toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </div>

      {/* Hours Input with Calculator */}
      <div>
        <HoursInputWithCalculator
          value={hours}
          onChange={handleHoursChange}
          error={errors.hours}
          disabled={isSubmitting}
          required
        />
      </div>

      {/* Task Input */}
      <div className="space-y-2">
        <Label htmlFor="task" className="flex items-center gap-2">
          Task
          <span className="text-destructive">*</span>
          {errors.task && <span className="text-destructive text-xs font-normal">({errors.task})</span>}
        </Label>
        <Input
          id="task"
          type="text"
          value={task}
          onChange={(e) => handleTaskChange(e.target.value)}
          placeholder="e.g., Frontend development"
          className={errors.task ? 'border-destructive' : ''}
          disabled={isSubmitting}
        />
      </div>

      {/* Notes Input */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any additional details..."
          rows={3}
          disabled={isSubmitting}
        />
      </div>

      {/* Status Selector */}
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={(val) => setStatus(val as any)} disabled={isSubmitting}>
          <SelectTrigger id="status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">Draft</Badge>
                <span className="text-sm">Not submitted yet</span>
              </div>
            </SelectItem>
            <SelectItem value="submitted">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="text-xs bg-blue-500">Submitted</Badge>
                <span className="text-sm">Awaiting approval</span>
              </div>
            </SelectItem>
            <SelectItem value="approved">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="text-xs bg-green-500">Approved</Badge>
                <span className="text-sm">Ready for invoice</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Validation Summary */}
      {(errors.hours || errors.task) && (
        <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
          <div className="text-sm text-destructive">
            <div className="font-medium mb-1">Please fix the following errors:</div>
            <ul className="list-disc list-inside space-y-1">
              {errors.hours && <li>{errors.hours}</li>}
              {errors.task && <li>{errors.task}</li>}
            </ul>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div className="text-xs text-muted-foreground">
          {isDirty ? (
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
              Unsaved changes
            </span>
          ) : (
            'No changes'
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            <X className="w-4 h-4 mr-1" />
            Cancel
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleSave}
            disabled={isSubmitting || !isDirty}
          >
            <Check className="w-4 h-4 mr-1" />
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Keyboard Hints */}
      <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
        <kbd className="px-1.5 py-0.5 bg-accent rounded text-xs">Ctrl+Enter</kbd> to save • 
        <kbd className="px-1.5 py-0.5 bg-accent rounded text-xs ml-1">Esc</kbd> to cancel
      </div>
    </div>
  );
}
