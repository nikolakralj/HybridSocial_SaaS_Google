# 💰 Role-Based Rate Visibility

## The Fundamental Principle

**Everyone logs time → But not everyone sees money.**

In WorkGraph, the same timesheet data flows through multiple financial layers, each with its own rate. The system enforces **strict role-based visibility** to protect business relationships and profit margins.

---

## 🎯 Core Concept: One Timesheet, Multiple Financial Lenses

```
The Data (shared by all):
├── Hours worked: 8h
├── Date: Oct 15, 2025
├── Task: Development
├── Work type: Regular
└── Notes: "Built authentication"

The Money (filtered by role):
├── Employee sees: ❌ No rate
├── Company sees: $30/hr (cost) → $60/hr (billable to agency)
├── Agency sees: $60/hr (cost) → $90/hr (billable to client)
└── Client sees: $90/hr (invoice)
```

**Key insight:** The hours flow through the chain, but each party only sees rates relevant to their contracts.

---

## 👥 Roles & Rate Visibility

### **1. Individual Contributor (Employee/Freelancer)**

**Who they are:**
- Employees working for a company
- Freelancers contracted by an agency
- Individual contractors

**What they CAN see:**
- ✅ Hours worked
- ✅ Tasks completed
- ✅ Work types (Regular, Travel, Overtime, On-call)
- ✅ Approval status (Draft, Submitted, Approved, Rejected)

**What they CANNOT see:**
- ❌ Hourly rates
- ❌ Billable amounts
- ❌ Contract values
- ❌ Profit margins

**Why:**
```
Sarah is a developer employed by Acme Corp.
She doesn't need to know:
├── What Acme pays her ($30/hr)
├── What Acme bills the agency ($60/hr)
└── What the agency bills the client ($90/hr)

She only needs to:
├── Log her 8 hours
├── Categorize as "Development"
└── Submit for approval
```

**UI Example:**
```
┌───────────────────────────────┐
│ October 15, 2025              │
├───────────────────────────────┤
│ Hours: 8h                     │
│ Work Type: Regular Work       │
│ Task: Development             │
│ Notes: Built authentication   │
├───────────────────────────────┤
│ Total: 8h                     │
│ ✓ Ready for manager approval  │
└───────────────────────────────┘

No rates shown ✓
No money displayed ✓
```

---

### **2. Team Lead / Manager**

**Who they are:**
- Managers inside a company
- Team leads at an agency
- Middle management

**What they CAN see:**
- ✅ Team member hours
- ✅ Tasks and work types
- ✅ Approval workflow
- ✅ Submission status

