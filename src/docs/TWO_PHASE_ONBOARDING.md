# Two-Phase Onboarding System

Complete implementation of modern SaaS onboarding following Slack, Notion, and Airtable patterns: **One account, multiple workspaces**.

## 🎯 Core Principle

**Single account → Multiple workspace memberships**

Like Slack, Notion, and Airtable, WorkGraph separates:
1. **Personal Profile** (your identity - one per user)
2. **Workspaces** (companies/agencies you belong to - many per user)

## 📋 Two-Phase Flow

### Phase 1: Create Personal Profile (ALWAYS)
Every user gets a personal profile, regardless of intent:
- Stores: Name, headline, email, bio
- Acts as: Unique identity across all workspaces
- Allows: Following people, applying to jobs, being linked to multiple orgs
- Benefits company/agency admins: Others know who they're dealing with

### Phase 2: Set Up Workspace (CONDITIONAL)
Based on intent selected during signup:
- **Freelancer** → Extended profile setup (skills, rate, portfolio)
- **Company** → Company workspace creation (name, domain, team invites)
- **Agency** → Agency workspace creation (name, team, fee structure)

## 🔄 User Flows

### Freelancer Flow
```
Landing → Enter email + select "I'm freelancing"
  ↓
Phase 1: Personal Profile Setup
  - Full name (required)
  - Headline (required)
  - Bio (optional)
  ↓
Phase 2: Freelancer Extended Profile
  - Skills
  - Hourly rate
  - Availability
  - Portfolio links
  ↓
Feed (Personal Context)
```

### Company Admin Flow
```
Landing → Enter email + select "I'm hiring contractors"
  ↓
Phase 1: Personal Profile Setup
  - Full name (required)
  - Headline (required)
  - Bio (optional)
  - Button: "I'll do this later" (skip to workspace)
  ↓
Phase 2: Company Workspace Setup
  - Company name
  - Domain/website
  - Invite teammates
  - Button: "I'll do this later" (skip to feed)
  ↓
Feed (Company Context)
```

### Agency Admin Flow
```
Landing → Enter email + select "I'm placing talent"
  ↓
Phase 1: Personal Profile Setup
  - Full name (required)
  - Headline (required)
  - Bio (optional)
  - Button: "I'll do this later"
  ↓
Phase 2: Agency Workspace Setup
  - Agency name
  - Team size
  - Fee structure
  - Button: "I'll do this later"
  ↓
Feed (Agency Context)
```

## 🏗️ Architecture

### AppRouter.tsx
**State management:**
```typescript
const [currentRoute, setCurrentRoute] = useState<AppRoute>("landing");
const [userIntent, setUserIntent] = useState<PersonaType | null>(null);
const [userData, setUserData] = useState<UserData | null>(null);
```

**Routing logic:**
```typescript
handleSignUp(email, intent)
  ↓
Store: email + intent
  ↓
Route: personal-profile-setup (Phase 1)
  ↓
handlePersonalProfileComplete(profileData)
  ↓
Update: userData with profile
  ↓
Route based on intent:
  - freelancer → freelancer-onboarding (Phase 2)
  - company → company-onboarding (Phase 2)
  - agency → agency-onboarding (Phase 2)
  - null → feed (minimal setup)
```

### Components

#### 1. PersonalProfileSetup.tsx (NEW)
**Purpose:** Phase 1 - Create personal identity

**Props:**
- `userEmail: string` - Email from signup
- `onComplete: (profileData) => void` - Continue to Phase 2
- `onSkip?: () => void` - Skip to workspace (company/agency)
- `mode: "required" | "optional"` - For freelancers vs admins

**Fields:**
- Email (readonly, from signup)
- Full name (required)
- Professional headline (required)
- Bio (optional)

**Key UX:**
- Shows "Step 1 of 2" progress
- Explains: "Your unique identity across all workspaces"
- Callout: Personal profile is separate from workspaces
- For company/agency: "I'll do this later" button

#### 2. FreelancerOnboarding.tsx (UPDATED)
**Purpose:** Phase 2 for freelancers - Extended profile

**Assumption:** Personal profile already created

**Steps:**
- Welcome screen (value props)
- Skills & preferences
- Proof (optional portfolio links)
- Complete

#### 3. CompanyOnboarding.tsx (UPDATED)
**Purpose:** Phase 2 for companies - Workspace setup

