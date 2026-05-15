"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  RocketLaunchIcon,
  SparklesIcon,
  StarIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";

interface Option {
  id: string;
  text: string;
}

interface Question {
  id: string;
  text: string;
  type: string;
  options: Option[];
}

interface AssessmentResult {
  topCodes: Array<{ code: string; score: number; percentage: number }>;
  clusters: Array<{ name: string; score: number; percentage: number }>;
  note: string;
}

const classLevelOptions = [
  { label: "Class 6-7", value: 7 },
  { label: "Class 8-10", value: 10 },
  { label: "Class 11-12", value: 12 },
];

export default function AssessmentPage() {
  const router = useRouter();
  const [guestName, setGuestName] = useState("User");
  const [classLevel, setClassLevel] = useState(10);
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [error, setError] = useState("");

  const fetchQuestions = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/public/assessment?classLevel=${classLevel}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load preview test");
      }

      setQuestions(data.questions || []);
      setAnswers({});
      setCurrentIdx(0);
      setStarted(true);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Failed to load preview test");
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (questionId: string, optionId: string) => {
    setAnswers((current) => ({ ...current, [questionId]: optionId }));
  };

  const submitPreview = async () => {
    setSubmitting(true);
    setError("");

    try {
      const payload = {
        classLevel,
        answers: Object.entries(answers).map(([questionId, optionId]) => ({
          questionId,
          optionId,
        })),
      };

      const res = await fetch("/api/public/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to score preview");
      }

      const finalResult = data as AssessmentResult;
      setResult(finalResult);
      // Persist guest session so register page can import it
      try {
        localStorage.setItem("aiGuide_guestSession", JSON.stringify({
          name: guestName,
          classLevel,
          topCodes: finalResult.topCodes,
          clusters: finalResult.clusters,
          completedAt: new Date().toISOString(),
        }));
      } catch {
        // localStorage unavailable — ignore
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to score preview");
    } finally {
      setSubmitting(false);
    }
  };

  const currentQuestion = questions[currentIdx];
  const progress = questions.length > 0 ? Math.round((Object.keys(answers).length / questions.length) * 100) : 0;
  const allAnswered = questions.length > 0 && Object.keys(answers).length === questions.length;

  return (
    <div style={{ minHeight: "100vh", padding: "32px 20px 80px" }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 32, flexWrap: "wrap" }}>
          <Link href="/" className="btn-secondary" style={{ padding: "10px 18px" }}>
            <ArrowLeftIcon style={{ width: 16, height: 16 }} />
            Back to Home
          </Link>
          <Link href="/login" style={{ padding: "10px 16px", color: "var(--text-muted)", textDecoration: "none", fontSize: "0.9rem" }}>
            Already have an account? Login
          </Link>
        </div>

        <div className="glass-card" style={{ padding: 28, marginBottom: 24 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <SparklesIcon style={{ width: 24, height: 24, color: "var(--accent-red)" }} />
                <span className="gradient-text" style={{ fontSize: "1.2rem", fontWeight: 800 }}>Free Career Preview</span>
              </div>
              <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: 0 }}>Try the test without signing up</h1>
              <p style={{ margin: "10px 0 0", color: "var(--text-secondary)", maxWidth: 620, lineHeight: 1.6 }}>
                Answer a few questions to see your strongest career clusters.
                No account is needed to start. Create one later only if you want to save progress, use AI chat, or access the student dashboard.
              </p>
            </div>

            {!started && (
              <div style={{ minWidth: 260 }}>
                <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 8 }}>
                  Your name
                </label>
                <input
                  type="text"
                  value={guestName === "User" ? "" : guestName}
                  onChange={(e) => setGuestName(e.target.value.trim() || "User")}
                  className="input-field"
                  placeholder="Enter your name (optional)"
                  style={{ marginBottom: 12 }}
                />
                <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 8 }}>
                  Select your class level
                </label>
                <select
                  value={classLevel}
                  onChange={(event) => setClassLevel(Number(event.target.value))}
                  className="input-field"
                >
                  {classLevelOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={fetchQuestions}
                  disabled={loading}
                  className="btn-primary"
                  style={{ width: "100%", marginTop: 12 }}
                >
                  {loading ? "Loading preview..." : "Start Free Preview"}
                </button>
              </div>
            )}
          </div>

          {error && (
            <div style={{ marginTop: 16, padding: 14, borderRadius: 14, background: "rgba(230,57,70,0.08)", border: "1px solid rgba(230,57,70,0.2)", color: "#ffb3b8" }}>
              {error}
            </div>
          )}
        </div>

        {started && !result && currentQuestion && (
          <>
            <div style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, gap: 12 }}>
                <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  Question {currentIdx + 1} of {questions.length}
                </span>
                <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                  {Object.keys(answers).length} answered
                </span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
                className="glass-card"
                style={{ padding: 28, marginBottom: 20 }}
              >
                <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                  <span className="badge badge-blue">{currentQuestion.type.replace("_", " ")}</span>
                  <span className="badge badge-red">Free preview</span>
                </div>

                <h2 style={{ fontSize: "1.25rem", lineHeight: 1.6, fontWeight: 700, marginBottom: 24 }}>
                  {currentQuestion.text}
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {currentQuestion.options.map((option, index) => {
                    const selected = answers[currentQuestion.id] === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => selectAnswer(currentQuestion.id, option.id)}
                        className={`option-card ${selected ? "selected" : ""}`}
                        style={{ display: "flex", alignItems: "center", gap: 14, textAlign: "left" }}
                      >
                        <div
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            border: `2px solid ${selected ? "var(--accent-red)" : "var(--glass-border)"}`,
                            background: selected ? "var(--accent-red)" : "transparent",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            fontWeight: 700,
                            fontSize: "0.75rem",
                          }}
                        >
                          {selected ? <CheckCircleIcon style={{ width: 16, height: 16 }} /> : String.fromCharCode(65 + index)}
                        </div>
                        <span style={{ fontSize: "0.96rem", lineHeight: 1.5 }}>{option.text}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setCurrentIdx((current) => Math.max(0, current - 1))}
                disabled={currentIdx === 0}
                style={{ opacity: currentIdx === 0 ? 0.35 : 1 }}
              >
                <ArrowLeftIcon style={{ width: 16, height: 16 }} />
                Previous
              </button>

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
                {questions.map((question, index) => (
                  <button
                    key={question.id}
                    type="button"
                    onClick={() => setCurrentIdx(index)}
                    style={{
                      width: index === currentIdx ? 24 : 9,
                      height: 9,
                      borderRadius: 999,
                      border: "none",
                      background: answers[question.id] ? "var(--accent-red)" : index === currentIdx ? "rgba(230,57,70,0.4)" : "rgba(255,255,255,0.12)",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    aria-label={`Go to question ${index + 1}`}
                  />
                ))}
              </div>

              {currentIdx < questions.length - 1 ? (
                <button className="btn-primary" type="button" onClick={() => setCurrentIdx((current) => current + 1)}>
                  Next
                  <ArrowRightIcon style={{ width: 16, height: 16 }} />
                </button>
              ) : (
                <button className="btn-primary" type="button" onClick={submitPreview} disabled={!allAnswered || submitting}>
                  {submitting ? "Scoring preview..." : "See My Preview Result"}
                  <TrophyIcon style={{ width: 18, height: 18 }} />
                </button>
              )}
            </div>
          </>
        )}

        {result && (
          <div style={{ display: "grid", gap: 20 }}>
            <div className="glass-card" style={{ padding: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <StarIcon style={{ width: 22, height: 22, color: "var(--accent-red)" }} />
                <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 800 }}>
                  {guestName !== "User" ? `${guestName}'s career preview` : "Your free preview"}
                </h2>
              </div>
              <p style={{ margin: "0 0 18px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {result.note}
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 24 }}>
                {result.topCodes.map((code) => (
                  <div key={code.code} style={{ padding: 18, borderRadius: 18, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ fontSize: "1.35rem", fontWeight: 900, color: "var(--accent-red)", marginBottom: 6 }}>{code.code}</div>
                    <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: 8 }}>Strong match</div>
                    <div style={{ fontWeight: 700 }}>{code.percentage}% of your preview</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <SparklesIcon style={{ width: 20, height: 20, color: "var(--accent-red)" }} />
                <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800 }}>Top career clusters</h3>
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                {result.clusters.map((cluster, index) => (
                  <div key={cluster.name} style={{ padding: 16, borderRadius: 16, background: index === 0 ? "rgba(230,57,70,0.08)" : "rgba(255,255,255,0.04)", border: `1px solid ${index === 0 ? "rgba(230,57,70,0.22)" : "rgba(255,255,255,0.08)"}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
                      <strong>{cluster.name}</strong>
                      <span style={{ color: index === 0 ? "var(--accent-red)" : "var(--text-secondary)", fontWeight: 700 }}>{cluster.percentage}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width: `${cluster.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card" style={{ padding: 28, textAlign: "center" }}>
              <h3 style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: 12 }}>Want the full report?</h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 720, margin: "0 auto 24px" }}>
                Create a free account to save these results, unlock AI career counseling, and access the full student dashboard.
                {guestName !== "User" && ` Your profile is already set up as "${guestName}".`}
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/register" className="btn-primary" style={{ padding: "14px 28px" }}>
                  Save results & create account
                  <RocketLaunchIcon style={{ width: 18, height: 18 }} />
                </Link>
                <button className="btn-secondary" type="button" onClick={() => router.push("/")}>
                  Back to home
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}