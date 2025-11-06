import { projectId, publicAnonKey } from '../supabase/info';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-f8b491be`;

/**
 * Migrate old format timesheet entries (userId:date) to new format (userId:date:taskId)
 * This only needs to be run once to migrate existing data
 */
export async function migrateTimesheetEntries(): Promise<{
  success: boolean;
  migrated: number;
  skipped: number;
  message: string;
}> {
  try {
    const response = await fetch(`${BASE_URL}/timesheets/migrate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Migration failed: ${error}`);
    }

    const result = await response.json();
    console.log('Migration result:', result);
    return result;
  } catch (error) {
    console.error('Failed to migrate timesheet entries:', error);
    throw error;
  }
}