**New props:**
- `userEmail: string`
- `userName: string`
- `onSkip?: () => void`

**Changes:**
- Shows checkmark: "✓ Personal profile created for {userName}"
- Explains: "Set up a workspace to post roles and manage contractors"
- "I'll do this later" button on first step

#### 4. AgencyOnboardingNew.tsx (UPDATED)
**Purpose:** Phase 2 for agencies - Workspace setup

**New props:**
- `userEmail: string`
- `userName: string`
- `onSkip?: () => void`

**Changes:**
- Shows checkmark: "✓ Personal profile created for {userName}"
- Explains: "Set up a workspace for placements and deal rooms"
- "I'll do this later" button on first step

### HeroWarp.tsx (UPDATED)
**New signature:**
```typescript
onGetStarted?: (email: string, intent?: PersonaType) => void
```

**Intent selection:**
- 3 buttons: "I'm freelancing", "I'm hiring contractors", "I'm placing talent"
- Optional selection (can signup without choosing)
- Visual feedback (selected button highlighted)
- Passes intent along with email

## 🎨 UX Improvements

### 1. Clear Intent Selection
Hero now shows three clear options:
- 👤 I'm freelancing (Users icon)
- 🏢 I'm hiring contractors (Building2 icon)
- 🤝 I'm placing talent (Network icon)

Users can select before entering email, or leave unselected for default freelancer flow.

### 2. Progress Indication
Personal profile setup shows:
- "Step 1 of 2" (for freelancers who need Phase 2)
- Progress bar at 50%
- Clear next step preview

### 3. Skip Options
**Freelancers:** Cannot skip personal profile (it's their main identity)

**Company/Agency admins:** 
- Can skip personal profile with "I'll do this later"
- Creates minimal profile from email
- Can skip workspace setup with "I'll do this later"
- Can complete later from dashboard

### 4. Context Awareness
Workspace onboarding screens show:
- ✓ Checkmark: "Personal profile created for {userName}"
- Clear separation: Personal vs Workspace
- Reinforces two-phase concept

## 🔑 Key Benefits

### For Users
✅ **Single login** - Never maintain multiple accounts  
✅ **Flexible** - Start as freelancer, add company later  
✅ **Portable identity** - Personal profile follows you across workspaces  
✅ **No friction** - Can skip optional steps  

### For Product
✅ **Follows best practices** - Slack/Notion/Airtable pattern  
✅ **Scalable** - Easy to add workspace memberships  
✅ **Clear separation** - Personal vs workspace data  
✅ **Better retention** - Users keep one account forever  

## 📊 Comparison: Before vs After

### Before (Confusing)
```
Landing → Pick persona
  ↓
Company → Shown workspace picker? (Wrong!)
Freelancer → Personal profile
Agency → Workspace creation
```

**Problems:**
- Freelancers saw irrelevant workspace UI
- Company admins had no personal profile
- Users needed multiple accounts for multiple roles
- Unclear what happens after signup

### After (Modern SaaS)
```
Landing → Email + intent
  ↓
Phase 1: Personal Profile (always)
  ↓
Phase 2: Workspace setup (if needed)
  ↓
Feed
```

**Improvements:**
- Everyone gets personal profile
- Company/agency admins can skip personal details
- Clear two-phase progression
- Can add workspaces later from dashboard

## 🚀 Future Enhancements

### Multi-Workspace Dashboard
After initial onboarding, users can:
- Click "New Company" to create company workspace
- Click "New Agency" to create agency workspace
- Switch between workspaces via context switcher
- Maintain one personal profile across all

### Workspace Invitations
Users can be invited to existing workspaces:
- Join company as employee
- Join agency as recruiter
- Accept invite without creating new personal profile

### Profile Completion
Users who skipped personal profile can:
- See "Complete your profile" banner
- Add skills, bio, portfolio from settings
- Never forced, always optional

## 📝 Result

A **modern, best-practice onboarding flow** that:
- Separates personal identity from workspace memberships
- Follows Slack/Notion/Airtable patterns
- Allows one account with multiple roles
- Provides clear skip options for busy admins
- Scales to future multi-workspace features
- Reduces user confusion and friction

All while maintaining WorkGraph's identity as a social network + SaaS hybrid.
