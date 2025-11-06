import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../ui/popover";

interface MonthSelectorProps {
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
}

export function MonthSelector({ currentMonth, onMonthChange }: MonthSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const goToPreviousMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    onMonthChange(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    onMonthChange(newDate);
  };

  const goToCurrentMonth = () => {
    onMonthChange(new Date());
  };

  const monthName = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const isCurrentMonth = 
    currentMonth.getMonth() === new Date().getMonth() &&
    currentMonth.getFullYear() === new Date().getFullYear();

  // Generate recent months for quick selection
  const recentMonths = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return date;
  });

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={goToPreviousMonth}
        className="px-3"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2 min-w-[200px]">
            <Calendar className="w-4 h-4" />
            {monthName}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3" align="start">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground mb-3">Select Month</p>
            {recentMonths.map((date) => {
              const label = date.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              });
              const isCurrent =
                date.getMonth() === new Date().getMonth() &&
                date.getFullYear() === new Date().getFullYear();
              const isSelected =
                date.getMonth() === currentMonth.getMonth() &&
                date.getFullYear() === currentMonth.getFullYear();

              return (
                <Button
                  key={label}
                  variant={isSelected ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    onMonthChange(date);
                    setIsOpen(false);
                  }}
                >
                  {label}
                  {isCurrent && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      Current
                    </span>
                  )}
                </Button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>

      <Button
        variant="outline"
        size="sm"
        onClick={goToNextMonth}
        className="px-3"
        disabled={isCurrentMonth}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>

      {!isCurrentMonth && (
        <Button variant="ghost" size="sm" onClick={goToCurrentMonth}>
          Today
        </Button>
      )}
    </div>
  );
}
