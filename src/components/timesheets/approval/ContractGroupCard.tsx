import { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, CheckCircle2, Eye } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../ui/collapsible';
import { cn } from '../../../components/ui/utils';
import type { ContractGroup } from '../../../utils/api/contract-grouping';

interface ContractGroupCardProps {
  group: ContractGroup;
  onApproveAll: (contractId: string, entryIds: string[]) => void;
  onReviewIndividual: (contractId: string) => void;
  onViewContract: (contractId: string) => void;
  isExpanded?: boolean;
}

export function ContractGroupCard({
  group,
  onApproveAll,
  onReviewIndividual,
  onViewContract,
  isExpanded: initialExpanded = false,
}: ContractGroupCardProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  
  const contractTypeBadgeColor = {
    individual: 'bg-blue-100 text-blue-700 border-blue-200',
    company: 'bg-purple-100 text-purple-700 border-purple-200',
    agency: 'bg-green-100 text-green-700 border-green-200',
  };
  
  const formatDate = (date: Date, format: 'short' | 'long' = 'short') => {
    if (format === 'short') {
      return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
    }
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };
  
  return (
    <Card className="border-2 hover:border-accent-brand/30 apple-transition">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        
        {/* Header: Contract summary */}
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-accent/5 apple-transition pb-3">
            <div className="flex items-start justify-between gap-4">
              
              {/* Left: Contract info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h3 className="font-semibold text-lg">{group.displayName}</h3>
                  <Badge 
                    variant="outline" 
                    className={cn("text-xs flex-shrink-0", contractTypeBadgeColor[group.contractType])}
                  >
                    {group.contractType === 'individual' ? 'Freelancer' : 'Company'}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                  <div className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{group.contractNumber}</span>
                  </div>
                  <div className="flex-shrink-0">{group.rateLabel}</div>
                  {group.contractType !== 'individual' && group.people.length > 0 && (
                    <div className="flex-shrink-0">
                      {group.people.length} {group.people.length === 1 ? 'person' : 'people'}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Right: Summary metrics */}
              <div className="text-right flex-shrink-0">
                <div className="text-2xl font-bold text-accent-brand">
                  {group.totalHours}h
                </div>
                <div className="text-sm text-muted-foreground">
                  ${group.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              
              {/* Chevron */}
              <div className="flex-shrink-0 pt-1">
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        {/* Expandable: Entry breakdown */}
        <CollapsibleContent>
          <CardContent className="pt-0 pb-4">
            <div className="space-y-2">
              
              {/* Individual entries or person rollup */}
              {group.contractType === 'individual' ? (
                // Individual contractor: Show day-by-day entries
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-accent/5">
                      <tr className="border-b">
                        <th className="text-left p-2 font-medium">Date</th>
                        <th className="text-left p-2 font-medium">Task</th>
                        <th className="text-right p-2 font-medium">Hours</th>
                        <th className="text-right p-2 font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.entries.map(entry => (
                        <tr key={entry.id} className="border-b last:border-0 hover:bg-accent/5">
                          <td className="p-2">{formatDate(entry.date)}</td>
                          <td className="p-2 truncate max-w-xs">{entry.task}</td>
                          <td className="p-2 text-right">{entry.hours}h</td>
                          <td className="p-2 text-right font-medium">
                            ${(entry.hours * group.rate).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                // Company contract: Show person rollup
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-accent/5">
                      <tr className="border-b">
                        <th className="text-left p-2 font-medium">Person</th>
                        <th className="text-right p-2 font-medium">Hours</th>
                        <th className="text-right p-2 font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.people.map(person => {
                        const personEntries = group.entries.filter(e => e.userId === person.id);
                        const personHours = personEntries.reduce((sum, e) => sum + e.hours, 0);
                        const personAmount = personHours * group.rate;
                        
                        return (
                          <tr key={person.id} className="border-b last:border-0 hover:bg-accent/5">
                            <td className="p-2">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-accent-brand/10 flex items-center justify-center text-xs font-medium text-accent-brand flex-shrink-0">
                                  {person.initials}
                                </div>
                                <span className="truncate">{person.name}</span>
                              </div>
                            </td>
                            <td className="p-2 text-right">{personHours}h</td>
                            <td className="p-2 text-right font-medium">
                              ${personAmount.toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              
              {/* Total row */}
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="font-medium">Week Total</span>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">{group.totalHours}h</span>
                  <span className="text-lg font-bold text-accent-brand">
                    ${group.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
        
        {/* Footer: Actions */}
        <CardFooter className="border-t bg-accent/5 gap-2 flex-wrap">
          <Button
            variant="default"
            onClick={() => onApproveAll(group.contract.id, group.entries.map(e => e.id))}
            className="gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Approve All {group.totalHours}h
          </Button>
          
          <Button
            variant="outline"
            onClick={() => onReviewIndividual(group.contract.id)}
          >
            {group.contractType === 'individual' ? 'Review Entries' : 'Review by Person'}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewContract(group.contract.id)}
            className="ml-auto gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            View Contract
          </Button>
        </CardFooter>
        
      </Collapsible>
    </Card>
  );
}
