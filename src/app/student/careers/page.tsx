"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MagnifyingGlassIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SignalIcon,
  BoltIcon,
  SparklesIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

interface Branch {
  id: string;
  name: string;
  description: string | null;
  eligibility: string | null;
  competition: string | null;
  effort: string | null;
}

interface Cluster {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  branches: Branch[];
}

const CAREER_DETAILS: Record<string, { salary: string; topColleges: string[]; education: string; growth: string }> = {
  "Engineering": {
    salary: "₹6-25 LPA (Entry) | ₹25-80 LPA (Senior)",
    topColleges: ["IIT Bombay", "IIT Delhi", "IIT Madras", "BITS Pilani", "NIT Trichy"],
    education: "B.Tech/B.E. (4 years) → M.Tech/MS (optional)",
    growth: "High — India's fastest growing sector",
  },
  "Medical & Healthcare": {
    salary: "₹8-20 LPA (Entry) | ₹20-1Cr+ LPA (Senior)",
    topColleges: ["AIIMS Delhi", "CMC Vellore", "JIPMER", "Maulana Azad MC", "KEM Mumbai"],
    education: "MBBS (5.5 years) → MD/MS Specialization (3 years)",
    growth: "Very High — Growing demand post-pandemic",
  },
  "Business & Commerce": {
    salary: "₹5-15 LPA (Entry) | ₹20-1Cr+ LPA (Senior)",
    topColleges: ["IIM Ahmedabad", "IIM Bangalore", "SRCC Delhi", "XLRI", "FMS Delhi"],
    education: "B.Com/BBA (3 years) → MBA/CA (2-3 years)",
    growth: "High — India's growing economy needs business talent",
  },
  "Arts & Humanities": {
    salary: "₹3-10 LPA (Entry) | ₹15-50 LPA (Senior)",
    topColleges: ["NID", "NIFT", "FTII Pune", "JNU", "St. Stephen's College"],
    education: "BA/BFA/B.Des (3-4 years) → MA/MFA (optional)",
    growth: "Medium — Growing with digital & creative economy",
  },
  "Law & Legal": {
    salary: "₹5-12 LPA (Entry) | ₹25-1Cr+ LPA (Senior)",
    topColleges: ["NLSIU Bangalore", "NLU Delhi", "NALSAR Hyderabad", "NUJS Kolkata", "GNLU"],
    education: "BA LLB (5 years) or LLB (3 years) → LLM (optional)",
    growth: "High — Corporate law & litigation growing rapidly",
  },
  "Education & Teaching": {
    salary: "₹3-8 LPA (Entry) | ₹10-30 LPA (Senior)",
    topColleges: ["IGNOU", "Lady Shri Ram", "Jamia Millia", "TISS", "Azim Premji University"],
    education: "B.Ed (2 years) after graduation or Integrated B.Ed",
    growth: "Steady — EdTech revolution creating new opportunities",
  },
  "Government & Civil Services": {
    salary: "₹6-15 LPA (Entry) | ₹15-30 LPA (Senior) + Perks",
    topColleges: ["LBSNAA Mussoorie", "Any top university for graduation"],
    education: "Any Graduation → UPSC/State PSC preparation",
    growth: "Stable — Prestigious career with job security",
  },
  "Defence & Security": {
    salary: "₹6-12 LPA (Entry) | ₹15-25 LPA (Senior) + Perks",
    topColleges: ["NDA Khadakwasla", "IMA Dehradun", "NA Ezhimala", "AFA Dundigal", "OTA Chennai"],
    education: "NDA/CDS exam after 12th/Graduation",
    growth: "Stable — India modernizing defence rapidly",
  },
  "Technology & IT": {
    salary: "₹8-30 LPA (Entry) | ₹30-1Cr+ LPA (Senior)",
    topColleges: ["IIT Bombay", "IIIT Hyderabad", "IISc Bangalore", "BITS Pilani", "DTU Delhi"],
    education: "B.Tech CS/IT (4 years) or BCA + MCA",
    growth: "Very High — AI, Cloud, and Data driving massive demand",
  },
  "Science & Research": {
    salary: "₹4-12 LPA (Entry) | ₹15-40 LPA (Senior)",
    topColleges: ["IISc Bangalore", "TIFR Mumbai", "IISERs", "JNU", "IIT (for research)"],
    education: "B.Sc (3 years) → M.Sc → PhD (5-7 years)",
    growth: "Growing — India investing in R&D and space programs",
  },
};

