import React from 'react';
import { AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import type { ValidationError } from '../../types/workgraph';

interface ValidationPanelProps {
  errors: ValidationError[];
  onClose: () => void;
  onSelectNode: (nodeId: string) => void;
}

export function ValidationPanel({ errors, onClose, onSelectNode }: ValidationPanelProps) {
  const errorCount = errors.filter((e) => e.severity === 'error').length;
  const warningCount = errors.filter((e) => e.severity === 'warning').length;
  const infoCount = errors.filter((e) => e.severity === 'info').length;

  return (
    <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-xl border-2 border-gray-200 z-10 max-w-2xl mx-auto">
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-gray-900">Validation Results</h3>
          <div className="flex items-center gap-2">
            {errorCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {errorCount} Error{errorCount !== 1 ? 's' : ''}
              </Badge>
            )}
            {warningCount > 0 && (
              <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                {warningCount} Warning{warningCount !== 1 ? 's' : ''}
              </Badge>
            )}
            {infoCount > 0 && (
              <Badge variant="outline" className="text-xs">
                {infoCount} Info
              </Badge>
            )}
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="max-h-64 overflow-y-auto p-4 space-y-2">
        {errors.map((error, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors ${
              error.severity === 'error'
                ? 'border-red-200 bg-red-50'
                : error.severity === 'warning'
                ? 'border-yellow-200 bg-yellow-50'
                : 'border-blue-200 bg-blue-50'
            }`}
            onClick={() => error.nodeId && onSelectNode(error.nodeId)}
          >
            <div className="mt-0.5">
              {error.severity === 'error' ? (
                <AlertCircle className="h-5 w-5 text-red-600" />
              ) : error.severity === 'warning' ? (
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              ) : (
                <Info className="h-5 w-5 text-blue-600" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-gray-900">{error.message}</span>
                <Badge variant="outline" className="text-xs">
                  {error.code}
                </Badge>
              </div>
              {error.suggestion && (
                <p className="text-sm text-gray-600">{error.suggestion}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
