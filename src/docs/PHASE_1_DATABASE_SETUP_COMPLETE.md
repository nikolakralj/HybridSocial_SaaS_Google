# Phase 1: Database Setup - COMPLETE ✅

**Date:** January 22, 2025  
**Status:** Migration files ready - Awaiting execution in Supabase  
**Next:** Execute migrations → Verify data → Move to Phase 2 (API Layer)

---

## What Was Created

### 1. Migration Files ✅

#### **`/supabase/migrations/001_timesheet_approval_tables.sql`** (850+ lines)

**Creates:**
- ✅ 8 production tables (organizations → allocated_tasks)
- ✅ 15+ indexes for performance
- ✅ Row Level Security (RLS) enabled with placeholder policies
- ✅ CHECK constraints for data integrity
- ✅ Foreign key relationships
- ✅ Auto-update triggers (total_hours, updated_at)
- ✅ Helper functions (`calculate_period_totals`)
- ✅ Views for easier querying (`v_contracts_with_orgs`, `v_periods_full`)

**Tables Created:**
```sql
1. organizations          -- Companies, agencies, freelancers
2. project_contracts      -- Individual contractor contracts
3. timesheet_periods      -- Weekly timesheet periods (Mon-Sun)
4. timesheet_entries      -- Daily time entries
5. approval_history       -- Audit trail for all actions
6. attachments            -- PDF signed timesheets
7. review_flags           -- Auto-detected anomalies
8. allocated_tasks        -- Planned vs actual task hours
```

**Key Features:**
- Auto-calculates period totals when entries change (trigger)
- Enforces data integrity (hours >= 0, valid dates, etc.)
- Supports both hourly and daily contracts
- Complete audit trail for compliance

#### **`/supabase/migrations/002_seed_demo_data.sql`** (450+ lines)

**Seeds:**
- ✅ 5 organizations (2 companies + 3 freelancers)
- ✅ 25 contracts (15 Acme + 7 BrightWorks + 3 freelancers)
- ✅ 25 timesheet periods (January 2025, Week 1)
- ✅ 10 daily entries (sample for Sarah Johnson)
- ✅ 16 approval history entries
- ✅ 4 PDF attachments
- ✅ 1 review flag (overtime warning)
- ✅ 3 allocated tasks (budget tracking)

**Status Distribution:**
- 60% Pending (15 periods)
- 30% Approved (8 periods)
- 10% Rejected (2 periods)

**Matches Demo Data:**
- Converts data from `/components/timesheets/approval-v2/demo-data-multi-party.ts`
- Same contractors, same rates, same week
- Ready to test approval workflows immediately

#### **`/supabase/migrations/README.md`**

**Contains:**
- Step-by-step migration instructions (3 methods)
- Verification queries
- RLS policy customization guide
- Troubleshooting common issues
- Rollback procedures

### 2. Utility Scripts ✅

#### **`/utils/api/supabase-setup-check.ts`**

**Functions:**
- `verifySupabaseSetup()` - Checks connection and table existence
- `printSetupStatus()` - Console-friendly status report
- `validateSeedData()` - Verifies expected record counts

**Usage:**
```typescript
import { printSetupStatus } from '@/utils/api/supabase-setup-check';

// In browser console or test file
await printSetupStatus();

// Output:
// 🔍 Checking Supabase setup...
// Connection: ✅
// Tables:
//   ✅ organizations         (5 records)
//   ✅ project_contracts     (25 records)
//   ✅ timesheet_periods     (25 records)
//   ...
```

---

## How to Execute Migrations

### **Method 1: Supabase Dashboard (Recommended)** ⭐

**Step 1: Open SQL Editor**
1. Go to https://supabase.com/dashboard
2. Select your WorkGraph project
3. Click "SQL Editor" in sidebar
4. Click "+ New query"

**Step 2: Run Schema Migration**
1. Open `/supabase/migrations/001_timesheet_approval_tables.sql`
2. Copy entire file contents
3. Paste into SQL editor
4. Click "Run" (Ctrl/Cmd + Enter)
5. Wait 5-10 seconds
6. Verify: Should see "✅ All 8 tables created successfully!"

