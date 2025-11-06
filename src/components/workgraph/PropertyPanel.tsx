import React, { useState } from 'react';
import { X, Trash2, Building2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { CompanySearchDialog } from './CompanySearchDialog';
import type { BaseNode, BaseEdge } from '../../types/workgraph';

interface PropertyPanelProps {
  node: BaseNode | null;
  edge: BaseEdge | null;
  onUpdateNode: (nodeId: string, updates: any) => void;
  onUpdateEdge: (edgeId: string, updates: any) => void;
  onDelete: () => void;
  allParties: BaseNode[];
}

export function PropertyPanel({
  node,
  edge,
  onUpdateNode,
  onUpdateEdge,
  onDelete,
  allParties,
}: PropertyPanelProps) {
  if (!node && !edge) return null;

  // Check if this is a newly created node (has default "New {type}" name)
  const isNewNode = node && node.data?.name?.startsWith('New ');

  return (
    <div className="absolute right-4 top-4 bottom-4 w-80 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col z-10">
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center justify-between bg-gray-50">
        <h3 className="font-semibold text-gray-900">
          {node ? 'Node Properties' : 'Edge Properties'}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* New Node Tip */}
      {isNewNode && (
        <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
          <div className="flex items-start gap-2">
            <span className="text-blue-600 text-lg">💡</span>
            <div className="text-xs text-blue-900">
              <strong>New node created!</strong> Click the <strong>Clear</strong> button or <strong>X</strong> icon to erase default text, then type your own. Changes save automatically.
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {node && <NodeProperties node={node} onUpdate={onUpdateNode} allParties={allParties} />}
        {edge && <EdgeProperties edge={edge} onUpdate={onUpdateEdge} allParties={allParties} />}
      </div>
    </div>
  );
}

function NodeProperties({ 
  node, 
  onUpdate, 
  allParties 
}: { 
  node: BaseNode; 
  onUpdate: (id: string, updates: any) => void;
  allParties: BaseNode[];
}) {
  const [showCompanySearch, setShowCompanySearch] = useState(false);
  const nameInputRef = React.useRef<HTMLInputElement>(null);
  const partyRoleInputRef = React.useRef<HTMLInputElement>(null);
  const personRoleInputRef = React.useRef<HTMLInputElement>(null);
  const emailInputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (field: string, value: any) => {
    onUpdate(node.id, { [field]: value });
  };

  // Clear button handlers
  const clearName = () => {
    handleChange('name', '');
    setTimeout(() => nameInputRef.current?.focus(), 0);
  };

  const clearPartyRole = () => {
    handleChange('role', '');
    setTimeout(() => partyRoleInputRef.current?.focus(), 0);
  };

  const clearPersonRole = () => {
    handleChange('role', '');
    setTimeout(() => personRoleInputRef.current?.focus(), 0);
  };

  const clearEmail = () => {
    handleChange('email', '');
    setTimeout(() => emailInputRef.current?.focus(), 0);
  };

  // Auto-select text when input is clicked/focused for easier editing
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setTimeout(() => {
      e.target.select();
    }, 0);
  };

  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    setTimeout(() => {
      target.select();
    }, 0);
  };

  // Stop keyboard events from bubbling to window handlers
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  const handleAttachCompany = (company: { id: string; name: string; type: string; logo: string }) => {
    handleChange('name', company.name);
    handleChange('partyType', company.type);
    handleChange('logo', company.logo);
    handleChange('organizationId', company.id);
  };

  return (
    <>
      {/* Common Fields */}
      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="name">Name</Label>
          {node.data?.name && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearName}
              className="h-6 px-2 text-xs text-gray-500 hover:text-red-600"
            >
              Clear
            </Button>
          )}
        </div>
        <div className="relative mt-1">
          <Input
            ref={nameInputRef}
            id="name"
            value={node.data?.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter party name"
            className="font-medium pr-8"
            autoComplete="off"
          />
          {node.data?.name && (
            <button
              onClick={clearName}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div>
        <Label className="text-xs text-gray-500">Node Type</Label>
        <Badge variant="outline" className="mt-1">{node.type}</Badge>
      </div>

      <Separator />

      {/* Party-specific fields */}
      {node.type === 'party' && (
        <>
          {/* Attach existing company button */}
          {!node.data?.organizationId && (
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCompanySearch(true)}
                className="w-full gap-2"
              >
                <Building2 className="h-4 w-4" />
                Attach Existing Company
              </Button>
            </div>
          )}

          {node.data?.organizationId && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <div className="text-xl">{node.data?.logo}</div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-yellow-900">
                    Linked to Organization
                  </div>
                  <div className="text-xs text-yellow-700">
                    Party Type is locked
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="partyType">Party Type</Label>
            <Select
              value={node.data?.partyType || 'company'}
              onValueChange={(value) => handleChange('partyType', value)}
              disabled={!!node.data?.organizationId}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="agency">Agency</SelectItem>
                <SelectItem value="company">Company</SelectItem>
                <SelectItem value="contractor">Contractor</SelectItem>
                <SelectItem value="freelancer">Freelancer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="partyRole">Role/Title</Label>
              {node.data?.role && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearPartyRole}
                  className="h-6 px-2 text-xs text-gray-500 hover:text-red-600"
                >
                  Clear
                </Button>
              )}
            </div>
            <div className="relative mt-1">
              <Input
                ref={partyRoleInputRef}
                id="partyRole"
                value={node.data?.role || ''}
                onChange={(e) => handleChange('role', e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g., Project Manager"
                className="font-medium pr-8"
                autoComplete="off"
              />
              {node.data?.role && (
                <button
                  onClick={clearPartyRole}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <Separator />
          <div className="space-y-3">
            <Label className="text-sm font-medium">Permissions</Label>
            
            <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 transition-colors cursor-pointer">
              <Checkbox
                id="canApprove"
                checked={node.data?.canApprove || false}
                onCheckedChange={(checked) => handleChange('canApprove', checked)}
              />
              <Label htmlFor="canApprove" className="text-sm cursor-pointer flex-1">Can Approve</Label>
              {node.data?.canApprove && (
                <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">
                  Active
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 transition-colors cursor-pointer">
              <Checkbox
                id="canViewRates"
                checked={node.data?.canViewRates || false}
                onCheckedChange={(checked) => handleChange('canViewRates', checked)}
              />
              <Label htmlFor="canViewRates" className="text-sm cursor-pointer flex-1">Can View Rates</Label>
              {node.data?.canViewRates && (
                <Badge variant="outline" className="text-xs bg-green-50 border-green-200 text-green-700">
                  Active
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 transition-colors cursor-pointer">
              <Checkbox
                id="canEditTimesheets"
                checked={node.data?.canEditTimesheets || false}
                onCheckedChange={(checked) => handleChange('canEditTimesheets', checked)}
              />
              <Label htmlFor="canEditTimesheets" className="text-sm cursor-pointer flex-1">Can Edit Timesheets</Label>
              {node.data?.canEditTimesheets && (
                <Badge variant="outline" className="text-xs bg-purple-50 border-purple-200 text-purple-700">
                  Active
                </Badge>
              )}
            </div>
          </div>
        </>
      )}

      {/* Contract-specific fields */}
      {node.type === 'contract' && (
        <>
          <div>
            <Label htmlFor="contractType">Contract Type</Label>
            <Select
              value={node.data?.contractType || 'hourly'}
              onValueChange={(value) => handleChange('contractType', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="fixed">Fixed Price</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {node.data?.contractType === 'hourly' && (
            <div>
              <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
              <Input
                id="hourlyRate"
                type="number"
                value={node.data?.hourlyRate || ''}
                onChange={(e) => handleChange('hourlyRate', parseFloat(e.target.value))}
                onFocus={handleInputFocus}
                onClick={handleInputClick}
                onKeyDown={handleKeyDown}
                className="mt-1"
              />
            </div>
          )}

          {node.data?.contractType === 'daily' && (
            <div>
              <Label htmlFor="dailyRate">Daily Rate ($)</Label>
              <Input
                id="dailyRate"
                type="number"
                value={node.data?.dailyRate || ''}
                onChange={(e) => handleChange('dailyRate', parseFloat(e.target.value))}
                onFocus={handleInputFocus}
                onClick={handleInputClick}
                onKeyDown={handleKeyDown}
                className="mt-1"
              />
            </div>
          )}

          {node.data?.contractType === 'fixed' && (
            <div>
              <Label htmlFor="fixedAmount">Fixed Amount ($)</Label>
              <Input
                id="fixedAmount"
                type="number"
                value={node.data?.fixedAmount || ''}
                onChange={(e) => handleChange('fixedAmount', parseFloat(e.target.value))}
                onFocus={handleInputFocus}
                onClick={handleInputClick}
                onKeyDown={handleKeyDown}
                className="mt-1"
              />
            </div>
          )}

          <Separator />
          
          {/* Contract Parties */}
          <div className="space-y-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-blue-600">🤝</span>
              <Label className="text-sm font-medium text-blue-900">Contract Parties</Label>
            </div>
            <p className="text-xs text-blue-700">
              This contract is between these two parties:
            </p>
            
            <div>
              <Label htmlFor="partyA" className="text-xs text-blue-700">Party A (Vendor/Worker)</Label>
              <Select
                value={node.data?.parties?.partyA || 'none'}
                onValueChange={(value) => handleChange('parties', {
                  ...node.data?.parties,
                  partyA: value === 'none' ? undefined : value,
                })}
              >
                <SelectTrigger className="mt-1 bg-white">
                  <SelectValue placeholder="Select party A" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {allParties.map((party) => (
                    <SelectItem key={party.id} value={party.id}>
                      {party.data?.name || 'Unnamed Party'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="partyB" className="text-xs text-blue-700">Party B (Client/Agency)</Label>
              <Select
                value={node.data?.parties?.partyB || 'none'}
                onValueChange={(value) => handleChange('parties', {
                  ...node.data?.parties,
                  partyB: value === 'none' ? undefined : value,
                })}
              >
                <SelectTrigger className="mt-1 bg-white">
                  <SelectValue placeholder="Select party B" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {allParties.map((party) => (
                    <SelectItem key={party.id} value={party.id}>
                      {party.data?.name || 'Unnamed Party'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {node.data?.parties?.partyA && node.data?.parties?.partyB && (
              <div className="text-xs text-blue-700 bg-white p-2 rounded border border-blue-200">
                ✓ Only <strong>{allParties.find(p => p.id === node.data?.parties?.partyA)?.data?.name}</strong> and <strong>{allParties.find(p => p.id === node.data?.parties?.partyB)?.data?.name}</strong> can see this rate by default.
              </div>
            )}
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span>🔐</span>
              <Label className="text-sm font-medium">Rate Visibility</Label>
            </div>
            <p className="text-xs text-gray-500">
              Additional parties to hide this contract's rate from:
            </p>
            
            {allParties.filter(p => 
              p.id !== node.data?.parties?.partyA && 
              p.id !== node.data?.parties?.partyB
            ).length === 0 ? (
              <p className="text-xs text-gray-500 italic p-2 bg-gray-50 rounded">
                No other parties to hide from. Rate is automatically hidden from non-contract parties.
              </p>
            ) : (
              <>
                {allParties.filter(p => 
                  p.id !== node.data?.parties?.partyA && 
                  p.id !== node.data?.parties?.partyB
                ).map((party) => (
                  <div key={party.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`hide-${party.id}`}
                      checked={
                        node.data?.visibility?.hideRateFrom?.includes(party.id) || false
                      }
                      onCheckedChange={(checked) => {
                        const hideRateFrom = node.data?.visibility?.hideRateFrom || [];
                        const newHideRateFrom = checked
                          ? [...hideRateFrom, party.id]
                          : hideRateFrom.filter((id: string) => id !== party.id);
                        handleChange('visibility', {
                          ...node.data?.visibility,
                          hideRateFrom: newHideRateFrom,
                        });
                      }}
                    />
                    <Label htmlFor={`hide-${party.id}`} className="text-sm">
                      {party.data?.name || 'Unnamed Party'}
                    </Label>
                  </div>
                ))}
              </>
            )}
          </div>
          
          <Separator />
          
          {/* Optional: Hour Limits */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">📊 Hour Limits (Optional)</Label>
            
            <div>
              <Label htmlFor="weeklyLimit" className="text-xs text-gray-600">Weekly Hour Limit</Label>
              <Input
                id="weeklyLimit"
                type="number"
                min="0"
                step="1"
                value={node.data?.weeklyHourLimit || ''}
                onChange={(e) => handleChange('weeklyHourLimit', e.target.value ? parseFloat(e.target.value) : undefined)}
                onFocus={handleInputFocus}
                onClick={handleInputClick}
                onKeyDown={handleKeyDown}
                placeholder="e.g., 40"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty for no limit</p>
            </div>
            
            <div>
              <Label htmlFor="monthlyLimit" className="text-xs text-gray-600">Monthly Hour Limit</Label>
              <Input
                id="monthlyLimit"
                type="number"
                min="0"
                step="1"
                value={node.data?.monthlyHourLimit || ''}
                onChange={(e) => handleChange('monthlyHourLimit', e.target.value ? parseFloat(e.target.value) : undefined)}
                onFocus={handleInputFocus}
                onClick={handleInputClick}
                onKeyDown={handleKeyDown}
                placeholder="e.g., 160"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty for no limit</p>
            </div>
          </div>
        </>
      )}

      {/* Person-specific fields */}
      {node.type === 'person' && (
        <>
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email">Email</Label>
              {node.data?.email && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearEmail}
                  className="h-6 px-2 text-xs text-gray-500 hover:text-red-600"
                >
                  Clear
                </Button>
              )}
            </div>
            <div className="relative mt-1">
              <Input
                ref={emailInputRef}
                id="email"
                type="email"
                value={node.data?.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="person@example.com"
                className="font-medium pr-8"
                autoComplete="off"
              />
              {node.data?.email && (
                <button
                  onClick={clearEmail}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="personRole">Role</Label>
              {node.data?.role && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearPersonRole}
                  className="h-6 px-2 text-xs text-gray-500 hover:text-red-600"
                >
                  Clear
                </Button>
              )}
            </div>
            <div className="relative mt-1">
              <Input
                ref={personRoleInputRef}
                id="personRole"
                value={node.data?.role || ''}
                onChange={(e) => handleChange('role', e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g., Senior Developer"
                className="font-medium pr-8"
                autoComplete="off"
              />
              {node.data?.role && (
                <button
                  onClick={clearPersonRole}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Company Search Dialog */}
      {node.type === 'party' && (
        <CompanySearchDialog
          open={showCompanySearch}
          onSelect={handleAttachCompany}
          onClose={() => setShowCompanySearch(false)}
        />
      )}
    </>
  );
}

function EdgeProperties({
  edge,
  onUpdate,
  allParties,
}: {
  edge: BaseEdge;
  onUpdate: (id: string, updates: any) => void;
  allParties: BaseNode[];
}) {
  const handleChange = (field: string, value: any) => {
    onUpdate(edge.id, { [field]: value });
  };

  // Auto-select text when input is clicked/focused for easier editing
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setTimeout(() => {
      e.target.select();
    }, 0);
  };

  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    setTimeout(() => {
      target.select();
    }, 0);
  };

  // Stop keyboard events from bubbling to window handlers
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  return (
    <>
      <div>
        <Label htmlFor="edgeType">Edge Type</Label>
        <Select
          value={edge.data?.edgeType || 'approves'}
          onValueChange={(value) => handleChange('edgeType', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="approves">Approves</SelectItem>
            <SelectItem value="funds">Funds</SelectItem>
            <SelectItem value="subcontracts">Subcontracts</SelectItem>
            <SelectItem value="billsTo">Bills To</SelectItem>
            <SelectItem value="assigns">Assigns</SelectItem>
            <SelectItem value="worksOn">Works On</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {edge.data?.edgeType === 'approves' && (
        <>
          <div>
            <Label htmlFor="order">Approval Order</Label>
            <Input
              id="order"
              type="number"
              min="1"
              value={edge.data?.order || 1}
              onChange={(e) => handleChange('order', parseInt(e.target.value))}
              onFocus={handleInputFocus}
              onClick={handleInputClick}
              onKeyDown={handleKeyDown}
              className="mt-1"
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="required"
              checked={edge.data?.required !== false}
              onCheckedChange={(checked) => handleChange('required', checked)}
            />
            <Label htmlFor="required" className="text-sm">Required Approval</Label>
          </div>
        </>
      )}

      {edge.data?.edgeType === 'funds' && (
        <>
          <div>
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              value={edge.data?.amount || ''}
              onChange={(e) => handleChange('amount', parseFloat(e.target.value))}
              onFocus={handleInputFocus}
              onClick={handleInputClick}
              onKeyDown={handleKeyDown}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="fundingType">Funding Type</Label>
            <Select
              value={edge.data?.fundingType || 'direct'}
              onValueChange={(value) => handleChange('fundingType', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="direct">Direct</SelectItem>
                <SelectItem value="through_po">Through PO</SelectItem>
                <SelectItem value="through_budget">Through Budget</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {edge.data?.edgeType === 'subcontracts' && (
        <>
          <div>
            <Label htmlFor="role">Contractor Role</Label>
            <Select
              value={edge.data?.role || 'sub'}
              onValueChange={(value) => handleChange('role', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prime">Prime Contractor</SelectItem>
                <SelectItem value="sub">Subcontractor</SelectItem>
                <SelectItem value="sub-sub">Sub-subcontractor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="markup">Markup (%)</Label>
            <Input
              id="markup"
              type="number"
              min="0"
              max="100"
              value={edge.data?.markup || ''}
              onChange={(e) => handleChange('markup', parseFloat(e.target.value))}
              onFocus={handleInputFocus}
              onClick={handleInputClick}
              onKeyDown={handleKeyDown}
              className="mt-1"
            />
          </div>
        </>
      )}
    </>
  );
}
