# Phase 1 - Visual Screenshot Guide

## What You Should See - Annotated Layout

### Full Page View - Company Owner

```
┌───────────────────────────────────────────────────────────────────────┐
│ WorkGraph Timesheet System         [🏢 Company Owner ▼]             │
│ Unified interface with role-based permissions                        │
└───────────────────────────────────────────────────────────────────────┘
    ↑ Top bar - select Company Owner here


┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ ① HEADER WITH QUICK ACTIONS                                        ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                                     ┃
┃  Team Timesheets              [📋 Copy Last Week] [📥 Export]      ┃ ← NEW!
┃  Manage and review timesheets for all 3 contractors                ┃
┃                                                                     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛


┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ ② CONTRACTOR ROLE LAYER (NEW TABLE)                                ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ Team Contractors                                  [3 contractors]   ┃
┃                                                                     ┃
┃ [All Roles ▼] [All Status ▼]              [☐ Select All]          ┃ ← Filters
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ ☐   Contractor    │ Role      │ Default │ This Month  │ Status    ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ ☐  SC Sarah Chen  │ Developer │ 8h/day  │ 38.5h total │🟡 Pending┃ ← Click to
┃                   │           │         │ 24h approved│           ┃   select
┃                   │           │         │ 14.5h pending│          ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ ☐  IM Ian Mitchell│ Developer │ 8h/day  │ 38.5h total │🟡 Pending┃
┃                   │           │         │ 24h approved│           ┃
┃                   │           │         │ 14.5h pending│          ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ ☐  LP Lisa Park   │ Developer │ 8h/day  │ 38.5h total │🟡 Pending┃
┃                   │           │         │ 24h approved│           ┃
┃                   │           │         │ 14.5h pending│          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   ↑ This entire table is NEW in Phase 1


┌───────────────────────────────────────────────────────────────────────┐
│ 👥 Viewing Timesheet                                                  │
│                                                                       │
│ [All Contractors ▼──────────────────────────────────────────────]    │
│                                                                       │
│ ────────────────────────────────────────────────────────────────────│
│                                                                       │
│ Total Logged     Approved       Pending        Draft                 │
│ 392h             280h           72h            32h                    │
└───────────────────────────────────────────────────────────────────────┘


┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ ③ SELECTION STATE (APPEARS WHEN CONTRACTORS SELECTED)              ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                                     ┃
┃ [●Calendar] [○List]  [👥 2 selected]  [Clear Selection]           ┃ ← NEW!
┃                       ↑ Badge appears when selecting                ┃
┃                                                                     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛


┌───────────────────────────────────────────────────────────────────────┐
│                         OCTOBER 2025                                  │
│                                                                       │
│ [Calendar view with days...]                                         │
└───────────────────────────────────────────────────────────────────────┘
```

---

## Interaction States

### State 1: Nothing Selected (Initial State)

```
┌─ Team Contractors ───────────────────────────────────┐
│ [All Roles ▼] [All Status ▼]      [☐ Select All]    │
├──────────────────────────────────────────────────────┤
│ ☐  SC Sarah Chen    Developer   8h/day   38.5h  🟡  │ ← All unchecked
│ ☐  IM Ian Mitchell  Developer   8h/day   38.5h  🟡  │
│ ☐  LP Lisa Park     Developer   8h/day   38.5h  🟡  │
└──────────────────────────────────────────────────────┘

[●Calendar] [○List]                                     ← No badge
```

---

### State 2: One Contractor Selected

```
┌─ Team Contractors ───────────────────────────────────┐
│ [All Roles ▼] [All Status ▼]      [☐ Select All]    │
├──────────────────────────────────────────────────────┤
│ ☑  SC Sarah Chen    Developer   8h/day   38.5h  🟡  │ ← Checked + Blue BG
│ ☐  IM Ian Mitchell  Developer   8h/day   38.5h  🟡  │
│ ☐  LP Lisa Park     Developer   8h/day   38.5h  🟡  │
└──────────────────────────────────────────────────────┘

[●Calendar] [○List]  [👥 1 selected]  [Clear]          ← Badge shows!
```

---

### State 3: Two Contractors Selected

```
┌─ Team Contractors ───────────────────────────────────┐
│ [All Roles ▼] [All Status ▼]      [☐ Select All]    │
├──────────────────────────────────────────────────────┤
│ ☑  SC Sarah Chen    Developer   8h/day   38.5h  🟡  │ ← Both checked
│ ☑  IM Ian Mitchell  Developer   8h/day   38.5h  🟡  │ ← Blue backgrounds
│ ☐  LP Lisa Park     Developer   8h/day   38.5h  🟡  │
└──────────────────────────────────────────────────────┘

[●Calendar] [○List]  [👥 2 selected]  [Clear]          ← Badge updates!
```

---

### State 4: All Selected

```
┌─ Team Contractors ───────────────────────────────────┐
│ [All Roles ▼] [All Status ▼]      [☑ Select All]    │ ← Master checked
├──────────────────────────────────────────────────────┤
│ ☑  SC Sarah Chen    Developer   8h/day   38.5h  🟡  │ ← All checked
│ ☑  IM Ian Mitchell  Developer   8h/day   38.5h  🟡  │ ← All blue
│ ☑  LP Lisa Park     Developer   8h/day   38.5h  🟡  │
└──────────────────────────────────────────────────────┘

[●Calendar] [○List]  [👥 3 selected]  [Clear]          ← Badge shows 3
```

---

