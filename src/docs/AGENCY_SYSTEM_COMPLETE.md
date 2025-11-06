# WorkGraph Agency System - Complete Implementation

## Overview
Complete implementation of multi-workspace agency system with role-based access control, visibility scopes, and Deal Rooms. One account can access multiple workspaces (Personal, Company, Agency) with context-aware navigation and permissions.

---

## 🎯 Core Principles

### 1. One Account, Many Workspaces
- **Single login** per person
- Access any workspace via Context Chooser
- No need for "second personal account" to work at agency
- Act as "James @ Elite Recruiters" when in agency context

### 2. Agency Roles & Permissions
Every agency member has a role that controls what they can see and do:

- **Owner** – Full access to everything
- **Admin** – Members, teams, settings
- **Account Manager** – Client relationships & deals; can submit candidates
- **Recruiter** – Manages candidates; can submit to clients on assigned deals
- **Sourcer** – Adds candidates, cannot submit externally; proposes to recruiters
- **Finance** – Sees rates/invoices, not candidate PII by default
- **Viewer** – Read-only on assigned work

### 3. Visibility Scopes
**Default rule**: Agency members do NOT see each other's deals by default.

Three scope levels:
- **Participants only** (default) – Only people listed on the Deal Room
- **Team** – Visible to a named team inside the agency
- **Agency-wide** – Rare; Owners/Admins can promote visibility

---

## 📦 Components Implemented

### 1. AgencyRoleBadge
**Location**: `/components/AgencyRoleBadge.tsx`

**Features**:
- 7 colored role badges with semantic colors
- Each role has label, description, and permission scope
- `getRoleDescription(role)` helper function
- Colors:
  - Owner: Purple
  - Admin: Blue (brand)
  - Account Manager: Emerald
  - Recruiter: Blue
  - Sourcer: Cyan
  - Finance: Orange
  - Viewer: Gray

**Usage**:
```tsx
import { AgencyRoleBadge } from "./AgencyRoleBadge";

<AgencyRoleBadge role="account-manager" />
```

---

### 2. VisibilityScopeBadge
**Location**: `/components/VisibilityScopeBadge.tsx`

**Features**:
- 3 scope badges with icons and colors
- Lock icon for "Participants only"
- Users icon for "Team"
- Building2 icon for "Agency-wide"
- Optional teamName prop for Team scope
- `getScopeDescription(scope)` helper function

**Usage**:
```tsx
import { VisibilityScopeBadge } from "./VisibilityScopeBadge";

<VisibilityScopeBadge scope="participants" />
<VisibilityScopeBadge scope="team" teamName="Enterprise Team" />
```

---

### 3. ContextChooserEnhanced
**Location**: `/components/ContextChooserEnhanced.tsx`

**Features**:
- ✅ Grid of available contexts (Personal, Company, Agency)
- ✅ Last active timestamp for each
- ✅ Role badges (Owner, Admin, etc.)
- ✅ Context type icons with gradient backgrounds
- ✅ **Two new actions below grid**:
  - "Join existing workspace" (enter email or invite code)
  - "Create new workspace" (for owners)
- ✅ Hover states and smooth transitions

**New Actions**:
1. **Join Existing Workspace**
   - Opens JoinWorkspaceFlow
   - Enter work email → auto-detect agency by domain
   - Or enter invite code if no match

2. **Create New Workspace**
   - Opens OnboardingAgency flow
   - For company or agency owners

---

### 4. JoinWorkspaceFlow
**Location**: `/components/JoinWorkspaceFlow.tsx`

**Features**:
- ✅ **Step 1: Enter work email**
  - Checks if domain matches known workspace
  - Example: `james@eliterecruiters.com` → finds "Elite Recruiters"
- ✅ **Step 2a: Workspace found**
  - Shows agency/company card with domain
  - "Request Access" button → sends to admins
  - "Try different email" option
- ✅ **Step 2b: No match found**
  - Prompts for invite code
  - "Try with email instead" link
- ✅ **Step 3: Pending approval**
  - Confirmation screen
  - "Back to workspaces" button

