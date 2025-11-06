# 🚀 Phase 5 M5.1: Project Creation & Collaborative Canvas

**Milestone:** M5.1 of 4  
**Duration:** Week 1  
**Goal:** Multiple stakeholders can co-create a project graph with roles, presence, and comments

---

## 🎯 What We're Building

A **collaborative project setup experience** where:
- Project owners create projects and invite collaborators
- Multiple people edit the same graph in real-time
- Everyone sees who's editing what (presence cursors)
- Comments can be pinned to nodes/edges
- Roles control who can do what
- Publish creates a frozen Policy v1

---

## 🧭 User Journey

### **1. Owner creates project**
```
Owner clicks "New Project"
→ Wizard opens: Name, region, currency, dates
→ "Add Parties" step: Search existing companies or invite new
→ "Invite Collaborators" step: Add team members with roles
→ Graph canvas opens with initial parties
```

### **2. Collaborative editing**
```
Owner adds Contract node between Party A ↔ Party B
Collaborator (from Party A) sees cursor, adds their Person node
Both see changes instantly
Comment system allows discussion on specific nodes
```

### **3. Roles in action**
```
Owner: Can edit everything, publish, manage roles
Editor: Can edit nodes/edges, add contracts
Contributor: Can edit their own org's nodes only
Commenter: Can add comments, @mention, but not edit graph
Viewer: Read-only access
```

### **4. Publish**
```
Owner clicks "Publish Draft"
→ System compiles graph to Policy v1
→ Generates read-only link for external stakeholders
→ Graph becomes version-controlled
```

---

## 📋 Implementation Tasks

### **Task 1: Project Creation Wizard**

**Component:** `/components/workgraph/ProjectCreateWizard.tsx`

**Steps:**
1. **Basic Info**
   - Project name
   - Region (US/EU/UK) - for compliance
   - Currency (USD/EUR/GBP)
   - Start/end dates
   - Default work week (Mon-Fri, custom)

2. **Add Parties**
   - Search existing company profiles
   - "Attach Existing Company" button
   - "Invite New Company" by email
   - Shows preview of Party nodes

3. **Invite Collaborators**
   - Email addresses
   - Assign roles (Owner/Editor/Contributor/Commenter/Viewer)
   - Send invitation emails

4. **Review & Create**
   - Summary of setup
   - "Create Project" button
   - Redirects to WorkGraph Builder

**Data Model:**
```typescript
type Project = {
  id: string;
  name: string;
  region: 'US' | 'EU' | 'UK';
  currency: 'USD' | 'EUR' | 'GBP';
  startDate: string;
  endDate?: string;
  workWeek: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  ownerId: string;
  createdAt: string;
};

type ProjectMember = {
  id: string;
  projectId: string;
  userId: string;
  role: 'Owner' | 'Editor' | 'Contributor' | 'Commenter' | 'Viewer';
  scope?: string; // For Contributor: which org they represent
  invitedBy: string;
  invitedAt: string;
  acceptedAt?: string;
};
```

---

### **Task 2: Real-time Collaboration**

**Component:** `/components/workgraph/CollaborationLayer.tsx`

**Features:**

**2.1: Presence Cursors**
```typescript
type Presence = {
  userId: string;
  userName: string;
  userColor: string;
  cursorX: number;
  cursorY: number;
  selectedNodeId?: string;
  lastSeen: number;
};

// Show cursor with name tag
// Highlight selected node with user's color
// Fade out after 30s of inactivity
```

**2.2: Optimistic Locking**
```typescript
type NodeLock = {
  nodeId: string;
  lockedBy: string;
  lockedAt: number;
  expiresAt: number; // Auto-release after 5 minutes
};

// When user starts editing:
// - Acquire lock on node
// - Show "locked by [User]" to others
// - Release lock on blur or timeout
```

**2.3: Activity Feed**
```typescript
type Activity = {
  id: string;
  projectId: string;
  userId: string;
  action: 'node_added' | 'node_edited' | 'edge_added' | 'comment_added';
  entityType: 'Party' | 'Person' | 'Contract' | 'Edge';
  entityId: string;
  description: string;
  timestamp: string;
};

// Show in sidebar:
// "Sarah added Company A" - 2m ago
// "John commented on MSA node" - 5m ago
```

**Implementation:**
- Use WebSocket or polling (simple: 2s polling for MVP)
- Broadcast presence updates
- Sync node/edge changes
- Conflict resolution: last-write-wins for MVP

---

### **Task 3: Roles & Permissions**

**Role Matrix Implementation:**

