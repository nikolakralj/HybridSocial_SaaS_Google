# Table View: Copy to Others Feature

## Overview
The table view now supports "Copy to Others" functionality, allowing company owners to quickly replicate timesheet entries from one contractor to multiple other team members.

## User Experience

### 1. **Hover Actions**
When hovering over any cell with hours:
- **Copy icon** (left) - Opens "Apply to Others" dialog
- **More icon** (right) - Opens detailed edit modal

### 2. **Right-Click Context Menu**
Right-click any cell with entries to see:
- **Detailed Edit** - Opens the multi-task editor modal
- **Copy to Others...** - Opens the apply dialog

### 3. **Apply to Others Dialog**

#### Template Summary
Shows the source entry being copied:
- Employee name and date
- All tasks with hours and descriptions
- Total hours and task count

#### Employee Selection
- Checkboxes for all other team members
- "Select All" / "Clear" buttons for bulk selection
- Shows role and initials for each person

#### Date Range
- **This day only** - Copy to same date for selected people
- **This week (Mon-Sun)** - Copy to entire week

#### Conflict Handling
- **Skip existing entries** (safer, default)
- **Overwrite existing entries** (replaces data)

#### Preview
Shows exactly how many entries will be created:
- Example: "5 employees × 1 day × 8h = 5 entries"

## Implementation Details

### Files Modified
1. **EditableTableCell.tsx**
   - Added hover buttons (Copy + More)
   - Added context menu for right-click
   - New `onCopyToOthers` callback

2. **TimesheetTableRow.tsx**
   - Added `allContractors` prop
   - State management for ApplyToOthersDialog
   - Handler for copying entries

3. **WeeklyTable.tsx** & **MonthlyTable.tsx**
   - Pass `allContractors` to each row

### Reused Components
- **ApplyToOthersDialog** - Already built for calendar view
- Same UX patterns and logic
- Consistent with existing workflows

## Benefits

✅ **Fast bulk operations** - Apply template to many people at once  
✅ **Consistent UX** - Same as calendar view  
✅ **Better than drag-drop** - Works on mobile, less error-prone  
✅ **Flexible date ranges** - Day or week application  
✅ **Safe defaults** - Skip conflicts to prevent data loss  

## Example Workflow

**Scenario:** Sarah Chen worked Mon-Fri with standard hours, apply to 5 other developers

1. Hover over Sarah's Monday cell → Click **Copy icon**
2. Dialog opens showing Sarah's entry (8h Development + 2h Meetings)
3. Select 5 developers from list
4. Choose "This week (Mon-Sun)"
5. Preview shows: "5 employees × 5 days × 10h = 25 entries"
6. Click "Apply to 5 people"
7. ✅ All 5 developers now have the same pattern Mon-Fri

## Technical Notes

- Context menu only appears on cells with entries
- Empty cells show "Click to add" without context menu
- Copy preserves all task details: category, hours, notes, times
- Future: Wire up to Supabase for actual data persistence
- Current: Demo mode with console logs and success toasts
