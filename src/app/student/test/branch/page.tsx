"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockIcon,
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

export default function BranchTestPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [clusterName, setClusterName] = useState("");
  const router = useRouter();

  const fetchQuestions = useCallback(async () => {
    try {
      const res = await fetch("/api/student/test/branch/questions");
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions);
        setAssessmentId(data.assessmentId);
        setClusterName(data.clusterName || "");
      }
    } catch (error) {
      console.error("Failed to fetch branch questions:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const selectAnswer = (questionId: string, optionId: string) => {
    setAnswers({ ...answers, [questionId]: optionId });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const answerArray = Object.entries(answers).map(([questionId, optionId]) => ({
        questionId,
        optionId,
      }));

      const res = await fetch("/api/student/test/branch/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessmentId, answers: answerArray }),
      });

      if (res.ok) {
        router.push("/student/results");
      }
    } catch (error) {
      console.error("Failed to submit:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <p style={{ color: "var(--text-muted)" }}>Loading branch questions...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div className="glass-card" style={{ textAlign: "center", padding: 60, maxWidth: 500 }}>
          <p style={{ color: "var(--text-muted)", marginBottom: 16 }}>
            No branch-level questions available yet. The admin needs to add branch-specific questions.
          </p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];
  const progress = ((Object.keys(answers).length / questions.length) * 100).toFixed(0);
  const allAnswered = Object.keys(answers).length === questions.length;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 8 }}>
          {clusterName} <span className="gradient-text">Deep Dive</span>
        </h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: 16 }}>
          Let&apos;s find your ideal branch within {clusterName}
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
          <div className="progress-bar" style={{ flex: 1 }}>
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
          <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 600 }}>
            {progress}%
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            Question {currentIdx + 1} of {questions.length}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)", fontSize: "0.8rem" }}>
            <ClockIcon style={{ width: 14, height: 14 }} />
            {Object.keys(answers).length} answered
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
          className="glass-card"
          style={{ padding: 40, marginBottom: 24 }}
        >
          <span className="badge badge-purple" style={{ marginBottom: 16 }}>
            {currentQuestion.type.replace("_", " ")}
          </span>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 600, lineHeight: 1.6, marginBottom: 32 }}>
            {currentQuestion.text}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {currentQuestion.options.map((option, i) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`option-card ${answers[currentQuestion.id] === option.id ? "selected" : ""}`}
                onClick={() => selectAnswer(currentQuestion.id, option.id)}
                style={{ display: "flex", alignItems: "center", gap: 16 }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    border: `2px solid ${answers[currentQuestion.id] === option.id ? "var(--accent-red)" : "var(--glass-border)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    background: answers[currentQuestion.id] === option.id ? "var(--accent-red)" : "transparent",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                  }}
                >
                  {answers[currentQuestion.id] === option.id ? (
                    <CheckCircleIcon style={{ width: 16, height: 16 }} />
                  ) : (
                    String.fromCharCode(65 + i)
                  )}
                </div>
                <span style={{ fontSize: "0.95rem", lineHeight: 1.5 }}>{option.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          className="btn-secondary"
          onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
          disabled={currentIdx === 0}
          style={{ opacity: currentIdx === 0 ? 0.3 : 1 }}
        >
          <ArrowLeftIcon style={{ width: 16, height: 16 }} />
          Previous
        </button>

        {currentIdx < questions.length - 1 ? (
          <button className="btn-primary" onClick={() => setCurrentIdx(currentIdx + 1)}>
            Next
            <ArrowRightIcon style={{ width: 16, height: 16 }} />
          </button>
        ) : (
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={!allAnswered || submitting}
          >
            {submitting ? "Submitting..." : (
              <>
                Get My Results
                <CheckCircleIcon style={{ width: 18, height: 18 }} />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
