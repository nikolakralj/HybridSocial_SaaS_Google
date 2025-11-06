# Project Configuration System

## Overview

The Project Configuration System is the foundation for multi-level approval workflows in WorkGraph. It allows you to set up complex approval chains where timesheets flow through multiple parties (contractors → companies → agencies → clients), each with their own permissions and visibility settings.

## Key Features

### 1. **Approval Chain Configuration**
Define the exact order in which timesheets must be approved:

```
Contractor → Company (Project Manager) → Agency (Creative Director) → Client (Finance Team)
```

Each party in the chain can have:
- **Approval rights**: Can they approve timesheets?
- **Rate visibility**: Can they see contractor rates?
- **Edit permissions**: Can they modify timesheet entries?
- **Notification settings**: Where to send approval notifications

### 2. **Contract Management**
Create and manage contracts for each contractor working on the project:

- **Contractor Information**: Name, role (Individual Contributor, Company Employee, Agency Contractor)
- **Contract Type**: Hourly, Daily, or Fixed Price
- **Rate Settings**: Define rates and control who can see them
- **Contract Period**: Start and end dates
- **Notes**: Additional context or terms

### 3. **Rate Visibility Control**
Fine-grained control over who can see what:

- Hide specific contractor rates from specific parties
- Example: Agency might see hours but not the markup the company charges
- Example: Client sees final invoice amount but not individual contractor rates

### 4. **Project Settings**

#### Sequential Approval
- **ON**: Approvals must happen in the exact order defined in the chain
- **OFF**: Any approver can approve at any time (parallel approval)

#### Bulk Approval
- Allow approvers to select and approve multiple timesheets at once
- Speeds up approval workflows for high-volume projects

#### Auto-Approve Threshold
- Automatically approve timesheets under a certain hour threshold
- Example: Auto-approve anything under 40 hours per week

#### Monthly Invoicing
- Group weekly timesheets into monthly invoices
- While tracking weekly granularity internally

## How It Works

### Creating a Project

1. **Navigate to Projects**: Click "📋 Projects" in the dev nav
2. **Click "New Project"**: Opens the Project Configuration Drawer
3. **Fill in Basic Info**:
   - Project name
   - Description

### Setting Up the Approval Chain

1. **Go to "Approval Chain" tab**
2. **Click "Add Party"** for each entity in the chain
3. **Configure each party**:
   - Select party type (Client, Agency, Company, Contractor)
   - Enter organization name
   - Specify role/title
   - Set permissions (Can Approve, Can View Rates, Can Edit)
   - Add notification email

4. **Review the flow diagram** at the top showing the approval path

### Adding Contractors

1. **Go to "Contracts" tab**
2. **Click "Add Contract"** for each contractor
3. **Configure the contract**:
   - Contractor name
   - Contractor role
   - Contract type and rate
   - Start/end dates
   - Notes

4. **Configure rate visibility**:
   - Check which parties should NOT see this contractor's rate
   - Useful for maintaining competitive pricing and markup privacy

### Configuring Settings

1. **Go to "Settings" tab**
2. **Choose approval workflow type**:
   - Sequential (strict order) vs. Parallel (any order)
3. **Enable/disable bulk approval**
4. **Set auto-approve threshold** if desired
5. **Choose invoicing frequency** (weekly vs. monthly)

## Real-World Example

### Scenario: Mobile App Redesign Project

**Project**: Mobile App Redesign  
**Client**: Retail Co (end client paying for the work)  
**Agency**: Design Agency (managing the project)  
**Company**: Tech Corp (providing developers)  
**Contractors**: 2 developers from Tech Corp

#### Approval Chain Setup:

1. **Tech Corp Project Manager**
   - Type: Company
   - Can Approve: ✓
   - Can View Rates: ✓
   - Can Edit: ✓
   - Role: First-level approval, verifies hours are correct

2. **Design Agency Creative Director**
   - Type: Agency
   - Can Approve: ✓
   - Can View Rates: ✗ (only sees hours, not individual rates)
   - Can Edit: ✗
   - Role: Second-level approval, ensures work aligns with client needs

