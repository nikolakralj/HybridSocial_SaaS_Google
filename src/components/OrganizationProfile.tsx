import { Upload, Plus, UserPlus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";

export function OrganizationProfile() {
  const teamMembers = [
    { name: "John Doe", role: "Admin", email: "john@techcorp.com" },
    { name: "Sarah Chen", role: "Manager", email: "sarah@techcorp.com" },
    { name: "Mike Rodriguez", role: "Member", email: "mike@techcorp.com" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="m-0 mb-1">Organization Profile</h1>
          <p className="text-muted-foreground m-0">
            Manage your company information and team
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          {/* Logo Section */}
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-3xl font-semibold">TC</span>
            </div>
            <div className="flex-1">
              <Button variant="outline" className="gap-2">
                <Upload className="w-4 h-4" />
                Upload logo
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                Square logo recommended. JPG or PNG. Max 2MB.
              </p>
            </div>
          </div>

          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orgName">Organization Name</Label>
              <Input id="orgName" defaultValue="TechCorp Inc." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="orgType">Organization Type</Label>
              <Select defaultValue="company">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="company">Company</SelectItem>
                  <SelectItem value="agency">Headhunter Agency</SelectItem>
                  <SelectItem value="freelancer">Freelancer (Individual)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={3}
                defaultValue="A leading technology company specializing in enterprise software solutions."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" defaultValue="https://techcorp.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select defaultValue="technology">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Legal & Billing */}
          <div className="pt-4 border-t border-border">
            <h3 className="mb-4">Legal & Billing Information</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="legalName">Legal Name</Label>
                <Input id="legalName" defaultValue="TechCorp Inc." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID / VAT Number</Label>
                <Input id="taxId" defaultValue="12-3456789" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Billing Address</Label>
                <Textarea
                  id="address"
                  rows={3}
                  defaultValue="123 Tech Street, Suite 400&#10;San Francisco, CA 94105&#10;United States"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="billingEmail">Billing Email</Label>
                  <Input id="billingEmail" defaultValue="billing@techcorp.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="m-0">Team Members</h3>
              <Button variant="outline" className="gap-2">
                <UserPlus className="w-4 h-4" />
                Invite member
              </Button>
            </div>

            <div className="space-y-3">
              {teamMembers.map((member, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-lg border border-border"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium m-0">{member.name}</p>
                      <p className="text-sm text-muted-foreground m-0">
                        {member.email}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">{member.role}</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline">Cancel</Button>
            <Button className="bg-accent-brand hover:bg-accent-brand-hover">
              Save changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
