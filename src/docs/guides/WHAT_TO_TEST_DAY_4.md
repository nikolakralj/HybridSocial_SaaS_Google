# ✅ Day 4 Testing Checklist - Graph Overlay Integration

**Date:** 2025-10-31  
**Feature:** "View path on graph" button connects approvals to visual graph  
**Time Required:** 5 minutes for critical path, 10 minutes for full test

---

## 🎯 Quick Critical Path (2 minutes)

**The fastest way to verify everything works:**

```
1. Open My Approvals
   ✅ See queue with 18 items

2. Click "View path on graph" on first item
   ✅ Full-screen modal opens
   ✅ Shows person name in header
   ✅ Shows project name
   ✅ Shows "Step X of Y" badge

3. Look at the graph
   ✅ WorkGraph Builder visible
   ✅ Some nodes are bright (blue)
   ✅ Some nodes are dim (gray)
   ✅ Info panel visible (top left)

4. Click "Approve Now from Graph" button
   ✅ Button shows "Approving..."
   ✅ Toast notification appears
   ✅ Modal closes automatically
   ✅ Back at queue
   ✅ Item is gone (approved)

✅ If all 4 steps work, Day 4 is complete!
```

---

## 🧪 Detailed Test Suite

### **Test 1: Modal Open/Close** ⏱️ 1 minute

**Steps:**
```
1. From My Approvals queue, click "View path on graph" on any item
   ✅ Modal opens (takes up ~95% of screen)
   ✅ Modal has white background
   ✅ Header shows at top
   ✅ Graph shows in middle
   ✅ Action bar shows at bottom

2. Press Escape key
   ✅ Modal closes immediately
   ✅ Back to queue
   ✅ Queue still shows all items

3. Click "View path on graph" again
   ✅ Modal opens again
   ✅ Shows same data

4. Click "Close" button in action bar
   ✅ Modal closes
   ✅ No errors in console
```

**Expected Modal Layout:**
```
┌─────────────────────────────────────────────────────┐
│ Header: Approval Path on Graph           [Step 2]  │
│ Person Name · Project · Date                       │
├─────────────────────────────────────────────────────┤
│ ┌────────┐                                          │
│ │ Info   │  [WorkGraph Builder with nodes/edges]   │
│ │ Panel  │                                          │
│ └────────┘                                          │
│                                   [Zoom hint]       │
├─────────────────────────────────────────────────────┤
│ Hours: 40  Amount: $6k  Next: Step 3              │
│ [Close]              [Reject] [Approve from Graph] │
└─────────────────────────────────────────────────────┘
```

---

### **Test 2: Header Data** ⏱️ 1 minute

**What to verify in header:**
```
✅ Person name displays (e.g., "Jane Doe")
✅ Role badge if present (e.g., "Senior Developer")
✅ Project name (e.g., "Mobile App Redesign")
✅ Week period (e.g., "Week of Oct 21")
✅ Current step badge (e.g., "Step 2" in blue)
✅ Party name (e.g., "TechCorp")
✅ Text: "You are at Step X of Y"

Try different items:
  - Different people → Name changes ✅
  - Different projects → Project changes ✅
  - Different steps → Step badge changes ✅
```

---

### **Test 3: Graph Visualization** ⏱️ 2 minutes

**Graph should be visible and interactive:**
```
1. WorkGraph Builder renders
   ✅ See nodes (circles/rectangles)
   ✅ See edges (lines connecting nodes)
   ✅ Graph fills the center area
   ✅ No "loading" spinner stuck

2. Node highlighting
   ✅ Some nodes have blue border (thick)
   ✅ Some nodes are bright (opacity 1)
   ✅ Some nodes are dim (opacity 0.2)
   ✅ Highlighted nodes = approval chain

3. Edge highlighting
   ✅ Some edges are blue and animated
   ✅ Some edges are gray and faded
   ✅ Blue edges = approval flow
   ✅ Edges may have "Step 1", "Step 2" labels

4. Interaction
   ✅ Can zoom with mouse wheel
   ✅ Can pan by dragging background
   ✅ Can click nodes (opens node details)
   ✅ Zoom controls visible (bottom left)
```

**What the approval path should look like:**
```
Bright nodes (blue border):
  - Contractor (who submitted)
  - Manager (current approver - YOU)
  - Finance (next approver)
  - Client (final approver)

Dim nodes (faded):
  - Other contracts
  - Other parties not in approval chain
  - Supporting nodes

Blue animated edges:
  - Contractor → Manager
  - Manager → Finance
  - Finance → Client
```

---

### **Test 4: Info Panel** ⏱️ 1 minute

