# ✅ Day 3 Testing Checklist - Global Approvals Workbench

**Date:** 2025-10-31  
**Status:** Ready to Test  
**Time Required:** 10-15 minutes for full test suite

---

## 🎯 Quick Navigation Test (2 minutes)

### **Step 1: Access the Workbench**
```
1. Open WorkGraph application
2. Look at the navigation menu
3. Click "✅ My Approvals" 
   
✅ Expected: Route changes to /approvals
✅ Expected: Page loads with approval queue
```

### **Step 2: Verify Initial Load**
```
✅ Should see: 
   - "My Approvals" header
   - "Cross-project approval workbench" subtitle
   - Badge showing "🔔 18 pending"
   - Badge showing "⚠️ 3 breached" (if SLA breaches exist)
   
✅ Stats bar should display:
   - Total Hours: 702.0
   - Total Amount: $84.5k
   - SLA Breach: 3
   - Due Soon: 5
```

---

## 📊 Core Features Test Suite

### **Test 1: View Approval Queue** ⏱️ 1 minute

**What to check:**
```
✅ 18 approval items visible
✅ Each item shows:
   - Person name (e.g., "Jane Doe")
   - Role badge if applicable (e.g., "Senior Developer")
   - Project name (e.g., "Mobile App Redesign")
   - Week period (e.g., "Week of Oct 21")
   - Step indicator (e.g., "Step 2 of 3")
   - SLA badge:
      • Red "⚠️ Breach" for overdue
      • Amber "🟡 <24h" for due soon
      • Green "✅ OK" for plenty of time
   - Hours worked
   - Amount OR "•••" if rate masked
   - Submitted date
   
✅ Items are sorted by urgency (SLA breaches first)
```

**Sample item to look for:**
```
┌─────────────────────────────────────────────┐
│ [✓] Jane Doe  [Senior Developer]           │
│     Mobile App Redesign · Week of Oct 21   │
│     · Step 2 of 3                  [⚠️ Breach]│
│                                             │
│     Hours: 40.0                             │
│     Amount: $6,000                          │
│     Submitted: Oct 25                       │
│                                             │
│     [Approve] [Reject] [Why?] [View path]  │
└─────────────────────────────────────────────┘
```

---

### **Test 2: Filter by Project** ⏱️ 1 minute

**Steps:**
```
1. Click the "All Projects" dropdown
   ✅ Should see list of projects with counts:
      - Mobile App Redesign (4)
      - E-commerce Platform (5)
      - API Integration (6)
      - Marketing Website (3)
      
2. Select "Mobile App Redesign"
   ✅ Queue filters to show only 4 items
   ✅ All items should be from "Mobile App Redesign"
   ✅ Stats bar updates to show totals for filtered items
   ✅ URL updates (not required, but nice)
   
3. Click "Clear Filters" button
   ✅ Returns to showing all 18 items
   ✅ Dropdown resets to "All Projects"
```

---

### **Test 3: Filter by Party** ⏱️ 1 minute

**Steps:**
```
1. Click the "All Parties" dropdown
   ✅ Should see:
      - TechCorp (8)
      - Design Agency (6)
      - Client Co (4)
      
2. Select "TechCorp"
   ✅ Queue shows only TechCorp approvals
   ✅ Stats recalculate
   
3. Clear filters
```

---

### **Test 4: Filter by Step** ⏱️ 1 minute

**Steps:**
```
1. Click "All Steps" dropdown
   ✅ Should see:
      - Step 1 (5)
      - Step 2 (8)
      - Step 3 (5)
      
2. Select "Step 2"
   ✅ Shows only items at Step 2 of their workflow
   ✅ Each item displays "Step 2 of X"
   
3. Clear filters
```

---

### **Test 5: Filter by SLA** ⏱️ 1 minute

**Steps:**
```
1. Click "All SLA" dropdown
   ✅ Should see:
      - All SLA
      - ⚠️ Breached
      - 🟡 Due Soon
      
2. Select "⚠️ Breached"
   ✅ Shows only 3 items with red breach badges
   ✅ All items have "⚠️ Breach" badge
   
3. Select "🟡 Due Soon"
   ✅ Shows items with amber "<24h" badges
   
4. Clear filters
```

---

### **Test 6: Combine Multiple Filters** ⏱️ 1 minute

