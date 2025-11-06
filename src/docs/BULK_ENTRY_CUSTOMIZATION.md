# 🎯 Bulk Entry with Per-Person Customization

## The Problem

When creating timesheet entries for multiple contractors, you often have:
- **Most people** with the same hours (e.g., Sarah & Mike: 8h/day)
- **One person** with different hours (e.g., Lisa: 6h/day, part-time)

**Old approach:** Create bulk for everyone, then Lisa has to manually edit 20+ entries 😫

**New approach:** Customize Lisa's hours **before** creating entries! ✨

---

## 🚀 How It Works

### Step 1: Select Multiple Contractors

```
┌────────────────────────────────────────┐
│ Select Contractors:      [Select All]  │
├────────────────────────────────────────┤
│ ✓ Sarah Chen    - Senior Engineer      │
│ ✓ Mike Johnson  - Frontend Dev         │
│ ✓ Lisa Park     - UI Designer          │
└────────────────────────────────────────┘
```

### Step 2: Define Base Pattern

```
┌────────────────────────────────────────┐
│ Entry Details:                         │
├────────────────────────────────────────┤
│ Hours/Day: [8.0]    Task: [Development]│
│ Working Days: Mon Tue Wed Thu Fri      │
└────────────────────────────────────────┘

Default: Everyone gets 8h/day, Development
```

### Step 3: Customize Individual Contractors (NEW!)

Click **"Customize"** button to reveal per-person overrides:

```
┌────────────────────────────────────────────────────────┐
│ Per-Person Customization          [Hide] [Customize]   │
│ Override hours or details for specific contractors     │
├────────────────────────────────────────────────────────┤
│ SC  Sarah Chen                                         │
│     Senior Engineer                                    │
│     Hours/Day: [8.0]        Task: [Development]       │
│     (Using default values)                             │
├────────────────────────────────────────────────────────┤
│ MJ  Mike Johnson                                       │
│     Frontend Dev                                       │
│     Hours/Day: [8.0]        Task: [Development]       │
│     (Using default values)                             │
├────────────────────────────────────────────────────────┤
│ LP  Lisa Park                          [Reset to Default]│
│     UI Designer                                        │
│     Hours/Day: [6.0] (Custom)   Task: [UI Design] (Custom)│
│     ⚠️ Custom settings for this contractor             │
└────────────────────────────────────────────────────────┘
```

**What happened:**
- Sarah & Mike: Use default (8h, Development)
- Lisa: Override to 6h, UI Design
- All get Mon-Fri pattern

### Step 4: Review Summary

```
┌────────────────────────────────────────┐
│ What will be created:                  │
├────────────────────────────────────────┤
│ Contractors:              3            │
│ Days (per person):        5            │
│ Total entries:           15            │
│ With customizations:      1 contractor │
│ Total hours:            110h           │
│                                        │
│ Breakdown:                             │
│ • Sarah: 5 days × 8h = 40h            │
│ • Mike:  5 days × 8h = 40h            │
│ • Lisa:  5 days × 6h = 30h ⚠️         │
└────────────────────────────────────────┘
```

### Step 5: Create Entries

Click **"Create 15 Entries"**

**Result:**
```
Sarah's Timesheet:
├── Mon: 8h, Development
├── Tue: 8h, Development
├── Wed: 8h, Development
├── Thu: 8h, Development
└── Fri: 8h, Development

Mike's Timesheet:
├── Mon: 8h, Development
├── Tue: 8h, Development
├── Wed: 8h, Development
├── Thu: 8h, Development
└── Fri: 8h, Development

Lisa's Timesheet: (Different!)
├── Mon: 6h, UI Design ⚠️
├── Tue: 6h, UI Design ⚠️
├── Wed: 6h, UI Design ⚠️
├── Thu: 6h, UI Design ⚠️
└── Fri: 6h, UI Design ⚠️
```

**Perfect!** No manual editing needed.

---

## 🎨 UI Features

### Visual Indicators

**Default contractor (no override):**
```
┌────────────────────────────────────────┐
│ SC  Sarah Chen                         │
│     Senior Engineer                    │
│     Hours/Day: [8.0]                   │
│     Task: [Development]                │
│     (Border: Gray, No warning)         │
└────────────────────────────────────────┘
```

**Customized contractor:**
```
┌────────────────────────────────────────┐
│ LP  Lisa Park      [Reset to Default]  │
│     UI Designer                        │
│     Hours/Day: [6.0] (Custom) ⚠️       │
│     Task: [UI Design] (Custom) ⚠️      │
│     ⚠️ Custom settings for this contractor│
│     (Border: Orange/Warning color)     │
└────────────────────────────────────────┘
```

### Actions

**Customize Button:**
- Shows/hides the per-person override section
- Toggles between "Customize" and "Hide"

**Reset to Default:**
- Appears when contractor has overrides
- Clears all overrides for that contractor
- Reverts to base pattern values

**Input Highlighting:**
- Orange border on fields with custom values
- "(Custom)" label next to field name
- Warning icon and message

---

## 🔄 Common Workflows

### Scenario 1: Mostly Same, One Different

**Team:** Sarah (8h), Mike (8h), Lisa (6h)

