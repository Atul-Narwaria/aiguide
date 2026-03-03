"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeftIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  SignalIcon,
  BoltIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  BuildingLibraryIcon,
  CurrencyRupeeIcon,
  ClockIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

interface Branch {
  id: string;
  name: string;
  description: string | null;
  eligibility: string | null;
  competition: string | null;
  effort: string | null;
}

interface ClusterDetail {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  branches: Branch[];
}

interface UserScore {
  percentage: number;
  rank: number;
}

const CAREER_DETAILS: Record<
  string,
  {
    salary: string;
    entrySalary: string;
    seniorSalary: string;
    topColleges: string[];
    entranceExams: string[];
    education: string;
    educationSteps: string[];
    growth: string;
    growthLabel: string;
    skills: string[];
  }
> = {
  Engineering: {
    salary: "₹6-80 LPA",
    entrySalary: "₹6-25 LPA",
    seniorSalary: "₹25-80 LPA",
    topColleges: [
      "IIT Bombay",
      "IIT Delhi",
      "IIT Madras",
      "BITS Pilani",
      "NIT Trichy",
    ],
    entranceExams: ["JEE Main", "JEE Advanced", "BITSAT", "VITEEE", "SRMJEE"],
    education: "B.Tech/B.E. (4 years) → M.Tech/MS",
    educationSteps: [
      "Class 11-12: PCM with JEE prep",
      "B.Tech/B.E. (4 years)",
      "M.Tech/MS (optional, 2 years)",
      "PhD (optional, 4-5 years)",
    ],
    growth: "High",
    growthLabel: "India's fastest growing sector",
    skills: [
      "Mathematics",
      "Physics",
      "Problem Solving",
      "Logical Thinking",
      "Programming",
    ],
  },
  "Medical & Healthcare": {
    salary: "₹8 LPA - ₹1Cr+",
    entrySalary: "₹8-20 LPA",
    seniorSalary: "₹20 LPA - ₹1Cr+",
    topColleges: [
      "AIIMS Delhi",
      "CMC Vellore",
      "JIPMER",
      "Maulana Azad MC",
      "KEM Mumbai",
    ],
    entranceExams: ["NEET UG", "NEET PG", "AIIMS", "JIPMER"],
    education: "MBBS (5.5 years) → MD/MS (3 years)",
    educationSteps: [
      "Class 11-12: PCB with NEET prep",
      "MBBS (5.5 years incl. internship)",
      "MD/MS Specialization (3 years)",
      "Super Specialization DM/MCh (optional)",
    ],
    growth: "Very High",
    growthLabel: "Growing demand post-pandemic",
    skills: [
      "Biology",
      "Chemistry",
      "Empathy",
      "Manual Dexterity",
      "Critical Thinking",
    ],
  },
  "Business & Commerce": {
    salary: "₹5 LPA - ₹1Cr+",
    entrySalary: "₹5-15 LPA",
    seniorSalary: "₹20 LPA - ₹1Cr+",
    topColleges: [
      "IIM Ahmedabad",
      "IIM Bangalore",
      "SRCC Delhi",
      "XLRI",
      "FMS Delhi",
    ],
    entranceExams: ["CAT", "XAT", "CA Foundation", "CLAT (Corp Law)", "GMAT"],
    education: "B.Com/BBA (3 years) → MBA/CA",
    educationSteps: [
      "Class 11-12: Commerce stream",
      "B.Com/BBA (3 years)",
      "CA / MBA (2-3 years)",
      "CFA / ACCA (optional)",
    ],
    growth: "High",
    growthLabel: "India's growing economy needs business talent",
    skills: [
      "Analytical Thinking",
      "Communication",
      "Leadership",
      "Accounting",
      "Negotiation",
    ],
  },
  "Arts & Humanities": {
    salary: "₹3-50 LPA",
    entrySalary: "₹3-10 LPA",
    seniorSalary: "₹15-50 LPA",
    topColleges: [
      "NID",
      "NIFT",
      "FTII Pune",
      "JNU",
      "St. Stephen's College",
    ],
    entranceExams: [
      "NID DAT",
      "NIFT Entrance",
      "UCEED",
      "CUET",
      "JNU Entrance",
    ],
    education: "BA/BFA/B.Des (3-4 years) → MA/MFA",
    educationSteps: [
      "Class 11-12: Any stream (Humanities preferred)",
      "BA/BFA/B.Des (3-4 years)",
      "MA/MFA (2 years)",
      "PhD / Portfolio career",
    ],
    growth: "Medium",
    growthLabel: "Growing with digital & creative economy",
    skills: [
      "Creativity",
      "Communication",
      "Critical Thinking",
      "Research",
      "Writing",
    ],
  },
  "Law & Legal": {
    salary: "₹5 LPA - ₹1Cr+",
    entrySalary: "₹5-12 LPA",
    seniorSalary: "₹25 LPA - ₹1Cr+",
    topColleges: [
      "NLSIU Bangalore",
      "NLU Delhi",
      "NALSAR Hyderabad",
      "NUJS Kolkata",
      "GNLU",
    ],
    entranceExams: ["CLAT", "AILET", "LSAT India", "MH CET Law"],
    education: "BA LLB (5 years) or LLB (3 years)",
    educationSteps: [
      "Class 11-12: Any stream (Humanities preferred)",
      "BA LLB Integrated (5 years) or LLB after graduation (3 years)",
      "LLM Specialization (optional)",
      "Judicial Services / Bar Practice",
    ],
    growth: "High",
    growthLabel: "Corporate law & litigation growing rapidly",
    skills: [
      "Logical Reasoning",
      "Communication",
      "Research",
      "Argumentation",
      "Writing",
    ],
  },
  "Education & Teaching": {
    salary: "₹3-30 LPA",
    entrySalary: "₹3-8 LPA",
    seniorSalary: "₹10-30 LPA",
    topColleges: [
      "IGNOU",
      "Lady Shri Ram",
      "Jamia Millia",
      "TISS",
      "Azim Premji University",
    ],
    entranceExams: [
      "CUET",
      "B.Ed Entrance",
      "CTET",
      "State TET",
      "UGC NET",
    ],
    education: "B.Ed (2 years) after graduation",
    educationSteps: [
      "Class 11-12: Any stream",
      "Graduation in subject (3-4 years)",
      "B.Ed (2 years)",
      "CTET/TET Qualification",
    ],
    growth: "Steady",
    growthLabel: "EdTech revolution creating new opportunities",
    skills: [
      "Communication",
      "Patience",
      "Subject Expertise",
      "Mentoring",
      "Adaptability",
    ],
  },
  "Government & Civil Services": {
    salary: "₹6-30 LPA + Perks",
    entrySalary: "₹6-15 LPA + Perks",
    seniorSalary: "₹15-30 LPA + Perks",
    topColleges: [
      "LBSNAA Mussoorie",
      "Any top university for graduation",
    ],
    entranceExams: ["UPSC CSE", "State PSC", "SSC CGL", "IBPS PO", "RBI Grade B"],
    education: "Any Graduation → UPSC/State PSC",
    educationSteps: [
      "Class 11-12: Any stream",
      "Any Graduation (3-4 years)",
      "UPSC/PSC preparation (1-3 years)",
      "Training at LBSNAA (2 years)",
    ],
    growth: "Stable",
    growthLabel: "Prestigious career with job security",
    skills: [
      "General Knowledge",
      "Writing",
      "Leadership",
      "Decision Making",
      "Ethics",
    ],
  },
  "Defence & Security": {
    salary: "₹6-25 LPA + Perks",
    entrySalary: "₹6-12 LPA + Perks",
    seniorSalary: "₹15-25 LPA + Perks",
    topColleges: [
      "NDA Khadakwasla",
      "IMA Dehradun",
      "NA Ezhimala",
      "AFA Dundigal",
      "OTA Chennai",
    ],
    entranceExams: ["NDA", "CDS", "AFCAT", "INET", "Territorial Army"],
    education: "NDA/CDS after 12th/Graduation",
    educationSteps: [
      "Class 11-12: PCM preferred (for NDA technical)",
      "NDA (3 years) or CDS after graduation",
      "Pre-commission training (1 year)",
      "Service & promotions",
    ],
    growth: "Stable",
    growthLabel: "India modernizing defence rapidly",
    skills: [
      "Physical Fitness",
      "Leadership",
      "Discipline",
      "Strategic Thinking",
      "Teamwork",
    ],
  },
  "Technology & IT": {
    salary: "₹8 LPA - ₹1Cr+",
    entrySalary: "₹8-30 LPA",
    seniorSalary: "₹30 LPA - ₹1Cr+",
    topColleges: [
      "IIT Bombay",
      "IIIT Hyderabad",
      "IISc Bangalore",
      "BITS Pilani",
      "DTU Delhi",
    ],
    entranceExams: [
      "JEE Main",
      "JEE Advanced",
      "BITSAT",
      "IIIT Entrance",
      "CUET (BCA)",
    ],
    education: "B.Tech CS/IT (4 years) or BCA + MCA",
    educationSteps: [
      "Class 11-12: PCM with coding practice",
      "B.Tech CS/IT (4 years) or BCA (3 years)",
      "MCA / MS (optional, 2 years)",
      "Certifications (AWS, Google Cloud, etc.)",
    ],
    growth: "Very High",
    growthLabel: "AI, Cloud, and Data driving massive demand",
    skills: [
      "Programming",
      "Problem Solving",
      "Mathematics",
      "System Design",
      "Continuous Learning",
    ],
  },
  "Science & Research": {
    salary: "₹4-40 LPA",
    entrySalary: "₹4-12 LPA",
    seniorSalary: "₹15-40 LPA",
    topColleges: [
      "IISc Bangalore",
      "TIFR Mumbai",
      "IISERs",
      "JNU",
      "IIT (for research)",
    ],
    entranceExams: [
      "IAT (IISER)",
      "NEST (NISER)",
      "KVPY",
      "JAM",
      "CSIR NET",
    ],
    education: "B.Sc (3 years) → M.Sc → PhD",
    educationSteps: [
      "Class 11-12: Science stream",
      "B.Sc / BS / Integrated MS (3-5 years)",
      "M.Sc (2 years)",
      "PhD Research (4-5 years)",
    ],
    growth: "Growing",
    growthLabel: "India investing in R&D and space programs",
    skills: [
      "Scientific Thinking",
      "Research Methodology",
      "Data Analysis",
      "Patience",
      "Academic Writing",
    ],
  },
};

