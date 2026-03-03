"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  RocketLaunchIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

const CAREER_OPTIONS = [
  { value: "Engineering", emoji: "⚙️" },
  { value: "Medical", emoji: "🏥" },
  { value: "Business", emoji: "💼" },
  { value: "Arts", emoji: "🎨" },
  { value: "Law", emoji: "⚖️" },
  { value: "Education", emoji: "📚" },
  { value: "Government", emoji: "🏛️" },
  { value: "Defence", emoji: "🎖️" },
  { value: "Technology", emoji: "💻" },
  { value: "Not Sure", emoji: "🤔" },
];

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal",
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    classLevel: 10,
    school: "",
    city: "",
    state: "",
    selfClaimedCareer: "",
  });
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // Redirect to dashboard if onboarding already completed
  useEffect(() => {
    fetch("/api/student/dashboard")
      .then((r) => r.json())
      .then((data) => {
        if (data.profile?.onboardingComplete) {
          router.replace("/student/dashboard");
        } else {
          setChecking(false);
        }
      })
      .catch(() => setChecking(false));
  }, [router]);

  const steps = [
    {
      title: "What class are you in?",
      subtitle: "This helps us tailor questions for your level",
    },
    {
      title: "Tell us about your school",
      subtitle: "Optional – helps us understand your background",
    },
    {
      title: "Do you have a career in mind?",
      subtitle: "It's okay if you don't! We'll help you find one",
    },
  ];

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/student/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save profile");
        return;
      }

      router.push("/student/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    checking ? (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <p style={{ color: "var(--text-muted)" }}>Loading...</p>
      </div>
    ) : (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: "100%", maxWidth: 600 }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <AcademicCapIcon style={{ width: 36, height: 36, color: "var(--accent-red)" }} />
            <h1 style={{ fontSize: "1.6rem", fontWeight: 800 }}>
              Let&apos;s Set Up Your <span className="gradient-text">Profile</span>
            </h1>
          </div>

          {/* Progress */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 8 }}>
            {steps.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === step ? 40 : 12,
                  height: 6,
                  borderRadius: 3,
                  background: i <= step ? "var(--accent-red)" : "rgba(255,255,255,0.1)",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
        </div>

        <div className="glass-card" style={{ padding: 40 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: 8 }}>
                {steps[step].title}
              </h2>
              <p style={{ color: "var(--text-secondary)", marginBottom: 32, fontSize: "0.9rem" }}>
                {steps[step].subtitle}
              </p>

              {/* Step 0: Class */}
              {step === 0 && (
                <div>
                  <label className="label-text">Select your class</label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                    {[6, 7, 8, 9, 10, 11, 12].map((c) => (
                      <div
                        key={c}
                        className={`option-card ${form.classLevel === c ? "selected" : ""}`}
                        onClick={() => setForm({ ...form, classLevel: c })}
                        style={{ textAlign: "center", padding: 16 }}
                      >
                        <div style={{ fontSize: "1.5rem", fontWeight: 800 }}>{c}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Class</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 1: School */}
              {step === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div>
                    <label className="label-text">School Name (Optional)</label>
                    <input
                      className="input-field"
                      value={form.school}
                      onChange={(e) => setForm({ ...form, school: e.target.value })}
                      placeholder="Enter your school name"
                    />
                  </div>
                  <div>
                    <label className="label-text">City (Optional)</label>
                    <input
                      className="input-field"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      placeholder="Enter your city"
                    />
                  </div>
                  <div>
                    <label className="label-text">State (Optional)</label>
                    <select
                      className="input-field"
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                    >
                      <option value="">Select state</option>
                      {STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Step 2: Career */}
              {step === 2 && (
                <div>
                  <label className="label-text">Career you&apos;re interested in</label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
                    {CAREER_OPTIONS.map((career) => (
                      <div
                        key={career.value}
                        className={`option-card ${form.selfClaimedCareer === career.value ? "selected" : ""}`}
                        onClick={() => setForm({ ...form, selfClaimedCareer: career.value })}
                        style={{ display: "flex", alignItems: "center", gap: 12, padding: 16 }}
                      >
                        <span style={{ fontSize: "1.5rem" }}>{career.emoji}</span>
                        <span style={{ fontWeight: 500 }}>{career.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {error && (
            <div
              style={{
                marginTop: 20,
                background: "rgba(230, 57, 70, 0.1)",
                border: "1px solid rgba(230, 57, 70, 0.3)",
                borderRadius: 12,
                padding: "12px 16px",
                color: "var(--accent-red-light)",
                fontSize: "0.9rem",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32 }}>
            {step > 0 ? (
              <button className="btn-secondary" onClick={() => setStep(step - 1)}>
                <ArrowLeftIcon style={{ width: 16, height: 16 }} />
                Back
              </button>
            ) : (
              <div />
            )}
            {step < steps.length - 1 ? (
              <button className="btn-primary" onClick={() => setStep(step + 1)}>
                Next
                <ArrowRightIcon style={{ width: 16, height: 16 }} />
              </button>
            ) : (
              <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  "Saving..."
                ) : (
                  <>
                    <RocketLaunchIcon style={{ width: 18, height: 18 }} />
                    Start My Journey
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
    )
  );
}
