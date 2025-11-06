import { useMemo } from 'react';
import { FileText } from 'lucide-react';
import { ScrollArea } from '../../ui/scroll-area';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Separator } from '../../ui/separator';
import { ContractGroupCard } from './ContractGroupCard';
import { groupEntriesByContract, getContractGroupTotals } from '../../../utils/api/contract-grouping';
import type { TimesheetEntry } from '../../../utils/api/timesheets';
import type { Contract } from '../../../types/contracts';
import type { Person } from '../../../types/people';

interface ApprovalQueueProps {
  entries: TimesheetEntry[];
  contracts: Contract[];
  people: Person[];
  onApproveContract: (contractId: string, entryIds: string[]) => void;
  onReviewContract: (contractId: string) => void;
  onViewContract: (contractId: string) => void;
}

export function ApprovalQueue({
  entries,
  contracts,
  people,
  onApproveContract,
  onReviewContract,
  onViewContract,
}: ApprovalQueueProps) {
  
  // Group entries by contract
  const contractGroups = useMemo(() => {
    return groupEntriesByContract(entries, contracts, people);
  }, [entries, contracts, people]);
  
  // Separate individual vs company contracts
  const individualGroups = contractGroups.filter(g => g.contractType === 'individual');
  const companyGroups = contractGroups.filter(g => g.contractType === 'company');
  
  // Overall totals
  const totals = useMemo(() => {
    return getContractGroupTotals(contractGroups);
  }, [contractGroups]);
  
  const formatWeekRange = (entries: TimesheetEntry[]) => {
    if (entries.length === 0) return 'No entries';
    
    const dates = entries.map(e => e.date).sort((a, b) => a.getTime() - b.getTime());
    const start = dates[0];
    const end = dates[dates.length - 1];
    
    return new Intl.DateTimeFormat('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    }).format(start) + (start.getTime() !== end.getTime() ? ' - ' + new Intl.DateTimeFormat('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    }).format(end) : '');
  };
  
  if (contractGroups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-12 text-center">
        <FileText className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Pending Approvals</h3>
        <p className="text-muted-foreground max-w-md">
          There are no timesheet entries waiting for your approval at this time.
        </p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      
      {/* Header */}
      <div className="p-6 border-b bg-background sticky top-0 z-10">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-semibold">Approval Queue</h2>
          <Badge variant="secondary" className="text-sm">
            {totals.contractCount} {totals.contractCount === 1 ? 'contract' : 'contracts'}
          </Badge>
        </div>
        <p className="text-muted-foreground mb-4">
          Week of {formatWeekRange(entries)}
        </p>
        
        {/* Summary stats */}
        <div className="flex items-center gap-6">
          <div>
            <div className="text-sm text-muted-foreground">Total Hours</div>
            <div className="text-2xl font-bold">{totals.totalHours}h</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Total Amount</div>
            <div className="text-2xl font-bold text-accent-brand">
              ${totals.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Contract groups */}
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          
          {/* Individual Contractors Section */}
          {individualGroups.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                <h3 className="font-semibold">
                  Individual Contractors
                </h3>
                <Badge variant="outline" className="text-xs">
                  {individualGroups.length} {individualGroups.length === 1 ? 'contract' : 'contracts'}
                </Badge>
                <span className="text-sm text-muted-foreground ml-auto">
                  {individualGroups.reduce((sum, g) => sum + g.totalHours, 0)}h · 
                  ${individualGroups.reduce((sum, g) => sum + g.totalAmount, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              
              <div className="space-y-3">
                {individualGroups.map(group => (
                  <ContractGroupCard
                    key={group.contract.id}
                    group={group}
                    onApproveAll={onApproveContract}
                    onReviewIndividual={onReviewContract}
                    onViewContract={onViewContract}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Separator */}
          {individualGroups.length > 0 && companyGroups.length > 0 && (
            <Separator className="my-6" />
          )}
          
          {/* Company Contracts Section */}
          {companyGroups.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0" />
                <h3 className="font-semibold">
                  Company Contracts
                </h3>
                <Badge variant="outline" className="text-xs">
                  {companyGroups.length} {companyGroups.length === 1 ? 'contract' : 'contracts'}
                </Badge>
                <span className="text-sm text-muted-foreground ml-auto">
                  {companyGroups.reduce((sum, g) => sum + g.totalHours, 0)}h · 
                  ${companyGroups.reduce((sum, g) => sum + g.totalAmount, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              
              <div className="space-y-3">
                {companyGroups.map(group => (
                  <ContractGroupCard
                    key={group.contract.id}
                    group={group}
                    onApproveAll={onApproveContract}
                    onReviewIndividual={onReviewContract}
                    onViewContract={onViewContract}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      {/* Footer actions */}
      <div className="p-6 border-t bg-accent/5 flex items-center justify-between gap-4 flex-wrap">
        <div className="text-sm text-muted-foreground">
          {totals.contractCount} {totals.contractCount === 1 ? 'contract' : 'contracts'} pending approval
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Export Summary
          </Button>
          <Button
            variant="default"
            onClick={() => {
              // Approve all contracts
              contractGroups.forEach(group => {
                onApproveContract(group.contract.id, group.entries.map(e => e.id));
              });
            }}
          >
            Approve All Contracts ({totals.totalHours}h)
          </Button>
        </div>
      </div>
      
    </div>
  );
}