**Flow**:
```
Email Entry
   ↓
Domain Match? 
   ↓ Yes               ↓ No
Found Screen      Invite Code Entry
   ↓                    ↓
Request Access    Join Workspace
   ↓
Pending Screen
```

---

### 5. OnboardingAgency
**Location**: `/components/OnboardingAgency.tsx`

**Features**:
- ✅ **Step 1: Choice tiles**
  - "Create Agency" (for owners)
  - "Join Agency" (for employees)
  - Both with icons and descriptions
- ✅ **Create path**:
  - Enter agency name
  - Shows list of what you'll be able to do
  - Creates agency with Owner role
- ✅ **Join path**:
  - Enter work email → check domain
  - If found: show agency + request access
  - If not found: prompt for invite code
- ✅ Progress bar at top
- ✅ Completion screen with next steps

**Microcopy**:
- "Are you creating a new agency or joining an existing one?"
- "You'll be the owner with full access to settings and team management"
- "We'll check if this email matches a registered agency domain"

---

### 6. DealRoom
**Location**: `/components/DealRoom.tsx`

**Features**:

#### Header
- ✅ **Title**: Client · Role (e.g., "RetailCo · Senior Developer")
- ✅ **Status badge**: Prospect → Submitted → Interview → Offer → Signed
- ✅ **Deal type badge**: Placement / T&M / Outstaff
- ✅ **Visibility scope badge**: Participants only / Team / Agency-wide
- ✅ **Participants preview**: First 3 shown, "+X more" if applicable
- ✅ **Actions dropdown**:
  - Add Participant
  - Change Scope
  - Submit Candidate
  - Draft Contract

#### Participants Drawer (Sheet)
- ✅ Sidebar showing all participants
- ✅ Visibility scope explanation
- ✅ Each participant shows:
  - Name + Avatar
  - Type badge (Agency / Client / Candidate)
  - Agency role badge (for agency members)
  - Link2 icon if has linked profile
- ✅ "Add Participant" button

#### Tabs
1. **Overview**
   - Timeline with checkmarks
   - Deal details (client, role, type)
   - Key contacts

2. **Messages**
   - Thread view
   - Internal/Private notes toggle
   - Message composer with "Internal only" switch
   - Attach files button
   - Each message shows if internal (yellow badge)

3. **Documents**
   - File list with upload date
   - "Visible to" badges showing parties
   - Upload button

4. **Candidates**
   - Candidate card with submission date
   - View Profile button

5. **Time & Billing** (T&M only)
   - Hours this week/month
   - Pending invoices
   - Timesheet management

**Deal Types**:
- **Placement**: Agency places candidate at company
- **T&M (Time & Materials)**: Agency supplies time; shows billing tab
- **Outstaff**: Similar to T&M; candidate may be subcontracted

---

### 7. AgencyDemo
**Location**: `/components/AgencyDemo.tsx`

**Features**:
- ✅ **Comprehensive demo** of all agency features
- ✅ **4 tabs**:
  1. Agency Roles – Interactive role selector with permission details
  2. Visibility Scopes – Scope selector with "who can see" examples
  3. Team Members – List with role badges and active deal counts
  4. Deal Rooms – Example deals with different scopes

**Purpose**: Educational component showing how roles and scopes work together

---

## 🔐 Role-Based Permissions

### Owner
- ✅ Full access to all agency data and settings
- ✅ Can create and manage teams
- ✅ Can assign and change roles
- ✅ Billing and subscription management

### Admin
- ✅ Manage team members and permissions
- ✅ Configure agency settings
- ✅ View all teams and deals
- ❌ Cannot access billing

### Account Manager
- ✅ Manage client relationships
- ✅ Create and manage deal rooms
- ✅ Submit candidates to clients
- ✅ View deals they're assigned to
- ❌ Cannot see other AMs' deals (unless shared)

### Recruiter
- ✅ Manage candidate database
- ✅ Submit candidates to deals
- ✅ View deals where they're participants
- ❌ Cannot create new clients

