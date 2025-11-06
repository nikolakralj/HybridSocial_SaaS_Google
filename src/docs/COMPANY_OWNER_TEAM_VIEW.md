# Company Owner Team View

## Overview

Company Owners have a simplified timesheet interface focused solely on **managing their team's timesheets**. Unlike contractors who log their own hours, Company Owners are in a pure management role and do not track billable time themselves.

## The Problem Solved

**Before**: Company Owners saw two confusing tabs:
- "My Timesheets" - implied they should log hours
- "Team Timesheets" - their actual role

This created confusion about whether owners should be logging hours or just managing the team.

**After**: Company Owners see a single, clear interface:
- **Team Timesheets** - manage all contractor timesheets (no personal timesheet section)

## Role-Based Views

### Solo Freelancer
- Single "My Timesheets" view
- Logs their own hours
- No team to manage

### Company Owner ✨ (NEW)
- Single "Team Timesheets" view
- **Does NOT log personal hours**
- Manages team contractor timesheets only
- Can view aggregate or individual contractor data

### Agency Owner
- Dual tabs: "My Timesheets" + "Team Timesheets"
- Logs own hours AND manages multiple vendor companies
- Traditional separation maintained

## Features

### Contractor Selection
- **All Contractors**: Shows aggregate team calendar with drag-drop
- **Individual Selection**: Shows specific contractor's timesheet for approval

### View Modes
- **Calendar View**: Visual monthly/weekly calendar with entries
- **List View**: Tabular list of timesheet entries

### Team Statistics (Aggregate View)
- Total Logged: 392h
- Approved: 280h  
- Pending: 72h
- Draft: 32h

### Actions
- Export individual or all contractor timesheets
- Approve/reject timesheet entries
- Bulk operations (when in aggregate view)

## Component Architecture

```
CompanyOwnerUnifiedView
├─ Header: "Team Timesheets"
├─ Contractor Selector Card
│  ├─ Dropdown (All Contractors / Individual)
│  └─ Team Stats (if aggregate view)
├─ Controls Bar
│  ├─ View Toggle (Calendar / List)
│  └─ Export Button
└─ Timesheet Content
   ├─ TeamAggregateCalendar (if "All Contractors")
   └─ TimesheetCalendarView (if individual contractor)
```

## Usage

```typescript
import { CompanyOwnerUnifiedView } from "./timesheets/CompanyOwnerUnifiedView";

<CompanyOwnerUnifiedView
  ownerId="owner-1"              // Owner's ID (for context)
  ownerName="Alex Martinez"      // Owner's name (for context)
  contractors={contractors}      // List of team contractors
  hourlyRate={95}               // Default rate
/>
```

### Props Interface

```typescript
interface CompanyOwnerUnifiedViewProps {
  ownerId: string;           // Company owner's user ID
  ownerName: string;         // Company owner's display name
  contractors: Contractor[]; // List of contractors to manage
  hourlyRate?: number;       // Default hourly rate (optional, default: 95)
}

interface Contractor {
  id: string;
  name: string;
  initials: string;
  company?: string;
}
```

## Integration

### TimesheetDemo.tsx

```typescript
const isCompanyOwner = persona === "team-lead";

{isCompanyOwner ? (
  // Company Owner: Team management only, no personal timesheet
  <CompanyOwnerUnifiedView
    ownerId={ownerId}
    ownerName={config.currentUserName}
    contractors={contractors}
    hourlyRate={95}
  />
) : (
  // Other roles: Traditional tab system
  <>
    {/* Header card with tabs (if applicable) */}
    {/* My Timesheets or Team Timesheets content */}
  </>
)}
```

## Key Differences from Other Roles

| Feature | Solo Freelancer | Company Owner | Agency Owner |
|---------|----------------|---------------|--------------|
| **Personal Timesheet** | ✅ Yes | ❌ No | ✅ Yes |
| **Team View** | ❌ No | ✅ Yes | ✅ Yes |
| **Tabs** | None | None | 2 tabs |
| **Role** | Worker | Manager | Manager + Worker |
| **Logs Hours** | Yes | No | Yes |
| **Manages Team** | No | Yes | Yes |

## Visual Layout