**Step 3: Run Seed Data**
1. Open `/supabase/migrations/002_seed_demo_data.sql`
2. Copy entire file contents
3. Paste into SQL editor
4. Click "Run"
5. Wait 3-5 seconds
6. Verify: Should see counts (Orgs: 5, Contracts: 25, Periods: 25)

**Step 4: Verify in Table Editor**
1. Click "Table Editor" in sidebar
2. You should see 8 new tables
3. Click `organizations` → should see 5 rows
4. Click `project_contracts` → should see 25 rows
5. Click `timesheet_periods` → should see 25 rows

### **Method 2: Supabase CLI**

```bash
# Login (if not already)
supabase login

# Link project
supabase link --project-ref YOUR_PROJECT_REF

# Run migrations
supabase db execute --file supabase/migrations/001_timesheet_approval_tables.sql
supabase db execute --file supabase/migrations/002_seed_demo_data.sql
```

### **Method 3: Direct PostgreSQL**

```bash
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" \
  -f supabase/migrations/001_timesheet_approval_tables.sql \
  -f supabase/migrations/002_seed_demo_data.sql
```

---

## Verification Checklist

After running migrations, verify:

### ✅ **1. Tables Exist**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'organizations',
    'project_contracts',
    'timesheet_periods',
    'timesheet_entries',
    'approval_history',
    'attachments',
    'review_flags',
    'allocated_tasks'
  )
ORDER BY table_name;
```
**Expected:** 8 rows

### ✅ **2. Data Seeded**
```sql
SELECT 
  'organizations' as table_name, COUNT(*) as count FROM organizations
UNION ALL
  SELECT 'project_contracts', COUNT(*) FROM project_contracts
UNION ALL
  SELECT 'timesheet_periods', COUNT(*) FROM timesheet_periods
UNION ALL
  SELECT 'timesheet_entries', COUNT(*) FROM timesheet_entries
UNION ALL
  SELECT 'approval_history', COUNT(*) FROM approval_history
UNION ALL
  SELECT 'attachments', COUNT(*) FROM attachments
UNION ALL
  SELECT 'review_flags', COUNT(*) FROM review_flags
UNION ALL
  SELECT 'allocated_tasks', COUNT(*) FROM allocated_tasks;
```
**Expected:** 
- organizations: 5
- project_contracts: 25
- timesheet_periods: 25
- timesheet_entries: 10
- approval_history: 16+
- attachments: 4
- review_flags: 1
- allocated_tasks: 3

### ✅ **3. Status Distribution**
```sql
SELECT 
  status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) as percentage
FROM timesheet_periods
GROUP BY status
ORDER BY count DESC;
```
**Expected:**
- pending: 15 (60%)
- approved: 8 (32%)
- rejected: 2 (8%)

### ✅ **4. Triggers Working**
```sql
-- Insert a new entry
INSERT INTO timesheet_entries (period_id, date, hours, task_description, billable)
VALUES ('period-acme-1-w1', '2025-01-13', 8.0, 'Testing trigger', true);

-- Check if total updated (should be 48.0, was 40.0)
SELECT total_hours FROM timesheet_periods WHERE id = 'period-acme-1-w1';

-- Cleanup
DELETE FROM timesheet_entries 
WHERE period_id = 'period-acme-1-w1' AND date = '2025-01-13';
```
**Expected:** total_hours increases by 8.0, then returns to 40.0 after delete

### ✅ **5. Views Working**
```sql
SELECT * FROM v_periods_full WHERE status = 'pending' LIMIT 5;
```
**Expected:** 5 rows with full contract and org context

### ✅ **6. Sample Data Query**
```sql
SELECT 
  o.name as organization,
  pc.user_name as contractor,
  tp.week_start_date,
  tp.total_hours,
  tp.status