3. **Retail Co Finance Team**
   - Type: Client
   - Can Approve: ✓
   - Can View Rates: ✗ (only sees final invoice amount)
   - Can Edit: ✗
   - Role: Final approval for payment

#### Contracts Setup:

**Contract 1: Sarah Johnson**
- Role: Individual Contributor
- Type: Hourly
- Rate: $150/hour
- Hide Rate From: Design Agency, Retail Co

**Contract 2: Mike Chen**
- Role: Individual Contributor  
- Type: Hourly
- Rate: $125/hour
- Hide Rate From: Design Agency, Retail Co

#### Settings:
- Sequential Approval: ON (must go Company → Agency → Client)
- Bulk Approval: ON (each approver can approve multiple weeks at once)
- Auto-Approve Threshold: None
- Monthly Invoicing: ON (invoices generated monthly)

## Workflow Flow

### 1. Contractor Submits Timesheet
Sarah logs 40 hours for the week and submits her timesheet.

### 2. First Approval: Tech Corp PM
- Sees: Hours, tasks, rate ($150/hr), total amount ($6,000)
- Reviews: Accuracy of hours and task descriptions
- Action: Approves

### 3. Second Approval: Agency Creative Director
- Sees: Hours, tasks, contractor name
- Does NOT see: Individual rate
- Reviews: Work aligns with project deliverables
- Action: Approves

### 4. Final Approval: Retail Co Finance
- Sees: Total invoice amount for the month
- Does NOT see: Individual contractor rates or markup
- Reviews: Budget alignment
- Action: Approves and processes payment

## Data Model

### ProjectConfiguration
```typescript
{
  id: string
  name: string
  description?: string
  approvalChain: ApprovalChainParty[]
  contracts: ProjectContractConfig[]
  settings: ProjectSettings
  createdAt: string
  status: 'active' | 'archived' | 'draft'
}
```

### ApprovalChainParty
```typescript
{
  id: string
  type: 'client' | 'agency' | 'company' | 'contractor'
  organizationId?: string
  organizationName?: string
  role: string
  order: number
  canApprove: boolean
  canViewRates: boolean
  canEditTimesheets: boolean
  notificationEmail?: string
}
```

### ProjectContractConfig
```typescript
{
  id: string
  contractorId: string
  contractorName: string
  contractorRole: 'individual_contributor' | 'company_employee' | 'agency_contractor'
  contractType: 'hourly' | 'daily' | 'fixed'
  hourlyRate?: number
  dailyRate?: number
  fixedAmount?: number
  hideRateFrom: string[] // Party IDs who can't see the rate
  startDate: string
  endDate?: string
  notes?: string
}
```

## Next Steps

Once a project is configured, it will:

1. **Generate the approval queue** based on the chain
2. **Control data visibility** based on permissions
3. **Route timesheets** through the approval flow
4. **Send notifications** to the right people at the right time
5. **Generate invoices** with appropriate level of detail for each party

## Integration Points

### With Approval System
The approval system will:
- Read the approval chain to determine who needs to approve
- Check permissions before showing rates
- Enforce sequential vs. parallel approval rules
- Track approval status through the chain

### With Timesheet System
The timesheet system will:
- Link entries to contracts
- Calculate amounts based on contract rates
- Apply visibility rules when displaying data
- Route submissions to the first approver in the chain

### With Invoice Generation
The invoice system will:
- Use contract rates to calculate amounts
- Apply rate visibility when generating PDFs
- Group by time period (weekly vs. monthly)
- Include appropriate detail level for each recipient

## Access the System

To try it out:
1. Open the app
2. Click "📋 Projects" in the dev navigation
3. Click "New Project"
4. Follow the three tabs: Approval Chain → Contracts → Settings

## Future Enhancements

- **Drag-and-drop reordering** of approval chain
- **Template projects** for quick setup
- **Budget tracking** against project allocation
- **Time-based rules** (e.g., auto-escalate if not approved within 48 hours)
- **Approval delegation** (temporary reassignment)
- **Multi-currency support** for international projects
