"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  TrophyIcon,
  AcademicCapIcon,
  ChartBarIcon,
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

interface PublicResult {
  studentName: string;
  slug: string;
  resultNumber: number;
  totalResults: number;
  profile: {
    classLevel: number;
    school: string | null;
    city: string | null;
    state: string | null;
    selfClaimedCareer: string | null;
  } | null;
  clusterResults: Array<{ name: string; icon: string | null; color: string | null; percentage: number; rank: number }>;
  branchResults: Array<{ name: string; clusterName: string; percentage: number; rank: number }>;
  recommendation: {
    bestFitBranch: string;
    backup1Branch: string | null;
    backup2Branch: string | null;
    reasoning: string | null;
  } | null;
  matchConfidence: number;
  assessmentDate: string | null;
}

export default function PublicSharePage() {
  const params = useParams();
  const slug = params.slug as string;
  const n = params.n as string;
  const [data, setData] = useState<PublicResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    fetch(`/api/public/results/${slug}/${n}`)
      .then((r) => {
        if (!r.ok) { setNotFound(true); return null; }
        return r.json();
      })
      .then((d) => { if (d) setData(d); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug, n]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0f" }}>
        <p style={{ color: "#aaa" }}>Loading results...</p>
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#0a0a0f", gap: 16 }}>
        <TrophyIcon style={{ width: 56, height: 56, color: "#555" }} />
        <h1 style={{ color: "#fff", fontSize: "1.5rem", fontWeight: 700 }}>Result Not Found</h1>
        <p style={{ color: "#888" }}>This result link may be invalid.</p>
        <a href="/" style={{ color: "#e63946", textDecoration: "none", marginTop: 8 }}>← Back to Home</a>
      </div>
    );
  }

  const top3Clusters = data.clusterResults.slice(0, 3);
  const top3Branches = data.branchResults.slice(0, 3);
  const prevN = data.resultNumber > 1 ? data.resultNumber - 1 : null;
  const nextN = data.resultNumber < data.totalResults ? data.resultNumber + 1 : null;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#f0f0f5", fontFamily: "system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1a0a12 0%, #0d0d1a 100%)", borderBottom: "1px solid rgba(230,57,70,0.2)", padding: "20px 24px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(230,57,70,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <AcademicCapIcon style={{ width: 24, height: 24, color: "#e63946" }} />
            </div>
            <div>
              <h1 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0 }}>AI Career Guide</h1>
              <p style={{ fontSize: "0.75rem", color: "#888", margin: 0 }}>
                Shared Results — {data.studentName}
                {data.totalResults > 1 && (
                  <span style={{ color: "#666" }}> — Result #{data.resultNumber} of {data.totalResults}</span>
                )}
              </p>
            </div>
          </div>

          {/* Navigate between results */}
          {data.totalResults > 1 && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {prevN && (
                <a href={`/share/${slug}/${prevN}`}
                  style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 14px", borderRadius: 20, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#ccc", textDecoration: "none", fontSize: "0.82rem" }}>
                  <ChevronLeftIcon style={{ width: 14, height: 14 }} /> Newer
                </a>
              )}
              <span style={{ color: "#555", fontSize: "0.8rem", padding: "0 4px" }}>
                {data.resultNumber}/{data.totalResults}
              </span>
              {nextN && (
                <a href={`/share/${slug}/${nextN}`}
                  style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 14px", borderRadius: 20, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#ccc", textDecoration: "none", fontSize: "0.82rem" }}>
                  Older <ChevronRightIcon style={{ width: 14, height: 14 }} />
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "24px 16px", display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Student Info */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16, alignItems: "flex-start" }}>
            <div>
              <h2 style={{ fontSize: "1.6rem", fontWeight: 800, margin: "0 0 4px" }}>{data.studentName}</h2>
              {data.profile && (
                <p style={{ color: "#aaa", margin: 0, fontSize: "0.9rem" }}>
                  Class {data.profile.classLevel}
                  {data.profile.school && ` • ${data.profile.school}`}
                  {data.profile.city && ` • ${data.profile.city}`}
                  {data.profile.state && `, ${data.profile.state}`}
                </p>
              )}
              {data.profile?.selfClaimedCareer && (
                <span style={{ display: "inline-block", marginTop: 10, padding: "4px 14px", borderRadius: 20, background: "rgba(230,57,70,0.12)", border: "1px solid rgba(230,57,70,0.3)", color: "#e63946", fontSize: "0.82rem", fontWeight: 600 }}>
                  Interest: {data.profile.selfClaimedCareer}
                </span>
              )}
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#e63946", lineHeight: 1 }}>{data.matchConfidence}%</div>
              <div style={{ fontSize: "0.78rem", color: "#888", marginTop: 2 }}>Match Confidence</div>
              {data.assessmentDate && (
                <div style={{ fontSize: "0.75rem", color: "#666", marginTop: 6 }}>
                  {new Date(data.assessmentDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* AI Recommendation */}
        {data.recommendation && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
            style={{ background: "rgba(230,57,70,0.06)", border: "1px solid rgba(230,57,70,0.2)", borderRadius: 16, padding: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <TrophyIcon style={{ width: 22, height: 22, color: "#e63946" }} />
              <h3 style={{ margin: 0, fontWeight: 700, fontSize: "1.05rem" }}>AI Career Recommendation</h3>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: data.recommendation.reasoning ? 18 : 0 }}>
              <div style={{ padding: "10px 20px", borderRadius: 24, background: "rgba(230,57,70,0.2)", border: "1px solid rgba(230,57,70,0.4)", fontWeight: 700, fontSize: "0.95rem" }}>
                🎯 {data.recommendation.bestFitBranch}
              </div>
              {data.recommendation.backup1Branch && (
                <div style={{ padding: "10px 20px", borderRadius: 24, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", fontSize: "0.88rem" }}>
                  {data.recommendation.backup1Branch}
                </div>
              )}
              {data.recommendation.backup2Branch && (
                <div style={{ padding: "10px 20px", borderRadius: 24, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", fontSize: "0.88rem" }}>
                  {data.recommendation.backup2Branch}
                </div>
              )}
            </div>
            {data.recommendation.reasoning && (
              <p style={{ color: "#ccc", fontSize: "0.88rem", lineHeight: 1.6, margin: 0 }}>
                {data.recommendation.reasoning}
              </p>
            )}
          </motion.div>
        )}

        {/* Top Clusters */}
        {top3Clusters.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <ChartBarIcon style={{ width: 22, height: 22, color: "#e63946" }} />
              <h3 style={{ margin: 0, fontWeight: 700, fontSize: "1.05rem" }}>Career Cluster Scores</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {top3Clusters.map((c, i) => (
                <div key={c.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, alignItems: "center" }}>
                    <span style={{ fontWeight: i === 0 ? 700 : 500, display: "flex", alignItems: "center", gap: 6, fontSize: "0.92rem" }}>
                      {i === 0 && <StarIcon style={{ width: 16, height: 16, color: "#ffd700" }} />}
                      {c.icon && <span style={{ fontSize: "1.1rem" }}>{c.icon}</span>}
                      {c.name}
                    </span>
                    <span style={{ fontWeight: 700, color: i === 0 ? "#e63946" : "#aaa" }}>{c.percentage.toFixed(1)}%</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.08)" }}>
                    <div style={{ height: "100%", borderRadius: 4, background: i === 0 ? "linear-gradient(90deg,#e63946,#ff6b6b)" : "rgba(255,255,255,0.2)", width: `${c.percentage}%`, transition: "width 1.2s ease" }} />
                  </div>
                </div>
              ))}
            </div>
            {data.clusterResults.length > 3 && (
              <p style={{ color: "#555", fontSize: "0.8rem", marginTop: 12, marginBottom: 0 }}>
                + {data.clusterResults.length - 3} more clusters assessed
              </p>
            )}
          </motion.div>
        )}

        {/* Top Branches */}
        {top3Branches.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <StarIcon style={{ width: 22, height: 22, color: "#e63946" }} />
              <h3 style={{ margin: 0, fontWeight: 700, fontSize: "1.05rem" }}>Top Career Branches</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {top3Branches.map((b, i) => (
                <div key={b.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderRadius: 12, background: i === 0 ? "rgba(230,57,70,0.08)" : "rgba(255,255,255,0.03)", border: `1px solid ${i === 0 ? "rgba(230,57,70,0.2)" : "rgba(255,255,255,0.06)"}` }}>
                  <div>
                    <div style={{ fontWeight: i === 0 ? 700 : 500, fontSize: "0.92rem" }}>{b.name}</div>
                    <div style={{ fontSize: "0.78rem", color: "#888" }}>{b.clusterName}</div>
                  </div>
                  <div style={{ fontWeight: 700, color: i === 0 ? "#e63946" : "#aaa" }}>{b.percentage.toFixed(1)}%</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", padding: "16px 0 40px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <p style={{ color: "#555", fontSize: "0.82rem", margin: "0 0 14px" }}>
            Powered by AI Career Guide — Personalized career assessment for students
          </p>
          <a href="/register" style={{ display: "inline-block", padding: "10px 28px", borderRadius: 24, background: "linear-gradient(135deg,#e63946,#c1121f)", color: "#fff", textDecoration: "none", fontWeight: 600, fontSize: "0.88rem" }}>
            Take Your Own Assessment →
          </a>
        </div>
      </div>
    </div>
  );
}
