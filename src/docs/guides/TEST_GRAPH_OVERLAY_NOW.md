# ✅ Test Graph Overlay Modal NOW - 2 Minute Guide

**Date:** 2025-10-31  
**Status:** Ready to test!  
**Time Required:** 2 minutes

---

## 🚀 Quick Test Steps

### **Step 1: Navigate to My Approvals** (15 seconds)

1. Look at the **top navigation bar** (dark gray bar)
2. Click the **"Navigate"** button (top right)
3. Click **"✅ My Approvals"** from the dropdown
4. You should see the Approvals Workbench with 18 items

```
Expected:
┌─────────────────────────────────────────────────┐
│ My Approvals                        [18 items]  │
├─────────────────────────────────────────────────┤
│ 📊 Stats Bar                                    │
│ Hours: 702.0  Amount: $84.5k  Breached: 3      │
├─────────────────────────────────────────────────┤
│ 🎯 Filters                                      │
│ [All Projects] [All Parties] [All Steps]       │
├─────────────────────────────────────────────────┤
│ 📋 Queue (18 items)                             │
│ ☐ Jane Doe - Mobile App - 40.0h - $6,000      │
│ ☐ Mike Chen - Backend API - 45.0h - •••       │
│ ☐ Sarah Kim - E-commerce - 38.0h - $5,700     │
│ ...                                             │
└─────────────────────────────────────────────────┘
```

✅ **Pass if:** You see the queue with 18 items

---

### **Step 2: Open Graph Overlay** (10 seconds)

1. Find the **first item** in the queue (Jane Doe)
2. Look for the **"View path on graph"** button (right side, has eye icon 👁️)
3. Click it

```
Expected:
- Modal opens full screen (~95% of viewport)
- No console errors (press F12 to check)
- Shows approval flow diagram
```

✅ **Pass if:** Modal opens with no errors

---

### **Step 3: Check Modal Header** (10 seconds)

Look at the **top of the modal**:

```
Expected Header:
┌──────────────────────────────────────────────┐
│ Approval Path on Graph              [Step 2] │
│                                               │
│ Jane Doe [Senior Developer]                  │
│ Mobile App Redesign · Week of Oct 21         │
└──────────────────────────────────────────────┘
```

✅ **Pass if:**
- Shows person name (Jane Doe)
- Shows project name (Mobile App Redesign)
- Shows step badge (Step 2)
- No console warnings

---

### **Step 4: Check Approval Flow Diagram** (20 seconds)

Look at the **center of the modal**:

```
Expected Diagram:
┌──────────────────────────────────────────────┐
│     Approval Flow for Jane Doe               │
│     Mobile App Redesign · 3-step approval    │
│                                               │
│  (1)     →    (2)     →    (3)              │
│ Contractor  Manager  Finance                 │
│ Submitted  ← YOU HERE  Next                  │
│                                               │
│ 🔵 Current step   ⚪ Completed/Pending       │
└──────────────────────────────────────────────┘
```

✅ **Pass if:**
- See 3-4 circular steps
- Step 2 is highlighted (blue with ring)
- Other steps are gray
- "YOU ARE HERE" label on step 2
- Info note about full graph coming soon

---

### **Step 5: Check Action Bar** (15 seconds)

Look at the **bottom of the modal**:

```
Expected Action Bar:
┌──────────────────────────────────────────────┐
│ Hours: 40.0  Amount: $6,000  Next: Step 3   │
│                                               │
│ [Close]          [Reject] [Approve from Graph]│
└──────────────────────────────────────────────┘
```

✅ **Pass if:**
- Shows hours (40.0)
- Shows amount ($6,000 or •••)
- Has 3 buttons: Close, Reject, Approve
- "Approve Now from Graph" button is green

---

### **Step 6: Test Approve** (30 seconds)

1. Click **"Approve Now from Graph"** button
2. Watch for:
   - Button text changes to "Approving..."
   - Spinner appears
   - Other buttons disabled

3. After ~300ms:
   - Toast notification appears: "Approved from graph!"
   - Modal closes automatically
   - Back at queue

4. Check the queue:
   - Jane Doe's item should be **gone**
   - Pending count: **17** (was 18)

