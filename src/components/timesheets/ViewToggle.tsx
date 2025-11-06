import { Calendar, List } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../components/ui/utils';

interface ViewToggleProps {
  view: 'calendar' | 'table';
  onViewChange: (view: 'calendar' | 'table') => void;
  className?: string;
}

export function ViewToggle({ view, onViewChange, className }: ViewToggleProps) {
  return (
    <div 
      className={cn(
        "inline-flex rounded-lg border border-border bg-background p-1",
        className
      )}
      role="tablist"
      aria-label="View mode selection"
    >
      <Button
        variant={view === 'calendar' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('calendar')}
        className={cn(
          "gap-2 rounded-md px-3 apple-transition",
          view === 'calendar' && "shadow-sm"
        )}
        role="tab"
        aria-selected={view === 'calendar'}
        aria-controls="timesheet-content"
      >
        <Calendar className="w-4 h-4" />
        <span>Calendar</span>
      </Button>
      
      <Button
        variant={view === 'table' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('table')}
        className={cn(
          "gap-2 rounded-md px-3 apple-transition",
          view === 'table' && "shadow-sm"
        )}
        role="tab"
        aria-selected={view === 'table'}
        aria-controls="timesheet-content"
      >
        <List className="w-4 h-4" />
        <span>Table</span>
      </Button>
    </div>
  );
}
