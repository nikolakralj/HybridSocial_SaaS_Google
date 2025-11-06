import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Eye, EyeOff, Mail, Check } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { toast } from "sonner@2.0.3";

interface LoginEnhancedProps {
  onLogin: (email: string) => void;
  onClose?: () => void;
  initialMode?: "signin" | "signup";
  returningUser?: { email: string; name: string } | null;
}

export function LoginEnhanced({ 
  onLogin, 
  onClose, 
  initialMode = "signin",
  returningUser 
}: LoginEnhancedProps) {
  const [mode, setMode] = useState<"signin" | "signup" | "magic-link" | "magic-sent">(initialMode);
  const [email, setEmail] = useState(returningUser?.email || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate auth delay
    setTimeout(() => {
      if (mode === "magic-link") {
        setMode("magic-sent");
      } else {
        onLogin(email);
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleSSOLogin = (provider: string) => {
    toast.success(`Connecting with ${provider}...`);
    setTimeout(() => {
      onLogin(`user@${provider.toLowerCase()}.com`);
    }, 1000);
  };

  const subtitle = returningUser 
    ? `Welcome back, ${returningUser.name}` 
    : mode === "signup" 
    ? "Join the network. It's free." 
    : "Sign in to your account";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Brand */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-brand mb-4">
            <svg width="32" height="32" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L3 7V13L10 18L17 13V7L10 2Z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M10 10L3 7M10 10L17 7M10 10V18" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="m-0 mb-2">Welcome to WorkGraph</h1>
          <p className="text-muted-foreground m-0">{subtitle}</p>
        </div>

        {mode === "magic-sent" ? (
          <MagicLinkSent email={email} onBack={() => setMode("signin")} />
        ) : (
          <Card className="p-8">
            {/* Tabs */}
            <div className="flex gap-2 mb-6 p-1 bg-accent rounded-lg">
              <button
                onClick={() => setMode("signin")}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  mode === "signin" 
                    ? "bg-card shadow-sm text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign in
              </button>
              <button
                onClick={() => setMode("signup")}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  mode === "signup" 
                    ? "bg-card shadow-sm text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign up
              </button>
            </div>

            {/* SSO Buttons */}
            <div className="space-y-2 mb-6">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => handleSSOLogin("Google")}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleSSOLogin("GitHub")}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleSSOLogin("Apple")}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleSSOLogin("Microsoft")}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#f25022" d="M1 1h10v10H1z"/>
                    <path fill="#00a4ef" d="M13 1h10v10H13z"/>
                    <path fill="#7fba00" d="M1 13h10v10H1z"/>
                    <path fill="#ffb900" d="M13 13h10v10H13z"/>
                  </svg>
                </Button>
              </div>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">or</span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              {mode !== "magic-link" && (
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {mode === "signin" && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                      Remember me
                    </label>
                  </div>
                  <a href="#" className="text-sm text-accent-brand hover:underline">
                    Forgot password?
                  </a>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Loading..." : mode === "signup" ? "Create account" : "Sign in"}
              </Button>

              {mode === "signin" && (
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setMode("magic-link")}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email me a magic link
                </Button>
              )}
            </form>

            {/* Legal */}
            <p className="text-xs text-center text-muted-foreground mt-6 m-0">
              By continuing you agree to the{" "}
              <a href="#" className="text-accent-brand hover:underline">Terms</a>
              {" "}and{" "}
              <a href="#" className="text-accent-brand hover:underline">Privacy Policy</a>
            </p>
          </Card>
        )}

        {/* Footer link */}
        {mode !== "magic-sent" && (
          <p className="text-center text-sm text-muted-foreground m-0">
            {mode === "signin" ? (
              <>
                Don't have an account?{" "}
                <button 
                  onClick={() => setMode("signup")}
                  className="text-accent-brand hover:underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button 
                  onClick={() => setMode("signin")}
                  className="text-accent-brand hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
}

function MagicLinkSent({ email, onBack }: { email: string; onBack: () => void }) {
  const handleOpenMail = () => {
    window.open(`mailto:${email}`, "_blank");
  };

  return (
    <Card className="p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
        <Check className="w-8 h-8 text-success" />
      </div>
      
      <h2 className="m-0 mb-2">Check your email</h2>
      <p className="text-muted-foreground m-0 mb-6">
        We've sent a magic link to <span className="font-medium text-foreground">{email}</span>
      </p>

      <div className="space-y-3">
        <Button className="w-full" onClick={handleOpenMail}>
          <Mail className="w-4 h-4 mr-2" />
          Open mail app
        </Button>
        <Button variant="ghost" className="w-full" onClick={onBack}>
          Back to sign in
        </Button>
      </div>

      <p className="text-xs text-muted-foreground mt-6 m-0">
        Didn't receive the email? Check your spam folder or{" "}
        <button className="text-accent-brand hover:underline">
          resend
        </button>
      </p>
    </Card>
  );
}

// Modal version for inline use
export function LoginModal({ 
  open, 
  onOpenChange, 
  onLogin, 
  initialMode 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  onLogin: (email: string) => void;
  initialMode?: "signin" | "signup";
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Authentication</DialogTitle>
          <DialogDescription>
            Sign in to your account or create a new one to get started with WorkGraph.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[90vh] overflow-y-auto p-8">
          <LoginEnhanced 
            onLogin={onLogin} 
            onClose={() => onOpenChange(false)}
            initialMode={initialMode}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
