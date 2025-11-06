# Time Entry Modal - Contract Configuration Visuals

## Quick Reference: 4 Main Configurations

---

### 1️⃣ Standard Hourly (Simplest - 80% of contracts)

**Config:**
```
✓ Hourly rate: $95/hr
✗ Schedule not required
✗ Break tracking not required
```

**Modal:**
```
┌──────────────────────────┐
│ Hours:  [8            ]  │ ← Just enter hours
│ Type:   [Regular ▼]      │
│ Category: [Dev ▼]        │
│                          │
│ Total: 8h                │
└──────────────────────────┘
```
**Entry Time:** ~5 seconds

---

### 2️⃣ Hourly + Schedule Required (Detailed tracking)

**Config:**
```
✓ Hourly rate: $95/hr
✓ Schedule required
✓ Break tracking required
```

**Modal:**
```
┌──────────────────────────────────┐
│ ╔══════════════════════════════╗ │
│ ║ 🕐 Work Schedule + Break     ║ │ ← Always visible!
│ ║ Start: [09:00]  End: [17:00] ║ │
│ ║ Break: [30] min              ║ │
│ ║ = 7.50 hours                 ║ │
│ ╚══════════════════════════════╝ │
│                                  │
│ Calculated: [7.50] (auto)        │ ← Can't edit
│ Type: [Regular ▼]                │
│ Category: [Dev ▼]                │
│                                  │
│ Total: 7.50h | $712.50           │
└──────────────────────────────────┘
```
**Entry Time:** ~10 seconds

---

### 3️⃣ Daily Rate (Fixed payment)

**Config:**
```
✓ Daily rate: $760/day
✗ Schedule not required
```

**Modal:**
```
┌────────────────────────────────────┐
│ ⓘ Daily Rate                       │
├────────────────────────────────────┤
│ ╔════════════════════════════════╗ │
│ ║ Daily Rate Contract: $760/day  ║ │ ← Info banner
│ ║ Hours tracked for compliance   ║ │
│ ╚════════════════════════════════╝ │
│                                    │
│ Hours:  [8            ]            │
│ Type:   [Regular ▼]                │
│ Category: [Dev ▼]                  │
│                                    │
│ Total: 8h | Daily Rate: $760.00    │ ← Fixed amount
│ 💡 Fixed payment regardless of hrs │
└────────────────────────────────────┘
```
**Entry Time:** ~5 seconds
**Key:** Hours logged ≠ payment amount

---

### 4️⃣ Daily Rate + Schedule (Compliance heavy)

**Config:**
```
✓ Daily rate: $760/day
✓ Schedule required
✓ Break tracking required
```

**Modal:**
```
┌────────────────────────────────────┐
│ ⓘ Daily Rate                       │
├────────────────────────────────────┤
│ ╔════════════════════════════════╗ │
│ ║ Daily Rate: $760/day           ║ │
│ ║ Schedule required by client    ║ │
│ ╚════════════════════════════════╝ │
│                                    │
│ ╔══════════════════════════════╗   │
│ ║ 🕐 Work Schedule + Break     ║   │ ← Required
│ ║ Start: [09:00]  End: [17:00] ║   │
│ ║ Break: [30] min              ║   │
│ ║ = 7.50 hours                 ║   │
│ ╚══════════════════════════════╝   │
│                                    │
│ Calculated: [7.50]                 │
│ Category: [Dev ▼]                  │
│                                    │
│ Total: 7.50h | Daily Rate: $760.00 │
└────────────────────────────────────┘
```
**Entry Time:** ~10 seconds
**Use Case:** Government contracts

---

## Side-by-Side Comparison

### Without Schedule Requirement
```
┌─────────────────────┐  ┌─────────────────────┐
│ HOURLY              │  │ DAILY RATE          │
├─────────────────────┤  ├─────────────────────┤
│ Hours:  [8       ]  │  │ ⓘ Daily Rate        │
│ Type:   [Reg ▼]     │  │ Hours:  [8       ]  │
│ Cat:    [Dev ▼]     │  │ Type:   [Reg ▼]     │
│                     │  │ Cat:    [Dev ▼]     │
│ 8h | $760           │  │ 8h | $760 (fixed)   │
└─────────────────────┘  └─────────────────────┘
     Fast entry              Fast entry
  Pay varies by hours     Pay fixed per day
```

