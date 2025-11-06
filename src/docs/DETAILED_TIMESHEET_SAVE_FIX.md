# Detailed Timesheet Entry Modal Save Fix

## Problem

The "Save Tasks" button in the detailed timesheet entry modal (SinglePersonDayModal) was not working - clicking it showed a success toast but didn't actually save the data or update the UI.

## Root Cause

The callback chain was broken:

1. ✅ `SinglePersonDayModal` → Calls `onSave` prop
2. ✅ `TimesheetTableRow` → Receives `onSavePersonTasks` prop
3. ✅ `MonthlyTable`/`WeeklyTable` → Passes through `onSavePersonTasks`
4. ✅ `TimesheetTableView` → Accepts `onSavePersonTasks` prop
5. ❌ **`ProjectTimesheetsView` → Was NOT passing `onSavePersonTasks` to `TimesheetTableView`**

The callback was defined but never connected!

## Solution

### Step 1: Pass the callback through the component tree

**In `ProjectTimesheetsView.tsx`:**

```typescript
// Month View
<TimesheetTableView
  people={selectedPeopleForTable}
  entries={tableEntriesFromApprovalData}
  viewMode="month"
  onEntriesChange={(personId, date, entries) => {
    // ... existing code ...
  }}
  onSavePersonTasks={handleSavePersonTasks}  // ← ADDED THIS
/>

// Week View  
<TimesheetTableView
  people={selectedPeopleForTable}
  entries={tableEntriesFromApprovalData}
  viewMode="week"
  onEntriesChange={(personId, date, entries) => {
    // ... existing code ...
  }}
  onSavePersonTasks={handleSavePersonTasks}  // ← ADDED THIS
/>
```

### Step 2: Transform tasks to entries format in TimesheetTableRow

**In `TimesheetTableRow.tsx`:**

The modal returns tasks in a different format than what the table expects, so we transform them:

```typescript
onSave={onSavePersonTasks ? async (personId, tasks) => {
  // Extract the date from selectedDate state
  if (selectedDate) {
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    
    // Transform tasks into entries format
    const updatedEntry: TimesheetEntry = {
      date: dateKey,
      entries: tasks.map(task => ({
        id: task.entryId || task.taskId || `entry-${Date.now()}-${Math.random()}`,
        category: 'Development',
        description: task.task || task.notes || 'Work',
        hours: parseFloat(task.hours) || 0,
        startTime: task.startTime,
        endTime: task.endTime,
        breakMinutes: task.breakMinutes,
        status: 'draft' as const,
        notes: task.notes || '',
      }))
    };
    
    // Call onEntriesChange with the proper format
    if (onEntriesChange) {
      onEntriesChange(selectedDate, updatedEntry);
    }
  }
} : undefined}
```

### Step 3: Update local state in ProjectTimesheetsView

The `onEntriesChange` callback already handles state updates:

```typescript
onEntriesChange={(personId, date, entries) => {
  const dateKey = format(date, 'yyyy-MM-dd');
  console.log("Entry changed:", personId, dateKey, entries);
  
  // Update local entries state
  setLocalEntries(prev => ({
    ...prev,
    [personId]: {
      ...(prev[personId] || {}),
      [dateKey]: entries,
    }
  }));
  
  const personName = selectedPeopleForTable.find(p => p.id === personId)?.name;
  toast.success(`Updated timesheet for ${personName}`);
}}
```

## Data Flow

### Before Fix (Broken)
```
User clicks "Save Tasks"
  ↓
MultiTaskEditor calls onSave(tasks)
  ↓
SinglePersonDayModal calls onSave(personId, tasks)
  ↓
TimesheetTableRow receives callback
  ↓
❌ Callback is undefined - nothing happens
```

### After Fix (Working)
```
User clicks "Save Tasks"
  ↓
MultiTaskEditor calls onSave(tasks)
  ↓
SinglePersonDayModal calls onSave(personId, tasks)
  ↓
TimesheetTableRow transforms and calls onEntriesChange(date, entries)
  ↓
ProjectTimesheetsView updates localEntries state
  ↓
✅ UI updates immediately
✅ Toast shows success message
```

## Testing

To verify the fix works:

1. Go to **Project Workspace → Timesheets** tab
2. **Select a contractor** from the approval table (check the checkbox)
3. Click on any **cell in the timesheet table** to open detailed edit
4. In the modal:
   - Enter hours (e.g., "11")
   - Optionally add time details (08:00 - 19:00, 0 break)
   - Optionally expand "Add Details" and fill in task category, description, notes
5. Click **"Save Tasks"**
6. ✅ **Expected:** 
   - Toast shows "Saved tasks for [Person Name]"
   - Modal closes
   - Table cell updates immediately with new hours
   - If you reopen the modal, your changes are preserved

## Related Files

- `/components/timesheets/ProjectTimesheetsView.tsx` - Parent component with state
- `/components/timesheets/table/TimesheetTableView.tsx` - Table wrapper
- `/components/timesheets/table/MonthlyTable.tsx` - Month view table
- `/components/timesheets/table/WeeklyTable.tsx` - Week view table
- `/components/timesheets/table/TimesheetTableRow.tsx` - Individual row with modal
- `/components/timesheets/modal/SinglePersonDayModal.tsx` - Detailed entry modal
- `/components/timesheets/forms/MultiTaskEditor.tsx` - Task editing form

## Previous Related Fixes

This builds on the earlier fix for Quick Time Edit which had a similar issue:
- See `/docs/PROJECT_TIMESHEET_CONFIGURATION.md` for Quick Edit save fix
- Quick Edit now works for simple edits (just hours)
- Detailed Edit now works for complex edits (multiple tasks, categories, notes)

## Key Learnings

1. **Always trace the callback chain** - a callback is useless if it's not wired through all components
2. **Data format mismatches** - the modal returns "tasks" but the table expects "entries"
3. **State management** - `localEntries` state merges with demo data to allow editing
4. **Dual save paths** - Quick Edit and Detailed Edit both update the same state via `onEntriesChange`
