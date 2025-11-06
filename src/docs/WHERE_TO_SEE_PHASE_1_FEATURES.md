# Where to See Phase 1 Features - Step by Step Guide

## Quick Answer: How to See the New Features

### Step 1: Open the App
Navigate to `/timesheets` or wherever TimesheetDemo is rendered

### Step 2: Select "Company Owner" Persona
In the top-right dropdown, select:
```
[Building Icon] Company Owner
Vendor with team
```

### Step 3: Look for These UI Elements

You should immediately see **ALL** of these new elements:

---

## 🎯 Feature 1: Contractor Role Layer (NEW TABLE)

**Where**: Right below the header "Team Timesheets", **above** the "Viewing Timesheet" card

**What you'll see**:
```
┌─ Team Contractors ─────────────────────────────────────┐
│ [All Roles ▼] [All Status ▼]          [☑ Select All] │
├────────────────────────────────────────────────────────┤
│ Contractor  │ Role      │ Default │ This Month │ Status│
├────────────────────────────────────────────────────────┤
│ ☐ SC Sarah  │ Developer │ 8h/day  │ 38.5h     │🟡Pending│
│ ☐ IM Ian    │ Developer │ 8h/day  │ 38.5h     │🟡Pending│
│ ☐ LP Lisa   │ Developer │ 8h/day  │ 38.5h     │🟡Pending│
└────────────────────────────────────────────────────────┘
```

**Try these interactions**:
1. ✅ Click a checkbox → Row turns blue, checkbox fills
2. ✅ Click "Select All" → All checkboxes fill
3. ✅ Click on a row (not the checkbox) → Should also toggle selection
4. ✅ Click role filter → Dropdown appears
5. ✅ Click status filter → Dropdown appears

**Current issue**: The role/status are currently showing "Developer" for all (mock data). This is expected - in production it would fetch real data.

---

## 🎯 Feature 2: Selection Badge (BELOW CALENDAR TOGGLE)

**Where**: Below the Contractor Role Layer, next to "Calendar/List" toggle

**What you'll see WHEN contractors are selected**:

Before selecting (nothing shows):
```
[●Calendar] [○List]                          
```

After selecting 2 contractors:
```
[●Calendar] [○List]  [👥 2 selected]  [Clear Selection]
                      ↑ THIS IS NEW!
```

**Try this**:
1. ✅ Select 0 contractors → Badge **disappears**
2. ✅ Select 1 contractor → See "[👥 1 selected]"
3. ✅ Select 2 contractors → See "[👥 2 selected]"
4. ✅ Click "Clear Selection" → Badge **disappears**, checkboxes clear

---

## 🎯 Feature 3: Copy Last Week Button (TOP RIGHT)

**Where**: Top-right corner of the page, in the header section

**What you'll see**:
```
Team Timesheets                [📋 Copy Last Week] [📥 Export]
                                ↑ THIS IS NEW!
```

**Try this**:
1. ✅ Click "Copy Last Week" button
2. ✅ Dialog appears with date ranges
3. ✅ All contractors pre-selected
4. ✅ Click "Copy Hours for 3 Contractors"
5. ✅ Toast notification appears

---

## 🎯 Feature 4: Smart Export (TOP RIGHT)

**Where**: Next to "Copy Last Week" button

**What you'll see**:
```
[📥 Export]
```

**Try this**:
1. ✅ No selection → Click "Export" → Toast says "Exporting all contractors..."
2. ✅ Select 2 contractors → Click "Export" → Toast says "Exporting 2 contractors..."
3. ✅ Context-aware behavior!

---

## Visual Layout Map

Here's the EXACT layout you should see:

```
┌──────────────────────────────────────────────────────────────┐
│ WorkGraph Timesheet System    [Persona Dropdown: Company Owner]│
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ Team Timesheets              [Copy Last Week] [Export]       │ ← Feature 3 & 4
│ Manage and review timesheets for all 3 contractors           │
└──────────────────────────────────────────────────────────────┘

┌─ Team Contractors ────────────────────────────────────────── ← Feature 1
│ [All Roles ▼] [All Status ▼]          [☑ Select All]        │
├──────────────────────────────────────────────────────────────┤
│ ☐  SC  Sarah Chen    Developer   8h/day   38.5h  🟡 Pending │ ← Click to select
│ ☐  IM  Ian Mitchell  Developer   8h/day   38.5h  🟡 Pending │
│ ☐  LP  Lisa Park     Developer   8h/day   38.5h  🟡 Pending │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ 👥 Viewing Timesheet                                         │
│ [All Contractors ▼───────────────────────────────────────]   │
│                                                              │
│ Total: 392h | Approved: 280h | Pending: 72h | Draft: 32h   │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ [●Calendar] [○List]  [👥 2 selected]  [Clear Selection]     │ ← Feature 2
└──────────────────────────────────────────────────────────────┘
                        ↑ Appears when contractors selected

[Calendar View Below]
```

