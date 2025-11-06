# ⚡ Approval Buttons Quick Reference

**Created:** 2025-10-31  
**Purpose:** Quick lookup for approval button behavior  
**Status:** Current vs Future implementation

---

## 🔍 What You Asked About

> "Buttons for approval depend on who is using it - we should have 'Send Approval Request' or 'Approve' based on user"

**YES!** Here's the quick breakdown:

---

## 📊 Current Implementation (NOW)

### **Status-Based Buttons Only**

```
✅ Shows buttons based on TIMESHEET STATUS
❌ Does NOT check WHO is viewing
❌ Does NOT check WHERE in approval flow
❌ Does NOT check USER PERMISSIONS
```

**Example:**
```tsx
// Current code (simplified)
if (status === 'submitted') {
  show: [Approve] [Reject]  // EVERYONE sees these
}
```

**Result:** Same buttons for everyone viewing a submitted timesheet

---

## 🎯 Future Implementation (Days 2-5)

### **Role + Policy Aware Buttons**

```
✅ Checks TIMESHEET STATUS
✅ Checks WHO is viewing
✅ Checks WHERE in approval flow
✅ Checks USER PERMISSIONS from WorkGraph
✅ Shows DIFFERENT buttons per role
```

**Example:**
```tsx
// Future code (simplified)
if (status === 'submitted' && isCurrentApprover && isMyTurnToApprove) {
  show: [Approve] [Reject]  // Only current approver sees these
} else if (status === 'submitted' && alreadyApproved) {
  show: "✅ You approved on Oct 28"  // Past approvers see status
} else if (status === 'submitted' && futureApprover) {
  show: "⏳ Awaiting Manager Approval"  // Future approvers see queue
}
```

---

## 🎭 Button Variations by Role

### **1. CONTRACTOR (viewing own timesheet)**

| Status | Buttons Shown |
|--------|---------------|
| Draft | `[Submit for Approval]` |
| Submitted | `"⏳ Awaiting Manager" + [Withdraw]` |
| Rejected | `[Amend & Resubmit]` |
| Approved | `"✅ Approved" (view only)` |

---

### **2. MANAGER (viewing contractor's timesheet)**

| Approval Step | Manager's View |
|---------------|----------------|
| Step 1 (Manager pending) | `[Approve] [Reject] [Send Back]` |
| Step 1 (Manager approved) | `"✅ I approved on Oct 28" + "⏳ Awaiting Finance"` |
| Step 2 (Finance pending) | `"⏳ Awaiting Finance" (view only)` |
| Fully approved | `"✅ Fully Approved" (view only)` |

---

### **3. FINANCE (viewing contractor's timesheet)**

| Approval Step | Finance's View |
|---------------|----------------|
| Step 1 (Manager pending) | `"⏳ Awaiting Manager" (not your turn)` |
| Step 1 (Manager approved) | `[Approve] [Reject] [Send Back]` |
| Step 2 (Finance approved) | `"✅ I approved on Oct 29"` |
| Fully approved | `"✅ Fully Approved" (view only)` |

---

### **4. CLIENT (viewing contractor's timesheet)**

| Approval Step | Client's View |
|---------------|----------------|
| Steps 1-2 pending | `"⏳ Awaiting internal approvals" (view only)` |
| Step 3 (Client pending) | `[Final Approval] [Reject]` |
| Fully approved | `"✅ Approved" + [View Invoice]` |

---

### **5. RANDOM OBSERVER (not in approval chain)**

| Any Status | Observer's View |
|------------|-----------------|
| All | `"👁️ View Only" (no action buttons)` |

---

## 🔧 What Determines Button Behavior?

### **3 Key Factors:**

1. **Timesheet Status** (draft/submitted/approved/rejected)
2. **Current Approval Step** (1/2/3/complete)
3. **User's Role in Flow** (submitter/current approver/future approver/observer)

### **The Logic:**

```typescript
function getApprovalButtons(
  timesheet,
  currentUser,
  approvalPolicy
) {
  // 1. Get current approval step
  const currentStep = getCurrentApprovalStep(timesheet, approvalPolicy);
  
  // 2. Check if user is current approver
  const isMyTurn = isCurrentApprover(currentUser.id, currentStep, approvalPolicy);
  
  // 3. Check if user is submitter
  const isMyTimesheet = timesheet.userId === currentUser.id;
  
  // 4. Return appropriate buttons
  if (isMyTimesheet && timesheet.status === 'draft') {
    return ['Submit'];
  } else if (isMyTurn && timesheet.status === 'submitted') {
    return ['Approve', 'Reject', 'Send Back'];
  } else if (timesheet.status === 'submitted') {
    return ['View Only'];
  }
  // ... etc
}
```

---

## 🎯 Approval Flow Example

**Scenario:** Jane (contractor) submits timesheet

