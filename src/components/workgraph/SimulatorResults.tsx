import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle,
  Zap,
  Eye,
  BarChart3,
  Info
} from 'lucide-react';
import type { SimulationResult } from './PolicySimulator';

interface SimulatorResultsProps {
  result: SimulationResult;
}

export function SimulatorResults({ result }: SimulatorResultsProps) {
  const autoApprovedCount = result.steps.filter(s => s.action === 'auto-approve').length;
  const manualReviewCount = result.steps.filter(s => s.action === 'manual-review').length;
  const totalSteps = result.steps.length;

  const automationRate = totalSteps > 0 ? (autoApprovedCount / totalSteps) * 100 : 0;

  // Urgency level badge color mapping
  const urgencyColors = {
    low: 'bg-blue-100 text-blue-700 border-blue-300',
    normal: 'bg-green-100 text-green-700 border-green-300',
    high: 'bg-amber-100 text-amber-700 border-amber-300',
    urgent: 'bg-red-100 text-red-700 border-red-300',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          Analysis & Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Submission Details */}
        {(result.input?.urgencyLevel || result.input?.submissionNotes) && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <Info className="h-4 w-4 text-gray-600" />
              Submission Details
            </h4>
            
            {result.input?.urgencyLevel && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Urgency:</span>
                <Badge 
                  variant="outline" 
                  className={urgencyColors[result.input.urgencyLevel]}
                >
                  {result.input.urgencyLevel === 'low' && '🔵 Low Priority'}
                  {result.input.urgencyLevel === 'normal' && '🟢 Normal'}
                  {result.input.urgencyLevel === 'high' && '🟡 High Priority'}
                  {result.input.urgencyLevel === 'urgent' && '🔴 Urgent'}
                </Badge>
              </div>
            )}
            
            {result.input?.submissionNotes && (
              <div>
                <span className="text-sm text-gray-600 block mb-1">Notes:</span>
                <p className="text-sm text-gray-800 bg-white p-3 rounded border border-gray-200 italic">
                  "{result.input.submissionNotes}"
                </p>
              </div>
            )}
          </div>
        )}

        {/* Efficiency Metrics */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            Efficiency Metrics
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {/* Automation Rate */}
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-green-700">Automation Rate</span>
                <Zap className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-2xl font-semibold text-green-900">
                {automationRate.toFixed(0)}%
              </div>
              <div className="text-xs text-green-600 mt-1">
                {autoApprovedCount} of {totalSteps} steps auto-approved
              </div>
            </div>

            {/* Processing Time */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-blue-700">Processing Time</span>
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-2xl font-semibold text-blue-900">
                {result.totalSLA < 1 
                  ? `${Math.round(result.totalSLA * 60)}m`
                  : `${result.totalSLA.toFixed(1)}h`
                }
              </div>
              <div className="text-xs text-blue-600 mt-1">
                ~{result.businessDays} business {result.businessDays === 1 ? 'day' : 'days'}
              </div>
            </div>

            {/* Manual Reviews */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-amber-700">Manual Reviews</span>
                <Eye className="h-4 w-4 text-amber-600" />
              </div>
              <div className="text-2xl font-semibold text-amber-900">
                {manualReviewCount}
              </div>
              <div className="text-xs text-amber-600 mt-1">
                Require human approval
              </div>
            </div>

            {/* Status */}
            <div className={`p-3 border rounded-lg ${
              result.status === 'approved' ? 'bg-green-50 border-green-200' :
              result.status === 'error' ? 'bg-red-50 border-red-200' :
              'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm ${
                  result.status === 'approved' ? 'text-green-700' :
                  result.status === 'error' ? 'text-red-700' :
                  'text-blue-700'
                }`}>
                  Final Status
                </span>
                <CheckCircle className={`h-4 w-4 ${
                  result.status === 'approved' ? 'text-green-600' :
                  result.status === 'error' ? 'text-red-600' :
                  'text-blue-600'
                }`} />
              </div>
              <div className={`text-2xl font-semibold capitalize ${
                result.status === 'approved' ? 'text-green-900' :
                result.status === 'error' ? 'text-red-900' :
                'text-blue-900'
              }`}>
                {result.status}
              </div>
              <div className={`text-xs mt-1 ${
                result.status === 'approved' ? 'text-green-600' :
                result.status === 'error' ? 'text-red-600' :
                'text-blue-600'
              }`}>
                {result.status === 'approved' && 'Ready for payment'}
                {result.status === 'error' && 'Fix policy errors'}
                {result.status === 'pending' && 'Awaiting approval'}
                {result.status === 'rejected' && 'Needs revision'}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Step-by-Step Breakdown */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-gray-600" />
            Step-by-Step Breakdown
          </h4>
          <div className="space-y-2">
            {result.steps.map((step, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-2 rounded bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                    ${step.action === 'auto-approve' ? 'bg-green-100 text-green-700' :
                      step.action === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'}
                  `}>
                    {step.stepNumber}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-900">{step.partyName}</span>
                    <span className="text-gray-600 ml-2">• {step.role}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge 
                    variant="outline"
                    className={
                      step.action === 'auto-approve' 
                        ? 'bg-green-50 text-green-700 border-green-300'
                        : step.action === 'rejected'
                        ? 'bg-red-50 text-red-700 border-red-300'
                        : 'bg-blue-50 text-blue-700 border-blue-300'
                    }
                  >
                    {step.action === 'auto-approve' ? 'Auto' : 
                     step.action === 'rejected' ? 'Rejected' : 'Manual'}
                  </Badge>
                  <span className="text-xs text-gray-600 w-16 text-right">
                    {step.estimatedSLA < 1 
                      ? `${Math.round(step.estimatedSLA * 60)}m`
                      : `${step.estimatedSLA}h`
                    }
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Recommendations */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-600" />
            Recommendations
          </h4>
          <div className="space-y-2">
            {automationRate < 50 && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm font-medium text-blue-900 mb-1">
                  Low Automation Rate
                </div>
                <div className="text-sm text-blue-700">
                  Consider adding auto-approval rules for standard timesheets (≤40 hours) to speed up processing.
                </div>
              </div>
            )}
            {result.totalSLA > 48 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="text-sm font-medium text-amber-900 mb-1">
                  Long Processing Time
                </div>
                <div className="text-sm text-amber-700">
                  The approval chain takes over 2 business days. Consider reducing steps or enabling parallel approvals.
                </div>
              </div>
            )}
            {result.conflicts.length > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-sm font-medium text-red-900 mb-1">
                  Policy Issues Detected
                </div>
                <div className="text-sm text-red-700">
                  Fix {result.conflicts.length} {result.conflicts.length === 1 ? 'issue' : 'issues'} in your approval policy before deployment.
                </div>
              </div>
            )}
            {result.input?.urgencyLevel === 'urgent' && result.totalSLA > 4 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-sm font-medium text-red-900 mb-1">
                  🚨 Urgent Timesheet with Slow Processing
                </div>
                <div className="text-sm text-red-700">
                  This timesheet is marked urgent but will take {result.totalSLA.toFixed(1)}h to process. Consider adding urgent escalation rules or reducing approval steps for critical submissions.
                </div>
              </div>
            )}
            {result.input?.urgencyLevel === 'high' && result.totalSLA > 12 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="text-sm font-medium text-amber-900 mb-1">
                  ⚡ High Priority with Moderate Delay
                </div>
                <div className="text-sm text-amber-700">
                  High priority timesheet will take {result.totalSLA.toFixed(1)}h. Consider enabling faster track for high-priority submissions.
                </div>
              </div>
            )}
            {automationRate >= 50 && result.totalSLA <= 24 && result.conflicts.length === 0 && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-sm font-medium text-green-900 mb-1">
                  Optimized Policy
                </div>
                <div className="text-sm text-green-700">
                  Your approval policy is well-optimized with good automation and fast processing times. ✨
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Timestamp */}
        <div className="pt-4 border-t">
          <div className="text-xs text-gray-500">
            Simulation run at: {new Date(result.timestamp).toLocaleString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