---

## Troubleshooting: "I Don't See It!"

### Issue 1: No Contractor Role Layer Table

**Check**:
- Are you on "Company Owner" persona? (must be "team-lead" in code)
- Is "All Contractors" selected in the dropdown? (Role layer only shows in aggregate view)

**Solution**:
```typescript
// In TimesheetDemo, make sure:
persona === "team-lead"  // ✅ Company Owner

// In CompanyOwnerUnifiedView:
selectedContractorId === "all-contractors"  // ✅ Aggregate view
```

---

### Issue 2: No Selection Badge

**Check**:
- Have you clicked checkboxes to select contractors?
- The badge ONLY appears when `selectedContractorIds.size > 0`

**Solution**:
1. Click a checkbox in the Contractor Role Layer
2. The badge should appear immediately

**Code location**:
```tsx
// In CompanyOwnerUnifiedView.tsx, line 231-236
{selectedContractorIds.size > 0 && (
  <Badge variant="secondary" className="gap-1">
    <Users className="w-3 h-3" />
    {selectedContractorIds.size} selected
  </Badge>
)}
```

---

### Issue 3: Buttons Not Showing

**Check**:
- Are the buttons in the header section?
- They should be in the top section, NOT in the controls bar

**Code location**:
```tsx
// In CompanyOwnerUnifiedView.tsx, line 92-112
<div className="flex items-center justify-between">
  <div>
    <h2 className="mb-1">Team Timesheets</h2>
    ...
  </div>

  {/* Quick Actions */}
  <div className="flex items-center gap-2">
    <Button onClick={() => setShowCopyLastWeekDialog(true)}>
      <Copy className="w-4 h-4" />
      Copy Last Week
    </Button>
    <Button onClick={handleExport}>
      <FileDown className="w-4 h-4" />
      Export
    </Button>
  </div>
</div>
```

---

## Developer Console Check

Open browser DevTools (F12) and check:

### 1. Check if ContractorRoleLayer is rendering
```javascript
// In Console:
document.querySelector('[class*="Team Contractors"]')
// Should return: <div>... (the table component)
```

### 2. Check selection state
```javascript
// Look for React DevTools
// Find CompanyOwnerUnifiedView component
// Check state: selectedContractorIds
// Should be: Set(0) initially, Set(2) after selecting 2
```

### 3. Check if components are imported
```javascript
// Check Network tab for:
- ContractorRoleLayer.tsx loaded
- CopyLastWeekDialog.tsx loaded
```

---

## Expected Behavior Flow

### Scenario: Select 2 Contractors

**Step 1**: Open Company Owner view
```
ContractorRoleLayer visible: ✅
All checkboxes unchecked: ✅
Selection badge hidden: ✅
```

**Step 2**: Click Sarah Chen checkbox
```
Sarah's row turns blue: ✅
Checkbox fills: ✅
Selection badge appears: "[👥 1 selected]" ✅
```

**Step 3**: Click Ian Mitchell checkbox
```
Ian's row turns blue: ✅
Both checkboxes filled: ✅
Selection badge updates: "[👥 2 selected]" ✅
Clear Selection button appears: ✅
```

**Step 4**: Click "Clear Selection"
```
All rows turn white: ✅
All checkboxes unchecked: ✅
Selection badge disappears: ✅
```

---

## Mock Data Verification

The contractors you should see:

```typescript
// From TimesheetDemo.tsx line 32-36
"team-lead": [
  { id: "c1", name: "Sarah Chen", initials: "SC", company: "Acme Corp" },
  { id: "c2", name: "Ian Mitchell", initials: "IM", company: "Acme Corp" },
  { id: "c3", name: "Lisa Park", initials: "LP", company: "Acme Corp" }
]
```

