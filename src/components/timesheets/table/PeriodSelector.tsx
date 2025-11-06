import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { Button } from "../../ui/button";
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs";
import { addWeeks, subWeeks, addMonths, subMonths, startOfWeek, endOfWeek, startOfMonth, endOfMonth, format } from "date-fns";

type PeriodView = 'week' | 'month' | 'calendar';

interface PeriodSelectorProps {
  view: PeriodView;
  onViewChange: (view: PeriodView) => void;
  startDate: Date;
  endDate: Date;
  onNavigate: (start: Date, end: Date) => void;
  showCalendarTab?: boolean; // Show the Calendar tab option
}

export function PeriodSelector({ view, onViewChange, startDate, endDate, onNavigate, showCalendarTab = false }: PeriodSelectorProps) {
  
  const handlePrevious = () => {
    // Calendar mode uses month navigation
    const isMonthlyView = view === 'month' || view === 'calendar';
    
    if (isMonthlyView) {
      const newStart = subMonths(startDate, 1);
      onNavigate(startOfMonth(newStart), endOfMonth(newStart));
    } else {
      const newStart = subWeeks(startDate, 1);
      onNavigate(startOfWeek(newStart, { weekStartsOn: 1 }), endOfWeek(newStart, { weekStartsOn: 1 }));
    }
  };

  const handleNext = () => {
    // Calendar mode uses month navigation
    const isMonthlyView = view === 'month' || view === 'calendar';
    
    if (isMonthlyView) {
      const newStart = addMonths(startDate, 1);
      onNavigate(startOfMonth(newStart), endOfMonth(newStart));
    } else {
      const newStart = addWeeks(startDate, 1);
      onNavigate(startOfWeek(newStart, { weekStartsOn: 1 }), endOfWeek(newStart, { weekStartsOn: 1 }));
    }
  };

  const handleToday = () => {
    const today = new Date();
    // Calendar mode uses month navigation
    const isMonthlyView = view === 'month' || view === 'calendar';
    
    if (isMonthlyView) {
      onNavigate(startOfMonth(today), endOfMonth(today));
    } else {
      onNavigate(startOfWeek(today, { weekStartsOn: 1 }), endOfWeek(today, { weekStartsOn: 1 }));
    }
  };

  const getPeriodLabel = () => {
    // Calendar mode shows same label as month
    const isMonthlyView = view === 'month' || view === 'calendar';
    
    if (isMonthlyView) {
      return format(startDate, 'MMMM yyyy');
    } else {
      return `Week of ${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`;
    }
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        {/* View Mode Tabs */}
        <Tabs value={view} onValueChange={(v) => onViewChange(v as PeriodView)}>
          <TabsList className={`grid w-full ${showCalendarTab ? 'grid-cols-3' : 'grid-cols-2'}`}>
            <TabsTrigger value="month">
              Month
            </TabsTrigger>
            <TabsTrigger value="week">
              Week
            </TabsTrigger>
            {showCalendarTab && (
              <TabsTrigger value="calendar" className="gap-2">
                <CalendarDays className="w-4 h-4" />
                Calendar
              </TabsTrigger>
            )}
          </TabsList>
        </Tabs>

        {/* Period Navigation */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="min-w-[240px] text-center">
            <span className="text-sm">{getPeriodLabel()}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleToday}
            className="ml-2"
          >
            Today
          </Button>
        </div>
      </div>
    </div>
  );
}