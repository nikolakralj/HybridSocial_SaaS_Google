/**
 * Supabase Setup Verification
 * Quick diagnostic tool to verify database tables exist
 */

import { createClient } from '../supabase/client';

export async function verifySupabaseSetup() {
  const supabase = createClient();
  const results = {
    connection: false,
    tables: {
      organizations: false,
      project_contracts: false,
      timesheet_periods: false,
      timesheet_entries: false,
      approval_history: false,
      attachments: false,
      review_flags: false,
      allocated_tasks: false,
    },
    counts: {} as Record<string, number>,
    errors: [] as string[],
  };

  try {
    // Test 1: Check connection
    const { error: connectionError } = await supabase.from('organizations').select('count');
    if (connectionError) {
      results.errors.push(`Connection error: ${connectionError.message}`);
      return results;
    }
    results.connection = true;

    // Test 2: Check each table exists and get counts
    const tables = Object.keys(results.tables);
    
    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          results.errors.push(`Table '${table}' error: ${error.message}`);
        } else {
          results.tables[table as keyof typeof results.tables] = true;
          results.counts[table] = count || 0;
        }
      } catch (err) {
        results.errors.push(`Table '${table}' check failed: ${err}`);
      }
    }

  } catch (err) {
    results.errors.push(`Setup check failed: ${err}`);
  }

  return results;
}

export async function printSetupStatus() {
  console.log('🔍 Checking Supabase setup...\n');
  
  const results = await verifySupabaseSetup();
  
  console.log(`Connection: ${results.connection ? '✅' : '❌'}`);
  console.log('\nTables:');
  
  Object.entries(results.tables).forEach(([table, exists]) => {
    const count = results.counts[table] || 0;
    console.log(`  ${exists ? '✅' : '❌'} ${table.padEnd(20)} (${count} records)`);
  });
  
  if (results.errors.length > 0) {
    console.log('\n❌ Errors:');
    results.errors.forEach(err => console.log(`  - ${err}`));
  } else {
    console.log('\n✅ All checks passed!');
  }
  
  return results;
}

// Expected counts after seeding
export const EXPECTED_COUNTS = {
  organizations: 5,
  project_contracts: 25,
  timesheet_periods: 25,
  timesheet_entries: 10, // Sample entries for Sarah Johnson
  approval_history: 16,
  attachments: 4,
  review_flags: 1,
  allocated_tasks: 3,
};

export function validateSeedData(counts: Record<string, number>): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  
  Object.entries(EXPECTED_COUNTS).forEach(([table, expected]) => {
    const actual = counts[table] || 0;
    if (actual < expected) {
      issues.push(`${table}: expected ${expected}, got ${actual}`);
    }
  });
  
  return {
    valid: issues.length === 0,
    issues,
  };
}