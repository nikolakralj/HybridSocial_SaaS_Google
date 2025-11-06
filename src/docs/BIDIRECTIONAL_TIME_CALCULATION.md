# Bidirectional Time Calculation

## Overview

The timesheet entry modal now supports **bidirectional calculation** between hours and time ranges. You can edit either the total hours OR the start/end times, and the system will intelligently recalculate the other value.

## How It Works

### Scenario 1: Enter Start & End Time → Auto-Calculate Hours ⏱️

1. Click "Add time details (optional)"
2. Enter **Start Time**: `09:00`
3. Enter **End Time**: `15:55`
4. Enter **Break**: `0` (optional)
5. ✅ **Hours auto-calculated**: `6.92h` (read-only, shows "Auto" badge)

### Scenario 2: Edit Hours → Recalculate End Time 🕐

**NEW BEHAVIOR:**

1. After entering times (as above), you now want to round up to 7 hours
2. Click into the **Hours** field (now editable!)
3. Change from `6.92` to `7`
4. ✅ **End Time auto-recalculated**: `09:00` - `16:00`

The system keeps:
- ✅ Start time (09:00)
- ✅ Break duration (0 min)
- ✅ Calculates new end time based on: `start + hours + break`

### Scenario 3: Hours First, Then Add Times 📝

1. Enter **Hours**: `8`
2. Click "Add time details"
3. Enter **Start Time**: `09:00`
4. System suggests **End Time**: `17:00` (09:00 + 8h)
5. You can adjust break or end time as needed

## Calculation Logic

### When you change **Start/End/Break** times:
```
Hours = (End Time - Start Time - Break) / 60
Mode: "time-first"
```

### When you change **Hours**:
```
End Time = Start Time + Hours + Break
Mode: "hours-first"
```

## Entry Modes

The system tracks which field was edited last:

- **`hours-first`**: You entered hours manually
  - Hours field is editable
  - Times are optional suggestions
  
- **`time-first`**: You entered start/end times
  - Hours auto-calculated from times
  - Hours field becomes editable (NEW!)

## Visual Indicators

| Field | State | Visual Cue |
|-------|-------|------------|
| Hours (time-first) | Auto-calculated | ~~"Auto" badge~~ (removed - now always editable) |
| Time Details | Optional | Blue highlight when in "time-first" mode |
| Summary | Shows calculation | `09:00 - 15:55 = 6.92h` |

## Use Cases

### ✅ Perfect for:

1. **Client wants round numbers**
   - Enter times: 08:30 - 17:15 = 8.75h
   - Client pays for 9h blocks
   - Change hours to `9` → end time updates to 17:30

2. **Fixed schedule with varying hours**
   - Always start at 09:00
   - Enter total hours worked
   - System calculates when you finished

3. **Time tracking with breaks**
   - 09:00 - 18:00 with 60min break
   - Auto-calculates 8h
   - Adjust hours if needed

## Examples

### Example 1: Typical Day
```
Start: 09:00
End: 17:00
Break: 60 min
= 7 hours (auto)

Edit hours to 8 →
Start: 09:00
End: 18:00 (auto-adjusted)
Break: 60 min
```

### Example 2: Half Day
```
Hours: 4
(opens time calculator)
Start: 09:00
End: 13:00 (suggested)
Break: 0 min

Adjust end to 12:30 →
Hours: 3.5 (auto-updated)
```

### Example 3: Overtime
```
Start: 09:00
End: 21:00
Break: 60 min
= 11 hours (auto)

Round up to 12 for billing →
Start: 09:00
End: 22:00 (auto-adjusted)
Break: 60 min
```

## Key Benefits

✅ **Flexibility**: Edit whichever field makes sense for your workflow  
✅ **Accuracy**: No manual math required  
✅ **Transparency**: See how hours relate to actual times  
✅ **Billing-friendly**: Round to client's preferred increments  
✅ **Always in sync**: Changes propagate automatically

## Technical Details

### State Management

The component tracks:
- `task.hours` - Total billable hours
- `task.startTime` - Start time (HH:MM)
- `task.endTime` - End time (HH:MM)
- `task.breakMinutes` - Break duration in minutes
- `task.entryMode` - "hours-first" | "time-first"

### Update Flow

```typescript
// User changes hours
handleUpdateTask(id, { hours: 7 })
  ↓
Check if startTime exists
  ↓
Calculate: endTime = startTime + hours + break
  ↓
Update state with new endTime
  ↓
Set entryMode = "hours-first"
```

### Edge Cases Handled

1. **No start time set**: Hours change doesn't affect times
2. **Hours > 24**: Validation catches this before save
3. **End time before start**: Assumes next day (24h wrap)
4. **Decimal hours**: Converts to minutes correctly (e.g., 8.5h = 8h 30m)

## Related Features

- **Quick Edit Popover**: Simple hours-only entry
- **Multi-Task Support**: Each task has independent time tracking
- **Work Type Multipliers**: Regular (1x), Overtime (1.5x), Travel (0.5x)
- **Break Deduction**: Automatically excluded from billable hours

## Testing

To test the bidirectional calculation:

1. Open timesheet entry modal
2. Click "Add time details"
3. Enter start/end times → verify hours auto-calculate
4. Edit hours field → verify end time recalculates
5. Change break → verify hours update
6. Save and verify all data persists

## Previous Behavior vs New Behavior

### ❌ Before
- Hours field was **read-only** when times were entered
- Showed "Auto" badge
- Could only adjust by changing times
- Users complained about blocked field

### ✅ Now
- Hours field is **always editable**
- No "Auto" badge (removed the confusion)
- Edit hours → recalculates end time
- Edit times → recalculates hours
- **Bidirectional sync** ✨

## Files Modified

- `/components/timesheets/forms/MultiTaskEditor.tsx`
  - Updated `handleUpdateTask` logic
  - Removed `readOnly` attribute from Hours input
  - Removed "Auto" badge display
  - Added end time recalculation when hours change

## Credits

Requested by user feedback: "I cannot even insert total time it is blocked"  
Implemented: Bidirectional calculation for flexible time entry
