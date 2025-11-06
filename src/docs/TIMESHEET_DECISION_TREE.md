# 🌳 Timesheet Entry Decision Tree

## When to Use Which Tool?

WorkGraph has 3 ways to create timesheet entries. Here's how to choose:

---

## 🎯 Quick Decision Guide

```
START: Do most contractors have the SAME hours/task?
│
├─ YES (80%+ similar)
│  │
│  ├─ Are the differences only per-person? (e.g., Sarah 8h, Lisa 6h)
│  │  └─ ✅ USE: Bulk Entry with Per-Person Overrides
│  │
│  └─ Do some people need different hours on different days?
│     │
│     ├─ Just a few exceptions? (e.g., Lisa works 6h Mon-Thu, 4h Fri)
│     │  └─ ⚠️ USE: Bulk Entry for most, then individual edits
│     │
│     └─ Too many exceptions per person?
│        └─ ❌ SKIP bulk, use Individual Timesheets
│
└─ NO (everyone is different)
   │
   ├─ Is each DAY different for each person?
   │  └─ ❌ SKIP bulk, use Individual Timesheets
   │
   └─ Are there at least 2-3 people with the same pattern?
      │
      ├─ YES → ✅ USE: Bulk Entry for those people only
      │
      └─ NO → ❌ SKIP bulk, use Individual Timesheets
```

---

## 📊 Tool Comparison

| Tool | Best For | Time Saved | Flexibility |
|------|----------|------------|-------------|
| **Individual Timesheet** | 1 contractor, custom schedule | Baseline | ⭐⭐⭐⭐⭐ |
| **Bulk Entry (Basic)** | 3+ contractors, same hours | 80% | ⭐⭐⭐ |
| **Bulk Entry (w/ Overrides)** | Mixed team, some exceptions | 70% | ⭐⭐⭐⭐ |
| **Contractor Browser** | Review/manage individuals | N/A | ⭐⭐⭐⭐⭐ |

---

## 🔧 Tool 1: Individual Timesheet

### What it is
A contractor opens their own monthly timesheet calendar and fills it in day-by-day.

### When to use
✅ Contractor has **irregular schedule** (different hours each day)
✅ Contractor works **part-time with varying hours**
✅ Each day needs **unique notes or tasks**
✅ You're the **contractor** entering your own time

### Example scenario
**Tom (QA Engineer):**
- Mon: 8h (Testing sprint 1)
- Tue: 4h (Bug fixes)
- Wed: 6h (Regression testing)
- Thu: 8h (New feature testing)
- Fri: 2h (Documentation)

**Why individual?** Every day is different!

### How to access
1. **Contractor:** Click "My Timesheet"
2. **Manager:** Click "Browse Contractors" → Select Tom → "Open Timesheet"

### Features
- Inline quick-add (click "+")
- Copy previous day
- Drag & drop entries
- Full control per day

---

## 🔧 Tool 2: Bulk Entry (Basic)

### What it is
Select multiple contractors, set one pattern (hours, task, days), create identical entries for everyone.

### When to use
✅ **80%+ of team** has same hours/task
✅ Everyone works **same schedule** (e.g., Mon-Fri, 8h/day)
✅ All doing **same type of work** (e.g., "Development")
✅ You want to **save 5+ minutes** of repetitive entry

### Example scenario
**Team Sprint:**
- Sarah: 8h Mon-Fri, Development
- Mike: 8h Mon-Fri, Development
- Alex: 8h Mon-Fri, Development

**All the same!** Perfect for bulk entry.

### How to use
1. Click "Bulk Entry (Multiple People)"
2. Select all 3 contractors
3. Set: 8h/day, Development, Mon-Fri
4. Click "Create 15 Entries"
5. Done in 30 seconds! ✨

### Result
- Sarah gets 5 entries (Mon-Fri @ 8h)
- Mike gets 5 entries (Mon-Fri @ 8h)
- Alex gets 5 entries (Mon-Fri @ 8h)

---

## 🔧 Tool 3: Bulk Entry with Per-Person Overrides

### What it is
Same as bulk entry, but you can **customize specific contractors** before creating.