### Sourcer
- ✅ Add new candidates to database
- ✅ Propose candidates to recruiters
- ❌ Cannot submit externally
- ❌ View only assigned candidates

### Finance
- ✅ View rates and invoices
- ✅ Generate financial reports
- ❌ No access to candidate PII by default
- ✅ View billing information

### Viewer
- ✅ Read-only access
- ✅ View assigned work only
- ❌ Cannot create or edit
- ❌ Cannot submit candidates

---

## 🔍 Visibility Scope Rules

### Participants Only (Default)
- **Who sees it**: Only people explicitly added to the deal
- **Use case**: Standard deal privacy
- **Example**: Account Manager James + Recruiter Lisa + Client + Candidate

### Team
- **Who sees it**: All members of a named team (e.g., "Enterprise Team")
- **Use case**: Collaboration within a specialized team
- **Example**: Enterprise Team (5 people) working on large accounts

### Agency-Wide
- **Who sees it**: All agency members (except Viewers without explicit access)
- **Use case**: Rare; high-visibility deals or examples
- **Example**: Major placement that Owners want everyone to see

**Key Rule**: By default, deals are "Participants only". Agency members do NOT see each other's work unless explicitly shared.

---

## 🎨 Design System

### Role Badge Colors
```css
Owner: Purple (#8B5CF6)
Admin: Brand Blue (#2563EB)
Account Manager: Emerald (#10B981)
Recruiter: Blue (#3B82F6)
Sourcer: Cyan (#06B6D4)
Finance: Orange (#F59E0B)
Viewer: Gray (#6B7280)
```

### Scope Badge Colors
```css
Participants only: Purple border/text on light purple bg
Team: Blue border/text on light blue bg
Agency-wide: Warning (orange) border/text on light orange bg
```

### Icons
- **Agency roles**: Uses colored badges with semantic colors
- **Visibility scopes**: Lock (Participants), Users (Team), Building2 (Agency-wide)
- **Context types**: User (Personal), Building2 (Company), Users (Agency)

---

## 📋 User Flows

### Flow 1: James joins Elite Recruiters agency

1. **Login**: james@eliterecruiters.com
2. **Context Chooser**: Shows Personal Profile + option to join workspace
3. **Clicks "Join existing workspace"**
4. **Enters email**: james@eliterecruiters.com
5. **System finds**: "Elite Recruiters" (matches domain)
6. **Clicks "Request Access"**
7. **Admin approves**: James gets notification
8. **Next login**: Context Chooser shows "Elite Recruiters" with role badge

### Flow 2: Lisa creates agency

1. **Login**: lisa@newagency.com (first time)
2. **Onboarding**: Selects "I work at an agency"
3. **Shows choice tiles**: Create Agency / Join Agency
4. **Clicks "Create Agency"**
5. **Enters name**: "TopTalent Agency"
6. **System creates**: Agency workspace with Lisa as Owner
7. **Redirects to**: Dashboard in agency context

### Flow 3: Account Manager creates deal

1. **James (Account Manager)** in agency context
2. **Creates new deal**: "RetailCo · Senior Developer"
3. **Sets scope**: "Participants only" (default)
4. **Adds participants**:
   - Himself (Account Manager)
   - Lisa Chen (Recruiter)
   - Client contact
   - (Candidate added later)
5. **Only these 4 people** can see the deal
6. **Other agency members**: Don't see this deal in their lists

---

## 🧪 Testing Checklist

### Context Chooser Enhanced
- [✓] Shows all available contexts
- [✓] "Join existing workspace" opens flow
- [✓] "Create new workspace" opens onboarding
- [✓] Hover states work
- [✓] Last active timestamps display

### Join Workspace Flow
- [✓] Email input validates format
- [✓] Domain matching works (eliterecruiters.com → finds agency)
- [✓] No match → prompts for invite code
- [✓] Request access sends notification (toast)
- [✓] Invite code validates length
- [✓] "Back" navigation works

