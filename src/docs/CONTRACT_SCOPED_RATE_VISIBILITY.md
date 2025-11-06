# 🔐 Contract-Scoped Rate Visibility

> **🆕 UPDATED 2025-10-31:** Rate extraction bug fixed! See `/RATE_DISPLAY_FIXED_AND_EXPLAINED.md` for latest changes.
> 
> **❓ Quick Guide:** If you're confused about which rate you see, read `/WHICH_RATE_DO_I_SEE.md` first!

## 🎯 **THE PROBLEM**

In multi-party scenarios, each relationship has its own contract with its own rate. Parties should only see rates from contracts they're actually party to.

### **Example Scenario:**

```
John Smith ←[Contract A]→ DevShop ←[Contract B]→ TechStaff ←[Contract C]→ Global Corp
  $50/hr                    $150/hr                 $175/hr
```

### **What Each Party Should See:**

| Party | Should See | Should NOT See |
|-------|-----------|----------------|
| **John Smith** | Contract A: $50/hr | Contracts B, C |
| **DevShop Inc** | Contract A: $50/hr<br>Contract B: $150/hr | Contract C |
| **TechStaff Agency** | Contract B: $150/hr<br>Contract C: $175/hr | Contract A |
| **Global Corp (Client)** | Contract C: $175/hr | Contracts A, B |

---

## 🏗️ **THE SOLUTION: Multiple Contract Nodes**

### **Step 1: Create Separate Contracts**

Instead of one rate card, create **multiple contract nodes**:

```
┌─────────────────────────────────────┐
│ Contract A: John ↔ DevShop          │
│ • Parties: John, DevShop            │
│ • Rate: $50/hr                      │
│ • Visible to: John, DevShop         │
│ • Hidden from: TechStaff, Global    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Contract B: DevShop ↔ TechStaff     │
│ • Parties: DevShop, TechStaff       │
│ • Rate: $150/hr                     │
│ • Visible to: DevShop, TechStaff    │
│ • Hidden from: John, Global         │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Contract C: TechStaff ↔ Global      │
│ • Parties: TechStaff, Global        │
│ • Rate: $175/hr                     │
│ • Visible to: TechStaff, Global     │
│ • Hidden from: John, DevShop        │
└─────────────────────────────────────┘
```

---

## 📊 **VISUAL WORKGRAPH SETUP**

### **Your Current Setup (INCORRECT):**

```
┌──────────────────────┐
│  Contractor Rate     │
│  Card (Yellow)       │
│  $125/hr             │  ← EVERYONE can see this
└──────────┬───────────┘
           │ worksOn
           ▼
┌──────────────────────┐
│  John Smith          │
│  (Contractor)        │
│  [See Rates]         │  ← Can see rates
└──────────┬───────────┘
           │ approves(1)
           ▼
┌──────────────────────┐
│  DevShop Inc         │
│  (Company/Vendor)    │
│  [See Rates]         │  ← Can see rates
└──────────┬───────────┘
           │ approves(2)
           ▼
┌──────────────────────┐
│  TechStaff Agency    │
│  (Agency)            │
│  [No Rates]          │  ← Cannot see ANY rates
└──────────┬───────────┘
           │ approves(3)
           ▼
┌──────────────────────┐
│  Global Corp         │
│  (Client)            │
│  [No Rates]          │  ← Cannot see ANY rates
└──────────────────────┘
```

**Problem:** Binary "See Rates" / "No Rates" doesn't allow granular control.

---

### **Correct Setup (CONTRACT-SCOPED):**

