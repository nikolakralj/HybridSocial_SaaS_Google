import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';

interface EdgeConfigPopoverProps {
  open: boolean;
  sourceNode: any;
  targetNode: any;
  onSave: (edgeData: any) => void;
  onCancel: () => void;
}

export function EdgeConfigPopover({
  open,
  sourceNode,
  targetNode,
  onSave,
  onCancel,
}: EdgeConfigPopoverProps) {
  const [edgeType, setEdgeType] = useState<string>('approves');
  const [order, setOrder] = useState<number>(1);
  const [amount, setAmount] = useState<string>('');
  const [markup, setMarkup] = useState<string>('');

  const handleSave = () => {
    const data: any = { edgeType };

    if (edgeType === 'approves') {
      data.order = order;
      data.required = true;
    } else if (edgeType === 'funds') {
      data.amount = parseFloat(amount) || 0;
      data.fundingType = 'direct';
    } else if (edgeType === 'subcontracts') {
      data.role = 'sub';
      data.markup = parseFloat(markup) || 0;
    }

    onSave(data);
  };

  const getEdgeDescription = () => {
    switch (edgeType) {
      case 'approves':
        return `${targetNode?.data?.name || 'Target'} will approve work from ${sourceNode?.data?.name || 'Source'}`;
      case 'funds':
        return `${sourceNode?.data?.name || 'Source'} provides funding to ${targetNode?.data?.name || 'Target'}`;
      case 'subcontracts':
        return `${sourceNode?.data?.name || 'Source'} subcontracts to ${targetNode?.data?.name || 'Target'}`;
      case 'billsTo':
        return `${sourceNode?.data?.name || 'Source'} bills to ${targetNode?.data?.name || 'Target'}`;
      case 'assigns':
        return `${sourceNode?.data?.name || 'Source'} assigns work to ${targetNode?.data?.name || 'Target'}`;
      case 'worksOn':
        return `${sourceNode?.data?.name || 'Source'} works on ${targetNode?.data?.name || 'Target'}`;
      default:
        return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configure Edge</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Connection preview */}
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <Badge variant="outline">{sourceNode?.data?.name || 'Source'}</Badge>
            <span className="text-gray-400">→</span>
            <Badge variant="outline">{targetNode?.data?.name || 'Target'}</Badge>
          </div>

          {/* Edge Type */}
          <div>
            <Label htmlFor="edgeType">Edge Type</Label>
            <Select value={edgeType} onValueChange={setEdgeType}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approves">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    Approves
                  </span>
                </SelectItem>
                <SelectItem value="funds">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    Funds
                  </span>
                </SelectItem>
                <SelectItem value="subcontracts">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                    Subcontracts
                  </span>
                </SelectItem>
                <SelectItem value="billsTo">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                    Bills To
                  </span>
                </SelectItem>
                <SelectItem value="assigns">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                    Assigns
                  </span>
                </SelectItem>
                <SelectItem value="worksOn">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-gray-500"></span>
                    Works On
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">{getEdgeDescription()}</p>
          </div>

          {/* Approval-specific fields */}
          {edgeType === 'approves' && (
            <div>
              <Label htmlFor="order">Approval Order</Label>
              <Input
                id="order"
                type="number"
                min="1"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value) || 1)}
                onKeyDown={(e) => e.stopPropagation()}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Step {order} in the approval sequence
              </p>
            </div>
          )}

          {/* Funds-specific fields */}
          {edgeType === 'funds' && (
            <div>
              <Label htmlFor="amount">Funding Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                placeholder="Optional"
                className="mt-1"
              />
            </div>
          )}

          {/* Subcontract-specific fields */}
          {edgeType === 'subcontracts' && (
            <div>
              <Label htmlFor="markup">Markup (%)</Label>
              <Input
                id="markup"
                type="number"
                min="0"
                max="100"
                value={markup}
                onChange={(e) => setMarkup(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                placeholder="Optional"
                className="mt-1"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Create Edge
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
