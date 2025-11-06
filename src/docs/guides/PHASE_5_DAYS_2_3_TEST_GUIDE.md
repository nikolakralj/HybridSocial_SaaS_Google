# 🧪 Phase 5 Days 2-3: Complete Test Guide

**Date:** 2025-10-31  
**Status:** Ready to Test  
**Features:** Project Creation + Publish + Global Approvals Workbench

---

## 🎯 What We're Testing

### **Day 2 Features** ✅
1. Project loading in WorkGraph Builder
2. Publish button creates Policy v1
3. Projects list loads real data
4. End-to-end integration

### **Day 3 Features** 🆕
1. Global Approvals Workbench (cross-project)
2. Filter by project, party, step, SLA
3. Bulk approve functionality
4. Mock approval queue with 18 items

---

## 🚀 Quick Start (5 Minutes)

### **Step 1: Open Test Dashboard**
```
1. Go to Menu → "🧪 TEST DASHBOARD"
2. You'll see 8 feature test sections
3. Look for "M5.1 Collaborative Projects"
```

### **Step 2: Test Day 2 Features**
```
1. Click "Open Projects List"
   → Should show loading spinner
   → Then show empty state (no projects yet)

2. Click "New Project"
   → Opens 4-step wizard
   
3. Fill out wizard:
   Step 1 - Details:
     Name: "Test Project Day 2"
     Region: US
     Currency: USD
     Start: Today
   
   Step 2 - Parties: (optional - skip)
   
   Step 3 - Members: (optional - skip)
   
   Step 4 - Review:
     Click "Create Project"

4. Should navigate to Visual Builder
   → Shows "Test Project Day 2" in header
   → Shows "Owner" badge
   → Shows "US" and "USD" badges
   → Empty canvas ready for building

5. Build a simple graph:
   → Drag 2 Party nodes
   → Drag 1 Contract node
   → Connect with edges

6. Click "Publish" button
   → Should compile first
   → Toast: "Policy v1 published!"
   → Button changes to "Saved"

7. Navigate back to Projects
   → Menu → "📋 Projects"
   → Should show "Test Project Day 2" card
   → Shows 1 member (you as Owner)
   → Click to reopen

8. Builder reloads with your graph
   ✅ Day 2 working!
```

### **Step 3: Test Day 3 Features** 🆕
```
1. Go to Menu → "✅ My Approvals"
   → Opens Global Approvals Workbench
   
2. Should see:
   → Loading spinner
   → Then 18 pending approvals
   → Stats bar: Total hours, amount, SLA info
   → Filters across top
   
3. Test filters:
   → Click "All Projects" dropdown
   → Should show 4 projects with counts
   → Select "Mobile App Redesign"
   → Queue filters to that project
   
4. Test SLA badges:
   → Look for red "⚠️ Breach" badges
   → Look for amber "🟡 <24h" badges
   → Look for green "✅ OK" badges
   
5. Test single approval:
   → Find any item
   → Click "Approve" button
   → Toast: "Approved! Moving to next step"
   → Item disappears from queue
   
6. Test bulk approval:
   → Check 3-4 items using checkboxes
   → Purple toolbar appears
   → Shows "X selected"
   → Click "Approve Selected"
   → Toast: "Approved X items!"
   → All selected items disappear
   
7. Test "Why?" button:
   → Click on any item
   → (Currently placeholder, but button exists)
   
8. Test "View path on graph":
   → Click on any item
   → (Day 5 feature - placeholder for now)
   
✅ Day 3 working!
```

---

## 📋 Detailed Test Scenarios

### **Scenario 1: Multi-Project Workflow** 🎯

**Goal:** Test cross-project functionality

```
Setup:
  1. Create 3 projects:
     - Project A: "Mobile App"
     - Project B: "API Backend"
     - Project C: "Marketing Site"
  
  2. Each project should be created via wizard
  
Test:
  1. Open "My Approvals"
     ✅ Should show approvals from all 3 projects
  
  2. Filter to "Mobile App"
     ✅ Should only show Mobile App items
  
  3. Clear filters
     ✅ Should show all items again
  
  4. Check stats bar
     ✅ Total hours = sum of all items
     ✅ Total amount = visible amounts only
     ✅ SLA breach count = red badge items
  
  5. Bulk approve 5 items
     ✅ All 5 disappear
     ✅ Counts update
  
Result: Cross-project approvals working! ✅
```

---

### **Scenario 2: Project Creation → Build → Publish** 🎯

**Goal:** Test full end-to-end flow

