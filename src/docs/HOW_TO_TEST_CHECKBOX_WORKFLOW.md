# 🧪 How to Test: Checkbox-Based Approval Workflow

## 🎯 Quick Start

The new unified checkbox approval system is live and ready to test!

---

## 📍 Where to Find It

### **Option 1: Project Workspace (Recommended)**
1. Open the app
2. Click **"📁 Project Workspace"** in the navigation menu (top-right hamburger ☰)
3. Click **"Timesheets"** tab
4. You'll see the new unified interface!

### **Option 2: Direct Route**
- The approval system is embedded in the ProjectWorkspace component
- Default route is set to `project-workspace` on load

---

## ✅ Test Checklist

### **Test 1: Quick Approval Flow** ⚡
**Scenario:** Approve a timesheet in under 5 seconds

1. Look at the approval table at the top
2. Find "Sarah Johnson" (or any contractor with "Pending" status)
3. Click the **📄 PDF** button → Verify PDF opens in new tab
4. Click the **✓ Approve** button (green)
5. **Expected:** Success toast appears, approve button disappears

**Result:** ✅ Pass / ❌ Fail

---

### **Test 2: Checkbox Filtering** 🔍
**Scenario:** Use checkboxes to filter timesheet view

1. Look at the approval table
2. **Check** Sarah Johnson's checkbox ☑
3. Look at "Timesheet Details" section below
4. **Expected:** Header shows "Viewing 1 selected contractor"
5. **Expected:** Only Sarah's timesheet appears in table/calendar
6. **Uncheck** Sarah's checkbox ☐
7. **Expected:** Header shows "Showing all contractors..."
8. **Expected:** All contractors reappear

**Result:** ✅ Pass / ❌ Fail

---

### **Test 3: Multi-Select** 👥
**Scenario:** Select multiple contractors at once

1. **Check** Sarah Johnson ☑
2. **Check** Mike Chen ☑
3. **Expected:** Header shows "Viewing 2 selected contractors"
4. Switch to **Calendar** view (top-right tabs)
5. **Expected:** Only Sarah & Mike appear in calendar
6. Switch to **Week** view
7. **Expected:** Only Sarah & Mike appear in table

**Result:** ✅ Pass / ❌ Fail

---

### **Test 4: View Details Drawer** 📋
**Scenario:** Open detailed approval drawer

1. **Check** Sarah Johnson ☑
2. Click **"View Details"** button on her row
3. **Expected:** Drawer slides in from right
4. **Expected:** Shows full monthly breakdown with all 4 weeks
5. **Expected:** Shows total hours, amount, PDF attachments
6. Click **✓ Approve All** or **✗ Reject** button
7. **Expected:** Action completes, drawer closes

**Result:** ✅ Pass / ❌ Fail

---

### **Test 5: Quick Reject Flow** ❌
**Scenario:** Reject a timesheet with reason

1. Find a contractor with "Pending" status
2. Click the **✗ Reject** button (red)
3. **Expected:** Prompt appears asking for reason
4. Enter reason: "Hours don't match PDF"
5. Click OK
6. **Expected:** Error toast with rejection message
7. **Expected:** Row updates to show rejected status

**Result:** ✅ Pass / ❌ Fail

---

### **Test 6: Approved Contractors** ✅
**Scenario:** Verify approved contractors don't show action buttons

1. Find a contractor with "Approved" status (e.g., Mike Chen)
2. **Expected:** No ✓ Approve or ✗ Reject buttons
3. **Expected:** Only PDF and View Details buttons visible
4. Click **📄 PDF**
5. **Expected:** PDF opens (already approved, for reference)
6. Click **View Details**
6. **Expected:** Drawer opens showing approved status

**Result:** ✅ Pass / ❌ Fail

---

### **Test 7: Organization Grouping** 🏢
**Scenario:** Verify contractors are grouped by company/organization

1. Look at approval table
2. **Expected:** Headers like "🏢 ACME DEV STUDIO (X contractors)"
3. **Expected:** Contractors listed under their organization
4. Click **▼** arrow to collapse organization
5. **Expected:** Contractors for that org hide
6. Click **▶** arrow to expand
7. **Expected:** Contractors reappear

**Result:** ✅ Pass / ❌ Fail

---

### **Test 8: Empty State** 🌐
**Scenario:** Verify helpful messaging when nothing selected

1. **Uncheck** all contractors
2. Look at "Timesheet Details" header
3. **Expected:** Shows "Showing all contractors. Check contractors above to filter this view."
4. **Check** one contractor
5. **Expected:** Message changes to "Viewing 1 selected contractor"

**Result:** ✅ Pass / ❌ Fail

---

## 🎨 Visual Verification

### **What You Should See:**

#### **Top Section** (Approval Table):
```
🏢 ACME DEV STUDIO (15 contractors)
┌───────────────────────────────────────────────────────┐
│ ☑ Sarah Johnson  156h  Oct 1-28  [Pending]          │
│   [📄 PDF] [✓ Approve] [✗ Reject] [View Details]   │
│                                                       │
│ ☐ Mike Chen      140h  Oct 1-28  [Approved]         │
│   [📄 PDF]                      [View Details]       │
└───────────────────────────────────────────────────────┘
```

#### **Bottom Section** (Timesheet Details):
```
─────────────────────────────────────────────────────────
Timesheet Details
Viewing 1 selected contractor
─────────────────────────────────────────────────────────

[Month] [Week] [Calendar] ← View switcher

📊 Sarah Johnson's October Timesheet
Week 1 (Oct 1-7)    40h
Week 2 (Oct 8-14)   38h
Week 3 (Oct 15-21)  40h
Week 4 (Oct 22-28)  38h
─────────────────────────────────────────────────────────
Total: 156h
```

---

## 🐛 Known Issues / Edge Cases

### **Issue 1: Demo Data Mismatch**
- **Problem:** Approval table shows different contractors than timesheet view
- **Why:** Demo data isn't fully synchronized yet
- **Workaround:** Focus on testing the interaction, not the specific data

### **Issue 2: PDF Opens Demo File**
- **Problem:** All PDF buttons open the same demo file
- **Why:** Real PDF upload isn't implemented yet
- **Workaround:** Just verify the button works and opens something

---

## 📝 Feedback Questions

After testing, please answer:

1. **Is the checkbox → filter workflow intuitive?**
   - Yes / No / Confusing

2. **Are the quick approve/reject buttons useful?**
   - Very / Somewhat / Not Really

3. **Is the "View Details" flow smooth?**
   - Smooth / Okay / Clunky

4. **Does the organization grouping make sense?**
   - Perfect / Okay / Confusing

5. **Overall, is this better than the chip selector?**
   - Much Better / Better / Same / Worse

---

## 🚀 Next Steps After Testing

Based on your feedback, we can:

1. **Add bulk approve** for multiple selected contractors
2. **Add PDF preview panel** (side-by-side comparison)
3. **Add keyboard shortcuts** (Space = toggle, A = approve, etc.)
4. **Improve empty state** messaging
5. **Add filter/search** for large contractor lists

---

## 📞 Need Help?

If something doesn't work:
1. Check browser console for errors (F12)
2. Try refreshing the page
3. Report what you clicked and what happened

---

**Last Updated:** October 21, 2025
**Feature Status:** ✅ Ready for Testing
