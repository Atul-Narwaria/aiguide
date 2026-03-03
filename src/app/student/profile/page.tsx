"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  UserCircleIcon,
  PencilSquareIcon,
  CheckIcon,
  XMarkIcon,
  ShareIcon,
  ClipboardDocumentIcon,
  ClockIcon,
  TrophyIcon,
  StarIcon,
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

interface Profile {
  classLevel: number;
  school: string | null;
  city: string | null;
  state: string | null;
  selfClaimedCareer: string | null;
}

interface HistoryEntry {
  id: string;
  type: "CLUSTER";
  resultNumber: number;
  completedAt: string | null;
  topClusters: Array<{ name: string; icon: string | null; color: string | null; percentage: number; rank: number }>;
  recommendation: { bestFitBranch: string; backup1Branch: string | null; backup2Branch: string | null } | null;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    classLevel: 10,
    school: "",
    city: "",
    state: "",
    selfClaimedCareer: "",
  });

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [slug, setSlug] = useState<string | null>(null);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
    fetchHistory();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/student/dashboard");
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
        if (data.profile) {
          setForm({
            classLevel: data.profile.classLevel ?? 10,
            school: data.profile.school ?? "",
            city: data.profile.city ?? "",
            state: data.profile.state ?? "",
            selfClaimedCareer: data.profile.selfClaimedCareer ?? "",
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/student/results/history");
      if (res.ok) {
        const data = await res.json();
        setHistory(data.history ?? []);
        setSlug(data.slug ?? null);
      }
    } catch { /* ignore */ }
    finally { setHistoryLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setProfileSuccess(false);
    try {
      const res = await fetch("/api/student/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save profile");
      } else {
        setProfile({
          classLevel: form.classLevel,
          school: form.school || null,
          city: form.city || null,
          state: form.state || null,
          selfClaimedCareer: form.selfClaimedCareer || null,
        });
        setProfileSuccess(true);
        setEditing(false);
        setTimeout(() => setProfileSuccess(false), 3000);
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setForm({
        classLevel: profile.classLevel ?? 10,
        school: profile.school ?? "",
        city: profile.city ?? "",
        state: profile.state ?? "",
        selfClaimedCareer: profile.selfClaimedCareer ?? "",
      });
    }
    setError("");
    setEditing(false);
  };

  const shareResult = (resultNumber: number, entryId: string) => {
    if (!slug) return;
    const url = `${window.location.origin}/share/${slug}/${resultNumber}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(entryId);
      setTimeout(() => setCopiedId(null), 2500);
    });
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <p style={{ color: "var(--text-muted)" }}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", flexDirection: "column", gap: 28 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 4 }}>
            My <span className="gradient-text">Profile</span>
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Your student profile information
            {slug && <span style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}> · @{slug}</span>}
          </p>
        </div>
        {!editing && profile && (
          <button className="btn-secondary" onClick={() => setEditing(true)} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <PencilSquareIcon style={{ width: 18, height: 18 }} />
            Edit Profile
          </button>
        )}
      </div>

      {profileSuccess && (
        <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 12, padding: "12px 16px", color: "#22c55e", fontSize: "0.9rem", textAlign: "center" }}>
          Profile updated successfully!
        </div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: 40 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(230,57,70,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <UserCircleIcon style={{ width: 48, height: 48, color: "var(--accent-red)" }} />
          </div>
        </div>

        {!editing && profile && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[
              { label: "Class", value: `Class ${profile.classLevel}` },
              { label: "School", value: profile.school },
              { label: "City", value: profile.city },
              { label: "State", value: profile.state },
            ].map(({ label, value }, i, arr) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--glass-border)" : undefined }}>
                <span style={{ color: "var(--text-muted)" }}>{label}</span>
                <span style={{ fontWeight: 600 }}>{value || <span style={{ color: "var(--text-muted)" }}>—</span>}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0" }}>
              <span style={{ color: "var(--text-muted)" }}>Career Interest</span>
              {profile.selfClaimedCareer
                ? <span className="badge badge-red">{profile.selfClaimedCareer}</span>
                : <span style={{ color: "var(--text-muted)" }}>—</span>
              }
            </div>
          </div>
        )}

        {editing && (
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <div>
              <label className="label-text">Class</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                {[6, 7, 8, 9, 10, 11, 12].map((c) => (
                  <div key={c} className={`option-card ${form.classLevel === c ? "selected" : ""}`} onClick={() => setForm({ ...form, classLevel: c })} style={{ textAlign: "center", padding: 16, cursor: "pointer" }}>
                    <div style={{ fontSize: "1.5rem", fontWeight: 800 }}>{c}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Class</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="label-text">School Name (Optional)</label>
              <input className="input-field" value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })} placeholder="Enter your school name" />
            </div>
            <div>
              <label className="label-text">City (Optional)</label>
              <input className="input-field" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Enter your city" />
            </div>
            <div>
              <label className="label-text">State (Optional)</label>
              <select className="input-field" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}>
                <option value="">Select state</option>
                {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label-text">Career Interest</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
                {CAREER_OPTIONS.map((career) => (
                  <div key={career.value} className={`option-card ${form.selfClaimedCareer === career.value ? "selected" : ""}`} onClick={() => setForm({ ...form, selfClaimedCareer: career.value })} style={{ display: "flex", alignItems: "center", gap: 12, padding: 16, cursor: "pointer" }}>
                    <span style={{ fontSize: "1.5rem" }}>{career.emoji}</span>
                    <span style={{ fontWeight: 500 }}>{career.value}</span>
                  </div>
                ))}
              </div>
            </div>
            {error && (
              <div style={{ background: "rgba(230,57,70,0.1)", border: "1px solid rgba(230,57,70,0.3)", borderRadius: 12, padding: "12px 16px", color: "var(--accent-red-light)", fontSize: "0.9rem", textAlign: "center" }}>
                {error}
              </div>
            )}
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button className="btn-secondary" onClick={handleCancel} disabled={saving} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <XMarkIcon style={{ width: 16, height: 16 }} />Cancel
              </button>
              <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {saving ? "Saving..." : <><CheckIcon style={{ width: 16, height: 16 }} />Save Changes</>}
              </button>
            </div>
          </div>
        )}

        {!profile && !editing && (
          <p style={{ color: "var(--text-muted)", textAlign: "center" }}>No profile found. Please complete onboarding.</p>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <ClockIcon style={{ width: 22, height: 22, color: "var(--accent-red)" }} />
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>Assessment History</h2>
          {history.length > 0 && (
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", background: "rgba(255,255,255,0.06)", padding: "2px 10px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.08)" }}>
              {history.length} result{history.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {historyLoading ? (
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Loading history...</p>
        ) : history.length === 0 ? (
          <div className="glass-card" style={{ padding: 32, textAlign: "center" }}>
            <TrophyIcon style={{ width: 40, height: 40, color: "var(--text-muted)", margin: "0 auto 12px" }} />
            <p style={{ color: "var(--text-muted)", margin: 0 }}>No assessments completed yet.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {history.map((entry) => (
              <div key={entry.id} className="glass-card" style={{ padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    {entry.resultNumber === 1 && <StarIcon style={{ width: 17, height: 17, color: "#ffd700" }} />}
                    <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>🎯 Result #{entry.resultNumber}</span>
                    {entry.resultNumber === 1 && (
                      <span className="badge badge-red" style={{ fontSize: "0.72rem", padding: "2px 10px" }}>Latest</span>
                    )}
                    {entry.completedAt && (
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        {new Date(entry.completedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => shareResult(entry.resultNumber, entry.id)}
                    disabled={!slug}
                    title={slug ? `Copy: /share/${slug}/${entry.resultNumber}` : "Share unavailable"}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 16px",
                      borderRadius: 20,
                      background: copiedId === entry.id ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.05)",
                      border: `1px solid ${copiedId === entry.id ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.1)"}`,
                      color: copiedId === entry.id ? "#22c55e" : "var(--text-secondary)",
                      cursor: slug ? "pointer" : "not-allowed",
                      fontSize: "0.82rem",
                      fontWeight: 500,
                      transition: "all 0.2s ease",
                    }}
                  >
                    {copiedId === entry.id
                      ? <><ClipboardDocumentIcon style={{ width: 14, height: 14 }} /> Link Copied!</>
                      : <><ShareIcon style={{ width: 14, height: 14 }} /> Share</>
                    }
                  </button>
                </div>

                {copiedId === entry.id && slug && (
                  <div style={{ marginBottom: 14, padding: "8px 14px", borderRadius: 8, background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)", fontSize: "0.78rem", color: "#22c55e", fontFamily: "monospace", wordBreak: "break-all" }}>
                    {typeof window !== "undefined" && window.location.origin}/share/{slug}/{entry.resultNumber}
                  </div>
                )}

                {entry.recommendation && (
                  <div style={{ background: "rgba(230,57,70,0.06)", border: "1px solid rgba(230,57,70,0.15)", borderRadius: 10, padding: "10px 16px", marginBottom: 14, fontSize: "0.88rem" }}>
                    <span style={{ color: "var(--text-muted)" }}>Best Fit: </span>
                    <span style={{ fontWeight: 700, color: "var(--accent-red)" }}>{entry.recommendation.bestFitBranch}</span>
                    {entry.recommendation.backup1Branch && (
                      <span style={{ color: "var(--text-muted)" }}> · {entry.recommendation.backup1Branch}</span>
                    )}
                    {entry.recommendation.backup2Branch && (
                      <span style={{ color: "var(--text-muted)" }}> · {entry.recommendation.backup2Branch}</span>
                    )}
                  </div>
                )}

                {entry.topClusters.length > 0 && (
                  <div>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Top Clusters</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {entry.topClusters.slice(0, 3).map((c) => (
                        <div key={c.name}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: "0.85rem" }}>
                            <span>{c.icon && <span style={{ marginRight: 4 }}>{c.icon}</span>}{c.name}</span>
                            <span style={{ fontWeight: 700 }}>{c.percentage.toFixed(1)}%</span>
                          </div>
                          <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.06)" }}>
                            <div style={{ height: "100%", borderRadius: 3, background: c.rank === 1 ? "var(--accent-red)" : "rgba(255,255,255,0.2)", width: `${c.percentage}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
