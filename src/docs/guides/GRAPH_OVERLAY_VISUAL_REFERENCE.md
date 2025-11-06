# 🎨 Graph Overlay Modal - Visual Reference Guide

**What you should see at each step**

---

## 📍 Step 1: My Approvals Workbench

```
┌──────────────────────────────────────────────────────────────────┐
│ ╔═══════════════════════════════════════════════════════════════╗│
│ ║ WORKGRAPH DEV | approvals              [Navigate ▼]          ║│
│ ╚═══════════════════════════════════════════════════════════════╝│
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  My Approvals                                        📊 18 items │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ 📊 Quick Stats                                             │ │
│  │ Hours: 702.0  Amount: $84,500  ⚠️ Breached: 3  🟡 Soon: 5 │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  🎯 Filters:                                                     │
│  [All Projects ▼] [All Parties ▼] [All Steps ▼] [All SLA ▼]   │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ ☐  Jane Doe [Senior Developer]                            │ │
│  │    Mobile App Redesign · Week of Oct 21                   │ │
│  │    40.0h · $6,000 · Step 2 of 3 · TechCorp · ✅ OK        │ │
│  │    [💡 Why?] [👁️ View path on graph]    ← CLICK THIS!    │ │
│  ├────────────────────────────────────────────────────────────┤ │
│  │ ☐  Mike Chen [Backend Developer]                          │ │
│  │    Backend API Rebuild · Week of Oct 21                   │ │
│  │    45.0h · ••• · Step 1 of 3 · DevShop · ✅ OK            │ │
│  │    [💡 Why?] [👁️ View path on graph]                      │ │
│  ├────────────────────────────────────────────────────────────┤ │
│  │ ☐  Sarah Kim [UI/UX Designer]                             │ │
│  │    E-commerce Platform · Week of Oct 21                   │ │
│  │    38.0h · $5,700 · Step 2 of 4 · Design Co · 🟡 <24h    │ │
│  │    [💡 Why?] [👁️ View path on graph]                      │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  [+ Select All]  [Approve Selected]  [Bulk Actions ▼]          │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 📍 Step 2: Graph Overlay Modal Opens

```
┌──────────────────────────────────────────────────────────────────┐
│                        [FULL SCREEN MODAL]                       │
│                                                                  │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  │
│  ┃ Approval Path on Graph                      ┌───────────┐ ┃  │
│  ┃                                              │  Step 2   │ ┃  │
│  ┃ Jane Doe [Senior Developer]                 └───────────┘ ┃  │
│  ┃ Mobile App Redesign · Week of Oct 21                     ┃  │
│  ┃                                                           ┃  │
│  ┃ You are at Step 2 of 3                                   ┃  │
│  ┃ TechCorp                                                  ┃  │
│  ┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫  │
│  ┃                                                           ┃  │
│  ┃         [APPROVAL FLOW DIAGRAM - See Step 4]             ┃  │
│  ┃                                                           ┃  │
│  ┃                                                           ┃  │
│  ┃                                                           ┃  │
│  ┃                                                           ┃  │
│  ┃                                                           ┃  │
│  ┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫  │
│  ┃ Hours: 40.0  Amount: $6,000  Next: Step 3 of 3 (Finance)┃  │
│  ┃                                                           ┃  │
│  ┃ [Close]              [Reject]  [Approve Now from Graph]  ┃  │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Key Elements:**
- ✅ Modal takes up ~95% of screen
- ✅ White background
- ✅ Header at top
- ✅ Content in middle
- ✅ Action bar at bottom

---

## 📍 Step 3: Modal Header Detail

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                               ┃
┃  Approval Path on Graph                    ┌────────────────┐┃
┃                                             │    Step 2      │┃
┃  Jane Doe [Senior Developer]               │   (Blue bg)    │┃
┃  Mobile App Redesign · Week of Oct 21      └────────────────┘┃
┃                                                               ┃
┃  You are at Step 2 of 3                                      ┃
┃  TechCorp                                                     ┃
┃                                                               ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**What to verify:**
- ✅ Title: "Approval Path on Graph"
- ✅ Person name: "Jane Doe"
- ✅ Role badge: "[Senior Developer]"
- ✅ Project: "Mobile App Redesign"
- ✅ Date: "Week of Oct 21"
- ✅ Step badge: Blue box with "Step 2"
- ✅ Current position: "You are at Step 2 of 3"
- ✅ Party: "TechCorp"

