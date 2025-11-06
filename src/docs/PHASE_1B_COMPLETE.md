# Phase 1B: Multi-Person Modal & Drag-to-Copy Conflict Resolution ✅

## Overview

Phase 1B builds on the Phase 1A foundation by adding:
1. **Multi-Person Day Entry Modal** - Unified modal for viewing/editing multiple people's timesheets on a single day
2. **Drag-to-Copy Conflict Resolution** - Smart conflict detection and resolution when copying entries between days

---

## 🎯 What's New in Phase 1B

### 1. Multi-Person Day Entry Modal

**Location:** `/components/timesheets/modal/MultiPersonDayModal.tsx`

A comprehensive modal that appears when clicking on a calendar day, showing:

#### Features:
- **People Chips** - Visual display of everyone with entries on that day
- **Entry List** - Each person's entry with hours, task, status, and billable amount
- **Status Badges** - Draft, Submitted, Approved, Rejected with color coding
- **Individual Actions** - Edit or delete each person's entry
- **Bulk Actions** - Delete all entries at once
- **Collapsible Exceptions Table** - Shows variances, conflicts, and alerts

#### Exception Detection:
The modal automatically detects and displays:

1. **Variance** - People working different hours than the team average
   ```
   Sarah Chen: 10h (2h over average) ⚠️
   ```

2. **Overtime** - Anyone logging more than 8 hours
   ```
   Mike Johnson: 12h logged (4h overtime) 🔴
   ```

3. **Missing Entries** - Selected people without entries on this day
   ```
   Lisa Park: No entry for this day ℹ️
   ```

#### Visual Structure:
```
┌─────────────────────────────────────────────┐
│ 📅 Wednesday, October 16, 2025              │
│ 3 people • 24h total • $2,880               │
├─────────────────────────────────────────────┤
│ 👥 People with entries:                     │
│ [SC Sarah Chen] [IM Ian M.] [LP Lisa Park]  │
│                                             │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                             │
│ Entries                          [+ Add]    │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ SC Sarah Chen            ✓ Approved     │ │
│ │ Hours: 8h  Task: Development            │ │
│ │ Billable: $960                     [✏️] │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ⚠️ Exceptions & Alerts (2)           [▼]   │
│ ┌─────────────────────────────────────────┐ │
│ │ ⚠️ Ian Mitchell                         │ │
│ │    10h (2h over average)       variance │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│               [Delete All]  [Close]  [Done] │
└─────────────────────────────────────────────┘
```

---

### 2. Drag-to-Copy Conflict Resolution Dialog

**Location:** `/components/timesheets/modal/DragDropConflictDialog.tsx`

Smart conflict detection that appears when dragging entries to a day that already has entries for some of the same people.

#### Conflict Resolution Options:

1. **Replace** - Delete existing entries and create new ones
   ```
   Sarah had: 6h Design
   After replace: 8h Development
   ```

2. **Merge** - Keep existing entries and add new ones
   ```
   Sarah had: 6h Design
   After merge: 6h Design + 8h Development (two separate entries)
   ```

3. **Skip** - Only copy entries for people without conflicts
   ```
   Sarah: SKIPPED (already has entry)
   Mike: COPIED (no existing entry)
   Lisa: COPIED (no existing entry)
   ```

#### Visual Flow:
```
Drag Monday → Tuesday (2 people have existing entries)
     ↓
┌───────────────────────────────────────────────┐
│ ⚠️ Copy Entries - Conflicts Detected          │
├───────────────────────────────────────────────┤
│ 2 people already have entries on target day   │
│                                               │
│ Mon, Oct 13  →  Tue, Oct 14  [👥 3 people]   │
│                                               │
│ How to handle conflicts?                      │
│ ○ Replace existing entries (2 affected)      │
│ ● Merge entries (2 will have multiple)       │
│ ○ Skip conflicting people (1 will be copied) │
│                                               │
│ ⚠️ Conflicting Entries (2)                   │
│ ┌───────────────────────────────────────────┐ │
│ │ Sarah Chen                                │ │
│ │ Existing: 6h · Design                     │ │
│ │ New: 8h · Development                     │ │
│ └───────────────────────────────────────────┘ │
│                                               │
│ ✓ Clean Entries (1)                          │
│ ┌───────────────────────────────────────────┐ │
│ │ LP Lisa Park                              │ │
│ │ 8h · Development                          │ │
│ └───────────────────────────────────────────┘ │
│                                               │
│                  [Cancel]  [📋 Merge & Copy] │
└───────────────────────────────────────────────┘
```

---

## 🔧 Technical Implementation

### New Components

1. **`MultiPersonDayModal.tsx`**
   - Props: `open`, `date`, `entries`, `people`, `selectedPeopleIds`
   - Callbacks: `onAddEntry`, `onEditEntry`, `onDeleteEntry`, `onDeleteAll`
   - Features: Exception detection, status badges, collapsible sections

2. **`DragDropConflictDialog.tsx`**
   - Props: `open`, `draggedData`, `conflicts`
   - Callbacks: `onConfirm`, `onCancel`
   - Features: Conflict detection, resolution options, entry preview

### Updated Components

**`MultiPersonTimesheetCalendar.tsx`** now includes:
- Modal state management (`dayModalOpen`, `conflictDialogOpen`)
- Click handler that opens day modal (or does multi-select with Ctrl/Shift)
- Enhanced drag-copy handler with conflict detection
- `performCopy()` function that handles resolution strategies

### Type Definitions