### Agency Onboarding
- [✓] Choice tiles navigate correctly
- [✓] Create agency form submits
- [✓] Join email flow works
- [✓] Join code flow works
- [✓] Progress bar updates
- [✓] Completion screen shows

### Deal Room
- [✓] Header shows title, status, scope
- [✓] Participants drawer opens/closes
- [✓] All tabs render content
- [✓] Messages toggle internal/external
- [✓] Documents show visibility badges
- [✓] Time & Billing only shows for T&M deals
- [✓] Actions dropdown works

### Role Badges
- [✓] All 7 roles render with correct colors
- [✓] Descriptions match permissions
- [✓] Badges work in lists and cards

### Scope Badges
- [✓] All 3 scopes render with icons
- [✓] Team scope shows team name
- [✓] Colors match design system

---

## 📁 File Structure

```
/components/
  AgencyRoleBadge.tsx          ← 7 role badges with permissions
  VisibilityScopeBadge.tsx     ← 3 scope badges with icons
  ContextChooserEnhanced.tsx   ← Enhanced chooser with join/create
  JoinWorkspaceFlow.tsx        ← Email/invite code flow
  OnboardingAgency.tsx         ← Create or join agency flow
  DealRoom.tsx                 ← Full deal room with tabs
  AgencyDemo.tsx               ← Educational demo component
```

---

## 🎯 Key Microcopy

### Context Chooser
- "Choose your workspace"
- "Select which workspace you'd like to enter"
- "Don't see your workspace?"
- "Join existing workspace" / "Create new workspace"

### Join Workspace
- "Enter your work email to find your agency"
- "We found Elite Recruiters! Request access?"
- "Ask your admin for an invite code"

### Agency Onboarding
- "Are you creating a new agency or joining an existing one?"
- "You'll be the owner with full access to settings and team management"
- "We'll check if this email matches a registered agency domain"

### Deal Room
- "Only participants listed below can see this deal"
- "Who has access"
- "Internal notes only" (toggle)
- "Visible to: [parties]"

---

## 🚀 Production Considerations

### 1. Domain Verification
- Implement actual domain ownership verification
- Add DNS TXT record check for security
- Prevent domain squatting

### 2. Invite Codes
- Generate cryptographically secure codes
- Set expiration dates
- Track usage (one-time vs multi-use)

### 3. Role Changes
- Audit log for role changes
- Notify user when role changes
- Prevent self-promotion (can't make yourself Owner)

### 4. Scope Changes
- Only Owner/Admin can change scope from Participants → Agency-wide
- Notify participants when scope changes
- Audit trail

### 5. Data Access
- Enforce role permissions at API level (not just UI)
- Check scope on every deal room access
- Log all access to sensitive data (Finance viewing rates)

### 6. Notifications
- Email when added to agency
- Email when role changes
- Email when added to deal room
- In-app notifications for deal updates

---

## ✅ Implementation Complete

All agency system features have been fully implemented:

- ✅ Enhanced Context Chooser with join/create actions
- ✅ Join Workspace flow (email + invite code)
- ✅ Agency Onboarding (create or join)
- ✅ 7 Agency Role badges with permissions
- ✅ 3 Visibility Scope badges
- ✅ Deal Room with header, tabs, participants drawer
- ✅ Agency Demo showing all features
- ✅ Integration with AppRouter
- ✅ Demo navigation for all components

Every component follows Apple-inspired design with proper spacing (8px grid), typography (28/20/16/14/12), 44px touch targets, and dark mode support.

---

## 📊 Next Steps for Production

1. **Backend Integration**
   - Domain verification API
   - Invite code generation/validation
   - Role-based API permissions
   - Scope enforcement at data layer

2. **Real-time Updates**
   - WebSocket for deal room messages
   - Live participant presence
   - Notification system

3. **Search & Filters**
   - Deal room search
   - Filter by scope/status
   - Team member search

4. **Analytics**
   - Track deal velocity by role
   - Scope usage patterns
   - Team performance metrics

5. **Mobile Optimization**
   - Deal room responsive layout
   - Touch-optimized participants drawer
   - Mobile message composer
