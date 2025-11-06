# 🧪 WorkGraph Comprehensive Testing Guide

**Created:** 2025-10-31  
**Purpose:** Complete testing checklist for all implemented features  
**Status:** Ready for testing

---

## 📋 Quick Navigation

**What to Test:**
1. [Project Creation Wizard](#1-project-creation-wizard) ✅ M5.1
2. [WorkGraph Visual Builder](#2-workgraph-visual-builder) ✅ Phase A1
3. [Projects List & Navigation](#3-projects-list--navigation) ✅ M5.1
4. [Timesheet System](#4-timesheet-system) ✅ Complete
5. [Approval System](#5-approval-system) ✅ 3-Layer System
6. [Policy Versioning](#6-policy-versioning) ✅ Simulation
7. [Permission System](#7-permission-system) ✅ Role-based
8. [Onboarding Flows](#8-onboarding-flows) ✅ All personas

---

## 🎯 Testing Strategy

### **How to Use This Guide:**
1. **Sequential Testing** - Go through each section in order
2. **Feature Isolation** - Test each feature independently
3. **Integration Testing** - Test feature interactions
4. **Edge Cases** - Try to break things
5. **Document Bugs** - Note any issues found

### **Test Environment:**
```
✅ Development mode (using mock APIs)
✅ Chrome/Firefox/Safari
✅ Desktop + Mobile responsive
✅ Console open for errors
```

---

## 1. Project Creation Wizard

### **🎯 Location:** 
```
Menu → "📋 Projects" → "New Project" button
```

### **✅ What to Test:**

#### **Step 1: Basics**
- [ ] Can enter project name
- [ ] Can select region (US/EU/UK)
- [ ] Can select currency (USD/EUR/GBP)
- [ ] Can set start date (date picker opens)
- [ ] Can set end date (optional)
- [ ] Can configure work week (Mon-Fri checkboxes)
- [ ] "Next" button disabled until name + region + currency filled
- [ ] Can click "Next" when valid

#### **Step 2: Parties**
- [ ] Shows empty state "No parties added yet"
- [ ] "Add Party" button opens party form
- [ ] Can enter party name
- [ ] Can select party type (Company/Agency/Team)
- [ ] Can add multiple parties
- [ ] Can remove parties
- [ ] Can skip this step (optional)
- [ ] "Next" button enabled

#### **Step 3: Collaborators**
- [ ] Shows role selector (Owner/Editor/Contributor/Viewer)
- [ ] Can add collaborators by email
- [ ] Each role shows correct description
- [ ] Owner role is auto-selected for you
- [ ] Can add multiple collaborators
- [ ] Can remove collaborators
- [ ] Can skip this step (optional)
- [ ] "Next" button enabled

#### **Step 4: Review**
- [ ] Shows project name
- [ ] Shows region, currency, dates
- [ ] Shows work week configuration
- [ ] Shows list of parties added
- [ ] Shows list of collaborators with roles
- [ ] "Create Project" button enabled
- [ ] "Back" button works to edit
- [ ] Can click "Create Project"

#### **After Creation:**
- [ ] Toast shows "Project created successfully!"
- [ ] Wizard closes
- [ ] Navigates to Visual Builder (currently empty)
- [ ] URL changes to `/visual-builder` or `/workgraph/{projectId}`

#### **Edge Cases:**
- [ ] Cancel wizard - no project created
- [ ] Go back through steps - data preserved
- [ ] Invalid email format - shows error
- [ ] Duplicate party names - allowed or prevented?

### **🐛 Known Issues:**
- WorkGraph Builder doesn't load project yet (Day 2)
- Projects list doesn't show created projects (Day 2)

---

## 2. WorkGraph Visual Builder

### **🎯 Location:**
```
Menu → "🎨 Visual Builder"
```

### **✅ What to Test:**

#### **Canvas Basics**
- [ ] Canvas loads without errors
- [ ] Can pan canvas (click + drag)
- [ ] Can zoom (scroll wheel)
- [ ] Can zoom with buttons (+/- in toolbar)
- [ ] Can fit view to content
- [ ] Grid is visible
- [ ] Snap to grid works

#### **Node Palette**
- [ ] Palette visible on left side
- [ ] Shows 3 node types: Party, Contract, Person
- [ ] Can drag Party node onto canvas
- [ ] Can drag Contract node onto canvas
- [ ] Can drag Person node onto canvas
- [ ] Nodes snap to grid
- [ ] Each node has correct icon/color

#### **Node Interaction**
- [ ] Can click node to select
- [ ] Selected node highlights (border/glow)
- [ ] Property panel opens on right
- [ ] Can edit node properties
- [ ] Can move node by dragging
- [ ] Can delete node (Delete key or X button)
- [ ] Multiple nodes can exist

#### **Edges/Connections**
- [ ] Can connect two nodes (drag from handle)
- [ ] Edge appears with arrow
- [ ] Can click edge to select
- [ ] Edge config popover opens
- [ ] Can select edge type (Approves, Funds, etc.)
- [ ] Edge color/style changes with type
- [ ] Can delete edge (Delete key)

#### **Property Panel**
- [ ] Opens when node selected
- [ ] Closes when deselect
- [ ] Shows correct fields per node type
- [ ] **Party Node:** Name, Type, Region
- [ ] **Contract Node:** Name, Rate, Currency, Scope
- [ ] **Person Node:** Name, Email, Role
- [ ] Changes save immediately
- [ ] Validation works (required fields)

#### **Validation Panel**
- [ ] "Validate" button in toolbar
- [ ] Click shows validation panel
- [ ] Detects cycles in approval chains
- [ ] Detects disconnected nodes
- [ ] Detects missing required properties
- [ ] Shows error count
- [ ] Clicking error highlights node

#### **Compile Modal**
- [ ] "Compile" button in toolbar
- [ ] Opens modal showing compiled JSON
- [ ] Shows approval policy structure
- [ ] Shows visibility rules
- [ ] JSON is valid and formatted
- [ ] Can close modal

#### **Policy Simulator**
- [ ] "Simulate" button in toolbar
- [ ] Opens simulator modal
- [ ] Can enter test inputs
- [ ] Can select approval scenario
- [ ] "Run Simulation" executes
- [ ] Shows approval flow visualization
- [ ] Shows which parties approve at each step
- [ ] Shows final result

#### **Templates**
- [ ] "Load Template" button exists
- [ ] Can select template from list
- [ ] Template loads nodes onto canvas
- [ ] Template includes connected nodes
- [ ] Can edit template nodes
- [ ] Multiple templates available

#### **Version History**
- [ ] "Versions" button in toolbar
- [ ] Opens version history drawer
- [ ] Shows list of saved versions (if any)
- [ ] Can view version details
- [ ] Can restore previous version
- [ ] Shows timestamp, author, changes

#### **Overlay Modes**
- [ ] Can toggle overlay mode (button in toolbar)
- [ ] "Preview As Party" overlay works
- [ ] Select party - nodes gray out correctly
- [ ] "Highlight Approvals" overlay works
- [ ] Shows approval flow path
- [ ] Can turn off overlay

### **🐛 Known Issues:**
- Builder doesn't load project from wizard yet (Day 2)
- Publish button not wired to create Policy v1 (Day 2)

---

## 3. Projects List & Navigation

### **🎯 Location:**
```
Menu → "📋 Projects"
```

### **✅ What to Test:**

#### **Empty State**
- [ ] Shows "No projects yet" if none created
- [ ] "New Project" button visible
- [ ] Clear call-to-action messaging

#### **Project List** (after creating projects)
- [ ] Shows project cards/rows
- [ ] Each card shows: Name, Region, Created date
- [ ] Shows member count (if applicable)
- [ ] Shows status badge (Active/Draft)
- [ ] Can click project to open

#### **Actions**
- [ ] "New Project" opens wizard
- [ ] Clicking project navigates to builder
- [ ] Search/filter works (if implemented)
- [ ] Sort by name/date works (if implemented)

#### **Navigation**
- [ ] Custom routing works (no react-router)
- [ ] Browser back/forward works
- [ ] Direct URL access works

### **🐛 Known Issues:**
- List doesn't show created projects yet (uses mock data - Day 2)
- Need to implement `loadProjects()` from API

---

## 4. Timesheet System

### **🎯 Location:**
```
Menu → "⏱️ Timesheets (Old)" (legacy demo)
Menu → "📁 Project Workspace" → "Timesheets" tab
```

### **✅ What to Test:**

#### **Calendar View**
- [ ] Calendar grid loads
- [ ] Shows current week
- [ ] Can navigate weeks (prev/next)
- [ ] Can jump to specific month
- [ ] Weekends highlighted differently
- [ ] Work week configuration respected

#### **Time Entry**
- [ ] Click day cell opens entry modal
- [ ] Can enter hours
- [ ] Can select task/category
- [ ] Can add notes
- [ ] Can save entry
- [ ] Entry appears in calendar cell
- [ ] Total hours calculate correctly

#### **Multi-Person Calendar** (Team view)
- [ ] Shows multiple people rows
- [ ] Each person has own row
- [ ] Can filter by person
- [ ] Can filter by contract
- [ ] Totals calculate per person
- [ ] Totals calculate per day

#### **Drag & Drop**
- [ ] Can drag time entry to different day
- [ ] Can drag to different person (if multi-person)
- [ ] Conflict dialog shows if overlapping
- [ ] Can copy entry (hold Ctrl/Cmd)
- [ ] Can cancel drag (Esc key)

#### **Bulk Entry**
- [ ] "Copy to Others" button visible
- [ ] Can select multiple days
- [ ] Can select multiple people
- [ ] "Apply to Selection" works
- [ ] Shows confirmation
- [ ] Entries created correctly

#### **Table View**
- [ ] Can switch to table view
- [ ] Shows rows per person
- [ ] Shows columns per day
- [ ] Can edit inline
- [ ] Can quick-edit (popover)
- [ ] Totals row calculates

#### **Database Sync**
- [ ] Entries save to database (check console)
- [ ] Reload page - entries persist
- [ ] Multiple users see same data (if testing)

### **🐛 Known Issues:**
- Legacy demo vs new implementation - use Project Workspace version
- Some features still use mock data

---

## 5. Approval System

### **🎯 Location:**
```
Menu → "📁 Project Workspace" → "Approvals" tab
```

### **✅ What to Test:**

#### **3-Layer Approval Architecture**

**Layer 1: Person-Period Cards**
- [ ] Cards group by person + month/period
- [ ] Shows person name, avatar
- [ ] Shows total hours for period
- [ ] Shows status (Pending/Approved/Rejected)
- [ ] Can expand/collapse card
- [ ] Shows timesheet entries inside

**Layer 2: Contract Groups**
- [ ] Cards group by contract
- [ ] Shows contract name, company
- [ ] Shows rate (if visible to user)
- [ ] Shows total hours per contract
- [ ] Color-coded by contract type
- [ ] Can expand/collapse

**Layer 3: Organization Groups**
- [ ] Top-level grouping by org/company
- [ ] Shows org name, logo
- [ ] Shows total pending approvals
- [ ] Shows approval hierarchy
- [ ] Can expand/collapse

#### **Approval Actions**
- [ ] Can approve individual timesheet
- [ ] Can reject individual timesheet
- [ ] Can add rejection note
- [ ] Batch select multiple timesheets
- [ ] Batch approve selected
- [ ] Batch reject selected
- [ ] Approval updates status immediately

#### **Monthly Drawer**
- [ ] Click timesheet opens drawer
- [ ] Shows full month calendar
- [ ] Shows all entries for person
- [ ] Shows daily totals
- [ ] Shows weekly totals
- [ ] Shows month total
- [ ] Shows contract details
- [ ] Can approve from drawer
- [ ] Can reject from drawer
- [ ] Can add notes

#### **Filters & Views**
- [ ] Can filter by status (Pending/Approved/Rejected)
- [ ] Can filter by month/period
- [ ] Can filter by person
- [ ] Can filter by contract
- [ ] Can filter by organization
- [ ] Counts update correctly

#### **Approval Flow**
- [ ] Contractor submits timesheet
- [ ] Manager sees in pending queue
- [ ] Manager approves - moves to approved
- [ ] If multi-level: Next approver sees it
- [ ] Final approval generates invoice
- [ ] Rejected entries go back to contractor

#### **Invoice Generation** (if implemented)
- [ ] After approval, invoice generates
- [ ] Invoice shows correct hours
- [ ] Invoice shows correct rate
- [ ] Invoice shows correct total
- [ ] Can download PDF
- [ ] Shows approval history

### **🐛 Known Issues:**
- Demo data only (real data integration pending)
- Invoice generation may be mock

---

## 6. Policy Versioning

### **🎯 Location:**
```
Visual Builder → "Compile" button → "Simulate" tab
```

### **✅ What to Test:**

#### **Policy Compilation**
- [ ] Can compile graph to JSON
- [ ] JSON includes approval steps
- [ ] JSON includes visibility rules
- [ ] JSON includes party configurations
- [ ] Validation errors prevent compile

#### **Version Management**
- [ ] Can save policy version
- [ ] Can name version (v1, v2, etc.)
- [ ] Can view version history
- [ ] Can compare versions (diff)
- [ ] Can restore previous version
- [ ] Active version badge shows

#### **Policy Simulation**
- [ ] Can select policy version to simulate
- [ ] Can enter test scenario inputs
- [ ] Can select different party perspectives
- [ ] Simulation runs approval flow
- [ ] Shows step-by-step visualization
- [ ] Shows which parties approve
- [ ] Shows masked/visible fields
- [ ] Shows final outcome

#### **Simulator Inputs**
- [ ] Can set timesheet hours
- [ ] Can set contractor rate
- [ ] Can set contract type
- [ ] Can trigger edge cases (overtime, etc.)
- [ ] Inputs validate correctly

#### **Simulator Results**
- [ ] Shows approval path diagram
- [ ] Highlights active approval step
- [ ] Shows party names at each step
- [ ] Shows approval logic (parallel/sequential)
- [ ] Shows rate visibility per party
- [ ] Shows final approved/rejected state
- [ ] Can reset and re-run

### **🐛 Known Issues:**
- Simulator uses demo policies
- Real policy execution pending backend

---

## 7. Permission System

### **🎯 Location:**
```
Throughout app - role-based UI elements
```

### **✅ What to Test:**

#### **Role Definitions**
- [ ] Owner: Full control
- [ ] Editor: Create/edit parties, contracts
- [ ] Contributor: Edit their org only
- [ ] Commenter: Add comments only
- [ ] Viewer: Read-only

#### **UI Permission Gating**
- [ ] Owner sees "Publish" button
- [ ] Editor sees edit controls
- [ ] Contributor sees limited edit
- [ ] Viewer sees no edit controls
- [ ] Unauthorized actions hidden

#### **API Permission Checks**
- [ ] `canUserPerform(role, action)` works
- [ ] Create project: Owner only
- [ ] Edit nodes: Owner + Editor
- [ ] Publish: Owner only
- [ ] Invite members: Owner only
- [ ] View project: All roles

#### **Permission Errors**
- [ ] Unauthorized action shows error
- [ ] Error message is clear
- [ ] Doesn't break app

### **🐛 Known Issues:**
- Mock API - permissions not enforced server-side yet

---

## 8. Onboarding Flows

### **🎯 Location:**
```
Landing page → "Get Started" → Select persona
```

### **✅ What to Test:**

#### **Personal Profile Setup**
- [ ] Shows after signup
- [ ] Can enter full name
- [ ] Can enter headline
- [ ] Can enter bio
- [ ] Can upload avatar (if implemented)
- [ ] Can set location
- [ ] "Continue" saves and proceeds

#### **Freelancer Onboarding**
- [ ] Shows freelancer-specific questions
- [ ] Can set hourly rate
- [ ] Can set availability
- [ ] Can select skills
- [ ] Can set work preferences
- [ ] Saves to profile

#### **Company Onboarding**
- [ ] Shows company-specific questions
- [ ] Can enter company name
- [ ] Can set company size
- [ ] Can describe hiring needs
- [ ] Can set budget range
- [ ] Saves to company profile

#### **Agency Onboarding**
- [ ] Shows agency-specific questions
- [ ] Can enter agency name
- [ ] Can set agency size
- [ ] Can describe services
- [ ] Can add team members
- [ ] Saves to agency profile

#### **Post-Onboarding**
- [ ] Navigates to appropriate dashboard
- [ ] Profile data persists
- [ ] Can edit profile later
- [ ] Welcome message shows

### **🐛 Known Issues:**
- Mock data only
- Backend integration pending

---

## 🧪 Integration Testing Scenarios

### **Scenario 1: End-to-End Project Creation**
```
1. Create project via wizard
2. Add 2 parties, 2 collaborators
3. Open project in builder
4. Add nodes and edges
5. Validate graph
6. Compile to policy
7. Simulate approval flow
8. Publish policy v1
```

**Expected Result:** Complete flow works without errors

### **Scenario 2: Multi-User Timesheet Approval**
```
1. Contractor enters time (Mon-Fri)
2. Contractor submits for approval
3. Manager opens approvals tab
4. Manager reviews monthly drawer
5. Manager approves timesheet
6. Invoice generates
```

**Expected Result:** Approval flow completes, status updates

### **Scenario 3: Permission-Based Access**
```
1. Owner creates project
2. Owner invites Editor
3. Editor opens project
4. Editor can edit nodes
5. Editor cannot publish
6. Viewer can only view
```

**Expected Result:** Permissions enforced correctly

---

## 🐛 Bug Reporting Template

**When you find a bug, document:**

```markdown
### Bug: [Short description]

**Location:** [Where in app]
**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior:** [What should happen]
**Actual Behavior:** [What actually happens]
**Console Errors:** [Copy any errors]
**Screenshot:** [If helpful]
**Priority:** High/Medium/Low
**Browser:** Chrome/Firefox/Safari
```

---

## 📊 Test Coverage Checklist

**Before shipping to users:**

### **Core Features**
- [ ] Project creation works E2E
- [ ] Visual builder functional
- [ ] Timesheets save/load
- [ ] Approvals process correctly
- [ ] Permissions enforced
- [ ] Navigation works
- [ ] No console errors

### **Edge Cases**
- [ ] Empty states handled
- [ ] Error states handled
- [ ] Loading states shown
- [ ] Invalid inputs rejected
- [ ] Conflicts resolved
- [ ] Undo/redo works

### **Performance**
- [ ] Large projects load quickly
- [ ] Many timesheets don't lag
- [ ] Approval list scrolls smoothly
- [ ] No memory leaks
- [ ] Responsive on mobile

### **Accessibility**
- [ ] Keyboard navigation works
- [ ] Screen reader friendly
- [ ] Color contrast sufficient
- [ ] Focus indicators visible
- [ ] Error messages clear

### **Browser Compatibility**
- [ ] Chrome works
- [ ] Firefox works
- [ ] Safari works
- [ ] Edge works
- [ ] Mobile browsers work

---

## 🚀 Quick Test Sequence (15 minutes)

**For rapid testing:**

1. **Projects** (3 min)
   - Create new project
   - Add parties
   - Check navigation

2. **Builder** (4 min)
   - Add 3 nodes
   - Connect with edges
   - Validate
   - Compile

3. **Timesheets** (4 min)
   - Enter time
   - Drag to copy
   - Check totals

4. **Approvals** (3 min)
   - Open approvals
   - Approve timesheet
   - Check status

5. **Navigation** (1 min)
   - Jump between sections
   - Check menu works

---

## 📈 Test Results Summary

**After testing, fill this out:**

```
Date: _____________
Tester: _____________

✅ Passed: _____ / _____
❌ Failed: _____ / _____
⚠️  Warnings: _____ / _____

Critical Issues Found: _____
Blockers: _____
Nice-to-haves: _____

Ready for Production? Yes / No / Needs Work

Notes:
__________________________
__________________________
__________________________
```

---

## 🎯 What's Working vs What's Pending

### **✅ WORKING NOW:**
- Project wizard creates projects ✅
- Visual builder UI functional ✅
- Node palette, drag & drop ✅
- Property panel ✅
- Validation system ✅
- Policy compilation ✅
- Policy simulator ✅
- Timesheet calendar ✅
- Approval system (3-layer) ✅
- Permission checking ✅
- Onboarding flows ✅
- Custom navigation ✅

### **⏳ PENDING (Day 2):**
- WorkGraph Builder load project ⏳
- Publish button → Policy v1 ⏳
- Projects list load real data ⏳

### **❌ NOT YET IMPLEMENTED:**
- Presence cursors ❌
- Comments system ❌
- Activity feed ❌
- Real-time collaboration ❌
- Backend integration ❌

---

## 🎉 Next Steps

**After completing this test:**

1. **Document bugs** - Create issues list
2. **Prioritize fixes** - Critical → Nice-to-have
3. **Complete Day 2** - Wire builder + publish
4. **Test again** - Verify fixes
5. **Jump to M5.5** - Network Graph MVP!

---

**Created:** 2025-10-31  
**Type:** Comprehensive testing guide  
**Coverage:** All implemented features  
**Use:** Before any release or demo
