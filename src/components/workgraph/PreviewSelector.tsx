import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import type { BaseNode } from '../../types/workgraph';

interface PreviewSelectorProps {
  parties: BaseNode[];
  selectedPartyId: string | null;
  onChange: (partyId: string | null) => void;
}

export function PreviewSelector({ parties, selectedPartyId, onChange }: PreviewSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Eye className="h-4 w-4 text-gray-500" />
      <Select
        value={selectedPartyId || 'none'}
        onValueChange={(value) => onChange(value === 'none' ? null : value)}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Preview as..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">
            <div className="flex items-center gap-2">
              <EyeOff className="h-4 w-4" />
              <span>Full View (No Preview)</span>
            </div>
          </SelectItem>
          {parties.map((party) => (
            <SelectItem key={party.id} value={party.id}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    party.data?.partyType === 'client'
                      ? 'bg-purple-600'
                      : party.data?.partyType === 'agency'
                      ? 'bg-blue-600'
                      : party.data?.partyType === 'company'
                      ? 'bg-green-600'
                      : 'bg-gray-600'
                  }`}
                />
                <span>{party.data?.name || 'Unnamed Party'}</span>
                <span className="text-xs text-gray-500">
                  ({party.data?.partyType})
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
