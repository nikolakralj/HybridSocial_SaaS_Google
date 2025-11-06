import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { User, Building2, Users, Check, ArrowRight } from "lucide-react";

export function Onboarding() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<string | null>(null);

  const roles = [
    {
      id: "freelancer",
      icon: User,
      title: "Freelancer",
      description: "I'm an individual looking for projects and opportunities",
    },
    {
      id: "company",
      icon: Building2,
      title: "Company",
      description: "I'm hiring talent or outsourcing projects",
    },
    {
      id: "agency",
      icon: Users,
      title: "Agency",
      description: "I'm a headhunter or staffing agency",
    },
  ];

  const renderStep1 = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="mb-2">Welcome to WorkGraph</h1>
        <p className="text-muted-foreground">
          Let's get you set up. First, tell us about yourself.
        </p>
      </div>

      <div className="grid gap-4">
        {roles.map((r) => (
          <button
            key={r.id}
            onClick={() => setRole(r.id)}
            className={`p-6 rounded-xl border-2 transition-all text-left bg-card ${
              role === r.id
                ? "border-accent-brand bg-accent-brand/5"
                : "border-border hover:border-accent-brand/50"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-lg ${
                  role === r.id ? "bg-accent-brand text-white" : "bg-accent"
                }`}
              >
                <r.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="m-0 mb-1">{r.title}</h3>
                <p className="text-muted-foreground m-0">{r.description}</p>
              </div>
              {role === r.id && (
                <Check className="w-5 h-5 text-accent-brand flex-shrink-0" />
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-end mt-8">
        <Button
          onClick={() => setStep(2)}
          disabled={!role}
          className="bg-accent-brand hover:bg-accent-brand-hover gap-2"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => {
    if (role === "freelancer") {
      return (
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="mb-2">Create your profile</h1>
            <p className="text-muted-foreground">
              Tell us about your skills and experience
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Professional Title</Label>
              <Input id="title" placeholder="e.g., Senior Full-Stack Developer" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="City, Country" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rate">Hourly Rate (USD)</Label>
              <Input id="rate" type="number" placeholder="150" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Key Skills</Label>
              <Input
                id="skills"
                placeholder="React, TypeScript, Node.js (comma-separated)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Short Bio</Label>
              <Textarea
                id="bio"
                rows={4}
                placeholder="Tell us about your experience and what you're looking for..."
              />
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button
              onClick={() => setStep(3)}
              className="bg-accent-brand hover:bg-accent-brand-hover gap-2"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      );
    }

    // Company or Agency
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-2">Create your organization</h1>
          <p className="text-muted-foreground">
            Set up your {role === "company" ? "company" : "agency"} profile
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="orgName">Organization Name</Label>
            <Input id="orgName" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input id="website" placeholder="https://" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" placeholder="City, Country" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={4}
              placeholder="Describe your organization and what you do..."
            />
          </div>

          {role === "agency" && (
            <div className="space-y-2">
              <Label htmlFor="specialties">Specialties</Label>
              <Input
                id="specialties"
                placeholder="Tech, Finance, Healthcare (comma-separated)"
              />
            </div>
          )}
        </div>

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={() => setStep(1)}>
            Back
          </Button>
          <Button
            onClick={() => setStep(3)}
            className="bg-accent-brand hover:bg-accent-brand-hover gap-2"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-success" />
        </div>
        <h1 className="mb-2">You're all set!</h1>
        <p className="text-muted-foreground">
          Welcome to WorkGraph. Let's explore what you can do.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/50">
            <Check className="w-5 h-5 text-success mt-0.5" />
            <div>
              <p className="font-medium m-0">Profile created</p>
              <p className="text-sm text-muted-foreground m-0">
                Your {role === "freelancer" ? "personal" : "organization"} profile is
                ready
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg border border-border">
            <div className="w-5 h-5 rounded-full border-2 border-muted flex items-center justify-center mt-0.5">
              <div className="w-2 h-2 rounded-full bg-muted" />
            </div>
            <div>
              <p className="font-medium m-0">Next: Complete your profile</p>
              <p className="text-sm text-muted-foreground m-0">
                Add more details to attract the right opportunities
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg border border-border">
            <div className="w-5 h-5 rounded-full border-2 border-muted flex items-center justify-center mt-0.5">
              <div className="w-2 h-2 rounded-full bg-muted" />
            </div>
            <div>
              <p className="font-medium m-0">
                {role === "freelancer"
                  ? "Browse opportunities"
                  : "Post your first job"}
              </p>
              <p className="text-sm text-muted-foreground m-0">
                {role === "freelancer"
                  ? "Search for projects and connect with companies"
                  : "Start finding the right talent for your needs"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <Button
          onClick={() => {
            /* Navigate to dashboard */
          }}
          className="bg-accent-brand hover:bg-accent-brand-hover"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  s === step
                    ? "bg-accent-brand text-white"
                    : s < step
                    ? "bg-success text-white"
                    : "bg-accent text-muted-foreground"
                }`}
              >
                {s < step ? <Check className="w-4 h-4" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`w-16 h-0.5 mx-1 ${
                    s < step ? "bg-success" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
    </div>
  );
}
