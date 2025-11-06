import { useState, useEffect, useMemo } from "react";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { PeriodSelector } from "./PeriodSelector";
import { WeeklyTable } from "./WeeklyTable";
import { MonthlyTable } from "./MonthlyTable";
import type { TimesheetEntry } from "../../../types";

type PeriodView = 'week' | 'month';

interface Person {
  id: string;
  name: string;
  initials?: string;
  role?: string;
}

interface TimesheetTableViewProps {
  people: Person[];
  entries: Record<string, Record<string, TimesheetEntry>>;
  viewMode?: PeriodView; // Optional: if provided, hides the toggle
  startDate?: Date; // NEW: Optional external period start
  endDate?: Date; // NEW: Optional external period end
  onEntriesChange?: (personId: string, date: Date, entries: TimesheetEntry) => void;
  onUpdateEntry?: (entryId: string, updates: Partial<TimesheetEntry>) => Promise<void>;
  onDeleteEntry?: (entryId: string) => Promise<void>;
  onBulkUpdate?: (entryIds: string[], updates: Partial<TimesheetEntry>) => Promise<void>;
  onSavePersonTasks?: (personId: string, tasks: any[]) => Promise<void>;
}

export function TimesheetTableView({ 
  people, 
  entries,
  viewMode: externalViewMode,
  startDate: externalStartDate,
  endDate: externalEndDate,
  onEntriesChange,
  onUpdateEntry,
  onDeleteEntry,
  onBulkUpdate,
  onSavePersonTasks
}: TimesheetTableViewProps) {
  const [internalPeriodView, setInternalPeriodView] = useState<PeriodView>('week');
  const [internalStartDate, setInternalStartDate] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [internalEndDate, setInternalEndDate] = useState(() => endOfWeek(new Date(), { weekStartsOn: 1 }));

  // Use external values if provided, otherwise use internal
  const periodView = externalViewMode || internalPeriodView;
  const startDate = externalStartDate || internalStartDate;
  const endDate = externalEndDate || internalEndDate;
  
  // Only show PeriodSelector if we're managing our own navigation
  const showPeriodSelector = !externalStartDate && !externalEndDate;

  // Update date range when period view changes
  useEffect(() => {
    if (periodView === 'week') {
      setInternalStartDate(startOfWeek(new Date(), { weekStartsOn: 1 }));
      setInternalEndDate(endOfWeek(new Date(), { weekStartsOn: 1 }));
    } else {
      setInternalStartDate(startOfMonth(new Date()));
      setInternalEndDate(endOfMonth(new Date()));
    }
  }, [periodView]);

  const handleNavigate = (start: Date, end: Date) => {
    setInternalStartDate(start);
    setInternalEndDate(end);
  };

  // Add initials to people if missing - memoized to prevent re-creation
  const peopleWithInitials = useMemo(() => people.map(person => ({
    ...person,
    initials: person.initials || person.name.split(' ').map(n => n[0]).join('').toUpperCase()
  })), [people]);

  // Transform data for table (now using all people from props) - memoized to prevent re-creation
  const contractors = useMemo(() => peopleWithInitials.map(person => ({
    id: person.id,
    name: person.name,
    role: person.role || 'Contractor',
    entries: entries[person.id] || {}
  })), [peopleWithInitials, entries]);

  return (
    <div className="space-y-6">
      {/* Period Selector - hide toggle if external viewMode is provided */}
      {showPeriodSelector && (
        <PeriodSelector
          view={periodView}
          onViewChange={setInternalPeriodView}
          startDate={startDate}
          endDate={endDate}
          onNavigate={handleNavigate}
          hideViewToggle={!!externalViewMode}
        />
      )}

      {/* Table View */}
      {periodView === 'week' ? (
        <WeeklyTable
          contractors={contractors}
          startDate={startDate}
          endDate={endDate}
          onEntriesChange={onEntriesChange}
          onUpdateEntry={onUpdateEntry}
          onDeleteEntry={onDeleteEntry}
          onBulkUpdate={onBulkUpdate}
          onSavePersonTasks={onSavePersonTasks}
        />
      ) : (
        <MonthlyTable
          contractors={contractors}
          startDate={startDate}
          endDate={endDate}
          onEntriesChange={onEntriesChange}
          onUpdateEntry={onUpdateEntry}
          onDeleteEntry={onDeleteEntry}
          onBulkUpdate={onBulkUpdate}
          onSavePersonTasks={onSavePersonTasks}
        />
      )}
    </div>
  );
}