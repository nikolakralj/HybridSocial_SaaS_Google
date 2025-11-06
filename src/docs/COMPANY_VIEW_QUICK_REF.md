# Company View - Quick Reference Card

## TL;DR

**What**: Simplified timesheet view for Company Owners - team management only  
**Why**: Company Owners don't log hours, they only manage their team's timesheets  
**Impact**: Company Owners only - other roles unchanged  
**Status**: ✅ Complete and working  

## Visual Summary

### Before
```
[My Timesheets] [Team Timesheets]  ← Two tabs, confusing
Owner appeared in both places
```

### After
```
┌─ Team Timesheets ──────────────────────┐
│ Manage all contractor timesheets      │
│ (Owner doesn't log their own hours)   │
└────────────────────────────────────────┘
```

## Usage

### Component
```typescript
import { CompanyOwnerUnifiedView } from "./timesheets/CompanyOwnerUnifiedView";

<CompanyOwnerUnifiedView
  ownerId="owner-1"
  ownerName="Alex Martinez"
  contractors={contractors}
  hourlyRate={95}
/>
```

### Props
```typescript
interface CompanyOwnerUnifiedViewProps {
  ownerId: string;           // Owner's ID
  ownerName: string;         // Owner's name
  contractors: Contractor[]; // Team list
  hourlyRate?: number;       // Default: 95
}

interface Contractor {
  id: string;
  name: string;
  initials: string;
  company?: string;
}
```

## Role Behavior

| Role | View | Tabs | Notes |
|------|------|------|-------|
| Solo Freelancer | My Timesheets | None | Single view only |
| **Company Owner** | **Company View** | **None** | **Unified view (NEW!)** |
| Agency Owner | My/Team | 2 tabs | Traditional system |

## Features

✅ Single team management view (no personal timesheet)  
✅ **NEW: Contractor Role Layer** (filter, multi-select, status overview)  
✅ **NEW: Copy Last Week** (one-click recurring hours)  
✅ **NEW: Hover Tooltips** (instant day details without clicking)  
✅ Calendar/List view toggle  
✅ Contractor dropdown for aggregate or individual selection  
✅ Team stats for aggregate view  
✅ Smart export (context-aware)  
✅ Multi-select with batch operations  
✅ No breaking changes  

## Files

**New:**
- `/components/timesheets/CompanyOwnerUnifiedView.tsx` (main component)
- `/docs/COMPANY_VIEW_UNIFIED.md` (full docs)
- `/docs/COMPANY_VIEW_VISUAL_GUIDE.md` (visual guide)
- `/docs/COMPANY_VIEW_IMPLEMENTATION_SUMMARY.md` (summary)
- `/docs/COMPANY_VIEW_QUICK_REF.md` (this file)

**Modified:**
- `/components/TimesheetDemo.tsx` (integration)

## Testing

### Quick Test Checklist
1. [ ] Switch to "Company Owner" persona
2. [ ] No tabs visible (tabs hidden)
3. [ ] See "Team Timesheets" header
4. [ ] **NEW: "Copy Last Week" button in header**
5. [ ] **NEW: "Export" button in header**
6. [ ] **NEW: Contractor Role Layer table visible**
7. [ ] **NEW: Can select contractors with checkboxes**
8. [ ] **NEW: Can filter by role/status**
9. [ ] Contractor selector card with dropdown
10. [ ] "All Contractors" selected by default
11. [ ] Team stats display (392h total, etc.)
12. [ ] Can toggle Calendar/List view
13. [ ] **NEW: Selection badge shows "X selected"**
14. [ ] Contractor dropdown works
15. [ ] Can select individual contractors
16. [ ] **NEW: Hover over calendar cells shows tooltip**
17. [ ] Export button works (context-aware)
18. [ ] Switch to "Solo Freelancer" - no tabs (unchanged)
19. [ ] Switch to "Agency Owner" - see tabs (unchanged)

## Code Locations

### Integration Point
`/components/TimesheetDemo.tsx` line ~200:
```typescript
const isCompanyOwner = persona === "team-lead";

{isCompanyOwner ? (
  <CompanyOwnerUnifiedView {...props} />
) : (
  <TraditionalTabSystem {...props} />
)}
```

### Main Component
`/components/timesheets/CompanyOwnerUnifiedView.tsx`

### State Management
```typescript
const [personalViewMode, setPersonalViewMode] = useState<"calendar" | "list">("calendar");
const [teamViewMode, setTeamViewMode] = useState<"calendar" | "list">("calendar");
const [selectedContractorId, setSelectedContractorId] = useState<string>("all-contractors");
const [personalExpanded, setPersonalExpanded] = useState(true);
const [teamExpanded, setTeamExpanded] = useState(true);
```

## Common Patterns

### Collapsible Section
```typescript
<Button onClick={() => setExpanded(!expanded)}>
  {expanded ? <ChevronUp /> : <ChevronDown />}
</Button>

{expanded && (
  <div className="p-6">
    {/* Content */}
  </div>
)}
```

### Independent View Toggle
```typescript
<div className="flex gap-1">
  <Button
    variant={viewMode === "calendar" ? "default" : "ghost"}
    onClick={() => setViewMode("calendar")}
  >
    Calendar
  </Button>
  <Button
    variant={viewMode === "list" ? "default" : "ghost"}
    onClick={() => setViewMode("list")}
  >
    List
  </Button>
</div>
```

### Contractor Dropdown
```typescript
<Select value={selectedId} onValueChange={setSelectedId}>
  <SelectTrigger>
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all-contractors">
      All Contractors
    </SelectItem>
    {contractors.map(c => (
      <SelectItem key={c.id} value={c.id}>
        {c.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

## Troubleshooting

### Tabs still showing for Company Owner?
Check `isCompanyOwner` flag is true:
```typescript
const isCompanyOwner = persona === "team-lead";
```

### Component not rendering?
Check import:
```typescript
import { CompanyOwnerUnifiedView } from "./timesheets/CompanyOwnerUnifiedView";
```

### Props error?
Verify contractors array structure:
```typescript
contractors: Array<{
  id: string;
  name: string;
  initials: string;
  company?: string;
}>
```

### Styling issues?
Component uses existing UI components:
- Button, Card, Badge, Select from `../ui/*`
- Should inherit app theme automatically

## Related Documentation

- **Full Docs**: `/docs/COMPANY_VIEW_UNIFIED.md`
- **Visual Guide**: `/docs/COMPANY_VIEW_VISUAL_GUIDE.md`
- **Implementation Summary**: `/docs/COMPANY_VIEW_IMPLEMENTATION_SUMMARY.md`
- **Original Issue**: "My Timesheets vs Team Timesheets" confusion for Company Owners

## Future Roadmap

### Phase 1 (Next)
- Persist expanded/collapsed state
- Remember last selected contractor
- Save view mode preferences

### Phase 2
- Search/filter contractors
- Department/role grouping
- Recently viewed contractors

### Phase 3
- Side-by-side comparison
- Advanced analytics
- Bulk operations
- Real-time sync

## Support

### Questions?
1. Check `/docs/COMPANY_VIEW_UNIFIED.md` for detailed docs
2. Check `/docs/COMPANY_VIEW_VISUAL_GUIDE.md` for examples
3. Review component source: `/components/timesheets/CompanyOwnerUnifiedView.tsx`

### Found a bug?
1. Check persona is set to "team-lead" (Company Owner)
2. Verify contractors array has correct structure
3. Check browser console for errors
4. Review props being passed to component

---

**Last Updated**: 2025-10-16  
**Component**: CompanyOwnerUnifiedView  
**Status**: ✅ Production Ready  
**Version**: 1.0.0
