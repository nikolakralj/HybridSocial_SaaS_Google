// Contract API - CRUD operations for contracts
// Supports multi-layer rate chains: Individual → Company → Agency → Client

import * as kv from '../../supabase/functions/server/kv_store';
import type { Contract } from '../../types/contracts';

/**
 * Generate unique contract ID
 */
function generateContractId(): string {
  return `contract_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Create a new contract
 */
export async function createContract(
  contract: Omit<Contract, 'id' | 'createdAt'>
): Promise<string> {
  const id = generateContractId();
  const newContract: Contract = {
    ...contract,
    id,
    createdAt: new Date(),
  };
  
  await kv.set(`contract:${id}`, newContract);
  return id;
}

/**
 * Get a single contract by ID
 */
export async function getContract(id: string): Promise<Contract | null> {
  const contract = await kv.get<Contract>(`contract:${id}`);
  return contract || null;
}

/**
 * Get all contracts for a project
 */
export async function getProjectContracts(projectId: string): Promise<Contract[]> {
  const allContracts = await kv.getByPrefix<Contract>('contract:');
  return allContracts.filter(c => c.projectId === projectId && c.status !== 'terminated');
}

/**
 * Get contract chain for a user
 * Returns all contracts in sequence: User → Company → Agency → Client
 */
export async function getContractChain(
  userId: string,
  projectId: string
): Promise<Contract[]> {
  const allContracts = await getProjectContracts(projectId);
  const chain: Contract[] = [];
  let currentProviderId = userId;
  
  // Build chain by following provider → recipient relationships
  while (true) {
    const nextContract = allContracts.find(c => c.providerId === currentProviderId);
    if (!nextContract) break;
    
    chain.push(nextContract);
    currentProviderId = nextContract.recipientId;
  }
  
  return chain;
}

/**
 * Get all contracts where user is the recipient (approver)
 */
export async function getContractsForApprover(
  userId: string,
  projectId: string
): Promise<Contract[]> {
  const allContracts = await getProjectContracts(projectId);
  return allContracts.filter(c => c.recipientId === userId);
}

/**
 * Update a contract
 */
export async function updateContract(
  id: string,
  updates: Partial<Contract>
): Promise<void> {
  const existing = await getContract(id);
  if (!existing) {
    throw new Error(`Contract ${id} not found`);
  }
  
  const updated: Contract = {
    ...existing,
    ...updates,
    id: existing.id, // Prevent ID change
    createdAt: existing.createdAt, // Prevent createdAt change
  };
  
  await kv.set(`contract:${id}`, updated);
}

/**
 * Delete a contract (soft delete by setting status to terminated)
 */
export async function deleteContract(id: string): Promise<void> {
  await updateContract(id, { status: 'terminated' });
}

/**
 * Get contracts grouped by type for a recipient (for approval queue)
 */
export async function getContractsGroupedByType(
  recipientId: string,
  projectId: string
): Promise<{
  individual: Contract[];
  company: Contract[];
  agency: Contract[];
}> {
  const contracts = await getContractsForApprover(recipientId, projectId);
  
  return {
    individual: contracts.filter(c => c.providerType === 'individual'),
    company: contracts.filter(c => c.providerType === 'company'),
    agency: contracts.filter(c => c.providerType === 'agency'),
  };
}
