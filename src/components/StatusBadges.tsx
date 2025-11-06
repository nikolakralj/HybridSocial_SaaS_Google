import { Eye, Globe, Lock, Users, CheckCircle, AlertCircle, Clock, XCircle, Calendar } from "lucide-react";
import { Badge } from "./ui/badge";

/**
 * Visibility Badges - Show who can see the content
 */

interface VisibilityBadgeProps {
  type: "public" | "private" | "shared";
  sharedWith?: string;
}

export function VisibilityBadge({ type, sharedWith }: VisibilityBadgeProps) {
  switch (type) {
    case "public":
      return (
        <Badge variant="outline" className="gap-1.5 border-success text-success">
          <Globe className="w-3 h-3" />
          <span className="text-xs">Public</span>
        </Badge>
      );
    case "private":
      return (
        <Badge variant="outline" className="gap-1.5">
          <Lock className="w-3 h-3" />
          <span className="text-xs">Private</span>
        </Badge>
      );
    case "shared":
      return (
        <Badge variant="outline" className="gap-1.5 border-accent-brand text-accent-brand">
          <Users className="w-3 h-3" />
          <span className="text-xs">Shared with {sharedWith || "X"}</span>
        </Badge>
      );
  }
}

/**
 * Claim Status Badges - Worker Record state
 */

interface ClaimStatusBadgeProps {
  status: "unclaimed" | "claimed";
}

export function ClaimStatusBadge({ status }: ClaimStatusBadgeProps) {
  switch (status) {
    case "unclaimed":
      return (
        <Badge variant="outline" className="gap-1.5 border-warning text-warning">
          <AlertCircle className="w-3 h-3" />
          <span className="text-xs">Unclaimed</span>
        </Badge>
      );
    case "claimed":
      return (
        <Badge variant="outline" className="gap-1.5 border-success text-success">
          <CheckCircle className="w-3 h-3" />
          <span className="text-xs">Claimed</span>
        </Badge>
      );
  }
}

/**
 * Representation Badges - Agency relationship
 */

interface RepresentationBadgeProps {
  type: "exclusive" | "non-exclusive";
  endDate?: string;
}

export function RepresentationBadge({ type, endDate }: RepresentationBadgeProps) {
  return (
    <Badge variant="outline" className="gap-1.5 border-purple-500 text-purple-500">
      <Users className="w-3 h-3" />
      <span className="text-xs capitalize">
        {type === "exclusive" ? "Exclusive" : "Non-exclusive"}
        {endDate && ` • Ends ${endDate}`}
      </span>
    </Badge>
  );
}

/**
 * Consent Badges - Agency → Client sharing
 */

interface ConsentBadgeProps {
  status: "requested" | "approved" | "declined" | "expired";
}

export function ConsentBadge({ status }: ConsentBadgeProps) {
  switch (status) {
    case "requested":
      return (
        <Badge variant="outline" className="gap-1.5 border-warning text-warning">
          <Clock className="w-3 h-3" />
          <span className="text-xs">Consent Requested</span>
        </Badge>
      );
    case "approved":
      return (
        <Badge variant="outline" className="gap-1.5 border-success text-success">
          <CheckCircle className="w-3 h-3" />
          <span className="text-xs">Approved</span>
        </Badge>
      );
    case "declined":
      return (
        <Badge variant="outline" className="gap-1.5 border-destructive text-destructive">
          <XCircle className="w-3 h-3" />
          <span className="text-xs">Declined</span>
        </Badge>
      );
    case "expired":
      return (
        <Badge variant="outline" className="gap-1.5 border-muted-foreground text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span className="text-xs">Expired</span>
        </Badge>
      );
  }
}

/**
 * Availability Badge - Personal Profile
 */

interface AvailabilityBadgeProps {
  status: "available" | "limited" | "unavailable";
  availableFrom?: string;
}

export function AvailabilityBadge({ status, availableFrom }: AvailabilityBadgeProps) {
  switch (status) {
    case "available":
      return (
        <Badge className="bg-success text-success-foreground gap-1.5">
          <div className="w-2 h-2 rounded-full bg-white" />
          <span className="text-xs">Available</span>
        </Badge>
      );
    case "limited":
      return (
        <Badge className="bg-warning text-warning-foreground gap-1.5">
          <Clock className="w-3 h-3" />
          <span className="text-xs">Limited Availability</span>
        </Badge>
      );
    case "unavailable":
      if (availableFrom) {
        return (
          <Badge variant="outline" className="gap-1.5 border-muted-foreground text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span className="text-xs">Available from {availableFrom}</span>
          </Badge>
        );
      }
      return (
        <Badge variant="outline" className="gap-1.5 border-muted-foreground text-muted-foreground">
          <span className="text-xs">Not Available</span>
        </Badge>
      );
  }
}

/**
 * Document Status Badge - Contracts
 */

interface DocumentStatusBadgeProps {
  status: "draft" | "sent" | "viewed" | "signed" | "counter-signed";
}

export function DocumentStatusBadge({ status }: DocumentStatusBadgeProps) {
  switch (status) {
    case "draft":
      return (
        <Badge variant="outline" className="gap-1.5 text-xs">
          Draft
        </Badge>
      );
    case "sent":
      return (
        <Badge variant="outline" className="gap-1.5 border-accent-brand text-accent-brand text-xs">
          <Clock className="w-3 h-3" />
          Sent
        </Badge>
      );
    case "viewed":
      return (
        <Badge variant="outline" className="gap-1.5 border-warning text-warning text-xs">
          <Eye className="w-3 h-3" />
          Viewed
        </Badge>
      );
    case "signed":
      return (
        <Badge variant="outline" className="gap-1.5 border-success text-success text-xs">
          <CheckCircle className="w-3 h-3" />
          Signed
        </Badge>
      );
    case "counter-signed":
      return (
        <Badge className="bg-success text-success-foreground gap-1.5 text-xs">
          <CheckCircle className="w-3 h-3" />
          Fully Executed
        </Badge>
      );
  }
}

/**
 * Timesheet Status Badge
 */

interface TimesheetStatusBadgeProps {
  status: "draft" | "submitted" | "approved" | "rejected";
}

export function TimesheetStatusBadge({ status }: TimesheetStatusBadgeProps) {
  switch (status) {
    case "draft":
      return (
        <Badge variant="outline" className="gap-1.5 text-xs">
          Draft
        </Badge>
      );
    case "submitted":
      return (
        <Badge variant="outline" className="gap-1.5 border-accent-brand text-accent-brand text-xs">
          <Clock className="w-3 h-3" />
          Submitted
        </Badge>
      );
    case "approved":
      return (
        <Badge variant="outline" className="gap-1.5 border-success text-success text-xs">
          <CheckCircle className="w-3 h-3" />
          Approved
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="outline" className="gap-1.5 border-destructive text-destructive text-xs">
          <XCircle className="w-3 h-3" />
          Rejected
        </Badge>
      );
  }
}
