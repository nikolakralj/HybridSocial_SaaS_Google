import { Search, Plus, Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useEffect, useState } from "react";

interface AppHeaderProps {
  currentPage?: string;
}

export function AppHeader({ currentPage = "Dashboard" }: AppHeaderProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check system preference on mount
    const isDarkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left: Logo/Brand */}
        <div className="flex items-center gap-8">
          <h2 className="m-0">WorkGraph</h2>

          {/* Global Search */}
          <div className="relative w-96 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search projects, people, contracts... (⌘K)"
              className="pl-10 bg-input-background border-border"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          <Button className="bg-accent-brand hover:bg-accent-brand-hover gap-2">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-0 bg-transparent border-0 cursor-pointer">
                <Avatar className="w-9 h-9">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">John Doe</p>
                  <p className="text-sm text-muted-foreground">john@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Appearance</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex items-center gap-1 px-6 pb-2">
        {[
          "Dashboard",
          "Recruit",
          "Deliver",
          "Contracts",
          "Finance",
          "Messages",
          "Network",
        ].map((item) => (
          <button
            key={item}
            className={`px-4 py-2 rounded-lg transition-colors border-0 ${
              currentPage === item
                ? "bg-accent text-foreground font-medium"
                : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-accent/50"
            }`}
          >
            {item}
          </button>
        ))}
      </nav>
    </header>
  );
}
