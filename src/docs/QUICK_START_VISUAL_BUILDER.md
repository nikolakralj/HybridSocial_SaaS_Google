# Quick Start: Visual WorkGraph Builder

## ⚡ 5-Minute Setup Guide

Get the Visual Builder running in 5 minutes.

---

## Step 1: Install Dependencies

```bash
npm install reactflow@11.10.0
```

Or if using direct imports (Figma Make supports this):

```typescript
import ReactFlow from 'reactflow@11.10.0';
import 'reactflow@11.10.0/dist/style.css';
```

---

## Step 2: Add Route to AppRouter

Open `/components/AppRouter.tsx`:

```typescript
// Add to imports
import { WorkGraphBuilder } from './workgraph/WorkGraphBuilder';

// Add to AppRoute type
type AppRoute = 
  | "landing"
  // ... other routes
  | "visual-builder";  // ← Add this

// Add to navigationRoutes
const navigationRoutes: { route: AppRoute; label: string }[] = [
  { route: "landing", label: "🏠 Landing" },
  { route: "projects", label: "📋 Projects" },
  { route: "visual-builder", label: "🎨 Visual Builder" },  // ← Add this
  // ... other routes
];

// Add to renderRoute switch
case "visual-builder":
  return (
    <WorkGraphBuilder
      projectId="demo-project-1"
      projectName="Demo Project"
      onSave={(config) => {
        console.log('Compiled Config:', config);
        alert('Project saved! Check console for compiled JSON.');
      }}
    />
  );
```

---

## Step 3: Test the Visual Builder

1. Open the app
2. Click "🎨 Visual Builder" in the dev nav
3. You should see:
   - Empty canvas with grid
   - Node palette on the left
   - Mini-map in bottom-right corner

---

## Step 4: Build Your First Approval Chain

### A. Add 4 Party Nodes

1. **Click "Party/Org"** in the left palette
2. Click on the new node to open property panel (right side)
3. Configure:
   - **Name**: "Tech Corp"
   - **Party Type**: Company
   - **Role**: "Project Manager"
   - **Permissions**: ✅ Can Approve, ✅ Can View Rates

4. **Repeat for 3 more parties**:
   - **Agency**: "Design Agency", Agency type, "Creative Director", ✅ Can Approve, ❌ Can View Rates
   - **Client**: "Retail Co", Client type, "Finance Team", ✅ Can Approve, ❌ Can View Rates
   - **Contractor**: "Freelancers", Contractor type

### B. Add a Contract Node

1. Click "Contract" in palette
2. Configure:
   - **Name**: "Sarah Johnson - Developer"
   - **Contract Type**: Hourly
   - **Hourly Rate**: 150
   - **Rate Visibility**: ✅ Hide from Agency, ✅ Hide from Client

### C. Connect with Edges

1. **Drag from Contractor to Company**:
   - Click and hold on Contractor's bottom handle
   - Drag to Company's top handle
   - Release
   - In edge properties, set **Edge Type**: "Subcontracts"

2. **Create Approval Chain**:
   - Company → Agency: **Edge Type**: "Approves", **Order**: 1
   - Agency → Client: **Edge Type**: "Approves", **Order**: 2

Your graph should look like:

```
Contractor
    ↓ (subcontracts)
Company (Approves: Step 1)
    ↓
Agency (Approves: Step 2)
    ↓
Client (Approves: Step 3)
```

---

## Step 5: Validate & Compile

1. Click **"Validate"** button (top-right)
   - Should show: ✅ "No errors"
   - If errors, they'll be listed at the bottom

2. Click **"Compile"** button
   - Modal opens showing compiled JSON
   - You'll see:
     - **Approval Policies**: 3-step sequential approval
     - **Visibility Rules**: Rate masked for Agency & Client

3. Click **"Save Project"**
   - Console logs the compiled config
   - Alert confirms save

---

## Step 6: Preview as Different Parties

