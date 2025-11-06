# 🎯 Contractor Types & Permissions

## The Critical Question

**"Should contractors have access to browse contractors, aggregate calendar, and aggregate list views?"**

**Answer: It depends on the contractor's situation!**

---

## 🧑‍💻 Three Types of "Contractors"

### **1. Solo Freelancer**

**Example:** Sarah, a freelance developer

**Reality:**
- One person working alone
- No team to manage
- Just filling her own timesheet

**Permissions Needed:**
- ✅ **My Timesheet** - Fill her own hours
- ❌ **Browse Team** - Would only show herself (pointless!)
- ❌ **Team Calendar** - Aggregate of one person? Useless
- ❌ **Team List** - Same redundancy

**Why NOT give aggregate views?**
```
Browse Team for Sarah:
┌────────────────────────┐
│ Your Team (1)          │
├────────────────────────┤
│ Sarah Chen (You)       │
│ Status: Draft          │
│ Hours: 23.5h           │
└────────────────────────┘

This is the same as "My Timesheet"!
Why show it twice? ❌
```

**Verdict:** Solo freelancers do NOT need aggregate views.

---

### **2. Agency/Company Team Lead**

**Example:** Mike from Acme Corp, managing 3 developers placed at a client

**Reality:**
- Acme Corp sends 3 developers to client project
- Mike is the account manager
- He needs to track his team's hours
- But should NOT see other vendors' contractors

**Permissions Needed:**
- ✅ **My Timesheet** - His own billable hours
- ✅ **Browse Team** - See Acme's 3 developers
- ✅ **Team Calendar** - Aggregate of Acme's team
- ✅ **Team List** - Manage Acme's submissions
- ✅ **Bulk Entry** - Pre-fill common hours for his team

**With important filtering:**
```
Project: Mobile App Redesign

Mike (Acme Corp) can see:
├── Mike Wilson (himself)
├── Sarah Chen (Acme)
├── Tom Martinez (Acme)
└── Emma Davis (Acme)
    Total: 4 people ✓

Mike CANNOT see:
├── Alex Kim (TechStaff Inc) 🔒
└── Lisa Park (TechStaff Inc) 🔒
    Reason: Different vendor!

Client PM can see all 6 people ✓
```

**Why this matters:**

**Scenario:** Client hires two vendors
- **Acme Corp** - 3 developers @ $95/hr
- **TechStaff Inc** - 2 developers @ $70/hr

**Problem if Mike sees everyone:**
```
❌ Mike sees TechStaff's lower rates
❌ Competitive information leaks
❌ Potential conflicts
❌ Privacy violation
```

**Solution: Organizational scoping**
```
✓ Mike sees Acme Corp team only
✓ TechStaff team lead sees their team only
✓ Client PM sees everyone
✓ Each vendor's data stays private
```

**Verdict:** Team leads DO need aggregate views, but scoped to their organization.

---

### **3. Project Manager (Client-Side)**

**Example:** Lisa, the client PM managing the entire project

**Reality:**
- Manages all contractors from all vendors
- Needs full project oversight
- Responsible for budget and delivery

**Permissions Needed:**
- ✅ **My Timesheet** - Her own time (if she bills)
- ✅ **Browse Team** - ALL contractors from ALL vendors
- ✅ **Team Calendar** - Full project aggregate
- ✅ **Team List** - All submissions across vendors
- ✅ **Bulk Entry** - Create entries for entire team

**No filtering:**
```
Lisa (Client PM) can see:
├── Acme Corp
│   ├── Mike Wilson
│   ├── Sarah Chen
│   ├── Tom Martinez
│   └── Emma Davis
├── TechStaff Inc
│   ├── Alex Kim
│   └── Lisa Park
└── Freelancers
    └── (Any solo contractors)

Total: Everyone on the project ✓
```

**Why full access?**
- She's paying everyone
- Responsible for budget
- Needs to prevent overruns
- Approves all timesheets

**Verdict:** Project managers DO need full aggregate views with no filtering.

