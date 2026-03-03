"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  UsersIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

interface UserProfile {
  classLevel: number;
  school: string | null;
  city: string | null;
  state: string | null;
  selfClaimedCareer: string | null;
}

interface Assessment {
  id: string;
  type: "CLUSTER" | "BRANCH";
  status: "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED";
  completedAt: string | null;
}

interface User {
  id: string;
  name: string;
  email: string;
  slug: string | null;
  createdAt: string;
  profile: UserProfile | null;
  assessments: Assessment[];
}

interface PaginationData {
  users: User[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

const PAGE_SIZE = 10;

export default function AdminUsersPage() {
  const [data, setData] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const fetchUsers = async (page: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/users?page=${page}&pageSize=${PAGE_SIZE}`
      );
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = data?.users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) ?? [];

  const handlePrevious = () => {
    if (data && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (data && currentPage < data.pagination.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontSize: "1.8rem",
            fontWeight: 800,
            marginBottom: 4,
          }}
        >
          Manage <span className="gradient-text">Users</span>
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          View and manage all registered students
        </p>
      </div>

      {/* Search Bar */}
      <div
        className="glass-card"
        style={{
          marginBottom: 24,
          padding: 16,
          display: "flex",
          gap: 12,
          alignItems: "center",
        }}
      >
        <MagnifyingGlassIcon
          style={{
            width: 20,
            height: 20,
            color: "var(--text-muted)",
          }}
        />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            background: "none",
            border: "none",
            outline: "none",
            color: "var(--text-primary)",
            fontSize: "0.95rem",
          }}
        />
      </div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
      >
        {loading ? (
          <div style={{ padding: 40, textAlign: "center" }}>
            <p style={{ color: "var(--text-muted)" }}>Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center" }}>
            <UsersIcon
              style={{
                width: 48,
                height: 48,
                color: "var(--text-muted)",
                margin: "0 auto 16px",
              }}
            />
            <p style={{ color: "var(--text-muted)" }}>No users found</p>
          </div>
        ) : (
          <>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Share Slug</th>
                    <th>Grade</th>
                    <th>Career Interest</th>
                    <th>Assessments</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => {
                    const completedAssessments = user.assessments.filter(
                      (a) => a.status === "COMPLETED"
                    ).length;
                    return (
                      <tr key={user.id}>
                        <td style={{ fontWeight: 500, color: "var(--accent-red)" }}>
                          {user.name}
                        </td>
                        <td style={{ fontSize: "0.9rem" }}>{user.email}</td>
                        <td>
                          {user.slug ? (
                            <code
                              style={{
                                background: "rgba(230,57,70,0.1)",
                                padding: "4px 8px",
                                borderRadius: 4,
                                fontSize: "0.8rem",
                                color: "var(--accent-red)",
                              }}
                            >
                              @{user.slug}
                            </code>
                          ) : (
                            <span style={{ color: "var(--text-muted)" }}>—</span>
                          )}
                        </td>
                        <td>
                          {user.profile?.classLevel ? (
                            <span
                              className="badge badge-blue"
                              style={{ fontSize: "0.8rem" }}
                            >
                              Class {user.profile.classLevel}
                            </span>
                          ) : (
                            <span style={{ color: "var(--text-muted)" }}>—</span>
                          )}
                        </td>
                        <td>
                          {user.profile?.selfClaimedCareer ? (
                            <span
                              className="badge badge-red"
                              style={{ fontSize: "0.8rem" }}
                            >
                              {user.profile.selfClaimedCareer}
                            </span>
                          ) : (
                            <span style={{ color: "var(--text-muted)" }}>—</span>
                          )}
                        </td>
                        <td>
                          <span style={{ fontWeight: 500 }}>
                            {completedAssessments}/{user.assessments.length}
                          </span>
                        </td>
                        <td style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                          {new Date(user.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "2-digit",
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data && data.pagination.totalPages > 1 && (
              <div
                style={{
                  borderTop: "1px solid var(--glass-border)",
                  padding: "16px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  Showing {filteredUsers.length} of {data.pagination.totalCount} users
                  {searchTerm && " (filtered)"}
                </div>

                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 8,
                      border: "1px solid var(--glass-border)",
                      background: currentPage === 1 ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.06)",
                      color: currentPage === 1 ? "var(--text-muted)" : "var(--text-secondary)",
                      cursor: currentPage === 1 ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: "0.9rem",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <ChevronLeftIcon style={{ width: 16, height: 16 }} />
                    Previous
                  </button>

                  <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    Page {currentPage} of {data.pagination.totalPages}
                  </div>

                  <button
                    onClick={handleNext}
                    disabled={currentPage === data.pagination.totalPages}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 8,
                      border: "1px solid var(--glass-border)",
                      background: currentPage === data.pagination.totalPages ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.06)",
                      color: currentPage === data.pagination.totalPages ? "var(--text-muted)" : "var(--text-secondary)",
                      cursor: currentPage === data.pagination.totalPages ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: "0.9rem",
                      transition: "all 0.2s ease",
                    }}
                  >
                    Next
                    <ChevronRightIcon style={{ width: 16, height: 16 }} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
