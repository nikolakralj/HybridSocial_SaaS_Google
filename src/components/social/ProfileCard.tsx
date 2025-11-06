import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { UserPlus } from "lucide-react";
import { motion } from "motion/react";

export interface ProfileData {
  id: string;
  name: string;
  role: string;
  avatar: string;
  followers: string;
  skills: string[];
  mutuals?: string;
}

interface ProfileCardProps {
  profile: ProfileData;
  onFollow?: () => void;
}

export function ProfileCard({ profile, onFollow }: ProfileCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)" }}
      transition={{ duration: 0.12 }}
      className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={profile.avatar} alt={profile.name} />
          <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground truncate">{profile.name}</h4>
          <p className="text-muted-foreground truncate">{profile.role}</p>
        </div>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5">
        {profile.skills.slice(0, 3).map((skill, idx) => (
          <Badge key={idx} variant="secondary" className="text-xs">
            {skill}
          </Badge>
        ))}
      </div>

      {/* Mutuals */}
      {profile.mutuals && (
        <p className="text-xs text-muted-foreground">{profile.mutuals}</p>
      )}

      {/* Follow button */}
      <Button
        onClick={onFollow}
        variant="outline"
        size="sm"
        className="w-full mt-auto"
      >
        <UserPlus className="h-4 w-4 mr-2" />
        Follow
      </Button>
    </motion.div>
  );
}