```
                       ┌──────────────────────┐
                       │  John Smith          │
                       │  (Contractor/Person) │
                       └──────────┬───────────┘
                                  │ worksOn
                                  ▼
                       ┌──────────────────────────────────┐
                       │  Contract A                      │
                       │  "John ↔ DevShop Contract"       │
                       │  ─────────────────────────────   │
                       │  Rate: $125/hr                   │
                       │  Parties: [John, DevShop]        │
                       │  Hidden from: [TechStaff, Global]│
                       └──────────┬───────────────────────┘
                                  │ between
                                  ▼
                       ┌──────────────────────┐
                       │  DevShop Inc         │
                       │  (Company/Vendor)    │
                       └──────────┬───────────┘
                                  │ approves(1)
                                  ▼
                                  │ between
                                  ▼
                       ┌──────────────────────────────────┐
                       │  Contract B                      │
                       │  "DevShop ↔ TechStaff Contract"  │
                       │  ─────────────────────────────   │
                       │  Rate: $150/hr                   │
                       │  Parties: [DevShop, TechStaff]   │
                       │  Hidden from: [John, Global]     │
                       └──────────┬───────────────────────┘
                                  │ between
                                  ▼
                       ┌──────────────────────┐
                       │  TechStaff Agency    │
                       │  (Agency)            │
                       └──────────┬───────────┘
                                  │ approves(2)
                                  ▼
                                  │ between
                                  ▼
                       ┌──────────────────────────────────┐
                       │  Contract C                      │
                       │  "TechStaff ↔ Global Contract"   │
                       │  ─────────────────────────────   │
                       │  Rate: $175/hr                   │
                       │  Parties: [TechStaff, Global]    │
                       │  Hidden from: [John, DevShop]    │
                       └──────────┬───────────────────────┘
                                  │ between
                                  ▼
                       ┌──────────────────────┐
                       │  Global Corp         │
                       │  (End Client)        │
                       └──────────────────────┘
```

---

## 🛠️ **HOW TO SET THIS UP**

### **Step 1: Delete the Single Rate Card**

1. **Select** the "Contractor Rate Card" (yellow node)
2. **Press Delete** or click delete button
3. This removes the single shared rate

---

### **Step 2: Create Contract A (John ↔ DevShop)**

1. **Click "Contract" in Node Palette**
2. **Place it between John and DevShop**
3. **Configure Contract:**
   ```
   Name: John-DevShop Contract
   Type: Hourly
   Rate: $125/hr
   Currency: USD
   Status: Active
   
   Parties:
   • Party A: John Smith
   • Party B: DevShop Inc
   
   Visibility:
   • Hide rate from: [TechStaff Agency, Global Corp]
   ```
4. **Draw edges:**
   - `John Smith` → `worksOn` → `Contract A`
   - `Contract A` → `between` → `DevShop Inc`

---

### **Step 3: Create Contract B (DevShop ↔ TechStaff)**

1. **Click "Contract" in Node Palette**
2. **Place it between DevShop and TechStaff**
3. **Configure Contract:**
   ```
   Name: DevShop-TechStaff Contract
   Type: Hourly
   Rate: $150/hr
   Currency: USD
   Status: Active
   
   Parties:
   • Party A: DevShop Inc
   • Party B: TechStaff Agency
   
   Visibility:
   • Hide rate from: [John Smith, Global Corp]
   ```
4. **Draw edges:**
   - `DevShop Inc` → `between` → `Contract B`
   - `Contract B` → `between` → `TechStaff Agency`

---

### **Step 4: Create Contract C (TechStaff ↔ Global)**

1. **Click "Contract" in Node Palette**
2. **Place it between TechStaff and Global**
3. **Configure Contract:**
   ```
   Name: TechStaff-Global Contract
   Type: Hourly
   Rate: $175/hr
   Currency: USD
   Status: Active
   
   Parties:
   • Party A: TechStaff Agency
   • Party B: Global Corp
   
   Visibility:
   • Hide rate from: [John Smith, DevShop Inc]
   ```
4. **Draw edges:**
   - `TechStaff Agency` → `between` → `Contract C`
   - `Contract C` → `between` → `Global Corp`

---

### **Step 5: Set Approval Flow**

Keep the approval edges the same:

```
DevShop Inc → approves(1) → [Timesheet]
TechStaff Agency → approves(2) → [Timesheet]
Global Corp → approves(3) → [Timesheet]
```

---

## 📋 **PROPERTY PANEL: Contract Configuration**

When you select a Contract node, the property panel should show:

