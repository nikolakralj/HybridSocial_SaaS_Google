import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { 
  CheckCircle, 
  Eye, 
  Lock, 
  ArrowRight, 
  FileJson,
  GitBranch,
} from 'lucide-react';
import type { CompiledProjectConfig } from '../../types/workgraph';

interface CompileModalProps {
  open: boolean;
  config: CompiledProjectConfig;
  onSave: () => void;
  onClose: () => void;
}

export function CompileModal({ open, config, onSave, onClose }: CompileModalProps) {
  const [pinVersion, setPinVersion] = useState(false);

  const approvalSteps = config.approvalPolicies[0]?.steps || [];
  const visibilityRules = config.visibilityRules || [];

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Compilation Successful
          </DialogTitle>
          <DialogDescription>
            Your WorkGraph has been compiled into a policy configuration. Review the details below and save to deploy.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Version info */}
          <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <GitBranch className="h-5 w-5 text-blue-600" />
            <div className="flex-1">
              <div className="font-medium text-blue-900">
                Version {config.version - 1} → Version {config.version}
              </div>
              <div className="text-sm text-blue-700">
                Ready to deploy new configuration
              </div>
            </div>
          </div>

          {/* Approval Steps Preview */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ArrowRight className="h-4 w-4 text-gray-500" />
              <h3 className="font-medium text-gray-900">Approval Chain</h3>
              <Badge variant="outline">{approvalSteps.length} steps</Badge>
            </div>
            
            {approvalSteps.length > 0 ? (
              <div className="space-y-2">
                {approvalSteps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold">
                      {step.order}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        Step {step.order}: {step.role}
                      </div>
                      <div className="text-sm text-gray-600 capitalize">
                        {step.partyType}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg">
                No approval steps defined
              </div>
            )}
          </div>

          <Separator />

          {/* Visibility Rules Summary */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Lock className="h-4 w-4 text-gray-500" />
              <h3 className="font-medium text-gray-900">Visibility Rules</h3>
              <Badge variant="outline">{visibilityRules.length} rules</Badge>
            </div>

            {visibilityRules.length > 0 ? (
              <div className="space-y-2">
                {visibilityRules.map((rule, index) => (
                  <div
                    key={index}
                    className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Lock className="h-3 w-3 text-yellow-700" />
                      <span className="text-sm font-medium text-yellow-900">
                        {rule.scope.field.toUpperCase()} masked
                      </span>
                    </div>
                    <div className="text-sm text-yellow-700">
                      Hidden from {rule.policy.hiddenFrom.length} part
                      {rule.policy.hiddenFrom.length === 1 ? 'y' : 'ies'}
                    </div>
                    <div className="text-xs text-yellow-600 mt-1">
                      Displayed as: <code className="bg-yellow-100 px-1 rounded">{rule.policy.maskWith}</code>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg">
                No visibility restrictions
              </div>
            )}
          </div>

          <Separator />

          {/* Graph summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-semibold text-gray-900">
                {config.graph.nodes.length}
              </div>
              <div className="text-sm text-gray-600">Nodes</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-semibold text-gray-900">
                {config.graph.edges.length}
              </div>
              <div className="text-sm text-gray-600">Edges</div>
            </div>
          </div>

          {/* Pin version option */}
          <div className="flex items-center gap-2 p-3 border rounded-lg">
            <Checkbox
              id="pinVersion"
              checked={pinVersion}
              onCheckedChange={(checked) => setPinVersion(checked as boolean)}
            />
            <Label htmlFor="pinVersion" className="text-sm cursor-pointer">
              Pin in-flight work to Version {config.version - 1}
              <span className="block text-xs text-gray-500 mt-0.5">
                Existing work items will continue using the previous configuration
              </span>
            </Label>
          </div>

          {/* Preview hint */}
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Eye className="h-4 w-4 text-blue-600" />
            <div className="text-sm text-blue-900">
              Use "Preview as..." dropdown to test visibility rules before saving
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="outline" onClick={() => {
            // Download JSON
            const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `workgraph-v${config.version}.json`;
            a.click();
          }}>
            <FileJson className="h-4 w-4 mr-2" />
            Download JSON
          </Button>
          <Button onClick={onSave}>
            Save & Deploy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