**Enhanced in CompanyOwnerUnifiedView** (line 53-61):
```typescript
const contractorData: ContractorData[] = contractors.map(c => ({
  ...c,
  role: "Developer",        // ← Mock data
  defaultHours: 8,
  status: "pending",        // ← Mock data
  totalHours: 38.5,        // ← Mock data
  approvedHours: 24,       // ← Mock data
  pendingHours: 14.5,      // ← Mock data
}));
```

---

## What Each Feature Does

### 1. Contractor Role Layer
**Purpose**: Show all contractors at a glance with their status
**Interaction**: Click to select for batch operations
**State**: Managed by `selectedContractorIds` Set

### 2. Selection Badge
**Purpose**: Visual feedback for multi-select
**Visibility**: Only when `selectedContractorIds.size > 0`
**Updates**: Real-time as you select/deselect

### 3. Copy Last Week
**Purpose**: Quick recurring hour entry
**Opens**: CopyLastWeekDialog component
**Result**: Toast notification + console log

### 4. Smart Export
**Purpose**: Context-aware export
**Behavior**: Changes based on selection state
**Feedback**: Toast notification

---

## Quick Test Checklist

Run through this checklist:

**Setup**:
- [ ] Open app
- [ ] Navigate to timesheet demo
- [ ] Select "Company Owner" persona

**Contractor Role Layer**:
- [ ] Table visible with 3 contractors
- [ ] Checkboxes present
- [ ] Role filter dropdown works
- [ ] Status filter dropdown works
- [ ] "Select All" checkbox works

**Multi-Select**:
- [ ] Click individual checkbox → row selects
- [ ] Click row → row selects
- [ ] Multiple selections work
- [ ] Selection state persists when scrolling

**Selection Badge**:
- [ ] Badge hidden when 0 selected
- [ ] Badge shows "1 selected" when 1 checked
- [ ] Badge shows "2 selected" when 2 checked
- [ ] Badge updates in real-time

**Buttons**:
- [ ] "Copy Last Week" button visible
- [ ] "Export" button visible
- [ ] Both in top-right header area

**Dialogs**:
- [ ] "Copy Last Week" opens dialog
- [ ] Dialog shows date ranges
- [ ] Dialog allows contractor selection
- [ ] "Export" shows toast notification

---

## Still Not Seeing It?

If you've checked everything and still don't see the features:

### 1. Check Browser Console for Errors
```
F12 → Console tab
Look for:
❌ Module not found
❌ TypeError
❌ Failed to compile
```

### 2. Check React DevTools
```
F12 → Components tab
Search for: "CompanyOwnerUnifiedView"
Check props: contractors (should have 3 items)
Check state: selectedContractorIds (should be Set)
```

### 3. Verify File Exists
```bash
ls components/timesheets/ContractorRoleLayer.tsx
ls components/timesheets/CopyLastWeekDialog.tsx
```

### 4. Check Imports in CompanyOwnerUnifiedView
```typescript
// Line 19-21 should have:
import { ContractorRoleLayer, type ContractorData } from "./ContractorRoleLayer";
import { CopyLastWeekDialog } from "./CopyLastWeekDialog";
import { toast } from "sonner@2.0.3";
```

---

## Expected vs Actual

### Expected: Company Owner View Should Have

1. ✅ Header with "Copy Last Week" + "Export" buttons (top-right)
2. ✅ Contractor Role Layer table (3 rows with checkboxes)
3. ✅ Filter dropdowns (role + status)
4. ✅ "Select All" checkbox
5. ✅ Viewing Timesheet dropdown card
6. ✅ Calendar/List toggle
7. ✅ Selection badge (when contractors selected)
8. ✅ Clear Selection button (when contractors selected)
9. ✅ Calendar view below

### What You Should NOT See

1. ❌ "My Timesheets" tab (removed for company owners)
2. ❌ Personal timesheet section (removed)
3. ❌ Team Timesheets tab (no tabs at all)

---

## Summary

**To see ALL Phase 1 features**:
1. Select "Company Owner" persona
2. Make sure "All Contractors" is selected in dropdown
3. Look for Contractor Role Layer table (above Viewing Timesheet card)
4. Click checkboxes to see selection badge appear
5. Click "Copy Last Week" button (top-right)
6. Click "Export" button (top-right)

**Everything is there** - just need to look in the right place!
