import { CheckCircle2, XCircle, MessageSquare, Calendar } from "lucide-react";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { motion, AnimatePresence } from "motion/react";

interface UnifiedApprovalBarProps {
  selectedContractorNames: string[];
  currentMonth: Date;
  totalHours: number;
  totalCost: number;
  onApprove: () => void;
  onReject: () => void;
  onRequestChanges: () => void;
  isVisible: boolean;
}

export function UnifiedApprovalBar({
  selectedContractorNames,
  currentMonth,
  totalHours,
  totalCost,
  onApprove,
  onReject,
  onRequestChanges,
  isVisible,
}: UnifiedApprovalBarProps) {
  const monthName = currentMonth.toLocaleDateString("en-US", { 
    month: "long", 
    year: "numeric" 
  });
  
  const contractorCount = selectedContractorNames.length;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4"
        >
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-2xl border-blue-500">
            <div className="p-6 space-y-4">
              {/* Header Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span className="font-semibold text-lg">{monthName}</span>
                  </div>
                  <div className="h-6 w-px bg-white/30" />
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm">
                      {contractorCount} {contractorCount === 1 ? 'contractor' : 'contractors'} selected
                    </span>
                  </div>
                </div>
              </div>

              {/* Contractor Names */}
              {selectedContractorNames.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedContractorNames.map((name) => (
                    <Badge 
                      key={name} 
                      variant="secondary" 
                      className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                    >
                      {name}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Totals Row */}
              <div className="flex items-center gap-8 text-lg">
                <div>
                  <span className="text-white/80 text-sm">Total Hours</span>
                  <div className="font-semibold">{totalHours.toFixed(1)}h</div>
                </div>
                <div className="h-10 w-px bg-white/30" />
                <div>
                  <span className="text-white/80 text-sm">Total Cost</span>
                  <div className="font-semibold">${totalCost.toLocaleString()}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <Button
                  onClick={onApprove}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white border-0 gap-2 h-12 text-base font-semibold"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Approve Month
                </Button>
                
                <Button
                  onClick={onRequestChanges}
                  variant="outline"
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white border-white/30 gap-2 h-12 text-base"
                >
                  <MessageSquare className="w-5 h-5" />
                  Request Changes
                </Button>
                
                <Button
                  onClick={onReject}
                  variant="outline"
                  className="flex-1 bg-red-600/80 hover:bg-red-700 text-white border-red-500/30 gap-2 h-12 text-base"
                >
                  <XCircle className="w-5 h-5" />
                  Reject Month
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