```
APPROVAL CHAIN: Contractor → Manager → Finance → Client

┌─────────────────────────────────────────────────────────────┐
│ STEP 1: Manager Approval                                    │
├─────────────────────────────────────────────────────────────┤
│ Jane (Contractor)    → "⏳ Awaiting Manager" + [Withdraw]   │
│ Bob (Manager)        → [Approve] [Reject] [Send Back]       │
│ Alice (Finance)      → "⏳ Awaiting Manager" (not your turn) │
│ Dave (Client)        → "⏳ Awaiting internal approvals"      │
└─────────────────────────────────────────────────────────────┘

[Manager Bob clicks "Approve"]

┌─────────────────────────────────────────────────────────────┐
│ STEP 2: Finance Approval                                    │
├─────────────────────────────────────────────────────────────┤
│ Jane (Contractor)    → "⏳ Awaiting Finance"                 │
│ Bob (Manager)        → "✅ I approved Oct 28" + "⏳ Finance"  │
│ Alice (Finance)      → [Approve] [Reject] [Send Back]       │
│ Dave (Client)        → "⏳ Awaiting internal approvals"      │
└─────────────────────────────────────────────────────────────┘

[Finance Alice clicks "Approve"]

┌─────────────────────────────────────────────────────────────┐
│ STEP 3: Client Final Approval                               │
├─────────────────────────────────────────────────────────────┤
│ Jane (Contractor)    → "⏳ Awaiting Client"                  │
│ Bob (Manager)        → "✅ I approved Oct 28"                │
│ Alice (Finance)      → "✅ I approved Oct 29"                │
│ Dave (Client)        → [Final Approval] [Reject]            │
└─────────────────────────────────────────────────────────────┘

[Client Dave clicks "Final Approval"]

┌─────────────────────────────────────────────────────────────┐
│ COMPLETE: Fully Approved                                    │
├─────────────────────────────────────────────────────────────┤
│ Jane (Contractor)    → "✅ Approved" + [View Invoice]        │
│ Bob (Manager)        → "✅ Approved Oct 28"                  │
│ Alice (Finance)      → "✅ Approved Oct 29" + [Gen Invoice]  │
│ Dave (Client)        → "✅ Approved Oct 30" + [View Invoice] │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚙️ Implementation Status

### **✅ BUILT (Exists Now):**
- Approval UI components
- Status-based button display
- Permission system
- WorkGraph policy compiler
- Approval flow definition

### **⏳ PENDING (Days 2-5):**
- Load approval policy from WorkGraph
- Check current user's role in flow
- Determine current approval step
- Conditionally render buttons based on role
- Show different buttons for each user

### **🎯 TESTING (Days 6-7):**
- Test each role sees correct buttons
- Verify step-by-step progression
- Ensure proper permission enforcement
- Test edge cases (withdrawn, amended)

---

## 🚀 When Will This Work?

**Timeline:**
```
Day 2 (Tomorrow):
  ✅ M5.1 complete (basic wiring)
  
Days 3-4:
  🎯 Load approval policy from WorkGraph
  🎯 Check user role in approval chain
  🎯 Determine current step
  🎯 Conditional button rendering

Day 5:
  🎯 Polish & edge cases
  🎯 Approval history display
  🎯 "Next approver" indicators

Days 6-7:
  🧪 Multi-party testing
  🧪 Verify all role combinations
  🧪 Ensure proper behavior

Week 2:
  🎉 FULLY WORKING!
  ✅ Different buttons for each role
  ✅ Step-by-step approval flow
  ✅ Permission enforcement
```

---

## 📖 Related Documentation

**Full Guide:** `/docs/guides/APPROVAL_BUTTON_BEHAVIOR_GUIDE.md`
- Detailed implementation plan
- Code examples
- Testing scenarios
- Complete role matrix

**Test Dashboard:** Menu → "🧪 TEST DASHBOARD"
- Interactive testing interface
- Progress tracking
- Quick navigation

**Master Roadmap:** `/docs/WORKGRAPH_MASTER_ROADMAP.md`
- Full project timeline
- All phases & milestones
- Enterprise requirements

---

## 🎯 Key Takeaway

**You're absolutely right!**

> "This will be fully implemented once WorkGraphs are fully implemented"

**Current State:**
- Shows same buttons to everyone (status-based)
- Doesn't check who is viewing
- Doesn't check approval flow position

**After WorkGraph Integration:**
- Different buttons for each role
- Checks your position in approval chain
- Shows appropriate actions based on:
  - Who you are (submitter/approver/observer)
  - Where in flow (step 1/2/3/complete)
  - What you can do (approve/reject/submit)

**Expected:** 1-2 weeks to full implementation 🚀

---

**Created:** 2025-10-31  
**Type:** Quick reference  
**Status:** Pending Days 2-7  
**Related:** Approval System, WorkGraph, Permissions
