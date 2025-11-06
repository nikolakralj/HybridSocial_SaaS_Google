# Copy to Others: Month Feature Added ✅

## What Changed

Added **"This Month"** option to the "Apply to Others" dialog, allowing bulk copying of timesheet entries for an entire month.

---

## How It Works

### **Date Range Options**

When you click "Copy to others" on any day, you now have 3 options:

1. **This Day Only** 
   - Copies entries from the clicked date only
   - Example: Click SAT → Copy SAT's 8.9h to other people's SAT

2. **This Week (Mon-Sun)**
   - Copies entries from all 7 days of the week
   - Example: Click SAT → Copy MON 8.9h, TUE 8.7h, WED 6.5h... to other people's same days

3. **This Month** ✨ NEW
   - Copies entries from all days in the month (1st - 31st)
   - Example: Click Jan 15 → Copy all of January's entries to other people

---

## Logic Behavior

### Smart Date Matching
The system intelligently copies **date-to-date**:

```typescript
// For EACH target date in the range
for (const targetDate of targetDates) {
  // Get the SOURCE contractor's entry for THIS SPECIFIC DATE
  const sourceEntry = contractor.entries[targetDate];
  
  // Copy THAT date's entry to the target person's SAME date
  onUpdateContractorEntries(personId, targetDate, newEntry);
}
```

### What Gets Copied Per Day
- Hours worked
- Start/end times
- Break minutes
- Task descriptions
- Notes

### What Gets Skipped
- Days where the source contractor has NO entries
- Days where target already has entries (if "Skip existing" is selected)

---

## Example Scenarios

### Scenario 1: Copy Full Month Pattern
**Use Case:** Sarah worked a consistent schedule all January. Copy to 3 new contractors.

```
Source (Sarah - January):
  Jan 1: 8h, Jan 2: 8h, Jan 3: 8h ... Jan 31: 8h

Action: Click any January date → "This Month" → Select 3 people

Result:
  ✅ Person A gets all January entries (8h × 31 days)
  ✅ Person B gets all January entries (8h × 31 days)
  ✅ Person C gets all January entries (8h × 31 days)
```

### Scenario 2: Copy Partial Month with Gaps
**Use Case:** John only worked weekdays in January.

```
Source (John - January):
  Jan 1 (Mon): 8h
  Jan 2 (Tue): 8h
  Jan 6 (Sat): [empty]
  Jan 7 (Sun): [empty]
  ...

Action: Click Jan 15 → "This Month" → Select Mike

Result:
  ✅ Mike gets Jan 1: 8h
  ✅ Mike gets Jan 2: 8h
  ⏭️ Jan 6-7 skipped (source has no entries)
```

### Scenario 3: Overwrite vs Skip
**Use Case:** Target already has some entries.

```
Source (Alice - January): All days filled
Target (Bob - January): Jan 1-10 already filled

Action: Click Jan 15 → "This Month" → Select Bob

With "Skip existing" (default):
  ⏭️ Jan 1-10 skipped (Bob already has entries)
  ✅ Jan 11-31 copied (21 days)
  
With "Overwrite existing":
  ⚠️ Jan 1-10 replaced with Alice's entries
  ✅ Jan 11-31 copied
  Result: All 31 days now match Alice
```

---

## UI Preview

The dialog now shows:

```
Date Range
○ This day only
   Jan 15

○ This week (Mon-Sun)
   Jan 13 - Jan 19

○ This month
   Jan 1 - Jan 31

Preview
Will create 93 timesheet entries
3 employees × 31 days × 8h
```

---

## Performance Considerations

### Month Copying
- Maximum: 31 days × N people = 31N operations
- Each operation creates new entries with unique IDs
- Operations are atomic (all or nothing per person)

### Progress Feedback
Toast notifications show results:
- ✅ "Copied 93 days"
- ℹ️ "Copied 85 days, skipped 8 existing"
- ⚠️ "No entries to copy"

---

## Technical Implementation

### Files Modified

1. **`/components/timesheets/ApplyToOthersDialog.tsx`**
   - Added `'month'` to `dateRangeType` type
   - Added month radio button option
   - Updated `getDateRange()` to calculate month dates

2. **`/components/timesheets/table/TimesheetTableRow.tsx`**
   - Updated `handleApplyToOthers` params type
   - Added month case to `getDatesInRange()`
   - Month logic: Gets all days from 1st to last day of month

### Date Calculation Logic

```typescript
// Month: All days in the month
const year = copySourceDate.getFullYear();
const month = copySourceDate.getMonth();
const daysInMonth = new Date(year, month + 1, 0).getDate();

return Array.from({ length: daysInMonth }, (_, i) => {
  return new Date(year, month, i + 1);
});
```

---

## Testing

### How to Test
1. Go to **Company Owner → Timesheets** tab
2. Add entries for multiple days/weeks in a month
3. Right-click any cell → **"Copy to others"**
4. Select **"This month"**
5. Select target employees
6. Click "Apply"

### Expected Behavior
- All days in the month with source entries should copy
- Empty days should be skipped
- Target receives date-matched entries
- Toast shows accurate count

---

## Benefits

✅ **Bulk onboarding**: Copy template schedules to new contractors  
✅ **Consistent patterns**: Replicate proven work schedules  
✅ **Time savings**: 1-click copy vs manual entry for 30+ days  
✅ **Accuracy**: Automated copying eliminates manual errors  
✅ **Flexibility**: Overwrite or skip existing entries

---

## Next Steps

Possible future enhancements:
- **Custom date range picker**: "Copy from Jan 15 - Feb 15"
- **Pattern detection**: "Copy this pattern: Mon-Fri, 8h, skip weekends"
- **Bulk adjustments**: "Copy but reduce hours by 20%"
- **Approval templates**: "Copy + auto-submit for approval"