1. Click **"Preview as..."** dropdown (top-right)
2. Select **"Design Agency"**
3. Observe:
   - Contract node shows 🔒 icon (rate is hidden)
   - Agency step highlighted in approval chain
   - Client node may be grayed out (can't see everything)

4. Switch to **"Tech Corp"** (Company)
   - No 🔒 icon (company can see rates)
   - Company step highlighted

---

## 🎉 Success!

You've just:
- ✅ Built a 4-party approval chain visually
- ✅ Set up rate visibility rules
- ✅ Validated the configuration
- ✅ Compiled to executable JSON policies
- ✅ Previewed from different party perspectives

---

## 🐛 Troubleshooting

### Issue: "Cannot find module 'reactflow'"

**Fix**: Install the package:
```bash
npm install reactflow@11.10.0
```

### Issue: Canvas is blank

**Fix**: Check that ReactFlow CSS is imported:
```typescript
import 'reactflow/dist/style.css';
```

### Issue: Can't connect nodes

**Fix**: Make sure you're dragging from the **bottom handle** (source) to another node's **top handle** (target).

### Issue: Compile button disabled

**Fix**: Run Validate first and fix any errors.

### Issue: Rate still visible in preview

**Fix**: 
1. Make sure you checked "Hide from Agency" in the Contract node's property panel
2. Compile the project again
3. Refresh the preview

---

## 📋 Next Steps

Now that you have the basic flow working:

### Week 1: Polish the Demo
- [ ] Add more node types (SOW, PO, Budget, Milestone)
- [ ] Test with 10+ nodes
- [ ] Try different edge types (Funds, Assigns, etc.)
- [ ] Record a demo video

### Week 2: Database Integration
- [ ] Create `project_configs` table
- [ ] Save compiled configs to Supabase
- [ ] Load existing configs on open
- [ ] Add version history

### Week 3: Connect to Approval System
- [ ] Use compiled policies in ApprovalsV2Tab
- [ ] Route timesheets through approval chain
- [ ] Apply rate masking in API

### Week 4: Security
- [ ] Implement RLS policies
- [ ] Add field masking middleware
- [ ] Enable audit logging
- [ ] Run penetration tests

---

## 💡 Pro Tips

### Tip 1: Use Templates

Create common patterns once, save as templates:

```typescript
const templates = {
  staffAug: {
    nodes: [
      { type: 'party', data: { name: 'Contractor', partyType: 'contractor' } },
      { type: 'party', data: { name: 'Company', partyType: 'company' } },
    ],
    edges: [
      { source: 'contractor', target: 'company', data: { edgeType: 'worksOn' } },
    ],
  },
};
```

### Tip 2: Keyboard Shortcuts

- **Delete**: Remove selected node/edge
- **Ctrl+Z**: Undo
- **Ctrl+C/V**: Copy/paste nodes
- **Mouse wheel**: Zoom in/out
- **Drag canvas**: Pan around

### Tip 3: Validation Best Practices

Always validate before compiling:
- ✅ No cycles in approval chain
- ✅ All contractors connected
- ✅ At least one approver
- ✅ No orphan nodes

### Tip 4: Rate Visibility Strategy

Common patterns:
- **Fully Transparent**: Everyone sees everything (rare)
- **Company Only**: Company sees rates, others see hours only
- **Progressive Disclosure**: Rates revealed after contract signed
- **Aggregate Only**: Client sees total, not per-person breakdown

---

## 📖 Learn More

- **Full Implementation Guide**: `/docs/WORKGRAPH_VISUAL_BUILDER_IMPLEMENTATION.md`
- **12-Month Roadmap**: `/docs/WORKGRAPH_MASTER_ROADMAP.md`
- **Security Guide**: `/docs/PERMISSION_MATRIX_IMPLEMENTATION.md`
- **React Flow Docs**: https://reactflow.dev/

---

## 🎬 Demo Video Script (Record This)

**Title**: "Build a 4-Party Approval Chain in 2 Minutes"

**Script**:
1. (0:00) "Hi, I'm going to show you how to build a complex approval chain visually"
2. (0:10) "I'll drag 4 party nodes: Contractor, Company, Agency, Client"
3. (0:30) "Connect them with approval edges in order"
4. (0:45) "Add a contract with a rate..."
5. (0:55) "...and hide the rate from Agency and Client"
6. (1:10) "Validate - no errors!"
7. (1:20) "Compile to generate the approval policy JSON"
8. (1:35) "Preview as Agency - see how the rate is hidden"
9. (1:50) "Save the project - done!"
10. (2:00) "That's how you configure multi-party approvals with WorkGraph"

---

**Time to Build**: 5 minutes  
**Time to Demo**: 2 minutes  
**Time to Wow Stakeholders**: Instant ✨
