# Permission Matrix Implementation Guide

## Overview

This document explains how to implement the complete permission and visibility matrix from your specification, ensuring proper field-level security across all party types.

---

## 📊 The Permission Matrix (Reference)

Based on your provided matrix:

| Object / Field              | Contractor | Company       | Agency            | Client             |
|-----------------------------|------------|---------------|-------------------|--------------------|
| **Timesheet (own)**         | E/V/A      | V/A           | V/A               | V/A                |
| **Timesheet (others)**      | –          | V/A (their)   | V/A (their)       | V/A (aggregate)    |
| **Expense (own)**           | E/V/A      | V/A           | V/A               | V/A                |
| **Contract: rates**         | V (own)    | V             | **Hidden**        | Aggregated/Optional|
| **Contract: terms (non-rate)**| V (own)  | V             | Limited summary   | Limited summary    |
| **Budget / PO remaining**   | –          | V             | V (alloc only)    | V                  |
| **Invoice line detail**     | –          | V             | V (if they bill)  | V (if billed)      |
| **Deliverable acceptance**  | –          | V/A           | V/A               | A (final)          |
| **Audit trail**             | V (own)    | V (project)   | V (project)       | V (project)        |

**Legend**: E=edit, V=view, A=approve, **Hidden**=field-level masking

---

## 🏗️ Architecture

### 3-Layer Security Model

```
┌─────────────────────────────────────────┐
│  Layer 1: Row-Level Security (RLS)     │ ← Database enforces who can see WHICH rows
├─────────────────────────────────────────┤
│  Layer 2: Field-Level Masking          │ ← API enforces who can see WHICH fields
├─────────────────────────────────────────┤
│  Layer 3: Action Permissions           │ ← UI enforces who can DO what actions
└─────────────────────────────────────────┘
```

**Critical Rule**: Security MUST be enforced at Layers 1 & 2 (backend). Layer 3 is UX only.

---

## 🔐 Layer 1: Row-Level Security (RLS)

### Database Setup

```sql
-- Enable RLS on all tables
ALTER TABLE timesheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Helper function: Get user's allowed parties
CREATE OR REPLACE FUNCTION current_user_parties()
RETURNS SETOF UUID AS $$
  SELECT party_id 
  FROM user_party_memberships
  WHERE user_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function: Get user's allowed projects
CREATE OR REPLACE FUNCTION current_user_projects()
RETURNS SETOF UUID AS $$
  SELECT DISTINCT pp.project_id
  FROM project_parties pp
  WHERE pp.party_id IN (SELECT current_user_parties())
$$ LANGUAGE sql SECURITY DEFINER;
```

### RLS Policies by Object

#### Timesheets (Own)

```sql
-- Contractors: Can view/edit their own timesheets
CREATE POLICY "Contractors manage own timesheets"
ON timesheets
FOR ALL
USING (
  user_id = auth.uid() 
  AND project_id IN (SELECT current_user_projects())
)
WITH CHECK (
  user_id = auth.uid()
  AND project_id IN (SELECT current_user_projects())
);
```

#### Timesheets (Others)

```sql
-- Company/Agency: Can view timesheets for their contractors
CREATE POLICY "Approvers view contractor timesheets"
ON timesheets
FOR SELECT
USING (
  -- User is an approver in a party that can see this timesheet
  EXISTS (
    SELECT 1 FROM project_parties pp
    JOIN user_party_memberships upm ON pp.party_id = upm.party_id
    WHERE pp.project_id = timesheets.project_id
    AND upm.user_id = auth.uid()
    AND pp.can_approve = true
  )
  -- AND the contractor belongs to a party we supervise
  AND contractor_party_id IN (
    SELECT supervised_party_id 
    FROM party_relationships
    WHERE supervisor_party_id IN (SELECT current_user_parties())
  )
);
```

#### Contracts

```sql
-- View own contract (Contractor)
CREATE POLICY "View own contract"
ON contracts
FOR SELECT
USING (
  user_id = auth.uid()
);

-- View all contracts in project (Company)
CREATE POLICY "Company views all contracts"
ON contracts
FOR SELECT
USING (
  project_id IN (
    SELECT pp.project_id 
    FROM project_parties pp
    WHERE pp.party_id IN (SELECT current_user_parties())
    AND pp.party_type = 'company'
  )
);
```

#### Expenses

```sql
-- Similar to timesheets
CREATE POLICY "Manage own expenses"
ON expenses
FOR ALL
USING (
  user_id = auth.uid()
  AND project_id IN (SELECT current_user_projects())
);
```

---

## 🎭 Layer 2: Field-Level Masking

