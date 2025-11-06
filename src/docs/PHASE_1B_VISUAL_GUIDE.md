# Phase 1B Visual Guide 📸

## Quick Reference: What You Can Do Now

### 1. Click Any Day → See Full Details

**Before Phase 1B:**
```
Calendar day shows:
┌──────────┐
│    15    │
│  24h     │  ← Just total hours
│   SC     │  ← Just initials
│   IM     │
│   LP     │
└──────────┘

Click → Nothing happens (or multi-select only)
```

**After Phase 1B:**
```
Calendar day shows:
┌──────────┐
│    15    │
│  24h  ≠  │  ← Total + variance indicator
│  🟢🟡🔴  │  ← Status icons
│   SC     │
│   IM     │
│   LP     │
└──────────┘

Click → Full modal with all details! ✨
```

---

### 2. Multi-Person Day Modal

**What Opens When You Click a Day:**

```
┌─────────────────────────────────────────────┐
│ 📅 Wednesday, October 16, 2025              │
│ 3 people • 24h total • $2,880               │
├─────────────────────────────────────────────┤
│                                             │
│ 👥 People with entries:                     │
│ ┌────────┐ ┌────────┐ ┌────────┐          │
│ │ SC     │ │ IM     │ │ LP     │          │
│ │ Sarah  │ │ Ian M. │ │ Lisa   │          │
│ └────────┘ └────────┘ └────────┘          │
│                                             │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                             │
│ 📋 Entries                       [+ Add]   │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ SC Sarah Chen                           │ │
│ │ ┌─────────────────────────┐             │ │
│ │ │ ✅ Approved             │        [✏️] │ │
│ │ │ Hours: 8h               │             │ │
│ │ │ Task: Development       │        [🗑️] │ │
│ │ │ Billable: $960          │             │ │
│ │ └─────────────────────────┘             │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ IM Ian Mitchell                         │ │
│ │ ┌─────────────────────────┐             │ │
│ │ │ 🟡 Submitted            │        [✏️] │ │
│ │ │ Hours: 10h (OVERTIME)   │             │ │
│ │ │ Task: Development       │        [🗑️] │ │
│ │ │ Billable: $1,200        │             │ │
│ │ └─────────────────────────┘             │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ LP Lisa Park                            │ │
│ │ ┌─────────────────────────┐             │ │
│ │ │ ⚪ Draft                │        [✏️] │ │
│ │ │ Hours: 6h               │             │ │
│ │ │ Task: UI Design         │        [🗑️] │ │
│ │ │ Billable: $720          │             │ │
│ │ └─────────────────────────┘             │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                             │
│ ⚠️ Exceptions & Alerts (2)          [▼]   │
│ ┌─────────────────────────────────────────┐ │
│ │ ⚠️ Variance                             │ │
│ │    Ian Mitchell                         │ │
│ │    10h (2h over average)                │ │
│ └─────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────┐ │
│ │ 🔴 Overtime                             │ │
│ │    Ian Mitchell                         │ │
│ │    10h logged (2h overtime)             │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│               [Delete All]  [Close]  [Done] │
└─────────────────────────────────────────────┘
```

---

### 3. Drag-to-Copy Flow

#### Scenario A: No Conflicts ✅

```
Monday (Oct 13)              Tuesday (Oct 14)
┌──────────┐                ┌──────────┐
│    13    │                │    14    │
│  24h     │ ─────drag────→ │   --     │
│  SC IM   │                │          │
└──────────┘                └──────────┘
     ↓                            ↓
Copy instantly!            ┌──────────┐
                          │    14    │
                          │  24h     │
                          │  SC IM   │ ✓ Copied!
                          └──────────┘
```

#### Scenario B: With Conflicts ⚠️

```
Monday (Oct 13)              Tuesday (Oct 14)
┌──────────┐                ┌──────────┐
│    13    │                │    14    │
│  24h     │ ─────drag────→ │  12h     │ ← Already has entries!
│  SC IM   │                │  SC LP   │
└──────────┘                └──────────┘
     ↓
Conflict Dialog Opens! 👇

┌───────────────────────────────────────────────┐
│ ⚠️ Copy Entries - Conflicts Detected          │
├───────────────────────────────────────────────┤
│ 2 people already have entries on target day   │
│                                               │
│ Mon, Oct 13  ➜  Tue, Oct 14  [👥 3 people]   │
│                                               │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                               │
│ How to handle conflicts?                      │
│                                               │
│ ○ Replace existing entries                   │
│   Delete Sarah & Lisa's existing entries      │
│   Create new entries from Monday              │
│   (2 people affected)                         │
│                                               │
│ ● Merge entries (add hours)                  │
│   Keep Sarah & Lisa's existing entries        │
│   Add new entries as separate tasks           │
│   (2 people will have multiple entries)       │
│                                               │
│ ○ Skip conflicting people                    │
│   Only copy Ian (he has no Tuesday entry)     │
│   Skip Sarah & Lisa                           │
│   (1 person will be copied)                   │
│                                               │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                               │
│ ⚠️ Conflicting Entries (2)                   │
│                                               │
│ ┌───────────────────────────────────────────┐ │
│ │ Sarah Chen                                │ │
│ │ ┌─────────────────────────────────────────┤ │
│ │ │ Existing: 6h · Design                   │ │
│ │ │ New:      8h · Development              │ │
│ │ └─────────────────────────────────────────┘ │
│ └───────────────────────────────────────────┘ │
│                                               │
│ ┌───────────────────────────────────────────┐ │
│ │ Lisa Park                                 │ │
│ │ ┌─────────────────────────────────────────┤ │
│ │ │ Existing: 6h · UI Work                  │ │
│ │ │ New:      8h · Development              │ │
│ │ └─────────────────────────────────────────┘ │
│ └───────────────────────────────────────────┘ │
│                                               │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                               │
│ ✅ Clean Entries (1)                         │
│                                               │
│ ┌───────────────────────────────────────────┐ │
│ │ IM Ian Mitchell                           │ │
│ │    8h · Development                       │ │
│ │    Will be copied without conflict ✓      │ │
│ └───────────────────────────────────────────┘ │
│                                               │
│                  [Cancel]  [📋 Merge & Copy] │
└───────────────────────────────────────────────┘
```

