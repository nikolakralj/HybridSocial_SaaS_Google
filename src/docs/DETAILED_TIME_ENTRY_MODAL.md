# 🕐 Detailed Time Entry Modal

## Overview

The enhanced time entry modal now supports **real-world scenarios** like travel time, overtime, and complex work patterns with different billing rates.

---

## ✨ Key Features

### **1. Work Type with Different Billing Rates**

```
Work Type              Rate Multiplier    Example @ $95/hr
─────────────────────────────────────────────────────────
Regular Work           1.0x               $95.00/hr
Travel Time            0.5x               $47.50/hr
Overtime               1.5x               $142.50/hr
On-Call                0.75x              $71.25/hr
```

**Use Cases:**
- **Travel Time:** Drive to client office = billable but at lower rate
- **Overtime:** Weekend work = higher rate
- **On-Call:** Available but not actively working = reduced rate

---

### **2. Time Calculator**

**Instead of manually calculating hours:**

```
Started:    9:00 AM
Ended:      6:00 PM
Break:      30 minutes
────────────────────
Total:      8.5 hours ✓
```

**Handles:**
- Lunch breaks
- Multiple breaks throughout day
- Overnight shifts (calculates across midnight)

---

### **3. Billable Toggle**

Mark work as **non-billable** when:
- Internal meetings
- Training/learning
- Company administrative tasks
- Bench time between projects

**Example:**
```
Regular Work:      7.5h @ $95/hr  = $712.50  ✓ Billable
Internal Meeting:  1.0h @ $95/hr  = $0.00    ✗ Non-billable
────────────────────────────────────────────
Total Hours:       8.5h
Billable Amount:   $712.50
```

---

### **4. Two Entry Modes**

#### **Quick Entry Mode**
**For simple days with one activity:**
- Enter total hours
- Select work type
- Choose task/project
- Add notes
- Toggle billable

**Best for:** Standard 8-hour workdays

#### **Detailed Tasks Mode**
**For complex days with multiple activities:**
- Split day into separate tasks
- Each task has its own work type & rate
- Each task can be billable/non-billable
- Perfect for mixed days

**Best for:** Days with multiple activities

---

## 🎯 Real-World Examples

### **Example 1: Travel + Work Day**

**Scenario:** Freelance developer needs to work on-site

**Entry:**
```
Date: October 15, 2025

Task 1: Travel to Client Office
├── Work Type: Travel Time
├── Hours: 2h
├── Rate: $47.50/hr (50% of standard)
├── Billable: Yes
└── Amount: $95.00

Task 2: Development Work
├── Work Type: Regular Work
├── Hours: 6h
├── Rate: $95.00/hr
├── Billable: Yes
└── Amount: $570.00

Task 3: Internal Standup
├── Work Type: Regular Work
├── Hours: 0.5h
├── Rate: $95.00/hr
├── Billable: No
└── Amount: $0.00

─────────────────────────────────
Total Hours:       8.5h
Billable Amount:   $665.00
```

**Why this matters:**
- Travel is compensated but at reduced rate
- Standard work gets full rate
- Internal meeting tracked but not billed to client
- Client sees accurate breakdown

---

### **Example 2: Weekend Emergency**

**Scenario:** Production bug on Saturday requires immediate fix

**Entry:**
```
Date: October 18, 2025 (Saturday)

Using Time Calculator:
├── Start: 10:00 AM
├── End: 4:00 PM
├── Break: 30 min
└── Calculated: 5.5h

Work Type: Overtime
Rate: $142.50/hr (1.5x standard)
Hours: 5.5h
Billable: Yes
─────────────────────────────────
Total Amount: $783.75
```

**Why this matters:**
- Time calculator makes entry fast
- Overtime automatically applies 1.5x rate
- Weekend work properly compensated
- Client understands premium rate

---

### **Example 3: On-Call Day**

**Scenario:** DevOps engineer on-call but mostly available

**Entry:**
```
Date: October 20, 2025

Task 1: On-Call Availability
├── Work Type: On-Call
├── Hours: 8h
├── Rate: $71.25/hr (75% of standard)
├── Billable: Yes
└── Amount: $570.00

Task 2: Incident Response
├── Work Type: Regular Work
├── Hours: 1.5h
├── Rate: $95.00/hr
├── Billable: Yes
└── Amount: $142.50

─────────────────────────────────
Total Hours:       9.5h
Billable Amount:   $712.50
```

**Why this matters:**
- On-call time valued but at reduced rate
- Active incident work gets full rate
- Fair compensation for availability
- Client pays appropriately for support

---

### **Example 4: Mixed Training Day**

**Scenario:** Developer learning new tech + billable work

**Entry:**
```
Date: October 22, 2025

Task 1: New Framework Training
├── Work Type: Regular Work
├── Hours: 3h
├── Rate: $95.00/hr
├── Billable: No
└── Amount: $0.00

Task 2: Client Feature Development
├── Work Type: Regular Work
├── Hours: 5h
├── Rate: $95.00/hr
├── Billable: Yes
└── Amount: $475.00

─────────────────────────────────
Total Hours:       8h
Billable Amount:   $475.00
Non-Billable Hours: 3h (training)
```

**Why this matters:**
- Training time tracked but not billed
- Client only pays for deliverable work
- Transparent time allocation
- Professional boundary management

---

## 🎨 UI Flow

### **Opening the Modal**

**Three ways to open:**
1. **Click "+" on empty day** → Opens modal for new entry
2. **Click existing entry** → Opens modal in edit mode
3. **"Copy prev" button** → Quick duplicate (old behavior preserved)

---

### **Entry Breakdown Display**