const getGrowthColor = (growth: string) => {
  switch (growth) {
    case "Very High":
      return "#51cf66";
    case "High":
      return "#69db7c";
    case "Medium":
      return "#f4a261";
    case "Steady":
    case "Stable":
      return "#6b8bff";
    case "Growing":
      return "#69db7c";
    default:
      return "var(--text-muted)";
  }
};

const getCompetitionColor = (level: string | null) => {
  switch (level) {
    case "High":
      return "#e63946";
    case "Medium":
      return "#f4a261";
    case "Low":
      return "#51cf66";
    default:
      return "var(--text-muted)";
  }
};

export default function CareerDetailPage() {
  const { clusterId } = useParams();
  const router = useRouter();
  const [cluster, setCluster] = useState<ClusterDetail | null>(null);
  const [userScore, setUserScore] = useState<UserScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCluster();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clusterId]);

  const fetchCluster = async () => {
    try {
      const res = await fetch(`/api/student/careers/${clusterId}`);
      if (res.ok) {
        const data = await res.json();
        setCluster(data.cluster);
        setUserScore(data.userScore);
      } else {
        router.push("/student/careers");
      }
    } catch {
      router.push("/student/careers");
    } finally {
      setLoading(false);
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
          <p style={{ color: "var(--text-muted)" }}>Loading career details...</p>
        </div>
      </div>
    );
  }

  if (!cluster) return null;

  const details = CAREER_DETAILS[cluster.name];
  const clusterColor = cluster.color || "var(--accent-red)";

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.push("/student/careers")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "none",
          border: "none",
          color: "var(--text-secondary)",
          cursor: "pointer",
          fontSize: "0.9rem",
          marginBottom: 24,
          padding: 0,
        }}
      >
        <ArrowLeftIcon style={{ width: 18, height: 18 }} />
        Back to Career Explorer
      </motion.button>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: `linear-gradient(135deg, ${clusterColor}15, ${clusterColor}08)`,
          border: `1px solid ${clusterColor}30`,
          borderRadius: 20,
          padding: 40,
          marginBottom: 24,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: `${clusterColor}08`,
            filter: "blur(40px)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            position: "relative",
            zIndex: 1,
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          <div style={{ flex: 1, minWidth: 280 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: `${clusterColor}22`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                marginBottom: 16,
              }}
            >
              {cluster.icon || "📋"}
            </div>
            <h1
              style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 8 }}
            >
              {cluster.name}
            </h1>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "1rem",
                lineHeight: 1.6,
                marginBottom: 16,
                maxWidth: 600,
              }}
            >
              {cluster.description}
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {details && (
                <span
                  style={{
                    padding: "6px 14px",
                    borderRadius: 20,
                    background: `${getGrowthColor(details.growth)}18`,
                    color: getGrowthColor(details.growth),
                    fontSize: "0.8rem",
                    fontWeight: 600,
                  }}
                >
                  📈 {details.growth} Growth
                </span>
              )}
              <span
                className="badge badge-blue"
                style={{ fontSize: "0.8rem" }}
              >
                {cluster.branches.length} Specializations
              </span>
              {details && (
                <span
                  className="badge badge-green"
                  style={{ fontSize: "0.8rem" }}
                >
                  💰 {details.salary}
                </span>
              )}
            </div>
          </div>

          {/* User's Score Card */}
          {userScore && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              style={{
                background: "var(--glass-bg)",
                border: "1px solid var(--glass-border)",
                borderRadius: 16,
                padding: 24,
                textAlign: "center",
                minWidth: 160,
              }}
            >
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: 8,
                }}
              >
                Your Match
              </p>
              <p
                className="gradient-text"
                style={{ fontSize: "2.5rem", fontWeight: 800, lineHeight: 1 }}
              >
                {userScore.percentage.toFixed(0)}%
              </p>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                  marginTop: 4,
                }}
              >
                Rank #{userScore.rank}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Quick Stats Grid */}
      {details && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 12,
            marginBottom: 24,
          }}
        >
          {[
            {
              icon: CurrencyRupeeIcon,
              label: "Entry Salary",
              value: details.entrySalary,
              color: "#51cf66",
            },
            {
              icon: BriefcaseIcon,
              label: "Senior Salary",
              value: details.seniorSalary,
              color: "#69db7c",
            },
            {
              icon: SignalIcon,
              label: "Market Growth",
              value: details.growthLabel,
              color: getGrowthColor(details.growth),
            },
            {
              icon: AcademicCapIcon,
              label: "Education",
              value: details.education,
              color: "#6b8bff",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="glass-card"
              style={{ padding: 18 }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <stat.icon
                  style={{ width: 16, height: 16, color: stat.color }}
                />
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {stat.label}
                </span>
              </div>
              <p style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Education Roadmap + Key Skills */}
      {details && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginBottom: 24,
          }}
        >
          {/* Education Roadmap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
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
              <ClockIcon
                style={{ width: 20, height: 20, color: "#6b8bff" }}
              />
              <h2 style={{ fontWeight: 700, fontSize: "1.05rem" }}>
                Education Roadmap
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {details.educationSteps.map((step, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 12,
                    paddingBottom: i < details.educationSteps.length - 1 ? 20 : 0,
                    position: "relative",
                  }}
                >
                  {/* Timeline line */}
                  {i < details.educationSteps.length - 1 && (
                    <div
                      style={{
                        position: "absolute",
                        left: 11,
                        top: 24,
                        bottom: 0,
                        width: 2,
                        background: `linear-gradient(to bottom, ${clusterColor}40, ${clusterColor}10)`,
                      }}
                    />
                  )}
                  {/* Timeline dot */}
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: `${clusterColor}22`,
                      border: `2px solid ${clusterColor}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      color: clusterColor,
                    }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "0.88rem",
                        fontWeight: 500,
                        lineHeight: 1.5,
                        paddingTop: 2,
                      }}
                    >
                      {step}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Key Skills & Entrance Exams */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
                  marginBottom: 16,
                }}
              >
                <SparklesIcon
                  style={{ width: 20, height: 20, color: "#cc5de8" }}
                />
                <h2 style={{ fontWeight: 700, fontSize: "1.05rem" }}>
                  Key Skills Required
                </h2>
              </div>
              <div
                style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
              >
                {details.skills.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 20,
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid var(--glass-border)",
                      fontSize: "0.82rem",
                      fontWeight: 500,
                      color: "var(--text-secondary)",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                <BuildingLibraryIcon
                  style={{ width: 20, height: 20, color: "#f4a261" }}
                />
                <h2 style={{ fontWeight: 700, fontSize: "1.05rem" }}>
                  Entrance Exams
                </h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {details.entranceExams.map((exam) => (
                  <div
                    key={exam}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: "0.88rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <CheckCircleIcon
                      style={{
                        width: 16,
                        height: 16,
                        color: "#f4a261",
                        flexShrink: 0,
                      }}
                    />
                    {exam}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Top Colleges */}
      {details && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="glass-card"
          style={{ marginBottom: 24 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
            }}
          >
            <AcademicCapIcon
              style={{ width: 20, height: 20, color: "#6b8bff" }}
            />
            <h2 style={{ fontWeight: 700, fontSize: "1.05rem" }}>
              Top Colleges in India
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            {details.topColleges.map((college, i) => (
              <div
                key={college}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 16px",
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: 10,
                  border: "1px solid var(--glass-border)",
                }}
              >
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: `${clusterColor}18`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: clusterColor,
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </span>
                <span
                  style={{
                    fontSize: "0.88rem",
                    fontWeight: 500,
                  }}
                >
                  {college}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Specializations / Branches */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{ marginBottom: 24 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <ChartBarIcon
            style={{ width: 20, height: 20, color: "var(--accent-red)" }}
          />
          <h2 style={{ fontWeight: 700, fontSize: "1.15rem" }}>
            Specializations ({cluster.branches.length})
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          {cluster.branches.map((branch, i) => (
            <motion.div
              key={branch.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.04 }}
              className="glass-card"
              style={{
                borderLeft: `3px solid ${clusterColor}`,
                padding: 20,
              }}
            >
              <h3
                style={{
                  fontWeight: 700,
                  fontSize: "1rem",
                  marginBottom: 8,
                }}
              >
                {branch.name}
              </h3>
              {branch.description && (
                <p
                  style={{
                    fontSize: "0.82rem",
                    color: "var(--text-secondary)",
                    marginBottom: 10,
                    lineHeight: 1.6,
                  }}
                >
                  {branch.description}
                </p>
              )}
              {branch.eligibility && (
                <p
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--text-muted)",
                    marginBottom: 10,
                    lineHeight: 1.5,
                  }}
                >
                  📋 {branch.eligibility}
                </p>
              )}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {branch.competition && (
                  <span
                    style={{
                      fontSize: "0.72rem",
                      padding: "3px 10px",
                      borderRadius: 20,
                      background: `${getCompetitionColor(branch.competition)}22`,
                      color: getCompetitionColor(branch.competition),
                      fontWeight: 600,
                    }}
                  >
                    <BoltIcon
                      style={{
                        width: 10,
                        height: 10,
                        display: "inline",
                        marginRight: 4,
                      }}
                    />
                    {branch.competition} Competition
                  </span>
                )}
                {branch.effort && (
                  <span
                    style={{
                      fontSize: "0.72rem",
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
      </motion.div>

      {/* Ask AI CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card"
        style={{
          textAlign: "center",
          padding: "40px 24px",
          background: "linear-gradient(135deg, rgba(230,57,70,0.08), rgba(67,97,238,0.08))",
          borderColor: "rgba(230,57,70,0.2)",
          marginBottom: 32,
        }}
      >
        <ChatBubbleLeftRightIcon
          style={{
            width: 40,
            height: 40,
            color: "var(--accent-red)",
            margin: "0 auto 16px",
          }}
        />
        <h2
          style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: 8 }}
        >
          Have questions about{" "}
          <span className="gradient-text">{cluster.name}</span>?
        </h2>
        <p
          style={{
            color: "var(--text-secondary)",
            marginBottom: 20,
            maxWidth: 480,
            margin: "0 auto 20px",
          }}
        >
          Our AI Career Counselor knows your assessment results and can give
          you personalized advice about this career path.
        </p>
        <Link
          href={`/student/chat?prompt=${encodeURIComponent(`Tell me more about ${cluster.name} as a career. What are the best opportunities and what should I focus on?`)}`}
          className="btn-primary"
          style={{ display: "inline-flex" }}
        >
          <SparklesIcon style={{ width: 18, height: 18 }} />
          Ask AI About {cluster.name}
        </Link>
      </motion.div>
    </div>
  );
}
