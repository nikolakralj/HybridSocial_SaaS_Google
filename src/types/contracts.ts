// Contract Types for Multi-Layer Rate Chain
// Supports: Individual → Company → Agency → Client

export interface Contract {
  id: string;
  projectId: string;
  
  // Parties
  providerId: string;      // User/Org providing service
  providerType: 'individual' | 'company' | 'agency';
  providerName: string;    // e.g., "Sarah Chen", "Acme Corp"
  
  recipientId: string;     // User/Org receiving/paying
  recipientType: 'company' | 'agency' | 'client';
  recipientName: string;   // e.g., "Acme Corp", "TechStaff Agency"
  
  // Financial terms
  baseHourlyRate: number;
  workTypeRates: {
    regular: number;       // e.g., 60
    travel: number;        // e.g., 30 (50% of regular)
    overtime: number;      // e.g., 90 (1.5x regular)
    oncall: number;        // e.g., 45 (0.75x regular)
  };
  
  // Metadata
  contractNumber?: string; // e.g., "IND-2025-001"
  currency: 'USD' | 'EUR' | 'GBP';
  billingCycle: 'weekly' | 'biweekly' | 'monthly';
  status: 'draft' | 'active' | 'expired' | 'terminated';
  effectiveDate: Date;
  expirationDate?: Date;
  
  // Visibility & permissions
  hideRateFromProvider: boolean;   // Provider can't see recipient's markup
  hideRateFromRecipient: boolean;  // Recipient can't see provider's cost
  
  createdBy: string;
  createdAt: Date;
}

export interface ContractWithMetrics extends Contract {
  // Runtime metrics
  totalHoursThisMonth?: number;
  totalAmountThisMonth?: number;
  lastInvoiceDate?: Date;
}
