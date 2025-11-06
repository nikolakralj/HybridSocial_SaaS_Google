import { useState } from 'react';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Input } from '../../ui/input';

interface TaskCategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  workType?: string; // Can filter categories by work type
}

// Common task categories
const TASK_CATEGORIES = [
  'Development',
  'Frontend Development',
  'Backend Development',
  'Full Stack Development',
  'Code Review',
  'Bug Fixing',
  'Testing',
  'Design',
  'UI/UX Design',
  'Meetings',
  'Planning',
  'Documentation',
  'Research',
  'DevOps',
  'Database Work',
  'API Development',
  'Client Communication',
  'Project Management',
  'General Work',
];

export function TaskCategorySelector({
  value,
  onChange,
  error,
  disabled,
  required,
}: TaskCategorySelectorProps) {
  const [useCustom, setUseCustom] = useState(
    value && !TASK_CATEGORIES.includes(value)
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="task" className="flex items-center gap-1">
          Task Category {required && <span className="text-destructive">*</span>}
        </Label>
        {!required && <span className="text-xs text-muted-foreground">(Optional)</span>}
        {error && <span className="text-destructive text-xs">({error})</span>}
      </div>

      {useCustom ? (
        <div className="space-y-2">
          <Input
            id="task"
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter custom task category"
            className={error ? 'border-destructive' : ''}
            disabled={disabled}
          />
          <button
            type="button"
            onClick={() => {
              setUseCustom(false);
              onChange('');
            }}
            className="text-xs text-primary hover:underline"
          >
            Choose from categories
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <Select value={value} onValueChange={onChange} disabled={disabled}>
            <SelectTrigger id="task" className={error ? 'border-destructive' : ''}>
              <SelectValue placeholder="Select a task category" />
            </SelectTrigger>
            <SelectContent>
              {TASK_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button
            type="button"
            onClick={() => setUseCustom(true)}
            className="text-xs text-primary hover:underline"
          >
            Enter custom category
          </button>
        </div>
      )}
    </div>
  );
}