export default function CareersPage() {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedCluster, setExpandedCluster] = useState<string | null>(null);

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      const res = await fetch("/api/student/careers");
      if (res.ok) {
        const data = await res.json();
        setClusters(data.clusters);
      }
    } catch (error) {
      console.error("Failed to fetch careers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClusters = useMemo(() => {
    if (!search.trim()) return clusters;
    const q = search.toLowerCase();
    return clusters.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.branches.some((b) => b.name.toLowerCase().includes(q))
    );
  }, [clusters, search]);

  const getCompetitionColor = (level: string | null) => {
    switch (level) {
      case "High": return "#e63946";
      case "Medium": return "#f4a261";
      case "Low": return "#51cf66";
      default: return "var(--text-muted)";
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <p style={{ color: "var(--text-muted)" }}>Loading careers...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 8 }}>
          Career <span className="gradient-text">Explorer</span>
        </h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>
          Explore {clusters.length} career clusters and {clusters.reduce((a, c) => a + c.branches.length, 0)} specializations to find your perfect path
        </p>

        {/* Search Bar */}
        <div style={{ position: "relative", maxWidth: 500 }}>
          <MagnifyingGlassIcon
            style={{
              width: 20, height: 20,
              position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
              color: "var(--text-muted)",
            }}
          />
          <input
            type="text"
            placeholder="Search careers, branches, or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field"
            style={{ paddingLeft: 48, width: "100%" }}
          />
        </div>
      </div>

      {/* Clusters Grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <AnimatePresence>
          {filteredClusters.map((cluster, idx) => {
            const isExpanded = expandedCluster === cluster.id;
            const details = CAREER_DETAILS[cluster.name];

            return (
              <motion.div
                key={cluster.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-card"
                style={{
                  overflow: "hidden",
                  borderLeft: `4px solid ${cluster.color || "var(--accent-red)"}`,
                  cursor: "pointer",
                }}
                onClick={() => setExpandedCluster(isExpanded ? null : cluster.id)}
              >
                {/* Cluster Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div
                      style={{
                        width: 48, height: 48, borderRadius: 12,
                        background: `${cluster.color || "var(--accent-red)"}22`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "1.5rem",
                      }}
                    >
                      {cluster.icon || "📋"}
                    </div>
                    <div>
                      <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: 4 }}>
                        {cluster.name}
                      </h2>
                      <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                        {cluster.description}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span
                      className="badge badge-blue"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {cluster.branches.length} branches
                    </span>
                    {isExpanded ? (
                      <ChevronUpIcon style={{ width: 20, height: 20, color: "var(--text-muted)" }} />
                    ) : (
                      <ChevronDownIcon style={{ width: 20, height: 20, color: "var(--text-muted)" }} />
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Career Overview */}
                      {details && (
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 16,
                            marginTop: 24,
                            padding: 20,
                            background: "rgba(255,255,255,0.03)",
                            borderRadius: 12,
                          }}
                        >
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                              <BriefcaseIcon style={{ width: 16, height: 16, color: "#51cf66" }} />
                              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                Salary Range
                              </span>
                            </div>
                            <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "#51cf66" }}>
                              {details.salary}
                            </p>
                          </div>

                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                              <AcademicCapIcon style={{ width: 16, height: 16, color: "#6b8bff" }} />
                              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                Education Path
                              </span>
                            </div>
                            <p style={{ fontSize: "0.9rem", fontWeight: 500 }}>
                              {details.education}
                            </p>
                          </div>

                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                              <SignalIcon style={{ width: 16, height: 16, color: "#f4a261" }} />
                              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                Market Growth
                              </span>
                            </div>
                            <p style={{ fontSize: "0.9rem", fontWeight: 500, color: "#f4a261" }}>
                              {details.growth}
                            </p>
                          </div>

                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                              <SparklesIcon style={{ width: 16, height: 16, color: "#cc5de8" }} />
                              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                Top Colleges
                              </span>
                            </div>
                            <p style={{ fontSize: "0.85rem", fontWeight: 500 }}>
                              {details.topColleges.join(", ")}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Branches */}
                      <div style={{ marginTop: 20 }}>
                        <h3 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: 12, color: "var(--text-secondary)" }}>
                          SPECIALIZATIONS
                        </h3>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                          {cluster.branches.map((branch, bi) => (
                            <motion.div
                              key={branch.id}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: bi * 0.05 }}
                              style={{
                                padding: 16,
                                background: "rgba(255,255,255,0.04)",
                                borderRadius: 10,
                                border: "1px solid var(--glass-border)",
                              }}
                            >
                              <h4 style={{ fontWeight: 600, marginBottom: 8, fontSize: "0.95rem" }}>
                                {branch.name}
                              </h4>
                              {branch.description && (
                                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: 10, lineHeight: 1.5 }}>
                                  {branch.description}
                                </p>
                              )}
                              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                {branch.competition && (
                                  <span
                                    style={{
                                      fontSize: "0.7rem",
                                      padding: "3px 10px",
                                      borderRadius: 20,
                                      background: `${getCompetitionColor(branch.competition)}22`,
                                      color: getCompetitionColor(branch.competition),
                                      fontWeight: 600,
                                    }}
                                  >
                                    <BoltIcon style={{ width: 10, height: 10, display: "inline", marginRight: 4 }} />
                                    {branch.competition} Competition
                                  </span>
                                )}
                                {branch.effort && (
                                  <span
                                    style={{
                                      fontSize: "0.7rem",
                                      padding: "3px 10px",
                                      borderRadius: 20,
                                      background: "rgba(255,255,255,0.06)",
                                      color: "var(--text-secondary)",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {branch.effort} Effort
                                  </span>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* View Full Details button */}
                      <div style={{ marginTop: 20, textAlign: "center" }}>
                        <Link
                          href={`/student/careers/${cluster.id}`}
                          className="btn-primary"
                          style={{ display: "inline-flex" }}
                        >
                          View Full Details
                          <ArrowRightIcon style={{ width: 16, height: 16 }} />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredClusters.length === 0 && (
          <div className="glass-card" style={{ textAlign: "center", padding: 60 }}>
            <p style={{ color: "var(--text-muted)" }}>
              No careers found matching &quot;{search}&quot;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
