import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Building2, Search, Check } from 'lucide-react';

// Mock company data - in real app, this would come from API
const MOCK_COMPANIES = [
  {
    id: 'org-1',
    name: 'Acme Corporation',
    type: 'company' as const,
    logo: '🏢',
  },
  {
    id: 'org-2',
    name: 'TechStart Agency',
    type: 'agency' as const,
    logo: '🚀',
  },
  {
    id: 'org-3',
    name: 'Global Clients Inc',
    type: 'client' as const,
    logo: '🌍',
  },
  {
    id: 'org-4',
    name: 'DevShop Studios',
    type: 'company' as const,
    logo: '💻',
  },
  {
    id: 'org-5',
    name: 'Freelance Collective',
    type: 'freelancer' as const,
    logo: '👥',
  },
];

interface CompanySearchDialogProps {
  open: boolean;
  onSelect: (company: { id: string; name: string; type: string; logo: string }) => void;
  onClose: () => void;
}

export function CompanySearchDialog({ open, onSelect, onClose }: CompanySearchDialogProps) {
  const [search, setSearch] = useState('');

  const filteredCompanies = MOCK_COMPANIES.filter((company) =>
    company.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Attach Existing Company</DialogTitle>
          <DialogDescription>
            Search and select a company from your organizations to link to this party node.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search your companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              className="pl-9"
            />
          </div>

          {/* Results */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {filteredCompanies.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Building2 className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No companies found</p>
              </div>
            ) : (
              filteredCompanies.map((company) => (
                <button
                  key={company.id}
                  onClick={() => {
                    onSelect(company);
                    onClose();
                  }}
                  className="w-full p-3 rounded-lg border hover:border-blue-500 hover:bg-blue-50 transition-colors text-left flex items-center gap-3 group"
                >
                  <div className="text-2xl">{company.logo}</div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{company.name}</div>
                    <Badge variant="outline" className="capitalize mt-1">
                      {company.type}
                    </Badge>
                  </div>
                  <Check className="h-5 w-5 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))
            )}
          </div>

          {/* Create new */}
          <div className="pt-2 border-t">
            <Button variant="outline" onClick={onClose} className="w-full">
              <Building2 className="h-4 w-4 mr-2" />
              Create New Company Instead
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
