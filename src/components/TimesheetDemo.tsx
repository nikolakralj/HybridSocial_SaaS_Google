import { useState, useEffect } from "react";
import { MultiPersonTimesheetCalendar } from "./timesheets/MultiPersonTimesheetCalendar";
import { User, Users, Building2, Database } from "lucide-react";
import { migrateTimesheetEntries } from "../utils/api/migrate-timesheets";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { Button } from "./ui/button";
import { toast } from "sonner@2.0.3";
import { Toaster } from "./ui/sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type PersonaType = "solo-freelancer" | "team-lead" | "project-manager";

// Mock contractor data
interface Contractor {
  id: string;
  name: string;
  initials: string;
  company?: string;
}

const mockContractors: Record<PersonaType, Contractor[]> = {
  "solo-freelancer": [
    { id: "c1", name: "Sarah Chen", initials: "SC" }
  ],
  "team-lead": [
    { id: "c1", name: "Sarah Chen", initials: "SC", company: "Acme Corp" },
    { id: "c2", name: "Ian Mitchell", initials: "IM", company: "Acme Corp" },
    { id: "c3", name: "Lisa Park", initials: "LP", company: "Acme Corp" }
  ],
  "project-manager": [
    { id: "c1", name: "Sarah Chen", initials: "SC", company: "Acme Corp" },
    { id: "c2", name: "Ian Mitchell", initials: "IM", company: "Acme Corp" },
    { id: "c3", name: "Lisa Park", initials: "LP", company: "Acme Corp" },
    { id: "c4", name: "Marcus Webb", initials: "MW", company: "TechStaff Inc" },
    { id: "c5", name: "Nina Patel", initials: "NP", company: "TechStaff Inc" }
  ]
};

export function TimesheetDemo() {
  const [persona, setPersona] = useState<PersonaType>("team-lead");
  const [migrationComplete, setMigrationComplete] = useState(false);
  const [seeding, setSeeding] = useState(false);

  // Run migration on mount to ensure old data is migrated
  useEffect(() => {
    const runMigration = async () => {
      try {
        console.log('Running timesheet migration...');
        const result = await migrateTimesheetEntries();
        console.log('Migration complete:', result);
        setMigrationComplete(true);
      } catch (error) {
        console.error('Migration failed:', error);
        // Don't block the app if migration fails
        setMigrationComplete(true);
      }
    };
    
    runMigration();
  }, []);

  // Define persona config
  const personaConfig = {
    "solo-freelancer": {
      title: "👤 Solo Freelancer",
      subtitle: "You're an individual contractor (Sarah Chen)",
      scope: "Just yourself - no team to manage",
      accessLevel: "Own Data Only",
      userRole: "individual-contributor" as const,
      currentUserId: "c1",
      currentUserName: "Sarah Chen",
      showRates: false,
      rateNote: "❌ No rate visibility - only hours & tasks",
    },
    "team-lead": {
      title: "🏢 Company Owner (Vendor)",
      subtitle: "You own Acme Corp and invoice the agency",
      scope: "Your company's 3 employees on this project",
      accessLevel: "Your Company",
      userRole: "company-owner" as const,
      currentUserId: "owner-1",
      currentUserName: "Alex Martinez",
      showRates: true,
      rateNote: "✅ Internal cost ($30/hr) + billable to agency ($60/hr)",
    },
    "project-manager": {
      title: "🏛️ Agency Owner",
      subtitle: "You own the agency and invoice the final client",
      scope: "All vendors (Acme Corp, TechStaff Inc)",
      accessLevel: "Full Project",
      userRole: "agency-owner" as const,
      currentUserId: "agency-owner-1",
      currentUserName: "Jennifer Kim",
      showRates: true,
      rateNote: "✅ Vendor totals ($60/hr) + billable to client ($90/hr)",
    },
  };

  const config = personaConfig[persona];
  const contractors = mockContractors[persona];
  const canViewTeam = persona !== "solo-freelancer";
  const isCompanyOwner = persona === "team-lead";
  
  // Owner ID mapping (in real app, this would come from auth context)
  const ownerIdMap: Record<PersonaType, string> = {
    "solo-freelancer": "c1",
    "team-lead": "owner-1", // Company owner's own ID
    "project-manager": "agency-owner-1" // Agency owner's own ID
  };
  
  const ownerId = ownerIdMap[persona];
  
  const handlePersonaChange = (newPersona: PersonaType) => {
    setPersona(newPersona);
  };

  const handleSeedData = async () => {
    setSeeding(true);
    console.log('🌱 Starting seed operation...');
    console.log('Project ID:', projectId);
    console.log('Anon Key:', publicAnonKey ? 'Present' : 'Missing');
    
    try {
      const url = `https://${projectId}.supabase.co/functions/v1/make-server-f8b491be/seed`;
      console.log('Calling seed endpoint:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || `Failed to seed data (${response.status})`);
      }

      console.log('✅ Seed successful!');
      toast.success('✅ Demo data seeded successfully!', {
        description: `Created ${data.details.users} users and ${data.details.entries} timesheet entries for October 2025`,
        duration: 5000,
      });

      // Trigger a refresh of the calendar data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('❌ Error seeding data:', error);
      toast.error('Failed to seed demo data', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setSeeding(false);
    }
  };

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-1">WorkGraph Timesheet System</h1>
              <p className="text-sm text-muted-foreground">
                Unified interface with role-based permissions
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={handleSeedData}
                disabled={seeding}
                variant="outline"
                className="gap-2"
              >
                <Database className="w-4 h-4" />
                {seeding ? 'Seeding...' : 'Seed Demo Data'}
              </Button>

              <Select value={persona} onValueChange={handlePersonaChange}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select persona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solo-freelancer">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <div>
                        <div className="font-medium">Solo Freelancer</div>
                        <div className="text-xs text-muted-foreground">Individual contractor</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="team-lead">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      <div>
                        <div className="font-medium">Company Owner</div>
                        <div className="text-xs text-muted-foreground">Vendor with team</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="project-manager">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <div>
                        <div className="font-medium">Agency Owner</div>
                        <div className="text-xs text-muted-foreground">Manages all vendors</div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Universal Multi-Person Timesheet Calendar */}
          <MultiPersonTimesheetCalendar 
            userRole={config.userRole}
            currentUserId={ownerId}
            currentUserName={config.currentUserName}
            contractors={contractors}
            canViewTeam={canViewTeam}
            isCompanyOwner={isCompanyOwner}
          />
        </div>
      </div>
    </>
  );
}
