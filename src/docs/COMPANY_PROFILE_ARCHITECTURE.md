# 🏢 Company Profile Architecture: Public vs. Private

## Overview

WorkGraph separates company presence into two distinct areas:
1. **Public Company Profile** - Discovery, trust-building, and brand showcase
2. **Private Company Workspace** - Operational tools for managing projects, freelancers, and agencies

This architecture enables small companies (5-50 people) to present professionally while managing complex multi-party collaborations (company + agency + freelancer).

---

## 🌐 Public Company Profile (Visible to All)

**Purpose:** Build trust, attract talent, showcase expertise

### 1. Basic Information & Branding
- **Company name** and verified badge
- **Logo** and banner/cover image
- **Tagline** (one-line value proposition)
- **Founded date** and company age
- **Headquarters location** (city/country)

**UI Pattern:**
```
┌─────────────────────────────────────────────┐
│  [Cover Image - Brand Banner]               │
│                                              │
│  ┌──────┐                                    │
│  │ Logo │  Acme Engineering                  │
│  └──────┘  Building the future of robotics   │
│            📍 San Francisco · Est. 2019      │
└─────────────────────────────────────────────┘
```

### 2. Services & Expertise
- **About section** (2-3 paragraphs)
- **Industry focus** (up to 3 primary industries)
- **Service categories** (up to 10 specialized services)
- **Skill tags** (up to 15 key technologies/skills)
- **Primary use cases** (what projects they typically work on)

**Example:**
> "Acme Engineering specializes in robotics automation for manufacturing. We design, build, and deploy custom robotics solutions..."
>
> **Industries:** Manufacturing, Logistics, Healthcare
> **Services:** Robotics Design, Control Systems, 3D Simulation, Integration
> **Skills:** ROS, Python, C++, CAD, Computer Vision, Motion Planning

### 3. Portfolio & Achievements

#### Project Showcase
- **Featured projects** (up to 6 highlighted works)
- Each project includes:
  - Project name and client (if public)
  - Brief description
  - Technologies used
  - Images/screenshots
  - Results/impact metrics
  - Team size and duration

#### Social Proof
- **Client testimonials** (3-5 featured quotes with photos)
- **Case studies** (detailed success stories)
- **Awards & certifications** (up to 10 external recognitions)
- **Featured clients** (up to 12 notable client logos)
- **Press mentions** (media coverage)

**Trust Signals:**
- ISO certifications
- Industry awards
- Client retention rate
- Years in business

### 4. Company Details & Capacity

#### Team Information
- **Company size** (5-10, 11-25, 26-50, 51-100, etc.)
- **Core team** (optional: key leadership profiles)
- **Departments** (Engineering, Design, QA, etc.)
- **Hiring status** (actively growing, stable, not hiring)

#### Project Fit
- **Minimum project size** ($5k, $10k, $25k, $50k+)
- **Typical project duration** (weeks, months, ongoing)
- **Client focus** (startups, SMBs, enterprise)
- **Work arrangement** (remote, hybrid, on-site)

**Why this matters:**
Helps freelancers and partners quickly assess fit. A solo freelancer knows not to apply for "$100k+ enterprise only" companies.

### 5. Reputation & Track Record

#### Platform Metrics (Auto-generated)
- ⭐ **Overall rating** (4.8/5.0 from 47 reviews)
- 📊 **Job Success Score** (95% - derived from completed projects)
- 📈 **Projects completed** (124 total on platform)
- ⏱️ **Total hours billed** (8,450 hours)
- 💰 **Revenue tier** (shown as badge: $100k-$500k, not exact amount)
- 📅 **Member since** (Joined March 2021)
- ✅ **Response rate** (Replies within 4 hours - 92% of time)
- 🔄 **Repeat hire rate** (68% - freelancers hired more than once)

#### Reviews & Testimonials
- **Featured review** (highest-rated or most recent)
- **Review breakdown** by category:
  - Communication (4.9/5)
  - Payment timeliness (5.0/5)
  - Project clarity (4.7/5)
  - Collaboration (4.8/5)
- **Client quotes** with names/titles/companies
- **Freelancer feedback** (from contractors who worked with them)

