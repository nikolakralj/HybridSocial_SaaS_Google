import { useState, useCallback, useRef, useEffect } from "react";

export interface SelectionMode {
  type: 'single' | 'multi' | 'range' | 'drag';
}

interface UseMultiDaySelectionProps {
  onSelectionChange?: (selectedDates: Set<string>) => void;
  allowMultiSelect?: boolean;
  allowRangeSelect?: boolean;
  allowDragSelect?: boolean;
}

export function useMultiDaySelection({
  onSelectionChange,
  allowMultiSelect = true,
  allowRangeSelect = true,
  allowDragSelect = true,
}: UseMultiDaySelectionProps = {}) {
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [selectionMode, setSelectionMode] = useState<SelectionMode>({ type: 'single' });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<string | null>(null);
  const lastSelectedRef = useRef<string | null>(null);

  // Update parent component when selection changes
  useEffect(() => {
    onSelectionChange?.(selectedDates);
  }, [selectedDates, onSelectionChange]);

  /**
   * Handle single day click with keyboard modifiers
   */
  const handleDayClick = useCallback((dateKey: string, event?: React.MouseEvent) => {
    const isCtrlOrCmd = event?.ctrlKey || event?.metaKey;
    const isShift = event?.shiftKey;

    if (isCtrlOrCmd && allowMultiSelect) {
      // Toggle individual day (Ctrl/Cmd + Click)
      setSelectedDates(prev => {
        const newSet = new Set(prev);
        if (newSet.has(dateKey)) {
          newSet.delete(dateKey);
        } else {
          newSet.add(dateKey);
        }
        lastSelectedRef.current = dateKey;
        return newSet;
      });
      setSelectionMode({ type: 'multi' });
    } else if (isShift && allowRangeSelect && lastSelectedRef.current) {
      // Range select (Shift + Click)
      const range = getDateRange(lastSelectedRef.current, dateKey);
      setSelectedDates(new Set(range));
      setSelectionMode({ type: 'range' });
    } else {
      // Single select (plain click)
      setSelectedDates(new Set([dateKey]));
      lastSelectedRef.current = dateKey;
      setSelectionMode({ type: 'single' });
    }
  }, [allowMultiSelect, allowRangeSelect]);

  /**
   * Start drag selection
   */
  const handleDragStart = useCallback((dateKey: string) => {
    if (!allowDragSelect) return;
    
    setIsDragging(true);
    setDragStart(dateKey);
    setSelectedDates(new Set([dateKey]));
    setSelectionMode({ type: 'drag' });
  }, [allowDragSelect]);

  /**
   * Update drag selection
   */
  const handleDragOver = useCallback((dateKey: string) => {
    if (!isDragging || !dragStart) return;

    const range = getDateRange(dragStart, dateKey);
    setSelectedDates(new Set(range));
  }, [isDragging, dragStart]);

  /**
   * End drag selection
   */
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
  }, []);

  /**
   * Clear all selections
   */
  const clearSelection = useCallback(() => {
    setSelectedDates(new Set());
    lastSelectedRef.current = null;
    setSelectionMode({ type: 'single' });
  }, []);

  /**
   * Select all dates in range
   */
  const selectDateRange = useCallback((startDate: string, endDate: string) => {
    const range = getDateRange(startDate, endDate);
    setSelectedDates(new Set(range));
    setSelectionMode({ type: 'range' });
  }, []);

  /**
   * Add dates to selection
   */
  const addToSelection = useCallback((dateKeys: string[]) => {
    setSelectedDates(prev => {
      const newSet = new Set(prev);
      dateKeys.forEach(key => newSet.add(key));
      return newSet;
    });
  }, []);

  /**
   * Remove dates from selection
   */
  const removeFromSelection = useCallback((dateKeys: string[]) => {
    setSelectedDates(prev => {
      const newSet = new Set(prev);
      dateKeys.forEach(key => newSet.delete(key));
      return newSet;
    });
  }, []);

  /**
   * Check if date is selected
   */
  const isDateSelected = useCallback((dateKey: string) => {
    return selectedDates.has(dateKey);
  }, [selectedDates]);

  return {
    selectedDates,
    selectionMode,
    isDragging,
    handleDayClick,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    clearSelection,
    selectDateRange,
    addToSelection,
    removeFromSelection,
    isDateSelected,
    selectionCount: selectedDates.size,
  };
}

/**
 * Get all dates between start and end (inclusive)
 */
function getDateRange(startDateKey: string, endDateKey: string): string[] {
  const start = parseDate(startDateKey);
  const end = parseDate(endDateKey);
  
  // Ensure start is before end
  const [earlierDate, laterDate] = start < end ? [start, end] : [end, start];
  
  const range: string[] = [];
  const current = new Date(earlierDate);
  
  while (current <= laterDate) {
    range.push(formatDateKey(current));
    current.setDate(current.getDate() + 1);
  }
  
  return range;
}

/**
 * Parse date key (YYYY-MM-DD) to Date
 */
function parseDate(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Format Date to date key (YYYY-MM-DD)
 */
function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get week range for a date
 */
export function getWeekRange(dateKey: string): string[] {
  const date = parseDate(dateKey);
  const day = date.getDay();
  
  // Get Monday of the week (0 = Sunday, 1 = Monday)
  const monday = new Date(date);
  monday.setDate(date.getDate() - (day === 0 ? 6 : day - 1));
  
  // Get Sunday of the week
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  
  return getDateRange(formatDateKey(monday), formatDateKey(sunday));
}

/**
 * Get month range for a date
 */
export function getMonthRange(dateKey: string): string[] {
  const date = parseDate(dateKey);
  const year = date.getFullYear();
  const month = date.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  return getDateRange(formatDateKey(firstDay), formatDateKey(lastDay));
}
