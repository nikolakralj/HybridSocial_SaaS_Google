# Post-Signup Onboarding Flow

## Overview

The post-signup onboarding is a critical **single-session flow** (<2 minutes) that routes users through persona-specific quick-start experiences. It solves the "empty workspace" problem by collecting just enough information to bootstrap the user into a functional workspace with a personalized checklist.

## User Flow

```
Landing → Sign Up → Welcome (Intent Picker) → Persona Onboarding → Home Feed (with Checklist)
```

### Flow Diagram

```
┌─────────────┐
│   Landing   │
│   (Guest)   │
└──────┬──────┘
       │ Click "Get started free"
       ▼
┌─────────────┐
│  Auth Modal │ (Sign up with SSO/Magic Link)
└──────┬──────┘
       │ New user authenticated
       ▼
┌─────────────────────────────┐
│  Welcome / Intent Picker    │
│                             │
│  ┌─────────────────────┐   │
│  │  I'm a freelancer   │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │  I hire for company │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │  I'm an agency      │   │
│  └─────────────────────┘   │
└──────┬──────────────────────┘
       │
       ├──────────────┬──────────────┐
       │              │              │
       ▼              ▼              ▼
┌────────────┐ ┌────────────┐ ┌────────────┐
│ Freelancer │ │  Company   │ │   Agency   │
│ Quick-Start│ │ Quick-Start│ │ Quick-Start│
│  (3 steps) │ │ (2 steps)  │ │ (2 steps)  │
└─────┬──────┘ └─────┬──────┘ └─────┬──────┘
      │              │              │
      └──────────────┼──────────────┘
                     │
                     ▼
            ┌────────────────┐
            │  Home Feed     │
            │  (with persona │
            │   checklist)   │
            └────────────────┘
```

## Components

### 1. Welcome Component (`/components/Welcome.tsx`)

**Purpose:** Let users self-identify their primary use case

**Features:**
- 3 large intent cards (Freelancer, Company, Agency)
- Single-choice selection (can only pick one)
- Visual feedback on selection (border highlight, checkmark)
- "I have an invite" link for claim-invite flow
- Apple-inspired card design with gradients

**States:**
- `selectedIntent`: null | "freelancer" | "company" | "agency"

**Props:**
```typescript
interface WelcomeProps {
  onContinue: (intent: "freelancer" | "company" | "agency") => void;
  onClaimInvite?: () => void;
}
```

**Logic:**
- User selects an intent → Continue button becomes enabled
- Click Continue → Toast confirmation → Route to appropriate onboarding
- Click "I have an invite" → Route to claim-invite flow (JoinWorkspaceFlow)

---

### 2. Freelancer Onboarding (`/components/onboarding/FreelancerOnboarding.tsx`)

**Purpose:** Collect profile basics, skills, and optional proof

**Flow:** 3 screens with progress indicator

#### F1: Profile Basics
**Fields:**
- Full name* (required)
- Headline* (required) - with autocomplete suggestions
- Location (optional)
- Make profile public (toggle, default: off)

**Autocomplete suggestions:**
- Senior React Developer
- Full-stack Engineer
- Frontend Developer
- Backend Developer

**Validation:**
- Can't proceed without name and headline

#### F2: Skills & Preferences
**Fields:**
- Primary role* (required)
- Skills* (required, multiple chips)
- Hourly rate (min/max, optional)
- Availability (hours/week, optional)
- Work type (contract/full-time/part-time/project, multi-select)

**Skill Input:**
- Type + Enter to add
- Click suggestions to add
- Click added skill to remove

**Suggested Skills:**
- React, TypeScript, Node.js, Python, AWS, Docker, GraphQL, PostgreSQL, Next.js, Tailwind CSS

**Validation:**
- Can't proceed without primary role and at least 1 skill

#### F3: Proof (Optional)
**Fields:**
- GitHub URL
- Portfolio URL
- LinkedIn URL
- Upload resume (simulated)
- Upload case study (simulated)

**Note:** All fields optional - "Skip for now" button available

**CTA:**
- Primary: "Finish & go to Home"
- Secondary: "Skip for now"

**After Completion:**
→ Home feed with **Freelancer checklist**:
- [ ] Complete your profile
- [ ] Follow 5 people or companies
- [ ] Create your first post
- [ ] Turn on public profile

---

### 3. Company Onboarding (`/components/onboarding/CompanyOnboarding.tsx`)

**Purpose:** Create company workspace and set first objective

**Flow:** 2 screens

#### C1: Company Basics
**Fields:**
- Company name* (required)
- Website (optional)
- Country* (required)
- Time zone* (required) - dropdown
- Email domain (optional) - for auto-join

