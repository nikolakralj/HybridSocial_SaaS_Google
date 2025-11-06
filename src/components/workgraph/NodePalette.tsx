import React from 'react';
import { 
  Building2, 
  Users, 
  User, 
  FileText, 
  ScrollText, 
  ShoppingCart, 
  DollarSign, 
  Flag,
  Clock,
  Receipt
} from 'lucide-react';
import { Button } from '../ui/button';

interface NodePaletteProps {
  onAddNode: (nodeType: string) => void;
}

const NODE_TYPES = [
  { type: 'party', label: 'Party/Org', icon: Building2, color: 'bg-purple-100 text-purple-700' },
  { type: 'team', label: 'Team', icon: Users, color: 'bg-blue-100 text-blue-700' },
  { type: 'person', label: 'Person', icon: User, color: 'bg-green-100 text-green-700' },
  { type: 'contract', label: 'Contract', icon: FileText, color: 'bg-yellow-100 text-yellow-700' },
  { type: 'sow', label: 'SOW', icon: ScrollText, color: 'bg-indigo-100 text-indigo-700' },
  { type: 'po', label: 'PO', icon: ShoppingCart, color: 'bg-orange-100 text-orange-700' },
  { type: 'budget', label: 'Budget', icon: DollarSign, color: 'bg-emerald-100 text-emerald-700' },
  { type: 'milestone', label: 'Milestone', icon: Flag, color: 'bg-pink-100 text-pink-700' },
  { type: 'timesheet', label: 'Timesheet', icon: Clock, color: 'bg-cyan-100 text-cyan-700' },
  { type: 'expense', label: 'Expense', icon: Receipt, color: 'bg-red-100 text-red-700' },
];

export function NodePalette({ onAddNode }: NodePaletteProps) {
  return (
    <div className="bg-white rounded-lg shadow-xl p-3 flex flex-col flex-1 min-h-0">
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Node Palette
      </div>
      <div className="space-y-1 overflow-y-auto pr-1 flex-1">
        {NODE_TYPES.map((nodeType) => {
          const Icon = nodeType.icon;
          return (
            <button
              key={nodeType.type}
              onClick={() => onAddNode(nodeType.type)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md transition-colors hover:bg-gray-100 ${nodeType.color} hover:shadow-sm`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">{nodeType.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
