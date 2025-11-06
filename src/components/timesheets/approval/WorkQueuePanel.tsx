import { useState } from "react";
import { Clock, AlertCircle, CheckCircle2, Users, Building2, Briefcase } from "lucide-react";
import { Badge } from "../../ui/badge";
import { Card } from "../../ui/card";
import { Separator } from "../../ui/separator";
import { ScrollArea } from "../../ui/scroll-area";

interface QueueCounts {
  submitted: number;
  amended: number;
  dueSoon: number;
  overdue: number;
}

interface QuickFilter {
  type: "team" | "agency" | "company";
  id: string;
  name: string;
  count: number;
}

interface WorkQueuePanelProps {
  counts: QueueCounts;
  filters: QuickFilter[];
  selectedFilters: Set<string>;
  onFilterToggle: (filterId: string) => void;
  onCounterClick: (type: keyof QueueCounts) => void;
  activeCounter?: keyof QueueCounts;
}

export function WorkQueuePanel({
  counts,
  filters,
  selectedFilters,
  onFilterToggle,
  onCounterClick,
  activeCounter,
}: WorkQueuePanelProps) {
  const [expandedSection, setExpandedSection] = useState<"teams" | "agencies" | "companies" | null>(null);

  const teamFilters = filters.filter(f => f.type === "team");
  const agencyFilters = filters.filter(f => f.type === "agency");
  const companyFilters = filters.filter(f => f.type === "company");

  return (
    <Card className="h-full flex flex-col border-r rounded-none">
      <div className="p-4 border-b">
        <h3 className="text-sm font-semibold mb-1">My Approvals</h3>
        <p className="text-xs text-muted-foreground">Review and approve timesheets</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {/* Status Counters */}
          <div className="space-y-1">
            <button
              onClick={() => onCounterClick("submitted")}
              className={`w-full p-3 rounded-lg border text-left transition-all ${
                activeCounter === "submitted"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                  : "border-border hover:border-blue-300 hover:bg-accent/50"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm font-medium">Submitted</span>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  {counts.submitted}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground pl-10">Awaiting your review</p>
            </button>

            <button
              onClick={() => onCounterClick("amended")}
              className={`w-full p-3 rounded-lg border text-left transition-all ${
                activeCounter === "amended"
                  ? "border-purple-500 bg-purple-50 dark:bg-purple-950"
                  : "border-border hover:border-purple-300 hover:bg-accent/50"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-sm font-medium">Amended</span>
                </div>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                  {counts.amended}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground pl-10">Previously approved, edited</p>
            </button>

            <button
              onClick={() => onCounterClick("dueSoon")}
              className={`w-full p-3 rounded-lg border text-left transition-all ${
                activeCounter === "dueSoon"
                  ? "border-amber-500 bg-amber-50 dark:bg-amber-950"
                  : "border-border hover:border-amber-300 hover:bg-accent/50"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <span className="text-sm font-medium">Due Soon</span>
                </div>
                <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                  {counts.dueSoon}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground pl-10">Within next 24 hours</p>
            </button>

            <button
              onClick={() => onCounterClick("overdue")}
              className={`w-full p-3 rounded-lg border text-left transition-all ${
                activeCounter === "overdue"
                  ? "border-red-500 bg-red-50 dark:bg-red-950"
                  : "border-border hover:border-red-300 hover:bg-accent/50"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                  <span className="text-sm font-medium">Overdue</span>
                </div>
                <Badge variant="destructive" className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                  {counts.overdue}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground pl-10">Past SLA deadline</p>
            </button>
          </div>

          <Separator className="my-4" />

          {/* Quick Filters */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Quick Filters</p>

            {/* Teams */}
            {teamFilters.length > 0 && (
              <div>
                <button
                  onClick={() => setExpandedSection(expandedSection === "teams" ? null : "teams")}
                  className="w-full flex items-center justify-between p-2 rounded hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Teams</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {teamFilters.filter(f => selectedFilters.has(f.id)).length}/{teamFilters.length}
                  </Badge>
                </button>
                {expandedSection === "teams" && (
                  <div className="ml-6 mt-1 space-y-1">
                    {teamFilters.map(filter => (
                      <button
                        key={filter.id}
                        onClick={() => onFilterToggle(filter.id)}
                        className={`w-full text-left p-2 rounded text-sm transition-colors ${
                          selectedFilters.has(filter.id)
                            ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                            : "hover:bg-accent/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{filter.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {filter.count}
                          </Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Agencies */}
            {agencyFilters.length > 0 && (
              <div>
                <button
                  onClick={() => setExpandedSection(expandedSection === "agencies" ? null : "agencies")}
                  className="w-full flex items-center justify-between p-2 rounded hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Agencies</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {agencyFilters.filter(f => selectedFilters.has(f.id)).length}/{agencyFilters.length}
                  </Badge>
                </button>
                {expandedSection === "agencies" && (
                  <div className="ml-6 mt-1 space-y-1">
                    {agencyFilters.map(filter => (
                      <button
                        key={filter.id}
                        onClick={() => onFilterToggle(filter.id)}
                        className={`w-full text-left p-2 rounded text-sm transition-colors ${
                          selectedFilters.has(filter.id)
                            ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                            : "hover:bg-accent/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{filter.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {filter.count}
                          </Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Companies */}
            {companyFilters.length > 0 && (
              <div>
                <button
                  onClick={() => setExpandedSection(expandedSection === "companies" ? null : "companies")}
                  className="w-full flex items-center justify-between p-2 rounded hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Companies</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {companyFilters.filter(f => selectedFilters.has(f.id)).length}/{companyFilters.length}
                  </Badge>
                </button>
                {expandedSection === "companies" && (
                  <div className="ml-6 mt-1 space-y-1">
                    {companyFilters.map(filter => (
                      <button
                        key={filter.id}
                        onClick={() => onFilterToggle(filter.id)}
                        className={`w-full text-left p-2 rounded text-sm transition-colors ${
                          selectedFilters.has(filter.id)
                            ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                            : "hover:bg-accent/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{filter.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {filter.count}
                          </Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Active Filters Summary */}
          {selectedFilters.size > 0 && (
            <>
              <Separator className="my-4" />
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                    {selectedFilters.size} filter{selectedFilters.size > 1 ? 's' : ''} active
                  </p>
                  <button
                    onClick={() => selectedFilters.forEach(id => onFilterToggle(id))}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Clear all
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