**Time zones:**
- America/New_York (EST)
- America/Chicago (CST)
- America/Los_Angeles (PST)
- Europe/London (GMT)
- Europe/Paris (CET)
- Asia/Tokyo (JST)
- Australia/Sydney (AEST)

**Validation:**
- Can't proceed without company name, country, timezone

**Note:** Email domain allows teammates with matching email to auto-join the workspace

#### C2: First Objective
**Options (3 equal cards):**
1. **Post a contractor role**
   - Icon: Briefcase
   - Description: "Find and hire freelancers for your project"
   - Action: Opens job creation (in real app) → Goes to home

2. **Invite a teammate**
   - Icon: Users
   - Description: "Add managers or finance team members"
   - Action: Shows "Coming soon" toast → Goes to home

3. **Just look around**
   - Icon: Search
   - Description: "Explore the platform at your own pace"
   - Action: Goes directly to home

**After Completion:**
→ Home feed with **Company checklist**:
- [ ] Post your first role
- [ ] Set timesheet approvals
- [ ] Invite a manager or finance teammate

---

### 4. Agency Onboarding (`/components/onboarding/AgencyOnboardingNew.tsx`)

**Purpose:** Create agency workspace and configure work mode

**Flow:** 2 screens

#### A1: Agency Basics
**Fields:**
- Agency name* (required)
- Website (optional)
- Regions served (optional) - with suggestions

**Region suggestions:**
- United States
- United Kingdom
- Europe
- Asia Pacific
- North America
- Global

**Privacy note:**
"Privacy by default: All agency data (candidates, clients, deals) is private to your team only."

**Validation:**
- Can't proceed without agency name

#### A2: How You Work
**Options (3 equal cards):**
1. **Recruiting**
   - Icon: UserCheck
   - Description: "Permanent placements with finder's fees"
   - Sets default workflows for placement deals

2. **Staff Augmentation**
   - Icon: Users
   - Description: "Contract placements (T&M, Outstaff)"
   - Sets default workflows for staffing deals

3. **Both**
   - Icon: Briefcase
   - Description: "Full-service agency doing both models"
   - Enables all workflow types

**Note:** "Don't worry: You can always change this later or handle both types of deals."

**After Completion:**
→ Home feed with **Agency checklist**:
- [ ] Add your first client
- [ ] Create your first deal room
- [ ] Configure roles (Recruiter, Account, Finance)

---

## Home Feed Checklists

The home feed shows persona-specific onboarding checklists for new users:

### Freelancer Checklist (4 steps)
```
Getting started: 0% → 25% → 50% → 75% → 100%
□ Complete your profile
□ Follow 5 people or companies
□ Create your first post
□ Turn on public profile
```

### Company Checklist (3 steps)
```
Getting started: 0% → 33% → 67% → 100%
□ Post your first role
□ Set timesheet approvals
□ Invite a manager or finance teammate
```

### Agency Checklist (3 steps)
```
Getting started: 0% → 33% → 67% → 100%
□ Add your first client
□ Create your first deal room
□ Configure roles (Recruiter, Account, Finance)
```

**Checklist Features:**
- Interactive checkboxes (click to toggle)
- Progress bar updates in real-time
- Toast confirmation on each check
- Success message at 100% completion
- Dismissible (stays in localStorage)

---

## Edge Cases

### 1. Invite Link Present (`?invite=...`)
**Behavior:** Skip welcome → Go to Claim Worker Record or Join Org/Agency flow

**Implementation:**
```typescript
// In AppRouter
const urlParams = new URLSearchParams(window.location.search);
const inviteToken = urlParams.get('invite');

if (inviteToken) {
  setCurrentPage("join-workspace");
}
```

### 2. Existing User Adds New Context
**Scenario:** User with Personal workspace creates a Company workspace

**Behavior:** After "Create Company" → Show Workspace Chooser (because they now have >1 workspace)

**Implementation:**
```typescript
const handleOnboardingComplete = () => {
  if (availableContexts.length > 1) {
    setCurrentPage("context-chooser-enhanced");
  } else {
    setCurrentPage("home");
  }
};
```

### 3. User Backs Out of Onboarding
**Behavior:** Back button on Step 1 → Returns to Welcome (intent picker)

**Implementation:**
- All onboarding components have `onBack` prop
- Step 1: Back → Welcome
- Step 2+: Back → Previous step

### 4. User Closes Browser Mid-Onboarding
**Behavior:** On return, show Workspace Chooser or Welcome (depending on whether workspace was created)

**Implementation:**
```typescript
// In production, check backend for incomplete onboarding
if (user.onboardingComplete === false) {
  setCurrentPage("welcome");
} else if (user.workspaces.length > 1) {
  setCurrentPage("context-chooser");
} else {
  setCurrentPage("home");
}
```

