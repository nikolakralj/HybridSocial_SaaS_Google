# Timesheet Components

This directory contains all timesheet-related components for WorkGraph's multi-tenant timesheet management system.

## Overview

WorkGraph's timesheet system supports:
- **Individual contractors** (log own hours)
- **Team leads** (manage contractor teams)
- **Company owners** (team management only)
- **Agency owners** (manage vendor companies)

## Component Architecture

### Core Views

**CompanyOwnerUnifiedView.tsx** (Main component for company owners)
- Single team management view
- No personal timesheet section
- Integrates all Phase 1 enhancements
- Used by: Company owners only

**TimesheetDemo.tsx** (Demo harness)
- Shows all role variants
- Persona switcher
- Testing interface

### Phase 1 Enhancement Components (NEW)

**ContractorRoleLayer.tsx** ⭐
- Data-rich contractor table
- Multi-select with checkboxes
- Filter by role and status
- Visual status badges
- Monthly hour totals
- Used in: Aggregate team view

**CopyLastWeekDialog.tsx** ⭐
- One-click recurring hour entry
- Date range auto-calculation
- Multi-contractor selection
- Preview and confirmation
- Used in: Company owner view

**EnhancedCalendarCell.tsx** ⭐
- Rich hover tooltips
- Total hours + cost display
- Status breakdown
- Contributor list
- Ready to integrate (see /docs/HOVER_TOOLTIP_INTEGRATION.md)

### Calendar Views

**TimesheetManagerCalendarView.tsx**
- Team aggregate calendar
- Multi-contractor visualization
- Day drill-down modal
- Batch approval
- Drag-drop support
- Used by: Managers

**TimesheetCalendarView.tsx**
- Individual contractor calendar
- Monthly/weekly views
- Add/edit entries
- Status indicators
- Used by: Contractors + managers

**TeamAggregateCalendar.tsx**
- Simplified aggregate view
- Drag-drop hour copying
- Team statistics
- Used by: Managers

### List Views

**TimesheetManagerListView.tsx**
- Tabular team view
- Sorting and filtering
- Batch operations
- Export functionality
- Used by: Managers

**TimesheetListView.tsx**
- Individual contractor list
- Entry details
- Add/edit entries
- Used by: Contractors + managers

### Entry Modals

**EnhancedDayEntryModal.tsx** (Recommended)
- Full-featured entry dialog
- Multi-task support
- Time range picker
- Contract selection
- Notes and attachments
- Used by: All roles

**AdaptiveDayEntryModal.tsx**
- Role-aware entry modal
- Configurable fields
- Validation
- Used by: All roles

**DayEntryModal.tsx** (Legacy)
- Basic entry dialog
- Single task per entry
- Still in use for backward compatibility

### Supporting Components

**BatchApprovalBar.tsx**
- Multi-select approval interface
- Bulk approve/reject
- Selection management
- Used by: Managers

**BulkTimesheetEntry.tsx**
- Batch hour entry
- Apply to multiple days
- Template support
- Used by: Contractors

**ContractorTimesheetBrowser.tsx**
- Browse team timesheets
- Navigation and filtering
- Used by: Managers

**IndividualTimesheet.tsx**
- Single contractor timesheet wrapper
- Month navigation
- Summary statistics
- Used by: All roles

**TimesheetModule.tsx**
- Modular timesheet interface
- Configurable views
- Used by: Various contexts

**UnifiedTimesheetView.tsx**
- Consolidated timesheet interface
- Multiple view modes
- Used by: Various contexts

---

## Component Selection Guide

### For Company Owners
```typescript
import { CompanyOwnerUnifiedView } from "./timesheets/CompanyOwnerUnifiedView";

<CompanyOwnerUnifiedView
  ownerId="owner-1"
  ownerName="Alex Martinez"
  contractors={contractors}
  hourlyRate={95}
/>
```

**Features:**
- Contractor Role Layer with filters
- Copy Last Week functionality
- Smart export
- Calendar/List toggle
- Multi-select batch operations

---

### For Solo Freelancers
```typescript
import { TimesheetCalendarView } from "./timesheets/TimesheetCalendarView";

<TimesheetCalendarView
  contractorName="Sarah Chen"
  hourlyRate={120}
  mode="contractor"
  userRole="freelancer"
/>
```

**Features:**
- Personal timesheet only
- Add/edit own entries
- Month navigation
- Export functionality

---

### For Agency Owners
```typescript
// Use tabs for dual view
{activeTab === "my-timesheets" ? (
  <TimesheetCalendarView
    contractorName="Agency Owner"
    hourlyRate={150}
    mode="contractor"
    userRole="agency-owner"
  />
) : (
  <TimesheetManagerCalendarView
    selectedContractor="all"
  />
)}
```