### When to use
✅ **Most** people have same hours, **1-2 are different**
✅ Differences are **per-person** (not per-day)
✅ Example: Sarah & Mike (8h), Lisa (6h part-time)

### Example scenario
**Mixed Team:**
- Sarah: 8h Mon-Fri, Development
- Mike: 8h Mon-Fri, Development
- Lisa: 6h Mon-Fri, UI Design (part-time!)

### How to use
1. Click "Bulk Entry (Multiple People)"
2. Select all 3 contractors
3. Set default: 8h/day, Development, Mon-Fri
4. Click "Customize"
5. Override Lisa:
   - Hours: 6 (instead of 8)
   - Task: UI Design (instead of Development)
6. Click "Create 15 Entries"
7. Done! ✨

### Result
- Sarah: 5 entries @ 8h, Development
- Mike: 5 entries @ 8h, Development
- Lisa: 5 entries @ 6h, UI Design ⚠️ (customized!)

### When it WON'T work
❌ Lisa works 6h Mon-Thu, but 4h Fri
❌ Sarah works 8h Mon-Wed, 6h Thu-Fri
❌ Everyone has different hours every day

**In those cases, override won't help - use individual timesheets!**

---

## 🔧 Tool 4: Contractor Browser

### What it is
A list/grid of all contractors with links to their individual timesheets.

### When to use
✅ You need to **review one contractor's full month**
✅ You want to **see who has submitted** vs who hasn't
✅ Bulk entry won't work (everyone is different)
✅ You're **managing individual contractors** separately

### Example scenario
**Manager review workflow:**
1. Open "Browse Contractors"
2. See list: Sarah (submitted), Mike (draft), Lisa (approved), Tom (not started)
3. Click Tom → Opens his individual timesheet
4. Review his entries, leave notes
5. Back to browser, click Mike
6. Repeat for all contractors

### Features
- Filter by status (submitted, approved, draft)
- Search by name or role
- See hours this month
- One-click to open individual timesheet

---

## 🎬 Real-World Scenarios

### Scenario 1: Standard Sprint Team

**Team:**
- 5 developers
- All work Mon-Fri, 8h/day
- All doing "Sprint Development"

**Solution:**
✅ **Bulk Entry (Basic)**

**Steps:**
1. Select all 5
2. Set: 8h, Sprint Development, Mon-Fri
3. Create 25 entries
4. Done in 20 seconds!

**Time saved:** 5 minutes → 20 seconds

---

### Scenario 2: Mixed Team (Full-time + Part-time)

**Team:**
- Sarah: 8h Mon-Fri, Backend
- Mike: 8h Mon-Fri, Backend
- Lisa: 6h Mon-Fri, Frontend (60% part-time)
- Tom: 8h Mon-Fri, Backend

**Solution:**
✅ **Bulk Entry with Overrides**

**Steps:**
1. Select all 4
2. Default: 8h, Backend, Mon-Fri
3. Customize:
   - Lisa: 6h, Frontend
4. Create 20 entries
5. Done!

**Result:**
- 3 people @ 8h Backend
- 1 person @ 6h Frontend
- Each gets their own entries

**Time saved:** 8 minutes → 1 minute

---

### Scenario 3: Agency with Variable Hours

**Team:**
- Sarah: 8h Mon, 6h Tue, 8h Wed, 4h Thu, 8h Fri (Backend)
- Mike: 6h Mon-Tue-Wed, 8h Thu-Fri (Frontend)
- Lisa: 4h Mon-Wed-Fri, 6h Tue-Thu (Design)
- Tom: 2h Mon, 4h Wed, 8h Fri (QA)

**Solution:**
❌ **Skip Bulk Entry!**
✅ **Use Contractor Browser + Individual Timesheets**

**Why?**
- Every person has different hours every day
- No pattern to exploit
- Overrides won't help (per-day differences)

**Steps:**
1. Open "Browse Contractors"
2. Click Sarah → Fill her unique schedule
3. Click Mike → Fill his unique schedule
4. Click Lisa → Fill her unique schedule
5. Click Tom → Fill his unique schedule

