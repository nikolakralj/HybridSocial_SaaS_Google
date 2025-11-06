# Contract-Based Time Entry Configurations

## Problem Statement

Different clients have different requirements:

1. **Payment Structure**:
   - Some pay **per hour** (e.g., $95/hr)
   - Some pay **daily rate** (e.g., $760/day regardless of hours)

2. **Time Detail Requirements**:
   - Some clients want to see **exact work schedule** (9am-5pm, 30min break)
   - Others just need **total hours** logged

3. **Rate Visibility**:
   - Some companies hide rates from contractors
   - Others show rates transparently

## Solution: Contract-Level Configuration

```typescript
interface ContractSettings {
  // Payment structure
  paymentType: "hourly" | "daily-rate";
  dailyRate?: number;
  hourlyRate?: number;
  
  // Time tracking requirements
  requireStartEndTime: boolean;  // Must log actual work schedule?
  requireBreakTracking: boolean; // Track lunch/breaks?
  
  // Display preferences
  showRateToContractor: boolean; // Show $ to individual contributors?
}
```

---

## Configuration Examples

### Config 1: Standard Hourly (Most Common)

```typescript
{
  paymentType: "hourly",
  hourlyRate: 95,
  requireStartEndTime: false,  // Just need total hours
  requireBreakTracking: false,
  showRateToContractor: false  // Hide from IC
}
```

**Modal Appearance (Individual Contributor)**:
```
┌─────────────────────────────────────────────┐
│ Monday, October 12, 2025                    │
├─────────────────────────────────────────────┤
│ Log your hours for manager review           │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ Hours: [8]    Work Type: [Regular 1.0x▼]│ │ ← Simple entry
│ │ Category: [Development ▼]               │ │
│ │ ✓ 8h logged                             │ │ ← No $ shown
│ └─────────────────────────────────────────┘ │
│                                             │
│ Total: 8.00 hours                           │
│ ✓ Hours reviewed by manager                │
└─────────────────────────────────────────────┘
```

---

### Config 2: Hourly + Time Detail Required

```typescript
{
  paymentType: "hourly",
  hourlyRate: 95,
  requireStartEndTime: true,   // Client wants schedule
  requireBreakTracking: true,  // Track breaks
  showRateToContractor: false
}
```

**Modal Appearance**:
```
┌─────────────────────────────────────────────┐
│ Monday, October 12, 2025                    │
├─────────────────────────────────────────────┤
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ ╔═══════════════════════════════════╗   │ │
│ │ ║ 🕐 Work Schedule + Break          ║   │ │ ← Required!
│ │ ║ Start    End      Break (min)     ║   │ │
│ │ ║ 09:00    17:00    30              ║   │ │
│ │ ║ = 7.50 hours                      ║   │ │
│ │ ╚═══════════════════════════════════╝   │ │
│ │                                         │ │
│ │ Calculated Hours: [7.50] (auto-filled) │ │
│ │ Work Type: [Regular 1.0x ▼]             │ │
│ │ Category: [Development ▼]               │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ Total: 7.50 hours                           │
└─────────────────────────────────────────────┘
```

**Key Difference**: Time fields are **always visible** and **required**. Hours auto-calculate.

---

### Config 3: Daily Rate Contract

```typescript
{
  paymentType: "daily-rate",
  dailyRate: 760,              // Fixed daily amount
  requireStartEndTime: false,  // Optional
  requireBreakTracking: false,
  showRateToContractor: true   // Show rate
}
```

