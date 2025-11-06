# WorkGraph Context System

## Overview

WorkGraph implements a multi-tenant, multi-profile architecture where a single user account can own or join multiple contexts:

- **Personal Profile** (Freelancer)
- **Company Workspace** (Organization)
- **Headhunting Agency Workspace** (Organization with Recruiter tools)

## Core Components

### 1. Context Management (`/contexts/WorkGraphContext.tsx`)

The central state management for user contexts:

```typescript
interface Context {
  id: string;
  type: "personal" | "company" | "agency";
  name: string;
  role?: "owner" | "admin" | "manager" | "member" | "contractor" | "recruiter";
}
```

**Hook**: `useWorkGraph()`
- Returns: `currentContext`, `availableContexts`, `switchContext()`

### 2. ContextSwitcher Component

Located in the AppHeader, allows users to switch between their available contexts. Shows:
- Context icon (User/Building/Users)
- Context name
- Context type and role
- Active context indicator

### 3. ActingAsChip Component

Used in message composers and action flows to show which identity is performing an action. Allows quick context switching within forms.

### 4. Context-Aware Navigation

The AppHeader dynamically changes navigation based on context:

**Personal Context:**
- Dashboard, Deliver, Contracts, Finance, Messages, Profile

**Company Context:**
- Dashboard, Recruit, Deliver, Contracts, Finance, Directory, Messages

**Agency Context:**
- Dashboard, Recruit, Candidates, Clients, Contracts, Finance, Messages

## Data Separation: Personal Profile vs Worker Record

### Personal Profile (PP)
- **Owner**: Individual user
- **Purpose**: Public identity (optional), portfolio, rates, availability
- **Visibility**: Private by default; user controls public/searchable status
- **Fields**: Name, photo, portfolio, skills, experience, rates, availability

### Worker Record (WR)
- **Owner**: Organization (company or agency)
- **Purpose**: Internal employment/assignment data
- **Visibility**: Always private to the org and contract parties
- **Fields**: Internal title, department, contract rates, timesheets, assignments

## Linking Flows

### Flow 1: Employee Signs Up First
1. Person creates/claims Personal Profile (PP)
2. They request to link to a company (via invite or email domain)
3. Company approves → Worker Record (WR) is created and linked
4. Person controls PP fields; Company controls WR fields

### Flow 2: Company Creates Employee First
1. Company creates Worker Record (WR) with basic info
2. WR remains "unclaimed" and private (not visible outside company)
3. Employee receives invite to claim
4. If claimed, WR links to their PP; if not, stays internal-only

## UI Components

### ClaimRecordBanner
Shows when a company creates a Worker Record for a user. Options:
- Claim & Create My Profile
- Use Privately (No Public Profile)
- Dismiss (claim later)

### ViewAsToggle
Appears on profile pages to preview visibility:
- **Personal Profile**: My View / Public View / As Company
- **Company Profile**: Member View / Public View

### MessageComposer
Includes ActingAsChip to show which identity sends the message.

## Type Definitions

Located in `/types/index.ts`:
- `Context`, `ContextType`
- `PersonalProfile`
- `WorkerRecord`
- `Organization`
- `Contract`, `ContractType`
- `Job`
- `Representation` (for agency candidates)

## Demo Page

The **Context Demo** page (`/components/ContextDemo.tsx`) showcases:
- Current context info
- Claim Record banner (personal context only)
- Profile preview with ViewAs toggle
- Message composer with ActingAs chip
- Side-by-side comparison of Personal Profile vs Worker Record

## Privacy & Permissions

### Personal Profile
- ✓ You own the data
- ✓ You control visibility (Public/Private toggle)
- ✓ Searchable only if you enable it
- ✓ Can link to multiple organizations

### Worker Record
- ✓ Organization owns the data
- ✓ Always private to that org
- ✓ Visible only to contract parties
- ✓ Used for timesheets, approvals, billing

## Onboarding Flow

**Step 1**: "Who are you here as?" (multi-select)
- Freelancer
- Company
- Headhunting Agency

**Step 2**: Build profile based on selection(s)
- Freelancer → Personal Profile setup
- Company → Create workspace, invite employees
- Agency → Create workspace, import CVs

## Navigation Context Rules

Users see different dashboards and tools based on active context:

| Feature | Personal | Company | Agency |
|---------|----------|---------|--------|
| My Week widget | ✓ | ✓ | ✓ |
| Recruit tab | - | ✓ | ✓ |
| Candidates tab | - | - | ✓ |
| Directory | - | ✓ | ✓ |
| Profile page | ✓ (own) | - | - |

## Implementation Notes

### Adding New Contexts
1. Add context type to `ContextType` in `/types/index.ts`
2. Update `getNavigationItems()` in `AppHeader.tsx`
3. Add icon mapping in `ContextSwitcher.tsx`
4. Update dashboard widgets in `Dashboard.tsx`

### Context-Aware Queries
When fetching data, always include current context:

```typescript
const { currentContext } = useWorkGraph();

// Filter data by context
if (currentContext.type === "company") {
  // Show Worker Records for this company
} else if (currentContext.type === "personal") {
  // Show my Personal Profile and linked contracts
}
```

### Microcopy Guidelines

- Personal context: "Your profile", "Your contracts", "You"
- Company context: "[Company] workspace", "Employees", "Team"
- Agency context: "Candidates", "Placements", "Clients"

Always include helper text explaining data ownership:
- "Your Personal Profile is yours. Companies can only see Worker Records."
- "Worker Records are private to [Company]. Only contract parties can see this data."

## Future Enhancements

1. **Permissions Matrix**: Fine-grained role-based access within orgs
2. **Context Presets**: Save custom dashboard layouts per context
3. **Quick Switch Shortcuts**: Keyboard shortcuts (⌘1, ⌘2, ⌘3)
4. **Context-Aware Search**: Filter search results by active context
5. **Notification Routing**: Send notifications to the right context