**Top-left info panel should show:**
```
✅ Eye icon (👁️)
✅ Title: "Viewing Approval Path"
✅ Description text explaining the overlay
✅ Legend:
   - 🔵 Current approver (you)
   - ⚪ Not in approval path
   - ━━ Approval edge (sequential)

✅ White/translucent background
✅ Readable over the graph
✅ Doesn't block too much of graph
✅ Properly positioned (top-left)
```

---

### **Test 5: Action Bar** ⏱️ 1 minute

**Bottom action bar should display:**
```
Row 1: Item metrics
  ✅ "Hours: XX.X"
  ✅ "Amount: $X,XXX" or "Amount: •••" if masked
  ✅ "Rate masked" badge (if applicable)
  ✅ "⚠️ SLA Breached" (if applicable, in red)

Row 2: Next step info
  ✅ "Next: Step X of Y (Party Name)"
  ✅ OR "Final approval - will complete workflow"

Row 3: Buttons
  ✅ [Close] button (left)
  ✅ [Reject] button (center, red text)
  ✅ [Approve Now from Graph] button (right, green)
```

---

### **Test 6: Approve from Graph** ⏱️ 1 minute

**Critical functionality test:**
```
1. Open graph overlay for any item
2. Click "Approve Now from Graph" button
   
   ✅ Button text changes to "Approving..."
   ✅ Spinner icon appears on button
   ✅ Other buttons become disabled
   ✅ Can't click Reject while approving
   ✅ Can't click Close while approving

3. Wait ~300ms (mock delay)
   
   ✅ Toast notification appears:
      - "Approved from graph!"
      - "Moving to step X"
   
   ✅ Modal closes automatically
   ✅ No manual close needed

4. Back at queue
   
   ✅ Item is gone (removed from queue)
   ✅ Pending count decreased (18 → 17)
   ✅ Stats updated (hours, amount)
   ✅ Queue refreshed properly
```

---

### **Test 7: Reject from Graph** ⏱️ 1 minute

**Steps:**
```
1. Open graph overlay
2. Click "Reject" button
   
   ✅ Prompt/alert appears
   ✅ Asks for "Rejection reason:"

3. Enter reason: "Test rejection"
4. Click OK
   
   ✅ Button shows "Rejecting..."
   ✅ Spinner appears
   ✅ Other buttons disabled

5. Wait ~300ms
   
   ✅ Toast: "Rejected"
   ✅ Toast: "Contractor will be notified"
   ✅ Modal closes

6. Back at queue
   
   ✅ Item is gone
   ✅ Queue refreshed
```

**If you cancel the prompt:**
```
1. Click Reject
2. Press Cancel on prompt
   
   ✅ Nothing happens
   ✅ Modal stays open
   ✅ Item not rejected
   ✅ Can try again
```

---

### **Test 8: Multiple Items** ⏱️ 1 minute

**Test modal reusability:**
```
1. Open graph for Item A (Jane Doe)
   ✅ Header shows "Jane Doe"
   ✅ Shows Jane's project
   ✅ Shows Jane's step number

2. Close modal
3. Open graph for Item B (Mike Chen)
   ✅ Header shows "Mike Chen"
   ✅ Shows Mike's project (different)
   ✅ Shows Mike's step number (different)

4. Verify no data mixing
   ✅ Item A data doesn't appear in Item B view
   ✅ Each modal shows correct item
   ✅ No stale data from previous open
```

---

### **Test 9: SLA Warnings** ⏱️ 1 minute

**For items with SLA breach:**
```
1. Find an item with red "⚠️ Breach" badge
2. Open graph overlay
   
   ✅ Action bar shows "⚠️ SLA Breached" in red
   ✅ Warning icon visible
   ✅ Text is prominent

For normal items (no breach):
   ✅ No SLA warning in action bar
   ✅ Clean display
```

---

### **Test 10: Rate Masking** ⏱️ 1 minute

**For items with masked rates:**
```
1. Find item showing "•••" instead of amount
2. Open graph overlay
   
   ✅ Action bar shows "Amount: •••"
   ✅ "Rate masked" badge visible
   ✅ Still shows hours
   ✅ Can still click Approve

For items with visible rates:
   ✅ Shows actual dollar amount
   ✅ No masking badge
```

---

### **Test 11: Gating Warnings** ⏱️ 1 minute

**For items with gating.blocked = true:**
```
Open graph overlay

✅ Amber/yellow warning box appears above action bar
✅ Title: "Approval Gated"
✅ Lists blocking reasons:
   - "Missing task descriptions"
   - "Weekend work not pre-approved"
✅ Shows disclaimer text
✅ Approve button still enabled
✅ Can approve despite gating

For normal items:
   ✅ No gating warning box
```

---

### **Test 12: Zoom Hint** ⏱️ 30 seconds

**Bottom-left hint should show:**
```
✅ "💡 Use mouse wheel to zoom · Drag to pan · Click nodes for details"
✅ Small text (hint size)
✅ White/translucent background
✅ Doesn't block graph
✅ Positioned bottom-left
```