**Modal Appearance**:
```
┌─────────────────────────────────────────────┐
│ Monday, October 12, 2025        ⓘ Daily Rate│
├─────────────────────────────────────────────┤
│ Log hours for tracking (fixed daily rate)   │
│                                             │
│ ╔═══════════════════════════════════════╗  │
│ ║ Daily Rate Contract: $760/day         ║  │ ← Info banner
│ ║ Hours tracked for compliance only     ║  │
│ ╚═══════════════════════════════════════╝  │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ Hours: [8]    Work Type: [Regular ▼]    │ │
│ │ Category: [Development ▼]               │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ Total: 8.00 hours                       │ │
│ │ Daily rate: $760.00                     │ │ ← Fixed amount
│ │ 💡 Fixed payment regardless of hours    │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

**Key Points**:
- Hours still tracked (compliance, project management)
- But payment is **fixed daily rate**
- No per-hour calculation
- Work type multipliers **don't apply**

---

### Config 4: Daily Rate + Schedule Required

```typescript
{
  paymentType: "daily-rate",
  dailyRate: 760,
  requireStartEndTime: true,   // Client wants to see schedule
  requireBreakTracking: true,
  showRateToContractor: true
}
```

**Modal Appearance**:
```
┌─────────────────────────────────────────────┐
│ Monday, October 12, 2025        ⓘ Daily Rate│
├─────────────────────────────────────────────┤
│ ╔═══════════════════════════════════════╗  │
│ ║ Daily Rate Contract: $760/day         ║  │
│ ║ Schedule required for client reporting ║  │
│ ╚═══════════════════════════════════���═══╝  │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ ╔═══════════════════════════════════╗   │ │
│ │ ║ 🕐 Work Schedule + Break          ║   │ │
│ │ ║ Start    End      Break (min)     ║   │ │
│ │ ║ 09:00    17:00    30              ║   │ │
│ │ ║ = 7.50 hours                      ║   │ │
│ │ ╚═══════════════════════════════════╝   │ │
│ │                                         │ │
│ │ Calculated Hours: [7.50]                │ │
│ │ Category: [Development ▼]               │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ Total: 7.50 hours | Daily rate: $760.00    │
└─────────────────────────────────────────────┘
```

**Use Case**: Government contracts or consulting firms that need both schedule compliance AND fixed daily billing.

---

### Config 5: Hourly + Travel (Multi-Rate)

```typescript
{
  paymentType: "hourly",
  hourlyRate: 95,
  requireStartEndTime: false,
  requireBreakTracking: false,
  showRateToContractor: false
}
```

**Modal with Multiple Tasks**:
```
┌─────────────────────────────────────────────┐
│ Monday, October 12, 2025                    │
├─────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────┐ │
│ │ Task 1: Travel                    [🗑]  │ │
│ │ Hours: [2]    Work Type: [Travel 0.5x▼] │ │
│ │ Category: [Travel ▼]                    │ │
│ │ 2h @ $47.50/hr = $95.00                 │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ Task 2: Development               [🗑]  │ │
│ │ Hours: [6]    Work Type: [Regular 1.0x▼]│ │
│ │ Category: [Development ▼]               │ │
│ │ 6h @ $95.00/hr = $570.00                │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ Breakdown:                                  │
│ 🚗 Travel: 2h × $47.50 = $95.00            │
│ 🕐 Regular: 6h × $95.00 = $570.00          │
│ ─────────────────────────────────────      │
│ Total: 8.00 hours         $665.00          │
└─────────────────────────────────────────────┘
```

---

## Decision Matrix

| Contract Type | Time Fields | Billing Calc | Use Case |
|---------------|-------------|--------------|----------|
| **Hourly, No Schedule** | Hours only | Hours × Rate × Multiplier | Standard consulting |
| **Hourly, Schedule Required** | Start/End/Break → Hours | Hours × Rate × Multiplier | Client wants schedule |
| **Daily Rate, No Schedule** | Hours only | Fixed daily rate | Retainer/Fixed consulting |
| **Daily Rate, Schedule Required** | Start/End/Break → Hours | Fixed daily rate | Govt contracts |

---

## Implementation in Modal

### 1. Time Fields Visibility

```typescript
// Controlled by contract settings
const showTimeFields = contractSettings.requireStartEndTime;
const showBreakField = contractSettings.requireBreakTracking;

{showTimeFields && (
  <div className="time-calculator">
    <Input type="time" label="Start" />
    <Input type="time" label="End" />
    {showBreakField && <Input type="number" label="Break" />}
  </div>
)}
```

### 2. Hours Auto-Calculation

```typescript
// If time fields shown, hours auto-calculate
const handleTimeChange = (field, value) => {
  // Update time field
  // If start + end complete, calculate hours
  if (startTime && endTime) {
    const calculatedHours = calculateFromTime(start, end, break);
    setHours(calculatedHours);
  }
};
```

### 3. Billing Display

```typescript
// Hourly: Show breakdown with multipliers
if (contractSettings.paymentType === "hourly") {
  return (
    <>
      {tasks.map(task => (
        <div>
          {task.hours}h @ ${rate × multiplier}/hr = ${amount}
        </div>
      ))}
      <div>Total: {totalHours}h | ${totalAmount}</div>
    </>
  );
}

// Daily Rate: Show fixed amount
if (contractSettings.paymentType === "daily-rate") {
  return (
    <div>
      Total: {totalHours}h | Daily Rate: ${dailyRate}
    </div>
  );
}
```

---

## User Experience Flow

### Hourly Contract (No Schedule)
```
1. Open modal → See Hours + Work Type
2. Enter hours directly: "8"
3. Select work type: "Regular"
4. Save
   → 5 seconds total
```

### Hourly Contract (Schedule Required)
```
1. Open modal → Time fields visible by default
2. Enter start: 09:00
3. Enter end: 17:00
4. Enter break: 30
5. Hours auto-fill: 7.50
6. Select work type: "Regular"
7. Save
   → 10 seconds total