```
Test:
  1. Projects List (Empty State)
     → Menu → "📋 Projects"
     ✅ Shows empty state
     ✅ "Create First Project" button visible
  
  2. Create Project
     → Click "New Project"
     → Fill wizard (all 4 steps)
     ✅ Validation works
     ✅ Can skip optional steps
     ✅ Review shows summary
  
  3. Wizard Complete
     → Click "Create Project"
     ✅ Toast: "Project created!"
     ✅ Navigates to Visual Builder
     ✅ Project ID stored in sessionStorage
  
  4. Builder Loads
     ✅ Shows project name in header
     ✅ Shows user role badge
     ✅ Shows region + currency
     ✅ Empty canvas
     ✅ Node palette ready
  
  5. Build Graph
     → Drag 3 nodes
     → Connect with edges
     → Edit properties
     ✅ Graph renders
     ✅ Can select nodes
     ✅ Can edit properties
  
  6. Validate
     → Click "Validate"
     ✅ Shows validation results
     ✅ Green checkmark if valid
  
  7. Compile & Test
     → Click "Compile & Test"
     ✅ Switches to Simulator tab
     ✅ Shows compiled policy
     ✅ Can test scenarios
  
  8. Publish
     → Back to Builder tab
     → Click "Publish"
     ✅ Toast: "Policy v1 published!"
     ✅ Console logs policy
     ✅ Button changes state
  
  9. Navigate Away & Back
     → Menu → "📋 Projects"
     ✅ Shows project in list
     → Click project card
     ✅ Reopens in builder
     ✅ Graph still there
  
Result: Full flow working! ✅
```

---

### **Scenario 3: Approval Queue Filtering** 🎯

**Goal:** Test all filter combinations

```
Test:
  1. Project Filter
     → Select "Mobile App Redesign"
     ✅ Queue filters to 4-5 items
     ✅ All items show that project
  
  2. Party Filter
     → Select "TechCorp"
     ✅ Queue filters to TechCorp approvals
     ✅ All items show TechCorp as party
  
  3. Step Filter
     → Select "Step 2 of 3"
     ✅ Queue shows only step 2 items
  
  4. SLA Filter
     → Select "⚠️ Breached"
     ✅ Only shows red badge items
     → Select "🟡 Due Soon"
     ✅ Only shows amber badge items
  
  5. Combined Filters
     → Project: "Mobile App"
     → SLA: "Breached"
     ✅ Shows intersection (breached items in Mobile App)
  
  6. Clear Filters
     → Click "Clear Filters"
     ✅ All filters reset
     ✅ Full queue visible
  
Result: Filtering working! ✅
```

---

### **Scenario 4: Bulk Approval with Threshold** 🎯

**Goal:** Test bulk approve with policy threshold

```
Test:
  1. Select High-Value Items
     → Check 3 items with amounts > $5k
     → Click "Approve Selected"
     ✅ Shows threshold warning if > $10k total
     ✅ Some may be rejected
     ✅ Toast shows approved vs failed count
  
  2. Select Low-Value Items
     → Check 5 items with amounts < $2k each
     → Click "Approve Selected"
     ✅ All approved (under threshold)
     ✅ Toast: "Approved 5 items!"
  
  3. Mixed Selection
     → Check 10 items (mixed values)
     → Click "Approve Selected"
     ✅ Low-value approved
     ✅ High-value rejected
     ✅ Detailed feedback in toast
  
Result: Bulk approval with threshold working! ✅
```

---

### **Scenario 5: Rate Masking** 🎯

**Goal:** Verify field-level security

```
Test:
  1. View Queue
     → Look at different items
     ✅ Some show "$6,000" (visible)
     ✅ Some show "•••" (masked)
     ✅ "Rate masked" badge on masked items
  
  2. Approve Masked Item
     → Select item with "•••"
     → Click "Approve"
     ✅ Approves successfully
     ✅ You don't need to see rate to approve
  
  3. Check Stats
     → Total Amount in stats bar
     ✅ Only includes visible amounts
     ✅ Masked amounts not in total
  
Result: Rate masking working! ✅
```

---

## 🎨 Visual Indicators to Check

### **Projects List:**
```
✅ Empty state:
   - Icon (plus in circle)
   - "No projects yet" heading
   - Description text
   - "Create First Project" button

✅ Project cards:
   - Project name (bold)
   - Description (gray)
   - Status badge (green "Active")
   - Region badge (e.g., "US")
   - Currency badge (e.g., "USD")
   - Member count
   - Start date
   - Work week badges (Mon, Tue, etc.)
   - "Open in Builder" button (purple)

✅ Loading state:
   - Spinner (purple, animated)
   - "Loading projects..." text
```

