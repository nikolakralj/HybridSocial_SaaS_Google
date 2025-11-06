import { useState } from "react";
import { Upload, Plus, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function PersonProfile() {
  const [skills, setSkills] = useState([
    "React",
    "TypeScript",
    "Node.js",
    "Python",
  ]);
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="m-0 mb-1">Personal Profile</h1>
          <p className="text-muted-foreground m-0">
            Your public profile visible to potential clients and agencies
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          {/* Avatar Section */}
          <div className="flex items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarFallback className="text-2xl">JD</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Button variant="outline" className="gap-2">
                <Upload className="w-4 h-4" />
                Upload photo
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                JPG, PNG or GIF. Max 2MB.
              </p>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" defaultValue="John" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" defaultValue="Doe" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="john@example.com" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" defaultValue="+1 (555) 123-4567" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" defaultValue="San Francisco, CA" />
            </div>
          </div>

          {/* Professional Info */}
          <div className="pt-4 border-t border-border">
            <h3 className="mb-4">Professional Information</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Current Title</Label>
                <Input
                  id="title"
                  defaultValue="Senior Full-Stack Developer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  rows={4}
                  defaultValue="Experienced developer with 8+ years in building scalable web applications. Specialized in React, Node.js, and cloud architecture."
                />
              </div>

              <div className="space-y-2">
                <Label>Skills</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="gap-1 pr-1"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-1 p-0 bg-transparent border-0 cursor-pointer hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSkill()}
                  />
                  <Button onClick={addSkill} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rate">Hourly Rate (USD)</Label>
                  <Input id="rate" type="number" defaultValue="150" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availability">Availability</Label>
                  <Select defaultValue="available">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available now</SelectItem>
                      <SelectItem value="limited">Limited availability</SelectItem>
                      <SelectItem value="unavailable">Not available</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* CV Upload */}
          <div className="pt-4 border-t border-border">
            <h3 className="mb-4">Resume / CV</h3>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm mb-2">
                Drag and drop your CV here, or click to browse
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                PDF, DOC, DOCX up to 10MB
              </p>
              <Button variant="outline">Choose file</Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline">Cancel</Button>
            <Button className="bg-accent-brand hover:bg-accent-brand-hover">
              Save profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
