import { WidgetCard } from "../WidgetCard";
import { Button } from "../ui/button";
import { BarChart, Bar, ResponsiveContainer, Tooltip } from "recharts";

export function MyWeekWidget() {
  const weekData = [
    { day: "Mon", hours: 7.5 },
    { day: "Tue", hours: 8 },
    { day: "Wed", hours: 6.5 },
    { day: "Thu", hours: 8 },
    { day: "Fri", hours: 5 },
  ];

  const totalHours = weekData.reduce((sum, d) => sum + d.hours, 0);

  return (
    <WidgetCard
      title="My Week"
      tooltip="Time tracking for current week"
      size="M"
      footer={
        <div className="flex items-center gap-2">
          <Button size="sm" className="h-8 bg-accent-brand hover:bg-accent-brand-hover flex-1">
            Log time
          </Button>
          <Button variant="ghost" size="sm" className="h-8">
            View details
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <div className="flex items-baseline gap-2">
            <span style={{ fontSize: "32px", fontWeight: "600", lineHeight: "1.2" }}>
              {totalHours}h
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">logged this week</p>
        </div>

        <div className="h-20">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekData}>
              <Tooltip
                cursor={false}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-card border border-border rounded-lg px-2 py-1 text-sm">
                        {payload[0].payload.day}: {payload[0].value}h
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="hours"
                fill="var(--accent-brand)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </WidgetCard>
  );
}