**Time:** Still faster than bulk entry with 20+ manual corrections

---

### Scenario 4: Holiday Week

**Team:**
- Sarah: Mon-Tue 8h, Wed OFF (holiday), Thu-Fri 8h
- Mike: Mon-Tue 8h, Wed OFF, Thu-Fri 8h
- Lisa: Mon-Tue 8h, Wed OFF, Thu-Fri 8h

**Solution:**
✅ **Bulk Entry (Basic)** - Just set Mon-Tue, Thu-Fri

**Steps:**
1. Select all 3
2. Set: 8h, Development, **Mon Tue Thu Fri** (skip Wed!)
3. Create 12 entries
4. Done!

**Bulk entry supports custom weekdays!** ✨

---

### Scenario 5: One-Off Project

**Team:**
- Sarah: Joins for 3 days (Wed-Thu-Fri) @ 8h
- Rest of team: Normal Mon-Fri schedule

**Solution:**
✅ **Two bulk entries**

**Steps:**
1. Bulk #1: Regular team, Mon-Fri, 8h
2. Bulk #2: Sarah only, Wed-Thu-Fri, 8h

**Or:**
1. Bulk: Regular team
2. Individual: Sarah fills her 3 days manually

**Choose based on preference!**

---

## 🚦 Decision Matrix

| Your Situation | Tool | Reason |
|----------------|------|--------|
| Everyone same hours, same days | Bulk (Basic) | Maximum efficiency |
| Most same, 1-2 different rates | Bulk (Overrides) | Override exceptions |
| Different hours per person (constant) | Bulk (Overrides) | Each person gets custom rate |
| Different hours per day per person | Individual | Too complex for bulk |
| Part-time with varying daily hours | Individual | Needs per-day control |
| Review/approve one contractor | Browser → Individual | Navigate to specific person |
| Check who hasn't submitted | Browser | Filter by status |
| Irregular schedules across team | Browser + Individual | No pattern to bulk |

---

## 📱 Quick Access Guide

### From Contractor View
- **"My Timesheet"** → Your individual timesheet
- **"Bulk Entry"** (if manager) → Create for multiple people

### From Manager View
- **Tab 1: "Browse Contractors"** → List all, click to open individual
- **Tab 2: "Aggregate Calendar"** → See daily totals, drill down
- **Tab 3: "Aggregate List"** → Person-by-person breakdown

### Within Bulk Entry Dialog
- **"Customize"** → Override specific contractors
- **"Open Full Timesheet"** (on override card) → Give up on bulk, go individual

---

## 💡 Pro Tips

### Use Bulk Entry When:
- ✅ 80%+ of entries are identical
- ✅ Patterns are clear (Mon-Fri, same hours)
- ✅ You have 3+ people to create for

### Skip Bulk Entry When:
- ❌ Every person is different
- ❌ Hours vary day-by-day per person
- ❌ You need custom notes per day
- ❌ Only 1-2 people to create for

### Use Overrides When:
- ✅ Differences are per-person (constant rate)
- ✅ 1-3 people are exceptions
- ✅ Exception is simple (different hours or task)

### Skip Overrides When:
- ❌ Exception needs per-day customization
- ❌ More than 50% of team needs overrides
- ❌ Each person needs unique daily schedule

### Use Browser When:
- ✅ Managing contractors individually
- ✅ Reviewing submissions
- ✅ Complex/irregular schedules
- ✅ Need to see status overview

---

## 🎯 Summary

**The golden rule:**

> **If 80%+ of entries are the same → Use bulk**
> 
> **If everyone is different → Use individual**
> 
> **When in doubt → Start with browser, open individuals**

**Tools work together:**
1. **Bulk Entry** = Fast creation for common patterns
2. **Overrides** = Handle simple per-person exceptions
3. **Individual Timesheets** = Full control, day-by-day
4. **Browser** = Navigate and manage all contractors

**You can mix and match:**
- Bulk for 3 people (Sarah, Mike, Tom)
- Individual for 1 person (Lisa with irregular schedule)
- Browser to review all 4 later

**The system is flexible - use what makes sense for your team!** 🚀