### **Visual Builder:**
```
✅ Header:
   - Project name (left)
   - Role badge (Owner, Editor, etc.)
   - Region badge
   - Currency badge
   - Tabs (Builder | Simulator)
   - Validation button
   - Compile & Test button
   - Publish button (purple, Owner only)
   - Save button (ghost)

✅ Canvas:
   - Gray background with grid
   - MiniMap (bottom right)
   - Controls (zoom, fit)
   - Node palette (left sidebar)
   - Overlay controller (left sidebar)

✅ Publish button states:
   - Enabled: Purple bg, white text, "Publish"
   - Publishing: Spinner, "Publishing..."
   - Disabled: Gray, "Publish" (empty graph)
```

### **Approvals Workbench:**
```
✅ Header:
   - "My Approvals" title
   - "Cross-project approval workbench" subtitle
   - Pending count badge (e.g., "🔔 18 pending")
   - Breach count badge (red, if any)

✅ Stats bar:
   - 4 stat cards (gray bg)
   - Total Hours (clock icon)
   - Total Amount (trending up icon)
   - SLA Breach (warning icon, red text)
   - Due Soon (bar chart icon, amber text)

✅ Filters:
   - Filter icon
   - 4 dropdowns (Project, Party, Step, SLA)
   - "Clear Filters" button (if active)

✅ Queue items:
   - White cards with hover shadow
   - Checkbox (left)
   - Person name (bold)
   - Role badge
   - Project, date, step info (gray)
   - SLA badge (red/amber/green)
   - Hours, Amount, Submitted date
   - Action buttons:
     * Approve (green)
     * Reject (outline)
     * Why? (ghost)
     * View path on graph (ghost)

✅ Bulk toolbar (when items selected):
   - Purple background
   - Checkbox (select all)
   - "X selected" text
   - "Approve Selected" button (green)
   - "Cancel" button

✅ Empty state (all approved):
   - Green checkmark icon
   - "All caught up!" heading
   - "No pending approvals" text
```

---

## 🐛 Known Issues & Expected Behavior

### **Day 2:**
```
✅ Working:
   - Project creation via wizard
   - Project storage in mock API
   - Builder loads project
   - Publish creates policy v1
   - Projects list loads data
   - Navigation between sections
   - Draft autosave & recovery

⏳ Not Yet Implemented:
   - Real backend (using mocks)
   - Multi-user collaboration
   - Email notifications
```

### **Day 3:**
```
✅ Working:
   - Cross-project queue
   - Filters (project, party, step, SLA)
   - Single approve/reject
   - Bulk approve
   - Rate masking
   - SLA badges
   - Stats calculation

⏳ Placeholder (Day 5):
   - "Why?" explainer (button exists, no modal)
   - "View path on graph" (button exists, no overlay)
   - Deep-link from email
   - Project-scoped approvals tab

❌ Keyboard Shortcuts:
   - Shown in footer
   - Not yet wired up
   - Coming in polish phase
```

---

## 📊 Performance Checks

### **Load Times:**
```
Target:
  - Projects list load: < 500ms
  - Approvals queue load: < 300ms
  - Builder open: < 500ms
  - Publish action: < 500ms

To test:
  1. Open Network tab in DevTools
  2. Clear cache
  3. Reload each section
  4. Check "Finish" time in Network tab
```

### **Responsiveness:**
```
Test:
  1. Filter approvals by project
     → Should update < 100ms
  
  2. Select 10 items for bulk approve
     → Checkboxes should respond instantly
  
  3. Drag nodes in builder
     → Smooth 60fps movement
  
  4. Switch between tabs (Builder/Simulator)
     → Instant switch
```

---

## ✅ Success Checklist

### **Day 2 - Complete if:**
- [ ] Can create project via wizard
- [ ] Builder loads project with correct info
- [ ] Can build graph (drag nodes, connect edges)
- [ ] Can validate graph
- [ ] Can compile to policy
- [ ] Can test in simulator
- [ ] **Can publish Policy v1** ← Key feature!
- [ ] Projects list shows created projects
- [ ] Can reopen project from list
- [ ] Graph persists (draft recovery)