---

## 📊 Permission Matrix

| Feature | Solo Freelancer | Team Lead (Agency) | Project Manager |
|---------|----------------|-------------------|-----------------|
| **My Timesheet** | ✓ Own only | ✓ Own + bulk for team | ✓ Own + bulk for all |
| **Browse Team** | ❌ Redundant | ✓ Own org only | ✓ All vendors |
| **Team Calendar** | ❌ Not needed | ✓ Own org only | ✓ Full project |
| **Team List** | ❌ Not needed | ✓ Own org only | ✓ Full project |
| **Bulk Entry** | ❌ No team | ✓ Own org only | ✓ All contractors |
| **Scope Filter** | Self | Organization | Project |
| **Can See** | Just me | My 3 people | All 6 people |

---

## 🎨 Real-World Example

### **Project: Mobile App Redesign**

```
Client: TechCo Inc
├── Lisa Martinez (Project Manager)
    └── Budget: $50k, Timeline: 3 months

Vendors:
├── Acme Corp (Development Agency)
│   ├── Mike Wilson (Account Manager)
│   ├── Sarah Chen (Senior Dev) @ $95/hr
│   ├── Tom Martinez (Frontend Dev) @ $85/hr
│   └── Emma Davis (UI Designer) @ $75/hr
│
├── TechStaff Inc (QA & Backend)
│   ├── Alex Rodriguez (Team Lead)
│   ├── Alex Kim (Backend Dev) @ $90/hr
│   └── Lisa Park (QA Engineer) @ $70/hr
│
└── Freelancers
    └── Jordan Smith (Content Writer) @ $60/hr
```

---

### **Permission Breakdown:**

#### **1. Jordan (Solo Freelancer)**

**What Jordan sees in Browse Team:**
```
┌────────────────────────────┐
│ Your Timesheets            │
├────────────────────────────┤
│ Jordan Smith (You)         │
│ Project: Mobile App        │
│ Status: Draft              │
│ Hours: 12h                 │
└────────────────────────────┘

Only shows Jordan ✓
```

**Tabs available:**
- ✅ My Timesheet
- ✅ My Projects (shows just Jordan)
- 🔒 Team Calendar (locked - not needed)
- 🔒 Team List (locked - not needed)

**Reasoning:** Jordan works alone. Aggregate views would just show his own data, which is already in "My Timesheet". Showing aggregate views would be confusing UI clutter.

---

#### **2. Mike (Acme Corp Account Manager)**

**What Mike sees in Browse Team:**
```
┌────────────────────────────┐
│ Acme Corp Team (4)         │
├────────────────────────────┤
│ Mike Wilson (You)          │
│ Sarah Chen                 │
│ Tom Martinez               │
│ Emma Davis                 │
└────────────────────────────┘

Only Acme Corp people ✓
Cannot see TechStaff or Jordan ✓
```

**Tabs available:**
- ✅ My Timesheet (with bulk entry for Acme team)
- ✅ Browse Team (Acme Corp only - 4 people)
- ✅ Team Calendar (Acme Corp aggregate)
- ✅ Team List (Acme Corp breakdown)

**Reasoning:** Mike manages Acme's contractors and needs to:
- Pre-fill common hours (bulk entry)
- Review submissions before client sees them
- Ensure accurate billing for Acme Corp
- But should NOT see competitor rates/hours

---

#### **3. Alex Rodriguez (TechStaff Team Lead)**

**What Alex sees in Browse Team:**
```
┌────────────────────────────┐
│ TechStaff Inc Team (3)     │
├────────────────────────────┤
│ Alex Rodriguez (You)       │
│ Alex Kim                   │
│ Lisa Park                  │
└────────────────────────────┘

Only TechStaff people ✓
Cannot see Acme or Jordan ✓
```

**Tabs available:**
- ✅ My Timesheet (with bulk entry for TechStaff team)
- ✅ Browse Team (TechStaff only - 3 people)
- ✅ Team Calendar (TechStaff aggregate)
- ✅ Team List (TechStaff breakdown)

