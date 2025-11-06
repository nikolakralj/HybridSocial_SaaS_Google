import { useState } from 'react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { HoursInputWithCalculator } from './HoursInputWithCalculator';
import { TaskCategorySelector } from './TaskCategorySelector';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Check, X, Edit2, Trash2, Circle, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '../../ui/utils';
import type { TimesheetEntry } from '../../../utils/api/timesheets';

interface InlineEntryCardProps {
  entry: TimesheetEntry & { personName: string; task: string; notes?: string };
  onSave: (updates: Partial<TimesheetEntry>) => Promise<void>;
  onDelete: () => Promise<void>;
  isEditing: boolean;
  onEditToggle: () => void;
  isSubmitting?: boolean;
  disabled?: boolean;
}

const statusConfig = {
  draft: { label: 'Draft', icon: Circle, color: 'text-muted-foreground', bg: 'bg-muted' },
  submitted: { label: 'Submitted', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
  approved: { label: 'Approved', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
};

export function InlineEntryCard({
  entry,
  onSave,
  onDelete,
  isEditing,
  onEditToggle,
  isSubmitting = false,
  disabled = false,
}: InlineEntryCardProps) {
  const [hours, setHours] = useState(entry.hours.toString());
  const [task, setTask] = useState(entry.task);
  const [notes, setNotes] = useState(entry.notes || '');
  const [status, setStatus] = useState(entry.status);
  const [hasChanges, setHasChanges] = useState(false);

  // Track changes
  const checkChanges = (newHours: string, newTask: string, newNotes: string, newStatus: string) => {
    const changed =
      parseFloat(newHours) !== entry.hours ||
      newTask !== entry.task ||
      newNotes !== (entry.notes || '') ||
      newStatus !== entry.status;
    setHasChanges(changed);
  };

  const handleHoursChange = (value: string) => {
    setHours(value);
    checkChanges(value, task, notes, status);
  };

  const handleTaskChange = (value: string) => {
    setTask(value);
    checkChanges(hours, value, notes, status);
  };

  const handleNotesChange = (value: string) => {
    setNotes(value);
    checkChanges(hours, task, value, status);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value as any);
    checkChanges(hours, task, notes, value);
  };

  const handleSave = async () => {
    await onSave({
      hours: parseFloat(hours),
      task,
      notes: notes.trim() || undefined,
      status: status as any,
    });
    setHasChanges(false);
    onEditToggle();
  };

  const handleCancel = () => {
    setHours(entry.hours.toString());
    setTask(entry.task);
    setNotes(entry.notes || '');
    setStatus(entry.status);
    setHasChanges(false);
    onEditToggle();
  };

  const StatusIcon = statusConfig[entry.status].icon;

  if (!isEditing) {
    // View mode - clean card display
    return (
      <div className="border border-border rounded-lg p-4 hover:bg-accent/5 transition-colors">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-accent-brand/10 flex items-center justify-center font-medium text-accent-brand shrink-0">
              {entry.personName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{entry.personName}</span>
                <Badge
                  variant="outline"
                  className={cn('gap-1.5 text-xs', statusConfig[entry.status].color)}
                >
                  <StatusIcon className="w-3 h-3" />
                  {statusConfig[entry.status].label}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Hours:</span>
                  <span className="font-semibold text-accent-brand">{entry.hours}h</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Task:</span>
                  <span className="truncate">{entry.task}</span>
                </div>
              </div>

              {entry.notes && (
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {entry.notes}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-1 shrink-0">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={onEditToggle}
              disabled={disabled}
            >
              <Edit2 className="w-3.5 h-3.5" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              onClick={onDelete}
              disabled={disabled || isSubmitting}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Edit mode - inline form
  return (
    <div className="border-2 border-accent-brand rounded-lg p-4 bg-accent/10">
      <div className="space-y-4">
        {/* Person header */}
        <div className="flex items-center gap-3 pb-3 border-b">
          <div className="w-10 h-10 rounded-full bg-accent-brand/10 flex items-center justify-center font-medium text-accent-brand shrink-0">
            {entry.personName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()}
          </div>
          <div>
            <div className="font-medium">{entry.personName}</div>
            <div className="text-xs text-muted-foreground">
              {(() => {
                try {
                  const dateObj = typeof entry.date === 'string' ? new Date(entry.date) : entry.date;
                  if (isNaN(dateObj.getTime())) {
                    return 'Date unavailable';
                  }
                  return dateObj.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  });
                } catch {
                  return 'Date unavailable';
                }
              })()}
            </div>
          </div>
        </div>

        {/* Form fields */}
        <div className="grid grid-cols-2 gap-4">
          <HoursInputWithCalculator
            value={hours}
            onChange={handleHoursChange}
            disabled={isSubmitting}
            required
          />

          <div className="space-y-2">
            <Label htmlFor={`status-${entry.id}`}>Status</Label>
            <Select value={status} onValueChange={handleStatusChange} disabled={isSubmitting}>
              <SelectTrigger id={`status-${entry.id}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">
                  <Badge variant="secondary" className="text-xs">
                    Draft
                  </Badge>
                </SelectItem>
                <SelectItem value="submitted">
                  <Badge variant="default" className="text-xs bg-blue-500">
                    Submitted
                  </Badge>
                </SelectItem>
                <SelectItem value="approved">
                  <Badge variant="default" className="text-xs bg-green-500">
                    Approved
                  </Badge>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TaskCategorySelector
          value={task}
          onChange={handleTaskChange}
          disabled={isSubmitting}
          required
        />

        <div className="space-y-2">
          <Label htmlFor={`notes-${entry.id}`} className="text-xs text-muted-foreground">
            Notes (Optional)
          </Label>
          <Textarea
            id={`notes-${entry.id}`}
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Add notes..."
            rows={2}
            disabled={isSubmitting}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-xs text-muted-foreground">
            {hasChanges ? (
              <span className="flex items-center gap-1 text-warning">
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
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              disabled={isSubmitting || !hasChanges}
            >
              <Check className="w-4 h-4 mr-1" />
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>

        {/* Keyboard hint */}
        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          <kbd className="px-1.5 py-0.5 bg-accent rounded text-xs">Esc</kbd> to cancel
        </div>
      </div>
    </div>
  );
}
