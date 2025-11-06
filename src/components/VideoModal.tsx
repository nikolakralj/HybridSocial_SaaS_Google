import { Dialog, DialogContent } from "./ui/dialog";
import { X } from "lucide-react";

interface VideoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VideoModal({ open, onOpenChange }: VideoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden" aria-describedby="video-modal-description">
        <span id="video-modal-description" className="sr-only">
          Product demo video showing WorkGraph platform features
        </span>
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-10 rounded-full p-2 bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
          aria-label="Close video"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video container - 16:9 aspect ratio */}
        <div className="relative w-full bg-black" style={{ paddingBottom: "56.25%" }}>
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Placeholder - Replace with actual video */}
            <div className="w-full h-full bg-gradient-to-br from-accent-brand/20 to-accent-brand/5 flex items-center justify-center">
              <div className="text-center space-y-6 p-8">
                <div className="w-20 h-20 rounded-full bg-accent-brand/10 flex items-center justify-center mx-auto">
                  <svg
                    className="w-10 h-10 text-accent-brand"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2 text-foreground">Product Demo</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    See how WorkGraph connects your professional network with the tools you use to ship work.
                  </p>
                </div>
                
                {/* Feature highlights */}
                <div className="grid grid-cols-3 gap-6 pt-8 max-w-2xl mx-auto">
                  <div className="text-center">
                    <p className="text-3xl font-semibold text-accent-brand mb-1">30s</p>
                    <p className="text-sm text-muted-foreground">Quick overview</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-semibold text-accent-brand mb-1">3</p>
                    <p className="text-sm text-muted-foreground">Personas shown</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-semibold text-accent-brand mb-1">1</p>
                    <p className="text-sm text-muted-foreground">Platform</p>
                  </div>
                </div>

                {/* Actual video would go here */}
                {/* 
                <video
                  className="w-full h-full"
                  controls
                  autoPlay
                  src="/demo-video.mp4"
                >
                  Your browser does not support the video tag.
                </video>
                */}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
