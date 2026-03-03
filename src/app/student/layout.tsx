"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  SparklesIcon,
  HomeIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  GlobeAltIcon,
  ChatBubbleLeftRightIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const sidebarLinks = [
  { href: "/student/dashboard", label: "Dashboard", icon: HomeIcon },
  { href: "/student/test", label: "Take Test", icon: ClipboardDocumentListIcon },
  { href: "/student/results", label: "My Results", icon: ChartBarIcon },
  { href: "/student/careers", label: "Career Explorer", icon: GlobeAltIcon },
  { href: "/student/chat", label: "AI Counselor", icon: ChatBubbleLeftRightIcon },
  { href: "/student/profile", label: "My Profile", icon: UserCircleIcon },
];

// Bottom nav shows only the 5 most important links
const bottomNavLinks = [
  { href: "/student/dashboard", label: "Home", icon: HomeIcon },
  { href: "/student/test", label: "Test", icon: ClipboardDocumentListIcon },
  { href: "/student/results", label: "Results", icon: ChartBarIcon },
  { href: "/student/chat", label: "AI Chat", icon: ChatBubbleLeftRightIcon },
  { href: "/student/profile", label: "Profile", icon: UserCircleIcon },
];

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* ===== DESKTOP SIDEBAR (hidden on mobile) ===== */}
      <aside className="desktop-sidebar">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "0 12px",
            marginBottom: 40,
          }}
        >
          <SparklesIcon
            style={{ width: 28, height: 28, color: "var(--accent-red)" }}
          />
          <span
            className="gradient-text"
            style={{ fontSize: "1.3rem", fontWeight: 800 }}
          >
            aiGuide
          </span>
        </div>

        <nav
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {sidebarLinks.map((link) => {
            const isActive = pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`sidebar-link ${isActive ? "active" : ""}`}
              >
                <link.icon style={{ width: 20, height: 20 }} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="sidebar-link"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
            color: "var(--text-muted)",
          }}
        >
          <ArrowRightOnRectangleIcon style={{ width: 20, height: 20 }} />
          Sign Out
        </button>
      </aside>

      {/* ===== MOBILE TOP BAR (hidden on desktop) ===== */}
      <header className="mobile-topbar">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <SparklesIcon
            style={{ width: 24, height: 24, color: "var(--accent-red)" }}
          />
          <span
            className="gradient-text"
            style={{ fontSize: "1.1rem", fontWeight: 800 }}
          >
            aiGuide
          </span>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
            color: "var(--text-primary)",
          }}
        >
          {mobileMenuOpen ? (
            <XMarkIcon style={{ width: 24, height: 24 }} />
          ) : (
            <Bars3Icon style={{ width: 24, height: 24 }} />
          )}
        </button>
      </header>

      {/* ===== MOBILE MENU OVERLAY ===== */}
      {mobileMenuOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="mobile-menu-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <nav
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              {sidebarLinks.map((link) => {
                const isActive = pathname?.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`sidebar-link ${isActive ? "active" : ""}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <link.icon style={{ width: 20, height: 20 }} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="sidebar-link"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                width: "100%",
                textAlign: "left",
                color: "var(--text-muted)",
                marginTop: 16,
              }}
            >
              <ArrowRightOnRectangleIcon
                style={{ width: 20, height: 20 }}
              />
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* ===== MAIN CONTENT ===== */}
      <main className="student-main">{children}</main>

      {/* ===== MOBILE BOTTOM NAV (hidden on desktop) ===== */}
      <nav className="mobile-bottomnav">
        {bottomNavLinks.map((link) => {
          const isActive = pathname?.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`bottomnav-item ${isActive ? "active" : ""}`}
            >
              <link.icon style={{ width: 20, height: 20 }} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
