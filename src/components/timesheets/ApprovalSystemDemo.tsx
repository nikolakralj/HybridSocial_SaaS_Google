import { ProjectTimesheetsView } from "./ProjectTimesheetsView";

/**
 * Approval System Demo
 * 
 * Context: PROJECT-LEVEL workspace demo
 * Shows: All contractors working on this specific project (across all vendors)
 * 
 * This demonstrates the project-scoped timesheet management where:
 * - Project Owner sees ALL contractors on their project
 * - Client PM sees ALL vendors' contractors
 * - Combines 3 freelancers + 2 companies (Acme Corp, TechStaff Inc)
 */

export function ApprovalSystemDemo() {
  // Convert demo people to contractors format
  // NOTE: In real app, this would come from project.contractors JOIN
  const contractors = [
    { id: "sarah-chen-id", name: "Sarah Chen", initials: "SC" },
    { id: "mike-johnson-id", name: "Mike Johnson", initials: "MJ" },
    { id: "emma-davis-id", name: "Emma Davis", initials: "ED" },
    { id: "tom-martinez-id", name: "Tom Martinez", initials: "TM", company: "Acme Corp" },
    { id: "lisa-park-id", name: "Lisa Park", initials: "LP", company: "Acme Corp" },
    { id: "james-wilson-id", name: "James Wilson", initials: "JW", company: "Acme Corp" },
    { id: "alex-kim-id", name: "Alex Kim", initials: "AK", company: "TechStaff Inc" },
    { id: "jordan-lee-id", name: "Jordan Lee", initials: "JL", company: "TechStaff Inc" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold mb-1">Project Workspace</h1>
              <p className="text-sm text-muted-foreground">
                Mobile App Redesign · 8 contractors across 3 vendors
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <ProjectTimesheetsView
          ownerId="demo-owner-id"
          ownerName="Demo Project Owner"
          contractors={contractors}
          hourlyRate={95}
        />
      </div>
    </div>
  );
}