```
┌─────────────────────────────────────────┐
│ Contract Properties                      │
├─────────────────────────────────────────┤
│                                         │
│ Name:                                   │
│ [John-DevShop Contract____________]    │
│                                         │
│ Contract Type:                          │
│ [Hourly                          ▼]    │
│                                         │
│ Hourly Rate:                            │
│ [$] [125___________] [USD      ▼]      │
│                                         │
│ Start Date:                             │
│ [2025-01-01_____]                      │
│                                         │
│ Status:                                 │
│ [Active                          ▼]    │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                         │
│ 🔐 Rate Visibility                      │
│                                         │
│ Parties to this contract:               │
│ ☑ John Smith                           │
│ ☑ DevShop Inc                          │
│                                         │
│ Hide rate from:                         │
│ ☑ TechStaff Agency                     │
│ ☑ Global Corp                          │
│ ☐ Other parties...                     │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                         │
│ 📊 Limits (Optional)                    │
│                                         │
│ Weekly Hour Limit:                      │
│ [40_________] hours                    │
│                                         │
│ Monthly Hour Limit:                     │
│ [160________] hours                    │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🔬 **HOW VISIBILITY WORKS**

### **When Simulating a Timesheet:**

```javascript
// Pseudo-code for rate visibility logic

function getRateForParty(partyId, timesheetData) {
  // Find the contract that applies to this party
  const relevantContract = contracts.find(contract => 
    contract.parties.includes(partyId) &&
    !contract.visibility.hideRateFrom.includes(partyId)
  );
  
  if (relevantContract) {
    return relevantContract.hourlyRate;
  }
  
  return null; // Rate masked
}
```

### **Example Flow:**

**When DevShop approves:**
```
Timesheet submitted for John Smith (40 hours)

DevShop's View:
✓ Can see Contract A ($125/hr)
✓ Total: 40h × $125 = $5,000
❌ Cannot see Contract B ($150/hr) - not their contract yet
❌ Cannot see Contract C ($175/hr) - not their contract
```

**When TechStaff approves:**
```
Timesheet approved by DevShop

TechStaff's View:
❌ Cannot see Contract A ($125/hr) - not their contract
✓ Can see Contract B ($150/hr)
✓ Total: 40h × $150 = $6,000
❌ Cannot see Contract C ($175/hr) - don't show markup yet
```

**When Global approves:**
```
Timesheet approved by TechStaff

Global's View:
❌ Cannot see Contract A ($125/hr) - not their contract
❌ Cannot see Contract B ($150/hr) - not their contract
✓ Can see Contract C ($175/hr)
✓ Total: 40h × $175 = $7,000
```

---

## 💰 **FINANCIAL FLOW**

This setup correctly models the **financial cascade**:

```
John Smith earns:        $5,000  (40h × $125/hr)
    ↓
DevShop pays John:       $5,000
DevShop charges TechStaff: $6,000  (40h × $150/hr)
DevShop's margin:        $1,000  (20% markup)
    ↓
TechStaff pays DevShop:  $6,000
TechStaff charges Global: $7,000  (40h × $175/hr)
TechStaff's margin:      $1,000  (16.7% markup)
    ↓
Global pays TechStaff:   $7,000
```

**Each party only sees their piece of the puzzle!**

---

## 🎯 **INVOICE GENERATION**

When invoicing, each party generates their own invoice:

### **DevShop → TechStaff Invoice:**
```
┌─────────────────────────────────────┐
│ INVOICE                             │
│ From: DevShop Inc                   │
│ To: TechStaff Agency                │
├─────────────────────────────────────┤
│ John Smith - Senior Developer       │
│ Week of Oct 30, 2025                │
│                                     │
│ 40 hours @ $150/hr = $6,000        │
│                                     │
│ Total Due: $6,000                  │
└─────────────────────────────────────┘

❌ John's $125/hr rate is NOT shown
✓ Only the contracted rate with TechStaff
```

### **TechStaff → Global Invoice:**
```
┌─────────────────────────────────────┐
│ INVOICE                             │
│ From: TechStaff Agency              │
│ To: Global Corp                     │
├─────────────────────────────────────┤
│ Senior Developer (via DevShop)      │
│ Week of Oct 30, 2025                │
│                                     │
│ 40 hours @ $175/hr = $7,000        │
│                                     │
│ Total Due: $7,000                  │
└─────────────────────────────────────┘