**Steps:**
1. Select all 3 contractors
2. Set default: 8h, Development, Mon-Fri
3. Click "Customize"
4. Override Lisa: 6h, UI Design
5. Create → Done!

**Time saved:** 5 seconds vs 5 minutes of manual editing

---

### Scenario 2: Two Groups

**Team:** Sarah & Mike (8h, Development), Lisa & Tom (6h, Design)

**Option A: Two Bulk Entries**
1. Bulk #1: Sarah & Mike → 8h, Development
2. Bulk #2: Lisa & Tom → 6h, Design

**Option B: One Bulk with Overrides**
1. Select all 4
2. Default: 8h, Development
3. Override Lisa: 6h, Design
4. Override Tom: 6h, Design
5. Create

**Best:** Option A (faster for this case)

---

### Scenario 3: All Different

**Team:** Sarah (8h), Mike (7h), Lisa (6h), Tom (4h)

**Don't use bulk entry!** Just have each person fill their own timesheet.

**Rule of thumb:**
- 80%+ same → Use bulk with overrides
- 50-80% same → Use bulk for majority, separate for others
- <50% same → Skip bulk, individual entry

---

## 🎯 Benefits

### For Managers

✅ **Faster setup:** Set default once, customize exceptions
✅ **Visual feedback:** See who has custom settings
✅ **Mistake prevention:** Review before creating
✅ **Flexibility:** Can handle most team scenarios

### For Contractors

✅ **Less manual work:** Get pre-filled entries
✅ **Accurate from start:** Hours already correct
✅ **Can still edit:** Not locked, just pre-filled
✅ **Clear ownership:** Still their own timesheet

---

## 🔍 Technical Details

### Data Structure

```typescript
// Base pattern (applies to all unless overridden)
pattern: {
  hours: 8,
  task: "Development",
  notes: "",
  weekdays: [1, 2, 3, 4, 5], // Mon-Fri
}

// Per-contractor overrides
overrides: Map<contractorId, {
  hours?: 6,        // Override hours
  task?: "Design",  // Override task
  notes?: "Part-time" // Override notes
}>

// When creating entries:
for each contractor:
  effectiveHours = override?.hours ?? pattern.hours
  effectiveTask = override?.task ?? pattern.task
  
  create entries with effective values
```

### State Management

```typescript
const [overrides, setOverrides] = useState<Map<string, ContractorOverride>>(new Map());

// Set override
handleSetOverride(contractorId, 'hours', 6);

// Clear override
handleClearOverride(contractorId);

// Get effective value
getEffectiveValue(contractorId, 'hours'); // Returns override or default
```

---

## 🎨 Design Philosophy

**Progressive disclosure:**
- Default view: Simple (select people, set pattern, create)
- Advanced view: Click "Customize" to reveal overrides
- Don't overwhelm users who don't need customization

**Visual hierarchy:**
- Default contractors: Gray border, no warning
- Customized contractors: Orange border, warning icon
- Clear labels: "(Custom)" next to overridden fields

**Escape hatches:**
- "Reset to Default" button for each contractor
- Can toggle customize view on/off
- Can still edit individual timesheets after creation

---

## 📊 Example: Real Team

**Scenario:** Mobile app project with 5 contractors

| Contractor | Hours/Day | Task | Notes |
|------------|-----------|------|-------|
| Sarah Chen | 8h | Backend Dev | Full-time |
| Mike Johnson | 8h | Backend Dev | Full-time |
| Lisa Park | 6h | UI Design | Part-time (60%) |
| Tom Wilson | 8h | Frontend Dev | Full-time |
| Emma Davis | 4h | QA Testing | Part-time (50%) |

**Using bulk entry:**

1. Select all 5 contractors
2. Set default: **8h, Development, Mon-Fri**
3. Click **"Customize"**
4. Override Lisa: **6h, UI Design**
5. Override Emma: **4h, QA Testing**
6. Click **"Create 25 Entries"**

**Result:**
- Sarah: 5 days × 8h = 40h (Backend Dev) ✓
- Mike: 5 days × 8h = 40h (Backend Dev) ✓
- Lisa: 5 days × 6h = 30h (UI Design) ✓
- Tom: 5 days × 8h = 40h (Frontend Dev - using default task) ✓
- Emma: 5 days × 4h = 20h (QA Testing) ✓

**Then Tom manually edits:**
- Change task from "Development" to "Frontend Dev" (quick fix)

**Total time:** 2 minutes vs 15 minutes of manual entry

---

## 🚀 Summary

**The bulk entry tool now supports:**

✅ **Base pattern** - Set default for everyone
✅ **Per-person overrides** - Customize specific contractors
✅ **Visual feedback** - See who has custom settings
✅ **Easy reset** - Clear overrides back to default
✅ **Progressive disclosure** - Hide complexity until needed

**Workflow:**
1. Select contractors
2. Set base pattern (hours, task, days)
3. Click "Customize" (optional)
4. Override specific contractors
5. Review summary
6. Create entries

**Each contractor still gets their own separate timesheet entries!**

This is the best of both worlds:
- **Bulk efficiency** for common patterns
- **Individual flexibility** for exceptions
- **Clean separation** for accounting

🎉 **Problem solved!**
