"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  UsersIcon,
  AcademicCapIcon,
  QuestionMarkCircleIcon,
  ChartBarIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

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

export default function AdminDashboard() {
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
    },
    {
      title: "Career Clusters",
      value: stats.totalCareers,
      icon: <AcademicCapIcon style={{ width: 24, height: 24 }} />,
      color: "#e63946",
    },
    {
      title: "Questions",
      value: stats.totalQuestions,
      icon: <QuestionMarkCircleIcon style={{ width: 24, height: 24 }} />,
      color: "#7209b7",
    },
    {
      title: "Assessments Done",
      value: stats.completedAssessments,
      icon: <ChartBarIcon style={{ width: 24, height: 24 }} />,
      color: "#2a9d8f",
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 4 }}>
          Admin <span className="gradient-text">Dashboard</span>
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Overview of your career guidance platform
        </p>
      </div>

      {/* Stats Grid */}
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
            className="stat-card"
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 16,
              }}
            >
              <div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>
                  {card.title}
                </p>
                <p style={{ fontSize: "2rem", fontWeight: 800 }}>
                  {loading ? "..." : card.value}
                </p>
              </div>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: `${card.color}15`,
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

      {/* Recent Students */}
      <div className="glass-card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>
            Recent Students
          </h2>
          <Link
            href="/admin/users"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "var(--accent-red)",
              fontSize: "0.9rem",
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            View All
            <ArrowRightIcon style={{ width: 16, height: 16 }} />
          </Link>
        </div>
        {loading ? (
          <p style={{ color: "var(--text-muted)" }}>Loading...</p>
        ) : stats.recentStudents.length === 0 ? (
          <p
            style={{
              color: "var(--text-muted)",
              textAlign: "center",
              padding: 40,
            }}
          >
            No students registered yet
          </p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentStudents.slice(0, 10).map((student) => (
                  <tr key={student.id}>
                    <td style={{ fontWeight: 500, color: "var(--text-primary)" }}>
                      {student.name}
                    </td>
                    <td>{student.email}</td>
                    <td>
                      {new Date(student.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
