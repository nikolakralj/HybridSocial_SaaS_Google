# Entry Experience - Guest to Authenticated User Flow

## Overview

Complete implementation of the entry experience for WorkGraph, blending marketing (SaaS) with community energy (social) to maximize conversion while providing a seamless onboarding flow.

## Entry Modes

### 1. Guest (Not Authenticated)
**Route**: `/` (Landing page)
- **Goal**: Convert visitors by showing product value
- **CTAs**: Get started free, Explore the network, Log in
- **Features**: Read-only social preview, product showcase, pricing snapshot

### 2. Returning User (Has Session)
**Route**: `/home` (Personalized feed)
- **Auto-redirect**: Bypass landing, straight to feed
- **Layout**: 3-column (left rail, main feed, right rail)
- **Content**: Social posts + work updates + recommended connections

### 3. Returning User (No Session)
**Route**: `/` (Landing with sign-in prompt)
- **Banner**: "Continue as your@email.com"
- **Quick action**: One-click sign-in or full auth module

---

## Components Architecture

### Landing Page Components

#### 1. **TopBar** (`/components/TopBar.tsx`)
**Height**: 72px (sticky)
- Logo + brand
- Nav: Product, Solutions, Pricing, Community, Docs
- CTAs: Log in, Sign up
- Mobile menu (hamburger)
- Shadow on scroll

**Features**:
- Sticky positioning with backdrop blur
- Mobile-responsive with collapsible menu
- Guest/authenticated mode switching

#### 2. **AnnouncementBar** (`/components/TopBar.tsx`)
**Optional banner** for announcements
- "We're in open beta — Join free →"
- Dismissible with × button
- Full-width, accent-brand background

#### 3. **Hero** (`/components/Hero.tsx`)
**Above the fold** - Main value proposition
- **H1**: "Connect your work graph"
- **Subcopy**: "Where your professional network meets the tools you use to ship work"
- **CTAs**:
  - Get started free (primary, filled)
  - Explore the network (secondary, outline → scrolls to social preview)
  - Watch demo (text + play icon)
- **Visual**: Interactive device mock with 3 tabs (Feed, Jobs, Dashboard)

**Tabs**:
- Feed: Skeleton post cards
- Jobs: Job listings with badges
- Dashboard: Stats cards (Active, This week, Pipeline)

**Micro-interactions**:
- Tab switching with smooth transitions
- Floating gradient blurs for depth
- Hover effects on CTAs (lift shadow +2)

#### 4. **WhySocialSaaS** (`/components/WhySocialSaaS.tsx`)
**3-up cards** explaining the hybrid model
- **Networked Profiles**: Follow talent and teams. Share updates and wins.
- **Work OS**: Move from 'interview' to 'invoice' without context switching.
- **Built for Teams**: One login, multiple workspaces and permissions.

**Features**:
- Icon-based cards with gradient backgrounds
- Hover effects (lift + scale)
- Clear, benefit-focused copy

#### 5. **SocialPreview** (`/components/SocialPreview.tsx`)
**Read-only social graph** preview
- **Left (2/3)**: Trending posts (top 5 with avatars, reactions, tags)
- **Right (1/3)**: Featured profiles with Follow CTA

**Interactions Gated**:
- Like, Comment, Follow → Opens sign-up modal
- Toast notification: "Sign up to interact with posts"

**Sample Data**:
- 5 trending posts from diverse personas
- 3 featured profiles with skills badges
- Real engagement numbers (likes, comments, shares)

#### 6. **ProductShowcase** (`/components/ProductShowcase.tsx`)
**3 sections** with alternating image/text layout

**Section A - Recruit & Deals**:
- Storyboard: Create Job → Agency submits → Interview → Offer → Contract
- Checkmarks for completed steps
- Visual timeline with icons

**Section B - Worker Records & Time**:
- Screenshot with tooltips for Rates, Approvals, Contracts
- Grid layout showing cost/bill rates
- Approval chain indicator

**Section C - Invoices & Finance**:
- "Approved hours → invoice" diagram
- Money flow visualization
- Status badges (Approved, Sent, Paid)

#### 7. **PricingSnapshot** (`/components/PricingSnapshot.tsx`)
**3-tier pricing cards**
- **Free**: Individual ($0) - Personal profile, follow, post, job search
- **Team**: Small teams ($29/user/month) - Everything + workspace, time tracking, deals
- **Business**: Agencies ($99/user/month) - Everything + advanced RBAC, integrations

**Features**:
- "Most Popular" badge on Team plan
- Highlighted card with border + shadow
- "Compare plans" link below cards

#### 8. **Footer** (`/components/Footer.tsx`)
**4-column links + brand**
- **Product**: Features, Pricing, Security, Roadmap
- **Company**: About, Careers, Blog, Press
- **Resources**: Docs, API, Community, Support
- **Legal**: Privacy, Terms, Cookies, Status
- Social icons (Twitter, GitHub, LinkedIn)
- Copyright notice

---

### Authentication Components

#### 9. **LoginEnhanced** (`/components/LoginEnhanced.tsx`)
**Unified sign-in/sign-up panel** (320–480w)

