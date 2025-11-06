# Authentication & Context System - Implementation Guide

## Overview

WorkGraph implements **"one login, multiple workspaces"** architecture where a single user account can operate in multiple contexts (Personal, Company, Agency) without logging out.

---

## Architecture

### Authentication Flow

```
┌─────────────┐
│   Login     │ → One email/password for all workspaces
└─────┬───────┘
      │
      ▼
┌─────────────────┐
│ Context Chooser │ → Shows if user has >1 context
└─────┬───────────┘   (Skip if single context)
      │
      ▼
┌─────────────────┐
│   Dashboard     │ → Context-specific navigation & UI
└─────────────────┘
```

### Components

| Component | Purpose | Location |
|-----------|---------|----------|
| `Login` | Single sign-in form | `/components/Login.tsx` |
| `ContextChooser` | Workspace selection | `/components/ContextChooser.tsx` |
| `ContextSwitcher` | Header dropdown (always visible) | `/components/ContextSwitcher.tsx` |
| `AppHeader` | Context-aware navigation | `/components/AppHeader.tsx` |

---

## Context Types

### 1. Personal Context
**Icon**: 👤 User  
**Purpose**: Freelancer/solo contractor identity  
**Navigation**: Dashboard · Deliver · Contracts · Finance · Messages · Profile

**What it means**:
- "I control my public profile"
- "I invoice when I work directly"
- Personal Profile (PP) is editable here

---

### 2. Company Context
**Icon**: 🏢 Building  
**Purpose**: Manage employees/contractors, projects, contracts  
**Navigation**: Dashboard · Recruit · Deliver · Contracts · Finance · Directory · Messages · Settings

**What it means**:
- "I manage Worker Records"
- "I create jobs and hire"
- "I approve timesheets"
- Worker Records (WR) are owned here

---

### 3. Agency Context
**Icon**: 👥 Users  
**Purpose**: Candidate management, placements, client relationships  
**Navigation**: Dashboard · Recruit · Candidates · Clients · Contracts · Finance · Messages · Settings

**What it means**:
- "I represent candidates"
- "I submit to client jobs"
- "I earn placement fees"
- Candidates = agency-owned Worker Records

---

## Navigation Differences

### Personal (Freelancer)
```
✓ Dashboard     → My tasks, my projects
✓ Deliver       → Projects I'm working on, time tracking
✓ Contracts     → NDAs/MSAs/SOWs I've signed
✓ Finance       → Invoices I issue (as supplier)
✓ Messages      → Communications
✓ Profile       → My Personal Profile (PP)
```

### Company
```
✓ Dashboard     → Team overview, project burnup
✓ Recruit       → Jobs, candidates, submissions
✓ Deliver       → Projects, assignments
✓ Contracts     → NDAs/MSAs/SOWs with suppliers
✓ Finance       → Payables, invoices to clients
✓ Directory     → Internal Worker Records (private)
✓ Messages      → Communications
✓ Settings      → Billing, domains, permissions
```

### Agency
```
✓ Dashboard     → Pipeline, placements, commissions
✓ Recruit       → Jobs (from clients)
✓ Candidates    → Agency-owned Worker Records
✓ Clients       → Companies we place with
✓ Contracts     → Representation agreements, placements
✓ Finance       → Invoices, placement fees
✓ Messages      → Communications
✓ Settings      → Terms, exclusivity, billing
```

---

## Context Switcher Features

### Always Visible
Located in header, shows current context:

```
┌─────────────────────────────────┐
│ 🏢 TechVentures Inc. [Company] ▼│
└─────────────────────────────────┘
```

### Dropdown Contents

1. **Search** (if >3 contexts)
   - Filter workspaces by name

2. **Available Contexts** (with checkmark on active)
   ```
   ✓ 👤 Sarah Chen (Personal)
     🏢 TechVentures Inc. (Company · Owner)
     👥 Elite Recruiters (Agency · Admin)
   ```

3. **Create New Workspace**
   - New Company
   - New Agency

### Switching Behavior
When user switches context:
- ✅ Navigation items change
- ✅ Dashboard widgets change
- ✅ "Acting as" identity changes (in message composer, etc.)
- ✅ Directory shows different data (internal WRs vs public PPs)

---

## Key Microcopy

### Login Screen Footer
> "One login, multiple workspaces. Switch contexts anytime from the header."

### Context Chooser Header
> "Choose your workspace"  
> "Select which context you'd like to enter"

### Context Switcher Label
> "Act as"

### Create New Options
> "Create new workspace"  
> • New Company  
> • New Agency

---

## Badge System

### Visibility Badges
| Type | Badge | Usage |
|------|-------|-------|
| Public | 🌐 Public | Personal Profiles (opt-in) |
| Private | 🔒 Private | Worker Records (always) |
| Shared | 👥 Shared with X | Specific sharing |

### Claim Status (Worker Records)
| Status | Badge | Meaning |
|--------|-------|---------|
| Unclaimed | ⚠️ Unclaimed | Invite sent, not claimed |
| Claimed | ✅ Claimed | Linked to Personal Profile |

