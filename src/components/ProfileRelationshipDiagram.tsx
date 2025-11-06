import { User, Building2, ArrowRight, Link2 } from "lucide-react";
import { Card } from "./ui/card";

export function ProfileRelationshipDiagram() {
  return (
    <Card className="p-6">
      <h3 className="m-0 mb-6">How Personal Profiles & Worker Records Link</h3>

      <div className="grid md:grid-cols-3 gap-4 items-center">
        {/* Personal Profile */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-accent-brand/10">
              <User className="w-6 h-6 text-accent-brand" />
            </div>
            <div>
              <p className="font-medium m-0">Personal Profile</p>
              <p className="text-xs text-muted-foreground m-0">You Own This</p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-accent text-sm space-y-1">
            <p className="font-medium m-0">John Doe</p>
            <p className="text-muted-foreground m-0 text-xs">Senior Developer</p>
            <p className="text-muted-foreground m-0 text-xs">Portfolio: 12 projects</p>
            <p className="text-muted-foreground m-0 text-xs">Rate: $150/hr</p>
            <p className="text-muted-foreground m-0 text-xs">Status: Available</p>
          </div>

          <div className="flex items-center gap-2 p-2 rounded bg-success/10">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span className="text-xs text-success">Public & Searchable</span>
          </div>
        </div>

        {/* Link Arrow */}
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <ArrowRight className="w-6 h-6" />
          <div className="flex items-center gap-1">
            <Link2 className="w-3 h-3" />
            <span className="text-xs">Linked</span>
          </div>
          <ArrowRight className="w-6 h-6 rotate-180" />
        </div>

        {/* Worker Record */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-warning/10">
              <Building2 className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="font-medium m-0">Worker Record</p>
              <p className="text-xs text-muted-foreground m-0">Company Owns This</p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-accent text-sm space-y-1">
            <p className="font-medium m-0">John Doe</p>
            <p className="text-muted-foreground m-0 text-xs">@ TechVentures Inc.</p>
            <p className="text-muted-foreground m-0 text-xs">Title: Sr. Full-Stack Dev</p>
            <p className="text-muted-foreground m-0 text-xs">Client Rate: $180/hr</p>
            <p className="text-muted-foreground m-0 text-xs">Started: Oct 15, 2024</p>
          </div>

          <div className="flex items-center gap-2 p-2 rounded bg-muted">
            <div className="w-2 h-2 rounded-full bg-muted-foreground" />
            <span className="text-xs text-muted-foreground">Private to Company</span>
          </div>
        </div>
      </div>

      {/* Key Points */}
      <div className="mt-6 pt-6 border-t border-border grid md:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="font-medium mb-2">What You Control</p>
          <ul className="space-y-1 text-muted-foreground">
            <li>• Portfolio & skills</li>
            <li>• Your rates & availability</li>
            <li>• Public/private visibility</li>
            <li>• Whether to show employer</li>
          </ul>
        </div>
        <div>
          <p className="font-medium mb-2">What Company Controls</p>
          <ul className="space-y-1 text-muted-foreground">
            <li>• Internal title & department</li>
            <li>• Client rates & assignments</li>
            <li>• Timesheets & approvals</li>
            <li>• Contract terms & scope</li>
          </ul>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-lg bg-accent">
        <p className="text-xs text-muted-foreground m-0">
          <strong>Key insight:</strong> You can be a freelancer with your own public
          profile AND work for companies via private Worker Records. Each company only
          sees their own Worker Record for you, plus your public profile if you share it.
        </p>
      </div>
    </Card>
  );
}
