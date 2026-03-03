"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

interface CareerBranch {
  id: string;
  name: string;
  description: string | null;
  competition: string | null;
  effort: string | null;
  isActive: boolean;
}

interface CareerCluster {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  isActive: boolean;
  // PDF report metadata
  salary: string | null;
  colleges: string | null;
  education: string | null;
  growth: string | null;
  examKey: string | null;
  branches: CareerBranch[];
  _count: { branches: number };
}

export default function CareersPage() {
  const [clusters, setClusters] = useState<CareerCluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [editingCluster, setEditingCluster] = useState<CareerCluster | null>(null);
  const [editingBranch, setEditingBranch] = useState<CareerBranch | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<CareerCluster | null>(null);
  const [expandedCluster, setExpandedCluster] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Form state
  const [clusterForm, setClusterForm] = useState({
    name: "", description: "", icon: "", color: "#e63946",
    salary: "", colleges: "", education: "", growth: "", examKey: "",
  });
  const [branchForm, setBranchForm] = useState({ name: "", description: "", competition: "Medium", effort: "Medium" });

  const fetchClusters = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/careers");
      if (res.ok) {
        const data = await res.json();
        setClusters(data);
      }
    } catch (error) {
      console.error("Failed to fetch careers:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClusters();
  }, [fetchClusters]);

  const handleSaveCluster = async () => {
    try {
      const method = editingCluster ? "PUT" : "POST";
      const body = editingCluster
        ? { ...clusterForm, id: editingCluster.id }
        : clusterForm;

      const res = await fetch("/api/admin/careers", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        fetchClusters();
        setShowModal(false);
        setEditingCluster(null);
        setClusterForm({ name: "", description: "", icon: "", color: "#e63946", salary: "", colleges: "", education: "", growth: "", examKey: "" });
      }
    } catch (error) {
      console.error("Failed to save cluster:", error);
    }
  };

  const handleDeleteCluster = async (id: string) => {
    if (!confirm("Delete this career cluster and all its branches?")) return;
    try {
      await fetch("/api/admin/careers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchClusters();
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const handleSaveBranch = async () => {
    if (!selectedCluster) return;
    try {
      const method = editingBranch ? "PUT" : "POST";
      const body = editingBranch
        ? { ...branchForm, id: editingBranch.id, clusterId: selectedCluster.id }
        : { ...branchForm, clusterId: selectedCluster.id };

      const res = await fetch("/api/admin/careers/branches", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        fetchClusters();
        setShowBranchModal(false);
        setEditingBranch(null);
        setBranchForm({ name: "", description: "", competition: "Medium", effort: "Medium" });
      }
    } catch (error) {
      console.error("Failed to save branch:", error);
    }
  };

  const handleDeleteBranch = async (id: string) => {
    if (!confirm("Delete this branch?")) return;
    try {
      await fetch("/api/admin/careers/branches", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchClusters();
    } catch (error) {
      console.error("Failed to delete branch:", error);
    }
  };

  const openEditCluster = (cluster: CareerCluster) => {
    setEditingCluster(cluster);
    setClusterForm({
      name: cluster.name,
      description: cluster.description || "",
      icon: cluster.icon || "",
      color: cluster.color || "#e63946",
      salary: cluster.salary || "",
      colleges: cluster.colleges || "",
      education: cluster.education || "",
      growth: cluster.growth || "",
      examKey: cluster.examKey || "",
    });
    setShowModal(true);
  };

  const openAddBranch = (cluster: CareerCluster) => {
    setSelectedCluster(cluster);
    setEditingBranch(null);
    setBranchForm({ name: "", description: "", competition: "Medium", effort: "Medium" });
    setShowBranchModal(true);
  };

  const openEditBranch = (cluster: CareerCluster, branch: CareerBranch) => {
    setSelectedCluster(cluster);
    setEditingBranch(branch);
    setBranchForm({
      name: branch.name,
      description: branch.description || "",
      competition: branch.competition || "Medium",
      effort: branch.effort || "Medium",
    });
    setShowBranchModal(true);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 4 }}>
            Career <span className="gradient-text">Management</span>
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Manage career clusters and branches
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            setEditingCluster(null);
            setClusterForm({ name: "", description: "", icon: "", color: "#e63946", salary: "", colleges: "", education: "", growth: "", examKey: "" });
            setShowModal(true);
          }}
        >
          <PlusIcon style={{ width: 18, height: 18 }} />
          Add Cluster
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ position: "relative", marginBottom: 24 }}>
        <MagnifyingGlassIcon
          style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            width: 18,
            height: 18,
            color: "var(--text-muted)",
            pointerEvents: "none",
          }}
        />
        <input
          className="input-field"
          type="text"
          placeholder="Search clusters and branches..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            paddingLeft: 42,
            width: "100%",
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: 4,
            }}
          >
            <XMarkIcon style={{ width: 16, height: 16 }} />
          </button>
        )}
      </div>

      {loading ? (
        <p style={{ color: "var(--text-muted)", textAlign: "center", padding: 60 }}>Loading...</p>
      ) : clusters.length === 0 ? (
        <div className="glass-card" style={{ textAlign: "center", padding: 60 }}>
          <p style={{ color: "var(--text-muted)", marginBottom: 16 }}>No career clusters yet</p>
          <button
            className="btn-primary"
            onClick={() => setShowModal(true)}
          >
            <PlusIcon style={{ width: 18, height: 18 }} />
            Add Your First Cluster
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {clusters
            .filter((cluster) => {
              if (!searchQuery.trim()) return true;
              const q = searchQuery.toLowerCase();
              if (cluster.name.toLowerCase().includes(q)) return true;
              if (cluster.branches?.some((b) => b.name.toLowerCase().includes(q))) return true;
              return false;
            })
            .map((cluster, i) => (
            <motion.div
              key={cluster.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card"
              style={{ padding: 0, overflow: "hidden" }}
            >
              {/* Cluster Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "16px 24px",
                  cursor: "pointer",
                  gap: 16,
                }}
                onClick={() => {
                  setExpandedCluster(expandedCluster === cluster.id ? null : cluster.id);
                }}
              >
                <ChevronRightIcon
                  style={{
                    width: 18,
                    height: 18,
                    color: "var(--text-muted)",
                    transition: "transform 0.2s",
                    transform: expandedCluster === cluster.id ? "rotate(90deg)" : "rotate(0)",
                  }}
                />
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: `${cluster.color || "#e63946"}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.2rem",
                  }}
                >
                  {cluster.icon || "📁"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{cluster.name}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    {cluster._count?.branches || cluster.branches?.length || 0} branches
                  </div>
                </div>
                <span className={`badge ${cluster.isActive ? "badge-green" : "badge-yellow"}`}>
                  {cluster.isActive ? "Active" : "Inactive"}
                </span>
                <div style={{ display: "flex", gap: 8 }} onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => openAddBranch(cluster)}
                    style={{
                      background: "rgba(67, 97, 238, 0.1)",
                      border: "none",
                      borderRadius: 8,
                      padding: "6px 12px",
                      color: "#6b8bff",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      fontWeight: 500,
                    }}
                  >
                    + Branch
                  </button>
                  <button
                    onClick={() => openEditCluster(cluster)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--text-muted)",
                      cursor: "pointer",
                      padding: 6,
                    }}
                  >
                    <PencilIcon style={{ width: 16, height: 16 }} />
                  </button>
                  <button
                    onClick={() => handleDeleteCluster(cluster.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--accent-red)",
                      cursor: "pointer",
                      padding: 6,
                    }}
                  >
                    <TrashIcon style={{ width: 16, height: 16 }} />
                  </button>
                </div>
              </div>

              {/* Branches */}
              {(expandedCluster === cluster.id || (searchQuery.trim() && cluster.branches?.some((b) => b.name.toLowerCase().includes(searchQuery.toLowerCase())))) && cluster.branches && (
                <div
                  style={{
                    borderTop: "1px solid var(--glass-border)",
                    padding: "12px 24px 16px",
                    background: "rgba(0,0,0,0.15)",
                  }}
                >
                  {cluster.branches.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", padding: "12px 0" }}>
                      No branches yet. Add one to get started.
                    </p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {cluster.branches
                        .filter((branch) => {
                          if (!searchQuery.trim()) return true;
                          return branch.name.toLowerCase().includes(searchQuery.toLowerCase());
                        })
                        .map((branch) => (
                        <div
                          key={branch.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "10px 16px",
                            borderRadius: 10,
                            background: "var(--glass-bg)",
                            border: "1px solid var(--glass-border)",
                            gap: 12,
                          }}
                        >
                          <span style={{ flex: 1, fontWeight: 500, fontSize: "0.9rem" }}>
                            {branch.name}
                          </span>
                          {branch.competition && (
                            <span className="badge badge-yellow" style={{ fontSize: "0.65rem" }}>
                              {branch.competition} competition
                            </span>
                          )}
                          <button
                            onClick={() => openEditBranch(cluster, branch)}
                            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 4 }}
                          >
                            <PencilIcon style={{ width: 14, height: 14 }} />
                          </button>
                          <button
                            onClick={() => handleDeleteBranch(branch.id)}
                            style={{ background: "none", border: "none", color: "var(--accent-red)", cursor: "pointer", padding: 4 }}
                          >
                            <TrashIcon style={{ width: 14, height: 14 }} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Cluster Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700 }}>
                {editingCluster ? "Edit" : "Add"} Career Cluster
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                <XMarkIcon style={{ width: 24, height: 24 }} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label className="label-text">Name</label>
                <input
                  className="input-field"
                  value={clusterForm.name}
                  onChange={(e) => setClusterForm({ ...clusterForm, name: e.target.value })}
                  placeholder="e.g., Engineering"
                />
              </div>
              <div>
                <label className="label-text">Description</label>
                <textarea
                  className="input-field"
                  value={clusterForm.description}
                  onChange={(e) => setClusterForm({ ...clusterForm, description: e.target.value })}
                  placeholder="Brief description of this career cluster"
                  style={{ minHeight: 80, resize: "vertical" }}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label className="label-text">Icon (emoji)</label>
                  <input
                    className="input-field"
                    value={clusterForm.icon}
                    onChange={(e) => setClusterForm({ ...clusterForm, icon: e.target.value })}
                    placeholder="⚙️"
                  />
                </div>
                <div>
                  <label className="label-text">Color</label>
                  <input
                    type="color"
                    className="input-field"
                    value={clusterForm.color}
                    onChange={(e) => setClusterForm({ ...clusterForm, color: e.target.value })}
                    style={{ height: 48, padding: 4 }}
                  />
                </div>
              </div>

              {/* PDF Report Metadata */}
              <div style={{ borderTop: "1px solid var(--glass-border)", paddingTop: 16 }}>
                <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--accent-red)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 14 }}>📄 PDF Report Metadata</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label className="label-text">Salary Range</label>
                    <input
                      className="input-field"
                      value={clusterForm.salary}
                      onChange={(e) => setClusterForm({ ...clusterForm, salary: e.target.value })}
                      placeholder="e.g., ₹6–25 LPA (Entry) | ₹25–80 LPA (Senior)"
                    />
                  </div>
                  <div>
                    <label className="label-text">Education Path</label>
                    <input
                      className="input-field"
                      value={clusterForm.education}
                      onChange={(e) => setClusterForm({ ...clusterForm, education: e.target.value })}
                      placeholder="e.g., B.Tech / B.E. (4 yrs) → M.Tech / MS"
                    />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div>
                      <label className="label-text">Market Growth</label>
                      <input
                        className="input-field"
                        value={clusterForm.growth}
                        onChange={(e) => setClusterForm({ ...clusterForm, growth: e.target.value })}
                        placeholder="e.g., High ↑"
                      />
                    </div>
                    <div>
                      <label className="label-text">Key Entrance Exams</label>
                      <input
                        className="input-field"
                        value={clusterForm.examKey}
                        onChange={(e) => setClusterForm({ ...clusterForm, examKey: e.target.value })}
                        placeholder="e.g., JEE Main · JEE Advanced"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label-text">Top Colleges</label>
                    <input
                      className="input-field"
                      value={clusterForm.colleges}
                      onChange={(e) => setClusterForm({ ...clusterForm, colleges: e.target.value })}
                      placeholder="e.g., IIT Bombay · IIT Delhi · BITS Pilani"
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn-primary" onClick={handleSaveCluster}>
                  {editingCluster ? "Update" : "Create"} Cluster
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Branch Modal */}
      {showBranchModal && (
        <div className="modal-overlay" onClick={() => setShowBranchModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700 }}>
                {editingBranch ? "Edit" : "Add"} Branch – {selectedCluster?.name}
              </h2>
              <button onClick={() => setShowBranchModal(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                <XMarkIcon style={{ width: 24, height: 24 }} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label className="label-text">Branch Name</label>
                <input
                  className="input-field"
                  value={branchForm.name}
                  onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
                  placeholder="e.g., Computer Science"
                />
              </div>
              <div>
                <label className="label-text">Description</label>
                <textarea
                  className="input-field"
                  value={branchForm.description}
                  onChange={(e) => setBranchForm({ ...branchForm, description: e.target.value })}
                  placeholder="Brief description"
                  style={{ minHeight: 80, resize: "vertical" }}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label className="label-text">Competition Level</label>
                  <select
                    className="input-field"
                    value={branchForm.competition}
                    onChange={(e) => setBranchForm({ ...branchForm, competition: e.target.value })}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="label-text">Effort Required</label>
                  <select
                    className="input-field"
                    value={branchForm.effort}
                    onChange={(e) => setBranchForm({ ...branchForm, effort: e.target.value })}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <button className="btn-secondary" onClick={() => setShowBranchModal(false)}>Cancel</button>
                <button className="btn-primary" onClick={handleSaveBranch}>
                  {editingBranch ? "Update" : "Create"} Branch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