```typescript
type Role = 'Owner' | 'Editor' | 'Contributor' | 'Commenter' | 'Viewer';

type Permission = 
  | 'create_party'
  | 'edit_party'
  | 'delete_party'
  | 'create_contract'
  | 'edit_contract'
  | 'create_compliance'
  | 'upload_compliance'
  | 'change_visibility'
  | 'add_comment'
  | 'publish'
  | 'manage_roles';

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  Owner: ['*'], // All permissions
  
  Editor: [
    'create_party', 'edit_party', 'delete_party',
    'create_contract', 'edit_contract',
    'create_compliance', 'upload_compliance',
    'change_visibility', 'add_comment'
  ],
  
  Contributor: [
    'edit_party', // Only their org
    'create_contract', // If they're a signatory
    'create_compliance', // For their party
    'upload_compliance', 'add_comment'
  ],
  
  Commenter: [
    'add_comment'
  ],
  
  Viewer: []
};

// Usage:
function canUserPerform(
  userId: string,
  permission: Permission,
  context?: { nodeId?: string; orgId?: string }
): boolean {
  const member = getProjectMember(userId);
  
  // Owner can do everything
  if (member.role === 'Owner') return true;
  
  // Check role permissions
  const allowed = ROLE_PERMISSIONS[member.role];
  if (!allowed.includes(permission)) return false;
  
  // Contributor scope check
  if (member.role === 'Contributor' && context?.orgId) {
    return member.scope === context.orgId;
  }
  
  return true;
}
```

**UI Gating:**
```tsx
// Hide/disable buttons based on role
{canUserPerform(currentUser, 'create_party') && (
  <Button onClick={addPartyNode}>Add Party</Button>
)}

// Show read-only hint
{!canUserPerform(currentUser, 'edit_party') && (
  <Tooltip content="You don't have permission to edit parties">
    <Button disabled>Edit</Button>
  </Tooltip>
)}
```

---

### **Task 4: Comments & Mentions**

**Component:** `/components/workgraph/CommentLayer.tsx`

**Features:**

**4.1: Comment Thread**
```typescript
type Comment = {
  id: string;
  projectId: string;
  nodeId?: string; // Pinned to node
  edgeId?: string; // Pinned to edge
  x?: number; // Canvas position if not pinned
  y?: number;
  userId: string;
  text: string;
  mentions: string[]; // User IDs
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
};

type CommentThread = {
  id: string;
  rootCommentId: string;
  replies: Comment[];
};
```

**4.2: UI**
```tsx
// Comment pin on node
<div className="comment-pin" onClick={() => openThread(nodeId)}>
  💬 <span className="count">3</span>
</div>

// Comment panel (sidebar)
<ScrollArea>
  {threads.map(thread => (
    <CommentThread
      key={thread.id}
      thread={thread}
      onReply={handleReply}
      onResolve={handleResolve}
    />
  ))}
</ScrollArea>

// Mention autocomplete
<Textarea
  value={commentText}
  onChange={handleChange}
  onKeyDown={(e) => {
    if (e.key === '@') {
      showMentionPicker();
    }
  }}
/>
```

**4.3: Notifications**
```typescript
// When mentioned:
sendNotification({
  userId: mentionedUserId,
  type: 'comment_mention',
  title: '@you in Project Alpha',
  message: 'Sarah mentioned you: "Can you review the MSA terms?"',
  actionUrl: `/projects/${projectId}?comment=${commentId}`,
});
```

---

### **Task 5: Publish Draft**

**Component:** Update `/components/workgraph/WorkGraphBuilder.tsx`

**Flow:**
```
1. User clicks "Publish Draft"
2. Validation runs:
   - At least 2 parties?
   - At least 1 approval path?
   - All contracts have signatories?
3. Compile graph → Policy JSON
4. Create policy_version record (reuse Day 1-2 work!)
5. Generate read-only link
6. Send notifications to all collaborators
7. Lock editing (optional: allow continue editing for v2)
```

**Code:**
```typescript
async function publishDraft() {
  // Validate
  const validation = validateGraph(nodes, edges);
  if (!validation.isValid) {
    showValidationErrors(validation.errors);
    return;
  }
  
  // Compile
  const compiled = compileGraph(nodes, edges);
  
  // Save policy version (reuse existing code!)
  const policy = await savePolicyVersion({
    projectId,
    compiledJson: compiled,
    graphSnapshot: { nodes, edges, viewport },
    versionName: 'Draft v1',
    description: 'Initial project setup',
    createdBy: currentUser.id,
    publishImmediately: true,
    activateImmediately: true,
  });
  
  // Generate shareable link
  const shareLink = `${window.location.origin}/projects/${projectId}/view?token=${policy.id}`;
  
  // Notify collaborators
  await notifyCollaborators({
    projectId,
    message: `${currentUser.name} published Draft v1`,
    actionUrl: shareLink,
  });
  
  // Show success
  showToast({
    title: 'Draft Published!',
    description: 'Policy v1 created. Share the read-only link with stakeholders.',
  });
}
```