**Example Review Display:**
```
⭐⭐⭐⭐⭐ 5.0
"Exceptional client - clear requirements, timely feedback,
and payment within 24 hours. Would work with again!"
— Sarah Chen, Senior Robotics Engineer
   Contract: 6-month automation project
```

### 6. Activity & Engagement

#### Public Activity Stream
- **Recent projects posted** (last 5 open roles)
- **Industry updates** they've shared (if social feed enabled)
- **Team milestones** (hired 10th employee, opened new office)
- **Achievements** (completed 100th project on platform)

#### Availability
- 🟢 **Actively hiring** (3 open roles)
- 🟡 **Accepting proposals** (reviewing candidates)
- 🔴 **Not hiring** (fully staffed)

---

## 🔒 Private Company Workspace (Members Only)

**Purpose:** Operational efficiency, compliance, collaboration management

### 1. Team Access & Roles

#### Multi-User Account
- **Admin** - Full access, billing, team management
- **Hiring Manager** - Post jobs, review candidates, make offers
- **Project Manager** - Manage active projects, approve timesheets
- **Finance** - View invoices, process payments, download reports
- **Team Member** - Collaborate on assigned projects only

**Role Matrix:**
| Action | Admin | Hiring Mgr | PM | Finance | Member |
|--------|-------|------------|----|---------| -------|
| Post jobs | ✅ | ✅ | ❌ | ❌ | ❌ |
| Approve timesheets | ✅ | ✅ | ✅ | ❌ | ❌ |
| Process payments | ✅ | ❌ | ❌ | ✅ | ❌ |
| View all projects | ✅ | ✅ | ✅ | ✅ | ❌ |
| Add team members | ✅ | ❌ | ❌ | ❌ | ❌ |

**Security Features:**
- Single sign-on (SSO) support
- Two-factor authentication
- Activity audit logs
- Session management

### 2. Talent Sourcing & Onboarding

#### Job Posting
- **Create role** (template library or custom)
- **Set requirements** (skills, experience, availability)
- **Define budget** (fixed, hourly, retainer)
- **Visibility** (public platform, private network, invite-only)
- **Application deadline**

#### Candidate Management
- **Applicant inbox** (all proposals in one place)
- **AI matching score** (how well candidate fits requirements)
- **Filter & sort** (by rate, experience, availability, match score)
- **Shortlist** (organize favorites)
- **Collaborative review** (team members can comment/vote)

#### Onboarding Automation
Once a candidate is selected:

1. **Send offer** (auto-generated from role template)
2. **E-signature flow**:
   - Master Services Agreement (MSA)
   - Non-Disclosure Agreement (NDA)
   - Statement of Work (SOW) - project-specific
   - W9/tax forms (if applicable)
3. **Collect information**:
   - Payment details (how they want to be paid)
   - Emergency contact
   - Any compliance requirements
4. **Grant access**:
   - Add to project workspace
   - Share relevant documents
   - Introduce to team

**All automated - no manual paperwork juggling.**

### 3. Project & Task Management

#### Project Dashboard
Each project gets a dedicated workspace:

