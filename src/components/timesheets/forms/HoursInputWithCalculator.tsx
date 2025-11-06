import { useState } from 'react';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Calculator, Clock, X } from 'lucide-react';
import { Label } from '../../ui/label';

interface HoursInputWithCalculatorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export function HoursInputWithCalculator({
  value,
  onChange,
  error,
  disabled,
  required,
}: HoursInputWithCalculatorProps) {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [breakMinutes, setBreakMinutes] = useState('60');

  const calculateHours = () => {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    const totalMinutes = endMinutes - startMinutes - Number(breakMinutes);
    
    const hours = (totalMinutes / 60).toFixed(2);
    onChange(hours);
    setIsCalculatorOpen(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Label htmlFor="hours" className="flex items-center gap-1">
          Hours {required && <span className="text-destructive">*</span>}
        </Label>
        {error && <span className="text-destructive text-xs">({error})</span>}
      </div>
      
      <div className="flex gap-2">
        <Input
          id="hours"
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g., 8 or 7.5"
          className={error ? 'border-destructive' : ''}
          disabled={disabled}
        />
        
        <Button
          type="button"
          variant={isCalculatorOpen ? "default" : "outline"}
          size="icon"
          disabled={disabled}
          className="shrink-0"
          onClick={() => setIsCalculatorOpen(!isCalculatorOpen)}
        >
          {isCalculatorOpen ? (
            <X className="w-4 h-4" />
          ) : (
            <Calculator className="w-4 h-4" />
          )}
        </Button>
      </div>

      {isCalculatorOpen && (
        <div className="border rounded-lg p-4 bg-muted/50 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <h4 className="text-sm font-medium">Time Calculator</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="calc-start-time" className="text-xs text-muted-foreground">
                Start Time
              </Label>
              <Input
                id="calc-start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="calc-end-time" className="text-xs text-muted-foreground">
                End Time
              </Label>
              <Input
                id="calc-end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="calc-break" className="text-xs text-muted-foreground">
              Break (minutes)
            </Label>
            <Input
              id="calc-break"
              type="number"
              value={breakMinutes}
              onChange={(e) => setBreakMinutes(e.target.value)}
              min="0"
              step="15"
              className="mt-1"
            />
          </div>
          
          <Button
            type="button"
            onClick={calculateHours}
            className="w-full"
            size="sm"
          >
            Calculate Hours
          </Button>
        </div>
      )}
    </div>
  );
}
