import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Moon, Sun, TrendingUp, LogOut, User, BarChart3, MessageSquare } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [location, setLocation] = useLocation();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" data-testid="link-home">
              <div className="flex items-center gap-2 cursor-pointer hover-elevate px-3 py-1.5 rounded-lg transition-all">
                <TrendingUp className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">StockPulse</span>
              </div>
            </Link>

            {isAuthenticated && (
              <nav className="hidden md:flex items-center gap-1">
  <Link href="/about">
    <Button
      variant="ghost"
      size="sm"
      className={location === "/about" ? "bg-accent" : ""}
    >
      About
    </Button>
  </Link>

  {isAuthenticated && (
    <>
      <Link href="/dashboard">
        <Button
          variant="ghost"
          size="sm"
          className={location === "/dashboard" ? "bg-accent" : ""}
        >
          Dashboard
        </Button>
      </Link>
      <Link href="/reviews">
        <Button
          variant="ghost"
          size="sm"
          className={location === "/reviews" ? "bg-accent" : ""}
        >
          Reviews
        </Button>
      </Link>
      <Link href="/profile">
        <Button
          variant="ghost"
          size="sm"
          className={location === "/profile" ? "bg-accent" : ""}
        >
          Profile
        </Button>
      </Link>
    </>
  )}
</nav>

            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>

            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full" data-testid="button-user-menu">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setLocation("/profile")} data-testid="menu-profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-destructive focus:text-destructive"
                    data-testid="button-logout"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" data-testid="link-login">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" data-testid="link-signup">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
