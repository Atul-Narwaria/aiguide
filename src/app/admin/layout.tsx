"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  SparklesIcon,
  HomeIcon,
  AcademicCapIcon,
  QuestionMarkCircleIcon,
  UsersIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const sidebarLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: HomeIcon },
  { href: "/admin/careers", label: "Careers", icon: AcademicCapIcon },
  { href: "/admin/questions", label: "Questions", icon: QuestionMarkCircleIcon },
  { href: "/admin/users", label: "Users", icon: UsersIcon },
  { href: "/admin/analytics", label: "Analytics", icon: ChartBarIcon },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 260,
          background: "var(--bg-secondary)",
          borderRight: "1px solid var(--glass-border)",
          padding: "24px 16px",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 30,
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "0 12px",
            marginBottom: 40,
          }}
        >
          <SparklesIcon style={{ width: 28, height: 28, color: "var(--accent-red)" }} />
          <span className="gradient-text" style={{ fontSize: "1.3rem", fontWeight: 800 }}>
            aiGuide
          </span>
          <span
            className="badge badge-red"
            style={{ marginLeft: "auto", fontSize: "0.65rem" }}
          >
            Admin
          </span>
        </div>

        {/* Nav Links */}
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
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

        {/* Sign Out */}
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

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          marginLeft: 260,
          padding: "32px",
          minHeight: "100vh",
        }}
      >
        {children}
      </main>
    </div>
  );
}
