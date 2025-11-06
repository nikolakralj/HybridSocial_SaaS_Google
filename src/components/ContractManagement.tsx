import { useState } from "react";
import { FileText, Download, Eye, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner@2.0.3";

type ContractType = "msa" | "sow" | "placement_agreement" | "nda";
type ContractStatus = "draft" | "pending_signature" | "signed" | "active" | "expired";

interface Contract {
  id: string;
  type: ContractType;
  name: string;
  status: ContractStatus;
  parties: string[];
  startDate?: string;
  endDate?: string;
  value?: string;
  signedBy?: string[];
  createdAt: string;
  createdBy: string;
}

interface ContractManagementProps {
  dealId?: string;
  contracts?: Contract[];
  onCreateContract?: (contract: Partial<Contract>) => void;
}

export function ContractManagement({ dealId, contracts = [], onCreateContract }: ContractManagementProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newContract, setNewContract] = useState<Partial<Contract>>({
    type: "sow",
    status: "draft",
    parties: []
  });

  const getContractTypeLabel = (type: ContractType) => {
    switch (type) {
      case "msa": return "Master Service Agreement";
      case "sow": return "Statement of Work";
      case "placement_agreement": return "Placement Agreement";
      case "nda": return "Non-Disclosure Agreement";
      default: return type;
    }
  };

  const getStatusBadge = (status: ContractStatus) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      case "pending_signature":
        return <Badge className="bg-warning">Pending Signature</Badge>;
      case "signed":
        return <Badge className="bg-success">Signed</Badge>;
      case "active":
        return <Badge className="bg-success">Active</Badge>;
      case "expired":
        return <Badge variant="outline">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleCreateContract = () => {
    if (onCreateContract) {
      onCreateContract(newContract);
      toast.success("Contract created");
      setIsCreating(false);
      setNewContract({ type: "sow", status: "draft", parties: [] });
    }
  };

  if (isCreating) {
    return (
      <Card className="p-6">
        <h3 className="m-0 mb-6">Create New Contract</h3>
        
        <div className="space-y-4">
          <div>
            <Label>Contract Type</Label>
            <Select 
              value={newContract.type} 
              onValueChange={(value) => setNewContract({ ...newContract, type: value as ContractType })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="msa">Master Service Agreement (MSA)</SelectItem>
                <SelectItem value="sow">Statement of Work (SOW)</SelectItem>
                <SelectItem value="placement_agreement">Placement Agreement</SelectItem>
                <SelectItem value="nda">Non-Disclosure Agreement (NDA)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Contract Name</Label>
            <Input 
              placeholder="e.g., MSA-2025-001"
              value={newContract.name || ""}
              onChange={(e) => setNewContract({ ...newContract, name: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Date</Label>
              <Input 
                type="date"
                value={newContract.startDate || ""}
                onChange={(e) => setNewContract({ ...newContract, startDate: e.target.value })}
              />
            </div>
            <div>
              <Label>End Date</Label>
              <Input 
                type="date"
                value={newContract.endDate || ""}
                onChange={(e) => setNewContract({ ...newContract, endDate: e.target.value })}
              />
            </div>
          </div>
          
          {(newContract.type === "sow" || newContract.type === "placement_agreement") && (
            <div>
              <Label>Contract Value</Label>
              <Input 
                placeholder="e.g., $22,500"
                value={newContract.value || ""}
                onChange={(e) => setNewContract({ ...newContract, value: e.target.value })}
              />
            </div>
          )}
          
          <div>
            <Label>Parties (comma-separated)</Label>
            <Textarea 
              placeholder="Elite Recruiters, TechVentures Inc, Sarah Chen"
              value={newContract.parties?.join(", ") || ""}
              onChange={(e) => setNewContract({ 
                ...newContract, 
                parties: e.target.value.split(",").map(p => p.trim()) 
              })}
            />
          </div>
          
          <Separator />
          
          <div className="flex gap-2">
            <Button onClick={handleCreateContract}>Create Contract</Button>
            <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="m-0">Contracts</h3>
          <p className="text-sm text-muted-foreground m-0">
            {contracts.length} {contracts.length === 1 ? "contract" : "contracts"}
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <FileText className="w-4 h-4 mr-2" />
          Create Contract
        </Button>
      </div>
      
      {contracts.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="w-12 h-12 rounded-lg bg-accent mx-auto mb-4 flex items-center justify-center">
            <FileText className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground m-0 mb-4">No contracts yet</p>
          <Button size="sm" onClick={() => setIsCreating(true)}>Create First Contract</Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {contracts.map(contract => (
            <ContractCard key={contract.id} contract={contract} />
          ))}
        </div>
      )}
    </div>
  );
}

function ContractCard({ contract }: { contract: Contract }) {
  const getContractTypeLabel = (type: ContractType) => {
    switch (type) {
      case "msa": return "MSA";
      case "sow": return "SOW";
      case "placement_agreement": return "Placement Agreement";
      case "nda": return "NDA";
      default: return type;
    }
  };

  const getStatusBadge = (status: ContractStatus) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      case "pending_signature":
        return <Badge className="bg-warning">Pending Signature</Badge>;
      case "signed":
        return <Badge className="bg-success">Signed</Badge>;
      case "active":
        return <Badge className="bg-success">Active</Badge>;
      case "expired":
        return <Badge variant="outline">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: ContractStatus) => {
    switch (status) {
      case "draft":
        return <Clock className="w-4 h-4 text-muted-foreground" />;
      case "pending_signature":
        return <AlertCircle className="w-4 h-4 text-warning" />;
      case "signed":
      case "active":
        return <CheckCircle className="w-4 h-4 text-success" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <Card className="p-4 hover:bg-accent/50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-muted-foreground" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-medium m-0">{contract.name}</p>
              {getStatusBadge(contract.status)}
            </div>
            
            <p className="text-sm text-muted-foreground m-0 mb-2">
              {getContractTypeLabel(contract.type)}
            </p>
            
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              {contract.startDate && (
                <span>Start: {contract.startDate}</span>
              )}
              {contract.endDate && (
                <span>End: {contract.endDate}</span>
              )}
              {contract.value && (
                <span className="font-medium text-foreground">{contract.value}</span>
              )}
            </div>
            
            {contract.parties.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-2">
                {contract.parties.map((party, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {party}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => toast.success("Viewing contract")}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => toast.success("Downloading contract")}
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

// Example with sample data
export function ContractManagementExample() {
  const [contracts, setContracts] = useState<Contract[]>([
    {
      id: "1",
      type: "msa",
      name: "MSA-2025-001",
      status: "signed",
      parties: ["Elite Recruiters", "TechVentures Inc"],
      startDate: "2025-01-01",
      endDate: "2027-01-01",
      createdAt: "2025-01-15",
      createdBy: "James Wilson",
      signedBy: ["Elite Recruiters", "TechVentures Inc"]
    },
    {
      id: "2",
      type: "sow",
      name: "SOW-2025-001",
      status: "active",
      parties: ["Elite Recruiters", "TechVentures Inc", "Sarah Chen"],
      startDate: "2025-11-01",
      endDate: "2026-11-01",
      value: "$4,000/week",
      createdAt: "2025-10-21",
      createdBy: "James Wilson",
      signedBy: ["Elite Recruiters", "TechVentures Inc", "Sarah Chen"]
    },
    {
      id: "3",
      type: "placement_agreement",
      name: "Placement-RetailCo-001",
      status: "pending_signature",
      parties: ["Elite Recruiters", "RetailCo"],
      value: "$22,500",
      createdAt: "2025-10-20",
      createdBy: "James Wilson"
    }
  ]);

  const handleCreateContract = (contract: Partial<Contract>) => {
    const newContract: Contract = {
      id: String(contracts.length + 1),
      type: contract.type || "sow",
      name: contract.name || `Contract-${contracts.length + 1}`,
      status: contract.status || "draft",
      parties: contract.parties || [],
      startDate: contract.startDate,
      endDate: contract.endDate,
      value: contract.value,
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: "James Wilson"
    };
    setContracts([...contracts, newContract]);
  };

  return (
    <div className="p-6">
      <ContractManagement 
        contracts={contracts}
        onCreateContract={handleCreateContract}
      />
    </div>
  );
}