---

## Workspace Chooser Integration

### When to Show
The Workspace Chooser appears when:
1. User has 2+ workspaces AND
2. Previous session didn't pin one

### When to Skip
- User has only 1 workspace → Go directly to that workspace's home
- User has `lastWorkspaceId` in localStorage → Go to that workspace

**Example:**
```typescript
// On app load
const lastWorkspaceId = localStorage.getItem('lastWorkspaceId');
const userWorkspaces = await fetchWorkspaces();

if (userWorkspaces.length === 1) {
  // Only one workspace - skip chooser
  setCurrentWorkspace(userWorkspaces[0]);
  navigate('/home');
} else if (lastWorkspaceId) {
  // Return to last workspace
  const workspace = userWorkspaces.find(w => w.id === lastWorkspaceId);
  setCurrentWorkspace(workspace);
  navigate('/home');
} else {
  // Show chooser
  navigate('/choose-workspace');
}
```

---

## Backend API Calls (For Production)

### POST /api/bootstrap
**Purpose:** Create initial workspace and profile stub

**Request:**
```json
{
  "persona": "freelancer" | "company" | "agency",
  "userId": "user-123"
}
```

**Response:**
```json
{
  "workspaceId": "ws-456",
  "workspaceType": "personal" | "company" | "agency",
  "profileStub": {
    "id": "profile-789",
    "completionPercentage": 20
  }
}
```

**Logic:**
- `freelancer` → Create Personal workspace + profile stub
- `company` → Create Org with user as Owner
- `agency` → Create Agency with user as Owner

### PATCH /api/onboarding/freelancer
**Purpose:** Save freelancer onboarding data

**Request:**
```json
{
  "fullName": "Sarah Chen",
  "headline": "Senior React Developer",
  "location": "San Francisco, CA",
  "makePublic": false,
  "primaryRole": "Frontend Developer",
  "skills": ["React", "TypeScript", "Next.js"],
  "hourlyRate": { "min": 100, "max": 200 },
  "availability": 40,
  "workType": ["contract", "fulltime"],
  "githubUrl": "github.com/sarahchen",
  "portfolioUrl": "sarahchen.dev",
  "linkedinUrl": "linkedin.com/in/sarahchen"
}
```

### PATCH /api/onboarding/company
**Purpose:** Save company onboarding data

**Request:**
```json
{
  "companyName": "Acme Inc.",
  "website": "https://acme.com",
  "country": "United States",
  "timezone": "America/New_York (EST)",
  "emailDomain": "acme.com"
}
```

### PATCH /api/onboarding/agency
**Purpose:** Save agency onboarding data

**Request:**
```json
{
  "agencyName": "Elite Recruiters",
  "website": "https://eliterecruiters.com",
  "regions": "United States, Europe",
  "workMode": "both"
}
```

---

## Analytics Events

Track these events for conversion optimization:

### Welcome / Intent Picker
```typescript
analytics.track('intent_selected', {
  intent: 'freelancer' | 'company' | 'agency',
  source: 'welcome_page'
});

analytics.track('claim_invite_clicked', {
  source: 'welcome_page'
});
```

### Onboarding
```typescript
analytics.track('onboarding_step_viewed', {
  persona: 'freelancer' | 'company' | 'agency',
  step: 1 | 2 | 3,
  stepName: 'profile_basics' | 'skills' | 'proof' | ...
});

analytics.track('onboarding_step_completed', {
  persona: 'freelancer' | 'company' | 'agency',
  step: 1 | 2 | 3,
  timeSpentSeconds: 45
});

analytics.track('onboarding_skipped', {
  persona: 'freelancer' | 'company' | 'agency',
  step: 3,
  reason: 'skip_button_clicked'
});

analytics.track('onboarding_completed', {
  persona: 'freelancer' | 'company' | 'agency',
  totalTimeSeconds: 120,
  stepsCompleted: 3,
  fieldsFilledCount: 8
});
```

### Home Checklist
```typescript
analytics.track('checklist_item_checked', {
  persona: 'freelancer' | 'company' | 'agency',
  item: 'complete_profile' | 'follow_5' | 'create_post' | ...,
  progress: 25 | 33 | 50 | 67 | 75 | 100
});

analytics.track('checklist_completed', {
  persona: 'freelancer' | 'company' | 'agency',
  timeToCompleteHours: 2.5
});
```

---

## Design Tokens

All components use the Apple-inspired design system:

### Colors
```css
--accent-brand: #3B77FF;
--accent-brand-hover: #2E5ED1;
--background: #F7F8FA;
--card: #FFFFFF;
--border: #E6E8EC;
--muted-foreground: #6B7280;
--success: #10B981;
```

