import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface CommunityMetricsProps {
  professionals?: number;
  teams?: number;
  rolesFilled?: number;
  avatars?: string[];
}

export function CommunityMetrics({
  professionals = 28000,
  teams = 3100,
  rolesFilled = 7200,
  avatars = [
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1737575655055-e3967cbefd03?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1618593706014-06782cd3bb3b?w=100&h=100&fit=crop",
  ],
}: CommunityMetricsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {/* Avatar pile */}
      <div className="flex -space-x-2">
        {avatars.slice(0, 4).map((avatar, idx) => (
          <Avatar key={idx} className="h-8 w-8 border-2 border-background">
            <AvatarImage src={avatar} alt={`Member ${idx + 1}`} />
            <AvatarFallback>U{idx + 1}</AvatarFallback>
          </Avatar>
        ))}
      </div>

      {/* Metrics */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        <span className="text-foreground font-medium">{formatNumber(professionals)}+ professionals</span>
        <span>·</span>
        <span className="text-foreground font-medium">{formatNumber(teams)}+ teams</span>
        <span>·</span>
        <span className="text-foreground font-medium">{formatNumber(rolesFilled)}+ roles filled</span>
      </div>
    </div>
  );
}
