import { useCallback } from "react";
import { format, eachDayOfInterval, isWeekend } from "date-fns";
import { TimesheetTableRow } from "./TimesheetTableRow";
import type { TimesheetEntry } from "../../../types";

interface ContractorData {
  id: string;
  name: string;
  role: string;
  entries: Record<string, TimesheetEntry>;
}

interface WeeklyTableProps {
  contractors: ContractorData[];
  startDate: Date;
  endDate: Date;
  onEntriesChange?: (contractorId: string, date: Date, entries: TimesheetEntry) => void;
  onUpdateEntry?: (entryId: string, updates: Partial<TimesheetEntry>) => Promise<void>;
  onDeleteEntry?: (entryId: string) => Promise<void>;
  onBulkUpdate?: (entryIds: string[], updates: Partial<TimesheetEntry>) => Promise<void>;
  onSavePersonTasks?: (personId: string, tasks: any[]) => Promise<void>;
}

export function WeeklyTable({ 
  contractors, 
  startDate, 
  endDate, 
  onEntriesChange,
  onUpdateEntry,
  onDeleteEntry,
  onBulkUpdate,
  onSavePersonTasks
}: WeeklyTableProps) {
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const handleEntriesChange = useCallback((contractorId: string) => (date: Date, entries: TimesheetEntry) => {
    if (onEntriesChange) {
      onEntriesChange(contractorId, date, entries);
    }
  }, [onEntriesChange]);

  const handleUpdateContractorEntries = useCallback((contractorId: string, date: Date, entries: TimesheetEntry) => {
    if (onEntriesChange) {
      onEntriesChange(contractorId, date, entries);
    }
  }, [onEntriesChange]);

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="w-full border-collapse">
        <thead>
          {/* Day Names Row */}
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="sticky left-0 bg-gray-50 px-4 py-3 text-left text-xs uppercase tracking-wide text-gray-600 border-r border-gray-200 z-10">
              Contractor
            </th>
            {days.map((day) => (
              <th
                key={format(day, 'yyyy-MM-dd')}
                className={`px-2 py-3 text-center text-xs uppercase tracking-wide border-r border-gray-200 min-w-[80px] ${
                  isWeekend(day) ? 'bg-gray-100 text-gray-500' : 'text-gray-600'
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <span>{format(day, 'EEE')}</span>
                  <span className="text-lg">{format(day, 'd')}</span>
                </div>
              </th>
            ))}
            <th className="sticky right-0 bg-gray-50 px-4 py-3 text-center text-xs uppercase tracking-wide text-gray-600 border-l border-gray-200 z-10 min-w-[100px]">
              Total
            </th>
            <th className="sticky right-0 bg-gray-50 px-4 py-3 text-center text-xs uppercase tracking-wide text-gray-600 border-l border-gray-200 z-10 min-w-[120px]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {contractors.length === 0 ? (
            <tr>
              <td colSpan={days.length + 3} className="px-4 py-8 text-center text-gray-500">
                No contractors found. Add contractors using the chip selector above.
              </td>
            </tr>
          ) : (
            contractors.map((contractor) => (
              <TimesheetTableRow
                key={contractor.id}
                contractor={contractor}
                allContractors={contractors}
                days={days}
                startDate={startDate}
                endDate={endDate}
                onEntriesChange={handleEntriesChange(contractor.id)}
                onUpdateContractorEntries={handleUpdateContractorEntries}
                onUpdateEntry={onUpdateEntry}
                onDeleteEntry={onDeleteEntry}
                onBulkUpdate={onBulkUpdate}
                onSavePersonTasks={onSavePersonTasks}
              />
            ))
          )}
        </tbody>

        {/* Total Row */}
        {contractors.length > 0 && (
          <tfoot className="bg-gray-50 border-t-2 border-gray-300">
            <tr>
              <td className="sticky left-0 bg-gray-50 px-4 py-3 text-sm border-r border-gray-200">
                <span className="uppercase tracking-wide text-gray-600">Total</span>
              </td>
              {days.map((day) => {
                const dateKey = format(day, 'yyyy-MM-dd');
                const dayTotal = contractors.reduce((sum, contractor) => {
                  const entry = contractor.entries[dateKey];
                  return sum + (entry?.entries?.reduce((s, e) => s + (e.hours || 0), 0) || 0);
                }, 0);

                return (
                  <td
                    key={dateKey}
                    className="px-2 py-3 text-center text-sm tabular-nums border-r border-gray-200"
                  >
                    {dayTotal > 0 ? (
                      <span>{dayTotal % 1 === 0 ? dayTotal.toFixed(0) : dayTotal.toFixed(1)}h</span>
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>
                );
              })}
              <td className="sticky right-0 bg-gray-50 px-4 py-3 text-center text-sm tabular-nums border-l border-gray-200">
                {contractors.reduce((sum, contractor) => {
                  return sum + days.reduce((s, day) => {
                    const dateKey = format(day, 'yyyy-MM-dd');
                    const entry = contractor.entries[dateKey];
                    return s + (entry?.entries?.reduce((total, e) => total + (e.hours || 0), 0) || 0);
                  }, 0);
                }, 0).toFixed(1)}h
              </td>
              <td className="sticky right-0 bg-gray-50 px-4 py-3 border-l border-gray-200"></td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}