```
┌─────────────────────────────────────────────────────────┐
│ Team Timesheets                                         │
│ Manage and review timesheets for all 3 contractors     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 👥 Viewing Timesheet                                    │
│ [All Contractors ▼]                                     │
├─────────────────────────────────────────────────────────┤
│ Total: 392h | Approved: 280h | Pending: 72h | Draft: 32h│
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ [Calendar] [List]                    [Export All ⬇]    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                                                         │
│ [Team Aggregate Calendar / Individual Timesheet]       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Workflow Examples

### Scenario 1: Review Team Hours for the Week
1. Company Owner logs in
2. Sees "Team Timesheets" (no tabs)
3. "All Contractors" selected by default
4. Reviews aggregate calendar showing all team members
5. Sees team stats at a glance
6. Exports team report

### Scenario 2: Approve Individual Contractor
1. In Team Timesheets view
2. Select "Sarah Chen" from contractor dropdown
3. View Sarah's individual timesheet
4. Review entries for accuracy
5. Approve or request changes
6. Export Sarah's timesheet

### Scenario 3: Bulk Operations
1. View "All Contractors" aggregate
2. Use drag-drop to copy hours across team
3. Set bulk hours for specific dates
4. Review team-wide patterns
5. Approve multiple timesheets

## Benefits

### ✅ Clear Role Definition
- Company Owners are managers, not workers
- No confusion about whether to log personal hours
- Focused on team oversight

### ✅ Simplified Interface
- Single view instead of confusing dual tabs
- No "My Timesheets" tab that doesn't apply
- Immediate access to team data

### ✅ Efficient Workflow
- No tab switching
- Direct access to aggregate or individual views
- Quick contractor selection

### ✅ Scalable Design
- Works with 2-100+ contractors
- Dropdown can be enhanced with search
- Stats provide quick team overview

## Technical Details

### State Management

```typescript
const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
const [selectedContractorId, setSelectedContractorId] = useState<string>("all-contractors");
```

### Conditional Rendering

```typescript
{isAggregateView ? (
  // Show team aggregate view
  <TimesheetManagerCalendarView selectedContractor={selectedContractorId} />
) : (
  // Show individual contractor view
  <TimesheetCalendarView
    contractorName={selectedContractor?.name}
    mode="manager"
    userRole="company-owner"
  />
)}
```

## Future Enhancements

### Phase 1: Enhanced Filtering
- [ ] Search contractors by name
- [ ] Filter by approval status
- [ ] Department/role grouping

### Phase 2: Advanced Analytics
- [ ] Team productivity trends
- [ ] Budget vs actual tracking
- [ ] Utilization charts

### Phase 3: Bulk Operations
- [ ] Batch approve multiple timesheets
- [ ] Bulk hour adjustments
- [ ] Team-wide announcements

## Testing Checklist

- [ ] Switch to "Company Owner" persona
- [ ] Verify no tabs are shown
- [ ] See "Team Timesheets" header
- [ ] Contractor dropdown shows all team members
- [ ] "All Contractors" selected by default
- [ ] Team stats display correctly (392h, 280h, etc.)
- [ ] Can switch between Calendar/List view
- [ ] Can select individual contractors
- [ ] Export button works
- [ ] Aggregate view shows team calendar
- [ ] Individual view shows contractor's timesheet
- [ ] No personal timesheet section visible
- [ ] Other personas (Solo, Agency) still work correctly

## Migration Notes

### For Users
- **Company Owners**: You'll no longer see "My Timesheets" tab
- **Reason**: Company Owners manage teams but don't bill hours themselves
- **Impact**: Cleaner, more focused interface for your role

### For Developers
- Component: `/components/timesheets/CompanyOwnerUnifiedView.tsx`
- Integration: `/components/TimesheetDemo.tsx` (conditional rendering)
- No breaking changes to other roles
- Reuses existing timesheet components

## Support

### Common Questions

**Q: Why can't Company Owners log their own hours?**  
A: Company Owners are in a management role. They oversee contractors who bill hours, but owners typically don't bill their own time to projects.

**Q: What if a Company Owner also does billable work?**  
A: They would need a separate contractor record in the system, similar to how an Agency Owner might also be a contractor on specific projects.

**Q: Can Company Owners see rate information?**  
A: Yes, Company Owners see internal costs and billable rates for their contractors (rate visibility is role-based).

**Q: What about Agency Owners?**  
A: Agency Owners keep the dual-tab system because they both manage teams AND log their own hours.

---

**Component**: CompanyOwnerUnifiedView  
**Status**: ✅ Production Ready  
**Last Updated**: 2025-10-16  
**Version**: 2.0.0 (Removed personal timesheet section)
