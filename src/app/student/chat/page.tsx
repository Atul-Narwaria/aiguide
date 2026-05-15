"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  PaperAirplaneIcon,
  SparklesIcon,
  UserCircleIcon,
  ArrowPathIcon,
  ClipboardIcon,
  CheckIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  ChatBubbleLeftRightIcon,
  PencilIcon,
  TrashIcon,
  Bars3Icon,
  XMarkIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface ChatSessionItem {
  id: string;
  title: string;
  updatedAt: string;
  messages: { content: string; role: string }[];
}

// Lightweight markdown renderer
function renderMarkdown(text: string): string {
  let html = text
    .replace(/^### (.+)$/gm, '<h4 style="font-weight:700;margin:12px 0 6px;font-size:0.95rem;color:var(--text-primary)">$1</h4>')
    .replace(/^## (.+)$/gm, '<h3 style="font-weight:700;margin:14px 0 8px;font-size:1.02rem;color:var(--text-primary)">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:var(--text-primary);font-weight:600">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^(\d+)\. (.+)$/gm, '<div style="display:flex;gap:8px;margin:3px 0;align-items:flex-start"><span style="color:var(--accent-red-light);font-weight:700;min-width:18px">$1.</span><span>$2</span></div>')
    .replace(/^- (.+)$/gm, '<div style="display:flex;gap:8px;margin:3px 0;align-items:flex-start"><span style="color:var(--accent-red);margin-top:7px;font-size:6px">●</span><span>$1</span></div>')
    .replace(/\n\n/g, '<div style="height:8px"></div>')
    .replace(/\n/g, "<br/>");

  return html;
}

const PROMPT_CATEGORIES = [
  {
    title: "🎯 Career Insights",
    prompts: [
      "What career is best for me based on my results?",
      "How competitive is my chosen field?",
      "Tell me about salary expectations",
    ],
  },
  {
    title: "📝 Exam Preparation",
    prompts: [
      "What exams should I prepare for?",
      "Create a study plan for me",
      "Best books and resources for my target exam?",
    ],
  },
  {
    title: "🏫 College Guidance",
    prompts: [
      "Which colleges should I target?",
      "What are the admission requirements?",
      "Compare top 3 colleges for my career",
    ],
  },
  {
    title: "📚 Subject Focus",
    prompts: [
      "What subjects should I focus on?",
      "How to improve my weak areas?",
      "Best online courses for my career path?",
    ],
  },
];

function ChatPageInner() {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [feedbackIdx, setFeedbackIdx] = useState<Record<number, "up" | "down">>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const streamingRef = useRef(false);

  // detect mobile width dynamically for responsive layout
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const update = () => setIsMobile(typeof window !== "undefined" && window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Session state
  const [sessions, setSessions] = useState<ChatSessionItem[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [sessionsLoading, setSessionsLoading] = useState(true);

  // Load sessions on mount
  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await fetch("/api/student/chat/sessions");
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
      }
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    } finally {
      setSessionsLoading(false);
    }
  };

  const createNewSession = async (): Promise<string | null> => {
    try {
      const res = await fetch("/api/student/chat/sessions", { method: "POST" });
      if (res.ok) {
        const session = await res.json();
        setSessions((prev) => [{ ...session, messages: [] }, ...prev]);
        return session.id;
      }
    } catch (error) {
      console.error("Failed to create session:", error);
    }
    return null;
  };

  const loadSession = async (sessionId: string) => {
    setActiveSessionId(sessionId);
    setMessages([]);
    setFeedbackIdx({});
    setSidebarOpen(false);

    try {
      const res = await fetch(`/api/student/chat/sessions/${sessionId}`);
      if (res.ok) {
        const data = await res.json();
        const loaded: ChatMessage[] = data.messages.map((m: { role: string; content: string; createdAt: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
          timestamp: new Date(m.createdAt).getTime(),
        }));
        setMessages(loaded);
      }
    } catch (error) {
      console.error("Failed to load session:", error);
    }
  };

  const handleNewChat = async () => {
    setActiveSessionId(null);
    setMessages([]);
    setFeedbackIdx({});
    setSidebarOpen(false);
    window.history.replaceState(null, "", "/student/chat");
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      const res = await fetch(`/api/student/chat/sessions/${sessionId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
        if (activeSessionId === sessionId) {
          setActiveSessionId(null);
          setMessages([]);
        }
      }
    } catch (error) {
      console.error("Failed to delete session:", error);
    }
  };

  const handleRenameSession = async (sessionId: string) => {
    if (!editTitle.trim()) {
      setEditingSessionId(null);
      return;
    }
    try {
      const res = await fetch(`/api/student/chat/sessions/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle.trim() }),
      });
      if (res.ok) {
        setSessions((prev) =>
          prev.map((s) => (s.id === sessionId ? { ...s, title: editTitle.trim() } : s))
        );
      }
    } catch (error) {
      console.error("Failed to rename session:", error);
    } finally {
      setEditingSessionId(null);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle prompt from URL
  useEffect(() => {
    const prompt = searchParams.get("prompt");
    if (prompt && messages.length === 0) {
      sendMessage(prompt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const sendMessage = useCallback(
    async (text?: string) => {
      const msg = text || input.trim();
      if (!msg || streamingRef.current) return;

      // Ensure we have a session
      let sessionId = activeSessionId;
      if (!sessionId) {
        sessionId = await createNewSession();
        if (!sessionId) return;
        setActiveSessionId(sessionId);
      }

      const userMessage: ChatMessage = {
        role: "user",
        content: msg,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setLoading(true);
      streamingRef.current = true;

      try {
        const res = await fetch("/api/student/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: msg,
            stream: true,
            sessionId,
            history: messages.map((m) => ({
              role: m.role === "user" ? "user" : "model",
              content: m.content,
            })),
          }),
        });

        if (
          res.ok &&
          res.headers.get("content-type")?.includes("text/event-stream")
        ) {
          const reader = res.body?.getReader();
          const decoder = new TextDecoder();
          let fullText = "";

          const assistantMsg: ChatMessage = {
            role: "assistant",
            content: "",
            timestamp: Date.now(),
          };
          setMessages((prev) => [...prev, assistantMsg]);

          if (reader) {
            let buffer = "";
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split("\n\n");
              buffer = lines.pop() || "";

              for (const line of lines) {
                if (line.startsWith("data: ")) {
                  try {
                    const data = JSON.parse(line.slice(6));
                    if (data.text) {
                      fullText += data.text;
                      setMessages((prev) => {
                        const updated = [...prev];
                        updated[updated.length - 1] = {
                          ...updated[updated.length - 1],
                          content: fullText,
                        };
                        return updated;
                      });
                    }
                  } catch {
                    // skip malformed chunks
                  }
                }
              }
            }
          }
        } else {
          const data = await res.json();
          const assistantMessage: ChatMessage = {
            role: "assistant",
            content:
              data.reply ||
              "Sorry, I couldn't process that. Please try again.",
            timestamp: Date.now(),
          };
          setMessages((prev) => [...prev, assistantMessage]);
        }

        // Refresh sessions list to update title/last message
        fetchSessions();
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, something went wrong. Please try again. 🙏",
            timestamp: Date.now(),
          },
        ]);
      } finally {
        setLoading(false);
        streamingRef.current = false;
        inputRef.current?.focus();
      }
    },
    [input, messages, activeSessionId]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleCopy = async (content: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch {
      // fallback
    }
  };

  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 64px)", position: "relative" }}>
      {/* Mobile sidebar toggle */}
      {isMobile && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            position: "fixed",
            top: 76,
            left: 12,
            zIndex: 100,
            width: 38,
            height: 38,
            borderRadius: 10,
            background: "var(--glass-bg)",
            border: "1px solid var(--glass-border)",
            backdropFilter: "blur(20px)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-secondary)",
          }}
        >
          {sidebarOpen ? (
            <XMarkIcon style={{ width: 18, height: 18 }} />
          ) : (
            <Bars3Icon style={{ width: 18, height: 18 }} />
          )}
        </button>
      )}

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 49,
          }}
        />
      )}

      {/* Sidebar */}
      <div
        style={{
          width: 280,
          minWidth: isMobile ? 240 : 280,
          borderRight: "1px solid var(--glass-border)",
          display: "flex",
          flexDirection: "column",
          background: "var(--bg-primary)",
          position: sidebarOpen ? "fixed" : "relative",
          top: sidebarOpen ? 64 : undefined,
          left: 0,
          bottom: 0,
          zIndex: sidebarOpen ? 50 : 1,
          transform: sidebarOpen ? "translateX(0)" : undefined,
          transition: "transform 0.2s",
          ...(isMobile && !sidebarOpen
            ? { position: "fixed" as const, transform: "translateX(-100%)" }
            : {}),
        }}
      >
        {/* Sidebar header */}
        <div
          style={{
            padding: "16px",
            borderBottom: "1px solid var(--glass-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ChatBubbleLeftRightIcon style={{ width: 18, height: 18, color: "var(--accent-red)" }} />
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>
              Chat History
            </span>
          </div>
          <button
            onClick={handleNewChat}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "6px 12px",
              background: "linear-gradient(135deg, #e63946, #ff6b6b)",
              border: "none",
              borderRadius: 8,
              color: "white",
              cursor: "pointer",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            <PlusIcon style={{ width: 14, height: 14 }} />
            New
          </button>
        </div>

        {/* Sessions list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
          {sessionsLoading ? (
            <p style={{ textAlign: "center", padding: 20, color: "var(--text-muted)", fontSize: "0.8rem" }}>
              Loading...
            </p>
          ) : sessions.length === 0 ? (
            <p style={{ textAlign: "center", padding: 20, color: "var(--text-muted)", fontSize: "0.8rem" }}>
              No chats yet. Start a conversation!
            </p>
          ) : (
            sessions.map((s) => (
              <div
                key={s.id}
                onClick={() => {
                  if (editingSessionId !== s.id) loadSession(s.id);
                }}
                style={{
                  padding: "10px 12px",
                  borderRadius: 10,
                  cursor: "pointer",
                  marginBottom: 4,
                  background:
                    activeSessionId === s.id
                      ? "rgba(230,57,70,0.1)"
                      : "transparent",
                  border:
                    activeSessionId === s.id
                      ? "1px solid rgba(230,57,70,0.2)"
                      : "1px solid transparent",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (activeSessionId !== s.id) {
                    (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.03)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSessionId !== s.id) {
                    (e.currentTarget as HTMLDivElement).style.background = "transparent";
                  }
                }}
              >
                {editingSessionId === s.id ? (
                  <input
                    autoFocus
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={() => handleRenameSession(s.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRenameSession(s.id);
                      if (e.key === "Escape") setEditingSessionId(null);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      width: "100%",
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--accent-red)",
                      borderRadius: 6,
                      padding: "4px 8px",
                      color: "var(--text-primary)",
                      fontSize: "0.82rem",
                      outline: "none",
                    }}
                  />
                ) : (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: "0.82rem",
                          fontWeight: 600,
                          color: "var(--text-primary)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          marginBottom: 2,
                        }}
                      >
                        {s.title}
                      </p>
                      <p
                        style={{
                          fontSize: "0.7rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        {formatDate(s.updatedAt)}
                      </p>
                    </div>
                    <div
                      style={{ display: "flex", gap: 2, flexShrink: 0, marginLeft: 4 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => {
                          setEditingSessionId(s.id);
                          setEditTitle(s.title);
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 4,
                          borderRadius: 4,
                          display: "flex",
                          alignItems: "center",
                        }}
                        title="Rename"
                      >
                        <PencilIcon style={{ width: 13, height: 13, color: "var(--text-muted)" }} />
                      </button>
                      <button
                        onClick={() => handleDeleteSession(s.id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 4,
                          borderRadius: 4,
                          display: "flex",
                          alignItems: "center",
                        }}
                        title="Delete"
                      >
                        <TrashIcon style={{ width: 13, height: 13, color: "var(--text-muted)" }} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          maxWidth: 1000,
          margin: "0 auto",
          width: "100%",
          padding: "0 16px",
        }}
      >
        {/* Header */}
        <div
          style={{
            marginBottom: 12,
            flexShrink: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            paddingTop: 8,
          }}
        >
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 4 }}>
              AI Career{" "}
              <span className="gradient-text">Counselor</span>
            </h1>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.85rem",
              }}
            >
              Ask me anything about careers, exams, colleges, or your future path
            </p>
          </div>
          {messages.length > 0 && (
            <button
              onClick={handleNewChat}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                background: "var(--glass-bg)",
                border: "1px solid var(--glass-border)",
                borderRadius: 10,
                color: "var(--text-secondary)",
                cursor: "pointer",
                fontSize: "0.8rem",
                fontWeight: 500,
                transition: "all 0.2s",
              }}
            >
              <ArrowPathIcon style={{ width: 14, height: 14 }} />
              New Chat
            </button>
          )}
        </div>

        {/* Chat Area */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            paddingBottom: 16,
            paddingRight: 4,
          }}
        >
          {/* Welcome Message / Empty State */}
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ padding: "20px 0" }}
            >
              {/* Hero */}
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #e63946, #ff6b6b)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    boxShadow: "0 8px 32px rgba(230,57,70,0.3)",
                  }}
                >
                  <SparklesIcon style={{ width: 36, height: 36, color: "white" }} />
                </div>
                <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: 8 }}>
                  Hello! I&apos;m your AI Career Counselor 👋
                </h2>
                <p
                  style={{
                    color: "var(--text-secondary)",
                    maxWidth: 500,
                    margin: "0 auto",
                    lineHeight: 1.6,
                    fontSize: "0.9rem",
                  }}
                >
                  I have access to your assessment results and can provide personalized career
                  guidance. Pick a topic or ask me anything!
                </p>
              </div>

              {/* Categorized Quick Prompts */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: 12,
                }}
              >
                {PROMPT_CATEGORIES.map((category) => (
                  <div
                    key={category.title}
                    style={{
                      background: "var(--glass-bg)",
                      border: "1px solid var(--glass-border)",
                      borderRadius: 14,
                      padding: 16,
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        marginBottom: 10,
                        color: "var(--text-primary)",
                      }}
                    >
                      {category.title}
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {category.prompts.map((prompt) => (
                        <button
                          key={prompt}
                          onClick={() => sendMessage(prompt)}
                          style={{
                            padding: "8px 12px",
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            borderRadius: 10,
                            color: "var(--text-secondary)",
                            fontSize: "0.78rem",
                            cursor: "pointer",
                            textAlign: "left",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            (e.target as HTMLButtonElement).style.borderColor = "var(--accent-red)";
                            (e.target as HTMLButtonElement).style.color = "var(--text-primary)";
                            (e.target as HTMLButtonElement).style.background = "rgba(230,57,70,0.06)";
                          }}
                          onMouseLeave={(e) => {
                            (e.target as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.06)";
                            (e.target as HTMLButtonElement).style.color = "var(--text-secondary)";
                            (e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
                          }}
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Messages */}
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  flexDirection: msg.role === "user" ? "row-reverse" : "row",
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background:
                      msg.role === "user"
                        ? "linear-gradient(135deg, #4361ee, #6b8bff)"
                        : "linear-gradient(135deg, #e63946, #ff6b6b)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  {msg.role === "user" ? (
                    <UserCircleIcon style={{ width: 18, height: 18, color: "white" }} />
                  ) : (
                    <SparklesIcon style={{ width: 18, height: 18, color: "white" }} />
                  )}
                </div>

                {/* Message Container */}
                <div style={{ maxWidth: "78%", minWidth: 0 }}>
                  <div
                    style={{
                      padding: "12px 18px",
                      borderRadius:
                        msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      background:
                        msg.role === "user"
                          ? "linear-gradient(135deg, #4361ee, #6b8bff)"
                          : "var(--bg-secondary)",
                      border:
                        msg.role === "user" ? "none" : "1px solid var(--glass-border)",
                      color: "var(--text-primary)",
                      fontSize: "0.88rem",
                      lineHeight: 1.7,
                    }}
                  >
                    {msg.role === "assistant" ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                      />
                    ) : (
                      <span style={{ whiteSpace: "pre-wrap" }}>{msg.content}</span>
                    )}
                  </div>

                  {/* Message footer */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginTop: 4,
                      justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                    }}
                  >
                    <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
                      {formatTime(msg.timestamp)}
                    </span>

                    {msg.role === "assistant" && msg.content && (
                      <>
                        <button
                          onClick={() => handleCopy(msg.content, idx)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 2,
                            display: "flex",
                            alignItems: "center",
                          }}
                          title="Copy"
                        >
                          {copiedIdx === idx ? (
                            <CheckIcon style={{ width: 13, height: 13, color: "#51cf66" }} />
                          ) : (
                            <ClipboardIcon style={{ width: 13, height: 13, color: "var(--text-muted)" }} />
                          )}
                        </button>
                        <button
                          onClick={() => setFeedbackIdx((prev) => ({ ...prev, [idx]: "up" }))}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 2,
                            display: "flex",
                            alignItems: "center",
                          }}
                          title="Helpful"
                        >
                          <HandThumbUpIcon
                            style={{
                              width: 13,
                              height: 13,
                              color: feedbackIdx[idx] === "up" ? "#51cf66" : "var(--text-muted)",
                            }}
                          />
                        </button>
                        <button
                          onClick={() => setFeedbackIdx((prev) => ({ ...prev, [idx]: "down" }))}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 2,
                            display: "flex",
                            alignItems: "center",
                          }}
                          title="Not helpful"
                        >
                          <HandThumbDownIcon
                            style={{
                              width: 13,
                              height: 13,
                              color: feedbackIdx[idx] === "down" ? "#e63946" : "var(--text-muted)",
                            }}
                          />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing / Thinking Indicator — shows whenever AI is processing */}
          {loading &&
            (messages[messages.length - 1]?.role === "user" ||
              !messages[messages.length - 1]?.content) && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
            >
              {/* AI Avatar */}
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #e63946, #ff6b6b)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 2,
                  boxShadow: "0 0 0 0 rgba(230,57,70,0.4)",
                  animation: "pulse-ring 1.5s ease-out infinite",
                }}
              >
                <SparklesIcon style={{ width: 18, height: 18, color: "white" }} />
              </div>

              {/* Bubble */}
              <div
                style={{
                  padding: "12px 18px",
                  borderRadius: "18px 18px 18px 4px",
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--glass-border)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                {/* Dot animation */}
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "var(--accent-red)",
                      }}
                    />
                  ))}
                </div>
                {/* Label */}
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--text-muted)",
                    letterSpacing: "0.02em",
                  }}
                >
                  AI is thinking…
                </motion.span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div
          style={{
            flexShrink: 0,
            padding: "14px 0",
            borderTop: "1px solid var(--glass-border)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              background: "var(--bg-secondary)",
              borderRadius: 16,
              border: "1px solid var(--glass-border)",
              padding: "4px 4px 4px 20px",
              transition: "border-color 0.2s",
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about careers, exams, colleges..."
              disabled={loading}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "var(--text-primary)",
                fontSize: "0.9rem",
                padding: "12px 0",
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: input.trim()
                  ? "linear-gradient(135deg, #e63946, #ff6b6b)"
                  : "rgba(255,255,255,0.05)",
                border: "none",
                cursor: input.trim() ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
            >
              <PaperAirplaneIcon
                style={{
                  width: 20,
                  height: 20,
                  color: input.trim() ? "white" : "var(--text-muted)",
                }}
              />
            </button>
          </div>
          <p
            style={{
              textAlign: "center",
              color: "var(--text-muted)",
              fontSize: "0.7rem",
              marginTop: 8,
            }}
          >
            AI responses are for guidance only. Consult career counselors for professional
            advice.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <p style={{ color: 'var(--text-muted)' }}>Loading chat...</p>
        </div>
      }
    >
      <ChatPageInner />
    </Suspense>
  );
}
