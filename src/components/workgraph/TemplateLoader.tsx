import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { FileText, Users, Building2, Zap } from 'lucide-react';
import { TEMPLATES } from './templates';

interface TemplateLoaderProps {
  onLoad: (templateId: string) => void;
}

export function TemplateLoader({ onLoad }: TemplateLoaderProps) {
  const [open, setOpen] = useState(false);

  const getIcon = (templateId: string) => {
    if (templateId.includes('staff-aug')) return <Users className="h-6 w-6 text-blue-600" />;
    if (templateId.includes('agency')) return <Building2 className="h-6 w-6 text-purple-600" />;
    if (templateId.includes('direct')) return <Zap className="h-6 w-6 text-green-600" />;
    return <FileText className="h-6 w-6 text-gray-600" />;
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-2"
      >
        <FileText className="h-4 w-4" />
        Load Template
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Load Template</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-4">
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => {
                  onLoad(template.id);
                  setOpen(false);
                }}
                className="w-full p-4 rounded-lg border-2 hover:border-blue-500 hover:bg-blue-50 transition-colors text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(template.id)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 mb-1">
                      {template.name}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      {template.description}
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        {template.nodes.length} nodes
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {template.edges.length} edges
                      </Badge>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg">
            💡 <strong>Pro tip:</strong> Templates are great starting points. After loading,
            customize nodes and edges to match your specific workflow.
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