---

## 📍 Step 4: Approval Flow Diagram (CENTER)

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│           Approval Flow for Jane Doe                           │
│           Mobile App Redesign · 3-step approval                │
│                                                                │
│    ┌────┐         ┌────┐         ┌────┐         ┌────┐       │
│    │ 1  │    →    │ 2  │    →    │ 3  │    →    │ 4  │       │
│    └────┘         └────┘         └────┘         └────┘       │
│   Gray circle   Blue + Ring    Gray circle   Gray circle     │
│                                                                │
│  Contractor      Manager        Finance        Client         │
│  Submitted     ← YOU HERE        Next          Final          │
│                                                                │
│  ─────────────────────────────────────────────────────────── │
│                                                                │
│  Legend:                                                       │
│  🔵 Current step (you)    ⚪ Completed/Pending                │
│                                                                │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ 💡 Full Graph Overlay Coming Soon                             │
│                                                                │
│ Once projects are configured, you'll see the complete         │
│ WorkGraph Builder here with interactive nodes, zoom/pan       │
│ capabilities, and live approval path highlighting.            │
└────────────────────────────────────────────────────────────────┘
```

**Visual Details:**

```
Step 1 (Completed):
    ┌──────┐
    │  1   │  ← Gray circle (opacity 0.4)
    └──────┘
   Contractor
   Submitted

Step 2 (Current - YOU):
    ┌──────┐
    │  2   │  ← Blue circle with RING
    └──────┘     (bg-blue-600 + ring-4 ring-blue-200)
    Manager
 ← YOU ARE HERE  ← Arrow pointing to this step

Step 3 (Next):
    ┌──────┐
    │  3   │  ← Gray circle (opacity 0.4)
    └──────┘
    Finance
     Next

Step 4 (Final):
    ┌──────┐
    │  4   │  ← Gray circle (opacity 0.4)
    └──────┘
    Client
    Final
```

**What to verify:**
- ✅ See 3-4 numbered circles
- ✅ Current step (2) is bright blue with ring
- ✅ Other steps are gray/faded
- ✅ "YOU ARE HERE" label on step 2
- ✅ Labels: Contractor, Manager, Finance, Client
- ✅ Status text: Submitted, Pending, Next, Final
- ✅ Legend at bottom
- ✅ Info box about full graph coming soon

---

## 📍 Step 5: Action Bar (BOTTOM)

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                               ┃
┃  Hours: 40.0  │  Amount: $6,000  │  Next: Step 3 of 3       ┃
┃                                                               ┃
┃  ┌───────┐              ┌────────┐    ┌────────────────────┐┃
┃  │ Close │              │ Reject │    │ Approve from Graph │┃
┃  └───────┘              └────────┘    └────────────────────┘┃
┃   Gray                   Red text         Green background  ┃
┃                                                               ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**Button Styles:**

```
[Close]
- Variant: outline
- Color: Gray
- Icon: X

[Reject]
- Variant: outline
- Color: Red text (text-red-600)
- Hover: Red background (hover:bg-red-50)
- Icon: XCircle

[Approve Now from Graph]
- Variant: solid
- Color: Green background (bg-green-600)
- Hover: Darker green (hover:bg-green-700)
- Icon: CheckCircle
```

**What to verify:**
- ✅ Shows "Hours: 40.0"
- ✅ Shows "Amount: $6,000" (or "•••" if masked)
- ✅ Shows "Next: Step 3 of 3 (Finance)"
- ✅ Three buttons visible
- ✅ Approve button is green
- ✅ Reject button has red text
- ✅ Close button is gray

---

## 📍 Step 6: Approve Button States

### **Initial State:**
```
┌────────────────────────────────┐
│ ✓ Approve Now from Graph       │  ← Green bg
└────────────────────────────────┘
```

### **Loading State (after click):**
```
┌────────────────────────────────┐
│ ⟳ Approving...                 │  ← Spinner + disabled
└────────────────────────────────┘
```

### **Success (toast notification):**
```
┌─────────────────────────────┐
│ ✓ Approved from graph!      │
│ Moving to step 3            │
└─────────────────────────────┘
```

### **Result:**
```
Modal closes → Back at queue → Item gone
```

**What to verify:**
- ✅ Button shows "Approving..." with spinner
- ✅ Other buttons disabled during approval
- ✅ Toast appears after ~300ms
- ✅ Toast says "Approved from graph!"
- ✅ Modal closes automatically
- ✅ Back at approvals queue
- ✅ Jane Doe's item is gone
- ✅ Count changed from 18 to 17

---

## 📍 Step 7: Different Item Data

**Open modal for Mike Chen (second item):**

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Approval Path on Graph                      ┌───────────┐   ┃
┃                                              │  Step 1   │ ← Different!
┃ Mike Chen [Backend Developer]               └───────────┘   ┃
┃ Backend API Rebuild · Week of Oct 21        ← Different!    ┃
┃                                                             ┃
┃ You are at Step 1 of 3                      ← Different!    ┃
┃ DevShop                                     ← Different!    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**Approval Flow:**
```
    ┌────┐         ┌────┐         ┌────┐
    │ 1  │    →    │ 2  │    →    │ 3  │
    └────┘         └────┘         └────┘
   Blue+Ring       Gray          Gray
   
  Contractor      Manager       Finance
 ← YOU HERE        Next          Final
