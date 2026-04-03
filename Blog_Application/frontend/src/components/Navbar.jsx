import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PenSquare, Shield, User as UserIcon, LogOut, LogIn, UserPlus } from "lucide-react";
import { cn } from "../lib/utils";

export default function Navbar() {
  const { user, logout } = useAuth() || { user: null, logout: () => {} };
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Blogs", path: "/blogs" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 glass border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="flex items-center gap-2 text-2xl font-heading font-bold text-gradient tracking-tight"
            >
              <img
                src="/logo.png"
                alt="BlogVerse Logo"
                className="w-8 h-8 rounded-lg shadow-sm"
              />
              BlogVerse
            </Link>
            <div className="hidden md:flex space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                    location.pathname === link.path
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/create"
                  className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
                >
                  <PenSquare className="w-4 h-4" />
                  <span className="text-sm font-medium">Write</span>
                </Link>
                {user.role === "superadmin" && (
                  <Link
                    to="/superadmin/users"
                    className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-full border border-primary/50 text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                  >
                    <Shield className="w-4 h-4" />
                    <span className="text-sm font-medium">Manage Users</span>
                  </Link>
                )}
                <div className="flex items-center space-x-3 ml-4 border-l border-border/50 pl-4">
                  <Link
                    to="/dashboard"
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-secondary-foreground hover:ring-2 hover:ring-primary/30 transition-all cursor-pointer"
                    title="Profile"
                  >
                    <UserIcon className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={logout}
                    className="text-muted-foreground hover:text-destructive transition-colors cursor-pointer p-2"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" /> Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium bg-foreground text-background rounded-full hover:bg-foreground/90 transition-colors shadow-sm cursor-pointer flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" /> Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