**Reasoning:** Same as Mike, but for TechStaff Inc. Each vendor manages their own team independently.

---

#### **4. Lisa Martinez (Client Project Manager)**

**What Lisa sees in Browse Team:**
```
┌────────────────────────────┐
│ All Contractors (7)        │
├────────────────────────────┤
│ Acme Corp (4)              │
│ ├── Mike Wilson            │
│ ├── Sarah Chen             │
│ ├── Tom Martinez           │
│ └── Emma Davis             │
│                            │
│ TechStaff Inc (3)          │
│ ├── Alex Rodriguez         │
│ ├── Alex Kim               │
│ └── Lisa Park              │
│                            │
│ Freelancers (1)            │
│ └── Jordan Smith           │
└────────────────────────────┘

Everyone across all vendors ✓
```

**Tabs available:**
- ✅ My Timesheet (can track own PM hours if needed)
- ✅ Browse Team (ALL 7 contractors)
- ✅ Team Calendar (Full project aggregate)
- ✅ Team List (Cross-vendor breakdown)

**Reasoning:** Lisa is paying everyone and needs full transparency to:
- Track total project hours vs budget
- Spot overruns early
- Approve all vendor invoices
- Ensure fair billing across vendors

---

## 🔐 Why Organizational Scoping Matters

### **Privacy Scenario:**

**Without scoping:**
```
Mike (Acme @ $95/hr) sees:
├── Alex Kim (TechStaff @ $90/hr) ← Close to Acme's rate
└── Lisa Park (TechStaff @ $70/hr) ← Much lower!

Mike thinks: "Wait, why are we charging so much more?"

Problems:
❌ Competitive information leaked
❌ Potential underbidding next time
❌ Client relationship strain
❌ Vendor conflicts
```

**With scoping:**
```
Mike (Acme) sees:
├── Only Acme Corp team
└── NO visibility into other vendors

Alex (TechStaff) sees:
├── Only TechStaff team
└── NO visibility into other vendors

Lisa (Client PM) sees:
├── Everyone (she's paying!)
└── Can compare rates & performance

Result:
✓ Vendor privacy maintained
✓ No competitive leaks
✓ Client has full transparency
✓ Fair marketplace
```

---

## 💡 Design Implications

### **The Demo Now Shows 3 Personas:**

**Dropdown selector:**
```
┌─────────────────────────────┐
│ Select Persona:             │
├─────────────────────────────┤
│ ○ Solo Freelancer           │
│   Individual contractor     │
│                             │
│ ○ Team Lead                 │
│   Agency/company with team  │
│                             │
│ ● Project Manager           │
│   Client-side PM            │
└─────────────────────────────┘
```

### **What Each Persona Sees:**

**Solo Freelancer:**
```
Tabs:
├── My Timesheet ✓
├── My Projects ✓ (shows just them)
├── Team Calendar 🔒
└── Team List 🔒

Access: Own Data Only
Contractors visible: 1 (themselves)
```

**Team Lead (Agency):**
```
Tabs:
├── My Timesheet ✓ (+ bulk entry)
├── Browse Team ✓ (org filtered)
├── Team Calendar ✓ (org filtered)
└── Team List ✓ (org filtered)

Access: Your Team
Contractors visible: 4 (Acme Corp)
Scope: Organization-level filtering
```

**Project Manager:**
```
Tabs:
├── My Timesheet ✓ (+ bulk entry)
├── Browse Team ✓ (all vendors)
├── Team Calendar ✓ (full project)
└── Team List ✓ (full project)

Access: Full Project
Contractors visible: 7 (all vendors)
Scope: No filtering
```

---

## 🎯 Key Insights

### **1. "Contractor" is Not a Monolithic Role**

```
❌ Wrong mental model:
├── Contractors (limited access)
└── Managers (full access)

✓ Right mental model:
├── Solo freelancers (own data only)
├── Team leads (org-scoped team data)
└── Project managers (full project data)
```

