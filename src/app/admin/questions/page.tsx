"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

interface QuestionOption {
  id?: string;
  text: string;
  weights: Array<{ clusterId: string; clusterName?: string; weight: number }>;
}

interface Question {
  id: string;
  text: string;
  type: string;
  classMin: number;
  classMax: number;
  forAssessment: string;
  isActive: boolean;
  options: Array<{
    id: string;
    text: string;
    weights: Array<{ id: string; clusterId: string | null; branchId: string | null; weight: number; cluster?: { name: string } }>;
  }>;
}

interface Cluster {
  id: string;
  name: string;
}

const QUESTION_TYPES = ["INTEREST", "APTITUDE", "PERSONALITY", "LEARNING_STYLE", "VALUES"];

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [filterType, setFilterType] = useState("");
  const [filterCluster, setFilterCluster] = useState("");
  const [filterAssessment, setFilterAssessment] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);

  // Form state
  const [form, setForm] = useState({
    text: "",
    type: "INTEREST",
    classMin: 6,
    classMax: 12,
    forAssessment: "CLUSTER",
  });
  const [options, setOptions] = useState<QuestionOption[]>([
    { text: "", weights: [] },
    { text: "", weights: [] },
    { text: "", weights: [] },
    { text: "", weights: [] },
  ]);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterType) params.append("type", filterType);
      if (filterCluster) params.append("clusterId", filterCluster);
      if (filterAssessment) params.append("assessment", filterAssessment);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());
      params.append("page", currentPage.toString());
      params.append("limit", "20");

      const url = `/api/admin/questions?${params.toString()}`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        setQuestions(json.data);
        setTotalPages(json.meta.totalPages);
        setTotalQuestions(json.meta.total);
      }
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    } finally {
      setLoading(false);
    }
  }, [filterType, filterCluster, filterAssessment, searchQuery, currentPage]);

  const fetchClusters = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/careers");
      if (res.ok) {
        const data = await res.json();
        setClusters(data.map((c: CareerClusterRaw) => ({ id: c.id, name: c.name })));
      }
    } catch (error) {
      console.error("Failed to fetch clusters:", error);
    }
  }, []);

  interface CareerClusterRaw {
    id: string;
    name: string;
    [key: string]: unknown;
  }

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  useEffect(() => {
    fetchClusters();
  }, [fetchClusters]);

  const handleSave = async () => {
    try {
      const method = editingQuestion ? "PUT" : "POST";
      const body = editingQuestion
        ? { ...form, id: editingQuestion.id, options }
        : { ...form, options };

      const res = await fetch("/api/admin/questions", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        fetchQuestions();
        closeModal();
      }
    } catch (error) {
      console.error("Failed to save question:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this question?")) return;
    try {
      await fetch("/api/admin/questions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchQuestions();
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingQuestion(null);
    setForm({ text: "", type: "INTEREST", classMin: 6, classMax: 12, forAssessment: "CLUSTER" });
    setOptions([
      { text: "", weights: [] },
      { text: "", weights: [] },
      { text: "", weights: [] },
      { text: "", weights: [] },
    ]);
  };

  const openEdit = (q: Question) => {
    setEditingQuestion(q);
    setForm({
      text: q.text,
      type: q.type,
      classMin: q.classMin,
      classMax: q.classMax,
      forAssessment: q.forAssessment,
    });
    setOptions(
      q.options.map((opt) => ({
        id: opt.id,
        text: opt.text,
        weights: opt.weights
          .filter((w) => w.clusterId)
          .map((w) => ({
            clusterId: w.clusterId!,
            clusterName: w.cluster?.name,
            weight: w.weight,
          })),
      }))
    );
    setShowModal(true);
  };

  const addOption = () => {
    setOptions([...options, { text: "", weights: [] }]);
  };

  const updateOption = (idx: number, text: string) => {
    const updated = [...options];
    updated[idx].text = text;
    setOptions(updated);
  };

  const addWeight = (optIdx: number) => {
    const updated = [...options];
    if (clusters.length > 0) {
      updated[optIdx].weights.push({
        clusterId: clusters[0].id,
        clusterName: clusters[0].name,
        weight: 1,
      });
      setOptions(updated);
    }
  };

  const updateWeight = (optIdx: number, wIdx: number, field: string, value: string | number) => {
    const updated = [...options];
    if (field === "clusterId") {
      updated[optIdx].weights[wIdx].clusterId = value as string;
      updated[optIdx].weights[wIdx].clusterName = clusters.find(
        (c) => c.id === value
      )?.name;
    } else {
      updated[optIdx].weights[wIdx].weight = Number(value);
    }
    setOptions(updated);
  };

  const removeWeight = (optIdx: number, wIdx: number) => {
    const updated = [...options];
    updated[optIdx].weights.splice(wIdx, 1);
    setOptions(updated);
  };

  const removeOption = (idx: number) => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== idx));
  };

  const typeColors: Record<string, string> = {
    INTEREST: "badge-blue",
    APTITUDE: "badge-green",
    PERSONALITY: "badge-purple",
    LEARNING_STYLE: "badge-yellow",
    VALUES: "badge-red",
  };

  const activeFilterCount = [filterType, filterCluster, filterAssessment, searchQuery.trim()].filter(Boolean).length;

  const clearAllFilters = () => {
    setFilterType("");
    setFilterCluster("");
    setFilterAssessment("");
    setSearchQuery("");
    setCurrentPage(1);
  };


  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 4 }}>
            Question <span className="gradient-text">Management</span>
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Manage assessment questions and option weights
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            closeModal();
            setShowModal(true);
          }}
        >
          <PlusIcon style={{ width: 18, height: 18 }} />
          Add Question
        </button>
      </div>

      {/* Search & Filters Bar */}
      <div style={{ marginBottom: 24, display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Search */}
        <div style={{ position: "relative" }}>
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
            placeholder="Search questions by text or option... (Press Enter)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setCurrentPage(1);
                fetchQuestions();
              }
            }}
            style={{ paddingLeft: 42, width: "100%" }}
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setCurrentPage(1);
              }}
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

        {/* Filter Row */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <FunnelIcon style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "var(--text-muted)", pointerEvents: "none" }} />
            <select
              className="input-field"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{ paddingLeft: 36, minWidth: 170 }}
            >
              <option value="">All Types</option>
              {QUESTION_TYPES.map((t) => (
                <option key={t} value={t}>{t.replace("_", " ")}</option>
              ))}
            </select>
          </div>

          <select
            className="input-field"
            value={filterCluster}
            onChange={(e) => setFilterCluster(e.target.value)}
            style={{ minWidth: 180 }}
          >
            <option value="">All Careers</option>
            {clusters.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            className="input-field"
            value={filterAssessment}
            onChange={(e) => setFilterAssessment(e.target.value)}
            style={{ minWidth: 170 }}
          >
            <option value="">All Assessments</option>
            <option value="CLUSTER">Cluster (Interest Test)</option>
            <option value="BRANCH">Branch (Deep Dive)</option>
          </select>

          {activeFilterCount > 0 && (
            <button
              onClick={() => {
                clearAllFilters();
              }}
              style={{
                background: "rgba(230, 57, 70, 0.1)",
                border: "none",
                borderRadius: 8,
                padding: "8px 16px",
                color: "var(--accent-red)",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <XMarkIcon style={{ width: 14, height: 14 }} />
              Clear Filters ({activeFilterCount})
            </button>
          )}

          <span style={{ marginLeft: "auto", fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Showing {questions.length} of {totalQuestions} questions
          </span>
        </div>
      </div>

      {loading ? (
        <p style={{ color: "var(--text-muted)", textAlign: "center", padding: 60 }}>Loading...</p>
      ) : questions.length === 0 ? (
        <div className="glass-card" style={{ textAlign: "center", padding: 60 }}>
          <p style={{ color: "var(--text-muted)", marginBottom: 16 }}>No questions yet</p>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <PlusIcon style={{ width: 18, height: 18 }} />
            Add Your First Question
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {questions.length === 0 ? (
            <div className="glass-card" style={{ textAlign: "center", padding: 40 }}>
              <p style={{ color: "var(--text-muted)", marginBottom: 8 }}>No questions match your filters</p>
              <button
                onClick={clearAllFilters}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--accent-blue)",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                Clear all filters
              </button>
            </div>
          ) : questions.map((q, i) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass-card"
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, marginBottom: 8, lineHeight: 1.5 }}>{q.text}</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <span className={`badge ${typeColors[q.type] || "badge-blue"}`}>
                      {q.type.replace("_", " ")}
                    </span>
                    <span className="badge badge-blue">
                      Class {q.classMin}–{q.classMax}
                    </span>
                    <span className="badge badge-purple">{q.forAssessment}</span>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      {q.options.length} options
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => openEdit(q)}
                    style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 6 }}
                  >
                    <PencilIcon style={{ width: 16, height: 16 }} />
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    style={{ background: "none", border: "none", color: "var(--accent-red)", cursor: "pointer", padding: 6 }}
                  >
                    <TrashIcon style={{ width: 16, height: 16 }} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, marginTop: 24 }}>
              <button
                className="btn-secondary"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              >
                Previous
              </button>
              <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="btn-secondary"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Question Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content"
            style={{ maxWidth: 700, maxHeight: "85vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700 }}>
                {editingQuestion ? "Edit" : "Add"} Question
              </h2>
              <button onClick={closeModal} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                <XMarkIcon style={{ width: 24, height: 24 }} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label className="label-text">Question Text</label>
                <textarea
                  className="input-field"
                  value={form.text}
                  onChange={(e) => setForm({ ...form, text: e.target.value })}
                  placeholder="Enter your question here..."
                  style={{ minHeight: 80, resize: "vertical" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div>
                  <label className="label-text">Type</label>
                  <select className="input-field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    {QUESTION_TYPES.map((t) => (
                      <option key={t} value={t}>{t.replace("_", " ")}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label-text">Class Min</label>
                  <select className="input-field" value={form.classMin} onChange={(e) => setForm({ ...form, classMin: Number(e.target.value) })}>
                    {[6, 7, 8, 9, 10, 11, 12].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label-text">Class Max</label>
                  <select className="input-field" value={form.classMax} onChange={(e) => setForm({ ...form, classMax: Number(e.target.value) })}>
                    {[6, 7, 8, 9, 10, 11, 12].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="label-text">Assessment Type</label>
                <select className="input-field" value={form.forAssessment} onChange={(e) => setForm({ ...form, forAssessment: e.target.value })}>
                  <option value="CLUSTER">Cluster (Interest Test)</option>
                  <option value="BRANCH">Branch (Deep Dive)</option>
                </select>
              </div>

              {/* Options */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <label className="label-text" style={{ marginBottom: 0 }}>Options & Weights</label>
                  <button
                    onClick={addOption}
                    style={{
                      background: "rgba(67, 97, 238, 0.1)",
                      border: "none",
                      borderRadius: 8,
                      padding: "4px 12px",
                      color: "#6b8bff",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                    }}
                  >
                    + Option
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {options.map((opt, optIdx) => (
                    <div
                      key={optIdx}
                      style={{
                        padding: 16,
                        borderRadius: 12,
                        background: "rgba(0,0,0,0.2)",
                        border: "1px solid var(--glass-border)",
                      }}
                    >
                      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                        <input
                          className="input-field"
                          value={opt.text}
                          onChange={(e) => updateOption(optIdx, e.target.value)}
                          placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                          style={{ flex: 1 }}
                        />
                        <button
                          onClick={() => removeOption(optIdx)}
                          style={{ background: "none", border: "none", color: "var(--accent-red)", cursor: "pointer", padding: 8 }}
                        >
                          <XMarkIcon style={{ width: 16, height: 16 }} />
                        </button>
                      </div>

                      {/* Weights */}
                      {opt.weights.map((w, wIdx) => (
                        <div key={wIdx} style={{ display: "flex", gap: 8, marginBottom: 4, paddingLeft: 16 }}>
                          <select
                            className="input-field"
                            value={w.clusterId}
                            onChange={(e) => updateWeight(optIdx, wIdx, "clusterId", e.target.value)}
                            style={{ flex: 1, padding: "8px 12px", fontSize: "0.85rem" }}
                          >
                            {clusters.map((c) => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                          <input
                            type="number"
                            className="input-field"
                            value={w.weight}
                            onChange={(e) => updateWeight(optIdx, wIdx, "weight", e.target.value)}
                            style={{ width: 70, padding: "8px 12px", fontSize: "0.85rem" }}
                            min={0}
                            max={10}
                          />
                          <button
                            onClick={() => removeWeight(optIdx, wIdx)}
                            style={{ background: "none", border: "none", color: "var(--accent-red)", cursor: "pointer", padding: 4 }}
                          >
                            <XMarkIcon style={{ width: 14, height: 14 }} />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addWeight(optIdx)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--accent-blue)",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                          paddingLeft: 16,
                          marginTop: 4,
                        }}
                      >
                        + Add Weight
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <button className="btn-secondary" onClick={closeModal}>Cancel</button>
                <button className="btn-primary" onClick={handleSave}>
                  {editingQuestion ? "Update" : "Create"} Question
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
