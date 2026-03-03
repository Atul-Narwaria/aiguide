"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  TrophyIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  StarIcon,
  ArrowRightIcon,
  ArrowDownTrayIcon,
  SparklesIcon,
  CheckBadgeIcon,
  ShareIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

interface ResultData {
  recommendation: {
    bestFitBranch: string;
    backup1Branch: string | null;
    backup2Branch: string | null;
    reasoning: string | null;
    riskFactors: string | null;
    realityCheck: string | null;
    claimValidation: string | null;
  } | null;
  clusterResults: Array<{ name: string; percentage: number }>;
  branchResults: Array<{
    name: string;
    clusterName?: string;
    percentage: number;
  }>;
  questionTypeBreakdown: Array<{
    type: string;
    label: string;
    percentage: number;
  }>;
  matchConfidence: number;
  studentName: string;
  slug: string | null;
  resultNumber: number;
  profile: {
    selfClaimedCareer: string | null;
    classLevel: number;
  } | null;
  assessmentDate: string | null;
}

// Radar chart component drawn on canvas
function RadarChart({
  data,
  size = 280,
}: {
  data: Array<{ name: string; percentage: number }>;
  size?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawChart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - 40;
    const items = data.slice(0, 8);
    const n = items.length;
    const step = (Math.PI * 2) / n;

    // Clear
    ctx.clearRect(0, 0, size, size);

    // Draw grid rings
    for (let r = 1; r <= 4; r++) {
      const ringR = (radius * r) / 4;
      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        const angle = step * i - Math.PI / 2;
        const x = cx + ringR * Math.cos(angle);
        const y = cy + ringR * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw axis lines
    for (let i = 0; i < n; i++) {
      const angle = step * i - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw data polygon
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const idx = i % n;
      const angle = step * idx - Math.PI / 2;
      const val = (items[idx].percentage / 100) * radius;
      const x = cx + val * Math.cos(angle);
      const y = cy + val * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.fillStyle = "rgba(230, 57, 70, 0.15)";
    ctx.fill();
    ctx.strokeStyle = "#e63946";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw dots and labels
    for (let i = 0; i < n; i++) {
      const angle = step * i - Math.PI / 2;
      const val = (items[i].percentage / 100) * radius;
      const x = cx + val * Math.cos(angle);
      const y = cy + val * Math.sin(angle);

      // Dot
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#e63946";
      ctx.fill();
      ctx.strokeStyle = "#0f0f1a";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      const lx = cx + (radius + 22) * Math.cos(angle);
      const ly = cy + (radius + 22) * Math.sin(angle);
      ctx.fillStyle = "#adb5bd";
      ctx.font = "11px Inter, system-ui, sans-serif";
      ctx.textAlign =
        Math.abs(Math.cos(angle)) < 0.1
          ? "center"
          : Math.cos(angle) > 0
            ? "left"
            : "right";
      ctx.textBaseline =
        Math.abs(Math.sin(angle)) < 0.1
          ? "middle"
          : Math.sin(angle) > 0
            ? "top"
            : "bottom";

      // Truncate long names
      const label =
        items[i].name.length > 14
          ? items[i].name.substring(0, 12) + "…"
          : items[i].name;
      ctx.fillText(label, lx, ly);
    }
  }, [data, size]);

  useEffect(() => {
    drawChart();
  }, [drawChart]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
    />
  );
}

// Circular progress indicator
function CircularProgress({
  value,
  size = 120,
  strokeWidth = 8,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={strokeWidth}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="url(#gradient)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e63946" />
          <stop offset="100%" stopColor="#ff6b6b" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const TYPE_ICONS: Record<string, { emoji: string; color: string }> = {
  INTEREST: { emoji: "❤️", color: "#e63946" },
  APTITUDE: { emoji: "🧠", color: "#6b8bff" },
  PERSONALITY: { emoji: "🎭", color: "#cc5de8" },
  LEARNING_STYLE: { emoji: "📚", color: "#f4a261" },
  VALUES: { emoji: "⭐", color: "#51cf66" },
};

interface HistoryEntry {
  id: string;
  type: "CLUSTER";
  resultNumber: number;
  completedAt: string | null;
  topClusters: Array<{ name: string; icon: string | null; color: string | null; percentage: number; rank: number }>;
  recommendation: { bestFitBranch: string; backup1Branch: string | null; backup2Branch: string | null } | null;
}

export default function ResultsPage() {
  const [data, setData] = useState<ResultData | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [selectedResultNumber, setSelectedResultNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchResults();
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/student/results/history");
      if (res.ok) {
        const result = await res.json();
        setHistory(result.history ?? []);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
  };

  const fetchResults = async () => {
    try {
      const res = await fetch("/api/student/results");
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (error) {
      console.error("Failed to fetch results:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!data?.slug) return;
    const url = `${window.location.origin}/share/${data.slug}/${selectedResultNumber}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: open share dialog
      if (navigator.share) {
        navigator.share({ title: "My Career Assessment Results", url });
      }
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            style={{
              width: 40,
              height: 40,
              border: "3px solid var(--glass-border)",
              borderTopColor: "var(--accent-red)",
              borderRadius: "50%",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ color: "var(--text-muted)" }}>
            Loading your results...
          </p>
        </div>
      </div>
    );
  }

  if (!data?.recommendation) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
        }}
      >
        <div
          className="glass-card"
          style={{ textAlign: "center", padding: 60, maxWidth: 500 }}
        >
          <ChartBarIcon
            style={{
              width: 48,
              height: 48,
              color: "var(--accent-red)",
              margin: "0 auto 16px",
            }}
          />
          <h2
            style={{
              fontSize: "1.3rem",
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            No Results Yet
          </h2>
          <p style={{ color: "var(--text-muted)", marginBottom: 20 }}>
            Complete both assessments to see your detailed career analysis.
          </p>
          <Link href="/student/test" className="btn-primary">
            Take Assessment
            <ArrowRightIcon style={{ width: 16, height: 16 }} />
          </Link>
        </div>
      </div>
    );
  }

  const rec = data.recommendation;

  return (
    <div style={{ maxWidth: 960, margin: "0 auto" }}>
      {/* Result Selector */}
      {history.length > 0 && (
        <div style={{ marginBottom: 24, display: "flex", gap: 10, alignItems: "center", overflowX: "auto", paddingBottom: 8 }}>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500, whiteSpace: "nowrap" }}>
            Select result:
          </span>
          <div style={{ display: "flex", gap: 10, overflowX: "auto" }}>
            {history.map((entry) => (
              <button
                key={entry.id}
                onClick={() => setSelectedResultNumber(entry.resultNumber)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 20,
                  border: selectedResultNumber === entry.resultNumber ? "2px solid var(--accent-red)" : "1px solid rgba(255,255,255,0.1)",
                  background: selectedResultNumber === entry.resultNumber ? "rgba(230,57,70,0.1)" : "rgba(255,255,255,0.05)",
                  color: selectedResultNumber === entry.resultNumber ? "var(--accent-red)" : "var(--text-secondary)",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: selectedResultNumber === entry.resultNumber ? 600 : 500,
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease",
                }}
              >
                #{entry.resultNumber}
                {entry.resultNumber === 1 && " ⭐"}
                {entry.completedAt && (
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginTop: 2 }}>
                    {new Date(entry.completedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Header */}
      <div
        className="responsive-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h1 className="page-title" style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 4 }}>
            Your Career{" "}
            <span className="gradient-text">Recommendation</span>
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Hi {data.studentName}! Here&apos;s your personalized career analysis
            {data.assessmentDate &&
              ` • ${new Date(data.assessmentDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`}
            {history.length > 0 && selectedResultNumber !== 1 && ` • Result #${selectedResultNumber}`}
          </p>
        </div>
        <div className="header-actions" style={{ display: "flex", gap: 8 }}>
          <button
            className="btn-primary"
            onClick={() =>
              window.open("/api/student/results/pdf", "_blank")
            }
          >
            <ArrowDownTrayIcon style={{ width: 18, height: 18 }} />
            Download Report
          </button>
          <button className="btn-secondary" onClick={handleShare} disabled={!data.slug} title={!data.slug ? "Share link unavailable" : `Share: /share/${data.slug}/${selectedResultNumber}`}>
            <ShareIcon style={{ width: 18, height: 18 }} />
            {copied ? "Link Copied!" : "Share Results"}
          </button>
        </div>
      </div>

      {/* Best Fit Hero + Confidence */}
      <div
        className="responsive-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card animate-pulse-glow"
          style={{ textAlign: "center", padding: "36px 24px" }}
        >
          <TrophyIcon
            style={{
              width: 48,
              height: 48,
              color: "#ffd43b",
              margin: "0 auto 12px",
            }}
          />
          <h2
            style={{
              fontSize: "0.85rem",
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              marginBottom: 8,
            }}
          >
            Best Fit Career
          </h2>
          <p
            className="gradient-text best-fit-text"
            style={{
              fontSize: "2.2rem",
              fontWeight: 800,
              marginBottom: 12,
              lineHeight: 1.2,
            }}
          >
            {rec.bestFitBranch}
          </p>
          {rec.claimValidation === "MATCHED" && (
            <span
              className="badge badge-green"
              style={{ fontSize: "0.8rem" }}
            >
              <CheckBadgeIcon
                style={{
                  width: 14,
                  height: 14,
                  display: "inline",
                  marginRight: 4,
                }}
              />
              Matches your self-claimed career
            </span>
          )}
          {rec.claimValidation === "MISMATCHED" && data.profile?.selfClaimedCareer && (
            <div style={{ marginTop: 8 }}>
              <span
                className="badge badge-yellow"
                style={{ fontSize: "0.78rem" }}
              >
                You claimed: {data.profile.selfClaimedCareer} — AI recommends
                something different
              </span>
            </div>
          )}
        </motion.div>

        {/* Confidence Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px 32px",
            minWidth: 180,
          }}
        >
          <p
            style={{
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: 12,
            }}
          >
            Match Confidence
          </p>
          <div style={{ position: "relative" }}>
            <CircularProgress value={data.matchConfidence} size={100} strokeWidth={6} />
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontSize: "1.6rem",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                }}
              >
                {data.matchConfidence}%
              </span>
            </div>
          </div>
          <p
            style={{
              fontSize: "0.78rem",
              color: "var(--text-secondary)",
              marginTop: 8,
            }}
          >
            {data.matchConfidence >= 80
              ? "Strong Match"
              : data.matchConfidence >= 60
                ? "Good Match"
                : "Moderate Match"}
          </p>
        </motion.div>
      </div>

      {/* Backup Options */}
      {(rec.backup1Branch || rec.backup2Branch) && (
        <div
          className="responsive-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 24,
          }}
        >
          {rec.backup1Branch && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="glass-card"
              style={{ padding: 20 }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <StarIcon
                  style={{ width: 18, height: 18, color: "#6b8bff" }}
                />
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Backup Option 1
                </span>
              </div>
              <p style={{ fontSize: "1.15rem", fontWeight: 700 }}>
                {rec.backup1Branch}
              </p>
            </motion.div>
          )}
          {rec.backup2Branch && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card"
              style={{ padding: 20 }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <StarIcon
                  style={{ width: 18, height: 18, color: "#cc5de8" }}
                />
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Backup Option 2
                </span>
              </div>
              <p style={{ fontSize: "1.15rem", fontWeight: 700 }}>
                {rec.backup2Branch}
              </p>
            </motion.div>
          )}
        </div>
      )}

      {/* Charts Section: Radar + Bars */}
      <div
        className="responsive-grid radar-section"
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
              alignSelf: "flex-start",
            }}
          >
            <ChartBarIcon
              style={{ width: 18, height: 18, color: "var(--accent-red)" }}
            />
            <h3 style={{ fontWeight: 700, fontSize: "0.95rem" }}>
              Career Cluster Map
            </h3>
          </div>
          <RadarChart data={data.clusterResults} size={280} />
        </motion.div>

        {/* Branch Scores Bars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 20,
            }}
          >
            <ChartBarIcon
              style={{ width: 18, height: 18, color: "#6b8bff" }}
            />
            <h3 style={{ fontWeight: 700, fontSize: "0.95rem" }}>
              {data.branchResults.length > 0
                ? "Branch Scores"
                : "Cluster Scores"}
            </h3>
          </div>
          {(data.branchResults.length > 0
            ? data.branchResults.slice(0, 8)
            : data.clusterResults
          ).map((item, i) => (
            <div key={item.name} style={{ marginBottom: 14 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    fontSize: "0.83rem",
                    fontWeight: 500,
                    maxWidth: "70%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.name}
                </span>
                <span
                  style={{
                    fontSize: "0.83rem",
                    fontWeight: 700,
                    color:
                      data.branchResults.length > 0
                        ? "#6b8bff"
                        : "var(--accent-red-light)",
                  }}
                >
                  {item.percentage.toFixed(0)}%
                </span>
              </div>
              <div className="progress-bar" style={{ height: 8 }}>
                <motion.div
                  className="progress-bar-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ duration: 1, delay: 0.3 + i * 0.08 }}
                  style={
                    data.branchResults.length > 0
                      ? {
                          background:
                            "linear-gradient(135deg, #4361ee, #6b8bff)",
                        }
                      : {}
                  }
                />
              </div>
            </div>
          ))}
          {data.branchResults.length === 0 && (
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.8rem",
                marginTop: 8,
              }}
            >
              Complete the branch test to see branch-level scores.
            </p>
          )}
        </motion.div>
      </div>

      {/* Question Type Breakdown */}
      {data.questionTypeBreakdown.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card"
          style={{ marginBottom: 24 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 20,
            }}
          >
            <SparklesIcon
              style={{ width: 18, height: 18, color: "#cc5de8" }}
            />
            <h3 style={{ fontWeight: 700, fontSize: "0.95rem" }}>
              Your Profile Breakdown
            </h3>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 12,
            }}
          >
            {data.questionTypeBreakdown.map((item, i) => {
              const meta = TYPE_ICONS[item.type] || {
                emoji: "📊",
                color: "#6b8bff",
              };
              return (
                <motion.div
                  key={item.type}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  style={{
                    padding: 16,
                    background: `${meta.color}08`,
                    borderRadius: 12,
                    border: `1px solid ${meta.color}20`,
                    textAlign: "center",
                  }}
                >
                  <span style={{ fontSize: "1.5rem" }}>{meta.emoji}</span>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-muted)",
                      marginTop: 8,
                      marginBottom: 6,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {item.label}
                  </p>
                  <p
                    style={{
                      fontSize: "1.4rem",
                      fontWeight: 800,
                      color: meta.color,
                    }}
                  >
                    {item.percentage.toFixed(0)}%
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* AI Analysis Cards */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {rec.reasoning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card"
          >
            <h3
              style={{
                fontWeight: 700,
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              💡 Why This Career?
            </h3>
            <p
              style={{
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                fontSize: "0.92rem",
              }}
            >
              {rec.reasoning}
            </p>
          </motion.div>
        )}

        <div
          className="responsive-grid"
          style={{
            display: "grid",
            gridTemplateColumns: rec.riskFactors && rec.realityCheck ? "1fr 1fr" : "1fr",
            gap: 16,
          }}
        >
          {rec.riskFactors && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="glass-card"
            >
              <h3
                style={{
                  fontWeight: 700,
                  marginBottom: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <ExclamationTriangleIcon
                  style={{ width: 20, height: 20, color: "#ffd43b" }}
                />
                Risk Factors
              </h3>
              <p
                style={{
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                  fontSize: "0.88rem",
                }}
              >
                {rec.riskFactors}
              </p>
            </motion.div>
          )}

          {rec.realityCheck && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass-card"
            >
              <h3
                style={{
                  fontWeight: 700,
                  marginBottom: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                🎯 Reality Check
              </h3>
              <p
                style={{
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                  fontSize: "0.88rem",
                }}
              >
                {rec.realityCheck}
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Action Items */}
      {data.profile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="glass-card"
          style={{ marginBottom: 24 }}
        >
          <h3
            style={{
              fontWeight: 700,
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            📋 Your Action Plan (Class {data.profile.classLevel})
          </h3>
          <div
            className="responsive-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            {(data.profile.classLevel <= 8
              ? [
                  "Focus on building strong fundamentals in all subjects",
                  "Explore different activities and clubs to discover interests",
                  "Start reading about careers that interest you",
                  "Develop good study habits and time management",
                ]
              : data.profile.classLevel <= 10
                ? [
                    "Choose your stream wisely based on these results",
                    "Start preparing for relevant entrance exams",
                    "Join coaching or online courses for your target career",
                    "Build practical skills through projects and internships",
                  ]
                : [
                    "Focus intensely on entrance exam preparation",
                    "Research colleges and admission processes thoroughly",
                    "Build your portfolio or project experience",
                    "Attend career fairs and college open days",
                  ]
            ).map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: "10px 14px",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: 10,
                  border: "1px solid var(--glass-border)",
                }}
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "rgba(230,57,70,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "var(--accent-red-light)",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  {i + 1}
                </span>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.5,
                  }}
                >
                  {item}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* CTA: Chat with AI */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass-card"
        style={{
          textAlign: "center",
          padding: "36px 24px",
          background:
            "linear-gradient(135deg, rgba(230,57,70,0.08), rgba(67,97,238,0.08))",
          borderColor: "rgba(230,57,70,0.2)",
          marginBottom: 32,
        }}
      >
        <ChatBubbleLeftRightIcon
          style={{
            width: 36,
            height: 36,
            color: "var(--accent-red)",
            margin: "0 auto 12px",
          }}
        />
        <h2
          style={{
            fontSize: "1.2rem",
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          Want to dive deeper into your results?
        </h2>
        <p
          style={{
            color: "var(--text-secondary)",
            marginBottom: 20,
            maxWidth: 480,
            margin: "0 auto 20px",
            fontSize: "0.9rem",
          }}
        >
          Ask our AI Counselor about exam prep, college options, or career
          roadmaps tailored to your profile.
        </p>
        <Link
          href={`/student/chat?prompt=${encodeURIComponent(`Based on my results showing ${rec.bestFitBranch} as my best fit, what should be my next steps?`)}`}
          className="btn-primary"
          style={{ display: "inline-flex" }}
        >
          <SparklesIcon style={{ width: 18, height: 18 }} />
          Discuss My Results with AI
        </Link>
      </motion.div>
    </div>
  );
}