FROM timesheet_periods tp
JOIN project_contracts pc ON tp.contract_id = pc.id
JOIN organizations o ON pc.organization_id = o.id
WHERE o.name = 'Acme Dev Studio'
ORDER BY pc.user_name
LIMIT 5;
```
**Expected:** 5 Acme contractors with their periods

---

## Database Schema Diagram

```
organizations (5)
    ↓ (organization_id)
project_contracts (25)
    ↓ (contract_id)
timesheet_periods (25) ─┬─→ approval_history (16+)
    ↓ (period_id)       ├─→ attachments (4)
timesheet_entries (10)  ├─→ review_flags (1)
                        └─→ allocated_tasks (3)
```

---

## Row Level Security (RLS) Status

### ⚠️ **IMPORTANT: RLS Policies Need Customization**

The migration includes **placeholder policies** that allow all authenticated users to read data. This is **for testing only**.

### Current Policies (Placeholder)
```sql
-- TOO PERMISSIVE - Replace before production!
CREATE POLICY "Allow authenticated users to read organizations"
  ON organizations FOR SELECT TO authenticated USING (true);
```

### TODO: Update RLS Policies

**Before moving to production:**

1. **Identify your auth system**
   - Using Supabase Auth with `auth.uid()`?
   - Custom JWT tokens?
   - How do you map `user_id` in contracts to authenticated users?

2. **Implement proper policies**
   ```sql
   -- Example: Contractors see only their own timesheets
   CREATE POLICY "Contractors read own periods"
     ON timesheet_periods FOR SELECT
     USING (
       contract_id IN (
         SELECT id FROM project_contracts 
         WHERE user_id = auth.uid()::text
       )
     );
   
   -- Example: Managers see team timesheets
   CREATE POLICY "Managers read team periods"
     ON timesheet_periods FOR SELECT
     USING (
       contract_id IN (
         SELECT pc.id FROM project_contracts pc
         JOIN organizations o ON pc.organization_id = o.id
         JOIN user_roles ur ON ur.organization_id = o.id
         WHERE ur.user_id = auth.uid() AND ur.role IN ('manager', 'owner')
       )
     );
   ```

3. **Add INSERT/UPDATE/DELETE policies**
   - Contractors can INSERT/UPDATE own entries
   - Managers can UPDATE approval status
   - Finance can generate invoices
   - Admins have full access

### RLS Testing

After updating policies, test with:
```sql
-- Supabase SQL Editor supports JWT claims simulation
SET request.jwt.claims ->> 'sub' = 'user-sarah';

-- Should only see Sarah's data
SELECT * FROM project_contracts;
SELECT * FROM timesheet_periods;

-- Reset
RESET request.jwt.claims;
```

---

## Next Steps

### Immediate Actions

1. **✅ Execute Migrations**
   - Run `001_timesheet_approval_tables.sql` in Supabase Dashboard
   - Run `002_seed_demo_data.sql`
   - Verify all checks pass (see Verification Checklist above)

2. **✅ Test Connection from Frontend**
   - Add temporary button in `ApprovalsV2Tab.tsx`:
   ```typescript
   import { printSetupStatus } from '@/utils/api/supabase-setup-check';
   
   // In component:
   <Button onClick={() => printSetupStatus()}>
     Test Supabase Connection
   </Button>
   ```
   - Click button, check browser console
   - Should see "✅ All checks passed!"

3. **⚠️ Review RLS Policies**
   - Decide on authentication strategy
   - Plan role-based access control
   - Update policies in next migration file

### Phase 2 Preparation

Once Phase 1 is verified:

1. **Read Phase 2 Guide**
   - `/docs/OPTION_A_IMPLEMENTATION_CHECKLIST.md` → Phase 2
   - Understand API layer structure

2. **Plan API Functions**
   - `fetchOrganizations()`
   - `fetchContractsByOrganization()`
   - `fetchPeriodsByContract()`
   - `approveTimesheet()`
   - `rejectTimesheet()`
   - `bulkApprove()`

3. **Plan React Hooks**
   - `useOrganizations()`
   - `useContracts(organizationId)`
   - `usePeriods(contractId)`
   - `useApproveTimesheet()` (mutation)
   - `useRejectTimesheet()` (mutation)

---

## Rollback Procedure

If something goes wrong:

### Option 1: Drop All Tables
```sql
DROP TABLE IF EXISTS 
  allocated_tasks,
  review_flags,
  attachments,
  approval_history,
  timesheet_entries,
  timesheet_periods,
  project_contracts,
  organizations
