import { useState } from "react";
import { format, isSameDay } from "date-fns";
import { MoreHorizontal, Copy } from "lucide-react";
import { StatusIconRow } from "../indicators/StatusIconRow";
import { QuickEditPopover } from "./QuickEditPopover";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "../../ui/context-menu";
import type { TimesheetEntry, EntryDetail } from "../../../types";
import { cn } from "../../ui/utils";

interface EditableTableCellProps {
  date: Date;
  entry?: TimesheetEntry;
  onQuickEdit?: (data: {
    startTime: string;
    endTime: string;
    breakMinutes: number;
    totalHours: number;
  }) => void;
  onDetailedEdit?: () => void;
  onCopyToOthers?: () => void;
  isToday?: boolean;
  isWeekend?: boolean;
}

export function EditableTableCell({
  date,
  entry,
  onQuickEdit,
  onDetailedEdit,
  onCopyToOthers,
  isToday,
  isWeekend,
}: EditableTableCellProps) {
  const [quickEditOpen, setQuickEditOpen] = useState(false);

  const totalHours =
    entry?.entries?.reduce((sum, e) => sum + (e.hours || 0), 0) || 0;
  const hasEntry = totalHours > 0;
  const taskCount = entry?.entries?.length || 0;

  // Extract time details from first entry (or aggregate if needed)
  const firstEntry = entry?.entries?.[0];
  const startTime = firstEntry?.startTime || "09:00";
  const endTime = firstEntry?.endTime || "17:00";
  const breakMinutes = firstEntry?.breakMinutes || 30;

  const handleCellClick = (e: React.MouseEvent) => {
    // Don't open if clicking on a button
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    
    e.stopPropagation();
    console.log('Cell clicked! Opening quick edit...');
    // Single click opens quick edit popover
    setQuickEditOpen(true);
  };

  const handleQuickEditSave = (data: any) => {
    console.log('Quick edit save:', data);
    if (onQuickEdit) {
      onQuickEdit(data);
    }
  };

  // Render the cell - we'll handle the popover and context menu separately
  return (
    <td
      onClick={handleCellClick}
      onContextMenu={(e) => {
        // Allow right-click only if there's an entry
        if (!hasEntry) {
          e.preventDefault();
        }
      }}
      className={cn(
        "relative px-2 py-2.5 text-center cursor-pointer border-r border-gray-200",
        "transition-colors hover:bg-gray-50",
        "group", // ✅ Add group class so hover actions become visible
        isToday && "bg-blue-50",
        isWeekend && "bg-gray-50"
      )}
    >
      <div className="flex flex-col items-center gap-1 min-h-[64px] justify-center">
        {hasEntry ? (
          <>
            {/* Hours - larger and bold */}
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "font-semibold tabular-nums",
                  totalHours > 8 && "text-orange-600",
                  totalHours > 12 && "text-red-600"
                )}
              >
                {totalHours % 1 === 0
                  ? totalHours.toFixed(0)
                  : totalHours.toFixed(1)}
                h
              </span>
              {taskCount > 1 && (
                <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                  {taskCount}
                </span>
              )}
            </div>

            {/* Time Range - only show if start/end times are defined */}
            {startTime && endTime && (
              <div className="text-xs text-gray-600 tabular-nums">
                {startTime} - {endTime}
              </div>
            )}

            {/* Break Time - only show if break is defined and > 0 */}
            {breakMinutes > 0 && startTime && endTime && (
              <div className="text-xs text-gray-500">
                Break: {breakMinutes}m
              </div>
            )}

            {/* Status Icons */}
            <StatusIconRow entry={entry} size="sm" />
          </>
        ) : (
          <span className="text-gray-300 text-xs">Click to add</span>
        )}

        {/* Hover Actions - Top Right - NOW ALWAYS VISIBLE */}
        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
          {/* Copy button - only show if there's an entry to copy */}
          {hasEntry && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log('Copy button clicked');
                if (onCopyToOthers) {
                  onCopyToOthers();
                }
              }}
              className="text-gray-500 hover:text-accent-brand hover:bg-accent/10 p-1 rounded transition-colors bg-white/90 backdrop-blur-sm shadow-sm"
              title="Copy to others..."
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          )}
          {/* Detailed edit button - ALWAYS SHOW (even for empty cells) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log('Detailed edit button clicked');
              if (onDetailedEdit) {
                onDetailedEdit();
              }
            }}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1 rounded transition-colors bg-white/90 backdrop-blur-sm shadow-sm"
            title="Detailed edit"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Edit Popover - positioned absolutely */}
      <QuickEditPopover
        isOpen={quickEditOpen}
        onOpenChange={setQuickEditOpen}
        initialStartTime={startTime}
        initialEndTime={endTime}
        initialBreakMinutes={breakMinutes}
        initialTotalHours={totalHours}
        onSave={handleQuickEditSave}
        personName="Contractor"
        date={format(date, "yyyy-MM-dd")}
        trigger={<div className="absolute inset-0" />}
      />

      {/* Context Menu - only if there's an entry */}
      {hasEntry && (
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <div className="absolute inset-0 pointer-events-none" />
          </ContextMenuTrigger>
          <ContextMenuContent className="w-48">
            <ContextMenuItem
              onClick={() => {
                console.log('Context menu: Detailed edit');
                if (onDetailedEdit) {
                  onDetailedEdit();
                }
              }}
            >
              <MoreHorizontal className="w-4 h-4 mr-2" />
              Detailed Edit
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => {
                console.log('Context menu: Copy to others');
                if (onCopyToOthers) {
                  onCopyToOthers();
                }
              }}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy to Others...
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      )}
    </td>
  );
}