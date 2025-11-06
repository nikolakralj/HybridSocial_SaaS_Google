import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner@2.0.3';
import { useSaveTimesheetEntry, useTimesheetEntries, formatDateForAPI } from '../../utils/api/timesheets-hooks';
import { Loader2, CheckCircle2 } from 'lucide-react';

/**
 * DATABASE SYNC TEST COMPONENT
 * 
 * This is a simple test interface to verify that:
 * 1. You can save timesheet entries to the database
 * 2. The entries appear in the Approvals tab when you click on James Kim
 * 
 * HOW TO USE:
 * 1. Enter a date (e.g., 2025-10-01)
 * 2. Enter hours (e.g., 7.5)
 * 3. Click "Save Entry"
 * 4. Go to Approvals tab
 * 5. Click on "James Kim"
 * 6. You should see your entry in the drawer!
 */

export function DatabaseSyncTest() {
  const [date, setDate] = useState('2025-10-01'); // Default to Oct 1, 2025
  const [hours, setHours] = useState('7.5');
  
  // James Kim's userId from demo data
  const jamesKimUserId = 'user-freelancer-3';
  const companyId = 'company-1';
  
  // Fetch existing entries for James Kim in October 2025
  const { data: entries = [], isLoading, refetch } = useTimesheetEntries({
    userId: jamesKimUserId,
    companyId: companyId,
    startDate: '2025-10-01',
    endDate: '2025-10-31',
  });
  
  // Save mutation
  const saveEntry = useSaveTimesheetEntry();
  
  const handleSave = () => {
    if (!date || !hours) {
      toast.error('Please enter both date and hours');
      return;
    }
    
    const hoursNum = parseFloat(hours);
    if (isNaN(hoursNum) || hoursNum <= 0) {
      toast.error('Please enter a valid number of hours');
      return;
    }
    
    console.log('🚀 SAVING ENTRY:', {
      userId: jamesKimUserId,
      companyId: companyId,
      date: date,
      hours: hoursNum,
    });
    
    saveEntry.mutate({
      userId: jamesKimUserId,
      companyId: companyId,
      date: date,
      hours: hoursNum,
      status: 'draft',
      notes: 'Backend API development - Test entry from DatabaseSyncTest',
      billable: true, // This will be ignored by server but won't cause error
    }, {
      onSuccess: (data) => {
        console.log('✅ SAVE SUCCESS:', data);
        toast.success(`Saved ${hoursNum}h for ${date}! Check console for details.`);
        // Refresh the list
        refetch();
      },
      onError: (error) => {
        console.error('❌ SAVE ERROR:', error);
        toast.error(`Failed to save: ${error.message}`);
      }
    });
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="p-6">
        <h2 className="mb-4">🧪 Database Sync Test - James Kim</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Use this form to add timesheet entries for James Kim. After saving, go to the 
          <strong> Approvals tab</strong> and click on <strong>James Kim</strong> to see 
          your entries in the drawer.
        </p>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="date">Date (YYYY-MM-DD)</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min="2025-10-01"
              max="2025-10-31"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Must be in October 2025 to appear in the approval drawer
            </p>
          </div>
          
          <div>
            <Label htmlFor="hours">Hours</Label>
            <Input
              id="hours"
              type="number"
              step="0.5"
              min="0"
              max="24"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
            />
          </div>
          
          <Button 
            onClick={handleSave}
            disabled={saveEntry.isPending}
            className="w-full"
          >
            {saveEntry.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Save Entry to Database
              </>
            )}
          </Button>
        </div>
      </Card>
      
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Saved Entries for James Kim (October 2025)</h3>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Refresh'}
          </Button>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            Loading entries...
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No entries found for James Kim in October 2025.</p>
            <p className="text-sm mt-2">Add an entry above to get started!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry, index) => (
              <div key={entry.id || index} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                <div>
                  <p className="font-medium">{entry.date}</p>
                  <p className="text-sm text-muted-foreground">{entry.notes || 'No description'}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-accent-brand">{entry.hours}h</p>
                  <p className="text-xs text-muted-foreground">{entry.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900 font-medium mb-1">✅ Next Step:</p>
          <p className="text-sm text-blue-800">
            After saving entries here, go to <strong>Project Workspace → Timesheets → Approvals</strong> tab, 
            then click on <strong>James Kim</strong> in the approval table. The drawer should show the entries you just saved!
          </p>
        </div>
      </Card>
      
      <Card className="p-6 bg-amber-50 border-amber-200">
        <h3 className="text-lg font-semibold mb-2 text-amber-900">⚠️ Debugging Info</h3>
        <div className="space-y-1 text-sm font-mono text-amber-800">
          <p><strong>User ID:</strong> {jamesKimUserId}</p>
          <p><strong>Company ID:</strong> {companyId}</p>
          <p><strong>Date Range:</strong> 2025-10-01 to 2025-10-31</p>
          <p><strong>Total Entries:</strong> {entries.length}</p>
        </div>
      </Card>
    </div>
  );
}