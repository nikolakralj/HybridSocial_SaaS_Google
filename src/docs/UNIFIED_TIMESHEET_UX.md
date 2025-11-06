# Unified Timesheet Entry UX Pattern

## Overview
We've standardized the timesheet entry experience across all modals with a consistent, intuitive UI pattern that supports both simple hour entry and detailed time tracking.

## Updated Components

### ✅ 1. MultiTaskEditor.tsx
**Location:** `/components/timesheets/forms/MultiTaskEditor.tsx`  
**Usage:** Inline multi-person timesheet editing

### ✅ 2. EnhancedDayEntryModal.tsx
**Location:** `/components/timesheets/EnhancedDayEntryModal.tsx`  
**Usage:** Dialog-based single-day entry modal

## Unified UX Pattern

### Layout Structure (Per Task)

```
┌─────────────────────────────────────────┐
│ Task Header (if multiple tasks)         │
│ ┌─────────────┬─────────────┐          │
│ │ Hours       │ Work Type   │          │
│ └─────────────┴─────────────┘          │
│ [Rate Display] (if applicable)          │
├─────────────────────────────────────────┤
│ [⏰ Use time calculator] ← BUTTON       │
│                                         │
│ OR (when expanded):                     │
│ ┌───────────────────────────────────┐  │
│ │ ⏰ Time Calculator                 │  │
│ │ Start | End | Break | [Apply]     │  │
│ └───────────────────────────────────┘  │
├─────────────────────────────────────────┤
│ [▼ Add Details] ← COLLAPSIBLE           │
│                                         │
│ When expanded:                          │
│ • Task Category ← MOVED HERE            │
│ • Specific Task (optional)              │
│ • Notes (optional)                      │
│ • Billable toggle (owners only)         │
└─────────────────────────────────────────┘
```

### Key Design Decisions

#### 1. **Time Calculator Position**
- **Outside** expandable details section
- Appears **between** main fields and "Add Details"
- Starts collapsed with "Use time calculator" button
- When clicked, expands to show Start/End/Break fields

**Rationale:** Some clients require specific start/end times per task. Making this easily accessible but optional keeps the UI clean.

#### 2. **Task Category Position**
- **Inside** expandable "Add Details" section
- No longer in the main task header
- Defaults to "Development"

**Rationale:** Most users log the same category repeatedly. Moving it to details reduces visual clutter while still being easily accessible.

#### 3. **Auto-Fill Behavior**
When a user enters hours (e.g., 8) and tabs away:
- Automatically fills: Start `09:00` (9 AM)
- Automatically calculates: End `17:00` (5 PM for 8 hours)
- Sets Break: `0` minutes
- **Only if times aren't already set** (won't overwrite)

**Rationale:** Provides helpful defaults while respecting existing data.

## User Flows

### Flow 1: Simple Hour Entry
```
1. User enters "8" in Hours field
2. User selects Work Type (e.g., "Regular Work")
3. User clicks "Save"
✓ Done in 3 clicks
```

### Flow 2: Detailed Time Tracking
```
1. User enters "8" in Hours field
   → System auto-fills 09:00-17:00
2. User clicks "Use time calculator"
3. User adjusts: Start to 07:30, End to 17:00, Break to 30
4. User clicks "Apply"
   → Hours recalculated to 9.0
5. User clicks "Save"
✓ Precise time tracking with calculator
```

### Flow 3: Multiple Tasks with Different Times
```
1. Task 1: Regular Work
   - Enter 9 hours → Auto-fills 09:00-18:00
   - Adjust to 07:30-17:00, 30min break
   
2. Click "Add Another Task"

3. Task 2: Travel
   - Enter 3 hours → Auto-fills 09:00-12:00
   - Adjust to 18:00-21:00, 0min break
   
4. Click "Save"
✓ Separate time ranges per task
```

## Visual Hierarchy

### Priority 1 (Always Visible)
- Hours input
- Work Type selector
- Rate display (if user has permission)

### Priority 2 (One Click Away)
- Time calculator (collapsed by default)
- "Add Another Task" button

### Priority 3 (Details Section)
- Task category
- Specific task description
- Notes
- Billable toggle

## Role-Based Features

### Individual Contributors
- See: Hours, Work Type, Task details
- Don't see: Rates, billing calculations
- Message: "✓ Your hours will be reviewed and approved by your manager"