```typescript
// Day Entry
interface PersonEntry {
  personId: string;
  personName: string;
  personInitials: string;
  hours: number;
  task: string;
  notes?: string;
  status: "draft" | "submitted" | "approved" | "rejected";
  billableAmount?: number;
}

// Drag Data
interface DraggedData {
  sourceDate: Date;
  targetDate: Date;
  entries: PersonEntry[];
}

// Conflict Entry
interface ConflictingEntry {
  personId: string;
  personName: string;
  existingHours: number;
  existingTask: string;
  newHours: number;
  newTask: string;
}

// Resolution Type
type ConflictResolution = "replace" | "merge" | "skip";
```

---

## 🎮 How to Use (User Guide)

### Opening the Day Modal

**Method 1: Direct Click**
```
Click any calendar day → Day modal opens
```

**Method 2: After Multi-Select**
```
Ctrl+Click multiple days → Select action → Modal opens
```

### Drag-to-Copy Workflow

**No Conflicts:**
```
1. Hover over day with entries
2. See drag handle (⋮⋮) appear
3. Drag to target day
4. Entries copied instantly ✓
```

**With Conflicts:**
```
1. Drag Monday → Tuesday
2. Conflict dialog appears
3. Choose resolution:
   - Replace: Overwrite existing
   - Merge: Keep both
   - Skip: Copy only clean entries
4. Click "Merge & Copy"
5. Done! ✓
```

---

## 📊 Exception Detection Logic

### Variance Detection
```typescript
const avgHours = totalHours / entries.length;
entries.forEach(entry => {
  const variance = Math.abs(entry.hours - avgHours);
  if (variance > 1) {
    // Show variance warning
    severity = variance > 2 ? "warning" : "info";
  }
});
```

### Overtime Detection
```typescript
if (entry.hours > 8) {
  exceptions.push({
    type: "overtime",
    severity: entry.hours > 10 ? "error" : "warning"
  });
}
```

### Missing Entry Detection
```typescript
selectedPeopleIds.forEach(personId => {
  if (!entries.some(e => e.personId === personId)) {
    exceptions.push({
      type: "missing",
      severity: "info"
    });
  }
});
```

---

## 🎨 Design Patterns

### Modal Consistency
Both modals follow the same Apple-inspired design:
- ✅ Clean headers with icon + title
- ✅ Descriptive subtitles
- ✅ Scrollable content area
- ✅ Fixed footer with actions
- ✅ Max-width and max-height constraints

### Color Coding
```css
Draft:     gray    (Circle icon)
Submitted: yellow  (Clock icon)
Approved:  green   (CheckCircle2 icon)
Rejected:  red     (XCircle icon)

Exception Severity:
Info:      blue
Warning:   yellow
Error:     red
```

### Interaction States
- Hover: Subtle background change (`hover:bg-accent/5`)
- Focus: Ring with accent color
- Disabled: Opacity 50%
- Loading: Spinner + disabled state

---

## 🚀 Future Enhancements (Phase 2)

1. **Inline Editing** - Edit hours/task directly in modal without separate dialog
2. **Batch Copy** - Select multiple source days and copy to multiple targets
3. **Smart Suggestions** - AI-powered conflict resolution recommendations
4. **Undo/Redo** - Revert recent drag-copy operations
5. **Keyboard Shortcuts** - `E` to edit, `D` to delete, `Esc` to close
6. **Export Modal Data** - Download day summary as CSV/PDF
7. **Comments/Notes** - Add manager notes visible to team
8. **Approval Workflow** - Approve/reject directly from modal

---

## 📁 File Structure

```
components/
  timesheets/
    modal/
      MultiPersonDayModal.tsx          ← NEW
      DragDropConflictDialog.tsx       ← NEW
    drag-drop/
      MultiPersonCalendarCell.tsx      (uses modals)
    MultiPersonTimesheetCalendar.tsx   (orchestrates modals)
```

---

## ✅ Testing Checklist

### Day Modal
- [ ] Opens when clicking calendar day
- [ ] Shows correct date and entries
- [ ] Displays people chips for all contributors
- [ ] Calculates total hours correctly
- [ ] Detects variance exceptions
- [ ] Detects overtime exceptions
- [ ] Detects missing entries
- [ ] Exceptions table expands/collapses
- [ ] Edit button triggers edit flow (stub)
- [ ] Delete button removes entry (stub)
- [ ] Delete All button clears all entries (stub)

### Conflict Dialog
- [ ] Appears when dragging to day with conflicts
- [ ] Shows source and target dates
- [ ] Lists conflicting people
- [ ] Lists clean (non-conflicting) people
- [ ] Replace option works
- [ ] Merge option works
- [ ] Skip option works
- [ ] Cancel dismisses without action
- [ ] Confirm executes selected resolution

### Integration
- [ ] Click opens modal (no Ctrl/Shift)
- [ ] Ctrl+Click does multi-select (doesn't open modal)
- [ ] Shift+Click does range select
- [ ] Drag with no conflicts copies instantly
- [ ] Drag with conflicts shows dialog
- [ ] Toast notifications appear on success

---

## 🎉 Summary

**Phase 1B is complete!** We now have:

✅ **Multi-Person Day Modal** - View/edit all entries for a day  
✅ **Drag-to-Copy with Conflicts** - Smart resolution when entries overlap  
✅ **Exception Detection** - Variance, overtime, and missing entry alerts  
✅ **3 Resolution Strategies** - Replace, Merge, or Skip conflicts  
✅ **Apple-Inspired Design** - Consistent, polished, professional UI  

**Next Phase:** Phase 1C will add the actual edit forms, state management, and API integration to make everything fully functional.
