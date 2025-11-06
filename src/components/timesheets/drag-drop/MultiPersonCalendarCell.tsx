import { useDrag, useDrop } from 'react-dnd';
import { useRef } from 'react';
import { GripVertical, Copy } from 'lucide-react';
import { VarianceIndicator, hasHoursVariance } from '../indicators/VarianceIndicator';
import { StatusIconRow, getAggregateStatus, getStatusBorderColor, type EntryStatus } from '../indicators/StatusIconRow';
import { cn } from '../../ui/utils';

const ItemTypes = {
  CALENDAR_DAY: 'CALENDAR_DAY'
};

export interface PersonEntry {
  id: string; // Entry ID for updates/deletes
  personId: string;
  personName: string;
  personInitials: string;
  hours: number;
  task: string; // Task/project name
  notes?: string; // Optional notes
  status: EntryStatus;
}

export interface DayData {
  date: Date;
  dateKey: string; // YYYY-MM-DD
  totalHours: number;
  entries: PersonEntry[];
}

interface MultiPersonCalendarCellProps {
  date: Date; // The actual calendar date (required)
  dayData: DayData | null;
  isSelected?: boolean;
  isToday?: boolean;
  isWeekend?: boolean;
  isDragOver?: boolean;
  onDayClick?: (dateKey: string, event: React.MouseEvent) => void;
  onDragCopy?: (sourceDateKey: string, targetDateKey: string, entries: PersonEntry[]) => void;
  enableDragDrop?: boolean;
  showVariance?: boolean;
  showStatusIcons?: boolean;
}

export function MultiPersonCalendarCell({
  date,
  dayData,
  isSelected = false,
  isToday = false,
  isWeekend = false,
  isDragOver = false,
  onDayClick,
  onDragCopy,
  enableDragDrop = true,
  showVariance = true,
  showStatusIcons = true,
}: MultiPersonCalendarCellProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const hasEntries = dayData && dayData.entries.length > 0;
  
  // Format dateKey from the actual date prop
  const formatDateKey = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const dateKey = formatDateKey(date);

  // Drag source
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CALENDAR_DAY,
    item: () => ({
      type: ItemTypes.CALENDAR_DAY,
      sourceDateKey: dateKey,
      entries: dayData?.entries || [],
    }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<{ targetDateKey: string }>();
      if (item && dropResult && onDragCopy) {
        onDragCopy(item.sourceDateKey, dropResult.targetDateKey, item.entries);
      }
    },
    canDrag: () => enableDragDrop && hasEntries,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [dayData, enableDragDrop, hasEntries, onDragCopy]);

  // Drop target
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.CALENDAR_DAY,
    drop: () => ({
      targetDateKey: dateKey,
    }),
    canDrop: (item: any) => {
      return enableDragDrop && item.sourceDateKey !== dateKey;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }), [dateKey, enableDragDrop]);

  // Combine drag and drop refs
  if (enableDragDrop) {
    drag(drop(ref));
  }

  // Calculate aggregate data
  const statusIcons = dayData?.entries.map(entry => ({
    personId: entry.personId,
    personName: entry.personName,
    status: entry.status,
    hours: entry.hours,
  })) || [];

  const aggregateStatus = getAggregateStatus(dayData?.entries.map(e => e.status) || []);
  const statusBorderColor = getStatusBorderColor(aggregateStatus);

  const hours = dayData?.entries.map(e => e.hours) || [];
  const variance = hasHoursVariance(hours);

  // Styling classes
  const baseClasses = cn(
    "aspect-square rounded-lg border-2 p-2 apple-transition relative",
    "flex flex-col items-center justify-between",
    // Base styling
    isWeekend && "bg-accent/20",
    !isWeekend && "bg-card",
    // Today styling
    isToday && "border-accent-brand bg-accent-brand/5",
    !isToday && !isSelected && statusBorderColor,
    // Selection styling
    isSelected && "border-accent-brand bg-accent-brand/10 ring-2 ring-accent-brand/50",
    // Hover styling
    hasEntries && "hover:border-accent-brand hover:apple-shadow-md",
    !hasEntries && "hover:bg-accent/30",
    // Drag styling
    isDragging && "opacity-50 cursor-grabbing",
    hasEntries && enableDragDrop && !isDragging && "cursor-grab",
    // Drop styling
    isOver && canDrop && "ring-2 ring-accent-brand ring-offset-2 bg-accent-brand/20",
    !isOver && canDrop && "ring-1 ring-accent-brand/30"
  );

  const handleClick = (e: React.MouseEvent) => {
    if (onDayClick) {
      onDayClick(dateKey, e);
    }
  };

  return (
    <div ref={ref} className="relative group">
      <button
        onClick={handleClick}
        className={baseClasses}
      >
        {/* Drag Handle (top-right) */}
        {hasEntries && enableDragDrop && (
          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 apple-transition">
            <GripVertical className="w-3 h-3 text-muted-foreground" />
          </div>
        )}

        {/* Day Number */}
        <div className={cn(
          "text-sm font-semibold",
          isToday && "text-accent-brand"
        )}>
          {date.getDate()}
        </div>

        {/* Content */}
        {hasEntries ? (
          <div className="space-y-1 w-full flex flex-col items-center">
            {/* Total Hours */}
            <div className="flex items-center gap-1">
              <p className="font-semibold text-accent-brand">
                {dayData.totalHours}h
              </p>
              {showVariance && variance && (
                <VarianceIndicator
                  hasVariance={true}
                  details={dayData.entries.map(e => ({
                    personName: e.personName,
                    hours: e.hours,
                  }))}
                  size="sm"
                />
              )}
            </div>

            {/* Status Icons */}
            {showStatusIcons && (
              <StatusIconRow
                icons={statusIcons}
                maxVisible={3}
                size="sm"
              />
            )}

            {/* Person Initials (small) */}
            <div className="flex flex-wrap gap-0.5 justify-center max-w-full">
              {dayData.entries.slice(0, 3).map((entry, idx) => (
                <span
                  key={entry.personId}
                  className="text-[9px] px-1 py-0.5 rounded bg-accent text-accent-foreground border border-border"
                  title={entry.personName}
                >
                  {entry.personInitials}
                </span>
              ))}
              {dayData.entries.length > 3 && (
                <span className="text-[9px] px-1 py-0.5 rounded bg-muted text-muted-foreground">
                  +{dayData.entries.length - 3}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">--</div>
        )}

        {/* Drop Indicator Overlay */}
        {isOver && canDrop && (
          <div className="absolute inset-0 rounded-lg bg-accent-brand/10 border-2 border-accent-brand flex items-center justify-center pointer-events-none">
            <div className="flex flex-col items-center gap-1">
              <Copy className="w-4 h-4 text-accent-brand" />
              <span className="text-[10px] font-medium text-accent-brand">
                Copy
              </span>
            </div>
          </div>
        )}
      </button>
    </div>
  );
}