---

### **Test 13: Keyboard Shortcuts** ⏱️ 30 seconds

**Test Escape key:**
```
1. Open modal
2. Press Escape key
   ✅ Modal closes immediately

3. Open modal again
4. Start typing in graph (if search exists)
5. Press Escape
   ✅ Modal still closes

No other keyboard shortcuts implemented yet (Day 5 feature)
```

---

### **Test 14: Next Step Text** ⏱️ 1 minute

**Verify correct next step display:**
```
For Step 1 of 3:
   ✅ "Next: Step 2 of 3"

For Step 2 of 3:
   ✅ "Next: Step 3 of 3"

For Step 3 of 3 (last step):
   ✅ "Final approval - will complete workflow"
   ✅ No "Next: Step 4" shown
```

---

### **Test 15: Responsive Buttons** ⏱️ 1 minute

**Button state management:**
```
1. Click Approve
   ✅ Approve button disabled
   ✅ Reject button disabled
   ✅ Close button disabled
   ✅ Can't double-click

2. Wait for approval to complete
   ✅ Modal closes
   ✅ Buttons reset for next open

3. Click Reject (test separately)
   ✅ All buttons disabled
   ✅ Reject shows loading state
```

---

## 🎯 Success Criteria Summary

**All tests pass if:**

```
✅ Modal opens when clicking "View path on graph"
✅ Shows correct item data in header
✅ WorkGraph Builder renders with nodes/edges
✅ Approval path is highlighted (blue)
✅ Info panel explains the overlay
✅ Can zoom and pan the graph
✅ Action bar shows metrics correctly
✅ Can approve from graph → Item disappears
✅ Can reject from graph → Item disappears
✅ Modal closes automatically after action
✅ Queue refreshes after approval
✅ Escape key closes modal
✅ Multiple items work independently
✅ SLA warnings display
✅ Rate masking works
✅ Gating warnings show (if applicable)
✅ No console errors
```

---

## 🐛 Common Issues to Watch For

### **Modal Issues:**
```
❌ Modal doesn't open
   → Check onClick handler attached
   → Check graphOverlayOpen state
   → Check console for errors

❌ Modal is blank/white
   → Check if item prop is null
   → Check WorkGraphBuilder import
   → Check Dialog component styles
```

### **Graph Issues:**
```
❌ Graph doesn't render
   → Check projectId is valid
   → Check ReactFlow styles loaded
   → Check modal has proper height

❌ No highlighting
   → Check overlay mode is 'approvals'
   → Check applyApprovalsOverlay function
   → Check node data structure
```

### **Action Issues:**
```
❌ Approve doesn't work
   → Check approveItemMock is called
   → Check item.id is valid
   → Check onApprovalComplete callback

❌ Queue doesn't refresh
   → Check loadQueue is called
   → Check onApprovalComplete is passed
   → Check state updates properly
```

---

## ⏱️ Quick Test Matrix

**Run this in 5 minutes:**

| Test | Action | Expected | Time |
|------|--------|----------|------|
| 1 | Click "View path" | Modal opens | 10s |
| 2 | Check header | Shows person/project | 10s |
| 3 | Check graph | Nodes visible + highlighted | 20s |
| 4 | Check info panel | Legend visible | 10s |
| 5 | Press Escape | Modal closes | 5s |
| 6 | Open again | Same data shows | 5s |
| 7 | Click Approve | Toast + modal closes | 30s |
| 8 | Check queue | Item gone | 10s |
| 9 | Open different item | Different data | 20s |
| 10 | Try reject | Prompt + reject works | 30s |

**Total: ~2.5 minutes** ✅

---

## 💡 Testing Tips

1. **Test with different items** - Each should show its own data
2. **Test both approve and reject** - Both should work
3. **Check console** - Should be no errors
4. **Try keyboard shortcuts** - Escape should work
5. **Verify auto-close** - Modal should close after approval
6. **Check queue refresh** - Approved items should disappear

---

## 🎊 What Success Looks Like

**If everything works correctly:**

1. **Modal opens smoothly** - No lag, full screen
2. **Graph is beautiful** - Blue highlights, smooth animation
3. **Info panel is helpful** - Clear legend, good positioning
4. **Approve is instant** - Toast appears, modal closes, item gone
5. **No errors** - Console is clean
6. **Feels premium** - Apple-quality interactions

**This is the "wow" moment where approvals meet visual graphs! 🎨✨**

---

## 📚 Related Docs

- `/docs/guides/PHASE_5_DAY_4_COMPLETE.md` - Full implementation details
- `/docs/guides/WHAT_TO_TEST_DAY_3.md` - Previous day's tests
- `/components/approvals/GraphOverlayModal.tsx` - Component code

---

**Ready to test? Start with the Quick Critical Path (2 min) at the top!** 🚀
