// Phase 5 Day 1-2: Rebind Wizard
// One-click wizard to rebind timesheets to a different policy version

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import {
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Info,
  ArrowRight,
  Shield,
} from 'lucide-react';
import {
  RebindRequest,
  RebindResult,
  PolicyVersionSummary,
} from '../../types/policy-versions';
import { PolicyVersionStatus } from './PolicyVersionBadge';

export interface RebindWizardProps {
  open: boolean;
  onClose: () => void;
  timesheetIds: string[];
  currentVersionId: string;
  currentVersion: number;
  availableVersions: PolicyVersionSummary[];
  onRebind: (request: RebindRequest) => Promise<RebindResult>;
}

export function RebindWizard({
  open,
  onClose,
  timesheetIds,
  currentVersionId,
  currentVersion,
  availableVersions,
  onRebind,
}: RebindWizardProps) {
  const [selectedVersionId, setSelectedVersionId] = useState<string>('');
  const [validateCompatibility, setValidateCompatibility] = useState(true);
  const [dryRun, setDryRun] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RebindResult | null>(null);

  // Find the active version
  const activeVersion = availableVersions.find(v => v.isActive);
  const selectedVersion = availableVersions.find(v => v.id === selectedVersionId);

  // Auto-select active version on open
  useState(() => {
    if (open && activeVersion && !selectedVersionId) {
      setSelectedVersionId(activeVersion.id);
    }
  });

  async function handleRebind() {
    if (!selectedVersionId) return;

    setLoading(true);
    setResult(null);

    try {
      const request: RebindRequest = {
        timesheetIds,
        fromVersionId: currentVersionId,
        toVersionId: selectedVersionId,
        validateCompatibility,
        dryRun,
        performedBy: 'current-user', // TODO: Get from auth context
        reason: `Rebinding ${timesheetIds.length} timesheet(s) to v${selectedVersion?.version}`,
      };

      const rebindResult = await onRebind(request);
      setResult(rebindResult);

      // If not dry run and successful, close after a delay
      if (!dryRun && rebindResult.success) {
        setTimeout(() => {
          onClose();
          setResult(null);
        }, 2000);
      }
    } catch (error) {
      console.error('Rebind failed:', error);
      setResult({
        success: false,
        totalRequested: timesheetIds.length,
        successfullyRebinded: 0,
        failed: timesheetIds.length,
        rebindedTimesheetIds: [],
        failedTimesheetIds: timesheetIds,
        errors: timesheetIds.map(id => ({
          timesheetId: id,
          error: 'Unknown error occurred',
        })),
        performedAt: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setResult(null);
    setSelectedVersionId('');
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Rebind Timesheets to Different Policy Version
          </DialogTitle>
          <DialogDescription>
            Move {timesheetIds.length} timesheet{timesheetIds.length > 1 ? 's' : ''} to a different policy version
          </DialogDescription>
        </DialogHeader>

        {!result ? (
          <div className="space-y-6">
            {/* Current Status */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Currently pinned to:</span>
                <Badge variant="secondary">v{currentVersion}</Badge>
              </div>
              <p className="text-xs text-gray-500">
                {timesheetIds.length} timesheet{timesheetIds.length > 1 ? 's' : ''} selected
              </p>
            </div>

            {/* Target Version Selection */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Select target version:
              </Label>
              <div className="space-y-2">
                {availableVersions
                  .filter(v => v.id !== currentVersionId) // Don't show current version
                  .map(version => (
                    <button
                      key={version.id}
                      onClick={() => setSelectedVersionId(version.id)}
                      className={`
                        w-full p-3 rounded-lg border-2 text-left transition-all
                        ${selectedVersionId === version.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold">v{version.version}</span>
                          {version.versionName && (
                            <span className="text-sm text-gray-600">{version.versionName}</span>
                          )}
                          <PolicyVersionStatus
                            isActive={version.isActive}
                            isPublished={version.isPublished}
                          />
                        </div>
                        {version.isActive && (
                          <Badge variant="default" className="text-xs">
                            Recommended
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Created {new Date(version.createdAt).toLocaleDateString()}
                      </p>
                    </button>
                  ))}
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="validate"
                  checked={validateCompatibility}
                  onCheckedChange={(checked) => setValidateCompatibility(checked === true)}
                />
                <div className="space-y-1">
                  <Label htmlFor="validate" className="text-sm font-medium cursor-pointer">
                    Validate compatibility
                  </Label>
                  <p className="text-xs text-gray-500">
                    Check if timesheets are compatible with the target policy version
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="dryrun"
                  checked={dryRun}
                  onCheckedChange={(checked) => setDryRun(checked === true)}
                />
                <div className="space-y-1">
                  <Label htmlFor="dryrun" className="text-sm font-medium cursor-pointer">
                    Dry run (preview only)
                  </Label>
                  <p className="text-xs text-gray-500">
                    Test the rebind without actually changing anything
                  </p>
                </div>
              </div>
            </div>

            {/* Warning */}
            <Alert>
              <Info className="w-4 h-4" />
              <AlertDescription className="text-sm">
                <p className="font-medium mb-1">What will happen:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Selected timesheets will be reassigned to v{selectedVersion?.version}</li>
                  <li>Approval flows will restart from step 1</li>
                  <li>Previous approval history will be preserved in audit log</li>
                  <li>This action can be reversed if needed</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <RebindResultDisplay result={result} />
        )}

        <DialogFooter>
          {!result ? (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleRebind}
                disabled={!selectedVersionId || loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    {dryRun ? 'Testing...' : 'Rebinding...'}
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4 mr-2" />
                    {dryRun ? 'Test Rebind' : 'Rebind Now'}
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              {result.success && !dryRun ? (
                <Button onClick={handleClose}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Done
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setResult(null)}>
                    Back
                  </Button>
                  {dryRun && result.success && (
                    <Button onClick={() => { setDryRun(false); setResult(null); }}>
                      <Shield className="w-4 h-4 mr-2" />
                      Execute for Real
                    </Button>
                  )}
                </>
              )}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RebindResultDisplay({ result }: { result: RebindResult }) {
  const successRate = (result.successfullyRebinded / result.totalRequested) * 100;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className={`
        p-4 rounded-lg border-2
        ${result.success ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}
      `}>
        <div className="flex items-center gap-3 mb-3">
          {result.success ? (
            <CheckCircle className="w-6 h-6 text-green-600" />
          ) : (
            <AlertCircle className="w-6 h-6 text-red-600" />
          )}
          <div>
            <h3 className="font-semibold">
              {result.success ? 'Rebind Successful!' : 'Rebind Failed'}
            </h3>
            <p className="text-sm text-gray-600">
              {result.successfullyRebinded} of {result.totalRequested} timesheets rebinded
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {result.successfullyRebinded}
            </div>
            <div className="text-xs text-gray-500">Successful</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {result.failed}
            </div>
            <div className="text-xs text-gray-500">Failed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {successRate.toFixed(0)}%
            </div>
            <div className="text-xs text-gray-500">Success Rate</div>
          </div>
        </div>
      </div>

      {/* Errors */}
      {result.errors && result.errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>
            <p className="font-medium mb-2">Errors encountered:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              {result.errors.slice(0, 5).map((error, index) => (
                <li key={index}>
                  Timesheet {error.timesheetId}: {error.error}
                </li>
              ))}
              {result.errors.length > 5 && (
                <li>... and {result.errors.length - 5} more</li>
              )}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Timing */}
      <p className="text-xs text-gray-500 text-center">
        Completed at {new Date(result.performedAt).toLocaleString()}
      </p>
    </div>
  );
}