### With Schedule Requirement
```
┌─────────────────────────┐  ┌─────────────────────────┐
│ HOURLY + SCHEDULE       │  │ DAILY + SCHEDULE        │
├─────────────────────────┤  ├─────────────────────────┤
│ ╔═══════════════════╗   │  │ ⓘ Daily Rate            │
│ ║ 🕐 09:00-17:00    ║   │  │ ╔═══════════════════╗   │
│ ║ Break: 30min      ║   │  │ ║ 🕐 09:00-17:00    ║   │
│ ║ = 7.50h           ║   │  │ ║ Break: 30min      ║   │
│ ╚═══════════════════╝   │  │ ║ = 7.50h           ║   │
│ Type: [Reg ▼]           │  │ ╚═══════════════════╝   │
│ Cat:  [Dev ▼]           │  │ Cat: [Dev ▼]            │
│                         │  │                         │
│ 7.50h | $712.50         │  │ 7.50h | $760 (fixed)    │
└─────────────────────────┘  └─────────────────────────┘
   Schedule visible           Schedule visible
   Pay = hours × rate         Pay = fixed daily
```

---

## Multi-Task Scenarios

### Hourly: Travel + Work
```
┌─────────────────────────────────┐
│ Task 1: Travel           [🗑]   │
│ Hours: [2]  Type: [Travel 0.5x▼]│
│ 2h @ $47.50/hr = $95.00         │
├─────────────────────────────────┤
│ Task 2: Work             [🗑]   │
│ Hours: [6]  Type: [Regular 1x▼] │
│ 6h @ $95.00/hr = $570.00        │
├─────────────────────────────────┤
│ Breakdown:                      │
│ 🚗 Travel: 2h × $47.50 = $95   │
│ 🕐 Regular: 6h × $95 = $570    │
│ ─────────────────────────       │
│ Total: 8h        $665.00        │ ← Per-hour calc
└─────────────────────────────────┘
```

### Daily Rate: Travel + Work
```
┌─────────────────────────────────┐
│ ⓘ Daily Rate Contract: $760/day │
├─────────────────────────────────┤
│ Task 1: Travel           [🗑]   │
│ Hours: [2]  Type: [Travel▼]     │
│ Category: [Travel ▼]            │
├─────────────────────────────────┤
│ Task 2: Work             [🗑]   │
│ Hours: [6]  Type: [Regular▼]    │
│ Category: [Development ▼]       │
├─────────────────────────────────┤
│ Total: 8h | Daily Rate: $760.00 │ ← Fixed amount
│ 💡 Work types for tracking only │
└─────────────────────────────────┘
```

**Key Difference:** 
- Hourly: Work types change billing ($47.50 vs $95)
- Daily: Work types for categorization only (billing = $760)

---

## When to Use Each Config

### ✅ Standard Hourly (No Schedule)
**Use when:**
- Flexible work hours
- Remote contractors
- Trust-based relationship
- Focus on output, not schedule

**Example clients:**
- Tech startups
- Remote-first companies
- Agile teams

---

### ✅ Hourly + Schedule Required
**Use when:**
- On-site work required
- Client needs attendance records
- Labor law compliance
- Shift-based work

**Example clients:**
- Corporate IT departments
- Healthcare facilities
- Retail/hospitality tech

---

### ✅ Daily Rate (No Schedule)
**Use when:**
- Retainer agreements
- Fixed deliverable-based work
- Senior consultant rates
- Simplified billing

**Example clients:**
- Consulting firms
- Fractional CTO roles
- Advisory positions

---

### ✅ Daily Rate + Schedule Required
**Use when:**
- Government contracts
- Audited environments
- Compliance-heavy industries
- Union requirements

**Example clients:**
- Federal agencies
- Financial institutions
- Healthcare (HIPAA)
- Defense contractors

---

## Decision Tree

```
START: Setting up new contract

Q1: How is payment calculated?
├─ Per hour worked
│  └─ Q2: Does client need work schedule?
│     ├─ Yes → CONFIG 2: Hourly + Schedule
│     └─ No  → CONFIG 1: Standard Hourly
│
└─ Fixed daily rate
   └─ Q3: Does client need work schedule?
      ├─ Yes → CONFIG 4: Daily + Schedule
      └─ No  → CONFIG 3: Daily Rate
```

