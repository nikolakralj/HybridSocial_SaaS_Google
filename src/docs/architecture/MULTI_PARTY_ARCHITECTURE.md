# 🏗️ Multi-Party Project Approval Architecture

**Source:** Consolidated from `/docs/MULTI_PARTY_APPROVAL_ARCHITECTURE.md`  
**Last Updated:** 2025-10-31

---

## 🎯 Overview

WorkGraph supports complex real-world contractor scenarios with:
- Multiple companies/agencies per project
- Each with different contracts and rates
- Hierarchical approval flows
- Rate privacy between parties

---

## 📐 The Problem We Solve

### **Real-World Scenario:**

```
Project: AI Dashboard Development

Global Corp (End Client)
  ↓ contracts with
TechStaff Agency (Staffing Partner)
  ↓ subcontracts to
DevShop Inc (Vendor Company)
  ↓ contracts with
John Smith (Individual Contractor)
```

Each relationship is a separate contract:
- **Contract C:** Global ↔ TechStaff ($175/hr)
- **Contract B:** TechStaff ↔ DevShop ($150/hr)
- **Contract A:** DevShop ↔ John ($50/hr)

### **The Challenges:**

1. **Rate Privacy**
   - John shouldn't see what Global pays TechStaff
   - Global shouldn't see what DevShop pays John
   - Each party only sees their own contract rate

2. **Approval Hierarchy**
   - John submits → DevShop approves
   - DevShop bundles → TechStaff approves
   - TechStaff bundles → Global approves (final)

3. **Different Rates at Each Level**
   - John sees $50/hr (his rate)
   - DevShop sees $50/hr (what they pay) + $150/hr (what they charge)
   - TechStaff sees $150/hr (what they pay) + $175/hr (what they charge)
   - Global sees $175/hr (what they pay)

---

## 🏗️ Architecture Solution

### **1. Multi-Party Project Model**

```typescript
interface Project {
  id: string;
  name: string;
  parties: Party[];      // All companies/agencies/freelancers
  contracts: Contract[]; // All agreements
  approvalPolicy: ApprovalPolicy; // Workflow
}

interface Party {
  id: string;
  name: string;
  type: 'company' | 'agency' | 'contractor';
  role: 'client' | 'vendor' | 'staffing-partner';
}

interface Contract {
  id: string;
  projectId: string;
  partyA: string;  // One party
  partyB: string;  // Other party
  type: 'hourly' | 'daily' | 'fixed';
  hourlyRate?: number;
  dailyRate?: number;
  fixedAmount?: number;
  visibility: {
    hideRateFrom: string[]; // Party IDs who can't see rate
  };
}
```

### **2. Approval Chain**

Each timesheet entry flows through a chain:

```
John submits 40 hrs
  ↓
Step 1: DevShop Inc
  - Sees: hours, week, contractor, rate ($50/hr)
  - Action: Auto-approve (standard hours)
  ↓
Step 2: TechStaff Agency  
  - Sees: hours, week, contractor
  - Hidden: rate (not in Contract A)
  - Action: Manual review
  ↓
Step 3: Global Corp
  - Sees: hours, week, contractor
  - Hidden: rate (not in Contract A)
  - Action: Auto-approve (budget available)
```

### **3. Rate Visibility Rules**

```typescript
function canSeeRate(
  viewer: string,
  contract: Contract
): boolean {
  // Contract parties can always see their rate
  const isContractParty = 
    contract.partyA === viewer || 
    contract.partyB === viewer;
  
  // Unless explicitly hidden
  const isHiddenFrom = 
    contract.visibility.hideRateFrom.includes(viewer);
  
  // Show ONLY if contract party AND not hidden
  return isContractParty && !isHiddenFrom;
}
```

**Key Rule:** Non-contract parties NEVER see the rate, even if not in hideRateFrom!

---

## 💡 Example: Three-Party Chain

### **Setup:**

```
Parties:
  - John Smith (Contractor)
  - DevShop Inc (Vendor Company)
  - TechStaff Agency (Staffing Partner)
  - Global Corp (End Client)

Contracts:
  - Contract A: John ↔ DevShop ($50/hr)
  - Contract B: DevShop ↔ TechStaff ($150/hr)
  - Contract C: TechStaff ↔ Global ($175/hr)

Approval Flow:
  John's timesheet → DevShop → TechStaff → Global
```

### **Timesheet: John works 40 hours**

**Step 1: DevShop Reviews**
```
Visible:
  - hours: 40
  - week: 2025-10-26
  - contractor: John Smith
  - rate: $50/hr ✅ (Contract A party)

Decision: Auto-approve
Amount to pay John: $2,000
```

