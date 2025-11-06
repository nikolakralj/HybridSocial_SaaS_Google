import { useState } from "react";
import { ArrowRight, Upload, Check } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Progress } from "../ui/progress";

interface PersonalProfileSetupProps {
  userEmail: string;
  onComplete: (profileData: any) => void;
  onSkip?: () => void;
  mode?: "required" | "optional";
}

export function PersonalProfileSetup({ 
  userEmail, 
  onComplete, 
  onSkip,
  mode = "required" 
}: PersonalProfileSetupProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    headline: "",
    bio: "",
  });

  const canProceed = formData.fullName && formData.headline;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("📝 Form submitted. Can proceed:", canProceed, "Data:", formData);
    if (canProceed) {
      console.log("✅ Calling onComplete with:", formData);
      onComplete(formData);
    } else {
      console.log("❌ Cannot proceed. Missing:", {
        fullName: !formData.fullName,
        headline: !formData.headline
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl">
        {/* Progress indicator */}
        {mode === "required" && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground m-0">Step 1 of 2</p>
              {onSkip && (
                <button
                  onClick={onSkip}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  I'll do this later
                </button>
              )}
            </div>
            <Progress value={50} className="h-1.5" />
          </div>
        )}

        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
          {/* Header */}
          <div className="mb-8">
            <div className="w-12 h-12 rounded-2xl bg-accent-brand/10 flex items-center justify-center mb-4">
              <Check className="w-6 h-6 text-accent-brand" />
            </div>
            <h2 className="mb-2">Create your personal profile</h2>
            <p className="text-muted-foreground m-0">
              This is your unique identity on WorkGraph. You can use it across all workspaces.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email (readonly) */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={userEmail}
                disabled
                className="mt-2 bg-muted"
              />
            </div>

            {/* Full name */}
            <div>
              <Label htmlFor="fullName">Full name *</Label>
              <Input
                id="fullName"
                placeholder="Sarah Chen"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="mt-2"
                required
              />
            </div>

            {/* Professional headline */}
            <div>
              <Label htmlFor="headline">Professional headline *</Label>
              <Input
                id="headline"
                placeholder="Senior React Developer"
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                className="mt-2"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                This appears under your name everywhere on WorkGraph
              </p>
            </div>

            {/* Bio (optional) */}
            <div>
              <Label htmlFor="bio">About you (optional)</Label>
              <Textarea
                id="bio"
                placeholder="Tell people what you do..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="mt-2"
                rows={3}
              />
            </div>

            {/* Info callout */}
            <div className="bg-accent/30 border border-border rounded-xl p-4">
              <p className="text-sm m-0">
                💡 Your personal profile is separate from any workspaces you create or join. 
                You'll always have this profile, even if you switch companies or agencies.
              </p>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              {onSkip && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onSkip}
                  className="flex-1"
                >
                  I'll do this later
                </Button>
              )}
              <Button
                type="submit"
                disabled={!canProceed}
                className="flex-1 rounded-xl"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>
        </div>

        {/* Helper text */}
        {mode === "required" && (
          <p className="text-center text-sm text-muted-foreground mt-6">
            Next: {onSkip ? "You can complete your workspace setup" : "Set up your workspace"}
          </p>
        )}
      </div>
    </div>
  );
}