**Features:**
- Own timesheet + team management
- Dual-tab interface
- Full manager capabilities

---

## Props Interfaces

### CompanyOwnerUnifiedView

```typescript
interface CompanyOwnerUnifiedViewProps {
  ownerId: string;           // Owner's ID
  ownerName: string;         // Owner's display name
  contractors: Contractor[]; // List of contractors to manage
  hourlyRate?: number;       // Default hourly rate (optional)
}

interface Contractor {
  id: string;
  name: string;
  initials: string;
  company?: string;
}
```

### ContractorRoleLayer

```typescript
interface ContractorRoleLayerProps {
  contractors: ContractorData[];
  selectedContractorIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
  onFilterByRole?: (role: string) => void;
  onFilterByStatus?: (status: string) => void;
}

interface ContractorData {
  id: string;
  name: string;
  initials: string;
  role: string;
  defaultHours: number;
  status: "approved" | "pending" | "rejected" | "draft";
  totalHours?: number;
  approvedHours?: number;
  pendingHours?: number;
}
```

### CopyLastWeekDialog

```typescript
interface CopyLastWeekDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contractors: Array<{
    id: string;
    name: string;
    initials: string;
  }>;
  onConfirm: (selectedContractorIds: string[], targetWeekStart: Date) => void;
}
```

### EnhancedCalendarCell

```typescript
interface EnhancedCalendarCellProps {
  date: Date;
  totalHours: number;
  totalCost: number;
  contractors: ContractorEntry[];
  statusBreakdown: {
    approved: number;
    pending: number;
    rejected: number;
    draft: number;
  };
  isToday?: boolean;
  isWeekend?: boolean;
  showContractorAvatars?: boolean;
  onClick?: () => void;
}

interface ContractorEntry {
  id: string;
  name: string;
  avatar: string;
  hours: number;
  status: "draft" | "submitted" | "approved" | "rejected";
}
```

---

## State Management

### Multi-Select Pattern

```typescript
// In parent component
const [selectedContractorIds, setSelectedContractorIds] = useState<Set<string>>(new Set());

// Pass to ContractorRoleLayer
<ContractorRoleLayer
  contractors={contractors}
  selectedContractorIds={selectedContractorIds}
  onSelectionChange={setSelectedContractorIds}
/>

// Use for batch operations
const selectedCount = selectedContractorIds.size;
const selectedContractors = contractors.filter(c => 
  selectedContractorIds.has(c.id)
);
```

### Dialog Pattern

```typescript
const [showDialog, setShowDialog] = useState(false);

<Button onClick={() => setShowDialog(true)}>
  Copy Last Week
</Button>

<CopyLastWeekDialog
  open={showDialog}
  onOpenChange={setShowDialog}
  contractors={contractors}
  onConfirm={(contractorIds, weekStart) => {
    // Handle copy logic
    console.log("Copy for:", contractorIds, "to week:", weekStart);
    setShowDialog(false);
  }}
/>
```

---

## Common Patterns

### Role-Based Rendering

```typescript
const isCompanyOwner = persona === "team-lead";
const isSoloFreelancer = persona === "freelancer";
const isAgencyOwner = persona === "agency-owner";

{isCompanyOwner && (
  <CompanyOwnerUnifiedView {...props} />
)}

{isSoloFreelancer && (
  <TimesheetCalendarView {...props} />
)}

{isAgencyOwner && (
  <TabsInterface>
    <MyTimesheets />
    <TeamTimesheets />
  </TabsInterface>
)}
```

### Conditional Feature Display

```typescript
// Show Role Layer only in aggregate view
{isAggregateView && (
  <ContractorRoleLayer {...props} />
)}

// Show selection badge only when contractors selected
{selectedContractorIds.size > 0 && (
  <Badge>
    {selectedContractorIds.size} selected
  </Badge>
)}
```

---

## Testing

### Component Tests

```typescript
// ContractorRoleLayer
test("selects contractor on checkbox click", () => {
  const onSelectionChange = jest.fn();
  render(<ContractorRoleLayer {...props} onSelectionChange={onSelectionChange} />);
  
  fireEvent.click(screen.getByRole("checkbox", { name: /sarah chen/i }));
  
  expect(onSelectionChange).toHaveBeenCalledWith(new Set(["c1"]));
});

// CopyLastWeekDialog
test("copies selected contractors", async () => {
  const onConfirm = jest.fn();
  render(<CopyLastWeekDialog {...props} onConfirm={onConfirm} />);
  
  fireEvent.click(screen.getByText("Copy Hours"));
  
  expect(onConfirm).toHaveBeenCalledWith(
    ["c1", "c2", "c3"],
    expect.any(Date)
  );
});
```

