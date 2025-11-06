import React, { useState } from 'react';
import { X, Copy, Check, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import type { CompiledProjectConfig } from '../../types/workgraph';

interface CompiledPolicyViewerProps {
  config: CompiledProjectConfig;
  onClose: () => void;
}

export function CompiledPolicyViewer({ config, onClose }: CompiledPolicyViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project-${config.projectId}-v${config.version}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Compiled Project Config</h2>
            <p className="text-sm text-gray-500 mt-1">
              Version {config.version} • Compiled {new Date(config.compiledAt).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy JSON
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="summary" className="h-full flex flex-col">
            <TabsList className="px-6 pt-4">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="approval">Approval Policies</TabsTrigger>
              <TabsTrigger value="visibility">Visibility Rules</TabsTrigger>
              <TabsTrigger value="json">Full JSON</TabsTrigger>
            </TabsList>

            {/* Summary Tab */}
            <TabsContent value="summary" className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Project Info</h3>
                  <dl className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-gray-500">Project ID</dt>
                      <dd className="font-mono text-xs mt-1">{config.projectId}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Version</dt>
                      <dd className="mt-1">{config.version}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Compiled By</dt>
                      <dd className="mt-1">{config.compiledBy}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Compiled At</dt>
                      <dd className="mt-1">{new Date(config.compiledAt).toLocaleString()}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Graph Stats</h3>
                  <dl className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-gray-500">Nodes</dt>
                      <dd className="mt-1">{config.graph.nodes.length}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Edges</dt>
                      <dd className="mt-1">{config.graph.edges.length}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Policies</h3>
                  <dl className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-gray-500">Approval Policies</dt>
                      <dd className="mt-1">{config.approvalPolicies.length}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Visibility Rules</dt>
                      <dd className="mt-1">{config.visibilityRules.length}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </TabsContent>

            {/* Approval Policies Tab */}
            <TabsContent value="approval" className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {config.approvalPolicies.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No approval policies defined</p>
                ) : (
                  config.approvalPolicies.map((policy, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">
                          {policy.workType.charAt(0).toUpperCase() + policy.workType.slice(1)} Approval
                        </h4>
                        <span className="text-sm text-gray-500">
                          {policy.sequential ? 'Sequential' : 'Parallel'}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        {policy.steps.map((step, stepIndex) => (
                          <div
                            key={stepIndex}
                            className="flex items-center gap-3 p-2 bg-gray-50 rounded"
                          >
                            <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center">
                              {step.order}
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">
                                {step.partyType.charAt(0).toUpperCase() + step.partyType.slice(1)}
                              </div>
                              <div className="text-xs text-gray-500">{step.role}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {policy.autoApprove && (
                        <div className="mt-3 p-2 bg-green-50 rounded text-sm text-green-800">
                          Auto-approve: Under {policy.autoApprove.underHours}h or ${policy.autoApprove.underAmount}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Visibility Rules Tab */}
            <TabsContent value="visibility" className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {config.visibilityRules.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No visibility rules defined</p>
                ) : (
                  config.visibilityRules.map((rule) => (
                    <div key={rule.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">
                          {rule.scope.objectType}.{rule.scope.field}
                        </h4>
                        <span className={`text-sm px-2 py-1 rounded ${
                          rule.policy.action === 'MASK'
                            ? 'bg-red-100 text-red-700'
                            : rule.policy.action === 'HIDE'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {rule.policy.action}
                        </span>
                      </div>
                      
                      {rule.policy.hiddenFrom.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">Hidden from:</p>
                          <div className="flex flex-wrap gap-1">
                            {rule.policy.hiddenFrom.map((partyId) => (
                              <span
                                key={partyId}
                                className="text-xs px-2 py-1 bg-gray-100 rounded"
                              >
                                {partyId}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {rule.policy.maskWith && (
                        <div className="mt-2 text-sm text-gray-600">
                          Masked as: <code className="bg-gray-100 px-2 py-1 rounded">{rule.policy.maskWith}</code>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Full JSON Tab */}
            <TabsContent value="json" className="flex-1 overflow-y-auto p-6">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto">
                {JSON.stringify(config, null, 2)}
              </pre>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