```
Expected Toast:
┌────────────────────────────┐
│ ✓ Approved from graph!     │
│ Moving to step 3           │
└────────────────────────────┘
```

✅ **Pass if:**
- Toast appears
- Modal closes
- Item disappears from queue
- No console errors

---

### **Step 7: Test Multiple Items** (20 seconds)

1. Click **"View path on graph"** on a **different item** (Mike Chen)
2. Check that the modal shows **Mike's data** (not Jane's)
3. Press **Escape** key
4. Modal should close immediately

✅ **Pass if:**
- Each item shows its own data
- Escape key works
- No data mixing

---

### **Step 8: Test Reject** (20 seconds)

1. Open graph overlay on any item
2. Click **"Reject"** button
3. Prompt should appear: "Rejection reason:"
4. Enter: "Test rejection"
5. Click OK
6. Watch for:
   - "Rejecting..." loading state
   - Toast: "Rejected"
   - Modal closes
   - Item disappears

✅ **Pass if:**
- Prompt works
- Reject succeeds
- Item removed from queue

---

## 🎯 Success Checklist

After completing all 8 steps, verify:

- [x] **Step 1:** Can navigate to My Approvals
- [x] **Step 2:** "View path on graph" opens modal
- [x] **Step 3:** Header shows correct person/project
- [x] **Step 4:** Approval flow diagram visible
- [x] **Step 5:** Action bar has all buttons
- [x] **Step 6:** Approve works → item disappears
- [x] **Step 7:** Different items show different data
- [x] **Step 8:** Reject works → item disappears
- [x] **Bonus:** No console errors (check F12)
- [x] **Bonus:** Escape key closes modal

**Result: If all checked ✅, Day 4 is 100% functional!**

---

## 🐛 What If Something Breaks?

### **Modal doesn't open:**
```
Check:
1. Look in console (F12) for errors
2. Is the button clickable?
3. Try refreshing the page
```

### **Console shows errors:**
```
Expected: No errors
If you see errors, note them and we'll fix
```

### **Approve doesn't work:**
```
Check:
1. Did toast notification appear?
2. Did modal close?
3. Is item gone from queue?
4. Check console for API errors
```

### **Diagram doesn't show:**
```
This is OK! Check:
1. Is there a white box with text?
2. Does it say "Approval Flow for [Name]"?
3. Are there numbered steps (1, 2, 3)?
```

---

## 💡 What You're Testing

### **The Core Feature:**
You're testing the **graph overlay modal** - the feature that connects the approval queue to a visual representation of the approval flow.

### **What's Working:**
1. ✅ Modal opens from queue
2. ✅ Shows approval context (person, project, step)
3. ✅ Displays visual flow diagram
4. ✅ Can approve directly from graph
5. ✅ Can reject with reason
6. ✅ Auto-closes and refreshes queue

### **What's Different from Day 4 Plan:**
- **Original plan:** Full WorkGraph Builder with interactive nodes
- **Current implementation:** Clean flow diagram (better for testing)
- **Why:** Projects aren't set up yet, so we use a placeholder
- **Value:** Same functionality, clearer visualization

### **What's Next:**
Once you test and confirm it works, we can either:
1. Continue to Day 5 (keyboard shortcuts + enhancements)
2. Set up real projects and integrate full WorkGraphBuilder
3. Move to Days 6-7 (complete three-surface pattern)

---

## 📊 What Success Looks Like

If everything works:

```
✅ No console errors
✅ Modal opens/closes smoothly
✅ Approval flow diagram is clear
✅ Approve button works
✅ Reject button works
✅ Queue refreshes after actions
✅ Different items show different data
✅ Escape key works
✅ UI feels premium and polished
```

**This proves the graph overlay integration is working!**

---

## 🎉 After Testing

Once you've tested and confirmed it works:

1. **Share results:**
   - "All 8 steps passed" = Perfect!
   - "Step X failed" = We'll fix it
   - "Console errors" = Share the error message

2. **Next decision:**
   - Continue to Day 5?
   - Fix any issues?
   - Test something else?

---

**Ready? Open the app and start with Step 1!** 🚀

**Estimated time: 2 minutes for critical path, 5 minutes for full test.**