**What they CANNOT see:**
- ❌ Rates (unless they're also an owner)
- ❌ Contract values
- ❌ Billing amounts

**Why:**
```
Mike is a team lead at Acme Corp.
He reviews Sarah's timesheet for accuracy.
He doesn't handle billing, so no rates.

Only when timesheets reach the owner level
do rates become relevant for invoicing.
```

---

### **3. Company Owner (Vendor)**

**Who they are:**
- Owner of a company providing contractors
- Vendor to an agency
- Small business owner

**What they CAN see:**
- ✅ Internal cost rates (what they pay employees)
- ✅ Billable rates to agency (their markup)
- ✅ Employee hours & tasks
- ✅ Approval status

**What they CANNOT see:**
- ❌ What agency bills the final client
- ❌ Agency's profit margin
- ❌ Client contract details

**Why:**
```
Acme Corp Owner sees:
├── Employee: Sarah worked 8h
├── Internal cost: $30/hr × 8h = $240
├── Billable to agency: $60/hr × 8h = $480
└── Acme's margin: $240 profit

Acme CANNOT see:
├── What agency bills client ($90/hr)
└── Agency's $240 profit margin

This protects agency's business model.
```

**UI Example:**
```
┌─────────────────────────────────┐
│ Sarah Chen - Oct 15, 2025       │
├─────────────────────────────────┤
│ Regular Work: 8h                │
│ Task: Development               │
├─────────────────────────────────┤
│ Internal Cost:  $30/hr × 8h     │
│                = $240            │
│                                 │
│ Billable to Agency: $60/hr × 8h │
│                    = $480        │
├─────────────────────────────────┤
│ Your Revenue: $480               │
│ Your Cost: $240                 │
│ Your Margin: $240 (50%)         │
└─────────────────────────────────┘

✓ Can see both layers of rates
✗ Cannot see agency → client rate
```

---

### **4. Agency Owner / Project Manager**

**Who they are:**
- Agency owner managing multiple vendors
- Agency PM overseeing a project
- Client-facing billing authority

**What they CAN see:**
- ✅ Vendor total hours
- ✅ Vendor billable amounts (what agency pays)
- ✅ Client billable rates (what agency charges)
- ✅ Cross-vendor aggregation

**What they CANNOT see:**
- ❌ Vendor's internal employee rates
- ❌ Vendor's internal costs
- ❌ Vendor's profit margins

**Why:**
```
Agency sees:
├── Acme Corp: 3 contractors, 120h total
├── Cost from Acme: $60/hr × 120h = $7,200
├── Bill to client: $90/hr × 120h = $10,800
└── Agency margin: $3,600 profit

Agency CANNOT see:
├── What Acme pays Sarah ($30/hr)
├── Acme's internal costs
└── Acme's $3,600 profit

This protects vendor's business model.
```

**UI Example:**
```
┌──────────────────────────────────┐
│ Acme Corp Team - October 2025    │
├──────────────────────────────────┤
│ Sarah Chen:     80h              │
│ Tom Martinez:   64h              │
│ Emma Davis:     56h              │
│                                  │
│ Total Hours:    200h             │
├──────────────────────────────────┤
│ Vendor Invoice:  $60/hr × 200h   │
│                 = $12,000         │
│                                  │
│ Client Invoice:  $90/hr × 200h   │
│                 = $18,000         │
├──────────────────────────────────┤
│ Your Revenue: $18,000             │
│ Your Cost: $12,000               │
│ Your Margin: $6,000 (33%)        │
└──────────────────────────────────┘

✓ Can see vendor totals ($60/hr)
✓ Can see client rate ($90/hr)
✗ Cannot see vendor's internal rates
```

---

### **5. Final Client**

**Who they are:**
- The company paying for the work
- End customer
- Budget holder

**What they CAN see:**
- ✅ Final invoice amount
- ✅ Total hours billed
- ✅ High-level breakdown (if contractually agreed)

**What they CANNOT see:**
- ❌ Agency's costs
- ❌ Vendor rates
- ❌ Individual contractor rates
- ❌ Profit margins at any level

**Why:**
```
Client sees:
├── Total hours: 200h
├── Rate: $90/hr
├── Invoice: $18,000
└── High-level tasks (Development, Design, QA)

Client CANNOT see:
├── What agency paid vendors
├── What vendors paid employees
├── Anyone's profit margins
└── Individual contractor details

Unless contractually specified for transparency.
```

**UI Example:**
```
┌─────────────────────────────────┐
│ Mobile App Redesign - Oct 2025  │
├─────────────────────────────────┤
│ Development:     120h            │
│ Design:          48h             │
│ QA:              32h             │
│                                  │
│ Total Hours:     200h            │
├─────────────────────────────────┤
│ Rate:            $90/hr          │
│ Total Amount:    $18,000         │
├─────────────────────────────────┤
│ Status: Pending Approval         │
└─────────────────────────────────┘

✓ Simple invoice view
✗ No vendor breakdown
✗ No profit margin visibility
```

---

## 📊 Example Scenario: Full Chain

### **Project: Mobile App Redesign**

**Actors:**
1. Sarah (Developer at Acme Corp)
2. Acme Corp Owner
3. Agency Owner
4. Client (TechCo Inc)

**Time Entry:**
```
Sarah logs: 8 hours on Oct 15, 2025
Task: Development
Notes: Built user authentication
```

---

### **What Each Role Sees:**

#### **1. Sarah (Individual Contributor)**

```
My Timesheet - Oct 15, 2025
─────────────────────────────
Hours:      8h
Task:       Development
Work Type:  Regular Work
Notes:      Built user authentication
Status:     Submitted ✓

No rates visible
Just logs time and waits for approval
```

---

#### **2. Acme Corp Owner**

```
Sarah Chen - Oct 15, 2025
─────────────────────────────
Hours:      8h
Task:       Development
Work Type:  Regular Work

Internal Cost:
$30/hr × 8h = $240

Billable to Agency:
$60/hr × 8h = $480

Margin: $240 (50%)
─────────────────────────────
Action: Approve & invoice agency
```

**What owner does:**
1. Review Sarah's hours for accuracy
2. Approve the timesheet
3. System calculates: $480 billable to agency
4. Generate invoice to agency at month-end

---

#### **3. Agency Owner**

```
Acme Corp - Oct 15, 2025
─────────────────────────────
Sarah Chen:  8h

Vendor Cost:
$60/hr × 8h = $480

Client Rate:
$90/hr × 8h = $720

Margin: $240 (33%)
─────────────────────────────
Action: Approve & invoice client
```

**What agency sees:**
- Acme Corp invoiced them $480
- They will invoice client $720
- Their margin is $240
- Cannot see Sarah's $30/hr internal rate

---

#### **4. Client (TechCo Inc)**

```
Agency Invoice - Oct 15, 2025
─────────────────────────────
Development:  8h @ $90/hr
Amount:       $720

Status: Pending Approval
─────────────────────────────
Action: Approve payment
```

**What client sees:**
- Clean, simple invoice
- 8 hours @ $90/hr = $720
- No breakdown of vendors or margins

---

## 🔐 Technical Implementation

### **Rate Scoping in Database**

```typescript
// Contract defines rate relationships
interface Contract {
  id: string;
  fromParty: "employee" | "company" | "agency";
  toParty: "company" | "agency" | "client";
  hourlyRate: number;
  workTypeMultipliers: {
    regular: 1.0;
    travel: 0.5;
    overtime: 1.5;
    oncall: 0.75;
  };
}

// Multiple contracts for same work
const contracts = [
  {
    // Sarah ↔ Acme Corp (internal)
    fromParty: "employee",
    toParty: "company",
    hourlyRate: 30,  // What Acme pays Sarah
  },
  {
    // Acme Corp ↔ Agency
    fromParty: "company",
    toParty: "agency",
    hourlyRate: 60,  // What Agency pays Acme
  },
  {
    // Agency ↔ Client
    fromParty: "agency",
    toParty: "client",
    hourlyRate: 90,  // What Client pays Agency
  },
];
```

### **Permission-Based Rate Filtering**

```typescript
function getVisibleRate(
  timeEntry: TimeEntry,
  userRole: UserRole,
  contracts: Contract[]
): number | null {
  switch (userRole) {
    case "individual-contributor":
      return null;  // No rate visibility
    
    case "team-lead":
      return null;  // No rate visibility
    
    case "company-owner":
      // Can see internal cost + billable to agency
      const internalRate = contracts.find(
        c => c.fromParty === "employee" && c.toParty === "company"
      )?.hourlyRate;
      const agencyRate = contracts.find(
        c => c.fromParty === "company" && c.toParty === "agency"
      )?.hourlyRate;
      return { internal: internalRate, billable: agencyRate };
    
    case "agency-owner":
      // Can see vendor cost + client rate
      const vendorRate = contracts.find(
        c => c.fromParty === "company" && c.toParty === "agency"
      )?.hourlyRate;
      const clientRate = contracts.find(
        c => c.fromParty === "agency" && c.toParty === "client"
      )?.hourlyRate;
      return { cost: vendorRate, billable: clientRate };
    
    case "client":
      // Only sees final rate
      const finalRate = contracts.find(
        c => c.toParty === "client"
      )?.hourlyRate;
      return { final: finalRate };
  }
}
```

---

## 🔄 Approval & Invoice Flow

### **Step-by-Step Process:**

```
1. Sarah submits timesheet
   └→ Status: Submitted
   └→ Visible to: Acme Corp owner

2. Acme Corp owner approves
   └→ System calculates: $480 billable to agency
   └→ Status: Approved by vendor
   └→ Visible to: Agency owner

3. Agency owner approves
   └→ System calculates: $720 billable to client
   └→ Status: Approved by agency
   └→ Visible to: Client

4. Client approves invoice
   └→ Status: Approved for payment
   └→ Payment flows: Client → Agency → Acme → Sarah

Each approval locks the rate at that level.
```

---

## 💡 Key Benefits

### **For Employees:**
✅ Simple time tracking without financial complexity  
✅ Focus on work, not billing  
✅ Professional approval workflow  

### **For Companies (Vendors):**
✅ Protect internal cost structure  
✅ Maintain competitive advantage  
✅ Control profit margins  

### **For Agencies:**
✅ Aggregate multiple vendors cleanly  
✅ Protect vendor relationships  
✅ Maintain client pricing strategy  

### **For Clients:**
✅ Clean, simple invoices  
✅ Transparent hours tracking  
✅ No overwhelming detail  

---

## 🚨 What NOT to Do

### **❌ Don't Show Everyone Everything**

```
BAD: Showing all rates to everyone

Sarah sees:
├── Her rate: $30/hr
├── Acme bills: $60/hr  ← She calculates: "They make 2x off me?!"
└── Agency bills: $90/hr ← "And agency makes 1.5x more?!"

Result: Resentment, renegotiation demands, team friction
```

### **❌ Don't Expose Margins Across Layers**

```
BAD: Agency sees vendor's internal costs

Agency sees:
├── Acme pays Sarah $30/hr
├── Acme bills us $60/hr
└── "Wow, 50% margin! We can negotiate lower."

Result: Pricing pressure, vendor relationships damaged
```

### **❌ Don't Let Clients See Vendor Structure**

```
BAD: Client sees full breakdown

Client sees:
├── Acme pays employees $30/hr
├── Agency pays Acme $60/hr
├── Agency charges us $90/hr
└── "We're paying 3x employee cost! Cut agency."

Result: Disintermediation, lost business relationships
```

---

## ✅ Best Practices

### **1. Role-Based UI Components**

```typescript
// Show/hide based on role
{rateVisibility.showRates && (
  <div>Rate: ${rate}/hr</div>
)}

{rateVisibility.showBreakdown && (
  <div>Internal: ${internal}, Billable: ${billable}</div>
)}
```

### **2. Audit Trail**

```
Every rate change is logged:
├── Who changed it
├── When it changed
├── Old value → New value
└── Reason for change

Locked after approval at each level.
```

### **3. Contract-Level Permissions**

```
Rates are tied to contracts, not users.
└→ User can have different rates for different clients
└→ Same timesheet, different financial views
└→ Consistent data, scoped visibility
```

### **4. Clear Communication**

```
When showing rates, make it clear WHICH rate:
├── "Your billable rate to agency"
├── "Agency's rate from vendor"
├── "Final client invoice rate"

Never just "$60/hr" without context.
```

---

## 📚 Summary

| Role | Sees Hours | Sees Rates | Sees Margins | Invoice Access |
|------|-----------|-----------|--------------|----------------|
| **Individual Contributor** | ✅ Own | ❌ None | ❌ None | ❌ None |
| **Team Lead** | ✅ Team | ❌ None | ❌ None | ❌ None |
| **Company Owner** | ✅ Company | ✅ Internal + Agency | ✅ Own | ✅ To agency |
| **Agency Owner** | ✅ All vendors | ✅ Vendor + Client | ✅ Own | ✅ To client |
| **Client** | ✅ Aggregate | ✅ Final only | ❌ None | ✅ Final invoice |

---

## 🎯 The Golden Rule

**"Everyone logs time. Only those with billing responsibility see rates."**

This protects:
- ✅ Business relationships
- ✅ Profit margins
- ✅ Competitive positioning
- ✅ Team morale
- ✅ Client trust

**One timesheet, multiple financial lenses.** 🎉