CASCADE;

DROP VIEW IF EXISTS v_contracts_with_orgs, v_periods_full CASCADE;
DROP FUNCTION IF EXISTS calculate_period_totals, update_period_totals, 
  update_updated_at_column CASCADE;
```

Then re-run both migrations.

### Option 2: Truncate Data Only
```sql
TRUNCATE TABLE allocated_tasks, review_flags, attachments, 
  approval_history, timesheet_entries, timesheet_periods, 
  project_contracts, organizations CASCADE;
```

Then re-run seed data migration (`002_seed_demo_data.sql`).

---

## Troubleshooting

### Issue: "permission denied for table organizations"

**Cause:** RLS is blocking your query  
**Solution:**
1. Run query in Supabase Dashboard SQL Editor (uses service role, bypasses RLS)
2. Or temporarily disable RLS:
   ```sql
   ALTER TABLE organizations DISABLE ROW LEVEL SECURITY;
   ```

### Issue: "relation 'organizations' already exists"

**Cause:** Migration was run previously  
**Solution:**
1. Check if tables have data you want to keep
2. If yes: Skip schema migration, just run seed data
3. If no: Drop tables (see Rollback above), re-run migration

### Issue: Total hours not auto-updating

**Cause:** Trigger failed to create or was dropped  
**Solution:**
```sql
-- Check if trigger exists
SELECT tgname FROM pg_trigger WHERE tgname = 'trigger_update_period_totals';

-- If missing, re-create:
-- (Copy trigger creation section from 001_timesheet_approval_tables.sql)
```

### Issue: Foreign key constraint violation when seeding

**Cause:** Seed data inserted in wrong order  
**Solution:**
- Ensure organizations are inserted before contracts
- Ensure contracts are inserted before periods
- Ensure periods are inserted before entries/history/etc.

The seed file (`002_seed_demo_data.sql`) already has correct order.

---

## Files Created in Phase 1

```
/supabase/migrations/
├── 001_timesheet_approval_tables.sql  ← Schema (850+ lines)
├── 002_seed_demo_data.sql             ← Seed data (450+ lines)
└── README.md                          ← Migration guide

/utils/api/
└── supabase-setup-check.ts            ← Verification utility

/docs/
└── PHASE_1_DATABASE_SETUP_COMPLETE.md ← This file
```

---

## Success Criteria

Phase 1 is complete when:

- [x] ✅ Migration files created
- [x] ✅ Seed data prepared
- [x] ✅ Verification utilities ready
- [x] ✅ Documentation complete
- [ ] 🔜 Migrations executed in Supabase
- [ ] 🔜 All verification checks pass
- [ ] 🔜 Test connection from frontend succeeds
- [ ] 🔜 RLS policies reviewed and planned

---

## Summary

**What's Ready:**
- ✅ Complete SQL schema (8 tables, triggers, views)
- ✅ Production-quality seed data (25 contractors)
- ✅ Step-by-step migration instructions
- ✅ Verification queries and utilities
- ✅ Rollback procedures

**What's Next:**
1. Execute migrations in Supabase Dashboard (5 minutes)
2. Verify all checks pass (2 minutes)
3. Test connection from frontend (1 minute)
4. Move to Phase 2: API Layer (4-6 hours)

**Time to Execute Phase 1:** ~10 minutes  
**Time to Verify:** ~5 minutes  
**Total Phase 1:** ~15 minutes

---

**🎯 Ready to execute! Open Supabase Dashboard and run the migrations.**

**Next Document:** `/docs/OPTION_A_IMPLEMENTATION_CHECKLIST.md` → Phase 2
