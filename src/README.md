# WorkGraph - Hybrid SaaS + Social Work Network

A production-ready UI implementation for a technical freelancer platform with multi-tenant architecture, agency workspace, and privacy-by-default design.

## 🚀 Quick Start

The app starts on the **Landing Page** by default, showing the complete guest-to-authenticated user flow with social preview and conversion-focused design.

### Demo Navigation

Use the bottom-right demo navigation panel to explore:

- **🏠 Landing Page** - Guest entry experience with social preview **(default)**
- **🔥 Home Feed** - Authenticated user home with 3-column layout **(NEW!)**
- **Full Placement Flow** - Complete 15-step workflow (LOGIN → INVOICE)
- **Agency Workspace** ✨ - Full 8-tab agency interface
- **James Workflow Demo** ✨ - Quick 9-step UI flow tutorial
- **Deal Room** - Placement/T&M deal management
- **Context Chooser** - Multi-workspace switching
- **Enhanced Profiles** - Personal and Worker Record views

## 🎯 Key Features

### Entry Experience (NEW!)
- **Landing Page**: Conversion-focused guest experience blending SaaS value + social energy
- **Social Preview**: Read-only feed of trending posts and featured profiles with gated interactions
- **Enhanced Auth**: SSO (Google, GitHub, Apple, Microsoft), magic link, unified sign-in/sign-up
- **Home Feed**: 3-column layout with composer, mixed feed (social + work), and sidebar widgets
- **Empty State**: New user onboarding with 3-step checklist (Complete profile → Follow → Post)
- **Responsive Design**: Mobile-first with collapsible columns and sticky navigation