**Features**:
- **Tabs**: Sign in / Sign up (single toggle)
- **Social SSO**: Google, GitHub, Apple, Microsoft
- **Email**: Continue with email (auto-detect new vs existing)
- **Magic Link**: "Email me a magic link" (passwordless)
- **Password**: Shown only when needed, with eye toggle
- **Remember me**: Checkbox for persistent session
- **Forgot password**: Link to reset flow

**Dynamic Subtitle**:
- Guest: "Join the network. It's free."
- Returning: "Welcome back, Sarah"

**Error States**:
- Inline validation errors
- Lockout messaging
- Link to Status page

**Legal**:
- "By continuing you agree to the Terms & Privacy" (links)

**Accessibility**:
- Larger hit areas (44px min)
- Visible focus rings (2px outline)
- ARIA live regions for errors

**Success Flow**:
- Magic link sent → "Check your email" screen
- Email sent animation (✓ icon)
- "Open mail app" button

#### 10. **FeedHome** (`/components/FeedHome.tsx`)
**Authenticated home** for returning users

**Layout** (3-column on desktop):

**Left Rail (240px)**:
- **Quick Actions**: New Job, New Post, Invite
- **Workspaces Switcher**: Personal, TechCorp, Elite Recruiters
- Context avatars with names

**Main Feed (flexible)**:
- **Composer**: "Share update / Ask / Show progress"
  - Attachments: Image, Job, Link, Poll
  - Expand on focus
  - Post button (disabled until content)
- **Mixed Feed**: Posts, job changes, milestones
  - Social interactions (like, comment, repost, bookmark)
  - Inline job/apply cards
  - Skeleton shimmer while loading

**Right Rail (320px)**:
- **My Week**: Hours logged (progress bar), Tasks due, Completed, Meetings
- **Suggested Connections**: 3 people/companies with Follow CTA
- **Jobs for You**: Top 3 roles based on profile

**Empty State** (Brand new user):
- **3-step checklist**:
  1. Complete profile
  2. Follow 5 people/companies
  3. Create first post/job
- Progress pill at top (0%, 33%, 66%, 100%)
- Checkboxes turn green with ✓ when completed

---

## Visual System

### Typography
- **Font**: Inter (system fallback)
- **Sizes**: 12/14/16/20/24/32px
- **Weights**: 400 (normal), 600 (semibold)

