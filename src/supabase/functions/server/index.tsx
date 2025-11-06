import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2";

// Force rebuild - 2025-01-23-v3
const app = new Hono();

// Create Supabase client for auth
const getSupabaseClient = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );
};

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-f8b491be/health", (c) => {
  return c.json({ status: "ok" });
});

// ============================================================
// AUTHENTICATION ENDPOINTS
// ============================================================

// Sign up new user
app.post("/make-server-f8b491be/auth/signup", async (c) => {
  try {
    const { email, password, name, role } = await c.req.json();
    
    const supabase = getSupabaseClient();
    
    // Create user in Supabase Auth
    // Automatically confirm email since email server hasn't been configured
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role },
      email_confirm: true,
    });
    
    if (authError) {
      console.log(`Auth error during signup: ${authError.message}`);
      return c.json({ error: authError.message }, 400);
    }
    
    // Store user profile in KV store
    await kv.set(`user:${authData.user.id}`, {
      id: authData.user.id,
      email,
      name,
      role,
      createdAt: new Date().toISOString(),
    });
    
    return c.json({ 
      user: authData.user,
      message: 'User created successfully' 
    });
  } catch (error) {
    console.log(`Error in signup: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// ============================================================
// TIMESHEET ENDPOINTS
// ============================================================

// Get timesheet entries for a user/company in a date range
app.get("/make-server-f8b491be/timesheets", async (c) => {
  try {
    const userId = c.req.query('userId');
    const companyId = c.req.query('companyId');
    const startDate = c.req.query('startDate'); // YYYY-MM-DD
    const endDate = c.req.query('endDate'); // YYYY-MM-DD
    
    console.log('📥 GET /timesheets - Query params:', { userId, companyId, startDate, endDate });
    
    // ✅ ALLOW FETCHING ALL ENTRIES when no filters provided (for building org structure)
    // This is needed for the approval system to discover all organizations and contracts
    
    let entries;
    
    if (userId) {
      // Get entries for specific user
      entries = await kv.getByPrefix(`timesheet:${userId}:`);
      console.log(`📊 Found ${entries.length} entries for user ${userId}`);
      
      // ✅ Also filter by companyId if provided
      if (companyId) {
        entries = entries.filter((entry: any) => entry.companyId === companyId);
        console.log(`📊 After filtering by companyId ${companyId}: ${entries.length} entries`);
      }
    } else if (companyId) {
      // Get entries for all users in company
      entries = await kv.getByPrefix(`timesheet:`);
      console.log(`📊 Found ${entries.length} total timesheet entries in KV store`);
      // Filter to only entries matching the companyId
      entries = entries.filter((entry: any) => entry.companyId === companyId);
      console.log(`📊 After filtering by companyId ${companyId}: ${entries.length} entries`);
    } else {
      // ✅ NEW: No filters - return ALL entries (for discovery/organization building)
      entries = await kv.getByPrefix(`timesheet:`);
      console.log(`📊 Found ${entries.length} total timesheet entries (no filters)`);
    }
    
    // Normalize old format entries (userId:date) to new format (userId:date:taskId)
    const normalizedEntries = entries.map((entry: any) => {
      // Check if entry has taskId
      if (!entry.taskId) {
        // Old format entry - add default taskId
        return {
          ...entry,
          taskId: 'task-1',
          id: `${entry.userId}:${entry.date}:task-1`
        };
      }
      return entry;
    });
    
    // Filter by date range if provided
    let filteredEntries = normalizedEntries;
    if (startDate || endDate) {
      filteredEntries = normalizedEntries.filter((entry: any) => {
        const entryDate = entry.date;
        if (startDate && entryDate < startDate) return false;
        if (endDate && entryDate > endDate) return false;
        return true;
      });
    }
    
    console.log('🔍 SERVER GET: Returning entries sample:', {
      count: filteredEntries.length,
      firstEntry: filteredEntries[0],
      firstEntryTaskDescription: filteredEntries[0]?.taskDescription,
    });
    
    return c.json({ entries: filteredEntries });
  } catch (error) {
    console.log(`Error fetching timesheets: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// Create/Update timesheet entry
app.post("/make-server-f8b491be/timesheets", async (c) => {
  try {
    const { userId, companyId, date, hours, status, projectId, notes, taskId, startTime, endTime, breakMinutes, workType, taskCategory, taskDescription, billable } = await c.req.json();
    
    console.log('🔍 SERVER: Received timesheet POST:', {
      userId,
      companyId,
      date,
      hours,
      status,
      workType,
      taskCategory,
      taskDescription,
      billable,
      startTime,
      endTime,
      breakMinutes,
    });
    
    if (!userId || !companyId || !date || hours === undefined) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    // Support multi-task entries: if taskId provided, use it; otherwise generate unique ID
    const uniqueTaskId = taskId || `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const entryId = `${userId}:${date}:${uniqueTaskId}`;
    
    const entry = {
      id: entryId,
      userId,
      companyId,
      date,
      hours,
      status: status || 'draft',
      projectId: projectId || null,
      notes: notes || '',
      taskId: uniqueTaskId,
      // ✅ Include time tracking fields
      startTime: startTime || null,
      endTime: endTime || null,
      breakMinutes: breakMinutes || 0,
      // ✅ Include task category, description and work type
      workType: workType || 'regular',
      taskCategory: taskCategory || 'Development',
      taskDescription: taskDescription || '',
      billable: billable !== undefined ? billable : true,
      updatedAt: new Date().toISOString(),
    };
    
    console.log('💾 SERVER: Saving entry to database:', entry);
    
    // Store with multi-task key (userId:date:taskId allows multiple entries per day)
    await kv.set(`timesheet:${userId}:${date}:${uniqueTaskId}`, entry);
    
    return c.json({ entry });
  } catch (error) {
    console.log(`Error creating timesheet: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// Bulk create/update timesheet entries (for drag-copy operations)
app.post("/make-server-f8b491be/timesheets/bulk", async (c) => {
  try {
    const { entries } = await c.req.json();
    
    if (!Array.isArray(entries) || entries.length === 0) {
      return c.json({ error: 'entries array required' }, 400);
    }
    
    const savedEntries = [];
    
    for (const entry of entries) {
      const { userId, companyId, date, hours, status, projectId, notes, taskId, startTime, endTime, breakMinutes, workType, taskCategory, taskDescription, billable } = entry;
      
      if (!userId || !companyId || !date || hours === undefined) {
        continue; // Skip invalid entries
      }
      
      // Support multi-task entries
      const uniqueTaskId = taskId || `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const entryId = `${userId}:${date}:${uniqueTaskId}`;
      
      const savedEntry = {
        id: entryId,
        userId,
        companyId,
        date,
        hours,
        status: status || 'draft',
        projectId: projectId || null,
        notes: notes || '',
        taskId: uniqueTaskId,
        // ✅ Include time tracking fields
        startTime: startTime || null,
        endTime: endTime || null,
        breakMinutes: breakMinutes || 0,
        // ✅ Include task category, description and work type
        workType: workType || 'regular',
        taskCategory: taskCategory || 'Development',
        taskDescription: taskDescription || '',
        billable: billable !== undefined ? billable : true,
        updatedAt: new Date().toISOString(),
      };
      
      await kv.set(`timesheet:${userId}:${date}:${uniqueTaskId}`, savedEntry);
      
      savedEntries.push(savedEntry);
    }
    
    return c.json({ entries: savedEntries, count: savedEntries.length });
  } catch (error) {
    console.log(`Error in bulk timesheet creation: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// Bulk apply timesheet template to multiple people
app.post("/make-server-f8b491be/timesheets/bulk-apply", async (c) => {
  try {
    console.log('\n🚀 ========== BULK APPLY REQUEST START ==========');
    
    const requestBody = await c.req.json();
    console.log('📥 Request body:', JSON.stringify(requestBody, null, 2));
    
    const { templatePersonId, templateDate, targetPersonIds, dateRangeType, overwriteExisting, companyId } = requestBody;
    
    if (!templatePersonId || !templateDate || !Array.isArray(targetPersonIds) || targetPersonIds.length === 0) {
      console.log('❌ Validation failed: Missing required fields');
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    console.log(`📋 Bulk apply validated:`);
    console.log(`   Template Person: ${templatePersonId}`);
    console.log(`   Template Date: ${templateDate}`);
    console.log(`   Target Persons: ${targetPersonIds.join(', ')} (${targetPersonIds.length} total)`);
    console.log(`   Date Range Type: ${dateRangeType}`);
    console.log(`   Overwrite Existing: ${overwriteExisting}`);
    console.log(`   Company ID: ${companyId || 'not specified'}`);
    
    // Get template entries for the source person
    const lookupKey = `timesheet:${templatePersonId}:${templateDate}:`;
    console.log(`🔍 Looking for template entries with prefix: "${lookupKey}"`);
    
    const templateEntries = await kv.getByPrefix(lookupKey);
    
    console.log(`📊 Found ${templateEntries.length} template entries`);
    if (templateEntries.length > 0) {
      templateEntries.forEach((entry, i) => {
        console.log(`   Entry ${i + 1}: ${entry.hours}h - ${entry.taskCategory || 'Development'}`);
      });
    }
    
    if (templateEntries.length === 0) {
      console.log('❌ No template entries found - aborting');
      return c.json({ error: 'No template entries found' }, 404);
    }
    
    console.log(`Found ${templateEntries.length} template entries`);
    
    // Calculate date range
    const getDateRange = (baseDate: string): string[] => {
      console.log(`🔍 getDateRange called with: baseDate="${baseDate}", dateRangeType="${dateRangeType}"`);
      
      if (dateRangeType === 'day') {
        console.log(`  → Returning single day: [${baseDate}]`);
        return [baseDate];
      }
      
      // Parse date components from YYYY-MM-DD format to avoid timezone issues
      const [yearStr, monthStr, dayStr] = baseDate.split('-');
      const year = parseInt(yearStr, 10);
      const month = parseInt(monthStr, 10) - 1; // JS months are 0-indexed
      const day = parseInt(dayStr, 10);
      
      console.log(`  📅 Parsed date: year=${year}, month=${month + 1}, day=${day}`);
      
      if (dateRangeType === 'week') {
        // Week: From current date to end of month
        const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
        console.log(`  📅 Rest of month: from day ${day} to day ${lastDayOfMonth}`);
        
        const dates: string[] = [];
        for (let d = day; d <= lastDayOfMonth; d++) {
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          dates.push(dateStr);
        }
        console.log(`  → Returning ${dates.length} dates for "rest of month"`);
        return dates;
      }
      
      // Month: Full month (1st to last day)
      const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
      console.log(`  📅 Full month: from day 1 to day ${lastDayOfMonth} (${lastDayOfMonth} total days)`);
      
      const dates: string[] = [];
      for (let d = 1; d <= lastDayOfMonth; d++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        dates.push(dateStr);
      }
      console.log(`  → Returning ${dates.length} dates for "full month"`);
      return dates;
    };
    
    const dates = getDateRange(templateDate);
    console.log(`📅 Calculated date range (${dateRangeType}): ${dates.length} days`);
    console.log(`📅 Dates: ${dates.join(', ')}`);
    console.log(`👥 Target persons: ${targetPersonIds.join(', ')}`);
    console.log(`⚙️  Overwrite existing: ${overwriteExisting}`);
    
    const createdEntries = [];
    let skippedCount = 0;
    let overwrittenCount = 0;
    
    // Apply template to each target person and each date
    for (const targetPersonId of targetPersonIds) {
      console.log(`\n👤 Processing target person: ${targetPersonId}`);
      
      for (const date of dates) {
        console.log(`  📆 Processing date: ${date}`);
        
        // If overwriting, delete all existing entries for this person/date first
        if (overwriteExisting) {
          const existingEntries = await kv.getByPrefix(`timesheet:${targetPersonId}:${date}:`);
          if (existingEntries.length > 0) {
            console.log(`    🗑️  Deleting ${existingEntries.length} existing entries for ${date}`);
            for (const existing of existingEntries) {
              const key = `timesheet:${targetPersonId}:${date}:${existing.taskId}`;
              await kv.del(key);
              overwrittenCount++;
            }
          }
        } else {
          // Check if any entries exist for this person/date
          const existingEntries = await kv.getByPrefix(`timesheet:${targetPersonId}:${date}:`);
          if (existingEntries.length > 0) {
            console.log(`    ⏭️  Skipping date ${date} - ${existingEntries.length} entries already exist`);
            skippedCount += templateEntries.length; // Skip all template entries for this date
            continue; // Skip to next date
          }
        }
        
        // Create entries from template
        for (const templateEntry of templateEntries) {
          const newTaskId = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const newEntryId = `${targetPersonId}:${date}:${newTaskId}`;
          
          const newEntry = {
            id: newEntryId,
            userId: targetPersonId,
            companyId: companyId || templateEntry.companyId,
            date: date,
            hours: templateEntry.hours,
            status: 'draft', // Always create as draft
            projectId: templateEntry.projectId,
            notes: templateEntry.notes || '',
            taskId: newTaskId,
            // ✅ Copy ALL fields from template entry
            startTime: templateEntry.startTime || null,
            endTime: templateEntry.endTime || null,
            breakMinutes: templateEntry.breakMinutes || 0,
            workType: templateEntry.workType || 'regular',
            taskCategory: templateEntry.taskCategory || 'Development',
            taskDescription: templateEntry.taskDescription || '',
            billable: templateEntry.billable !== undefined ? templateEntry.billable : true,
            updatedAt: new Date().toISOString(),
          };
          
          console.log(`    ✅ Creating entry: ${newEntry.hours}h - ${newEntry.taskCategory || 'Development'}`);
          await kv.set(`timesheet:${targetPersonId}:${date}:${newTaskId}`, newEntry);
          createdEntries.push(newEntry);
        }
      }
    }
    
    console.log(`\n✅ BULK APPLY COMPLETE:`);
    console.log(`   📝 Created: ${createdEntries.length} entries`);
    console.log(`   🗑️  Overwritten: ${overwrittenCount} entries`);
    console.log(`   ⏭️  Skipped: ${skippedCount} entries`);
    
    return c.json({ 
      created: createdEntries.length,
      skipped: skippedCount,
      overwritten: overwrittenCount,
      entries: createdEntries 
    });
  } catch (error) {
    console.log(`Error in bulk apply: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// Update timesheet entry by ID (Phase 1C)
app.put("/make-server-f8b491be/timesheets/:entryId", async (c) => {
  try {
    const entryId = c.req.param('entryId');
    const updates = await c.req.json();
    
    // entryId format can be "userId:date:taskId" (multi-task) or "userId:date" (legacy single-task)
    const parts = entryId.split(':');
    const userId = parts[0];
    const date = parts[1];
    const taskId = parts[2]; // May be undefined for legacy entries
    
    if (!userId || !date) {
      return c.json({ error: 'Invalid entry ID format' }, 400);
    }
    
    // Try to get entry - first try new format, then old format
    let kvKey = taskId 
      ? `timesheet:${userId}:${date}:${taskId}`
      : `timesheet:${userId}:${date}`;
    
    let existingEntry = await kv.get(kvKey);
    
    // If not found and no taskId provided, this might be a normalized old entry
    // Try looking for the old format key
    if (!existingEntry && !taskId) {
      // Entry doesn't exist in old format either
      return c.json({ error: 'Entry not found' }, 404);
    }
    
    // If this is an old format entry being updated, migrate it to new format
    let needsMigration = false;
    if (existingEntry && !existingEntry.taskId) {
      needsMigration = true;
      existingEntry.taskId = 'task-1'; // Add default taskId
    }
    
    // Merge updates with existing entry
    const updatedTaskId = existingEntry.taskId || 'task-1';
    const updatedEntry = {
      ...existingEntry,
      ...updates,
      id: `${userId}:${date}:${updatedTaskId}`, // Use new format ID
      userId, // Ensure userId doesn't change
      companyId: existingEntry.companyId, // Ensure companyId doesn't change
      taskId: updatedTaskId,
      updatedAt: new Date().toISOString(),
    };
    
    // If migrating, delete old key and save to new key
    if (needsMigration) {
      await kv.del(`timesheet:${userId}:${date}`); // Delete old format
      await kv.set(`timesheet:${userId}:${date}:${updatedTaskId}`, updatedEntry); // Save new format
    } else {
      // Save updated entry with new key format
      const newKvKey = `timesheet:${userId}:${date}:${updatedTaskId}`;
      await kv.set(newKvKey, updatedEntry);
    }
    
    return c.json({ entry: updatedEntry });
  } catch (error) {
    console.log(`Error updating timesheet: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// Delete timesheet entry by ID (Phase 1C)
app.delete("/make-server-f8b491be/timesheets/:entryId", async (c) => {
  try {
    const entryId = c.req.param('entryId');
    
    // entryId format can be "userId:date:taskId" (multi-task) or "userId:date" (legacy single-task)
    const parts = entryId.split(':');
    const userId = parts[0];
    const date = parts[1];
    const taskId = parts[2]; // May be undefined for legacy entries
    
    if (!userId || !date) {
      return c.json({ error: 'Invalid entry ID format' }, 400);
    }
    
    // Build the correct key based on format
    const kvKey = taskId 
      ? `timesheet:${userId}:${date}:${taskId}`
      : `timesheet:${userId}:${date}`;
    
    await kv.del(kvKey);
    
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting timesheet: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// Delete timesheet entry (legacy endpoint)
app.delete("/make-server-f8b491be/timesheets/:userId/:date", async (c) => {
  try {
    const userId = c.req.param('userId');
    const date = c.req.param('date');
    
    await kv.del(`timesheet:${userId}:${date}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting timesheet: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// Migrate old format entries to new format (utility endpoint)
app.post("/make-server-f8b491be/timesheets/migrate", async (c) => {
  try {
    console.log('Starting migration of old format entries...');
    
    // Get all timesheet entries
    const allEntries = await kv.getByPrefix('timesheet:');
    
    let migratedCount = 0;
    let skippedCount = 0;
    
    // Define sample task categories and work types to randomly assign
    const taskCategories = ['Development', 'Design', 'Testing', 'Code Review', 'Meeting', 'Documentation'];
    const workTypes = ['regular', 'regular', 'regular', 'regular', 'overtime', 'travel'];
    
    for (const entry of allEntries) {
      let needsUpdate = false;
      let updatedEntry = { ...entry };
      
      // Check if entry needs taskId migration
      if (!entry.taskId) {
        const taskId = 'task-1';
        updatedEntry = {
          ...updatedEntry,
          taskId,
          id: `${entry.userId}:${entry.date}:${taskId}`,
        };
        needsUpdate = true;
      }
      
      // Check if entry needs taskCategory/workType migration
      if (!entry.taskCategory || !entry.workType) {
        // Assign random task category and work type for demo purposes
        updatedEntry = {
          ...updatedEntry,
          taskCategory: entry.taskCategory || taskCategories[Math.floor(Math.random() * taskCategories.length)],
          workType: entry.workType || workTypes[Math.floor(Math.random() * workTypes.length)],
        };
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        updatedEntry.updatedAt = new Date().toISOString();
        
        // Delete old key if taskId was missing
        if (!entry.taskId) {
          await kv.del(`timesheet:${entry.userId}:${entry.date}`);
        }
        
        // Save with correct key format
        const userId = updatedEntry.userId;
        const date = updatedEntry.date;
        const taskId = updatedEntry.taskId;
        await kv.set(`timesheet:${userId}:${date}:${taskId}`, updatedEntry);
        
        migratedCount++;
      } else {
        skippedCount++;
      }
    }
    
    console.log(`Migration complete. Migrated: ${migratedCount}, Skipped: ${skippedCount}`);
    
    return c.json({ 
      success: true, 
      migrated: migratedCount, 
      skipped: skippedCount,
      message: `Successfully migrated ${migratedCount} entries to new format`
    });
  } catch (error) {
    console.log(`Error during migration: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// ============================================================
// PEOPLE/USERS ENDPOINTS
// ============================================================

// Get users by company
app.get("/make-server-f8b491be/companies/:companyId/people", async (c) => {
  try {
    const companyId = c.req.param('companyId');
    
    // Get all contracts for this company
    const contracts = await kv.getByPrefix(`contract:company:${companyId}:`);
    
    // Get user details for each contract
    const peoplePromises = contracts.map(async (contract: any) => {
      const user = await kv.get(`user:${contract.userId}`);
      return {
        ...user,
        contractId: contract.id,
        contractRole: contract.role,
        contractStatus: contract.status,
      };
    });
    
    const people = await Promise.all(peoplePromises);
    
    return c.json({ people: people.filter(p => p) });
  } catch (error) {
    console.log(`Error fetching company people: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// ============================================================
// SEED DATA ENDPOINT (for demo/testing)
// ============================================================

app.post("/make-server-f8b491be/seed", async (c) => {
  try {
    console.log('🌱 Starting seed data creation...');
    
    // Create demo company
    const companyId = 'demo-company-1';
    await kv.set(`company:${companyId}`, {
      id: companyId,
      name: 'Acme Corp',
      type: 'company',
      createdAt: new Date().toISOString(),
    });
    console.log('✓ Company created');
    
    // Create demo users with IDs matching the mock data
    const demoUsers = [
      { id: 'c1', name: 'Sarah Chen', email: 'sarah@example.com', role: 'Senior Engineer', initials: 'SC' },
      { id: 'c2', name: 'Ian Mitchell', email: 'ian@example.com', role: 'Frontend Developer', initials: 'IM' },
      { id: 'c3', name: 'Lisa Park', email: 'lisa@example.com', role: 'UI Designer', initials: 'LP' },
      { id: 'c4', name: 'Marcus Webb', email: 'marcus@example.com', role: 'Backend Engineer', initials: 'MW' },
      { id: 'c5', name: 'Nina Patel', email: 'nina@example.com', role: 'QA Engineer', initials: 'NP' },
    ];
    
    for (const user of demoUsers) {
      await kv.set(`user:${user.id}`, user);
      
      // Create contract linking user to company
      await kv.set(`contract:company:${companyId}:${user.id}`, {
        id: `contract-${user.id}`,
        userId: user.id,
        companyId,
        role: user.role,
        status: 'active',
      });
    }
    console.log(`✓ ${demoUsers.length} users created with contracts`);
    
    // Create sample timesheet entries for entire October 2025
    const entries = [];
    const projects = [
      'Client Portal Redesign', 
      'API Integration', 
      'Mobile App Development',
      'Database Optimization',
      'Security Audit',
      'User Dashboard'
    ];
    
    const tasks = [
      'Frontend Development', 
      'Backend Development', 
      'Code Review', 
      'Client Meetings', 
      'Testing & QA',
      'Documentation',
      'Bug Fixes',
      'Planning & Estimation'
    ];
    
    // Generate entries for October 1-31, 2025
    for (let day = 1; day <= 31; day++) {
      const date = `2025-10-${String(day).padStart(2, '0')}`;
      const dayOfWeek = new Date(2025, 9, day).getDay(); // 0 = Sunday
      
      // Skip weekends (Saturday=6, Sunday=0) for some users
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      // Use all 5 users (first 3 are from Acme Corp, last 2 from TechStaff Inc in mock)
      for (let i = 0; i < 5; i++) {
        const user = demoUsers[i];
        
        // Skip weekends for users 0-2 (weekday workers)
        if (isWeekend && i < 3) continue;
        
        // Determine status based on day (older entries more likely approved)
        let status: 'draft' | 'submitted' | 'approved' | 'rejected';
        if (day <= 7) {
          status = 'approved'; // Week 1 all approved
        } else if (day <= 14) {
          status = day % 2 === 0 ? 'approved' : 'submitted'; // Week 2 mix
        } else if (day <= 21) {
          status = 'submitted'; // Week 3 all submitted
        } else {
          status = 'draft'; // Week 4+ all draft
        }
        
        // Create multi-task entries on some days
        const isMultiTaskDay = day % 5 === 0; // Every 5th day
        const hasOvertimeDay = day % 7 === 0; // Every 7th day
        
        if (isMultiTaskDay) {
          // Create 2-3 tasks for this day
          const numTasks = 2 + (i % 2);
          
          for (let t = 0; t < numTasks; t++) {
            const taskId = `task-${t + 1}`;
            const hours = t === 0 ? 4.5 : t === 1 ? 3 : 1.5;
            
            const entry = {
              id: `${user.id}:${date}:${taskId}`,
              userId: user.id,
              companyId,
              date,
              hours,
              status,
              projectId: projects[(i + t) % projects.length],
              notes: t === 0 ? `Working on ${tasks[(i + t) % tasks.length]}` : tasks[(i + t + 1) % tasks.length],
              taskId,
              updatedAt: new Date().toISOString(),
            };
            
            await kv.set(`timesheet:${user.id}:${date}:${taskId}`, entry);
            entries.push(entry);
          }
        } else {
          // Single task entry
          const taskId = 'task-1';
          
          // Vary hours: some standard 8h, some 6h, some overtime
          let hours = 8;
          if (hasOvertimeDay && i === 1) {
            hours = 10; // Ian occasionally works overtime
          } else if (day % 8 === 0) {
            hours = 6; // Part day
          } else if (i === 2) {
            hours = 7; // Lisa standard 7h days
          }
          
          const entry = {
            id: `${user.id}:${date}:${taskId}`,
            userId: user.id,
            companyId,
            date,
            hours,
            status,
            projectId: projects[i % projects.length],
            notes: day % 10 === 0 ? `Sprint ${Math.floor(day / 7) + 1} - ${tasks[i % tasks.length]}` : '',
            taskId,
            updatedAt: new Date().toISOString(),
          };
          
          await kv.set(`timesheet:${user.id}:${date}:${taskId}`, entry);
          entries.push(entry);
        }
      }
    }
    
    console.log(`✓ ${entries.length} timesheet entries created for October 2025`);
    
    return c.json({ 
      message: '✅ Seed data created successfully!',
      details: {
        company: 'Acme Corp',
        users: demoUsers.length,
        entries: entries.length,
        dateRange: 'October 1-31, 2025',
        features: [
          'Multi-task entries on every 5th day',
          'Overtime entries on every 7th day',
          'Varied statuses (approved → submitted → draft)',
          'Weekend entries for some users',
          'Realistic hour variations (6-10h)'
        ]
      }
    });
  } catch (error) {
    console.log(`❌ Error seeding data: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);