### API Middleware

```typescript
// /utils/api/visibility-enforcement.ts

import type { AccessContext, VisibilityRule } from '../../types/workgraph';

/**
 * Apply visibility rules to mask sensitive fields
 */
export function applyVisibilityRules<T extends Record<string, any>>(
  data: T,
  viewer: AccessContext,
  rules: VisibilityRule[]
): T {
  // Clone data to avoid mutation
  const sanitized = { ...data };
  
  // Find rules applicable to this viewer
  const applicableRules = rules.filter(rule => 
    rule.policy.hiddenFrom.some(partyId => 
      viewer.parties.some(p => p.partyId === partyId)
    )
  );
  
  // Apply masking
  for (const rule of applicableRules) {
    const field = rule.scope.field;
    
    if (field in sanitized) {
      switch (rule.policy.action) {
        case 'MASK':
          sanitized[field] = rule.policy.maskWith || '•••';
          break;
        case 'HIDE':
          delete sanitized[field];
          break;
        case 'AGGREGATE':
          // If array, show only count/sum
          if (Array.isArray(sanitized[field])) {
            sanitized[field] = { 
              aggregated: true,
              count: sanitized[field].length 
            };
          }
          break;
      }
    }
  }
  
  return sanitized;
}

/**
 * Bulk apply to array of objects
 */
export function applyVisibilityRulesToArray<T extends Record<string, any>>(
  data: T[],
  viewer: AccessContext,
  rules: VisibilityRule[]
): T[] {
  return data.map(item => applyVisibilityRules(item, viewer, rules));
}
```

### Usage in API Routes

```typescript
// /supabase/functions/server/index.tsx

import { applyVisibilityRules } from './visibility-enforcement.ts';

app.get('/make-server-f8b491be/timesheets/:id', async (c) => {
  // 1. Fetch data (RLS already applied by Postgres)
  const { data: timesheet } = await supabase
    .from('timesheets')
    .select('*, contract(*)')
    .eq('id', c.req.param('id'))
    .single();
  
  if (!timesheet) {
    return c.json({ error: 'Not found' }, 404);
  }
  
  // 2. Get viewer context
  const viewer = await getViewerContext(c);
  
  // 3. Load visibility rules for this project
  const { data: project } = await supabase
    .from('project_configs')
    .select('visibility_rules')
    .eq('project_id', timesheet.project_id)
    .single();
  
  const visibilityRules = project?.visibility_rules || [];
  
  // 4. Apply field-level masking
  const sanitized = applyVisibilityRules(timesheet, viewer, visibilityRules);
  
  // 5. Log audit event
  await logAuditEvent({
    userId: viewer.userId,
    action: 'viewed_timesheet',
    resourceType: 'timesheet',
    resourceId: timesheet.id,
    details: { maskedFields: getMaskedFields(timesheet, sanitized) },
  });
  
  return c.json(sanitized);
});
```

### Example: Contract Rate Masking

```typescript
// When Agency requests a contract
const contract = {
  id: '123',
  contractorName: 'Sarah Johnson',
  contractType: 'hourly',
  hourlyRate: 150,        // ← Should be masked
  startDate: '2024-01-01',
  status: 'active',
};

const viewer = {
  userId: 'user-456',
  parties: [{ partyId: 'agency-789', partyType: 'agency', roles: ['Approver'] }],
};

const rules: VisibilityRule[] = [{
  scope: { objectType: 'contract', field: 'hourlyRate' },
  policy: {
    action: 'MASK',
    hiddenFrom: ['agency-789'],
    maskWith: '•••',
  },
}];

const sanitized = applyVisibilityRules(contract, viewer, rules);

console.log(sanitized);
// Output:
// {
//   id: '123',
//   contractorName: 'Sarah Johnson',
//   contractType: 'hourly',
//   hourlyRate: '•••',  ← Masked!
//   startDate: '2024-01-01',
//   status: 'active',
// }
```

---

## ✅ Layer 3: Action Permissions (UI)

### Permission Check Hook

```typescript
// /utils/hooks/usePermissions.ts

import { useContext } from 'react';
import { AccessContext } from '../contexts/AccessContext';

export function usePermissions(objectType: string, objectId?: string) {
  const accessContext = useContext(AccessContext);
  
  const can = (action: 'view' | 'edit' | 'approve' | 'delete') => {
    // Check effective permissions from access context
    return accessContext.effectivePermissions.some(perm => {
      if (perm.objectType !== objectType) return false;
      if (perm.objectId && perm.objectId !== objectId) return false;
      return perm.permissions.includes(action);
    });
  };
  
  const canViewField = (field: string) => {
    // Check if field is masked by visibility rules
    // This is a READ-ONLY check for UI purposes
    // Backend MUST enforce the actual masking
    return !accessContext.maskedFields.includes(`${objectType}.${field}`);
  };
  
  return { can, canViewField };
}
```

