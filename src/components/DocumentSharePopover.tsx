import { useState } from "react";
import { Globe, Building2, Lock, Copy, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { toast } from "sonner@2.0.3";

interface DocumentSharePopoverProps {
  documentName: string;
  trigger?: React.ReactNode;
}

export function DocumentSharePopover({ documentName, trigger }: DocumentSharePopoverProps) {
  const [shareLevel, setShareLevel] = useState<"private" | "org" | "public">("private");
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://workgraph.com/documents/${documentName}`);
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="h-8 gap-1.5">
            {shareLevel === "public" && <Globe className="w-4 h-4" />}
            {shareLevel === "org" && <Building2 className="w-4 h-4" />}
            {shareLevel === "private" && <Lock className="w-4 h-4" />}
            Share
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div>
            <h4 className="m-0 mb-1">Share "{documentName}"</h4>
            <p className="text-sm text-muted-foreground m-0">
              Choose who can view this document
            </p>
          </div>

          <RadioGroup value={shareLevel} onValueChange={(value) => setShareLevel(value as any)}>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="private" id="private" className="mt-0.5" />
                <div className="flex-1">
                  <Label htmlFor="private" className="cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <Lock className="w-4 h-4" />
                      <span className="font-medium">Private</span>
                    </div>
                    <p className="text-xs text-muted-foreground m-0">
                      Only you can view this document
                    </p>
                  </Label>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="org" id="org" className="mt-0.5" />
                <div className="flex-1">
                  <Label htmlFor="org" className="cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className="w-4 h-4" />
                      <span className="font-medium">Share with organization</span>
                    </div>
                    <p className="text-xs text-muted-foreground m-0">
                      Companies you work with can view
                    </p>
                  </Label>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="public" id="public" className="mt-0.5" />
                <div className="flex-1">
                  <Label htmlFor="public" className="cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <Globe className="w-4 h-4" />
                      <span className="font-medium">Public link</span>
                    </div>
                    <p className="text-xs text-muted-foreground m-0">
                      Anyone with the link can view
                    </p>
                  </Label>
                </div>
              </div>
            </div>
          </RadioGroup>

          {(shareLevel === "public" || shareLevel === "org") && (
            <div className="pt-3 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2 min-h-[44px]"
                onClick={handleCopyLink}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-success" />
                    Link copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy link
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
