"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  AcademicCapIcon,
  SparklesIcon,
  ChartBarIcon,
  RocketLaunchIcon,
  UserGroupIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* Header */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          padding: "16px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(15, 15, 26, 0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--glass-border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <SparklesIcon style={{ width: 32, height: 32, color: "var(--accent-red)" }} />
          <span
            style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              letterSpacing: "-0.5px",
            }}
            className="gradient-text"
          >
            aiGuide
          </span>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <Link href="/login" className="btn-secondary" style={{ padding: "10px 24px" }}>
            Login
          </Link>
          <Link href="/register" className="btn-primary" style={{ padding: "10px 24px" }}>
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "100px 24px 60px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated background orbs */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "15%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(230, 57, 70, 0.08) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          className="animate-float"
        />
        <div
          style={{
            position: "absolute",
            bottom: "20%",
            right: "10%",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(67, 97, 238, 0.08) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          className="animate-float"
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ maxWidth: 800, position: "relative", zIndex: 1 }}
        >
          <div
            className="badge badge-red"
            style={{ marginBottom: 20, fontSize: "0.8rem" }}
          >
            🎓 For Indian Students – Class 6 to 12
          </div>
          <h1
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: 24,
            }}
          >
            Discover Your{" "}
            <span className="gradient-text">Perfect Career</span>
            <br />
            with AI-Powered Guidance
          </h1>
          <p
            style={{
              fontSize: "1.15rem",
              color: "var(--text-secondary)",
              maxWidth: 600,
              margin: "0 auto 40px",
              lineHeight: 1.7,
            }}
          >
            Stop guessing your future. Our scientific assessment platform analyzes
            your interests, aptitude, and personality to recommend the career path
            that truly fits you.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register" className="btn-primary" style={{ padding: "16px 40px", fontSize: "1.05rem" }}>
              <RocketLaunchIcon style={{ width: 20, height: 20 }} />
              Start Free Assessment
            </Link>
            <Link href="#how-it-works" className="btn-secondary" style={{ padding: "16px 40px", fontSize: "1.05rem" }}>
              Learn More
            </Link>
          </div>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 48,
              marginTop: 60,
              flexWrap: "wrap",
            }}
          >
            {[
              { value: "50+", label: "Career Paths" },
              { value: "200+", label: "Assessment Questions" },
              { value: "12", label: "Career Clusters" },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <div
                  className="gradient-text"
                  style={{ fontSize: "2rem", fontWeight: 800 }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        style={{ padding: "80px 24px", maxWidth: 1200, margin: "0 auto" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 60 }}
        >
          <h2 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: 16 }}>
            How It <span className="gradient-text">Works</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
            A scientific 5-step journey to discover your ideal career
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
          }}
        >
          {[
            {
              icon: <UserGroupIcon style={{ width: 28, height: 28 }} />,
              step: "01",
              title: "Quick Onboarding",
              desc: "Tell us your class, school, and any career you already have in mind.",
            },
            {
              icon: <SparklesIcon style={{ width: 28, height: 28 }} />,
              step: "02",
              title: "Interest Discovery Test",
              desc: "Answer 30-50 scientifically designed questions to uncover your true inclinations.",
            },
            {
              icon: <CheckCircleIcon style={{ width: 28, height: 28 }} />,
              step: "03",
              title: "Claim Validation",
              desc: "We validate if your self-chosen career matches your test results with honest feedback.",
            },
            {
              icon: <AcademicCapIcon style={{ width: 28, height: 28 }} />,
              step: "04",
              title: "Branch-Level Deep Dive",
              desc: "Take a focused test to pinpoint your exact branch within your career cluster.",
            },
            {
              icon: <ChartBarIcon style={{ width: 28, height: 28 }} />,
              step: "05",
              title: "Smart Recommendations",
              desc: "Get your best-fit branch, 2 backups, risk factors, and a reality check.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card"
              style={{ position: "relative" }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 16,
                  right: 20,
                  fontSize: "3rem",
                  fontWeight: 900,
                  opacity: 0.06,
                  color: "var(--accent-red)",
                }}
              >
                {item.step}
              </div>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: "rgba(230, 57, 70, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent-red-light)",
                  marginBottom: 16,
                }}
              >
                {item.icon}
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 8 }}>
                {item.title}
              </h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Career Clusters Preview */}
      <section style={{ padding: "80px 24px", background: "rgba(255,255,255,0.01)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: 60 }}
          >
            <h2 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: 16 }}>
              Career <span className="gradient-text">Clusters</span> We Cover
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
              Explore 12+ career clusters, each with dozens of branches
            </p>
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 16,
            }}
          >
            {[
              { name: "Engineering", emoji: "⚙️", color: "#4361ee" },
              { name: "Medical", emoji: "🏥", color: "#e63946" },
              { name: "Business", emoji: "💼", color: "#f8961e" },
              { name: "Arts & Design", emoji: "🎨", color: "#7209b7" },
              { name: "Law", emoji: "⚖️", color: "#457b9d" },
              { name: "Education", emoji: "📚", color: "#2a9d8f" },
              { name: "Government", emoji: "🏛️", color: "#264653" },
              { name: "Defence", emoji: "🎖️", color: "#606c38" },
              { name: "Sports", emoji: "🏅", color: "#bc6c25" },
              { name: "Technology", emoji: "💻", color: "#00b4d8" },
              { name: "Creative Arts", emoji: "🎭", color: "#e76f51" },
              { name: "Vocational", emoji: "🔧", color: "#6c757d" },
            ].map((cluster, i) => (
              <motion.div
                key={cluster.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{
                  padding: "24px 16px",
                  borderRadius: 16,
                  background: "var(--glass-bg)",
                  border: "1px solid var(--glass-border)",
                  textAlign: "center",
                  cursor: "default",
                  transition: "all 0.3s ease",
                }}
                whileHover={{
                  borderColor: cluster.color,
                  boxShadow: `0 0 20px ${cluster.color}20`,
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: 8 }}>{cluster.emoji}</div>
                <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{cluster.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: "100px 24px", textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            maxWidth: 600,
            margin: "0 auto",
            background: "var(--glass-bg)",
            border: "1px solid var(--glass-border)",
            borderRadius: 24,
            padding: "60px 40px",
          }}
        >
          <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 16 }}>
            Ready to Find Your{" "}
            <span className="gradient-text">True Calling?</span>
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              marginBottom: 32,
              lineHeight: 1.7,
            }}
          >
            Join thousands of students who discovered their dream career through
            our AI-powered assessment platform.
          </p>
          <Link href="/register" className="btn-primary" style={{ padding: "16px 48px", fontSize: "1.05rem" }}>
            <RocketLaunchIcon style={{ width: 20, height: 20 }} />
            Start Your Journey Now
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: "32px 24px",
          borderTop: "1px solid var(--glass-border)",
          textAlign: "center",
          color: "var(--text-muted)",
          fontSize: "0.85rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
          <SparklesIcon style={{ width: 18, height: 18, color: "var(--accent-red)" }} />
          <span className="gradient-text" style={{ fontWeight: 700 }}>aiGuide</span>
        </div>
        © 2026 aiGuide. Career Guidance Platform for Indian Students.
      </footer>
    </div>
  );
}
