import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { 
  CheckCircle, 
  Clock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Zap,
  User,
  AlertCircle
} from 'lucide-react';
import type { TimesheetSimulationInput, SimulationResult } from './PolicySimulator';

interface SimulatorFlowVisualizationProps {
  input: TimesheetSimulationInput;
  result: SimulationResult;
  animationProgress: number;
  isSimulating: boolean;
}

export function SimulatorFlowVisualization({ 
  input, 
  result, 
  animationProgress,
  isSimulating 
}: SimulatorFlowVisualizationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRight className="h-5 w-5 text-blue-600" />
          Approval Flow
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Timesheet Summary */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-900">Timesheet Details</span>
            </div>
            <Badge variant="outline" className="bg-white">
              {input.weekStartDate}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-blue-700">Contractor:</span>
              <span className="ml-2 font-medium text-blue-900">{input.contractorName}</span>
            </div>
            <div>
              <span className="text-blue-700">Hours:</span>
              <span className="ml-2 font-medium text-blue-900">{input.hours} hrs</span>
            </div>
            {input.rate && (
              <div>
                <span className="text-blue-700">Rate:</span>
                <span className="ml-2 font-medium text-blue-900">${input.rate}/hr</span>
              </div>
            )}
            {input.taskDescription && (
              <div className="col-span-2">
                <span className="text-blue-700">Task:</span>
                <span className="ml-2 text-blue-900">{input.taskDescription}</span>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Flow Steps */}
        <div className="space-y-3">
          {result.steps.map((step, index) => {
            const isActive = isSimulating && animationProgress >= (index / result.steps.length);
            const isComplete = !isSimulating || animationProgress >= ((index + 1) / result.steps.length);

            return (
              <div key={index}>
                <div 
                  className={`
                    relative p-4 rounded-lg border-2 transition-all duration-500
                    ${isActive ? 'border-blue-500 bg-blue-50 shadow-md scale-[1.02]' : ''}
                    ${isComplete && !isActive ? 'border-gray-200 bg-white' : ''}
                    ${!isActive && !isComplete ? 'border-gray-200 bg-gray-50 opacity-50' : ''}
                  `}
                >
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {/* Step Number */}
                      <div className={`
                        flex items-center justify-center w-8 h-8 rounded-full font-semibold
                        ${step.action === 'auto-approve' ? 'bg-green-100 text-green-700' : 
                          step.action === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'}
                      `}>
                        {step.stepNumber}
                      </div>

                      {/* Party Info */}
                      <div>
                        <div className="font-medium text-gray-900">
                          {step.partyName}
                        </div>
                        <div className="text-sm text-gray-600 capitalize">
                          {step.role} • {step.partyType}
                        </div>
                      </div>
                    </div>

                    {/* Action Badge */}
                    <Badge 
                      className={
                        step.action === 'auto-approve' 
                          ? 'bg-green-600' 
                          : step.action === 'rejected'
                          ? 'bg-red-600'
                          : 'bg-blue-600'
                      }
                    >
                      {step.action === 'auto-approve' && <Zap className="h-3 w-3 mr-1" />}
                      {step.action === 'rejected' && <AlertCircle className="h-3 w-3 mr-1" />}
                      {step.action === 'manual-review' && <Clock className="h-3 w-3 mr-1" />}
                      {step.action === 'auto-approve' ? 'Auto-Approve' : 
                       step.action === 'rejected' ? 'Rejected' : 'Manual Review'}
                    </Badge>
                  </div>

                  {/* Reason */}
                  {step.reason && (
                    <div className="mb-3 text-sm text-gray-700 italic">
                      {step.reason}
                    </div>
                  )}

                  {/* Visibility Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Eye className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-gray-600">Visible:</span>
                      <div className="flex flex-wrap gap-1">
                        {step.visibleFields.map(field => {
                          // Show actual values for visible fields
                          let displayValue = field;
                          if (field === 'hours') {
                            displayValue = `hours: ${input.hours}`;
                          } else if (field === 'week') {
                            displayValue = `week: ${input.weekStartDate}`;
                          } else if (field === 'contractor') {
                            displayValue = `contractor: ${input.contractorName}`;
                          } else if (field === 'task') {
                            displayValue = `task: ${input.taskDescription || 'N/A'}`;
                          }
                          
                          return (
                            <Badge key={field} variant="outline" className="text-xs">
                              {displayValue}
                            </Badge>
                          );
                        })}
                        {step.rateVisible && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-300">
                            rate: ${input.rate || '???'}/hr
                          </Badge>
                        )}
                      </div>
                    </div>
                    {step.maskedFields.length > 0 && (
                      <div className="flex items-center gap-2">
                        <EyeOff className="h-3 w-3 text-gray-500" />
                        <span className="text-xs text-gray-600">Masked:</span>
                        <div className="flex flex-wrap gap-1">
                          {step.maskedFields.map(field => (
                            <Badge key={field} variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-300">
                              {field}: •••
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* SLA */}
                  <div className="mt-3 pt-3 border-t flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Clock className="h-3 w-3" />
                      <span>Estimated Time:</span>
                    </div>
                    <span className="text-xs font-medium text-gray-900">
                      {step.estimatedSLA < 1 
                        ? `${Math.round(step.estimatedSLA * 60)} minutes`
                        : `${step.estimatedSLA} hours`
                      }
                    </span>
                  </div>

                  {/* Animation overlay */}
                  {isActive && isSimulating && (
                    <div className="absolute inset-0 bg-blue-500 opacity-10 rounded-lg animate-pulse" />
                  )}

                  {/* Checkmark for completed */}
                  {isComplete && !isSimulating && step.action === 'auto-approve' && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  )}
                </div>

                {/* Arrow connector */}
                {index < result.steps.length - 1 && (
                  <div className="flex justify-center my-2">
                    <ArrowRight className={`h-5 w-5 ${isComplete ? 'text-gray-400' : 'text-gray-300'}`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Final Status */}
        {!isSimulating && (
          <div className={`
            p-4 rounded-lg border-2
            ${result.status === 'approved' || result.status === 'pending' 
              ? 'border-green-500 bg-green-50' 
              : 'border-red-500 bg-red-50'}
          `}>
            <div className="flex items-center gap-3">
              {result.status === 'approved' || result.status === 'pending' ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <AlertCircle className="h-6 w-6 text-red-600" />
              )}
              <div>
                <div className={`font-semibold ${
                  result.status === 'approved' || result.status === 'pending'
                    ? 'text-green-900' 
                    : 'text-red-900'
                }`}>
                  {result.status === 'approved' && 'Timesheet Approved'}
                  {result.status === 'pending' && 'Approval Pending'}
                  {result.status === 'rejected' && 'Timesheet Rejected'}
                  {result.status === 'error' && 'Configuration Error'}
                </div>
                <div className="text-sm text-gray-700 mt-1">
                  Total processing time: ~{result.businessDays} business {result.businessDays === 1 ? 'day' : 'days'}
                  {' '}({result.totalSLA.toFixed(1)} hours)
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
