# Why The Drawer Shows Different Data Each Time

## The Problem You're Seeing

When you click on Sarah Johnson multiple times, you see **different timesheet entries** each time:

**First click:**
- 14 days with entries
- 112.0 hours total
- Different tasks on different days

**Second click:**
- 12 days with entries  
- 96.0 hours total
- Completely different tasks

## Why This Happens

### 1. Database is Empty

The system tries to fetch data from the database:

```javascript
const entries = await fetchEntriesByUserAndDateRange(
  'user-sarah-johnson',
  '2025-10-01',
  '2025-10-31'
);

console.log(`✅ Fetched ${entries.length} entries`);
// Result: Fetched 0 entries ❌
```

Since the database returns **0 entries**, it throws an error and falls back to demo data.

### 2. Demo Data Uses `Math.random()`

Look at the demo data generator (`demo-data-multi-party.ts` line 408):

```typescript
// ❌ This creates RANDOM data every time!
const dailyHours = contract?.contractType === 'daily' 
  ? undefined 
  : 6 + Math.random() * 3;  // Random hours between 6-9

// ❌ Random number of working days
const daysToWork = 3 + Math.floor(Math.random() * 3); // Random 3-5 days

// ❌ Random task descriptions
const task = tasks[Math.floor(Math.random() * tasks.length)];
```

Every time you open the drawer, `Math.random()` generates **new random numbers**, so you get **different data**.

### 3. What You See In Console

Check your browser console when you click Sarah Johnson:

```
🔵 Attempting to fetch REAL entries from database...
🔵 User ID: user-sarah-johnson
🔵 Date range: 2025-10-01 to 2025-10-31
✅ SUCCESS! Fetched 0 REAL entries from database for Sarah Johnson
📊 Entries: []
⚠️⚠️⚠️ DATABASE RETURNED 0 ENTRIES - FALLING BACK TO DEMO DATA ⚠️⚠️⚠️
This means the timesheet_entries table is EMPTY for this user.
❌ Failed to fetch entries from database: Error: No entries in database, using demo data
⚠️⚠️⚠️ FALLING BACK TO DEMO DATA - DATA WILL BE RANDOM ⚠️⚠️⚠️
🎲 Demo data uses Math.random() so entries will be different each time!
```

## Visual Warning Added

I just added a yellow warning banner in the drawer that appears when using demo data:

```
⚠️ DEMO DATA - Data will change each time you open this drawer
Database is empty. To see real data, update TimesheetCalendarView to save to database.
```

This banner will **only appear when using demo data**. Once you have real data in the database, it will disappear.

## The Root Cause

You have **two disconnected systems**:

```
┌─────────────────────────┐      ┌─────────────────────────┐
│ Timesheet Calendar      │      │  Approval Drawer        │
│ (Left Side)             │      │  (Right Side)           │
│                         │      │                         │
│ Uses: useState          │  ✘   │  Uses: Database Query   │
│ Data: Local memory      │      │  Data: Empty DB → Demo  │
│ Saves: Nowhere          │      │  Result: Random data    │
└─────────────────────────┘      └─────────────────────────┘
```

## How To Fix

You have 2 options:

### Option A: Quick Test - Manually Add Data to Database

1. Open Supabase Dashboard
2. Go to Table Editor → `timesheet_entries`
3. Manually insert a few rows:
   - `user_id`: 'user-sarah-johnson'
   - `date`: '2025-10-07'
   - `hours`: 8
   - `task_description`: 'Backend development'
   - `status`: 'draft'
4. Reload page and open drawer

**Result:** You'll see the SAME data every time (no more random changes)

### Option B: Production Fix - Update Calendar to Save to Database

Update `/components/timesheets/TimesheetCalendarView.tsx` to use the database hooks I created.

See `/components/timesheets/approval-v2/HOW_TO_COMPLETE_INTEGRATION.md` for step-by-step instructions.

**Result:** Calendar and drawer will share the same database, perfectly synchronized.

## What Should Happen (With Real Data)

Once you add real data to the database, the console will show:

```
✅ SUCCESS! Fetched 5 REAL entries from database for Sarah Johnson
📊 Entries: [
  { date: '2025-10-07', hours: 8, taskDescription: 'Backend development', ... },
  { date: '2025-10-08', hours: 7.5, taskDescription: 'Testing', ... },
  ...
]
📊 Period 2025-10-07 to 2025-10-13 has 3 entries
✅ Drawer opened with REAL DATA from database!
```

And the drawer will show:
- **Same data every time** ✅
- **Actual hours logged** ✅
- **Real task descriptions** ✅
- **No random changes** ✅
- **No yellow warning banner** ✅

## Summary

| Current State | With Real Data |
|---------------|----------------|
| ❌ Different data each click | ✅ Same data every time |
| ❌ Random entries | ✅ Actual entries from calendar |
| ❌ Demo data fallback | ✅ Real database data |
| ⚠️ Yellow warning banner | ✅ No warning banner |
| 🎲 Math.random() generates data | ✅ Database stores data |

The infrastructure is **ready and working**. You just need to populate the database with real data!
