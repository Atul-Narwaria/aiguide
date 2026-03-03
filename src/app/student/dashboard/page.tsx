"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  RocketLaunchIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

interface DashboardData {
  profile: {
    classLevel: number;
    selfClaimedCareer: string | null;
    school: string | null;
  } | null;
  assessments: Array<{
    id: string;
    type: string;
    status: string;
    completedAt: string | null;
  }>;
  hasClusterResult: boolean;
  hasBranchResult: boolean;
}

export default function StudentDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch("/api/student/dashboard");
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <p style={{ color: "var(--text-muted)" }}>Loading your dashboard...</p>
      </div>
    );
  }

  const clusterCompleted = data?.hasClusterResult;
  const branchCompleted = data?.hasBranchResult;

  const journeySteps = [
    {
      step: 1,
      title: "Profile Setup",
      desc: "Complete your basic information",
      completed: !!data?.profile,
      active: !data?.profile,
      href: "/student/onboarding",
    },
    {
      step: 2,
      title: "Interest Discovery Test",
      desc: "Take 30-50 questions to discover your career inclination",
      completed: !!clusterCompleted,
      active: !!data?.profile && !clusterCompleted,
      href: "/student/test",
    },
    {
      step: 3,
      title: "Career Validation",
      desc: "See if your self-chosen career matches your test results",
      completed: !!clusterCompleted && !!branchCompleted,
      active: !!clusterCompleted && !branchCompleted,
      href: "/student/results/validation",
    },
    {
      step: 4,
      title: "Branch-Level Test",
      desc: "Deep dive into your career cluster to find your exact branch",
      completed: !!branchCompleted,
      active: !!clusterCompleted && !branchCompleted,
      href: "/student/test/branch",
    },
    {
      step: 5,
      title: "Final Recommendation",
      desc: "Get your personalized career recommendation",
      completed: !!branchCompleted,
      active: false,
      href: "/student/results",
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 4 }}>
          Welcome to <span className="gradient-text">aiGuide</span>
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Your personalized career discovery journey
        </p>
      </div>

      {/* Quick Actions */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 20,
          marginBottom: 40,
        }}
      >
        {[
          {
            title: "Take Assessment",
            desc: "Start or continue your career test",
            icon: <ClipboardDocumentListIcon style={{ width: 24, height: 24 }} />,
            href: clusterCompleted ? "/student/test/branch" : "/student/test",
            color: "#e63946",
            disabled: !data?.profile,
          },
          {
            title: "View Results",
            desc: "Check your career analysis",
            icon: <ChartBarIcon style={{ width: 24, height: 24 }} />,
            href: "/student/results",
            color: "#4361ee",
            disabled: !clusterCompleted,
          },
          {
            title: "Career Validation",
            desc: "Validate your career choice",
            icon: <CheckCircleIcon style={{ width: 24, height: 24 }} />,
            href: "/student/results/validation",
            color: "#7209b7",
            disabled: !clusterCompleted,
          },
        ].map((action, i) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              href={action.disabled ? "#" : action.href}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                className="stat-card"
                style={{
                  cursor: action.disabled ? "not-allowed" : "pointer",
                  opacity: action.disabled ? 0.5 : 1,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: `${action.color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: action.color,
                    marginBottom: 16,
                  }}
                >
                  {action.icon}
                </div>
                <h3 style={{ fontWeight: 700, marginBottom: 4 }}>{action.title}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{action.desc}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Journey Progress */}
      <div className="glass-card">
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <RocketLaunchIcon style={{ width: 24, height: 24, color: "var(--accent-red)" }} />
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700 }}>
            Your Career <span className="gradient-text">Journey</span>
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {journeySteps.map((s, i) => (
            <div
              key={s.step}
              style={{
                display: "flex",
                gap: 20,
                position: "relative",
                paddingBottom: i < journeySteps.length - 1 ? 32 : 0,
              }}
            >
              {/* Line */}
              {i < journeySteps.length - 1 && (
                <div
                  style={{
                    position: "absolute",
                    left: 19,
                    top: 40,
                    bottom: 0,
                    width: 2,
                    background: s.completed ? "var(--accent-red)" : "rgba(255,255,255,0.08)",
                  }}
                />
              )}

              {/* Circle */}
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: s.completed
                    ? "var(--accent-red)"
                    : s.active
                    ? "rgba(230, 57, 70, 0.2)"
                    : "rgba(255,255,255,0.05)",
                  border: s.active ? "2px solid var(--accent-red)" : "2px solid transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  color: s.completed ? "white" : "var(--text-muted)",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                }}
              >
                {s.completed ? (
                  <CheckCircleIcon style={{ width: 20, height: 20 }} />
                ) : (
                  s.step
                )}
              </div>

              {/* Content */}
              <div style={{ flex: 1, paddingTop: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <h3 style={{ fontWeight: 600, color: s.completed || s.active ? "var(--text-primary)" : "var(--text-muted)" }}>
                    {s.title}
                  </h3>
                  {s.completed && <span className="badge badge-green">Completed</span>}
                  {s.active && <span className="badge badge-red">Current</span>}
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: 4 }}>
                  {s.desc}
                </p>
                {s.active && (
                  <Link
                    href={s.href}
                    className="btn-primary"
                    style={{ marginTop: 12, padding: "8px 20px", fontSize: "0.85rem" }}
                  >
                    Continue
                    <ArrowRightIcon style={{ width: 14, height: 14 }} />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
