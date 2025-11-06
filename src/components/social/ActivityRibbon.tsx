import { useEffect, useRef, useState } from "react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface ActivityItem {
  id: string;
  avatar: string;
  name: string;
  verb: string;
  object: string;
  time: string;
}

const activities: ActivityItem[] = [
  {
    id: "1",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop",
    name: "Lisa Martinez",
    verb: "posted a case study",
    object: "",
    time: "2h",
  },
  {
    id: "2",
    avatar: "https://images.unsplash.com/photo-1737575655055-e3967cbefd03?w=100&h=100&fit=crop",
    name: "TechVentures",
    verb: "opened a contract role",
    object: "Senior React Developer",
    time: "1h",
  },
  {
    id: "3",
    avatar: "https://images.unsplash.com/photo-1618593706014-06782cd3bb3b?w=100&h=100&fit=crop",
    name: "Emma Rodriguez",
    verb: "followed",
    object: "RetailCo",
    time: "12m",
  },
  {
    id: "4",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop",
    name: "Marcus Kim",
    verb: "posted",
    object: "Looking for Next.js 15 experts",
    time: "45m",
  },
  {
    id: "5",
    avatar: "https://images.unsplash.com/photo-1618593706014-06782cd3bb3b?w=100&h=100&fit=crop",
    name: "Sarah Chen",
    verb: "completed a project",
    object: "E-commerce rebuild",
    time: "3h",
  },
];

interface ActivityRibbonProps {
  onActivityClick?: () => void;
}

export function ActivityRibbon({ onActivityClick }: ActivityRibbonProps) {
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Duplicate activities for seamless loop
  const allActivities = [...activities, ...activities, ...activities];

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || isPaused) return;

    let animationFrame: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5; // pixels per frame

    const animate = () => {
      scrollPosition += scrollSpeed;
      
      // Reset when scrolled past first set
      if (scrollPosition >= container.scrollWidth / 3) {
        scrollPosition = 0;
      }
      
      container.scrollLeft = scrollPosition;
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isPaused]);

  return (
    <div className="py-6 px-6 border-y border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-hidden scrollbar-hide"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {allActivities.map((activity, index) => (
            <button
              key={`${activity.id}-${index}`}
              onClick={onActivityClick}
              className="flex items-center gap-2.5 shrink-0 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ImageWithFallback
                src={activity.avatar}
                alt={activity.name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-border"
              />
              <span className="font-medium text-foreground">
                {activity.name}
              </span>
              <span className="font-normal">{activity.verb}</span>
              {activity.object && (
                <>
                  <span className="text-border">—</span>
                  <span className="font-medium">{activity.object}</span>
                </>
              )}
              <span className="text-border">·</span>
              <span className="text-xs">{activity.time}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