---

## 🗄️ Database Schema

### **New Tables:**

```sql
-- projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  region VARCHAR(10) NOT NULL, -- 'US', 'EU', 'UK'
  currency VARCHAR(3) NOT NULL, -- 'USD', 'EUR', 'GBP'
  start_date DATE NOT NULL,
  end_date DATE,
  work_week JSONB NOT NULL DEFAULT '{"monday":true,"tuesday":true,"wednesday":true,"thursday":true,"friday":true,"saturday":false,"sunday":false}',
  owner_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- project_members table
CREATE TABLE project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role VARCHAR(20) NOT NULL, -- 'Owner', 'Editor', 'Contributor', 'Commenter', 'Viewer'
  scope VARCHAR(255), -- For Contributor: org_id they represent
  invited_by UUID NOT NULL,
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(project_id, user_id)
);

-- project_presence table (ephemeral, can clear old data)
CREATE TABLE project_presence (
  user_id UUID NOT NULL,
  project_id UUID NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  user_color VARCHAR(7) NOT NULL, -- Hex color
  cursor_x FLOAT,
  cursor_y FLOAT,
  selected_node_id VARCHAR(255),
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, project_id)
);

-- project_comments table
CREATE TABLE project_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  node_id VARCHAR(255), -- Node this is pinned to
  edge_id VARCHAR(255), -- Edge this is pinned to
  x FLOAT, -- Canvas position if not pinned
  y FLOAT,
  user_id UUID NOT NULL,
  text TEXT NOT NULL,
  mentions UUID[], -- Array of user IDs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID
);

-- project_activity table
CREATE TABLE project_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50),
  entity_id VARCHAR(255),
  description TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_project_members_project ON project_members(project_id);
CREATE INDEX idx_project_members_user ON project_members(user_id);
CREATE INDEX idx_project_presence_project ON project_presence(project_id);
CREATE INDEX idx_project_comments_project ON project_comments(project_id);
CREATE INDEX idx_project_activity_project ON project_activity(project_id, created_at DESC);
```

---

## 🧪 Testing Checklist

### **Manual Testing:**
- [ ] Create project via wizard
- [ ] Invite collaborator with Editor role
- [ ] Both users open same project
- [ ] See each other's cursors
- [ ] Edit same node → see lock indicator
- [ ] Add comment with @mention
- [ ] Mentioned user receives notification
- [ ] Commenter can't edit nodes
- [ ] Viewer can only view
- [ ] Publish creates Policy v1
- [ ] Read-only link works

### **Edge Cases:**
- [ ] What if two users edit same node simultaneously?
- [ ] What if lock expires while user is editing?
- [ ] What if user loses connection?
- [ ] What if @mention user not in project?
- [ ] What if publish validation fails?

---

## 📁 Files to Create

```
Components:
✅ /components/workgraph/ProjectCreateWizard.tsx
✅ /components/workgraph/CollaborationLayer.tsx
✅ /components/workgraph/PresenceCursor.tsx
✅ /components/workgraph/CommentLayer.tsx
✅ /components/workgraph/CommentThread.tsx
✅ /components/workgraph/ActivityFeed.tsx
✅ /components/workgraph/RoleManager.tsx

Utils:
✅ /utils/collaboration/presence.ts
✅ /utils/collaboration/permissions.ts
✅ /utils/collaboration/activity.ts

Migrations:
✅ /supabase/migrations/004_project_collaboration.sql

Types:
✅ /types/collaboration.ts
```

---

## 🎯 M5.1 Exit Criteria

- [ ] ✅ Two orgs can co-edit one project graph
- [ ] ✅ Presence shows both users editing
- [ ] ✅ Comments work with @mentions
- [ ] ✅ Commenters can add notes but can't change nodes/edges
- [ ] ✅ Publish creates Policy v1
- [ ] ✅ Read-only link generated
- [ ] ✅ Activity feed shows recent changes

---

## 🚀 Next: M5.2 - Contracts & Privacy

After M5.1 complete, we'll add:
- FrameworkContract (MSA) nodes
- NDA nodes
- SOW nodes
- RateCard nodes
- Field-level visibility rules
- E-sign workflow

---

**Created:** 2025-10-31  
**Status:** 📋 READY TO START  
**Duration:** ~1 week  
**Next:** Begin Project Creation Wizard implementation