❌ DevShop's $150/hr rate is NOT shown
❌ John's $125/hr rate is NOT shown
✓ Only the contracted rate with Global
```

---

## 🔐 **SECURITY BEST PRACTICES**

### **1. Default to Hidden**
```
By default, hide all rates from all parties except:
- The two parties to the contract
```

### **2. Explicit Visibility**
```
Only show rates if explicitly permitted:
if (contract.parties.includes(partyId) && 
    !contract.visibility.hideRateFrom.includes(partyId)) {
  showRate();
}
```

### **3. Audit Trail**
```
Log all rate visibility events:
- Who viewed which contract rate
- When they viewed it
- From which context (approval, invoice, etc.)
```

### **4. Role-Based Access**
```
Within a party, control who can see rates:
- Admins: Can see all contracts their company is party to
- Managers: Can see contracts for their team
- Workers: Can only see their own contracts
```

---

## 🧪 **TEST SCENARIOS**

### **Test 1: DevShop Approval**
```
Expected:
✓ Sees: John's 40 hours
✓ Sees: Contract A rate ($125/hr)
✓ Calculates: $5,000 cost
❌ Does NOT see: $150/hr or $175/hr
```

### **Test 2: TechStaff Approval**
```
Expected:
✓ Sees: John's 40 hours
❌ Does NOT see: $125/hr
✓ Sees: Contract B rate ($150/hr)
✓ Calculates: $6,000 to charge DevShop
❌ Does NOT see: $175/hr
```

### **Test 3: Global Approval**
```
Expected:
✓ Sees: Work completed (40 hours)
❌ Does NOT see: $125/hr or $150/hr
✓ Sees: Contract C rate ($175/hr)
✓ Calculates: $7,000 total invoice
```

---

## 📊 **SIMULATION RESULTS**

After setting up contract-scoped visibility, your simulation should show:

```
┌────────────────────────────────────────┐
│ 📊 Approval Flow Simulation            │
├────────────────────────────────────────┤
│                                        │
│ Step 1: DevShop Inc                    │
│ ├─ Visible: [hours, week, contractor] │
│ ├─ Rate: $125/hr (Contract A)         │
│ ├─ Total: $5,000                       │
│ └─ Status: ✅ Approved                 │
│                                        │
│ Step 2: TechStaff Agency               │
│ ├─ Visible: [hours, week, contractor] │
│ ├─ Rate: $150/hr (Contract B)         │
│ ├─ Masked: [Contract A rate]          │
│ ├─ Total: $6,000                       │
│ └─ Status: ✅ Approved                 │
│                                        │
│ Step 3: Global Corp                    │
│ ├─ Visible: [hours, week]              │
│ ├─ Rate: $175/hr (Contract C)         │
│ ├─ Masked: [Contract A, B rates]      │
│ ├─ Total: $7,000                       │
│ └─ Status: ✅ Approved                 │
│                                        │
└────────────────────────────────────────┘
```

---

## 🎯 **BENEFITS OF THIS APPROACH**

### **1. Real-World Accurate**
```
✓ Models actual business relationships
✓ Each contract is separate and explicit
✓ Matches how real companies work
```

### **2. Privacy Protected**
```
✓ No rate leakage across contracts
✓ Each party sees only their rates
✓ Maintains competitive information
```

### **3. Flexible**
```
✓ Easy to add more parties
✓ Easy to add more contracts
✓ Easy to change rates per contract
```

### **4. Auditable**
```
✓ Clear contract boundaries
✓ Explicit visibility rules
✓ Easy to verify compliance
```

---

## 🚀 **NEXT STEPS**

### **Immediate Actions:**

1. **Delete** the single "Contractor Rate Card" node
2. **Create** 3 separate Contract nodes
3. **Configure** each contract with proper parties
4. **Set** visibility rules for each contract
5. **Test** the simulator to verify rate masking

### **Future Enhancements:**

- [ ] Contract templates for common scenarios
- [ ] Bulk contract creation
- [ ] Contract versioning (rate changes over time)
- [ ] Automatic margin calculation
- [ ] Invoice preview per party
- [ ] Rate history tracking

---

## 📚 **SUMMARY**

**Problem:** Binary "See Rates" / "No Rates" doesn't support multi-party scenarios.

**Solution:** Create separate Contract nodes for each relationship with explicit:
- Contract parties (who signed)
- Contract rates (specific to that relationship)
- Visibility rules (who can/cannot see)

**Result:** Each party only sees rates from contracts they're party to, protecting sensitive pricing information while maintaining transparency within each relationship.

---

**Need help setting this up? Let me know and I'll guide you through creating the three contracts!** 🎯
