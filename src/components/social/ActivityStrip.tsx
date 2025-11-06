import { motion } from "motion/react";

interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  object: string;
  time?: string;
}

const defaultActivities: ActivityItem[] = [
  { id: "1", actor: "Sarah Chen", action: "posted", object: "'Refactoring cut load time 60%'" },
  { id: "2", actor: "TechVentures", action: "opened a role", object: "Senior React (Remote)" },
  { id: "3", actor: "Emma Rodriguez", action: "followed", object: "RetailCo" },
  { id: "4", actor: "Marcus Kim", action: "completed", object: "12-week contract" },
  { id: "5", actor: "DesignStudio", action: "hired", object: "3 contractors" },
  { id: "6", actor: "Alex Morgan", action: "posted", object: "'Just shipped v2.0'" },
  { id: "7", actor: "StartupCo", action: "opened a role", object: "DevOps Engineer" },
  { id: "8", actor: "Lisa Park", action: "followed", object: "CloudTech" },
];

interface ActivityStripProps {
  activities?: ActivityItem[];
}

export function ActivityStrip({ activities = defaultActivities }: ActivityStripProps) {
  // Double the activities for seamless loop
  const duplicatedActivities = [...activities, ...activities];

  return (
    <div className="w-full overflow-hidden bg-card border border-border rounded-lg h-9 flex items-center">
      <motion.div
        className="flex items-center gap-6 px-4"
        animate={{
          x: [0, -50 + "%"], // Move by half since we doubled the array
        }}
        transition={{
          duration: 40,
          ease: "linear",
          repeat: Infinity,
        }}
        whileHover={{ animationPlayState: "paused" }}
      >
        {duplicatedActivities.map((activity, index) => (
          <div key={`${activity.id}-${index}`} className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-foreground">{activity.actor}</span>
            <span className="text-muted-foreground">{activity.action}</span>
            <span className="text-foreground">{activity.object}</span>
            {index < duplicatedActivities.length - 1 && (
              <span className="text-muted-foreground ml-4">•</span>
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