**Step 2: TechStaff Reviews**
```
Visible:
  - hours: 40
  - week: 2025-10-26
  - contractor: John Smith

Masked:
  - rate: ••• ❌ (NOT in Contract A)

Decision: Manual review
Amount to invoice Global: $7,000 (40 × $175)
Amount to pay DevShop: $6,000 (40 × $150)
Margin: $1,000
```

**Step 3: Global Reviews**
```
Visible:
  - hours: 40
  - week: 2025-10-26
  - contractor: John Smith

Masked:
  - rate: ••• ❌ (NOT in Contract A)

Decision: Auto-approve (budget available)
Amount to pay TechStaff: $7,000 (40 × $175)
```

### **Money Flow:**

```
Global pays TechStaff:  $7,000 (40 × $175)
TechStaff pays DevShop: $6,000 (40 × $150)
DevShop pays John:      $2,000 (40 × $50)

Margins:
  TechStaff: $1,000 profit
  DevShop: $4,000 profit
```

---

## 🎨 UI Organization

### **Approvals Tab: Organization Grouped Table**

```
┌──────────────────────────────────────────────────────┐
│ 📋 Pending Approvals          October 2025          │
├──────────────────────────────────────────────────────┤
│                                                      │
│ ▼ DevShop Inc (2 people, 80 hours)                  │
│   ├─ John Smith    40 hrs  Contract A  $2,000  📄  │
│   └─ Jane Doe      40 hrs  Contract D  $3,200  📄  │
│                                                      │
│ ▼ TechStaff Agency (1 person, 40 hours)             │
│   └─ Mike Johnson  40 hrs  Contract E  •••     📄  │
│                                                      │
│ ▼ Freelancers (2 people, 50 hours)                  │
│   ├─ Sarah Lee     30 hrs  Contract F  •••     📄  │
│   └─ Tom Brown     20 hrs  Contract G  •••     📄  │
└──────────────────────────────────────────────────────┘
```

**Click a row → Monthly Drawer opens:**

```
┌──────────────────────────────────────────────────────┐
│ ← October 2025: John Smith @ DevShop Inc            │
├──────────────────────────────────────────────────────┤
│                                                      │
│ Contract: Contract A ($50/hr)                        │
│ Total Hours: 160 | Total Amount: $8,000              │
│                                                      │
│ 📄 October-Timesheet.pdf  [View] [Download]         │
│                                                      │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Week Starting │ Mon │ Tue │ Wed │ Thu │ Fri │ Σ │ │
│ ├─────────────────────────────────────────────────┤ │
│ │ Sep 30        │  8  │  8  │  8  │  8  │  8  │40│ │
│ │ Oct 7         │  8  │  8  │  8  │  8  │  8  │40│ │
│ │ Oct 14        │  8  │  8  │  8  │  8  │  8  │40│ │
│ │ Oct 21        │  8  │  8  │  8  │  8  │  8  │40│ │
│ └─────────────────────────────────────────────────┘ │
│                                                      │
│ [Approve All] [Reject] [Request Changes]             │
└──────────────────────────────────────────────────────┘
```

---

## 🔄 Approval State Machine

```
DRAFT
  ↓ submit()
SUBMITTED
  ↓ approve() at Step 1
IN_REVIEW (Step 2)
  ↓ approve() at Step 2
IN_REVIEW (Step 3)
  ↓ approve() at Step 3 (final)
APPROVED
  ↓ generateInvoice()
PAID
```

**Rejection at any step:**
```
IN_REVIEW (Step N)
  ↓ reject()
REJECTED
  ↓ resubmit()
SUBMITTED (restarts flow)
```

---

## 🎯 Key Benefits

### **1. Rate Privacy**
✅ Each party only sees rates they're entitled to  
✅ Business margins protected  
✅ Prevents negotiation conflicts

### **2. Hierarchical Approvals**
✅ Multi-level approval chains  
✅ Batch approvals by organization  
✅ Flexible approval policies

### **3. Real-World Support**
✅ Models actual contractor relationships  
✅ Supports complex staffing scenarios  
✅ Handles multiple contract types (hourly, daily, fixed)

### **4. Transparency Without Over-Sharing**
✅ Everyone sees what they need  
✅ Nobody sees what they shouldn't  
✅ Audit trail for compliance

---

## 📚 Implementation

**Types:** `/types/contracts.ts`, `/types/approvals.ts`  
**Components:** `/components/timesheets/approval-v2/`  
**Visual Builder:** `/components/workgraph/`  
**Documentation:** This file

---

## 🔗 Related Docs

- `/docs/architecture/CONTRACT_SCOPED_RATE_VISIBILITY.md` - Rate privacy details
- `/docs/architecture/SYSTEM_ARCHITECTURE.md` - Overall system
- `/docs/COMPREHENSIVE_APPROVAL_SYSTEM.md` - Approval system implementation

---

**Last Updated:** 2025-10-31  
**Status:** ✅ Complete and tested  
**Next:** Integration with real data and policy execution
