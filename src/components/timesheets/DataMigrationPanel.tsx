import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { migrateTimesheetEntries } from '../../utils/api/migrate-timesheets';

export function DataMigrationPanel() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    type: 'success' | 'error';
    message: string;
    migrated?: number;
    skipped?: number;
  } | null>(null);

  const handleMigrate = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const migrationResult = await migrateTimesheetEntries();
      setResult({
        type: 'success',
        message: migrationResult.message,
        migrated: migrationResult.migrated,
        skipped: migrationResult.skipped,
      });
    } catch (error) {
      console.error('Failed to migrate timesheet entries:', error);
      
      // Check if it's a connection error
      const errorMessage = String(error);
      const isConnectionError = errorMessage.includes('connection error') || 
                                errorMessage.includes('connection reset') ||
                                errorMessage.includes('ECONNRESET');
      
      setResult({
        type: 'error',
        message: isConnectionError 
          ? 'Database connection error. This is usually temporary. Please wait a moment and try again.'
          : `Migration failed: ${error}`,
      });
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <Card className="p-6 max-w-2xl">
      <div className="space-y-4">
        <div>
          <h3 className="flex items-center gap-2 mb-2">
            <RefreshCw className="w-5 h-5 text-accent-brand" />
            Data Migration Tools
          </h3>
          <p className="text-sm text-muted-foreground">
            Migrate timesheet data to multi-task format
          </p>
        </div>

        <div className="space-y-3 border-t pt-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="font-medium text-sm mb-1">Migrate to Multi-Task Format</div>
              <p className="text-xs text-muted-foreground">
                Converts old single-task entries (userId:date) to new multi-task format (userId:date:taskId).
                Safe to run multiple times - already migrated entries will be skipped.
              </p>
            </div>
            <Button
              onClick={handleMigrate}
              disabled={isLoading}
              className="gap-2 shrink-0"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Migrating...' : 'Migrate'}
            </Button>
          </div>
        </div>

        {/* Result Display */}
        {result && (
          <Alert variant={result.type === 'error' ? 'destructive' : 'default'} className="mt-4">
            {result.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <AlertDescription>
              <div className="font-medium mb-1">{result.message}</div>
              {result.migrated !== undefined && (
                <div className="text-sm flex gap-4 mt-2">
                  <Badge variant="outline" className="gap-2">
                    <span className="text-green-600">Migrated:</span>
                    <span className="font-semibold">{result.migrated}</span>
                  </Badge>
                  <Badge variant="outline" className="gap-2">
                    <span className="text-muted-foreground">Skipped:</span>
                    <span className="font-semibold">{result.skipped}</span>
                  </Badge>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Info */}
        <div className="border-t pt-4 text-xs text-muted-foreground">
          <strong>Note:</strong> Migration happens automatically when you load the timesheet interface,
          but you can use this panel to manually trigger it if needed.
        </div>
      </div>
    </Card>
  );
}
