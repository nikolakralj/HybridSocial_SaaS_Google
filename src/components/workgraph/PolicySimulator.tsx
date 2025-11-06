import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { 
  Play, 
  RotateCcw, 
  Download,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  Zap
} from 'lucide-react';
import { SimulatorInputForm } from './SimulatorInputForm';
import { SimulatorFlowVisualization } from './SimulatorFlowVisualization';
import { SimulatorResults } from './SimulatorResults';
import type { CompiledProjectConfig } from '../../types/workgraph';

export interface TimesheetSimulationInput {
  contractorId: string;
  contractorName: string;
  contractId: string;
  hours: number;
  weekStartDate: string;
  rate?: number;
  taskDescription?: string;
  urgencyLevel?: 'low' | 'normal' | 'high' | 'urgent';
  submissionNotes?: string;
}

export interface SimulationStep {
  stepNumber: number;
  partyId: string;
  partyName: string;
  partyType: string;
  role: string;
  action: 'auto-approve' | 'manual-review' | 'rejected';
  reason?: string;
  estimatedSLA: number; // in hours
  visibleFields: string[];
  maskedFields: string[];
  rateVisible: boolean;
}

export interface SimulationResult {
  status: 'approved' | 'pending' | 'rejected' | 'error';
  totalSLA: number; // in hours
  businessDays: number;
  steps: SimulationStep[];
  conflicts: SimulationConflict[];
  timestamp: string;
  input?: TimesheetSimulationInput; // Include input details for reference
}

export interface SimulationConflict {
  severity: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  affectedStep?: number;
}

interface PolicySimulatorProps {
  config: CompiledProjectConfig;
  projectName: string;
}

