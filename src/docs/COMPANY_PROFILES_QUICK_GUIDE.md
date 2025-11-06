# 🚀 Company Profiles: Quick Implementation Guide

## What We Built

A complete dual-profile system for companies on WorkGraph:

1. **Public Company Profile** - Brand showcase for discovery and trust
2. **Private Company Workspace** - Operational dashboard for management

**Demo:** Set to load `company-profile-demo` by default in AppRouter

---

## 🎯 Key Components Created

### 1. CompanyPublicProfile.tsx
**Purpose:** What freelancers, agencies, and other companies see

**Features:**
- Hero section with banner, logo, and company info
- Reputation metrics (rating, projects, success score)
- Tabbed interface:
  - **About** - Description, industries, services, skills, awards
  - **Portfolio** - Case studies with metrics and images
  - **Reviews** - Client testimonials and ratings
  - **Jobs** - Open contractor positions
- Follow/Message CTAs
- Apply to roles functionality

**Mock Data Included:**
- Acme Engineering (robotics automation company)
- 3 portfolio projects with real images
- 2 client testimonials
- 3 open contractor roles
- Full reputation stats

### 2. CompanyPrivateWorkspace.tsx
**Purpose:** Internal dashboard for company team members

**Features:**
- Overview dashboard with key metrics
- Tabbed workspace:
  - **Overview** - Stats, action items, recent activity
  - **Projects** - Active projects with progress tracking
  - **Contractors** - Manage all external workers
  - **Timesheets** - Review and approve hours
  - **Payments** - Invoice processing (placeholder)
  - **Analytics** - Reporting dashboard (placeholder)
- Role-based views (Admin, Hiring Manager, PM, Finance)
- Real-time activity feed
- Pending action alerts

**Mock Data Included:**
- 15 active contractors
- 8 projects in various stages
- 3 pending timesheets to review
- Weekly hours and spending metrics

### 3. CompanyProfileDemo.tsx
**Purpose:** Interactive demo showcasing both views

**Features:**
- Toggle between Public/Private views
- Contextual header explaining what you're seeing
- Info banners describing each view's purpose
- Sticky CTA to switch views
- Visual badges (Public = green, Private = yellow)

---

## 📊 Data Architecture

### Public Profile Data
```typescript
{
  // Brand Identity
  name, logo, banner, tagline, verified
  
  // Company Details
  founded, headquarters, size, website
  
  // Expertise
  industries[], services[], skills[]
  
  // Portfolio
  projects[] {
    title, client, description, 
    image, tags, metrics
  }
  
  // Social Proof
  testimonials[] { text, author, rating }
  awards[] { name, year }
  
  // Reputation (auto-generated)
  rating, reviewCount, jobSuccessScore,
  projectsCompleted, responseRate, repeatHireRate
  
  // Opportunities
  openRoles[] { title, type, duration, rate }
}
```

### Private Workspace Data
```typescript
{
  // Team & Access
  team[] { name, role, permissions }
  
  // Projects
  projects[] {
    name, status, progress, budget, spent,
    team[], dueDate, priority
  }
  
  // Contractors
  contractors[] {
    name, role, rating, hourlyRate,
    hoursThisWeek, activeProjects, status
  }
  
  // Timesheets
  timesheets[] {
    contractor, week, hours, amount,
    project, status
  }
  
  // Activity
  recentActivity[] {
    type, actor, action, time
  }
  
  // Analytics
  stats { 
    activeContractors, monthlySpend,
    weeklyHours, avgRating
  }
}
```

---

## 🎨 Design Patterns Used

### Apple-Inspired Polish
- ✅ Subtle shadows and elevation system
- ✅ Smooth hover transitions (scale, shadow changes)
- ✅ Clean typography hierarchy
- ✅ Generous whitespace
- ✅ Badge system for status indicators
- ✅ Card-based layouts with rounded corners

### User Experience
- ✅ Tabbed navigation for content organization
- ✅ Action-oriented CTAs (Follow, Message, Apply)
- ✅ Progress indicators for projects and budgets
- ✅ Real-time activity streams
- ✅ Alert system for pending actions
- ✅ Search and filter capabilities

### Responsive Design
- ✅ Grid layouts that collapse on mobile
- ✅ Flex wrappers for badges and chips
- ✅ Sticky headers for navigation
- ✅ Mobile-friendly button groups

---

## 🔄 Integration Points

### From Public Profile → Private Workspace

**Scenario:** Company employee viewing their own profile

```typescript
// In navigation/routing
if (isCompanyMember) {
  // Show "Manage" button on public profile
  <Button onClick={() => navigateTo('workspace')}>
    Manage Workspace
  </Button>
}
```

### From Private Workspace → Public Profile

**Scenario:** Company wants to see how they appear to others

```typescript
// In workspace header
<Button onClick={() => navigateTo('public-profile')}>
  View Public Profile
</Button>
```

### Sync Points

**What updates both sides:**
- Project completion → Portfolio showcase (if made public)
- Received reviews → Reputation metrics
- New job posting → Open roles list
- Team size changes → Company details

---