### Spacing
```
Padding: 8px (p-2), 16px (p-4), 24px (p-6), 32px (p-8)
Gap: 12px (gap-3), 16px (gap-4), 24px (gap-6)
```

### Border Radius
```
Cards: 12px (rounded-xl)
Buttons: 8px (rounded-lg)
Pills: 9999px (rounded-full)
```

### Typography
```
H1: 28px (--text-2xl), semibold
H2: 20px (--text-xl), semibold
H3: 16px (--text-lg), semibold
Body: 14px (--text-base), normal
Small: 12px (--text-sm), normal
```

---

## Testing Checklist

### Visual Tests
- [ ] Welcome cards display correctly at 375px, 1024px, 1440px
- [ ] Selected intent shows checkmark and blue border
- [ ] Step indicators update correctly (1 → 2 → 3)
- [ ] Progress bar animates smoothly (0% → 100%)
- [ ] All forms are responsive and inputs are accessible

### Interaction Tests
- [ ] Can't click Continue without selecting an intent
- [ ] Can't proceed to next step without required fields
- [ ] Back button works at each step
- [ ] "Skip for now" button only appears on optional steps
- [ ] Checklist items toggle correctly
- [ ] Toast notifications appear on all actions

### Flow Tests
- [ ] Freelancer flow: Welcome → F1 → F2 → F3 → Home (Freelancer checklist)
- [ ] Company flow: Welcome → C1 → C2 → Home (Company checklist)
- [ ] Agency flow: Welcome → A1 → A2 → Home (Agency checklist)
- [ ] Invite link flow: Skip welcome → Join workspace
- [ ] Existing user flow: Skip welcome → Workspace chooser (if >1)

### Data Tests
- [ ] Form data persists across steps (back/forward navigation)
- [ ] Skill chips can be added and removed
- [ ] File upload simulation works (shows "uploaded" state)
- [ ] Timezone dropdown populates correctly
- [ ] Region suggestions can be clicked

---

## Future Enhancements

### Phase 1: Smart Defaults
- Pre-fill location from IP geolocation
- Suggest skills based on headline (GPT-4)
- Auto-detect timezone from browser

### Phase 2: Progressive Onboarding
- Skip most fields → Fill in as-needed prompts in home feed
- "Your profile is 40% complete" banner
- Contextual tooltips ("Add skills to get better job matches")

### Phase 3: Social Proof
- "15,234 freelancers joined this week"
- "Companies like Google, Stripe use WorkGraph"
- Real-time activity feed ("Sarah just got hired!")

### Phase 4: Personalization
- AI-generated profile summary
- Skill recommendations based on market demand
- Suggested connections based on industry

---

## Implementation Status

✅ **Completed:**
- Welcome component with intent picker
- Freelancer onboarding (3 steps)
- Company onboarding (2 steps)
- Agency onboarding (2 steps)
- Home feed with persona-specific checklists
- AppRouter integration
- Progress indicators
- Form validation
- Toast notifications
- Responsive design

🔲 **TODO (Backend):**
- `/api/bootstrap` endpoint
- `/api/onboarding/{persona}` endpoints
- Workspace creation logic
- Profile stub creation
- Onboarding state persistence
- Analytics event tracking
- Invite link handling

---

## Quick Start (For Developers)

### Test the Flow

1. **Open the app** → Lands on Landing page
2. **Click "Get started free"** → Opens auth modal
3. **Sign up with email containing "new"** (e.g., `new@test.com`) → Triggers new user flow
4. **Select an intent** → Freelancer / Company / Agency
5. **Complete onboarding** → Fill forms, proceed through steps
6. **Land on home** → See persona-specific checklist
7. **Check items** → Watch progress bar update

### Jump to Specific Component

Use the Demo Navigation panel (bottom-right):

- **🎯 Welcome / Intent Picker** → See intent selection
- **Freelancer Onboarding 🆕** → Test freelancer flow
- **Company Onboarding 🆕** → Test company flow
- **Agency Onboarding 🆕** → Test agency flow
- **🔥 Home Feed** → See checklist (set `isNewUser=true` and `persona`)

### Code Example

```typescript
// Simulate new freelancer user
<FeedHome 
  isNewUser={true} 
  userName="Sarah Chen" 
  persona="freelancer" 
/>

// Simulate new company user
<FeedHome 
  isNewUser={true} 
  userName="Acme Inc" 
  persona="company" 
/>

// Simulate new agency user
<FeedHome 
  isNewUser={true} 
  userName="Elite Recruiters" 
  persona="agency" 
/>
```

---

**Built by:** WorkGraph Team  
**Last updated:** October 9, 2025  
**Version:** 1.0.0