export function PolicySimulator({ config, projectName }: PolicySimulatorProps) {
  const [input, setInput] = useState<TimesheetSimulationInput | null>(null);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);

  // Extract contractors from graph - EXPANDED to catch all relevant nodes
  const availableContractors = useMemo(() => {
    const contractors = config.graph.nodes
      .filter(node => {
        // Accept person nodes
        if (node.type === 'person') return true;
        
        // Accept party nodes that are contractors or freelancers
        if (node.type === 'party') {
          const partyType = node.data?.partyType?.toLowerCase() || '';
          return partyType === 'contractor' || 
                 partyType === 'freelancer' ||
                 partyType === 'individual';
        }
        
        return false;
      })
      .map(node => ({
        id: node.id,
        name: node.data?.name || 'Unnamed Contractor',
        type: node.type,
        partyType: node.data?.partyType,
      }));
    
    // Debug logging
    console.log('🔍 Contractor Detection:', {
      totalNodes: config.graph.nodes.length,
      contractorsFound: contractors.length,
      allNodeTypes: config.graph.nodes.map(n => ({ type: n.type, name: n.data?.name, partyType: n.data?.partyType })),
      contractors: contractors,
    });
    
    return contractors;
  }, [config]);

  // Extract contracts from graph
  const availableContracts = useMemo(() => {
    const contracts = config.graph.nodes
      .filter(node => node.type === 'contract' || node.type === 'sow' || node.type === 'po')
      .map(node => {
        // Extract rate based on contract type
        let rate: number | undefined;
        const contractType = node.data?.contractType || 'hourly';
        
        if (contractType === 'hourly' && node.data?.hourlyRate) {
          rate = node.data.hourlyRate;
        } else if (contractType === 'daily' && node.data?.dailyRate) {
          rate = node.data.dailyRate;
        } else if (contractType === 'fixed' && node.data?.fixedAmount) {
          rate = node.data.fixedAmount;
        }
        
        return {
          id: node.id,
          name: node.data?.name || 'Unnamed Contract',
          type: contractType,
          rate: rate,
          limit: node.data?.limit,
        };
      });
    
    // Debug logging
    console.log('📄 Contract Detection:', {
      contractsFound: contracts.length,
      contracts: contracts,
    });
    
    return contracts;
  }, [config]);

  // Simulate approval flow
  const runSimulation = async (simulationInput: TimesheetSimulationInput) => {
    setIsSimulating(true);
    setAnimationProgress(0);
    setInput(simulationInput);

    // Simulate delay for animation
    await new Promise(resolve => setTimeout(resolve, 300));

    const conflicts: SimulationConflict[] = [];
    const steps: SimulationStep[] = [];

    // Get approval policy
    const approvalPolicy = config.approvalPolicies[0];
    
    if (!approvalPolicy || approvalPolicy.steps.length === 0) {
      setResult({
        status: 'error',
        totalSLA: 0,
        businessDays: 0,
        steps: [],
        conflicts: [{
          severity: 'error',
          code: 'NO_APPROVAL_CHAIN',
          message: 'No approval chain defined in the policy. Add "Approves" edges to define approvers.',
        }],
        timestamp: new Date().toISOString(),
      });
      setIsSimulating(false);
      return;
    }

    // Check for contract limit violations
    const contract = availableContracts.find(c => c.id === simulationInput.contractId);
    if (contract?.limit && simulationInput.hours > contract.limit) {
      conflicts.push({
        severity: 'warning',
        code: 'HOURS_EXCEED_LIMIT',
        message: `Hours (${simulationInput.hours}) exceed contract limit (${contract.limit})`,
      });
    }

    // Process each approval step
    let totalSLA = 0;
    for (let i = 0; i < approvalPolicy.steps.length; i++) {
      const policyStep = approvalPolicy.steps[i];
      const node = config.graph.nodes.find(n => n.id === policyStep.partyId);
      
      if (!node) {
        conflicts.push({
          severity: 'error',
          code: 'MISSING_APPROVER',
          message: `Approver node not found for step ${i + 1}`,
          affectedStep: i + 1,
        });
        continue;
      }

      // Determine rate visibility based on contract parties
      const contract = config.graph.nodes.find(n => n.id === simulationInput.contractId);
      
      // Contract parties (partyA and partyB) can always see the rate
      const isContractParty = contract?.data?.parties?.partyA === policyStep.partyId || 
                              contract?.data?.parties?.partyB === policyStep.partyId;
      
      // Check if this party is in the hideRateFrom list
      const isHiddenFrom = contract?.data?.visibility?.hideRateFrom?.includes(policyStep.partyId) || false;
      
      // Show rate ONLY if they're a contract party AND NOT in hideRateFrom
      const rateVisible = isContractParty && !isHiddenFrom;

      const visibleFields = ['hours', 'week', 'contractor'];
      const maskedFields = rateVisible ? [] : ['rate'];

      // Auto-approve logic
      let action: 'auto-approve' | 'manual-review' | 'rejected' = 'manual-review';
      let reason: string | undefined;
      let stepSLA = 24; // Default 1 business day
      
      // Urgency level affects SLA times
      const urgencyMultiplier = {
        low: 1.5,      // 50% slower (low priority)
        normal: 1.0,   // Standard timing
        high: 0.5,     // 50% faster (high priority)
        urgent: 0.25,  // 75% faster (urgent)
      }[simulationInput.urgencyLevel || 'normal'];

      // Simple auto-approve rules
      if (simulationInput.hours <= 40 && !conflicts.some(c => c.severity === 'error')) {
        // First step can auto-approve if hours are standard
        if (i === 0) {
          action = 'auto-approve';
          reason = 'Standard hours (≤40), auto-approved';
          stepSLA = 0.1; // 6 minutes
        } else {
          // Later steps require manual review
          action = 'manual-review';
          reason = 'Requires manual approval';
        }
      } else {
        action = 'manual-review';
        reason = conflicts.length > 0 ? 'Conflicts detected' : 'Requires manual approval';
      }

      // Final approver (last step)
      if (i === approvalPolicy.steps.length - 1 && action === 'manual-review') {
        // Check budget availability (simplified)
        action = 'auto-approve';
        reason = 'Budget available, auto-approved';
        stepSLA = 0.1;
      }
      
      // Apply urgency multiplier to manual review steps
      if (action === 'manual-review') {
        stepSLA = stepSLA * urgencyMultiplier;
      }

      totalSLA += stepSLA;

      steps.push({
        stepNumber: i + 1,
        partyId: policyStep.partyId,
        partyName: node.data?.name || 'Unknown Party',
        partyType: node.data?.partyType || node.type || 'unknown',
        role: policyStep.role,
        action,
        reason,
        estimatedSLA: stepSLA,
        visibleFields,
        maskedFields,
        rateVisible,
      });

      // Animate progress
      setAnimationProgress((i + 1) / approvalPolicy.steps.length);
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    // Calculate business days (assuming 24/7 for SLA, convert to business days)
    const businessDays = Math.ceil(totalSLA / 8); // 8-hour workday

    const finalStatus: 'approved' | 'rejected' = 
      steps.every(s => s.action === 'auto-approve') || 
      steps.some(s => s.action === 'manual-review')
        ? 'approved'
        : 'rejected';

    setResult({
      status: conflicts.some(c => c.severity === 'error') ? 'error' : finalStatus,
      totalSLA,
      businessDays,
      steps,
      conflicts,
      timestamp: new Date().toISOString(),
      input: simulationInput, // Include input for reference in results
    });

    setIsSimulating(false);
  };

  const handleReset = () => {
    setInput(null);
    setResult(null);
    setAnimationProgress(0);
  };

  const handleExport = () => {
    if (!result) return;

    const exportData = {
      projectName,
      input,
      result,
      config: {
        version: config.version,
        compiledAt: config.compiledAt,
      },
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `simulation-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const hasErrors = result?.conflicts.some(c => c.severity === 'error');
  const hasWarnings = result?.conflicts.some(c => c.severity === 'warning');

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Policy Simulator</h2>
          <p className="text-sm text-gray-600 mt-1">
            Test your approval policies with sample timesheets
          </p>
        </div>
        <div className="flex items-center gap-2">
          {result && (
            <>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </>
          )}
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5 text-blue-600" />
                Input
              </CardTitle>
              <CardDescription>
                Create a sample timesheet to simulate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SimulatorInputForm
                contractors={availableContractors}
                contracts={availableContracts}
                onSubmit={runSimulation}
                disabled={isSimulating}
              />
            </CardContent>
          </Card>

          {/* Quick Stats */}
          {result && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge 
                    variant={hasErrors ? 'destructive' : 'default'}
                    className={hasErrors ? '' : 'bg-green-600'}
                  >
                    {result.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total SLA</span>
                  <span className="font-medium text-gray-900">
                    {result.totalSLA < 1 
                      ? `${Math.round(result.totalSLA * 60)} min`
                      : `${result.totalSLA.toFixed(1)} hrs`
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Business Days</span>
                  <span className="font-medium text-gray-900">
                    ~{result.businessDays} {result.businessDays === 1 ? 'day' : 'days'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Approval Steps</span>
                  <span className="font-medium text-gray-900">
                    {result.steps.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Auto-Approved</span>
                  <span className="font-medium text-gray-900">
                    {result.steps.filter(s => s.action === 'auto-approve').length}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Visualization */}
        <div className="lg:col-span-2">
          {result ? (
            <div className="space-y-6">
              {/* Conflicts */}
              {result.conflicts.length > 0 && (
                <Card className={hasErrors ? 'border-red-300 bg-red-50' : hasWarnings ? 'border-yellow-300 bg-yellow-50' : 'border-blue-300 bg-blue-50'}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className={`h-5 w-5 ${hasErrors ? 'text-red-600' : hasWarnings ? 'text-yellow-600' : 'text-blue-600'}`} />
                      {hasErrors ? 'Errors' : hasWarnings ? 'Warnings' : 'Info'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {result.conflicts.map((conflict, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Badge 
                            variant={conflict.severity === 'error' ? 'destructive' : 'outline'}
                            className="mt-0.5"
                          >
                            {conflict.code}
                          </Badge>
                          <span className="text-sm text-gray-900">{conflict.message}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Flow Visualization */}
              <SimulatorFlowVisualization
                input={input!}
                result={result}
                animationProgress={animationProgress}
                isSimulating={isSimulating}
              />

              {/* Results */}
              <SimulatorResults result={result} />
            </div>
          ) : (
            <Card className="h-full flex items-center justify-center min-h-[400px]">
              <CardContent className="text-center">
                <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-gray-900 mb-2">
                  Ready to Simulate
                </h3>
                <p className="text-sm text-gray-600 max-w-md">
                  Fill in the input form on the left and click "Run Simulation" to see how your approval policy processes a timesheet.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