## 🚧 Implementation Roadmap

### Phase 1: MVP (Current)
- [x] Public profile component with tabs
- [x] Private workspace dashboard
- [x] Demo toggle interface
- [x] Mock data for both views
- [x] Basic responsive design

### Phase 2: Data Integration
- [ ] Connect to Supabase for real data
- [ ] User authentication and permissions
- [ ] Company creation/editing flow
- [ ] Portfolio project upload
- [ ] Review submission system

### Phase 3: Core Workflows
- [ ] Job posting from private → public
- [ ] Contractor onboarding flow
- [ ] Timesheet approval workflow
- [ ] Payment processing integration
- [ ] Contract/NDA e-signature

### Phase 4: Advanced Features
- [ ] Multi-party projects (company + agency + freelancer)
- [ ] Team role management
- [ ] Analytics and reporting
- [ ] Activity feed with notifications
- [ ] Document management system

### Phase 5: Polish & Optimization
- [ ] Image upload and optimization
- [ ] SEO for public profiles
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Mobile app considerations

---

## 💡 Usage Examples

### For Freelancers
```
1. Discover company on platform
2. View public profile (portfolio, reviews, culture)
3. Check open roles
4. Click "Apply Now"
5. If hired, get added to private project workspace
6. Submit timesheets through private interface
7. Get paid automatically
```

### For Companies
```
1. Create company profile (public)
2. Add portfolio projects and testimonials
3. Post contractor role (private → public)
4. Review applications in private workspace
5. Hire contractor and send contracts
6. Manage project in shared workspace
7. Approve timesheets and process payments
8. View analytics and spending reports
```

### For Agencies
```
1. Browse companies on platform
2. View company public profiles
3. Identify good-fit clients
4. Message company to discuss partnership
5. Get added as collaborator on project
6. Place freelancer on project
7. See all activity in shared workspace
8. Receive placement fee automatically
```

---

## 🎯 Success Metrics

### Public Profile Engagement
- Profile views → Follow rate (target: 10%)
- Profile views → Message rate (target: 5%)
- Profile views → Job application rate (target: 15%)
- Average time on profile (target: 2+ minutes)

### Private Workspace Efficiency
- Time to hire (target: <7 days from posting)
- Timesheet approval speed (target: <24 hours)
- Payment processing time (target: <5 business days)
- User satisfaction (target: 4.5+ rating)

### Platform Health
- Companies with complete profiles (target: 80%)
- Companies with 3+ portfolio projects (target: 50%)
- Companies with 5+ reviews (target: 40%)
- Active monthly users per company (target: 2.5)

---

## 🔧 Configuration Options

### Public Profile Settings

```typescript
interface PublicProfileSettings {
  visibility: 'public' | 'network-only' | 'private';
  showTeamSize: boolean;
  showBudgetRanges: boolean;
  featuredProjectLimit: number; // default: 6
  autoShowOpenRoles: boolean;
  customUrl: string; // workgraph.app/c/acme-engineering
}
```

### Private Workspace Settings

```typescript
interface WorkspaceSettings {
  defaultCurrency: 'USD' | 'EUR' | 'GBP';
  fiscalYearStart: Date;
  timesheetApprovalWindow: number; // days
  autoPayEnabled: boolean;
  requireNDA: boolean;
  requireW9: boolean; // US contractors
  weekStartsOn: 'monday' | 'sunday';
}
```

---

## 🎓 Best Practices

### For Public Profiles

**DO:**
- ✅ Upload high-quality logo and banner
- ✅ Write clear, benefit-focused descriptions
- ✅ Showcase 3-6 best projects
- ✅ Include client testimonials with photos
- ✅ Keep open roles list updated
- ✅ Respond to messages within 24 hours

**DON'T:**
- ❌ Leave profile incomplete (<50% filled)
- ❌ Use stock photos for portfolio
- ❌ Exaggerate capabilities
- ❌ Post expired job listings
- ❌ Ignore reviews/feedback

### For Private Workspaces

**DO:**
- ✅ Set up team roles and permissions
- ✅ Approve timesheets weekly
- ✅ Process payments on time
- ✅ Keep project budgets updated
- ✅ Document decisions in project chats
- ✅ Review contractor performance regularly

**DON'T:**
- ❌ Share single login credentials
- ❌ Delay timesheet approvals
- ❌ Skip contract/NDA steps
- ❌ Lose track of project budgets
- ❌ Communicate outside platform

---

## 📞 Quick Reference

**View Demo:** 
Default route in AppRouter.tsx is set to `company-profile-demo`

**Key Files:**
- `/components/CompanyPublicProfile.tsx` - Public view
- `/components/CompanyPrivateWorkspace.tsx` - Private workspace
- `/components/CompanyProfileDemo.tsx` - Demo toggle
- `/docs/COMPANY_PROFILE_ARCHITECTURE.md` - Full spec

**Navigation:**
Toggle between views using the header buttons in the demo

**Customization:**
Update mock data in each component to see different content

---

This system provides the foundation for WorkGraph's company presence - balancing public discovery with private operational efficiency.