```

**What to verify:**
- ✅ Shows "Mike Chen" (not Jane Doe)
- ✅ Shows "Backend API Rebuild" (not Mobile App)
- ✅ Shows "Step 1" (not Step 2)
- ✅ Shows "DevShop" (not TechCorp)
- ✅ Step 1 is highlighted (not Step 2)
- ✅ No data from previous item

---

## 📍 Step 8: Reject Flow

### **1. Click Reject:**
```
┌────────────────────────────────┐
│ ✕ Reject                       │  ← Red text
└────────────────────────────────┘
```

### **2. Prompt Appears:**
```
┌─────────────────────────────────────┐
│ Rejection reason:                   │
│ ┌─────────────────────────────────┐ │
│ │ Test rejection                  │ │ ← Type here
│ └─────────────────────────────────┘ │
│                                     │
│         [Cancel]  [OK]              │
└─────────────────────────────────────┘
```

### **3. Loading State:**
```
┌────────────────────────────────┐
│ ⟳ Rejecting...                 │
└────────────────────────────────┘
```

### **4. Toast:**
```
┌─────────────────────────────┐
│ ✓ Rejected                  │
│ Contractor will be notified │
└─────────────────────────────┘
```

### **5. Result:**
```
Modal closes → Item removed from queue
```

**What to verify:**
- ✅ Prompt appears asking for reason
- ✅ Can type rejection reason
- ✅ Button shows "Rejecting..." loading
- ✅ Toast says "Rejected"
- ✅ Modal closes
- ✅ Item disappears from queue

---

## 🎨 Color Reference

### **Header:**
- Background: White
- Title: Gray-900 (black)
- Person name: Gray-900 (bold)
- Badges: Gray outline
- Step badge: Blue-600 background

### **Diagram:**
- Current step circle: Blue-600 background
- Current step ring: Blue-200 (ring-4)
- Other steps: Gray-300
- Text labels: Gray-900
- Legend: Blue-600 for current, Gray-500 for others

### **Action Bar:**
- Background: Gray-50 (light)
- Text: Gray-600
- Separator: Gray-300

### **Buttons:**
- Close: Gray outline
- Reject: Red-600 text, Red-50 hover background
- Approve: Green-600 background, Green-700 hover

### **Info Note:**
- Background: Blue-50
- Border: Blue-200
- Text: Blue-900
- Icon: Blue-600

---

## ✅ Final Checklist

Use this to verify everything is working:

```
Visual Elements:
□ Modal opens full screen
□ Header shows person + project
□ Step badge is visible
□ Approval flow diagram renders
□ Current step has blue ring
□ Other steps are gray
□ "YOU ARE HERE" label
□ Action bar at bottom
□ Three buttons present
□ Info note about full graph

Interactions:
□ Can click Approve
□ Button shows loading state
□ Toast notification appears
□ Modal closes automatically
□ Item disappears from queue
□ Can click Reject
□ Prompt appears
□ Rejection works
□ Escape key closes modal
□ Multiple items work

No Errors:
□ No red console errors
□ No yellow warnings
□ No missing images
□ No broken layouts
```

---

**If all items are checked, Day 4 is 100% complete!** 🎉