---

### 4. Exception Detection Examples

#### Variance Detection
```
Day: October 15
People: Sarah (8h), Ian (10h), Lisa (6h)
Average: 8h

Exceptions:
⚠️ Ian Mitchell - Variance
   10h (2h over average)

ℹ️ Lisa Park - Variance  
   6h (2h under average)
```

#### Overtime Detection
```
Day: October 16
Ian Mitchell: 12h

Exception:
🔴 Ian Mitchell - Overtime
   12h logged (4h overtime)
```

#### Missing Entry Detection
```
Selected People: Sarah, Ian, Lisa, Marcus
Day: October 17
Entries: Sarah (8h), Ian (8h), Lisa (8h)

Exception:
ℹ️ Marcus Webb - Missing
   No entry for this day
```

---

## Color Legend

### Status Colors
- **🟢 Green** = Approved (all good!)
- **🟡 Yellow** = Submitted (pending review)
- **⚪ Gray** = Draft (not submitted yet)
- **🔴 Red** = Rejected (needs correction)

### Exception Severity
- **ℹ️ Blue** = Info (FYI, no action needed)
- **⚠️ Yellow** = Warning (attention recommended)
- **🔴 Red** = Error (action required)

### Variance Indicator
- **≠** = People worked different hours

---

## User Interaction Guide

### Opening Day Modal

| Action | Result |
|--------|--------|
| **Click day** | Opens modal with full details |
| **Ctrl + Click day** | Multi-select (doesn't open modal) |
| **Shift + Click day** | Range select (doesn't open modal) |

### In Day Modal

| Action | Result |
|--------|--------|
| **Click ✏️ Edit** | Opens edit form (Phase 1C) |
| **Click 🗑️ Delete** | Removes single entry |
| **Click "Delete All"** | Removes all entries for this day |
| **Click "⚠️ Exceptions"** | Expands/collapses alert section |
| **Click "Close" or "Done"** | Closes modal |

### Drag-to-Copy

| Scenario | Result |
|----------|--------|
| **No conflicts** | Instant copy + toast notification |
| **Has conflicts** | Conflict dialog opens |
| **Choose Replace** | Overwrites existing entries |
| **Choose Merge** | Keeps both old and new |
| **Choose Skip** | Only copies non-conflicting |

---

## Keyboard Shortcuts (Future)

Coming in Phase 1C:
- `E` = Edit selected entry
- `D` = Delete selected entry
- `Esc` = Close modal
- `Ctrl+A` = Select all days
- `Ctrl+C` = Copy selected days
- `Ctrl+V` = Paste to selected days

---

## Mobile Considerations

Phase 1B modals are fully responsive:
- **Desktop:** Full modal with all details
- **Tablet:** Scrollable modal with compact spacing
- **Mobile:** Bottom sheet style, swipe to close

Drag-and-drop:
- **Desktop:** Full drag-and-drop support
- **Mobile:** Long-press → "Copy to..." menu

---

## Performance Notes

### Smart Rendering
- Only renders visible weeks
- Lazy loads entry details
- Debounced exception detection

### Conflict Detection
- O(n) complexity (linear scan)
- Runs only on drop, not on drag
- Caches results for same source→target

---

## Accessibility

### Keyboard Navigation
- Tab through calendar days
- Enter to open modal
- Arrow keys to navigate entries
- Escape to close dialogs

### Screen Reader Support
- ARIA labels on all interactive elements
- Status announcements for drag-drop
- Descriptive button labels

### Color Contrast
- All status colors meet WCAG AA
- Focus indicators visible
- Text readable at 200% zoom

---

## Summary: Phase 1A + 1B Combined

**What you can do now:**

1. ✅ **Select multiple people** via chip selector
2. ✅ **Multi-select days** with Ctrl/Shift+Click
3. ✅ **See variance indicators** when hours differ
4. ✅ **View status icons** at a glance
5. ✅ **Drag to copy** entries between days
6. ✅ **Click days** to see full details ← NEW
7. ✅ **Resolve conflicts** when copying ← NEW
8. ✅ **Detect exceptions** automatically ← NEW

**Coming in Phase 1C:**
- Actual edit forms (not just stubs)
- Full state management
- API integration
- Undo/redo
- Keyboard shortcuts