```

### Daily Rate Contract
```
1. Open modal → See "Daily Rate" badge
2. Info banner: "Hours tracked, fixed payment"
3. Enter hours: "8"
4. Category: "Development"
5. See: "Total: 8h | Daily rate: $760"
6. Save
   → 5 seconds total
```

---

## Benefits

### ✅ Contract Flexibility
- Supports hourly AND daily rate billing
- Adapts UI to contract requirements
- No confusion about billing method

### ✅ Client Compliance
- If client needs schedule → Always visible
- If client just needs hours → Clean, simple
- Automatic validation based on requirements

### ✅ Correct Billing
- **Hourly**: Accurate per-hour × multiplier calculation
- **Daily Rate**: Fixed amount, hours for tracking only
- No accidental overbilling

### ✅ Reduced Cognitive Load
- Contractor sees only what's needed for their contract
- No irrelevant fields
- Clear labeling ("Calculated Hours" vs "Hours")

---

## Configuration Storage

### Contract Setup (One-Time)

```typescript
// When creating/editing a project contract
interface ProjectContract {
  id: string;
  projectId: string;
  contractorId: string;
  
  // Payment config
  paymentType: "hourly" | "daily-rate";
  hourlyRate?: number;
  dailyRate?: number;
  
  // Time tracking config
  requireStartEndTime: boolean;
  requireBreakTracking: boolean;
  
  // Visibility config
  showRateToContractor: boolean;
  
  // Standard contract fields
  startDate: Date;
  endDate?: Date;
  ...
}
```

### Modal Usage

```typescript
// When opening time entry modal
<AdaptiveDayEntryModal
  open={showModal}
  onOpenChange={setShowModal}
  date={selectedDate}
  userRole={userRole}
  contractSettings={{
    paymentType: contract.paymentType,
    hourlyRate: contract.hourlyRate,
    dailyRate: contract.dailyRate,
    requireStartEndTime: contract.requireStartEndTime,
    requireBreakTracking: contract.requireBreakTracking,
    showRateToContractor: contract.showRateToContractor
  }}
  onSave={handleSave}
/>
```

---

## Edge Cases Handled

### Daily Rate + Overtime
```
Question: What if contractor works 10h on daily rate contract?
Answer: Log 10h, but payment remains fixed at $760.
Purpose: Track actual hours for project management,
         but billing is per contract terms.
```

### Daily Rate + Multi-Task
```
Question: Can you log travel + work on daily rate?
Answer: Yes! Still log work types for categorization.
        But total payment = fixed daily rate.
```

### Schedule Required + Multi-Task
```
Question: How to handle multiple tasks with schedules?
Answer: Each task has its own start/end/break.
        E.g., Task 1: 09:00-11:00 (travel)
              Task 2: 11:00-17:00 (work, 30min break)
```

### Hourly Rate Changes Mid-Project
```
Question: What if rate increases during project?
Answer: Contract has effective dates.
        Modal uses rate valid for the logged date.
```

---

## Migration Path

### Phase 1: Add Contract Settings
```sql
ALTER TABLE project_contracts ADD COLUMN payment_type VARCHAR(20);
ALTER TABLE project_contracts ADD COLUMN daily_rate DECIMAL(10,2);
ALTER TABLE project_contracts ADD COLUMN require_start_end_time BOOLEAN;
ALTER TABLE project_contracts ADD COLUMN require_break_tracking BOOLEAN;
```

### Phase 2: Default Existing Contracts
```typescript
// For existing contracts, default to:
{
  paymentType: "hourly",  // Assume hourly
  requireStartEndTime: false,  // Don't force schedule
  requireBreakTracking: false,
  showRateToContractor: false  // Hide rates (safe default)
}
```

### Phase 3: Update Modal Components
```typescript
// Replace EnhancedDayEntryModal with AdaptiveDayEntryModal
// Pass contractSettings from contract data
```

---

## Recommendation

**My suggestion**: Keep time fields **optional by default** (collapsed/hidden), but show them **always visible when contract requires**.

**Why?**
- ✅ Clean default for 80% of contracts (hourly, no schedule needed)
- ✅ Automatic visibility for contracts that need it
- ✅ No user confusion about "where's the time calculator?"
- ✅ Contract settings = single source of truth

**Implementation**:
```typescript
if (contractSettings.requireStartEndTime) {
  // Always visible, required fields
  return <TimeFields required autoFocus />;
} else {
  // Hidden by default, can reveal with button
  return showTimeCalculator 
    ? <TimeFields optional /> 
    : <Button>Use time calculator</Button>;
}
```

This gives you **both flexibility and simplicity**:
- Contracts needing schedules → Always shown
- Contracts not needing schedules → Clean, can opt-in

---

**Status**: ✅ Solution Designed & Implemented
**Component**: `/components/timesheets/AdaptiveDayEntryModal.tsx`
**Next**: Add contract settings to project setup flow
