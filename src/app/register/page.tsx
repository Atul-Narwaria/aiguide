"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  SparklesIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      router.push("/login?registered=true");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          left: "15%",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(114, 9, 183, 0.06) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        className="animate-float"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: "100%", maxWidth: 440 }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            justifyContent: "center",
            marginBottom: 40,
            textDecoration: "none",
          }}
        >
          <SparklesIcon style={{ width: 36, height: 36, color: "var(--accent-red)" }} />
          <span className="gradient-text" style={{ fontSize: "1.8rem", fontWeight: 800 }}>
            aiGuide
          </span>
        </Link>

        <div className="glass-card" style={{ padding: 40 }}>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: 8, textAlign: "center" }}>
            Create Account
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              textAlign: "center",
              marginBottom: 32,
              fontSize: "0.9rem",
            }}
          >
            Start your career discovery journey
          </p>

          {error && (
            <div
              style={{
                background: "rgba(230, 57, 70, 0.1)",
                border: "1px solid rgba(230, 57, 70, 0.3)",
                borderRadius: 12,
                padding: "12px 16px",
                marginBottom: 24,
                color: "var(--accent-red-light)",
                fontSize: "0.9rem",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label className="label-text">Full Name</label>
              <div style={{ position: "relative" }}>
                <UserIcon
                  style={{
                    position: "absolute", left: 14, top: "50%",
                    transform: "translateY(-50%)", width: 18, height: 18,
                    color: "var(--text-muted)",
                  }}
                />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  placeholder="Enter your full name"
                  style={{ paddingLeft: 44 }}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label className="label-text">Email</label>
              <div style={{ position: "relative" }}>
                <EnvelopeIcon
                  style={{
                    position: "absolute", left: 14, top: "50%",
                    transform: "translateY(-50%)", width: 18, height: 18,
                    color: "var(--text-muted)",
                  }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="Enter your email"
                  style={{ paddingLeft: 44 }}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label className="label-text">Password</label>
              <div style={{ position: "relative" }}>
                <LockClosedIcon
                  style={{
                    position: "absolute", left: 14, top: "50%",
                    transform: "translateY(-50%)", width: 18, height: 18,
                    color: "var(--text-muted)",
                  }}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="Create password"
                  style={{ paddingLeft: 44 }}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: 32 }}>
              <label className="label-text">Confirm Password</label>
              <div style={{ position: "relative" }}>
                <LockClosedIcon
                  style={{
                    position: "absolute", left: 14, top: "50%",
                    transform: "translateY(-50%)", width: 18, height: 18,
                    color: "var(--text-muted)",
                  }}
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field"
                  placeholder="Confirm password"
                  style={{ paddingLeft: 44 }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: "100%", justifyContent: "center", padding: "14px 32px" }}
            >
              {loading ? (
                "Creating account..."
              ) : (
                <>
                  Create Account
                  <ArrowRightIcon style={{ width: 18, height: 18 }} />
                </>
              )}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              marginTop: 24,
              color: "var(--text-secondary)",
              fontSize: "0.9rem",
            }}
          >
            Already have an account?{" "}
            <Link
              href="/login"
              style={{ color: "var(--accent-red-light)", textDecoration: "none", fontWeight: 600 }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