### Company Owners
- See: Everything + Internal cost rates
- Rate multipliers: Regular (1.0x), Travel (0.5x), Overtime (1.5x), On-Call (0.75x)
- Label: "Billable to agency"

### Agency Owners
- See: Everything + Client billing rates
- Rate multipliers: Same as above
- Label: "Billable to client"

## Time Calculator Features

### Per-Task Independence
Each task has its own time calculator:
- Task 1: 07:30 AM - 5:00 PM (Regular Work)
- Task 2: 6:00 PM - 9:00 PM (Travel)
- Task 3: 10:00 PM - 6:00 AM (On-Call)

### Smart Defaults
- Start time: Defaults to 09:00 (9 AM)
- End time: Calculated based on hours (with PM preference)
- Break: Defaults to 0 minutes
- Auto-applies when hours are entered

### Visual Feedback
- Shows time range: "Time range: 09:00 - 17:00"
- Displays in breakdown: "(09:00 - 17:00)" next to task type
- Persists when saving for audit trail

## Summary Breakdown

### Single Task
```
┌──────────────────────────────────────┐
│ Total for Mon, Oct 21               │
│ 8.00 hours                          │
│                                     │
│ Billable to client: $600.00         │
└──────────────────────────────────────┘
```

### Multiple Tasks
```
┌──────────────────────────────────────┐
│ Breakdown by Type                    │
│ ⏰ Regular Work (09:00-17:00)        │
│    8.00h × $75/hr = $600.00         │
│ 🚗 Travel (18:00-21:00)             │
│    3.00h × $37.50/hr = $112.50      │
├──────────────────────────────────────┤
│ Total for Mon, Oct 21               │
│ 11.00 hours                         │
│                                     │
│ Billable to client: $712.50         │
└──────────────────────────────────────┘
```

## Validation

### Real-Time Validation
- Hours cannot be 0 (shows error on save)
- Total hours cannot exceed 24 per day
- Each task must have a valid category

### Error Messages
- "Please enter hours worked"
- "Total hours cannot exceed 24 in a day"
- "Please select a task category for all entries"

## Tips & Guidance

### For Individual Contributors
```
💡 Multiple work types? Use "Add Another Task" to log 
travel time, overtime, or on-call separately with 
different time ranges.
```

### Keyboard Shortcuts
- `Cmd/Ctrl + Enter`: Save entry (in dialog modals)
- `Tab`: Navigate between fields
- Auto-focus: First hours input

## Benefits

### ✅ Consistency
Same UI pattern across all timesheet entry points

### ✅ Flexibility
Supports both:
- Simple hour entry (most common)
- Detailed time tracking (when needed)

### ✅ Progressive Disclosure
- Essential fields always visible
- Optional features one click away
- Advanced options in expandable sections

### ✅ Smart Defaults
- Auto-fills helpful starting values
- Remembers last-used work type
- Learns from common patterns

### ✅ Role-Appropriate
- Shows only relevant information
- Hides billing details from contributors
- Displays appropriate rate calculations

## Next Steps

### Consider Applying To:
- [ ] `IndividualEntryModal.tsx` - Older individual entry modal
- [ ] `BulkEntryEditor.tsx` - Bulk editing interface
- [ ] `MultiPersonDayModal.tsx` - Multi-person day modal
- [ ] Any other entry modals in the system

### Future Enhancements:
- [ ] Remember user's preferred time ranges
- [ ] Suggest break times based on hours
- [ ] Show lunch break reminders for 8+ hour days
- [ ] Template system for recurring tasks
- [ ] Smart category suggestions based on history

## Technical Notes

### State Management
Each task maintains:
```typescript
{
  hours: number;
  startTime?: string;
  endTime?: string;
  breakMinutes?: number;
  showTimeCalculator?: boolean;
  // ... other fields
}
```

### Calculation Logic
```typescript
// Auto-fill on hours blur
startHour = 9 // 9 AM
endHour = startHour + Math.floor(hours)
endMin = Math.round((hours % 1) * 60)
breakMinutes = 0

// Calculate from times
workMinutes = (endTime - startTime) - breakMinutes
hours = workMinutes / 60
```

### Persistence
- Time data saved to database with task
- Available for audit/compliance reports
- Displayed in summaries and breakdowns

---

**Last Updated:** October 18, 2025  
**Components:** MultiTaskEditor, EnhancedDayEntryModal  
**Status:** ✅ Implementation Complete