**Steps:**
```
1. Select Project: "Mobile App Redesign"
2. Select SLA: "⚠️ Breached"
   
   ✅ Shows only breached items from Mobile App project
   ✅ Could be 0-2 items depending on data
   ✅ "Clear Filters" button visible
   
3. Click "Clear Filters"
   ✅ All filters reset
   ✅ Full queue visible again
```

---

### **Test 7: Single Item Approval** ⏱️ 1 minute

**Steps:**
```
1. Find any approval item (preferably not breached)
2. Click the green "Approve" button
   
   ✅ Toast notification appears:
      - "Approved!"
      - "Moving to next approval step"
   
   ✅ Item disappears from queue
   ✅ Pending count decreases by 1 (e.g., 18 → 17)
   ✅ Stats bar updates (hours and amount decrease)
   
   Note: Item is removed because status changed from "pending" to "approved"
```

---

### **Test 8: Single Item Rejection** ⏱️ 1 minute

**Steps:**
```
1. Find any approval item
2. Click the "Reject" button
   
   ✅ Popup/prompt appears asking for rejection reason
   
3. Enter reason: "Missing task descriptions"
4. Click OK/Submit
   
   ✅ Toast notification appears:
      - "Rejected"
      - "Contractor will be notified"
   
   ✅ Item disappears from queue
   ✅ Pending count decreases by 1
   ✅ Stats update
```

---

### **Test 9: Checkbox Selection** ⏱️ 1 minute

**Steps:**
```
1. Click checkbox on first item
   ✅ Checkbox becomes checked
   ✅ Purple toolbar appears at top showing "1 selected"
   
2. Click checkbox on 2 more items
   ✅ Toolbar updates to "3 selected"
   ✅ All 3 checkboxes are checked
   
3. Click checkbox in the toolbar (Select All)
   ✅ All 18 items become checked
   ✅ Toolbar shows "18 selected"
   
4. Click toolbar checkbox again
   ✅ All items uncheck
   ✅ Toolbar disappears
```

---

### **Test 10: Bulk Approve** ⏱️ 2 minutes

**Critical test - this is the main feature!**

**Steps:**
```
1. Select 3-5 items using checkboxes
   ✅ Purple toolbar appears
   ✅ Shows count: "5 selected"
   
2. Click "Approve Selected" button in toolbar
   
   ✅ Toast notification appears:
      • If all under threshold ($10k each):
        "Approved 5 items!"
        
      • If some over threshold:
        "Approved 3, failed 2"
        "Some items exceeded threshold"
   
   ✅ Approved items disappear from queue
   ✅ Failed items (over $10k) remain in queue
   ✅ Selection clears
   ✅ Toolbar disappears
   ✅ Pending count updates
   ✅ Stats recalculate
```

**Expected Behavior:**
- Items under $10,000 → Approved ✅
- Items over $10,000 → Failed (require individual approval)
- This is a safety feature to prevent accidental bulk approval of large amounts

---

### **Test 11: Cancel Bulk Selection** ⏱️ 30 seconds

**Steps:**
```
1. Select multiple items
2. Click "Cancel" button in toolbar
   
   ✅ All selections clear
   ✅ Toolbar disappears
   ✅ Items remain in queue (not approved)
```

---

### **Test 12: Rate Masking** ⏱️ 1 minute

**What to look for:**
```
Some items should show:
   Amount: $6,000          ← You can see the rate
   
Other items should show:
   Amount: •••             ← Rate is masked
   [Rate masked] badge     ← Indicator badge
   
✅ Masked items are still approvable
✅ Approve a masked item to confirm it works
✅ You can approve without seeing the rate
```

**Why this matters:**
Different contractors have different rate visibility rules based on their contract. Some parties can approve hours but not see rates.

---

### **Test 13: SLA Badge Colors** ⏱️ 1 minute

**Visual verification:**
```
Look through the queue and verify badge colors:

Red Badges (⚠️ Breach):
   ✅ Past due date
   ✅ Background is red/destructive
   ✅ Shows "⚠️ Breach" text
   
Amber Badges (🟡 <24h):
   ✅ Due within 24 hours
   ✅ Background is amber/yellow
   ✅ Shows "🟡 <24h" text
   
Green Badges (✅ OK):
   ✅ More than 24h until due
   ✅ Outline style (not filled)
   ✅ Shows "✅ OK" text
```

---

### **Test 14: Stats Bar Calculation** ⏱️ 1 minute

