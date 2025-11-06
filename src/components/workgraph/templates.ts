import type { BaseNode, BaseEdge } from '../../types/workgraph';

export interface WorkGraphTemplate {
  id: string;
  name: string;
  description: string;
  nodes: BaseNode[];
  edges: BaseEdge[];
}

export const TEMPLATES: WorkGraphTemplate[] = [
  {
    id: 'staff-aug-4-party',
    name: 'Staff Aug 4-Party',
    description: 'Contractor → Company → Agency → Client with 3-step approval and rate hiding',
    nodes: [
      {
        id: 'contractor-1',
        type: 'party',
        position: { x: 100, y: 300 },
        data: {
          name: 'John Smith (Contractor)',
          partyType: 'contractor',
          role: 'Senior Developer',
          canApprove: false,
          canViewRates: true,
          canEditTimesheets: true,
        },
      },
      {
        id: 'company-1',
        type: 'party',
        position: { x: 350, y: 300 },
        data: {
          name: 'DevShop Inc',
          partyType: 'company',
          role: 'Vendor',
          canApprove: true,
          canViewRates: true,
          canEditTimesheets: false,
        },
      },
      {
        id: 'agency-1',
        type: 'party',
        position: { x: 600, y: 300 },
        data: {
          name: 'TechStaff Agency',
          partyType: 'agency',
          role: 'Staffing Partner',
          canApprove: true,
          canViewRates: false, // Hidden!
          canEditTimesheets: false,
        },
      },
      {
        id: 'client-1',
        type: 'party',
        position: { x: 850, y: 300 },
        data: {
          name: 'Global Corp',
          partyType: 'client',
          role: 'End Client',
          canApprove: true,
          canViewRates: false, // Hidden!
          canEditTimesheets: false,
        },
      },
      {
        id: 'contract-1',
        type: 'contract',
        position: { x: 225, y: 100 },
        data: {
          name: 'Contractor Rate Card',
          contractType: 'hourly',
          hourlyRate: 125,
          currency: 'USD',
          startDate: '2025-01-01',
          status: 'active',
          visibility: {
            hideRateFrom: ['agency-1', 'client-1'], // Agency & Client can't see rate
            hideTermsFrom: [],
          },
        },
      },
    ],
    edges: [
      // Approval chain: Company → Agency → Client
      {
        id: 'approval-1',
        type: 'approves',
        source: 'contractor-1',
        target: 'company-1',
        data: {
          edgeType: 'approves',
          order: 1,
          required: true,
        },
      },
      {
        id: 'approval-2',
        type: 'approves',
        source: 'company-1',
        target: 'agency-1',
        data: {
          edgeType: 'approves',
          order: 2,
          required: true,
        },
      },
      {
        id: 'approval-3',
        type: 'approves',
        source: 'agency-1',
        target: 'client-1',
        data: {
          edgeType: 'approves',
          order: 3,
          required: true,
        },
      },
      // Contractor works under contract
      {
        id: 'works-1',
        type: 'worksOn',
        source: 'contractor-1',
        target: 'contract-1',
        data: {
          edgeType: 'worksOn',
        },
      },
    ],
  },
  {
    id: 'simple-agency',
    name: 'Simple Agency Model',
    description: 'Freelancer → Agency → Client with 2-step approval',
    nodes: [
      {
        id: 'freelancer-1',
        type: 'party',
        position: { x: 150, y: 250 },
        data: {
          name: 'Sarah Johnson',
          partyType: 'freelancer',
          role: 'UX Designer',
          canApprove: false,
          canViewRates: true,
          canEditTimesheets: true,
        },
      },
      {
        id: 'agency-2',
        type: 'party',
        position: { x: 450, y: 250 },
        data: {
          name: 'Creative Agency',
          partyType: 'agency',
          role: 'Agency PM',
          canApprove: true,
          canViewRates: true,
          canEditTimesheets: false,
        },
      },
      {
        id: 'client-2',
        type: 'party',
        position: { x: 750, y: 250 },
        data: {
          name: 'Brand Corp',
          partyType: 'client',
          role: 'Client PM',
          canApprove: true,
          canViewRates: false,
          canEditTimesheets: false,
        },
      },
      {
        id: 'contract-2',
        type: 'contract',
        position: { x: 300, y: 80 },
        data: {
          name: 'Design Services Contract',
          contractType: 'daily',
          dailyRate: 800,
          currency: 'USD',
          startDate: '2025-01-01',
          status: 'active',
          visibility: {
            hideRateFrom: ['client-2'],
            hideTermsFrom: [],
          },
        },
      },
    ],
    edges: [
      {
        id: 'approval-4',
        type: 'approves',
        source: 'freelancer-1',
        target: 'agency-2',
        data: {
          edgeType: 'approves',
          order: 1,
          required: true,
        },
      },
      {
        id: 'approval-5',
        type: 'approves',
        source: 'agency-2',
        target: 'client-2',
        data: {
          edgeType: 'approves',
          order: 2,
          required: true,
        },
      },
      {
        id: 'works-2',
        type: 'worksOn',
        source: 'freelancer-1',
        target: 'contract-2',
        data: {
          edgeType: 'worksOn',
        },
      },
      {
        id: 'subcontract-1',
        type: 'subcontracts',
        source: 'agency-2',
        target: 'freelancer-1',
        data: {
          edgeType: 'subcontracts',
          role: 'sub',
          markup: 25,
        },
      },
    ],
  },
  {
    id: 'direct-hire',
    name: 'Direct Hire',
    description: 'Simple contractor → company relationship',
    nodes: [
      {
        id: 'contractor-2',
        type: 'party',
        position: { x: 200, y: 250 },
        data: {
          name: 'Mike Chen',
          partyType: 'contractor',
          role: 'DevOps Engineer',
          canApprove: false,
          canViewRates: true,
          canEditTimesheets: true,
        },
      },
      {
        id: 'company-2',
        type: 'party',
        position: { x: 550, y: 250 },
        data: {
          name: 'Startup Inc',
          partyType: 'company',
          role: 'Engineering Manager',
          canApprove: true,
          canViewRates: true,
          canEditTimesheets: false,
        },
      },
      {
        id: 'contract-3',
        type: 'contract',
        position: { x: 375, y: 80 },
        data: {
          name: 'DevOps Contract',
          contractType: 'hourly',
          hourlyRate: 150,
          currency: 'USD',
          startDate: '2025-01-01',
          status: 'active',
          visibility: {
            hideRateFrom: [],
            hideTermsFrom: [],
          },
        },
      },
    ],
    edges: [
      {
        id: 'approval-6',
        type: 'approves',
        source: 'contractor-2',
        target: 'company-2',
        data: {
          edgeType: 'approves',
          order: 1,
          required: true,
        },
      },
      {
        id: 'works-3',
        type: 'worksOn',
        source: 'contractor-2',
        target: 'contract-3',
        data: {
          edgeType: 'worksOn',
        },
      },
    ],
  },
];
