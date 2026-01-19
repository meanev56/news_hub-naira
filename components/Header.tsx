"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Menu,
  X,
  ChevronDown,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  LogOut,
} from "lucide-react";
import { navigationItems, NavItem } from "@/services/api";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<{ email: string; id: string } | null>(null);

  const router = useRouter();

  // Fetch current user on mount
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user || null));
  }, []);

  // Handle logout
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-header-dark py-2">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            {!user && (
              <>
                <Link
                  href="/login"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Login
                </Link>
                <span className="text-primary-foreground/50">|</span>
                <Link
                  href="/register"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Register
                </Link>
              </>
            )}

            {user && (
              <div className="flex items-center gap-2">
                <span className="text-primary-foreground/90 font-medium">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-red-500 hover:text-red-600"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <SocialLink href="https://facebook.com/nairametrics" icon={Facebook} />
            <SocialLink href="https://twitter.com/nairametrics" icon={Twitter} />
            <SocialLink href="https://youtube.com/nairametrics" icon={Youtube} />
            <SocialLink href="https://linkedin.com/company/nairametrics" icon={Linkedin} />
          </div>
        </div>
      </div>

      {/* Logo */}
      <div className="bg-header py-6">
        <div className="container">
          <Link href="/" className="block text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground tracking-wide">
              Nairametrics
            </h1>
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-header border-t border-primary-foreground/20">
        <div className="container flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-3 text-primary-foreground"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center">
            {navigationItems.map((item) => (
              <NavItemDesktop key={item.slug || "home"} item={item} />
            ))}
          </ul>

          {/* Search */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-3 text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-header border-t border-primary-foreground/20 animate-fade-in">
            <ul className="py-2">
              {navigationItems.map((item) => (
                <NavItemMobile key={item.slug || "home"} item={item} onClose={() => setIsMenuOpen(false)} />
              ))}
            </ul>
          </div>
        )}

        {/* Search Overlay */}
        {isSearchOpen && (
          <div className="absolute left-0 right-0 top-full bg-white shadow-lg animate-fade-in">
            <div className="container py-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="search-input flex-1"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="p-3 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

/* ----------- Supporting Components ----------- */

function SocialLink({
  href,
  icon: Icon,
}: {
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
    >
      <Icon className="w-4 h-4" />
    </a>
  );
}

function NavItemDesktop({ item }: { item: NavItem }) {
  const hasChildren = !!item.children?.length;

  return (
    <li className="relative group">
      <Link
        href={item.path}
        className="flex items-center gap-1 px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
      >
        {item.label}
        {hasChildren && <ChevronDown className="w-3 h-3" />}
      </Link>

      {hasChildren && (
        <ul className="absolute left-0 top-full opacity-0 invisible group-hover:opacity-100 group-hover:visible bg-header-dark shadow-md transition-opacity">
          {item.children!.map((child) => (
            <li key={child.slug}>
              <Link
                href={child.path}
                className="block px-4 py-2 text-sm text-primary-foreground/80 hover:text-primary-foreground hover:bg-header/10 transition-colors"
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function NavItemMobile({ item, onClose }: { item: NavItem; onClose: () => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = !!item.children?.length;

  return (
    <li>
      <div className="flex items-center justify-between">
        <Link
          href={item.path}
          onClick={onClose}
          className="flex-1 px-4 py-3 text-sm font-medium text-primary-foreground"
        >
          {item.label}
        </Link>

        {hasChildren && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-3 text-primary-foreground"
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            />
          </button>
        )}
      </div>

      {hasChildren && isExpanded && (
        <ul className="bg-header-dark">
          {item.children!.map((child) => (
            <li key={child.slug}>
              <Link
                href={child.path}
                onClick={onClose}
                className="block px-8 py-2 text-sm text-primary-foreground/80 hover:text-primary-foreground"
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}