**Steps:**
```
1. Note initial stats:
   Total Hours: 702.0
   Total Amount: $84.5k
   SLA Breach: 3
   Due Soon: 5
   
2. Approve 1 item with 40 hours, $6,000
   
   ✅ Total Hours decreases by 40 (702 → 662)
   ✅ Total Amount decreases by $6k ($84.5k → $78.5k)
   ✅ If item was breached, breach count decreases
   ✅ Pending badge updates (18 → 17)
   
3. Filter to one project
   
   ✅ Stats recalculate for filtered items only
   ✅ Stats are NOT the same as before
   
4. Clear filters
   ✅ Stats recalculate for all items
```

---

### **Test 15: Empty State** ⏱️ 1 minute

**Steps:**
```
1. Bulk approve ALL 18 items
   (or filter to a project with no approvals)
   
   ✅ Queue clears
   ✅ Loading spinner does NOT appear
   ✅ Empty state appears:
      - Green checkmark icon
      - "All caught up!" heading
      - "No pending approvals" text
   
2. Reload page or change filters
   ✅ If there are items, they appear
   ✅ If no items, empty state shows
```

---

### **Test 16: Keyboard Shortcuts Footer** ⏱️ 30 seconds

**Visual check:**
```
✅ Footer at bottom of page shows:
   "Keyboard shortcuts: j/k = navigate  x = select  a = approve  r = reject"
   
Note: Actual keyboard shortcuts may not be implemented yet
This is visual documentation for future implementation
```

---

## 🎨 Visual Quality Checks

### **Layout & Spacing**
```
✅ Header is clean and uncluttered
✅ Stats cards are evenly sized (4 columns)
✅ Filters are horizontally aligned
✅ Queue items have consistent spacing
✅ Buttons are properly aligned
✅ No overlapping text
✅ Mobile responsive (optional to test)
```

### **Color Consistency**
```
✅ Purple used for selection toolbar
✅ Green for approve actions
✅ Red for reject/breach
✅ Amber for warnings
✅ Gray for neutral elements
```

### **Interactive Feedback**
```
✅ Buttons show hover states
✅ Cards show hover shadow
✅ Checkboxes respond to clicks
✅ Dropdowns open smoothly
✅ Toast notifications appear and dismiss
```

---

## 🔍 Edge Cases to Test

### **Edge Case 1: Rapid Filtering**
```
1. Quickly change filters multiple times
   ✅ No flickering or errors
   ✅ Queue updates each time
   ✅ Loading state is brief
```

### **Edge Case 2: Double-Click Protection**
```
1. Click "Approve" button twice quickly
   ✅ Should only approve once
   ✅ No duplicate API calls (check console)
   ✅ Toast appears once
```

### **Edge Case 3: Large Selection**
```
1. Select all 18 items
2. Bulk approve
   ✅ All items process
   ✅ Toast shows correct count
   ✅ No timeout errors
```

---

## 🐛 Common Issues to Watch For

### **Data Issues**
```
❌ "Pending count" doesn't match visible items
❌ Stats show NaN or undefined
❌ Dates display as "Invalid Date"
❌ Some items missing badges
❌ Amount shows $undefined
```

### **UI Issues**
```
❌ Filters don't reset properly
❌ "Clear Filters" button doesn't appear
❌ Checkboxes don't uncheck
❌ Toolbar doesn't disappear after approval
❌ Empty state doesn't show when queue is empty
```

### **Interaction Issues**
```
❌ Can't approve items
❌ Toast doesn't appear
❌ Items don't disappear after approval
❌ Bulk approve fails silently
❌ Rejection prompt doesn't show
```

---

## 📈 Success Criteria

**All tests pass if:**
```
✅ All 18 items load correctly
✅ All 4 filters work independently
✅ Multiple filters work together
✅ Single approve/reject works
✅ Bulk approve works (respects threshold)
✅ Selection UI works (checkboxes + toolbar)
✅ Stats calculate correctly
✅ SLA badges display correctly
✅ Rate masking works
✅ Empty state appears when appropriate
✅ No console errors
✅ Toast notifications appear
✅ UI is visually clean and aligned
```

---

## 🚀 Performance Checks

### **Load Time**
```
✅ Initial load: < 1 second
✅ Filter change: < 300ms
✅ Approve action: < 500ms
✅ Bulk approve: < 2 seconds (for 18 items)
```

