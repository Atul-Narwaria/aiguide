"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

interface ValidationData {
  selfClaimed: string | null;
  topClusters: Array<{ name: string; percentage: number; rank: number }>;
  claimMatch: "MATCHED" | "MISMATCHED" | "NO_CLAIM";
  suggestedCareer: string;
}

export default function ValidationPage() {
  const [data, setData] = useState<ValidationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [choice, setChoice] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchValidation();
  }, []);

  const fetchValidation = async () => {
    try {
      const res = await fetch("/api/student/results/validation");
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (error) {
      console.error("Failed to fetch validation:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChoice = async (selectedCareer: string) => {
    setChoice(selectedCareer);
    try {
      await fetch("/api/student/results/validation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedCareer }),
      });
      router.push("/student/test/branch");
    } catch (error) {
      console.error("Failed to save choice:", error);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <p style={{ color: "var(--text-muted)" }}>Analyzing your results...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div className="glass-card" style={{ textAlign: "center", padding: 60, maxWidth: 500 }}>
          <p style={{ color: "var(--text-muted)", marginBottom: 16 }}>
            Please complete the Interest Discovery Test first.
          </p>
          <Link href="/student/test" className="btn-primary">
            Take the Test
            <ArrowRightIcon style={{ width: 16, height: 16 }} />
          </Link>
        </div>
      </div>
    );
  }

  const isMatch = data.claimMatch === "MATCHED";
  const noClaim = data.claimMatch === "NO_CLAIM";

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 8 }}>
          Career <span className="gradient-text">Validation</span>
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Let&apos;s see how your interests match with your career choice
        </p>
      </div>

      {/* Cluster Scores */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
        style={{ marginBottom: 24 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <ChartBarIcon style={{ width: 24, height: 24, color: "var(--accent-red)" }} />
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Your Career Inclination Scores</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {data.topClusters.map((cluster, i) => (
            <div key={cluster.name}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontWeight: 600 }}>
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"} {cluster.name}
                </span>
                <span className="gradient-text" style={{ fontWeight: 700 }}>
                  {cluster.percentage.toFixed(0)}%
                </span>
              </div>
              <div className="progress-bar" style={{ height: 12 }}>
                <motion.div
                  className="progress-bar-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${cluster.percentage}%` }}
                  transition={{ duration: 1, delay: i * 0.2 }}
                  style={{
                    background: i === 0
                      ? "var(--accent-gradient)"
                      : i === 1
                      ? "linear-gradient(135deg, #4361ee, #6b8bff)"
                      : "linear-gradient(135deg, #7209b7, #cc5de8)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Validation Result */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card"
        style={{ marginBottom: 24 }}
      >
        {noClaim ? (
          <div style={{ textAlign: "center", padding: 20 }}>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>🎯</div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: 8 }}>
              Based on your test, we recommend:
            </h3>
            <p className="gradient-text" style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 16 }}>
              {data.suggestedCareer}
            </p>
            <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>
              Your answers strongly indicate this career cluster suits you best.
            </p>
            <button
              className="btn-primary"
              onClick={() => handleChoice(data.suggestedCareer)}
              disabled={choice !== null}
            >
              {choice ? "Proceeding..." : (
                <>
                  Explore {data.suggestedCareer}
                  <ArrowRightIcon style={{ width: 16, height: 16 }} />
                </>
              )}
            </button>
          </div>
        ) : isMatch ? (
          <div style={{ textAlign: "center", padding: 20 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(40, 167, 69, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                color: "#51cf66",
              }}
            >
              <CheckCircleIcon style={{ width: 32, height: 32 }} />
            </div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: 8, color: "#51cf66" }}>
              Great Match! ✨
            </h3>
            <p style={{ color: "var(--text-secondary)", marginBottom: 8 }}>
              Your interest and aptitude strongly support <strong>{data.selfClaimed}</strong>.
            </p>
            <p style={{ color: "var(--text-muted)", marginBottom: 24, fontSize: "0.9rem" }}>
              Let&apos;s now dive deeper to find your ideal branch within {data.selfClaimed}.
            </p>
            <button
              className="btn-primary"
              onClick={() => handleChoice(data.selfClaimed!)}
              disabled={choice !== null}
            >
              {choice ? "Proceeding..." : (
                <>
                  Continue to Branch Test
                  <ArrowRightIcon style={{ width: 16, height: 16 }} />
                </>
              )}
            </button>
          </div>
        ) : (
          <div style={{ padding: 20 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(255, 193, 7, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                color: "#ffd43b",
              }}
            >
              <ExclamationTriangleIcon style={{ width: 32, height: 32 }} />
            </div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: 8, textAlign: "center" }}>
              Interesting Insight 🤔
            </h3>
            <p style={{ color: "var(--text-secondary)", textAlign: "center", marginBottom: 24 }}>
              Your answers indicate <strong className="gradient-text">{data.suggestedCareer}</strong> may
              suit you better than <strong>{data.selfClaimed}</strong>.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <button
                className="btn-primary"
                onClick={() => handleChoice(data.suggestedCareer)}
                disabled={choice !== null}
                style={{ width: "100%", justifyContent: "center" }}
              >
                Accept: {data.suggestedCareer}
              </button>
              <button
                className="btn-secondary"
                onClick={() => handleChoice(data.selfClaimed!)}
                disabled={choice !== null}
                style={{ width: "100%", justifyContent: "center" }}
              >
                Keep: {data.selfClaimed}
              </button>
            </div>

            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", textAlign: "center", marginTop: 12 }}>
              ⚠️ Continuing with a mismatched career may present additional challenges
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