### Colors
- **Brand**: `--accent-brand` (#2563EB)
- **Neutrals**: `--gray-50…900`
- **Accents**: `--green-500` (success), `--amber-500` (warning), `--red-500` (danger)

### Elevation
- **Shadows**: 2/8/16px blur
- **Rounded**: 8px (card borders)

### Spacing
- **Scale**: 4px multiples (4/8/12/16/24/32)

### Focus
- **Outline**: 2px solid `--accent-brand`
- **Contrast**: AA compliant

### Dark Mode
- **Default**: Auth pages use dark mode
- **Landing**: Mirrors user OS preference

---

## User Flows

### Guest → Sign Up
1. Land on `/` (Landing page)
2. Click "Get started free" or "Sign up"
3. → **LoginEnhanced** (mode: signup)
4. Choose SSO or enter email
5. If email → Password field appears
6. Click "Create account"
7. → **FeedHome** (empty state with checklist)

### Guest → Explore → Sign Up
1. Land on `/` (Landing page)
2. Click "Explore the network"
3. Scroll to **SocialPreview**
4. Click Like/Comment/Follow on a post
5. → Sign-up modal/toast prompts
6. Click "Sign up"
7. → **LoginEnhanced** (mode: signup)

### Returning User → Sign In
1. Land on `/` (Landing page)
2. Banner: "Continue as sarah@example.com"
3. Click banner or "Log in"
4. → **LoginEnhanced** (mode: signin, email pre-filled)
5. Enter password or click "Magic link"
6. → **FeedHome** (active feed with posts)

### Returning User (Has Session)
1. Navigate to `/`
2. Auto-detect session
3. **Bypass landing** → Redirect to `/home`
4. → **FeedHome** (active feed)

### Multi-Context User
1. Sign in
2. If multiple workspaces available:
   - → **ContextChooser**
   - Select: Personal, Company, or Agency
3. → **FeedHome** in selected context

---

## Micro-Interactions

### CTA Hover
- **Effect**: Subtle lift (shadow +2), 120ms ease-out
- **Cursor**: Pointer

### Composer
- **Expand**: On focus, min-height increases
- **Attachments**: Show chips below textarea
- **Post button**: Disabled (muted) until content entered

### Feed Skeletons
- **Shimmer**: Animated gradient for first 3 cards
- **Duration**: 300ms while data loads

### Auth Magic Link
- **Progress**: Dots animation during send
- **Success**: Toast with "Open mail app" button
- **Email screen**: ✓ icon with "Check your email"

### Social Preview Gating
- **Click**: Like/Comment/Follow
- **Toast**: "Sign up to interact with posts" + description
- **Action**: Opens sign-up modal

---

## Analytics Hooks

### Landing Page
- Hero CTA click rate (Get started / Explore)
- Social preview engagement → sign-up conversion
- Scroll depth (how many reach pricing?)

### Auth
- SSO vs email vs magic link split
- Error rate by provider
- Time to complete sign-up

### First Session
- Completion of 3-step checklist
- Time to first post
- Profile completion rate

---

## Responsive Breakpoints

### Desktop (1440px+)
- Full 3-column layout on Home
- Side-by-side product showcase

### Tablet (1024px)
- Collapse right rail under feed
- Sticky top bar remains
- 2-column product showcase

### Mobile (375px)
- Single column everywhere
- Hamburger menu in TopBar
- Composer pinned at top of feed
- Stack product sections vertically

---

## Implementation Status

### ✅ Completed Components
- [x] TopBar (guest/authenticated modes)
- [x] AnnouncementBar (dismissible)
- [x] Hero (with interactive tabs)
- [x] WhySocialSaaS (3-up cards)
- [x] SocialPreview (read-only with gating)
- [x] ProductShowcase (3 sections)
- [x] PricingSnapshot (3 tiers)
- [x] Footer (4-column links)
- [x] LoginEnhanced (SSO + magic link)
- [x] FeedHome (3-column layout)
- [x] Landing (main composition)

### ✅ Features
- [x] Social SSO buttons (Google, GitHub, Apple, Microsoft)
- [x] Magic link flow
- [x] Sign in / Sign up tabs
- [x] Dynamic subtitle based on context
- [x] Empty state with checklist
- [x] Composer with attachments
- [x] My Week widget
- [x] Suggested Connections
- [x] Jobs for You
- [x] Mobile responsive

### 🚀 Next Steps (Future)
- [ ] Real OAuth integration
- [ ] Magic link email sending
- [ ] Session persistence
- [ ] Analytics tracking
- [ ] A/B testing framework
- [ ] Personalized recommendations
- [ ] Real-time feed updates

---

## Usage

### Default Entry Point
```tsx
// App starts on Landing page
<Landing
  onSignIn={() => setCurrentPage("login-enhanced")}
  onSignUp={handleSignUp}
  onGetStarted={handleGetStarted}
/>
```

### Authenticated Home
```tsx
// After login
<FeedHome 
  isNewUser={false} 
  userName="Sarah Chen" 
/>
```

### Empty State (New User)
```tsx
<FeedHome 
  isNewUser={true} 
  userName="New User" 
/>
```

### Demo Navigation
Access different pages from bottom-right demo panel:
- 🏠 Landing Page
- 🔥 Home Feed (NEW!)
- Agency Workspace
- Full Placement Flow
- And more...

---

## Design Tokens

### Spacing
- `p-2`: 8px
- `p-4`: 16px
- `p-6`: 24px
- `p-8`: 32px

### Typography
- `text-2xl`: 28px (1.75rem)
- `text-xl`: 20px (1.25rem)
- `text-lg`: 16px (1rem)
- `text-base`: 14px (0.875rem)
- `text-sm`: 12px (0.75rem)

### Border Radius
- `rounded-lg`: 12px
- `rounded-xl`: 16px
- `rounded-2xl`: 24px

### Shadows
- Card: `0 1px 3px rgba(0,0,0,0.05)`
- Hover: `0 4px 6px rgba(0,0,0,0.1)`
- Elevated: `0 10px 15px rgba(0,0,0,0.1)`

---

## Content & Copy

### Hero
- **H1**: "Connect your work graph"
- **Subcopy**: "Where your professional network meets the tools you use to ship work: profiles, posts, jobs, contracts, time, and invoices."
- **Primary CTA**: "Get started free"
- **Secondary CTA**: "Explore the network"

### Why Social × SaaS
- **Networked Profiles**: "Follow talent and teams. Share updates and wins."
- **Work OS**: "Move from 'interview' to 'invoice' without context switching."
- **Built for Teams**: "One login, multiple workspaces and permissions."

### Social Proof
- "Trusted by 3,100+ teams and 28k professionals"

### Pricing
- **Free**: "For individuals getting started"
- **Team**: "For small teams and startups"
- **Business**: "For agencies and enterprises"

---

## Key Differentiators

### 1. Hybrid SaaS × Social
- Only platform combining professional networking with work management
- Social signal (posts, follows) + SaaS utility (time, invoices)

### 2. Context Switching
- One login, multiple workspaces
- Personal ↔ Company ↔ Agency
- No data leakage between contexts

### 3. Privacy by Default
- Read-only social preview for guests
- Interactions gated behind sign-up
- Worker records always private

### 4. Seamless Onboarding
- 3-step checklist for new users
- Empty state guides to first actions
- Progressive disclosure of features

---

## Summary

The entry experience successfully blends:
- **Marketing**: Product value, pricing, social proof
- **Community**: Live social preview, trending posts, featured profiles
- **Conversion**: Multiple CTAs, gated interactions, seamless auth
- **Onboarding**: Empty state checklist, contextual guidance

**Result**: Visitors understand the hybrid value prop, see the active community, and have clear paths to sign up. New users are guided through first actions, while returning users jump straight to their personalized feed.

**Default**: App now opens on Landing page for maximum conversion impact.
