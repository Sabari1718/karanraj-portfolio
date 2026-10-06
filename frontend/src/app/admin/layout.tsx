"use client";

import "./admin.css";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LogOut,
  LayoutDashboard,
  Folder,
  Briefcase,
  GraduationCap,
  Award,
  MessageSquare,
  ImageIcon,
  Menu,
  X,
  ChevronRight,
  Settings,
  ExternalLink,
  Database,
  Activity,
} from "lucide-react";
import { PortfolioAPI, getFileUrl } from "@/services/api";
import { Profile } from "@/types";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem("token");
    if (!token || token === "undefined" || token === "null") {
      localStorage.removeItem("token");
      router.push("/login");
      return;
    }

    const checkAuth = async () => {
      try {
        const authRes = await PortfolioAPI.getCurrentUser();
        if (!authRes.success) {
          localStorage.removeItem("token");
          router.push("/login?expired=true");
          return;
        }
        setIsAuthenticated(true);
        fetchProfile();
      } catch {
        setIsAuthenticated(true);
        fetchProfile();
      }
    };

    checkAuth();
  }, [router]);

  const fetchProfile = async () => {
    try {
      const res = await PortfolioAPI.getProfile();
      if (res.success && res.data) {
        setProfile(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch profile for sidebar", err);
    }
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  if (!isClient || !isAuthenticated) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-loading-inner">
          <div className="admin-loading-logo">K</div>
          <p className="admin-loading-text">INITIALIZING...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="admin-shell">
      {/* Subtle background glows — pointer-events none so they never block clicks */}
      <div className="admin-bg-glow admin-bg-glow-1" />
      <div className="admin-bg-glow admin-bg-glow-2" />

      {/* ── SIDEBAR ────────────────────────────────────────────── */}
      <aside className={`admin-sidebar ${isMobileMenuOpen ? "admin-sidebar--open" : ""}`}>
        {/* Brand */}
        <div className="admin-sidebar__brand">
          <Link href="/admin" className="admin-brand-link">
            <div className="admin-brand-logo">K</div>
            <div className="admin-brand-text">
              <div className="admin-brand-name-row">
                <span className="admin-brand-name">KARANRAJ</span>
                <span className="admin-brand-badge">SEC</span>
              </div>
              <span className="admin-brand-sub">SecOps Control Panel</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="admin-sidebar__nav">
          <SidebarLink href="/admin" currentPath={pathname} icon={<LayoutDashboard size={16} />} text="Dashboard" />

          <div className="admin-nav-section-label">Content &amp; Media</div>
          <SidebarLink href="/admin/profile" currentPath={pathname} icon={<Settings size={16} />} text="Profile Settings" />
          <SidebarLink href="/admin/profile/photo" currentPath={pathname} icon={<ImageIcon size={16} />} text="Profile Photo" />
          <SidebarLink href="/admin/projects" currentPath={pathname} icon={<Folder size={16} />} text="Projects" />
          <SidebarLink href="/admin/experience" currentPath={pathname} icon={<Briefcase size={16} />} text="Experience" />
          <SidebarLink href="/admin/education" currentPath={pathname} icon={<GraduationCap size={16} />} text="Education" />
          <SidebarLink href="/admin/skills" currentPath={pathname} icon={<Award size={16} />} text="Skills Arsenal" />

          <div className="admin-nav-section-label">Preferences</div>
          <SidebarLink href="/admin/navbar" currentPath={pathname} icon={<Menu size={16} />} text="Navigation Bar" />
          <SidebarLink href="/admin/messages" currentPath={pathname} icon={<MessageSquare size={16} />} text="Client Messages" />
        </nav>

        {/* User footer */}
        <div className="admin-sidebar__footer">
          <div className="admin-user-row">
            <div className="admin-user-avatar-wrap">
              <img
                src={
                  getFileUrl(profile?.profile_image) ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || "K")}&background=05070a&color=00FF9D&size=100`
                }
                alt="Admin"
                className="admin-user-avatar"
              />
              <span className="admin-user-online" />
            </div>
            <div className="admin-user-info">
              <p className="admin-user-name">{profile?.name || "Karanraj"}</p>
              <p className="admin-user-role">karanraj@portfolio</p>
            </div>
          </div>
          <button onClick={handleLogout} className="admin-logout-btn">
            <LogOut size={14} />
            <span>Logout Session</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div className="admin-mobile-overlay" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* ── MAIN COLUMN ────────────────────────────────────────── */}
      <div className="admin-main-col">

        {/* ── TOP HEADER ─────────────────────────────────── */}
        <header className="admin-topbar">
          {/* Mobile: hamburger + logo */}
          <button className="admin-topbar__hamburger" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="admin-topbar__mobile-brand md:hidden">
            <div className="admin-brand-logo admin-brand-logo--sm">K</div>
            <span className="admin-brand-name">KARANRAJ</span>
          </div>

          {/* Desktop: status badges */}
          <div className="admin-topbar__status">
            <span className="admin-status-badge admin-status-badge--green">
              <Activity size={11} />
              <span>Production Active</span>
            </span>
            <span className="admin-topbar__divider" />
            <span className="admin-status-badge admin-status-badge--blue">
              <Database size={11} />
              <span>MySQL Cloud</span>
            </span>
          </div>

          {/* Desktop: view site button */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-topbar__live-btn"
          >
            <span>View Live Site</span>
            <ExternalLink size={13} />
          </a>
        </header>

        {/* ── PAGE CONTENT ─────────────────────────────────── */}
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}

/* ── SidebarLink ─────────────────────────────────────────────────── */
function SidebarLink({
  href,
  currentPath,
  icon,
  text,
}: {
  href: string;
  currentPath: string | null;
  icon: React.ReactNode;
  text: string;
}) {
  const isExactMatch = currentPath === href;
  const isSubMatch =
    href !== "/admin" &&
    href !== "/admin/profile" &&
    currentPath?.startsWith(href + "/");
  const isActive = isExactMatch || isSubMatch;

  return (
    <Link href={href} className={`admin-nav-item ${isActive ? "admin-nav-item--active" : ""}`}>
      <span className="admin-nav-item__icon">{icon}</span>
      <span className="admin-nav-item__text">{text}</span>
      {isActive && <ChevronRight size={13} className="admin-nav-item__chevron" />}
    </Link>
  );
}
