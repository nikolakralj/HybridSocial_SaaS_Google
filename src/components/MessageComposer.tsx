import { useState } from "react";
import { Send, Paperclip } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ActingAsChip } from "./ActingAsChip";

interface MessageComposerProps {
  placeholder?: string;
  onSend?: (message: string) => void;
}

export function MessageComposer({
  placeholder = "Type your message...",
  onSend,
}: MessageComposerProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend?.(message);
      setMessage("");
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm text-muted-foreground">Sending as</span>
        <ActingAsChip />
      </div>

      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={placeholder}
        className="min-h-[120px] mb-3 resize-none"
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            handleSend();
          }
        }}
      />

      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" className="gap-2 h-9">
          <Paperclip className="w-4 h-4" />
          Attach
        </Button>

        <Button
          onClick={handleSend}
          disabled={!message.trim()}
          className="bg-accent-brand hover:bg-accent-brand-hover gap-2 h-9"
        >
          <Send className="w-4 h-4" />
          Send
        </Button>
      </div>
    </div>
  );
}
