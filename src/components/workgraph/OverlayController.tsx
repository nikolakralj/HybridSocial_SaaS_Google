import React from 'react';
import { Layers, GitBranch, DollarSign, Users, Lock } from 'lucide-react';
import { Badge } from '../ui/badge';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '../ui/toggle-group';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

export type OverlayMode = 'full' | 'approvals' | 'money' | 'people' | 'access';

interface OverlayControllerProps {
  mode: OverlayMode;
  onChange: (mode: OverlayMode) => void;
  stats?: {
    approvalSteps: number;
    moneyFlows: number;
    peopleCount: number;
    maskedFields: number;
  };
}

export function OverlayController({ mode, onChange, stats }: OverlayControllerProps) {
  return (
    <TooltipProvider>
      <div className="bg-white rounded-lg shadow-xl p-3 flex-shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <Layers className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">View Mode</span>
        </div>
        
        <ToggleGroup
          type="single"
          value={mode}
          onValueChange={(value) => value && onChange(value as OverlayMode)}
          className="flex flex-col gap-1"
        >
          {/* Full View */}
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="full"
                className="w-full justify-start gap-2 data-[state=on]:bg-blue-100 data-[state=on]:text-blue-900"
              >
                <Layers className="h-4 w-4" />
                <span className="flex-1 text-left">Full View</span>
                <kbd className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">1</kbd>
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Show all nodes and edges</p>
            </TooltipContent>
          </Tooltip>

          {/* Approvals Overlay */}
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="approvals"
                className="w-full justify-start gap-2 data-[state=on]:bg-blue-100 data-[state=on]:text-blue-900"
              >
                <GitBranch className="h-4 w-4" />
                <span className="flex-1 text-left">Approvals</span>
                {stats && stats.approvalSteps > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {stats.approvalSteps}
                  </Badge>
                )}
                <kbd className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">2</kbd>
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Show only approval chain with step numbers</p>
            </TooltipContent>
          </Tooltip>

          {/* Money Flow Overlay */}
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="money"
                className="w-full justify-start gap-2 data-[state=on]:bg-green-100 data-[state=on]:text-green-900"
              >
                <DollarSign className="h-4 w-4" />
                <span className="flex-1 text-left">Money Flow</span>
                {stats && stats.moneyFlows > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {stats.moneyFlows}
                  </Badge>
                )}
                <kbd className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">3</kbd>
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Show billing and invoice flows with totals</p>
            </TooltipContent>
          </Tooltip>

          {/* People Overlay */}
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="people"
                className="w-full justify-start gap-2 data-[state=on]:bg-purple-100 data-[state=on]:text-purple-900"
              >
                <Users className="h-4 w-4" />
                <span className="flex-1 text-left">People</span>
                {stats && stats.peopleCount > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {stats.peopleCount}
                  </Badge>
                )}
                <kbd className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">4</kbd>
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Show capacity heatmap (utilization colors)</p>
            </TooltipContent>
          </Tooltip>

          {/* Access Overlay */}
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="access"
                className="w-full justify-start gap-2 data-[state=on]:bg-red-100 data-[state=on]:text-red-900"
              >
                <Lock className="h-4 w-4" />
                <span className="flex-1 text-left">Access</span>
                {stats && stats.maskedFields > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {stats.maskedFields}
                  </Badge>
                )}
                <kbd className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">5</kbd>
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Show visibility rules and masked fields</p>
            </TooltipContent>
          </Tooltip>
        </ToggleGroup>

        {/* Mode Description */}
        <div className="mt-3 pt-3 border-t text-xs text-gray-600">
          {getModeDescription(mode)}
        </div>
      </div>
    </TooltipProvider>
  );
}

function getModeDescription(mode: OverlayMode): string {
  switch (mode) {
    case 'full':
      return 'Complete project view with all relationships';
    case 'approvals':
      return 'Highlights approval chain with sequential steps';
    case 'money':
      return 'Shows financial flows and running totals';
    case 'people':
      return 'Capacity and utilization heatmap';
    case 'access':
      return 'Visibility rules and permission boundaries';
  }
}