---

## Implementation Checklist

### Contract Setup Phase
```
[ ] Add payment type selection (Hourly / Daily Rate)
[ ] If Hourly: Enter hourly rate + multipliers
[ ] If Daily: Enter daily rate amount
[ ] Toggle: "Require start/end time logging?"
[ ] Toggle: "Require break tracking?"
[ ] Toggle: "Show rates to contractor?"
[ ] Save contract settings
```

### Time Entry Phase
```
[ ] Load contract settings for selected project
[ ] Adapt modal UI based on settings:
    [ ] Show/hide time fields
    [ ] Show/hide rate breakdowns
    [ ] Show "Daily Rate" banner if applicable
    [ ] Auto-calculate hours from time if required
[ ] Validate based on contract requirements
[ ] Save entry with contract context
```

### Reporting Phase
```
[ ] Generate invoices based on payment type:
    - Hourly: Sum (hours × rate × multiplier)
    - Daily: Count days × daily rate
[ ] Show detailed breakdown if hourly
[ ] Show simple day count if daily rate
```

---

## Real-World Examples

### Example 1: Tech Startup (Standard Hourly)
```
Company: Acme SaaS
Contractor: Sarah (Senior Dev)
Rate: $95/hr
Schedule: Not required (flexible remote)

Entry: 8h regular work
Billing: 8 × $95 = $760
```

### Example 2: Corporate IT (Hourly + Schedule)
```
Company: MegaCorp IT Dept
Contractor: Mike (On-site support)
Rate: $75/hr
Schedule: Required (9-5 on-site)

Entry: 09:00-17:00, 30min break = 7.5h
Billing: 7.5 × $75 = $562.50
```

### Example 3: Consulting Firm (Daily Rate)
```
Company: Strategy Consultants
Contractor: Lisa (Senior Advisor)
Daily Rate: $1,200/day
Schedule: Not required (output-based)

Entry: 10h logged (project meetings + work)
Billing: $1,200 (fixed)
Note: Hours for PM tracking only
```

### Example 4: Government (Daily + Schedule)
```
Company: Federal Agency
Contractor: John (Cleared Developer)
Daily Rate: $850/day
Schedule: Required (compliance)

Entry: 08:00-16:30, 30min break = 8h
Billing: $850 (fixed)
Note: Schedule audited for security clearance
```

---

## Benefits Summary

| Benefit | Standard Hourly | Hourly + Schedule | Daily Rate | Daily + Schedule |
|---------|-----------------|-------------------|------------|------------------|
| Fast entry | ✅ 5 sec | ⚠️ 10 sec | ✅ 5 sec | ⚠️ 10 sec |
| Accurate billing | ✅ Per hour | ✅ Per hour | ✅ Fixed | ✅ Fixed |
| Compliance | ⚠️ Basic | ✅ Full | ⚠️ Basic | ✅ Full |
| Flexibility | ✅ High | ⚠️ Medium | ✅ High | ⚠️ Medium |
| Audit trail | ⚠️ Hours only | ✅ Schedule | ⚠️ Hours only | ✅ Schedule |

---

## My Recommendation

**Default behavior: HYBRID APPROACH**

```typescript
if (contract.requireStartEndTime) {
  // Always show time fields (required by contract)
  return <TimeFieldsAlwaysVisible required />;
} else {
  // Collapsible time calculator (optional)
  return <TimeFieldsOptional 
    defaultCollapsed={true}
    canExpand={true}
  />;
}
```

**Why this works best:**
1. ✅ Contracts needing schedules → Always visible (no confusion)
2. ✅ Contracts not needing schedules → Clean default
3. ✅ User can still opt-in to time calculator if helpful
4. ✅ Contract settings = single source of truth
5. ✅ No "should I use time calculator?" decision fatigue

**Result:** 
- 80% of users (no schedule required) → Fast, clean entry
- 20% of users (schedule required) → Fields always there
- Everyone happy, no confusion

---

**Status**: ✅ Design Complete
**Component**: `AdaptiveDayEntryModal.tsx`
**Decision**: Hybrid approach (auto-show when required, optional otherwise)
