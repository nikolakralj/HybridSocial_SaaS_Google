import { projectId, publicAnonKey } from '../supabase/info';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-f8b491be`;

/**
 * Clear all demo data (useful for testing)
 * Note: This is a client-side helper - in production you'd want server-side cleanup
 */
export async function clearDemoData() {
  console.log('Note: Data clearing would need to be implemented server-side');
  console.log('For now, just reseed the data to overwrite duplicates');
}