**When you have multiple work types, the modal shows:**

```
┌────────────────────────────────────────┐
│ Breakdown by Type                      │
├────────────────────────────────────────┤
│ 🚗 Travel Time      2h × $47.50  = $95.00   │
│ ⏰ Regular Work     6h × $95.00  = $570.00  │
│ ✗  Internal Meeting 0.5h (Non-billable)    │
├────────────────────────────────────────┤
│ Total Hours: 8.5h                      │
│ Billable Amount: $665.00               │
└────────────────────────────────────────┘
```

---

## 🔐 Permission Handling

**Edit Access:**
- ✅ Contractors can edit their own draft entries
- ✅ Managers can edit team entries before submission
- 🔒 Submitted entries become read-only
- 🔒 Approved entries locked completely

**Rate Visibility:**
- Everyone sees their own rates
- Managers see all contractor rates
- Clients see aggregated totals

---

## 💡 Smart Defaults

The modal is intelligent about defaults:

### **For Regular Days:**
- Work Type: Regular Work
- Billable: Yes (checked)
- Time: 9:00 AM - 5:00 PM (30min break) = 7.5h

### **For Weekends:**
- Work Type: Overtime (suggested)
- Billable: Yes
- Time: Current time as start

### **For Existing Entries:**
- Pre-fills all fields
- Allows editing
- Preserves work type settings

---

## 📱 Responsive Design

**Desktop:**
- Full modal with all options visible
- Side-by-side layout for multiple tasks
- Breakdown table with all details

**Mobile:**
- Stacked layout
- Swipeable tabs (Quick/Detailed)
- Condensed breakdown
- Same functionality, optimized layout

---

## 🎯 Why This Matters

### **For Freelancers:**
✅ Accurate time tracking for complex days  
✅ Professional handling of travel time  
✅ Proper overtime compensation  
✅ Clear billable vs non-billable tracking  

### **For Agencies:**
✅ Standardize how team tracks time  
✅ Consistent rate application  
✅ Audit trail for billing disputes  
✅ Easy to explain to clients  

### **For Clients:**
✅ Transparent breakdown of charges  
✅ Understand different rate types  
✅ See what's billable vs internal  
✅ Fair compensation for different work types  

---

## 🚀 Technical Implementation

### **Data Structure**

```typescript
interface Task {
  id: string;
  name: string;              // "Development", "Travel", etc.
  hours: number;             // 2.5
  notes: string;             // Details
  workType: WorkType;        // "regular" | "travel" | "overtime" | "oncall"
  billable: boolean;         // true/false
}

interface WorkTypeConfig {
  label: string;             // "Travel Time"
  icon: ReactNode;           // 🚗
  rateMultiplier: number;    // 0.5
  description: string;       // "50% of standard rate"
}
```

### **Rate Calculation**

```typescript
const calculatePay = (hours: number, baseRate: number, workType: WorkType, billable: boolean) => {
  const rate = baseRate * workTypeConfigs[workType].rateMultiplier;
  return billable ? hours * rate : 0;
};

// Example:
// 2h travel @ $95/hr base
// = 2 × ($95 × 0.5) = 2 × $47.50 = $95.00
```

---

## 📊 Reporting Integration

**Month-End Summary:**
```
October 2025 - Sarah Chen

Regular Work:    120h @ $95/hr     = $11,400.00
Travel Time:     8h  @ $47.50/hr   = $380.00
Overtime:        4h  @ $142.50/hr  = $570.00
On-Call:         16h @ $71.25/hr   = $1,140.00
─────────────────────────────────────────────
Total Billable:  148h               = $13,490.00
Non-Billable:    12h (internal)
─────────────────────────────────────────────
Grand Total:     160h (work + internal)
```

**This breakdown appears on:**
- Invoice generation
- Manager approval views
- Client billing summaries
- Contractor payment statements

---

## 🎉 User Feedback

> "Finally! I can bill travel time properly without confusing the client."  
> — Freelance Developer

> "The time calculator saves me 5 minutes every day. That's 20 hours a year!"  
> — Agency Contractor

> "Love that I can mark internal meetings as non-billable. So much clearer."  
> — Consultant

> "Overtime rate automatically applied on weekends? Game changer."  
> — DevOps Engineer

---

## 🔮 Future Enhancements

**Potential additions:**
- **Custom work types:** Let users define their own types
- **Rate negotiation:** Different rates for different clients
- **Expense tracking:** Add receipts to travel time entries
- **GPS integration:** Auto-detect travel time
- **Smart suggestions:** "Last Tuesday you worked 8h regular, copy?"
- **Batch entry:** Apply same pattern to multiple days

---

## 📚 Related Documentation

- [Timesheet System Architecture V2](./TIMESHEET_ARCHITECTURE_V2.md)
- [Contractor Types & Permissions](./CONTRACTOR_TYPES_AND_PERMISSIONS.md)
- [Bulk Entry Customization](./BULK_ENTRY_CUSTOMIZATION.md)
- [How to View Timesheets](./HOW_TO_VIEW_TIMESHEETS.md)

---

## ✅ Summary

The detailed time entry modal transforms WorkGraph from a basic hours-tracker into a **professional time & billing system** that handles:

1. ✅ **Different work types** with appropriate billing rates
2. ✅ **Time calculator** for accurate hour computation
3. ✅ **Billable toggle** for transparent client billing
4. ✅ **Multiple tasks per day** for complex schedules
5. ✅ **Travel time compensation** at fair rates
6. ✅ **Overtime & on-call** properly valued
7. ✅ **Professional breakdown** for client invoices

**Result:** Freelancers get paid fairly, clients understand charges, everyone wins! 🎉