## Copy Last Week Dialog

When you click "Copy Last Week" button:

```
┌─ Copy Last Week's Hours ──────────────────────────────┐
│                                                        │
│  📅 Copy From                📅 Copy To               │
│  ┌────────────────────┐      ┌────────────────────┐  │
│  │ Oct 6 - Oct 12     │  →   │ Oct 13 - Oct 19    │  │
│  │ 120h total logged  │      │ This week (current)│  │
│  └────────────────────┘      └────────────────────┘  │
│                                                        │
│  ⚠️ Important                                         │
│  This will copy all hours, tasks, and notes from      │
│  last week. Existing entries will not be overwritten. │
│                                                        │
│  👥 Select Contractors                  [3 selected]  │
│  ┌────────────────────────────────────────────────┐  │
│  │ ☑  SC  Sarah Chen                              │  │
│  │ ☑  IM  Ian Mitchell                            │  │ ← All pre-selected
│  │ ☑  LP  Lisa Park                               │  │
│  └────────────────────────────────────────────────┘  │
│                                                        │
│             [Cancel] [Copy Hours for 3 Contractors]   │
└────────────────────────────────────────────────────────┘
```

---

## How to Test Each Feature

### ✅ Test 1: Contractor Role Layer Visible

**Expected**: Table with 3 rows above "Viewing Timesheet" card

**Steps**:
1. Open app
2. Select "Company Owner" 
3. Look for table with checkboxes

**Result**: Table visible ✅

---

### ✅ Test 2: Checkboxes Work

**Expected**: Clicking checkbox or row selects contractor

**Steps**:
1. Click checkbox for Sarah Chen
2. Row should turn blue
3. Checkbox should fill

**Result**: Selection works ✅

---

### ✅ Test 3: Selection Badge Appears

**Expected**: Badge appears when contractors selected

**Steps**:
1. Select 0 contractors → No badge
2. Click Sarah's checkbox → "[👥 1 selected]" appears
3. Click Ian's checkbox → "[👥 2 selected]" appears
4. Click "Clear Selection" → Badge disappears

**Result**: Badge shows/hides correctly ✅

---

### ✅ Test 4: Copy Last Week Button Works

**Expected**: Button opens dialog

**Steps**:
1. Click "Copy Last Week" (top-right)
2. Dialog appears
3. See date ranges
4. Click "Copy Hours"
5. Toast notification appears

**Result**: Dialog works ✅

---

### ✅ Test 5: Export Button Works

**Expected**: Context-aware toast

**Steps**:
1. No selection → Click Export → "Exporting all contractors..."
2. Select 2 → Click Export → "Exporting 2 contractors..."

**Result**: Smart export works ✅

---

## Common Issues & Solutions

### Issue: "I don't see the Contractor Role Layer"

**Cause**: Not in aggregate view

**Solution**: Make sure "All Contractors" is selected in dropdown

**Check**:
```
Dropdown should say: "All Contractors"
NOT: "Sarah Chen" or any individual
```

---

### Issue: "Selection badge never appears"

**Cause**: Not clicking checkboxes

**Solution**: Click a checkbox in the Contractor Role Layer table

**Check**:
```
Did you click the checkbox (☐)?
Row should turn blue when selected
```

---

### Issue: "Buttons not in header"

**Cause**: Looking in wrong place

**Solution**: Look at very top of page, same row as "Team Timesheets"

**Check**:
```
Team Timesheets              [Copy Last Week] [Export]
↑ Same row!
```

---

## What You Should NOT See

### ❌ Things Removed for Company Owner:

1. **No "My Timesheets" tab** - Company owners don't track personal hours
2. **No personal timesheet section** - Team management only
3. **No tabs at all** - Single unified view

### ✅ Things You SHOULD See:

1. **Contractor Role Layer table** - With checkboxes
2. **Selection badge** - When contractors selected
3. **Copy Last Week button** - Top-right header
4. **Export button** - Top-right header
5. **Clear Selection button** - When contractors selected

---

## Summary Checklist

Before reporting "I don't see it":

- [ ] Selected "Company Owner" persona (not Solo Freelancer)
- [ ] "All Contractors" selected in dropdown (not individual)
- [ ] Looking above "Viewing Timesheet" card for table
- [ ] Clicked at least one checkbox to trigger badge
- [ ] Looking in top-right for "Copy Last Week" button
- [ ] Looking in top-right for "Export" button
- [ ] Checked browser console for errors
- [ ] Hard refreshed page (Ctrl+Shift+R)

**If all checked and still not visible → There's a real bug!**

---

## Expected Component Tree

```
CompanyOwnerUnifiedView
├── Header
│   ├── Title: "Team Timesheets"
│   └── Quick Actions
│       ├── Copy Last Week Button ✅
│       └── Export Button ✅
│
├── ContractorRoleLayer ✅ (NEW - only if aggregate view)
│   ├── Filters (Role + Status)
│   ├── Select All checkbox
│   └── Contractor rows with checkboxes
│
├── Contractor Selector Card
│   └── Dropdown ("All Contractors")
│
├── Controls Bar
│   ├── View Toggle (Calendar/List)
│   ├── Selection Badge ✅ (NEW - only if selected)
│   └── Clear Selection Button ✅ (NEW - only if selected)
│
├── Calendar/List View
│
└── CopyLastWeekDialog ✅ (NEW - when dialog open)
    └── Date ranges, contractor selection, confirm
```

---

**All features are implemented and should be visible!**
