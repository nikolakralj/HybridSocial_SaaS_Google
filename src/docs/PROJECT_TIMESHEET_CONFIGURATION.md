# Project-Level Timesheet Configuration

## Overview

Different clients and projects have different timesheet requirements. WorkGraph supports **project-level configuration** to customize how timesheets work for each project.

## Problem Statement

**Your Question**: "Should we define if timesheets will have start/end time etc or only total time in project settings?"

**Answer**: YES! Absolutely. This is critical for a good UX.

### Real-World Examples

**Scenario 1: Government Contract (Detailed Tracking)**
- **Requirement**: Must track exact clock-in/out times for compliance
- **Configuration**: `entryMode: 'time_tracking'`
- **UX**: Contractors enter start time (09:00), end time (17:00), break (30m)
- **Result**: System calculates 7.5 hours automatically

**Scenario 2: Fixed-Rate Project (Simple Entry)**
- **Requirement**: Just need total hours, don't care about exact times
- **Configuration**: `entryMode: 'hours_only'`
- **UX**: Contractors enter "8h" - done!
- **Result**: Fast, simple entry. No start/end times shown.

**Scenario 3: Flexible (Current Default)**
- **Configuration**: `entryMode: 'flexible'`
- **UX**: User can choose either method per entry
- **Result**: Most flexible but can be confusing

## Configuration Type

See `/types/project-config.ts` for the complete configuration interface.

```typescript
export interface TimesheetConfig {
  // Core Settings
  entryMode: 'hours_only' | 'time_tracking' | 'flexible';
  
  // Validation
  requireTaskDescriptions: boolean;
  requireSignedTimesheet: boolean;
  allowEditAfterSubmit: boolean;
  
  // Defaults (for time_tracking mode)
  defaultBreakMinutes: number;
  defaultStartTime: string;
  defaultEndTime: string;
  
  // Workflow
  approvalLevels: 1 | 2 | 3;
  invoiceFrequency: 'weekly' | 'biweekly' | 'monthly';
}
```

## Implementation Status

### ✅ What's Already Working

1. **Dual-mode entry in QuickEditPopover**
   - Hours-first mode: Enter total hours only
   - Time-first mode: Enter start/end times, auto-calculate hours

2. **Smart display logic**
   - Cells only show start/end times when they exist
   - Hours-only entries just show the hours

3. **Proper data flow**
   - Hours-only saves: `{ totalHours: 8 }`
   - Time-based saves: `{ totalHours: 7.5, startTime: "09:00", endTime: "17:00", breakMinutes: 30 }`

### 🚧 What Needs to Be Built

1. **Project Settings UI**
   - Add a "Timesheet Settings" section to Project Workspace
   - Allow project owner to configure `TimesheetConfig`
   - Save configuration to database (project table)

2. **Pass Config to Components**
   ```typescript
   <ProjectTimesheetsView
     projectConfig={projectTimesheetConfig}
     // ... other props
   />
   ```

3. **Enforce Mode in QuickEditPopover**
   ```typescript
   // If projectConfig.entryMode === 'hours_only'
   // → Hide the time input fields entirely
   
   // If projectConfig.entryMode === 'time_tracking'
   // → Hide the manual hours input, require time fields
   
   // If projectConfig.entryMode === 'flexible'
   // → Show both (current behavior)
   ```

4. **Database Schema**
   ```sql
   ALTER TABLE projects ADD COLUMN timesheet_config JSONB DEFAULT '{
     "entryMode": "flexible",
     "requireTaskDescriptions": true,
     "requireSignedTimesheet": true,
     "allowEditAfterSubmit": false,
     "defaultBreakMinutes": 30,
     "defaultStartTime": "09:00",
     "defaultEndTime": "17:00",
     "approvalLevels": 1,
     "invoiceFrequency": "monthly"
   }';
   ```

## Quick Fix Applied (Current Session)

### Issue
When entering "9h" in hours-only mode, the cell was still showing "09:00 - 17:00 Break: 30m" which was confusing because those times weren't entered by the user.

### Fix
1. **EditableTableCell.tsx** - Only show start/end times if they're defined:
   ```typescript
   {/* Only show if start/end times exist */}
   {startTime && endTime && (
     <div className="text-xs text-gray-600 tabular-nums">
       {startTime} - {endTime}
     </div>
   )}
   ```

2. **TimesheetTableRow.tsx** - Don't populate undefined fields:
   ```typescript
   {
     hours: data.totalHours,
     startTime: data.startTime,  // undefined if hours-only
     endTime: data.endTime,      // undefined if hours-only
     breakMinutes: data.breakMinutes, // undefined if hours-only
   }
   ```

3. **QuickEditPopover.tsx** - Hours-first mode only saves hours:
   ```typescript
   if (entryMode === "hours-first") {
     onSave({ totalHours }); // Only hours, no times
   }
   ```

### Result
- **Hours-only entry**: Cell shows "9h" only
- **Time-based entry**: Cell shows "7.5h", "09:00 - 17:00", "Break: 30m"

## Recommended Next Steps

1. **Add Project Settings UI** (High Priority)
   - Let project owners configure timesheet requirements
   - Most important setting: `entryMode`

2. **Enforce Configuration** (Medium Priority)
   - Pass `projectConfig` through component tree
   - Conditionally render fields based on config

3. **Migrate Existing Projects** (Low Priority)
   - Set sensible defaults for existing projects
   - Your use case: `entryMode: 'hours_only'` (since you said contractors fill hours monthly)

## Your Specific Use Case

Based on your description:
> "contractors will fill hours monthly and upload PDF signed timesheets"

**Recommended Configuration:**
```typescript
const YOUR_PROJECT_CONFIG: TimesheetConfig = {
  entryMode: 'hours_only',  // ← Key setting
  requireTaskDescriptions: false,
  requireSignedTimesheet: true,  // ← You mentioned this
  allowEditAfterSubmit: false,
  defaultBreakMinutes: 0,  // Not relevant for hours_only
  defaultStartTime: '09:00',  // Not relevant for hours_only
  defaultEndTime: '17:00',  // Not relevant for hours_only
  approvalLevels: 1,
  invoiceFrequency: 'monthly',  // ← You mentioned this
};
```

## Files Modified Today

1. `/types/project-config.ts` - **NEW** - Configuration types
2. `/components/timesheets/table/QuickEditPopover.tsx` - Added TODO comments
3. `/components/timesheets/table/EditableTableCell.tsx` - Conditional display logic
4. `/components/timesheets/table/TimesheetTableRow.tsx` - Don't populate undefined fields
5. `/components/timesheets/ProjectTimesheetsView.tsx` - Proper state management for edits

## Testing

To test the current fix:

1. Go to Project Workspace → Timesheets tab
2. Select a contractor
3. Click on any cell in the table
4. **Test Hours-Only Mode:**
   - Click on the "Total Hours" field
   - Enter "6"
   - Click Save
   - ✅ Cell should show **only** "6h" (no start/end times)

5. **Test Time-First Mode:**
   - Click on another cell
   - Enter start time: "10:00"
   - Enter end time: "16:00"
   - Enter break: "45"
   - Click Save
   - ✅ Cell should show "5.25h", "10:00 - 16:00", "Break: 45m"

## Conclusion

Your instinct is 100% correct - **project-level timesheet configuration is essential**. The foundation is now in place with:
- ✅ Dual-mode entry system working
- ✅ Proper data model defined
- ✅ Smart display logic implemented

The next step is building the Project Settings UI to control this configuration.
