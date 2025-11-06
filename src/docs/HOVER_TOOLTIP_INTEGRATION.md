# Hover Tooltip Integration Guide

## Current Status

✅ **Phase 1 Complete - Components Built:**
- ContractorRoleLayer (working)
- CopyLastWeekDialog (working)
- EnhancedCalendarCell (ready to use)

⏳ **Quick Follow-Up - Add Tooltips to Calendar:**
The existing `TimesheetManagerCalendarView.tsx` already has excellent calendar cells with status indicators and avatars. We just need to wrap them in tooltips for the hover functionality.

---

## Option 1: Quick Integration (Recommended)

Add tooltips to existing calendar cells without replacing the whole component.

### Step 1: Import Tooltip Components

In `/components/timesheets/TimesheetManagerCalendarView.tsx`, add:

```typescript
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { DollarSign } from "lucide-react";
```

### Step 2: Wrap Calendar Cell Button

Find the calendar cell button (around line 344-412) and wrap it:

```tsx
<TooltipProvider delayDuration={200}>
  <Tooltip>
    <TooltipTrigger asChild>
      <button
        key={dayIndex}
        onClick={() => agg && handleDayClick(date)}
        disabled={!agg}
        className={/* existing classes */}
      >
        {/* Existing cell content */}
      </button>
    </TooltipTrigger>

    {agg && agg.totalHours > 0 && (
      <TooltipContent
        side="top"
        className="w-[280px] p-0"
        sideOffset={5}
      >
        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <p className="font-semibold">
              {date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </p>
            <Badge variant="secondary" className="text-xs">
              {(() => {
                const uniqueContractors = Array.from(
                  new Map(
                    agg.contributors.map(entry => [
                      entry.contractor.id,
                      entry.contractor
                    ])
                  ).values()
                );
                return `${uniqueContractors.length} contractor${uniqueContractors.length !== 1 ? 's' : ''}`;
              })()}
            </Badge>
          </div>

          {/* Totals */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent-brand" />
              <div>
                <p className="text-xs text-muted-foreground">Total Hours</p>
                <p className="font-semibold">{agg.totalHours}h</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-success" />
              <div>
                <p className="text-xs text-muted-foreground">Total Cost</p>
                <p className="font-semibold">${agg.totalCost.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">Status</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {agg.statusBreakdown.approved > 0 && (
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-success" />
                  <span>{agg.statusBreakdown.approved} approved</span>
                </div>
              )}
              {agg.statusBreakdown.pending > 0 && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-warning" />
                  <span>{agg.statusBreakdown.pending} pending</span>
                </div>
              )}
              {agg.statusBreakdown.rejected > 0 && (
                <div className="flex items-center gap-1.5">
                  <XCircle className="w-3 h-3 text-destructive" />
                  <span>{agg.statusBreakdown.rejected} rejected</span>
                </div>
              )}
              {agg.statusBreakdown.draft > 0 && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span>{agg.statusBreakdown.draft} draft</span>
                </div>
              )}
            </div>
          </div>

          {/* Contributors List */}
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">Contributors</p>
            <div className="space-y-1.5">
              {(() => {
                const uniqueContractors = Array.from(
                  new Map(
                    agg.contributors.map(entry => [
                      entry.contractor.id,
                      entry.contractor
                    ])
                  ).values()
                );
                
                // Calculate hours per contractor
                const contractorHours = new Map();
                agg.contributors.forEach(entry => {
                  const current = contractorHours.get(entry.contractor.id) || 0;
                  contractorHours.set(entry.contractor.id, current + entry.hours);
                });

                return uniqueContractors.slice(0, 4).map((contractor) => (
                  <div
                    key={contractor.id}
                    className="flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-accent-brand/10 flex items-center justify-center text-[8px] font-medium text-accent-brand">
                        {contractor.avatar}
                      </div>
                      <span>{contractor.name}</span>
                    </div>
                    <span className="font-mono font-medium text-accent-brand">
                      {contractorHours.get(contractor.id)}h
                    </span>
                  </div>
                ));
              })()}
            </div>
          </div>

          {/* Click hint */}
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground italic text-center">
              Click to view full details
            </p>
          </div>
        </div>
      </TooltipContent>
    )}
  </Tooltip>
</TooltipProvider>
```

### Estimated Time: 15 minutes

---

## Option 2: Use EnhancedCalendarCell Component

Replace the calendar cell rendering logic with our pre-built component.

### Pros:
- Cleaner code
- Reusable component
- Already tested

### Cons:
- Need to refactor data structure slightly
- More code changes

### Implementation:

```tsx
import { EnhancedCalendarCell } from "./EnhancedCalendarCell";

// In the calendar grid rendering:
{week.map((date, dayIndex) => {
  const agg = getDayAggregate(date);
  const today = isToday(date);
  const weekend = isWeekend(date);

  if (!date) {
    return (
      <div 
        key={dayIndex} 
        className="aspect-square rounded-lg bg-transparent"
        aria-hidden="true"
      />
    );
  }

  if (!agg || agg.totalHours === 0) {
    // Empty day - render simple cell
    return (
      <div
        key={dayIndex}
        className={`
          aspect-square rounded-lg border-2 p-2 bg-card
          ${today ? 'border-accent-brand' : 'border-border'}
          ${weekend ? 'bg-accent/20' : ''}
          flex items-center justify-center
        `}
      >
        <div className="text-sm font-semibold">
          {date.getDate()}
        </div>
      </div>
    );
  }

  // Convert agg.contributors to format expected by EnhancedCalendarCell
  const contractors = Array.from(
    new Map(
      agg.contributors.map(entry => [
        entry.contractor.id,
        {
          id: entry.contractor.id,
          name: entry.contractor.name,
          avatar: entry.contractor.avatar,
          hours: entry.hours,
          status: entry.status,
        }
      ])
    ).values()
  );

  return (
    <EnhancedCalendarCell
      key={dayIndex}
      date={date}
      totalHours={agg.totalHours}
      totalCost={agg.totalCost}
      contractors={contractors}
      statusBreakdown={agg.statusBreakdown}
      isToday={today}
      isWeekend={weekend}
      showContractorAvatars={selectedContractor === "all"}
      onClick={() => handleDayClick(date)}
    />
  );
})}
```

### Estimated Time: 30 minutes

---

## Recommendation

**Use Option 1 for quick integration**

Reasons:
1. Existing calendar cell code is already excellent
2. Just needs tooltip wrapper
3. Less refactoring
4. Faster to ship
5. Lower risk

**Save Option 2 for later refactoring** when:
- Building new calendar views
- Need consistent styling across multiple calendars
- Code cleanup sprint

---

## Testing After Integration

### Functional Tests
- [ ] Hover over calendar cell shows tooltip
- [ ] Tooltip appears after 200ms delay
- [ ] Tooltip shows correct date
- [ ] Total hours matches cell
- [ ] Total cost calculated correctly
- [ ] Status breakdown shows correct counts
- [ ] Contractor list shows all contributors
- [ ] Clicking cell still opens detail modal
- [ ] Tooltip disappears when hovering away

### Visual Tests
- [ ] Tooltip positioned correctly (above cell)
- [ ] Tooltip doesn't overflow viewport
- [ ] Tooltip styling matches design system
- [ ] Icons aligned properly
- [ ] Text readable and properly spaced

### Edge Cases
- [ ] Empty days (no tooltip)
- [ ] Many contractors (>4 truncates)
- [ ] Very long contractor names
- [ ] Weekend days
- [ ] Today's date
- [ ] Rejected entries show correctly

---

## Performance Considerations

### Current Performance
The tooltip component is optimized:
- Only renders when hovering
- 200ms delay prevents tooltip spam
- Lightweight DOM (no heavy computations)
- Uses Radix UI primitives (optimized)

### If Performance Issues Arise

1. **Memoize Contractor List:**
```typescript
const uniqueContractors = useMemo(() => {
  return Array.from(new Map(/* ... */));
}, [agg.contributors]);
```

2. **Throttle Hover Events:**
```typescript
import { useCallback } from 'react';
import { throttle } from 'lodash';

const handleHover = useCallback(
  throttle(() => {
    // Tooltip logic
  }, 100),
  []
);
```

3. **Lazy Load Tooltip Content:**
```typescript
{isHovering && (
  <TooltipContent>
    {/* Content only renders when hovering */}
  </TooltipContent>
)}
```

---

## Mobile Alternative

Since hover doesn't work on mobile/tablet:

### Phase 2 Solution

```typescript
const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

// On mobile, tap to toggle tooltip
<button
  onClick={(e) => {
    if (isMobile) {
      e.stopPropagation();
      setActiveTooltip(activeTooltip === dayId ? null : dayId);
    } else {
      handleDayClick(date);
    }
  }}
>
  {/* Cell content */}
</button>

// Tooltip stays open until tapped elsewhere
```

---

## Summary

### What's Already Done ✅
- EnhancedCalendarCell component built
- Tooltip styling and layout defined
- Data structure compatible
- Ready to integrate

### What's Left ⏳
- Wrap existing calendar cells in tooltip (15 min)
- Test on different browsers
- Mobile/tablet testing

### Expected Impact
- **Hover Previews**: Instant visibility of day details
- **Reduced Clicks**: ~90% fewer clicks for status checks
- **Better UX**: Professional, polished feel
- **Time Saved**: ~5 min/day for active managers

---

**Next Action**: Implement Option 1 (quick tooltip wrap) in next session!