### **2. Permissions Follow Responsibility**

```
Responsibility              →  Permissions
─────────────────────────────────────────
Deliver own work           →  Own timesheet
Manage a team              →  Team aggregate views
Oversee entire project     →  Full project views
```

### **3. Organizational Boundaries Matter**

```
Vendor A    Vendor B    Client
   ↓           ↓          ↓
Can see    Can see    Can see
own team   own team   everyone
```

### **4. UI Should Adapt, Not Multiply**

```
❌ Bad: 3 different interfaces
✓ Good: 1 interface, 3 permission levels
```

---

## 🚀 Production Implementation

### **Permission Model:**

```typescript
interface TimesheetPermissions {
  // What they can see
  scope: "self" | "organization" | "project";
  
  // Their organization (for filtering)
  organizationId?: string;
  
  // Features they can use
  features: {
    viewOwnTimesheet: boolean;        // Always true
    viewTeamBrowser: boolean;         // True for team leads+
    viewTeamCalendar: boolean;        // True for team leads+
    viewTeamList: boolean;            // True for team leads+
    useBulkEntry: boolean;            // True for team leads+
    approveTimesheets: boolean;       // True for PMs
  };
}

// Examples:
const soloFreelancer: TimesheetPermissions = {
  scope: "self",
  features: {
    viewOwnTimesheet: true,
    viewTeamBrowser: false,  // Redundant
    viewTeamCalendar: false, // Useless
    viewTeamList: false,     // Useless
    useBulkEntry: false,     // No team
    approveTimesheets: false,
  }
};

const teamLead: TimesheetPermissions = {
  scope: "organization",
  organizationId: "acme-corp",
  features: {
    viewOwnTimesheet: true,
    viewTeamBrowser: true,   // Needed!
    viewTeamCalendar: true,  // Useful!
    viewTeamList: true,      // Useful!
    useBulkEntry: true,      // Efficient!
    approveTimesheets: false, // Client approves
  }
};

const projectManager: TimesheetPermissions = {
  scope: "project",
  features: {
    viewOwnTimesheet: true,
    viewTeamBrowser: true,   // All contractors
    viewTeamCalendar: true,  // Full project
    viewTeamList: true,      // Full project
    useBulkEntry: true,      // All contractors
    approveTimesheets: true, // Final approval
  }
};
```

### **Data Filtering:**

```typescript
function filterContractorsByPermission(
  allContractors: Contractor[],
  permissions: TimesheetPermissions,
  currentUserId: string
): Contractor[] {
  switch (permissions.scope) {
    case "self":
      // Solo freelancer: only themselves
      return allContractors.filter(c => c.userId === currentUserId);
    
    case "organization":
      // Team lead: their organization only
      return allContractors.filter(
        c => c.organizationId === permissions.organizationId
      );
    
    case "project":
      // Project manager: everyone
      return allContractors;
  }
}
```

---

## 📋 Summary

**Question:** Should contractors have access to browse/calendar/list views?

**Answer:**

| Contractor Type | Browse | Calendar | List | Reason |
|----------------|--------|----------|------|--------|
| **Solo Freelancer** | ❌ No | ❌ No | ❌ No | Would only show themselves (redundant) |
| **Team Lead** | ✅ Yes* | ✅ Yes* | ✅ Yes* | *But filtered to their organization only |
| **Project Manager** | ✅ Yes | ✅ Yes | ✅ Yes | Full access, no filtering |

**Key Principles:**

1. ✅ **Give people what they need, not more**
   - Solo: Just own timesheet
   - Team lead: Team management
   - PM: Full oversight

2. ✅ **Respect organizational boundaries**
   - Vendors can't see each other
   - Client can see everyone

3. ✅ **One interface, permission-filtered**
   - Same UI for all
   - Different data based on scope

4. ✅ **Avoid redundancy**
   - Don't show aggregate views of one person
   - Don't duplicate "My Timesheet" data

**The unified interface handles all three cases perfectly through permission-based filtering!** 🎉
