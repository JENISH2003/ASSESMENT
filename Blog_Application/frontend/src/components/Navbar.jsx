import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PenSquare, Shield, User as UserIcon, LogOut, LogIn, UserPlus, Menu, X, PowerOff } from "lucide-react";
import { cn } from "../lib/utils";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { user, logout, logoutAllDevices } = useAuth() || { user: null, logout: () => {}, logoutAllDevices: () => {} };
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

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
                  className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
                >
                  <PenSquare className="w-4 h-4" />
                  <span className="text-sm font-medium">Write</span>
                </Link>
                {user.role === "superadmin" && (
                  <Link
                    to="/superadmin/users"
                    className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-full border border-primary/50 text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                  >
                    <Shield className="w-4 h-4" />
                    <span className="text-sm font-medium">Manage Users</span>
                  </Link>
                )}
                <div className="hidden md:flex items-center space-x-3 ml-4 border-l border-border/50 pl-4">
                  <Link
                    to="/dashboard"
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-secondary-foreground hover:ring-2 hover:ring-primary/30 transition-all cursor-pointer"
                    title="Profile"
                  >
                    <UserIcon className="w-4 h-4" />
                  </Link>
                  <div className="relative group">
                    <button
                      className="text-muted-foreground hover:text-destructive transition-colors cursor-pointer p-2 flex items-center gap-1"
                      title="Logout Options"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-56 bg-background/95 backdrop-blur-md border border-border/50 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden transform origin-top-right scale-95 group-hover:scale-100">
                      <div className="py-1.5 flex flex-col">
                        <button
                          onClick={logout}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors text-left w-full"
                        >
                          <LogOut className="w-4 h-4 text-muted-foreground" /> Logout 
                        </button>
                        <button
                          onClick={logoutAllDevices}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors text-left w-full"
                        >
                          <PowerOff className="w-4 h-4" /> Logout from all devices
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
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

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-muted-foreground hover:text-foreground p-2 focus:outline-none"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 h-[calc(100vh-4rem)] bg-background/95 backdrop-blur-xl animate-fade-in z-40 overflow-y-auto shadow-2xl border-t border-border/40">
          <div className="px-6 py-8 space-y-2 max-w-sm mx-auto">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200",
                  location.pathname === link.path
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                )}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="pt-4 mt-4 border-t border-border/50 space-y-2">
              {user ? (
                <>
                  <Link
                    to="/create"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-all"
                  >
                    <PenSquare className="w-5 h-5" /> Write New Post
                  </Link>
                  {user.role === "superadmin" && (
                    <Link
                      to="/superadmin/users"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium border border-primary/50 text-primary hover:bg-primary/10 transition-all"
                    >
                      <Shield className="w-5 h-5" /> Manage Users
                    </Link>
                  )}
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                  >
                    <UserIcon className="w-5 h-5" /> My Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-destructive hover:bg-destructive/10 transition-all text-left"
                  >
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                  <button
                    onClick={() => {
                      logoutAllDevices();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-destructive hover:bg-destructive/10 transition-all text-left"
                  >
                    <PowerOff className="w-5 h-5" /> Logout All Devices
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 px-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 text-base font-medium text-foreground bg-secondary hover:bg-secondary/80 rounded-xl transition-all"
                  >
                    <LogIn className="w-5 h-5" /> Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 text-base font-medium bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all"
                  >
                    <UserPlus className="w-5 h-5" /> Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