**Overview Tab:**
- Project status (Discovery, Active, On Hold, Completed)
- Timeline (start/end dates, milestones)
- Budget tracking (allocated vs. spent)
- Team roster (who's working on it)

**Tasks/Milestones:**
- Define deliverables
- Assign to freelancers/team members
- Set deadlines
- Track progress (To Do, In Progress, Review, Done)
- Upload deliverables

**Example Structure:**
```
Project: Mobile App Redesign
├─ Milestone 1: Research & Discovery (✅ Complete)
│  ├─ User interviews (Assigned: Sarah)
│  ├─ Competitive analysis (Assigned: Mike)
│  └─ Insights report (Assigned: Sarah)
├─ Milestone 2: Design (🔄 In Progress)
│  ├─ Wireframes (Assigned: Lisa)
│  ├─ UI mockups (Assigned: Lisa)
│  └─ Design system (Assigned: Lisa)
└─ Milestone 3: Development (⏳ Not Started)
```

**Real-time Collaboration:**
- Comments on tasks
- File attachments
- @mentions for notifications
- Status updates visible to all stakeholders

### 4. Communication Hub

#### Integrated Messaging
- **Project channels** (all stakeholders in one chat)
- **Direct messages** (1-on-1 with freelancer)
- **Team channels** (internal company discussions)
- **File sharing** (drag-drop documents, images, code)
- **Message history** (searchable, archived)

**Why platform messaging vs email:**
- ✅ Everything in one place (no lost threads)
- ✅ Contextual (messages tied to projects)
- ✅ Includes agency triangulation (company + agency + freelancer all in same chat)
- ✅ Audit trail (compliance requirement for some industries)
- ✅ File sharing without size limits

**Notification Settings:**
- Email digest (daily/weekly summary)
- Slack/Teams integration (optional)
- Mobile push notifications

### 5. Contracts & Document Management

#### Digital Contract System

**Templates Library:**
- MSA (Master Services Agreement)
- NDA (Non-Disclosure Agreement)
- SOW (Statement of Work)
- Independent Contractor Agreement
- Change Order template
- Amendment template

**Workflow:**
1. Select template
2. Fill in variables (name, rate, term, scope)
3. Preview PDF
4. Send for e-signature (DocuSign-style)
5. Auto-store signed copy in document library

**Document Repository:**
All project documents organized in folders:
```
📁 Acme Engineering Workspace
  📁 Contracts & Legal
    📄 MSA_Sarah_Chen_2024.pdf (signed)
    📄 NDA_Mike_Johnson_2024.pdf (signed)
  📁 Project: Mobile App
    📁 Deliverables
      📄 Wireframes_v2.fig
      📄 Final_Design_System.pdf
    📁 Research
      📄 User_Interview_Notes.docx
  📁 Tax & Compliance
    📄 W9_Sarah_Chen.pdf
    📄 Certificate_of_Insurance.pdf
```

**Features:**
- Version control (track changes)
- Access permissions (who can view/edit)
- Expiration alerts (NDA expires in 30 days)
- Bulk download (all signed contracts as ZIP)
- Encrypted storage (SOC 2 compliant)

### 6. Time Tracking & Timesheets

#### Time Entry
**For hourly contractors:**

**Freelancer logs time:**
- Manual entry: "5 hours on wireframe design"
- Description of work done
- Date worked
- Attach to project/milestone

**Company reviews:**
- Weekly timesheet submitted (every Friday)
- Manager reviews entries
- Approve or dispute (with reason)
- Approved hours → auto-generate invoice

**Multi-party visibility:**
If agency is involved:
- Freelancer fills timesheet
- Agency can view (they manage the freelancer)
- Company can view (they're paying)
- All parties see the same data (transparency)

**Time Tracking Features:**
- Desktop timer (optional - auto-track time)
- Screenshot verification (optional - for trust)
- Idle time detection
- Weekly/monthly summaries
- Export to CSV (for company's accounting system)

### 7. Multi-Party Project Collaboration

**New paradigm: Company + Agency + Freelancer**

#### Scenario
**Acme Engineering** (company) needs a robotics engineer but doesn't want to recruit directly. They partner with **RoboTalent** (agency) who provides **Sarah** (freelancer).

#### Platform Support

**Project Structure:**
```
Project: Factory Automation
├─ Owner: Acme Engineering (company)
├─ Partner: RoboTalent (agency - provides Sarah)
├─ Worker: Sarah Chen (freelancer)
└─ Terms:
   ├─ Acme pays $120/hr (blended rate to platform)
   ├─ RoboTalent gets $30/hr (25% placement fee)
   ├─ Sarah gets $90/hr (take-home)
   └─ Platform fee: $10/hr (charged to Acme)
```

**Permissions:**
| Feature | Acme (Company) | RoboTalent (Agency) | Sarah (Freelancer) |
|---------|----------------|---------------------|--------------------|
| View project scope | ✅ | ✅ | ✅ |
| Message in project chat | ✅ | ✅ | ✅ |
| Assign tasks | ✅ | ✅ | ❌ |
| Submit timesheets | ❌ | ❌ | ✅ |
| Approve timesheets | ✅ | View only | ❌ |
| View payment breakdown | Total only | Their fee | Their take-home |
| Edit deliverables | ✅ | View only | ✅ |

**How it works:**
1. **Acme posts role** (can set "open to agency proposals")
2. **RoboTalent proposes Sarah** (with blended rate)
3. **Acme accepts** (creates 3-party project)
4. **Platform handles split**:
   - Acme pays $120/hr to platform
   - Platform pays $90/hr to Sarah
   - Platform pays $30/hr to RoboTalent
   - Everyone gets separate invoice/payment

**Visibility:**
- Acme sees total cost ($120/hr)
- Sarah sees her rate ($90/hr)
- RoboTalent sees their fee ($30/hr)
- Nobody sees exact split (privacy)

**Benefits:**
- ✅ Transparent for all parties
- ✅ No manual payment splitting
- ✅ Agency gets credit for placement
- ✅ Freelancer has agency support
- ✅ Company gets vetted talent

### 8. Billing & Payments Management

#### Payment Center

**For Companies:**

**Overview Dashboard:**
- 💳 Payment methods on file
- 📊 Current balance/credit
- 📅 Upcoming payments due
- 📜 Payment history

**Invoice Management:**
- **Auto-generated invoices** from approved timesheets
- **Fixed-price milestones** (pay when milestone approved)
- **Retainer billing** (monthly recurring)
- **Multi-freelancer consolidation** (one invoice for all contractors)

**Example Weekly Invoice:**
```
Invoice #WG-2024-0123
Week of Jan 8-14, 2024

Sarah Chen (Robotics Engineer)
  40 hours @ $90/hr = $3,600

Mike Johnson (Controls Engineer)  
  35 hours @ $85/hr = $2,975

Lisa Park (UI Designer)
  20 hours @ $75/hr = $1,500
  
Subtotal: $8,075
Platform fee (8%): $646
Total Due: $8,721

Due: Jan 18, 2024
```

**Payment Options:**
- ACH/bank transfer (2-3 days, lowest fees)
- Credit card (instant, 3% fee)
- Wire transfer (same day, flat fee)
- Stored balance (instant, no fee)

**Automation:**
- Auto-pay (approve invoices automatically)
- Scheduled payments (pay every Friday)
- Spending limits (notify if >$10k/month)
- Budget alerts (80% of project budget spent)

#### For Freelancers/Agencies:

**Getting Paid:**
- Instant notification when timesheet approved
- Invoice auto-sent to client
- Payment tracking (pending, processing, paid)
- Deposit timeline (5 business days to bank)

**Payout Methods:**
- Direct deposit (US banks)
- PayPal
- Wise/TransferWise (international)
- Crypto (optional)

**Tax Support:**
- Auto-generate 1099 (US contractors)
- Annual earnings statement
- Track billable hours by client
- Export for accountant

### 9. Analytics & Reporting

#### Company Dashboard

**Overview Metrics:**
- 📊 Active contractors (15)
- 💰 Total spent this month ($42,500)
- ⏱️ Hours logged this week (320 hours)
- 📈 Project completion rate (94%)
- ⭐ Average contractor rating (4.8/5)

**Contractor Performance:**
- Top performers (by hours, rating, repeat hires)
- Response time (how quickly contractors reply)
- On-time delivery rate
- Budget variance (on/over/under budget)

**Project Analytics:**
- Time to hire (days from posting to accepted offer)
- Cost per project (actual vs. estimated)
- Project timeline adherence
- Most common skills hired
- Seasonal hiring patterns

**Financial Reports:**
- Spending by department
- Spending by project
- Spending by contractor type (freelancer vs. agency)
- Year-over-year comparison
- Budget forecasting (based on active projects)

**Exportable Reports:**
- PDF summary (exec presentation)
- CSV data (for accounting system)
- API access (for BI tools like Tableau)

**Example Dashboard:**
```
┌─────────────────────────────────────────────┐
│  Q1 2024 Contractor Spend Report            │
├─────────────────────────────────────────────┤
│  Total: $156,430                             │
│                                              │
│  By Department:                              │
│  ████████████░░░ Engineering 65% ($101k)     │
│  ██████░░░░░░░░░ Design 25% ($39k)           │
│  ███░░░░░░░░░░░░ QA 10% ($16k)               │
│                                              │
│  Top Contractors:                            │
│  1. Sarah Chen      $18,450  (205 hrs)       │
│  2. Mike Johnson    $15,300  (180 hrs)       │
│  3. Lisa Park       $12,000  (160 hrs)       │
│                                              │
│  Trend: ↑ 23% vs Q4 2023                     │
└─────────────────────────────────────────────┘
```

---

## 🔄 Cross-Platform Integration

### Public ↔️ Private Connection

**Journey:**
1. Freelancer discovers company on **Public Profile**
2. Sees "3 open roles" badge
3. Clicks "View Open Positions"
4. Sees job posting (created in **Private Workspace**)
5. Applies
6. Company reviews in **Private Workspace**
7. Hires freelancer
8. Completed project adds to **Public Profile** portfolio
9. Freelancer leaves review (shows on **Public Profile**)

**Sync Points:**
- ✅ Jobs posted privately → show on public profile
- ✅ Projects completed → can be showcased publicly (with permission)
- ✅ Reviews/ratings → aggregate on public profile
- ✅ Team size updates → reflect publicly
- ✅ Certifications earned → badges on public profile

### Privacy Controls

**Companies choose:**
- Which projects to showcase publicly (default: private)
- Whether to show client names (or "Fortune 500 manufacturing client")
- Portfolio visibility (public, network only, private)
- Testimonial display (featured vs. all)
- Team member profiles (link to personal profiles or not)

---

## 🏗️ Technical Architecture

### Data Model

**Company Entity:**
```typescript
interface Company {
  id: string;
  name: string;
  slug: string; // acme-engineering
  
  // Public Profile Data
  publicProfile: {
    branding: {
      logo: string;
      banner: string;
      tagline: string;
      colors: BrandColors;
    };
    about: {
      description: string;
      founded: Date;
      size: CompanySize;
      headquarters: Location;
      industries: Industry[];
      website: string;
    };
    expertise: {
      services: string[];
      skills: Skill[];
      specializations: string[];
    };
    portfolio: {
      projects: PortfolioProject[];
      testimonials: Testimonial[];
      awards: Award[];
      featuredClients: Client[];
    };
    reputation: {
      rating: number;
      reviewCount: number;
      jobSuccessScore: number;
      projectsCompleted: number;
      totalHoursBilled: number;
      memberSince: Date;
      responseRate: number;
      repeatHireRate: number;
    };
    visibility: "public" | "network-only" | "private";
  };
  
  // Private Workspace Data
  workspace: {
    team: TeamMember[];
    projects: Project[];
    contracts: Contract[];
    documents: Document[];
    invoices: Invoice[];
    settings: WorkspaceSettings;
  };
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  verifiedAt?: Date;
}
```

### Access Control

**Public Profile:**
- Visible to: Anyone (if public) | Network connections (if network-only) | Company only (if private)
- Editable by: Company admins only

**Private Workspace:**
- Visible to: Company team members + invited collaborators (freelancers/agencies on active projects)
- Editable by: Based on role permissions

**Security:**
- Row-level security (RLS) in database
- API endpoints respect visibility settings
- Audit logs for all changes
- GDPR/CCPA compliant data handling

---

## 🎨 UI/UX Patterns

### Public Profile Layout

```
┌─────────────────────────────────────────────┐
│  [Header: Logo, Name, Tagline, Follow CTA]  │
├─────────────────────────────────────────────┤
│  [Nav: About | Portfolio | Team | Reviews]   │
├─────────────────────────────────────────────┤
│  About Section                               │
│  - Company description                       │
│  - Industries & services                     │
│  - Skills & technologies                     │
├─────────────────────────────────────────────┤
│  Portfolio Grid                              │
│  [Project 1] [Project 2] [Project 3]         │
│  [Project 4] [Project 5] [Project 6]         │
├─────────────────────────────────────────────┤
│  Testimonials Carousel                       │
│  "Amazing to work with..." - Sarah Chen      │
├─────────────────────────────────────────────┤
│  Stats & Trust Signals                       │
│  ⭐ 4.8/5 · 124 projects · Member since 2021│
├─────────────────────────────────────────────┤
│  Open Positions (3)                          │
│  [Senior Robotics Engineer] [Apply]          │
│  [Controls Engineer] [Apply]                 │
│  [UI Designer] [Apply]                       │
└─────────────────────────────────────────────┘
```

### Private Workspace Layout

```
┌─────────────────────────────────────────────┐
│  [Sidebar: Projects | Team | Contracts...]   │
├─────────────────────────────────────────────┤
│  Dashboard Overview                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │ 15 Active│ │ $42.5k   │ │ 320 hrs  │    │
│  │Contractor│ │This Month│ │This Week │    │
│  └──────────┘ └──────────┘ └──────────┘    │
├─────────────────────────────────────────────┤
│  Active Projects                             │
│  [Project A] [Due: Jan 20] [Budget: $15k]   │
│  [Project B] [Due: Feb 5]  [Budget: $30k]   │
├─────────────────────────────────────────────┤
│  Recent Activity                             │
│  • Sarah submitted timesheet (2 hours ago)   │
│  • Invoice #123 paid (5 hours ago)           │
│  • Mike started Milestone 3 (1 day ago)      │
├─────────────────────────────────────────────┤
│  Quick Actions                               │
│  [Post New Role] [Review Timesheets]         │
│  [Process Payments] [View Reports]           │
└─────────────────────────────────────────────┘
```

---

## 📋 Implementation Checklist

### Phase 1: Public Profile (MVP)
- [ ] Company profile page component
- [ ] Branding section (logo, banner, tagline)
- [ ] About section (description, industries, skills)
- [ ] Basic reputation metrics (rating, reviews)
- [ ] Visibility toggle (public/private)

### Phase 2: Portfolio & Social Proof
- [ ] Portfolio project cards
- [ ] Testimonial showcase
- [ ] Awards & certifications section
- [ ] Featured clients grid
- [ ] Review/rating system integration

### Phase 3: Private Workspace (MVP)
- [ ] Team member management
- [ ] Role-based access control
- [ ] Project dashboard
- [ ] Basic messaging system
- [ ] Document storage

### Phase 4: Hiring & Onboarding
- [ ] Job posting interface
- [ ] Candidate review dashboard
- [ ] Contract template system
- [ ] E-signature integration
- [ ] Onboarding workflow automation

### Phase 5: Time & Payments
- [ ] Timesheet submission/approval
- [ ] Invoice auto-generation
- [ ] Payment processing
- [ ] Multi-party payment splits
- [ ] Tax document handling

### Phase 6: Multi-Party Collaboration
- [ ] 3-way project structure (company + agency + freelancer)
- [ ] Permission matrix for each role
- [ ] Shared project workspaces
- [ ] Payment split logic
- [ ] Transparent fee disclosure

### Phase 7: Analytics & Reporting
- [ ] Spending analytics dashboard
- [ ] Contractor performance metrics
- [ ] Project health indicators
- [ ] Exportable reports (PDF, CSV)
- [ ] Budget forecasting

---

## 🎯 Success Metrics

### For Companies
- Time to hire (reduce from 30 days to 7 days)
- Admin overhead (reduce from 10 hrs/week to 2 hrs/week)
- Contractor quality (increase avg rating from 4.0 to 4.5+)
- Payment disputes (reduce from 15% to <3%)

### For Freelancers
- Payment speed (get paid in 5 days vs 30 days)
- Contract clarity (95% clear scope vs 60%)
- Repeat work (hired by same company 3+ times)

### For Agencies
- Placement success (90% of candidates complete projects)
- Payment reliability (100% on-time payments)
- Multi-client management (manage 10+ companies in one platform)

### For Platform
- User retention (80% monthly active companies)
- Transaction volume ($10M GMV in year 1)
- Net Promoter Score (50+)
- Public profile views → applications (15% conversion)

---

## 📚 Competitive Inspiration

**Learned from:**
- **Upwork** - Agency profiles, job success score, featured clients
- **Freelancer.com** - Featured reviews, portfolio showcase
- **Worksome** - Multi-party collaboration, staffing agency integration
- **Toptal** - Rigorous vetting, elite positioning
- **LinkedIn** - Company pages, follower engagement
- **Contra** - Beautiful portfolio layouts, creative focus

**WorkGraph's unique value:**
✅ Unified public/private split (most platforms mix these)
✅ Native multi-party support (company + agency + freelancer)
✅ Built for small companies (not just enterprises)
✅ Social + transactional (discover + hire + manage in one place)
✅ Vertical focus (technical freelancers, not generalists)

---

This architecture provides the foundation for building trust (public profile) while streamlining operations (private workspace) - the best of both worlds.
