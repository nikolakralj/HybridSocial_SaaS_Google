import { useState } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Badge } from '../../ui/badge';
import { Checkbox } from '../../ui/checkbox';
import { Alert, AlertDescription } from '../../ui/alert';
import { AlertCircle, Check, X, Users, Calendar } from 'lucide-react';
import type { TimesheetEntry } from '../../../utils/api/timesheets';

interface BulkEntryEditorProps {
  entries: TimesheetEntry[];
  onSave: (entryIds: string[], updates: Partial<TimesheetEntry>) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

interface BulkUpdates {
  hours?: number;
  task?: string;
  notes?: string;
  status?: string;
}

export function BulkEntryEditor({ entries, onSave, onCancel, isSubmitting = false }: BulkEntryEditorProps) {
  const [selectedEntryIds, setSelectedEntryIds] = useState<Set<string>>(
    new Set(entries.map(e => e.id))
  );
  const [updateHours, setUpdateHours] = useState(false);
  const [hours, setHours] = useState('');
  const [updateTask, setUpdateTask] = useState(false);
  const [task, setTask] = useState('');
  const [updateNotes, setUpdateNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [updateStatus, setUpdateStatus] = useState(false);
  const [status, setStatus] = useState('');

  // Toggle entry selection
  const toggleEntry = (entryId: string) => {
    setSelectedEntryIds(prev => {
      const updated = new Set(prev);
      if (updated.has(entryId)) {
        updated.delete(entryId);
      } else {
        updated.add(entryId);
      }
      return updated;
    });
  };

  // Toggle all entries
  const toggleAll = () => {
    if (selectedEntryIds.size === entries.length) {
      setSelectedEntryIds(new Set());
    } else {
      setSelectedEntryIds(new Set(entries.map(e => e.id)));
    }
  };

  const selectedEntries = entries.filter(e => selectedEntryIds.has(e.id));
  const allSelected = selectedEntryIds.size === entries.length && entries.length > 0;
  const someSelected = selectedEntryIds.size > 0 && selectedEntryIds.size < entries.length;

  // Validate
  const validate = (): string | null => {
    if (selectedEntryIds.size === 0) {
      return 'Please select at least one entry';
    }

    if (updateHours) {
      const num = parseFloat(hours);
      if (isNaN(num) || num <= 0 || num > 24) {
        return 'Hours must be between 0 and 24';
      }
    }

    if (updateTask && !task.trim()) {
      return 'Task cannot be empty';
    }

    if (!updateHours && !updateTask && !updateNotes && !updateStatus) {
      return 'Please select at least one field to update';
    }

    return null;
  };

  // Handle save
  const handleSave = async () => {
    const error = validate();
    if (error) {
      return;
    }

    const updates: Partial<TimesheetEntry> = {};
    
    if (updateHours) updates.hours = parseFloat(hours);
    if (updateTask) updates.projectId = task.trim(); // Map task to projectId for database storage
    if (updateNotes) updates.notes = notes.trim() || null;
    if (updateStatus) updates.status = status as any;

    await onSave(Array.from(selectedEntryIds), updates);
  };

  const error = validate();
  const canSave = !error;

  // Group entries by person
  const entriesByPerson = selectedEntries.reduce((acc, entry) => {
    if (!acc[entry.personId]) {
      acc[entry.personId] = [];
    }
    acc[entry.personId].push(entry);
    return acc;
  }, {} as Record<string, TimesheetEntry[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="mb-1">Bulk Edit Entries</h3>
        <p className="text-sm text-muted-foreground">
          Select entries and fields to update simultaneously
        </p>
      </div>

      {/* Selection Summary */}
      <Alert>
        <Users className="w-4 h-4" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <div>
              <strong>{selectedEntryIds.size}</strong> of <strong>{entries.length}</strong> entries selected
              {selectedEntryIds.size > 0 && (
                <span className="text-muted-foreground ml-2">
                  ({Object.keys(entriesByPerson).length} {Object.keys(entriesByPerson).length === 1 ? 'person' : 'people'})
                </span>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={toggleAll}>
              {allSelected ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
        </AlertDescription>
      </Alert>

      {/* Entry Selection */}
      <div className="border border-border rounded-lg overflow-hidden max-h-[300px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="bg-accent/30 sticky top-0">
            <tr>
              <th className="text-left p-3 w-12">
                <Checkbox 
                  checked={allSelected || someSelected}
                  onCheckedChange={toggleAll}
                  aria-label={someSelected ? 'Some entries selected' : allSelected ? 'All entries selected' : 'No entries selected'}
                />
              </th>
              <th className="text-left p-3">Person</th>
              <th className="text-left p-3">Date</th>
              <th className="text-left p-3">Hours</th>
              <th className="text-left p-3">Task</th>
              <th className="text-left p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr 
                key={entry.id}
                className={`border-t border-border hover:bg-accent/50 cursor-pointer ${
                  selectedEntryIds.has(entry.id) ? 'bg-accent/30' : ''
                }`}
                onClick={() => toggleEntry(entry.id)}
              >
                <td className="p-3">
                  <Checkbox 
                    checked={selectedEntryIds.has(entry.id)}
                    onCheckedChange={() => toggleEntry(entry.id)}
                  />
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-accent-brand/10 flex items-center justify-center text-xs font-medium text-accent-brand">
                      {entry.personName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <span className="font-medium">{entry.personName}</span>
                  </div>
                </td>
                <td className="p-3 text-muted-foreground">
                  {new Date(entry.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </td>
                <td className="p-3 font-medium">{entry.hours}h</td>
                <td className="p-3 text-muted-foreground max-w-[200px] truncate">
                  {entry.task}
                </td>
                <td className="p-3">
                  <Badge 
                    variant={
                      entry.status === 'approved' ? 'default' : 
                      entry.status === 'submitted' ? 'secondary' : 
                      'outline'
                    }
                    className={
                      entry.status === 'approved' ? 'bg-green-500' :
                      entry.status === 'submitted' ? 'bg-blue-500' :
                      ''
                    }
                  >
                    {entry.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Update Fields */}
      <div className="space-y-4 border border-border rounded-lg p-4 bg-accent/20">
        <div className="font-medium text-sm">Fields to Update</div>

        {/* Hours */}
        <div className="flex items-start gap-3">
          <Checkbox 
            id="update-hours"
            checked={updateHours}
            onCheckedChange={(checked) => setUpdateHours(!!checked)}
          />
          <div className="flex-1 space-y-2">
            <Label htmlFor="update-hours" className="cursor-pointer">Update Hours</Label>
            {updateHours && (
              <Input
                type="text"
                inputMode="decimal"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="e.g., 8 or 7.5"
                disabled={isSubmitting}
              />
            )}
          </div>
        </div>

        {/* Task */}
        <div className="flex items-start gap-3">
          <Checkbox 
            id="update-task"
            checked={updateTask}
            onCheckedChange={(checked) => setUpdateTask(!!checked)}
          />
          <div className="flex-1 space-y-2">
            <Label htmlFor="update-task" className="cursor-pointer">Update Task</Label>
            {updateTask && (
              <Input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="e.g., Frontend development"
                disabled={isSubmitting}
              />
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="flex items-start gap-3">
          <Checkbox 
            id="update-notes"
            checked={updateNotes}
            onCheckedChange={(checked) => setUpdateNotes(!!checked)}
          />
          <div className="flex-1 space-y-2">
            <Label htmlFor="update-notes" className="cursor-pointer">Update Notes</Label>
            {updateNotes && (
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes to all selected entries..."
                rows={2}
                disabled={isSubmitting}
              />
            )}
          </div>
        </div>

        {/* Status */}
        <div className="flex items-start gap-3">
          <Checkbox 
            id="update-status"
            checked={updateStatus}
            onCheckedChange={(checked) => setUpdateStatus(!!checked)}
          />
          <div className="flex-1 space-y-2">
            <Label htmlFor="update-status" className="cursor-pointer">Update Status</Label>
            {updateStatus && (
              <Select value={status} onValueChange={setStatus} disabled={isSubmitting}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && !canSave && (
        <Alert variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Preview */}
      {canSave && selectedEntryIds.size > 0 && (
        <Alert>
          <Calendar className="w-4 h-4" />
          <AlertDescription>
            <div className="font-medium mb-2">Preview Changes:</div>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {updateHours && <li>Set hours to <strong>{hours}</strong> for {selectedEntryIds.size} entries</li>}
              {updateTask && <li>Set task to "<strong>{task}</strong>" for {selectedEntryIds.size} entries</li>}
              {updateNotes && <li>Update notes for {selectedEntryIds.size} entries</li>}
              {updateStatus && <li>Set status to <strong>{status}</strong> for {selectedEntryIds.size} entries</li>}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button 
          variant="ghost" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        
        <Button 
          variant="default"
          onClick={handleSave}
          disabled={isSubmitting || !canSave}
        >
          <Check className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Updating...' : `Update ${selectedEntryIds.size} ${selectedEntryIds.size === 1 ? 'Entry' : 'Entries'}`}
        </Button>
      </div>
    </div>
  );
}
