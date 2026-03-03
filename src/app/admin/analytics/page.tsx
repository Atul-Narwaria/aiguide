"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  UsersIcon,
  AcademicCapIcon,
  QuestionMarkCircleIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

interface Stats {
  totalStudents: number;
  totalCareers: number;
  totalQuestions: number;
  completedAssessments: number;
  recentStudents: Array<{
    id: string;
    name: string;
    email: string;
    createdAt: string;
  }>;
}

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    totalCareers: 0,
    totalQuestions: 0,
    completedAssessments: 0,
    recentStudents: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/analytics");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: <UsersIcon style={{ width: 24, height: 24 }} />,
      color: "#4361ee",
      bgColor: "rgba(67, 97, 238, 0.1)",
    },
    {
      title: "Career Clusters",
      value: stats.totalCareers,
      icon: <AcademicCapIcon style={{ width: 24, height: 24 }} />,
      color: "#e63946",
      bgColor: "rgba(230, 57, 70, 0.1)",
    },
    {
      title: "Questions",
      value: stats.totalQuestions,
      icon: <QuestionMarkCircleIcon style={{ width: 24, height: 24 }} />,
      color: "#7209b7",
      bgColor: "rgba(114, 9, 183, 0.1)",
    },
    {
      title: "Completed Assessments",
      value: stats.completedAssessments,
      icon: <CheckCircleIcon style={{ width: 24, height: 24 }} />,
      color: "#2a9d8f",
      bgColor: "rgba(42, 157, 143, 0.1)",
    },
  ];

  const completionRate =
    stats.totalStudents > 0
      ? Math.round((stats.completedAssessments / (stats.totalStudents * 2)) * 100)
      : 0;

  const avgQuestionsPerAssessment =
    stats.completedAssessments > 0
      ? Math.round(stats.totalQuestions / stats.completedAssessments)
      : 0;

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontSize: "1.8rem",
            fontWeight: 800,
            marginBottom: 4,
          }}
        >
          Platform <span className="gradient-text">Analytics</span>
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Comprehensive overview of your career guidance platform
        </p>
      </div>

      {/* Main Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 20,
          marginBottom: 40,
        }}
      >
        {statCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card"
            style={{ padding: 24 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.8rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: 8,
                  }}
                >
                  {card.title}
                </p>
                <p
                  style={{
                    fontSize: "2.2rem",
                    fontWeight: 800,
                    color: card.color,
                  }}
                >
                  {loading ? "..." : card.value.toLocaleString()}
                </p>
              </div>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: card.bgColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: card.color,
                }}
              >
                {card.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Metrics Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 20,
          marginBottom: 40,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card"
          style={{ padding: 24 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <SparklesIcon
              style={{
                width: 20,
                height: 20,
                color: "var(--accent-red)",
              }}
            />
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Completion Rate
            </p>
          </div>
          <p style={{ fontSize: "2rem", fontWeight: 800 }}>{completionRate}%</p>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 8 }}>
            of all assessments completed
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card"
          style={{ padding: 24 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <ChartBarIcon
              style={{
                width: 20,
                height: 20,
                color: "#4361ee",
              }}
            />
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Avg Questions
            </p>
          </div>
          <p style={{ fontSize: "2rem", fontWeight: 800 }}>{avgQuestionsPerAssessment}</p>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 8 }}>
            questions per assessment
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card"
          style={{ padding: 24 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <ClockIcon
              style={{
                width: 20,
                height: 20,
                color: "#2a9d8f",
              }}
            />
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Assessment Rate
            </p>
          </div>
          <p style={{ fontSize: "2rem", fontWeight: 800 }}>
            {stats.totalStudents > 0
              ? Math.round(stats.completedAssessments / stats.totalStudents)
              : 0}
          </p>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 8 }}>
            per student average
          </p>
        </motion.div>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24, marginBottom: 40 }}>
        {/* Recent Students */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card"
        >
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 20, padding: "24px 24px 0 24px" }}>
            Recent Registrations
          </h2>
          {loading ? (
            <div style={{ padding: "40px 24px", textAlign: "center" }}>
              <p style={{ color: "var(--text-muted)" }}>Loading...</p>
            </div>
          ) : stats.recentStudents.length === 0 ? (
            <div style={{ padding: "40px 24px", textAlign: "center" }}>
              <p style={{ color: "var(--text-muted)" }}>No students registered yet</p>
            </div>
          ) : (
            <div style={{ padding: "0 24px 24px 24px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {stats.recentStudents.slice(0, 5).map((student, i) => (
                  <div
                    key={student.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px",
                      borderRadius: 8,
                      background: "rgba(255,255,255,0.03)",
                      borderBottom: i < 4 ? "1px solid var(--glass-border)" : "none",
                    }}
                  >
                    <div>
                      <p style={{ fontWeight: 600, marginBottom: 4 }}>
                        {student.name}
                      </p>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        {student.email}
                      </p>
                    </div>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--text-muted)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {new Date(student.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>
              <Link
                href="/admin/users"
                style={{
                  display: "inline-block",
                  marginTop: 16,
                  color: "var(--accent-red)",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                }}
              >
                View all users →
              </Link>
            </div>
          )}
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card"
          style={{ padding: 24 }}
        >
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 20 }}>
            Quick Summary
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 6 }}>
                Students
              </p>
              <div
                style={{
                  height: 8,
                  borderRadius: 4,
                  background: "rgba(255,255,255,0.1)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    background: "#4361ee",
                    width: `${Math.min(100, (stats.totalStudents / 1000) * 100)}%`,
                  }}
                />
              </div>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4 }}>
                {stats.totalStudents} registered
              </p>
            </div>

            <div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 6 }}>
                Career Clusters
              </p>
              <div
                style={{
                  height: 8,
                  borderRadius: 4,
                  background: "rgba(255,255,255,0.1)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    background: "#e63946",
                    width: `${(stats.totalCareers / 50) * 100}%`,
                  }}
                />
              </div>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4 }}>
                {stats.totalCareers}/50 available
              </p>
            </div>

            <div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 6 }}>
                Questions
              </p>
              <div
                style={{
                  height: 8,
                  borderRadius: 4,
                  background: "rgba(255,255,255,0.1)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    background: "#7209b7",
                    width: `${Math.min(100, (stats.totalQuestions / 500) * 100)}%`,
                  }}
                />
              </div>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4 }}>
                {stats.totalQuestions} available
              </p>
            </div>

            <div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 6 }}>
                Assessments
              </p>
              <div
                style={{
                  height: 8,
                  borderRadius: 4,
                  background: "rgba(255,255,255,0.1)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    background: "#2a9d8f",
                    width: `${Math.min(100, (stats.completedAssessments / (stats.totalStudents * 2)) * 100)}%`,
                  }}
                />
              </div>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4 }}>
                {completionRate}% completion
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