### **Day 3 - Complete if:**
- [ ] Approvals workbench shows 18 mock items
- [ ] Stats bar shows totals
- [ ] SLA badges render correctly
- [ ] Can filter by project
- [ ] Can filter by party
- [ ] Can filter by step
- [ ] Can filter by SLA
- [ ] Can approve single item
- [ ] Can reject single item
- [ ] Can bulk approve multiple items
- [ ] Rate masking works (some show •••)
- [ ] Bulk toolbar appears when selecting
- [ ] Empty state shows after approving all

---

## 🎉 Expected Results

### **If Everything Works:**

```
1. Project Creation Flow:
   Create → Build → Publish → List → Reopen
   ✅ Smooth navigation
   ✅ Data persists
   ✅ No errors in console

2. Approvals Workbench:
   Load → Filter → Approve → Bulk Approve
   ✅ Fast filtering
   ✅ Accurate counts
   ✅ Clean UI updates

3. Integration:
   Projects ↔ Builder ↔ Approvals
   ✅ Can navigate freely
   ✅ State persists
   ✅ sessionStorage working
```

### **Console Output to Expect:**

```javascript
// On project create:
✅ Project created: { id: 'project-1', name: 'Test Project' }

// On builder load:
✅ Project loaded: Test Project, Role: Owner

// On publish:
✅ Policy published: { version: 1, nodes: 3, edges: 2 }

// On approvals load:
✅ Loaded approval queue: 18 items

// On approve:
✅ Item approved: approval-1

// On bulk approve:
✅ Bulk approved: 5 items
```

---

## 🚨 Troubleshooting

### **Problem: Projects list shows empty**
```
Check:
  1. Did you create a project first?
  2. Open console, look for API errors
  3. Check sessionStorage for 'currentProjectId'

Fix:
  - Click "New Project" and complete wizard
  - Refresh after creating
```

### **Problem: Builder doesn't load project**
```
Check:
  1. Is projectId in sessionStorage?
  2. Console shows "Loading project..."?
  3. Any error after loading?

Fix:
  - Create new project from list
  - Check mock API has data
  - Clear sessionStorage and retry
```

### **Problem: Publish button disabled**
```
Check:
  1. Is user role "Owner"?
  2. Are there nodes on canvas?
  3. Any validation errors?

Fix:
  - Add at least 1 node
  - Click "Validate" first
  - Check role badge in header
```

### **Problem: Approvals queue empty**
```
Check:
  1. Look at filters - are they restrictive?
  2. Console shows "Loaded approval queue: X items"?
  3. Any API errors?

Fix:
  - Click "Clear Filters"
  - Refresh page
  - Check mock data is generated
```

### **Problem: Bulk approve doesn't work**
```
Check:
  1. Are items selected? (checkboxes checked)
  2. Toolbar visible?
  3. Console errors?

Fix:
  - Select items first
  - Check threshold (items over $10k may fail)
  - Look for toast message explaining
```

---

## 🎯 Next Steps After Testing

### **If All Tests Pass** ✅

```
🎉 Congratulations! Days 2-3 are complete!

Ready for:
  - Day 4-5: Graph overlay integration
  - Day 6-7: Project approvals tab + deep-links
  - Days 8-14: Network Graph MVP

You've built:
  ✅ Project creation system
  ✅ Visual builder with publish
  ✅ Cross-project approvals workbench
  ✅ Filtering & bulk actions
  ✅ Rate masking
  ✅ End-to-end integration
```

### **If Issues Found** 🐛

```
Document:
  1. What broke?
  2. Steps to reproduce
  3. Expected vs actual behavior
  4. Console errors
  5. Screenshots

Then:
  - Fix critical issues
  - Mark nice-to-haves for later
  - Retest after fixes
```

---

## 📖 Related Documentation

**Implementation:**
- `/docs/guides/PHASE_5_DAY_2_COMPLETE.md` - Day 2 summary
- `/docs/guides/THREE_SURFACE_APPROVALS_ARCHITECTURE.md` - Day 3 architecture

**Testing:**
- `/docs/guides/TEST_NOW.md` - Quick test guide
- `/docs/guides/COMPREHENSIVE_TEST_GUIDE.md` - Full test suite

**Roadmap:**
- `/docs/WORKGRAPH_MASTER_ROADMAP.md` - Full roadmap
- `/docs/roadmap/MASTER_ROADMAP.md` - Detailed timeline

---

**Created:** 2025-10-31  
**Test Duration:** 15-20 minutes for full test  
**Quick Test:** 5 minutes for smoke test  
**Success Rate:** Target 100% pass on all scenarios

**Ready to test? Let's go! 🚀**
