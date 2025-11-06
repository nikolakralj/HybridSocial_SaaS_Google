import { Lock, UserPlus, Mail } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface MaskedCandidateCardProps {
  ownerName: string;
  skills?: string[];
  yearsExperience?: string;
  location?: string;
  onRequestAccess?: () => void;
}

export function MaskedCandidateCard({ 
  ownerName, 
  skills = [],
  yearsExperience,
  location,
  onRequestAccess 
}: MaskedCandidateCardProps) {
  return (
    <Card className="p-4 border-warning/30 bg-warning/5 relative overflow-hidden">
      {/* Locked overlay indicator */}
      <div className="absolute top-3 right-3">
        <div className="w-8 h-8 rounded-lg bg-warning/20 flex items-center justify-center">
          <Lock className="w-4 h-4 text-warning" />
        </div>
      </div>

      <div className="flex gap-4">
        {/* Blurred avatar */}
        <Avatar className="w-16 h-16 rounded-xl blur-sm">
          <AvatarFallback className="bg-gradient-to-br from-gray-400 to-gray-500 text-white rounded-xl">
            ??
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          {/* Masked name */}
          <h4 className="m-0 mb-2 blur-sm select-none">████ ████████</h4>
          
          {/* Some info visible, some masked */}
          <div className="space-y-2 mb-3">
            {yearsExperience && (
              <p className="text-sm text-muted-foreground m-0">
                {yearsExperience} years experience
              </p>
            )}
            {location && (
              <p className="text-sm text-muted-foreground m-0">
                {location}
              </p>
            )}
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {skills.slice(0, 3).map((skill, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {skills.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{skills.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Restricted message */}
          <div className="p-3 rounded-lg bg-warning/10 border border-warning/20 mb-3">
            <div className="flex items-start gap-2">
              <Lock className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium m-0 mb-1 text-warning-foreground">
                  This candidate is restricted
                </p>
                <p className="text-xs text-muted-foreground m-0">
                  Ask <span className="font-medium text-foreground">{ownerName}</span> to add you as a participant to see full details.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={onRequestAccess}
            >
              <UserPlus className="w-4 h-4" />
              Request Access
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Mail className="w-4 h-4" />
              Contact Owner
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