### Representation (Agency)
| Type | Badge | Meaning |
|------|-------|---------|
| Exclusive | 👥 Exclusive • Ends [date] | Agency has exclusive rights |
| Non-exclusive | 👥 Non-exclusive | Candidate can work with others |

### Consent (Agency → Client)
| Status | Badge | Meaning |
|--------|-------|---------|
| Requested | ⏱️ Consent Requested | Awaiting candidate approval |
| Approved | ✅ Approved | Candidate approved sharing |
| Declined | ❌ Declined | Candidate declined |
| Expired | 📅 Expired | Time limit passed |

---

## Implementation Details

### AppRouter.tsx
```typescript
function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const handleLogin = (email: string) => {
    setIsAuthenticated(true);
    
    // If multiple contexts, show chooser
    if (mockContexts.length > 1) {
      setCurrentPage("context-chooser");
    } else {
      setCurrentContext(mockContexts[0]);
      setCurrentPage("dashboard");
    }
  };
  
  // ...
}
```

### ContextSwitcher.tsx
```typescript
export function ContextSwitcher() {
  const { currentContext, availableContexts, switchContext } = useWorkGraph();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContexts = availableContexts.filter((ctx) =>
    ctx.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Shows search if >3 contexts
  // Shows all available contexts with checkmark on active
  // Shows "Create new Company/Agency" options
}
```

### AppHeader.tsx
```typescript
const getNavigationItems = () => {
  switch (currentContext.type) {
    case "personal":
      return ["Dashboard", "Deliver", "Contracts", "Finance", "Messages", "Profile"];
    case "company":
      return ["Dashboard", "Recruit", "Deliver", "Contracts", "Finance", "Directory", "Messages", "Settings"];
    case "agency":
      return ["Dashboard", "Recruit", "Candidates", "Clients", "Contracts", "Finance", "Messages", "Settings"];
  }
};
```

---

## User Flows

### Flow 1: New User (Single Context)
```
Login → (Skip Chooser) → Personal Dashboard
```

### Flow 2: Multi-Role User
```
Login → Context Chooser → Select Company → Company Dashboard
                        ↓
            (Can switch via header dropdown)
                        ↓
            Personal / Company / Agency
```

### Flow 3: Creating New Workspace
```
Header → Context Switcher → "New Company" → Onboarding → New Company Dashboard
```

---

## Figma Design Requirements

### Login Card
- ✅ Email + password fields
- ✅ "Remember me" checkbox
- ✅ "Forgot password?" link
- ✅ Footer microcopy about multiple workspaces

### Context Chooser Cards
- ✅ Avatar/logo (gradient background)
- ✅ Name
- ✅ Type badge (Personal/Company/Agency)
- ✅ Role badge (Owner/Admin/Member)
- ✅ "Last active X ago"
- ✅ "Enter" button (primary action)
- ✅ "Switch account" secondary action
- ✅ "Create new Company/Agency" buttons

### Context Switcher (Header)
- ✅ Icon (User/Building/Users) with color coding
- ✅ Context name
- ✅ Type badge
- ✅ Chevron down
- ✅ Dropdown with search (if >3 contexts)
- ✅ Checkmark on active context
- ✅ "Create new" options at bottom

---

## States to Design

### Login
- Default
- Loading (after submit)
- Error (invalid credentials)

### Context Chooser
- Default (3 contexts)
- Empty (new user, only Personal)
- Many (>5 contexts, shows search)

### Context Switcher
- Closed (shows current context)
- Open (dropdown with list)
- Searching (filtered results)
- No results (empty state)

---

## Accessibility

### Touch Targets
- ✅ All buttons 44px minimum height
- ✅ Context cards are large, tappable

### Keyboard Navigation
- ✅ Tab through login fields
- ✅ Arrow keys in context chooser
- ✅ Escape to close context switcher
- ✅ Search field gets focus on dropdown open

### Screen Readers
- ✅ "Act as" label on switcher
- ✅ "Currently acting as X" announcement on switch
- ✅ Context type and role announced

---

## Edge Cases

### Single Context User
- Skip context chooser entirely
- Context switcher still shows (but only one option)
- "Create new" options available

### User with 10+ Contexts
- Search becomes critical
- Consider pinning recent/favorites
- Show "Last active" to help choose

### Context Switch Mid-Form
- Show confirmation: "You have unsaved changes"
- Preserve draft if possible
- Or warn and discard

---

## Next Steps

### Backend Integration
- User → Contexts mapping (many-to-many)
- Context permissions (Owner/Admin/Member roles)
- Last active timestamp per context
- Context creation API

### Advanced Features
- Pin favorite contexts
- Custom context avatars/logos
- Context-specific notification settings
- "Recent contexts" quick-switch

---

*Implementation complete: Login → Context Chooser → Context-Aware Navigation*  
*Demo: Click "Auth Flow Demo" in navigation helper to see step-by-step flow*