### **Console Checks**
```
Open browser console (F12) and verify:

✅ No red errors
✅ "✅ Loaded approval queue: 18 items" appears
✅ When you approve: Success messages log
✅ No "undefined" or "null" errors
```

---

## 🎯 Critical Path Test (Full Flow)

**Complete this flow in 5 minutes:**

```
1. Open My Approvals                     ✅ Loads 18 items
2. Filter to "Mobile App Redesign"       ✅ Shows ~4 items
3. Filter to "⚠️ Breached"               ✅ Shows breached items only
4. Approve 1 item                        ✅ Item disappears
5. Clear filters                         ✅ Back to full queue (now 17)
6. Select 5 items with checkboxes        ✅ Toolbar appears
7. Bulk approve                          ✅ Items approved/removed
8. Verify final state                    ✅ ~12 items remaining
9. Check stats updated                   ✅ Hours/amount decreased
10. All caught up!                       ✅ Eventually empty state
```

---

## 📸 Screenshots to Take

**Capture these views for documentation:**

1. **Full queue view** - Initial load with 18 items
2. **Filtered view** - One project selected
3. **Selection active** - Purple toolbar with items checked
4. **SLA badges** - Close-up of red/amber/green badges
5. **Rate masking** - Example of ••• vs actual amount
6. **Empty state** - All caught up screen
7. **Toast notification** - Approval success message
8. **Stats bar** - 4-column metrics display

---

## 🎊 What Success Looks Like

**If all tests pass, you have:**

✅ **A working cross-project approval inbox** that shows all pending approvals from multiple projects in one place

✅ **Powerful filtering** that lets approvers focus on what matters (breached items, specific projects, etc.)

✅ **Bulk approval capability** with built-in safety threshold to prevent mistakes

✅ **Rate masking** that respects contract-level visibility rules

✅ **SLA tracking** with color-coded urgency indicators

✅ **Real-time stats** that update as approvals happen

✅ **Clean, professional UI** that scales from 0 to 1000+ items

---

## 🔧 If Something Doesn't Work

### **Queue doesn't load:**
```
1. Check console for errors
2. Verify /utils/api/approvals-queue.ts exists
3. Check that AppRouter has the "approvals" route
4. Refresh page
```

### **Filters don't work:**
```
1. Check that dropdown values are updating
2. Verify console logs show filter params
3. Check API is receiving filter parameters
4. Try clearing browser cache
```

### **Approval doesn't work:**
```
1. Check console for API errors
2. Verify toast.success is being called
3. Check that mock data is being updated
4. Reload queue manually
```

### **Stats are wrong:**
```
1. Check that all items have hours/amount
2. Verify calculation logic in component
3. Check for NaN or null values
4. Ensure filtering recalculates stats
```

---

## 📚 Related Documentation

**For deeper understanding:**

- `/docs/guides/PHASE_5_DAY_3_COMPLETE.md` - Full implementation details
- `/docs/guides/THREE_SURFACE_APPROVALS_ARCHITECTURE.md` - System design
- `/utils/api/approvals-queue.ts` - API implementation
- `/components/approvals/ApprovalsWorkbench.tsx` - UI component

---

## ⏭️ What's Next (Days 4-5)

After this works, you'll add:

1. **Graph Overlay Integration**
   - "View path on graph" button opens WorkGraph Builder
   - Highlights the approval flow
   - Shows current step visually
   - Can approve directly from graph

2. **Keyboard Shortcuts**
   - j/k to navigate items
   - x to select
   - a to approve
   - r to reject

3. **Enhanced Details**
   - Drawer with full timesheet breakdown
   - Visibility preview
   - Approval history

---

**Created:** 2025-10-31  
**Version:** 1.0  
**Estimated Test Time:** 15 minutes for complete suite  
**Critical Path Time:** 5 minutes  

**Happy Testing! 🎉**

---

## 💡 Pro Tips

1. **Test with filters first** - This catches most display issues
2. **Try bulk approve early** - It's the most complex feature
3. **Check console frequently** - Errors show up there first
4. **Take screenshots** - Helps document what's working
5. **Test on different screen sizes** - Ensure responsiveness
6. **Clear and reload** - If something feels stuck, refresh

---

**Ready to test? Start with the Quick Navigation Test (2 min) then do the Critical Path Test (5 min). If those work, you're 90% there!**