### Usage in Components

```typescript
// /components/timesheets/TimesheetDetail.tsx

import { usePermissions } from '../../utils/hooks/usePermissions';

export function TimesheetDetail({ timesheet }: { timesheet: any }) {
  const { can, canViewField } = usePermissions('timesheet', timesheet.id);
  
  return (
    <div>
      <h2>Timesheet {timesheet.id}</h2>
      
      {/* Always show hours (everyone can view) */}
      <div>Hours: {timesheet.hours}</div>
      
      {/* Conditionally show rate (agency can't see) */}
      {canViewField('hourlyRate') ? (
        <div>Rate: ${timesheet.hourlyRate}/hr</div>
      ) : (
        <div>Rate: •••</div>
      )}
      
      {/* Conditionally show approve button */}
      {can('approve') && (
        <Button onClick={handleApprove}>Approve</Button>
      )}
      
      {/* Conditionally show edit button */}
      {can('edit') && (
        <Button onClick={handleEdit}>Edit</Button>
      )}
    </div>
  );
}
```

---

## 🧪 Testing Strategy

### 1. RLS Tests

```sql
-- Test as contractor
SET request.jwt.claim.sub = 'contractor-user-id';

-- Should see own timesheet
SELECT * FROM timesheets WHERE id = 'my-timesheet-id';  -- ✅ Returns 1 row

-- Should NOT see other contractor's timesheet
SELECT * FROM timesheets WHERE id = 'other-timesheet-id';  -- ✅ Returns 0 rows

-- Test as company
SET request.jwt.claim.sub = 'company-user-id';

-- Should see all contractor timesheets for their project
SELECT * FROM timesheets WHERE project_id = 'project-123';  -- ✅ Returns N rows
```

### 2. Field Masking Tests

```typescript
// /tests/visibility-enforcement.test.ts

describe('Field-Level Masking', () => {
  it('should mask hourlyRate from agency', () => {
    const contract = { 
      id: '1', 
      contractorName: 'Sarah', 
      hourlyRate: 150 
    };
    
    const viewer = { 
      parties: [{ partyId: 'agency-1', partyType: 'agency' }] 
    };
    
    const rules: VisibilityRule[] = [{
      scope: { objectType: 'contract', field: 'hourlyRate' },
      policy: { action: 'MASK', hiddenFrom: ['agency-1'], maskWith: '•••' },
    }];
    
    const result = applyVisibilityRules(contract, viewer, rules);
    
    expect(result.hourlyRate).toBe('•••');
  });
  
  it('should NOT mask hourlyRate from company', () => {
    const contract = { 
      id: '1', 
      contractorName: 'Sarah', 
      hourlyRate: 150 
    };
    
    const viewer = { 
      parties: [{ partyId: 'company-1', partyType: 'company' }] 
    };
    
    const rules: VisibilityRule[] = [{
      scope: { objectType: 'contract', field: 'hourlyRate' },
      policy: { action: 'MASK', hiddenFrom: ['agency-1'], maskWith: '•••' },
    }];
    
    const result = applyVisibilityRules(contract, viewer, rules);
    
    expect(result.hourlyRate).toBe(150);  // Not masked!
  });
});
```

### 3. Integration Tests

```typescript
// /tests/api/timesheets.integration.test.ts

describe('Timesheet API', () => {
  it('should return masked rate to agency viewer', async () => {
    // Setup: Create project with agency party
    // Setup: Create timesheet with rate
    
    // Login as agency user
    const agencyToken = await loginAs('agency-user@example.com');
    
    // Fetch timesheet
    const response = await fetch(`/api/timesheets/123`, {
      headers: { Authorization: `Bearer ${agencyToken}` },
    });
    
    const timesheet = await response.json();
    
    // Verify rate is masked
    expect(timesheet.hourlyRate).toBe('•••');
  });
  
  it('should return actual rate to company viewer', async () => {
    const companyToken = await loginAs('company-user@example.com');
    
    const response = await fetch(`/api/timesheets/123`, {
      headers: { Authorization: `Bearer ${companyToken}` },
    });
    
    const timesheet = await response.json();
    
    // Verify rate is visible
    expect(timesheet.hourlyRate).toBe(150);
  });
});
```

---

## 🚨 Security Audit Checklist

Before going to production:

### RLS Verification

