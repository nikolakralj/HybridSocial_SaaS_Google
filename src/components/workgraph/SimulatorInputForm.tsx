import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Play, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import type { TimesheetSimulationInput } from './PolicySimulator';

interface SimulatorInputFormProps {
  contractors: Array<{ id: string; name: string; type: string }>;
  contracts: Array<{ id: string; name: string; type: string; rate?: number; limit?: number }>;
  onSubmit: (input: TimesheetSimulationInput) => void;
  disabled?: boolean;
}

export function SimulatorInputForm({ contractors, contracts, onSubmit, disabled }: SimulatorInputFormProps) {
  const [contractorId, setContractorId] = useState<string>('');
  const [contractId, setContractId] = useState<string>('');
  const [hours, setHours] = useState<string>('40');
  const [weekStartDate, setWeekStartDate] = useState<Date>(
    new Date(new Date().setDate(new Date().getDate() - new Date().getDay())) // Start of current week
  );
  const [taskDescription, setTaskDescription] = useState<string>('');
  const [urgencyLevel, setUrgencyLevel] = useState<string>('normal');
  const [submissionNotes, setSubmissionNotes] = useState<string>('');

  const selectedContractor = contractors.find(c => c.id === contractorId);
  const selectedContract = contracts.find(c => c.id === contractId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contractorId || !contractId || !hours) {
      return;
    }

    const input: TimesheetSimulationInput = {
      contractorId,
      contractorName: selectedContractor?.name || 'Unknown',
      contractId,
      hours: parseFloat(hours),
      weekStartDate: format(weekStartDate, 'yyyy-MM-dd'),
      rate: selectedContract?.rate,
      taskDescription: taskDescription || undefined,
      urgencyLevel: urgencyLevel as 'low' | 'normal' | 'high' | 'urgent',
      submissionNotes: submissionNotes || undefined,
    };

    onSubmit(input);
  };

  const isValid = contractorId && contractId && hours && parseFloat(hours) > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Contractor Selection */}
      <div className="space-y-2">
        <Label htmlFor="contractor">Contractor</Label>
        <Select value={contractorId} onValueChange={setContractorId} disabled={disabled}>
          <SelectTrigger id="contractor">
            <SelectValue placeholder="Select contractor" />
          </SelectTrigger>
          <SelectContent>
            {contractors.map(contractor => (
              <SelectItem key={contractor.id} value={contractor.id}>
                {contractor.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {contractors.length === 0 ? (
          <div className="text-xs space-y-1">
            <p className="text-amber-600 font-medium">
              ⚠️ No contractors found in your WorkGraph
            </p>
            <p className="text-gray-600">
              Add one of these node types:
            </p>
            <ul className="text-gray-600 ml-4 list-disc">
              <li><strong>Person</strong> nodes</li>
              <li><strong>Party</strong> nodes with type "Contractor"</li>
              <li><strong>Party</strong> nodes with type "Freelancer"</li>
            </ul>
            <p className="text-blue-600 mt-2">
              💡 Tip: Check browser console for detailed node detection
            </p>
          </div>
        ) : (
          <p className="text-xs text-green-600">
            ✓ Found {contractors.length} contractor{contractors.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Contract Selection */}
      <div className="space-y-2">
        <Label htmlFor="contract">Contract</Label>
        <Select value={contractId} onValueChange={setContractId} disabled={disabled}>
          <SelectTrigger id="contract">
            <SelectValue placeholder="Select contract" />
          </SelectTrigger>
          <SelectContent>
            {contracts.map(contract => (
              <SelectItem key={contract.id} value={contract.id}>
                {contract.name}
                {contract.rate && ` ($${contract.rate}/hr)`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedContract?.limit && (
          <p className="text-xs text-gray-600">
            Contract limit: {selectedContract.limit} hrs/week
          </p>
        )}
        {contracts.length === 0 ? (
          <div className="text-xs space-y-1">
            <p className="text-amber-600 font-medium">
              ⚠️ No contracts found in your WorkGraph
            </p>
            <p className="text-gray-600">
              Add one of these node types:
            </p>
            <ul className="text-gray-600 ml-4 list-disc">
              <li><strong>Contract</strong> nodes</li>
              <li><strong>SOW</strong> nodes</li>
              <li><strong>PO</strong> nodes</li>
            </ul>
          </div>
        ) : (
          <p className="text-xs text-green-600">
            ✓ Found {contracts.length} contract{contracts.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Hours Input */}
      <div className="space-y-2">
        <Label htmlFor="hours">Hours</Label>
        <Input
          id="hours"
          type="number"
          min="0"
          max="168"
          step="0.5"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          placeholder="40"
          disabled={disabled}
        />
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Standard: 40 hrs/week</span>
          {selectedContract?.limit && parseFloat(hours) > selectedContract.limit && (
            <span className="text-amber-600 font-medium">
              Exceeds limit by {parseFloat(hours) - selectedContract.limit} hrs
            </span>
          )}
        </div>
      </div>

      {/* Week Selection */}
      <div className="space-y-2">
        <Label>Week Starting</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
              disabled={disabled}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(weekStartDate, 'MMM dd, yyyy')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={weekStartDate}
              onSelect={(date) => date && setWeekStartDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Optional Task Description */}
      <div className="space-y-2">
        <Label htmlFor="task">Task Description (Optional)</Label>
        <Textarea
          id="task"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          placeholder="e.g., Frontend development, bug fixes"
          rows={3}
          disabled={disabled}
        />
      </div>

      {/* Urgency Level */}
      <div className="space-y-2">
        <Label htmlFor="urgency">Urgency Level</Label>
        <Select value={urgencyLevel} onValueChange={setUrgencyLevel} disabled={disabled}>
          <SelectTrigger id="urgency">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Low Priority
              </span>
            </SelectItem>
            <SelectItem value="normal">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Normal
              </span>
            </SelectItem>
            <SelectItem value="high">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                High Priority
              </span>
            </SelectItem>
            <SelectItem value="urgent">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                Urgent
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-600">
          {urgencyLevel === 'low' && 'Standard processing - No rush'}
          {urgencyLevel === 'normal' && 'Normal priority - Standard SLA applies'}
          {urgencyLevel === 'high' && 'High priority - Faster approval expected'}
          {urgencyLevel === 'urgent' && 'Urgent - Requires immediate attention'}
        </p>
      </div>

      {/* Submission Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Submission Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={submissionNotes}
          onChange={(e) => setSubmissionNotes(e.target.value)}
          placeholder="e.g., Emergency deadline work, additional context for approvers"
          rows={3}
          disabled={disabled}
        />
        <p className="text-xs text-gray-600">
          These notes will be visible to all approvers in the chain
        </p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={!isValid || disabled}
      >
        <Play className="h-4 w-4 mr-2" />
        Run Simulation
      </Button>

      {/* Quick Presets */}
      <div className="pt-2 border-t">
        <p className="text-xs text-gray-600 mb-2">Quick Presets:</p>
        <div className="grid grid-cols-3 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setHours('40')}
            disabled={disabled}
          >
            40h
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setHours('45')}
            disabled={disabled}
          >
            45h (OT)
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setHours('60')}
            disabled={disabled}
          >
            60h (High)
          </Button>
        </div>
      </div>
    </form>
  );
}
