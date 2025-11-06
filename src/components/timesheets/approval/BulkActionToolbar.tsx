import { CheckCircle2, XCircle, MessageSquare, Download, X } from "lucide-react";
import { Button } from "../../ui/button";
import { motion, AnimatePresence } from "motion/react";

interface BulkActionToolbarProps {
  selectedCount: number;
  onApprove: () => void;
  onReject: () => void;
  onRequestChanges: () => void;
  onExport: () => void;
  onClearSelection: () => void;
  isVisible: boolean;
}

export function BulkActionToolbar({
  selectedCount,
  onApprove,
  onReject,
  onRequestChanges,
  onExport,
  onClearSelection,
  isVisible,
}: BulkActionToolbarProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg shadow-2xl border border-slate-700 p-4">
            <div className="flex items-center gap-4">
              {/* Selection Count */}
              <div className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span className="font-semibold">{selectedCount}</span>
                <span className="text-sm text-white/70">selected</span>
              </div>

              {/* Divider */}
              <div className="h-8 w-px bg-white/20" />

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={onApprove}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white border-0 gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve ({selectedCount})
                </Button>

                <Button
                  onClick={onRequestChanges}
                  size="sm"
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30 gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Request Changes
                </Button>

                <Button
                  onClick={onReject}
                  size="sm"
                  variant="outline"
                  className="bg-red-600/80 hover:bg-red-700 text-white border-red-500/30 gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </Button>

                <Button
                  onClick={onExport}
                  size="sm"
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30 gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>

              {/* Divider */}
              <div className="h-8 w-px bg-white/20" />

              {/* Clear Selection */}
              <Button
                onClick={onClearSelection}
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/10 gap-2"
              >
                <X className="w-4 h-4" />
                Clear
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