- [ ] All tables have RLS enabled
- [ ] No `USING (true)` policies (these bypass security)
- [ ] Policies tested with `SET ROLE` commands
- [ ] Service role key NOT exposed to frontend
- [ ] Anon key used for frontend (has limited permissions)

### Field Masking Verification

- [ ] Masking applied in backend (not just frontend)
- [ ] Direct database queries respect masking
- [ ] API exports (CSV, PDF) respect masking
- [ ] Websocket updates respect masking
- [ ] GraphQL queries respect masking (if using)

### Bypass Attempt Tests

- [ ] Try to fetch timesheet with wrong user token → 403
- [ ] Try to edit RLS policy as regular user → Denied
- [ ] Try to query `contracts` table directly → Only see allowed rows
- [ ] Try to inject SQL in filters → Sanitized
- [ ] Try to access API with expired token → 401

### Audit Logging Verification

- [ ] All view actions logged (who viewed what when)
- [ ] All edit actions logged (who changed what field)
- [ ] All approve actions logged (who approved, delegated?)
- [ ] Logs immutable (no UPDATE/DELETE allowed)
- [ ] Logs retained for 7 years (compliance)

---

## 📖 Advanced Scenarios

### Scenario 1: Conditional Visibility

**Requirement**: Agency can see rate IF they're the prime contractor (not subcontractor).

**Solution**: Add conditions to visibility rule:

```typescript
const rule: VisibilityRule = {
  scope: { objectType: 'contract', field: 'hourlyRate' },
  policy: {
    action: 'MASK',
    hiddenFrom: ['agency-1'],
    maskWith: '•••',
  },
  conditions: [
    {
      field: 'relationship_type',
      operator: 'eq',
      value: 'subcontractor',  // Only mask if subcontractor
    },
  ],
};
```

### Scenario 2: Time-Based Access

**Requirement**: Client can't see rates until after contract is signed.

**Solution**: Add temporal condition:

```typescript
const rule: VisibilityRule = {
  scope: { objectType: 'contract', field: 'hourlyRate' },
  policy: {
    action: 'MASK',
    hiddenFrom: ['client-1'],
  },
  conditions: [
    {
      field: 'signed_at',
      operator: 'is_null',
      value: true,  // Mask if not yet signed
    },
  ],
};
```

### Scenario 3: Aggregate-Only View

**Requirement**: Client sees total invoice amount but not line-item breakdown.

**Solution**: Use AGGREGATE action:

```typescript
const rule: VisibilityRule = {
  scope: { objectType: 'invoice', field: 'line_items' },
  policy: {
    action: 'AGGREGATE',
    hiddenFrom: ['client-1'],
    aggregateAs: 'total_only',
  },
};

// Result:
// Before: { line_items: [{rate: 150, hours: 40}, {rate: 125, hours: 35}] }
// After:  { line_items: { total: 10375, count: 2 } }
```

---

## 🎓 Best Practices

### 1. Deny by Default

```typescript
// ❌ BAD: Allow by default
if (canViewRate) return rate;
else return '•••';

// ✅ GOOD: Deny by default
if (isExplicitlyAllowed) return rate;
return '•••';
```

### 2. Server-Side Enforcement

```typescript
// ❌ BAD: Client-side masking
<div>{canViewRate ? rate : '•••'}</div>

// ✅ GOOD: Server masks before sending
const sanitized = applyVisibilityRules(data, viewer, rules);
return sanitized;  // Rate already masked if not allowed
```

### 3. Audit Everything Sensitive

```typescript
// ❌ BAD: No audit for rate views
return contract;

// ✅ GOOD: Log who viewed rate
await logAuditEvent({ action: 'viewed_rate', resourceId: contract.id });
return contract;
```

### 4. Fail Closed

```typescript
// ❌ BAD: On error, show data
try {
  checkPermission();
} catch {
  return data;  // Dangerous!
}

// ✅ GOOD: On error, deny access
try {
  checkPermission();
  return data;
} catch {
  return { error: 'Access denied' };
}
```

---

## 📞 Need Help?

### Common Issues

**"I can see data I shouldn't see"**
→ RLS not enabled or policy too permissive

**"Field masking not working"**
→ Check if backend applying rules before sending response

**"Performance slow with many rules"**
→ Cache compiled visibility rules per project

**"Audit log too large"**
→ Partition by month, archive old data

### Debugging

```typescript
// Add debug flag to see what's being masked
const sanitized = applyVisibilityRules(data, viewer, rules, { debug: true });
console.log('Masked fields:', sanitized.__debug__.maskedFields);
```

---

**Next Steps**: Implement RLS policies, then field masking, then action permissions. Test thoroughly before going live!
