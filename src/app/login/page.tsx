"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  SparklesIcon,
  EnvelopeIcon,
  LockClosedIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/student/dashboard");
        router.refresh();
      }
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
        padding: "24px 16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background orbs */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          right: "20%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(230, 57, 70, 0.06) 0%, transparent 70%)",
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
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            justifyContent: "center",
            marginBottom: 32,
            textDecoration: "none",
          }}
        >
          <SparklesIcon style={{ width: 32, height: 32, color: "var(--accent-red)" }} />
          <span className="gradient-text" style={{ fontSize: "1.6rem", fontWeight: 800 }}>
            aiGuide
          </span>
        </Link>

        <div
          className="glass-card"
          style={{ padding: "32px 24px" }}
        >
          <h1 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: 8, textAlign: "center" }}>
            Welcome Back
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              textAlign: "center",
              marginBottom: 32,
              fontSize: "0.9rem",
            }}
          >
            Sign in to continue your career journey
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
              <label className="label-text">Email</label>
              <div style={{ position: "relative" }}>
                <EnvelopeIcon
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 18,
                    height: 18,
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

            <div style={{ marginBottom: 32 }}>
              <label className="label-text">Password</label>
              <div style={{ position: "relative" }}>
                <LockClosedIcon
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 18,
                    height: 18,
                    color: "var(--text-muted)",
                  }}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="Enter your password"
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
                "Signing in..."
              ) : (
                <>
                  Sign In
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
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              style={{ color: "var(--accent-red-light)", textDecoration: "none", fontWeight: 600 }}
            >
              Register here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