### Complete Placement Workflow
- **15-Step End-to-End Flow**: Login → Context → Roles → Deal → Submit → Hire → Contract → Worker Record → Timesheet → Approval → Invoice
- **RBAC Validation**: Role-based permissions (Recruiter can't see bill rates, Finance can)
- **Contract Management**: MSA and SOW generation with multi-party support
- **Timesheet System**: Logging, approval chain (Manager → Finance), rejection workflow
- **Invoice Generation**: Automated from approved hours with contract references
- **Timeline Tracking**: Complete audit trail of all events
- **Worker Record Flow**: Unclaimed → Claimed with two-way profile linking

### Agency Workspace System
- **8-Tab Navigation**: Dashboard, Recruit, Candidates, Clients, Contracts, Finance, Messages, Settings
- **Scope Filtering**: My/Team/Agency views with intelligent access control
- **Privacy by Default**: New deals only visible to participants
- **Masked Candidates**: Restricted access with clear messaging
- **Party-Based Design**: Agency (purple), Client (blue), Candidate/Supplier (emerald)

### Deal Room System
- **Party-Grouped Participants**: Clear visual hierarchy by role
- **Two Deal Types**: Placement (one-time fee) and T&M (recurring)
- **Money Flow Diagrams**: Visual representation of payment flows
- **Scope Control**: Participants only / Team / Agency-wide
- **Audit Logging**: All changes tracked and visible

### Multi-Context Navigation
- **Personal Profile**: User-owned, optionally public
- **Worker Records**: Org-owned, always private
- **Context Switching**: Same login, multiple identities
- **Acting As Chips**: Clear indication of current identity

## 📁 Project Structure

```
/components
  ├── AgencyWorkspace.tsx       # Main agency view with 8 tabs
  ├── AgencyDashboard.tsx       # Pipeline cards and stats
  ├── CandidatesView.tsx        # Filtered candidate list
  ├── DealRoom.tsx              # Deal management hub
  ├── JamesWorkflowDemo.tsx     # Interactive tutorial
  ├── ScopeToggle.tsx           # My/Team/Agency filter
  ├── MaskedCandidateCard.tsx   # Privacy-restricted view
  ├── MoneyFlowDiagram.tsx      # Payment flow visualization
  └── ui/                       # shadcn/ui components

/docs
  ├── AGENCY_WORKSPACE_COMPLETE.md   # Full implementation guide
  ├── AGENCY_SYSTEM_COMPLETE.md      # Agency system architecture
  └── [other design docs]

/styles
  └── globals.css               # Apple-inspired design system
```

## 🎨 Design System

- **Typography Scale**: 28/20/16/14/12 (Apple-inspired)
- **Spacing**: 8px base unit (8/16/24/32)
- **Colors**: Single brand hue (#2563EB), semantic status colors
- **Radius**: 12px rounded corners
- **Dark Mode**: Full support with adjusted colors

## 🔐 Privacy Model

### Default Behavior
- New Deal Rooms: **Participants only**
- Candidate Records: **Owner-controlled visibility**
- Messages: **Private to deal participants**

### Scope Levels
1. **Participants only**: Only listed people see content
2. **Team**: Shared with specific team members
3. **Agency-wide**: Visible to entire organization

### Masked Information
When a user lacks access:
- Partial info shown (skills, experience, location)
- Name and contact details blurred
- Clear "Request Access" action
- Owner identification for access requests

## 💼 Roles & Permissions

| Role | Create Deals | Submit Candidates | View Finance | Manage Team |
|------|-------------|-------------------|--------------|-------------|
| **Owner** | ✅ | ✅ | ✅ | ✅ |
| **Admin** | ✅ | ✅ | ✅ | ✅ |
| **Account Manager** | ✅ | ✅ | ✅ | ❌ |
| **Recruiter** | ✅ | ✅ | Own deals | ❌ |
| **Sourcer** | ❌ | ❌ | ❌ | ❌ |
| **Finance** | ❌ | ❌ | ✅ | ❌ |
| **Viewer** | ❌ | ❌ | ❌ | ❌ |

## 🔄 Complete Workflow: Sarah's Placement

### Quick Version (9 steps - James Workflow Demo)
1. Login → Context Chooser → Dashboard → Parse CV → Submit to Deal → Deal Created ✓

### Full Version (15 steps - Complete Placement Flow)
1. **Login** → james@eliterecruiters.com
2. **Context Chooser** → Select "Elite Recruiters"
3. **Agency Roles** → Assign Account Manager, Recruiter, Finance
4. **RBAC Validation** → Finance sees rates, Recruiter doesn't
5. **Create Deal** → RetailCo - Senior Full-Stack Developer
6. **Submit Candidate** → Sarah Chen with consent
7. **Offer → Hired** → Progress through stages
8. **Create Contract** → MSA + SOW
9. **Create Worker Record** → At TechVentures Inc (Unclaimed)
10. **Worker Record Claimed** → Sarah accepts and links profile
11. **Fill Employment Details** → Title, rates, manager
12. **Org Approvals** → Weekly timesheet, approval chain
13. **Log Time** → Sarah logs 40 hours
14. **Approve Time** → Manager → Finance approval
15. **Generate Invoice** → $4,000 (40h × $100/hr)

**Key Point**: Complete audit trail, RBAC enforcement, and automated invoicing from approved timesheets.

## 🧩 Component Usage

### Agency Workspace
```tsx
<AgencyWorkspace 
  userName="James Wilson" 
  userRole="account-manager" 
  agencyName="Elite Recruiters" 
/>
```

### Scope Toggle
```tsx
<ScopeToggle 
  value={scopeFilter} 
  onChange={setScopeFilter}
  counts={{ my: 2, team: 5, agency: 20 }}
/>
```

### Money Flow Diagram
```tsx
<MoneyFlowDiagram
  dealType="placement"
  parties={{ agency: "Elite Recruiters", client: "RetailCo" }}
  amounts={{ placementFee: "$22,500 (25%)" }}
/>
```

### Masked Candidate
```tsx
<MaskedCandidateCard
  ownerName="Lisa Chen"
  skills={["React", "Node.js"]}
  yearsExperience="8 years"
  location="San Francisco, CA"
  onRequestAccess={() => toast.success("Access request sent")}
/>
```

## 📚 Documentation

### **Quick Links:**
- **[Master Roadmap](/docs/roadmap/MASTER_ROADMAP.md)** ⭐ - Project progress and next steps
- **[System Architecture](/docs/architecture/SYSTEM_ARCHITECTURE.md)** - Complete system design
- **[Recent Updates](/docs/changelog/RECENT_FIXES.md)** - Latest fixes and changes

### **Detailed Guides:**
- **[Complete Placement Workflow](/docs/COMPLETE_PLACEMENT_WORKFLOW.md)** - Full end-to-end workflow
- **[Agency Workspace Complete](/docs/AGENCY_WORKSPACE_COMPLETE.md)** - Implementation guide
- **[Multi-Party Architecture](/docs/architecture/MULTI_PARTY_ARCHITECTURE.md)** - Multi-party approval system
- **[Contract-Scoped Rate Visibility](/docs/architecture/CONTRACT_SCOPED_RATE_VISIBILITY.md)** - Rate privacy system

### **All Documentation:**
See `/docs/` for complete documentation library

## 🛠️ Tech Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **Tailwind v4** - Styling (Apple-inspired design system)
- **shadcn/ui** - Component library
- **Lucide React** - Icons
- **Sonner** - Toast notifications
- **Motion** - Animations

## 🎬 Demo Features

All views are fully interactive with:
- ✅ Mock data for realistic experience
- ✅ No backend required
- ✅ Dark mode support
- ✅ Responsive design
- ✅ Toast notifications
- ✅ Smooth transitions

## 🔜 Future Enhancements

### Phase 2
- Real-time collaboration
- Document signing workflow
- Timesheet approval flow
- Invoice generation
- Audit log viewer
- Team chat/comments

### Phase 3
- AI candidate matching
- Email integration
- Calendar sync
- Mobile app
- Analytics dashboard
- API webhooks

## 📝 Notes

- All authentication is mocked for demo purposes
- Default page is set to Agency Workspace for immediate preview
- Use demo navigation to explore different views
- All data is hardcoded - no backend integration

## 🎯 Design Principles

1. **Privacy by Default** - Sensitive data hidden unless explicitly shared
2. **Clear Context** - Always show which identity is active
3. **Party-Based** - Visual distinction between Agency/Client/Candidate
4. **Scope-Aware** - Filter what you see based on access level
5. **Apple-Inspired** - Clean, minimal, intentional design

---

Built with ❤️ for technical freelancers, companies, and recruitment agencies.