### Integration Tests

```typescript
test("company owner workflow", () => {
  render(<CompanyOwnerUnifiedView {...props} />);
  
  // Select contractors
  fireEvent.click(screen.getByLabelText("Sarah Chen"));
  fireEvent.click(screen.getByLabelText("Ian Mitchell"));
  
  // See selection state
  expect(screen.getByText("2 selected")).toBeInTheDocument();
  
  // Copy last week
  fireEvent.click(screen.getByText("Copy Last Week"));
  fireEvent.click(screen.getByText("Copy Hours for 2 Contractors"));
  
  // Verify toast
  expect(screen.getByText(/copied last week/i)).toBeInTheDocument();
});
```

---

## Performance Optimization

### Memoization

```typescript
// Memoize expensive calculations
const contractorData = useMemo(() => {
  return contractors.map(c => ({
    ...c,
    role: getRoleFromAPI(c.id),
    totalHours: calculateHours(c.id),
  }));
}, [contractors]);

// Memoize callbacks
const handleSelectionChange = useCallback((ids: Set<string>) => {
  setSelectedContractorIds(ids);
  // Other logic...
}, []);
```

### Lazy Loading

```typescript
// Lazy load dialogs
const CopyLastWeekDialog = lazy(() => import("./CopyLastWeekDialog"));

// Render only when needed
{showDialog && (
  <Suspense fallback={<Loading />}>
    <CopyLastWeekDialog {...props} />
  </Suspense>
)}
```

### Virtual Scrolling (for large teams)

```typescript
// Use react-window for 100+ contractors
import { FixedSizeList } from "react-window";

<FixedSizeList
  height={400}
  itemCount={contractors.length}
  itemSize={60}
>
  {({ index, style }) => (
    <ContractorRow 
      style={style} 
      contractor={contractors[index]} 
    />
  )}
</FixedSizeList>
```

---

## Accessibility

All components follow WCAG 2.1 AA standards:

- ✅ Keyboard navigation
- ✅ ARIA labels
- ✅ Focus management
- ✅ Screen reader support
- ✅ Semantic HTML
- ✅ Color contrast (4.5:1 minimum)

### Example ARIA Usage

```tsx
<button
  aria-label={`Select ${contractor.name}`}
  aria-pressed={isSelected}
  onClick={handleToggle}
>
  <Checkbox checked={isSelected} />
</button>

<div
  role="tooltip"
  aria-live="polite"
  aria-atomic="true"
>
  {/* Tooltip content */}
</div>
```

---

## Migration Guide

### From Old to New Company Owner View

**Old (Pre-Phase 1):**
```typescript
<CompanyOwnerUnifiedView
  ownerId="owner-1"
  ownerName="Alex"
  contractors={contractors}
/>
// Had personal timesheet section
// No contractor role layer
// No copy last week
```

**New (Phase 1):**
```typescript
<CompanyOwnerUnifiedView
  ownerId="owner-1"
  ownerName="Alex"
  contractors={contractors}
/>
// Personal timesheet removed
// Contractor role layer added
// Copy last week added
// Multi-select added
// Smart export added
```

**No breaking changes** - same props interface!

---

## Future Enhancements

### Phase 2 (Planned)
- Multi-select days (Shift+click)
- Keyboard shortcuts (Ctrl+C/V)
- Batch edit modal
- Mobile-friendly tooltips (tap-to-toggle)

### Phase 3 (Future)
- Full drag-drop between days
- Template system (save/load patterns)
- Right-click context menus
- Advanced filtering

### Not Planned for MVP
- AI auto-fill
- Contract auto-sync
- Advanced analytics dashboard

---

## Documentation

- **Phase 1 Implementation**: `/docs/PHASE_1_TEAM_VIEW_ENHANCEMENTS.md`
- **Visual Showcase**: `/docs/PHASE_1_VISUAL_SHOWCASE.md`
- **Before/After**: `/docs/TEAM_VIEW_BEFORE_AFTER.md`
- **Integration Guide**: `/docs/HOVER_TOOLTIP_INTEGRATION.md`
- **User Interface**: `/docs/COMPANY_OWNER_INTERFACE.md`
- **Quick Reference**: `/docs/COMPANY_VIEW_QUICK_REF.md`

---

## Support

For questions or issues:
1. Check documentation in `/docs/`
2. Review component props and examples above
3. See TimesheetDemo.tsx for working examples
4. Contact development team

---

**Last Updated**: 2025-10-16  
**Phase**: 1.0 Complete  
**Status**: Production Ready ✅
