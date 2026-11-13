import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  MessageCircle,
  PlusCircle,
  History,
  Trash2,
  Copy,
  Check,
  Code2,
  Play,
  RotateCcw,
  BookOpen,
  Terminal,
  Maximize2,
  Minimize2,
  WifiOff,
  Search,
  ArrowRight,
  Compass,
  Lightbulb,
  HelpCircle,
  Bug,
  Brain,
  ChevronRight,
  Split,
  PanelRightClose,
  PanelRightOpen,
  Square
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "motion/react";
import {
  AiChatSession,
  saveAiChatSession,
  getAiChatSessions,
  deleteAiChatSession,
  clearAllAiChatSessions,
} from "../lib/indexedDbStorage";
import { getOfflineChatReply } from "../lib/offlineAiKnowledge";
import { getApiUrl, fetchWithTimeout } from "../lib/apiConfig";
import { CodeEditor } from "./CodeEditor";
import { runPythonCode, stopPythonExecution } from "../lib/pyodideRunner";
import { ExecutionResult } from "../types";
import { translatePythonError, FriendlyErrorTranslation } from "../lib/errorTranslator";

interface FullAiTutorViewProps {
  onNavigateToLessons: () => void;
  onNavigateToPlayground: (code?: string) => void;
  initialCode?: string;
  initialQuestion?: string;
}

const TUTOR_PROMPT_SUGGESTIONS = [
  {
    category: "Curriculum",
    icon: BookOpen,
    label: "Teach me Lesson 1.1 or recommend where to start",
    prompt: "Can you walk me through the MilkyPy Python curriculum and teach me where to start based on Module 1?",
  },
  {
    category: "Concepts",
    icon: Lightbulb,
    label: "Explain variables with a real-life analogy",
    prompt: "Can you explain what variables are in Python using a clear real-world analogy, then show a simple example?",
  },
  {
    category: "Loops",
    icon: RotateCcw,
    label: "Difference between for loops and while loops",
    prompt: "What is the difference between a for loop and a while loop in Python, and when should I use each?",
  },
  {
    category: "Lists",
    icon: Compass,
    label: "How do Python lists and dictionaries work?",
    prompt: "Teach me Module 6 on Python lists and dictionaries with practical examples and a quick exercise.",
  },
  {
    category: "Practice",
    icon: Brain,
    label: "Give me a beginner practice challenge",
    prompt: "Give me a bite-sized Python practice problem to test my logic without giving away the answer right away.",
  },
  {
    category: "Debug",
    icon: Bug,
    label: "Explain why IndentationError happens",
    prompt: "Why does Python care about indentation, what causes IndentationError, and how do I fix it?",
  },
];

export const FullAiTutorView: React.FC<FullAiTutorViewProps> = ({
  onNavigateToLessons,
  onNavigateToPlayground,
  initialCode = `# Milky AI Tutor Sandbox
# Test code you discuss with your tutor here!
def greet(name):
    return f"Hello, {name}! Welcome to Python."

print(greet("Learner"))
`,
  initialQuestion,
}) => {
  // Chat state
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "model"; text: string }[]>([]);
  const [chatInput, setChatInput] = useState(initialQuestion || "");
  const [loading, setLoading] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string>(() => `tutor-chat-${Date.now()}`);
  const [activeSessionTitle, setActiveSessionTitle] = useState<string>("New Tutor Session");
  const [savedSessions, setSavedSessions] = useState<AiChatSession[]>([]);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [historySearchQuery, setHistorySearchQuery] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Split-screen Sandbox IDE state (Defaults to hidden on mobile to give full viewport to chat)
  const [showSandbox, setShowSandbox] = useState<boolean>(() => {
    return typeof window !== "undefined" ? window.innerWidth >= 1024 : false;
  });
  const [sandboxCode, setSandboxCode] = useState(initialCode);
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [errorTranslation, setErrorTranslation] = useState<FriendlyErrorTranslation | null>(null);

  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const activeAbortRef = useRef<AbortController | null>(null);
  const manualCancelRef = useRef(false);

  const handleCancelAiRequest = () => {
    manualCancelRef.current = true;
    if (activeAbortRef.current) {
      activeAbortRef.current.abort();
      activeAbortRef.current = null;
    }
    setLoading(false);
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Load chat history
  const loadChatSessions = async () => {
    try {
      const sessions = await getAiChatSessions();
      setSavedSessions(sessions);
      if (chatMessages.length === 0 && sessions.length > 0) {
        const latest = sessions[0];
        setActiveSessionId(latest.id);
        setActiveSessionTitle(latest.title);
        setChatMessages(latest.messages);
      }
    } catch (err) {
      console.warn("Error reading chat history:", err);
    }
  };

  useEffect(() => {
    loadChatSessions();
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, loading]);

  const handleStartNewSession = () => {
    const newId = `tutor-chat-${Date.now()}`;
    setActiveSessionId(newId);
    setActiveSessionTitle("New Tutor Session");
    setChatMessages([]);
    setShowHistoryDrawer(false);
  };

  const handleSelectSession = (session: AiChatSession) => {
    setActiveSessionId(session.id);
    setActiveSessionTitle(session.title);
    setChatMessages(session.messages);
    setShowHistoryDrawer(false);
  };

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteAiChatSession(sessionId);
      const updated = savedSessions.filter((s) => s.id !== sessionId);
      setSavedSessions(updated);
      if (activeSessionId === sessionId) {
        handleStartNewSession();
      }
    } catch (err) {
      console.warn("Failed to delete session:", err);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || chatInput).trim();
    if (!query || loading) return;

    if (activeAbortRef.current) activeAbortRef.current.abort();
    manualCancelRef.current = false;
    const controller = new AbortController();
    activeAbortRef.current = controller;

    const userMsg = { role: "user" as const, text: query };
    const newMessages = [...chatMessages, userMsg];
    setChatMessages(newMessages);
    setChatInput("");
    setLoading(true);

    const title = activeSessionTitle === "New Tutor Session"
      ? query.slice(0, 30) + (query.length > 30 ? "..." : "")
      : activeSessionTitle;
    setActiveSessionTitle(title);

    try {
      let botResponse = "";

      if (!isOnline) {
        botResponse = getOfflineChatReply(query, sandboxCode);
      } else {
        const res = await fetchWithTimeout(getApiUrl("/api/ai/chat"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: newMessages.slice(-14),
            code: sandboxCode,
            currentCode: sandboxCode,
          }),
          timeoutMs: 45000,
          externalSignal: controller.signal,
        });
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          throw new Error("AI endpoint returned non-JSON response.");
        }
        const data = await res.json();
        const replyText = data.text || data.reply;
        if (res.ok && data.success && replyText) {
          botResponse = replyText;
        } else {
          const reason = data.error ? `> **Note:** ${data.error}\n\n` : "";
          botResponse = reason + getOfflineChatReply(query, sandboxCode);
        }
      }

      const finalMessages = [
        ...newMessages,
        { role: "model" as const, text: botResponse },
      ];
      setChatMessages(finalMessages);

      await saveAiChatSession({
        id: activeSessionId,
        title,
        timestamp: Date.now(),
        messages: finalMessages,
        codeSnippet: sandboxCode,
      });
      loadChatSessions();
    } catch (err: any) {
      if (manualCancelRef.current) return;
      const reason = err?.message ? `> **Note:** ${err.message}\n\n` : "";
      const fallback = reason + getOfflineChatReply(query, sandboxCode);
      const finalMessages = [
        ...newMessages,
        { role: "model" as const, text: fallback },
      ];
      setChatMessages(finalMessages);
    } finally {
      if (activeAbortRef.current === controller) activeAbortRef.current = null;
      setLoading(false);
    }
  };

  // Run Sandbox Python Code
  const handleRunCode = async () => {
    setIsRunning(true);
    setErrorTranslation(null);
    try {
      const res = await runPythonCode(sandboxCode);
      setExecutionResult(res);
      if (res.isError && res.stderr) {
        setErrorTranslation(translatePythonError(res.stderr));
      }
    } catch (err: any) {
      const errRes: ExecutionResult = {
        stdout: "",
        stderr: err?.message || "Execution failed",
        executionTimeMs: 0,
        isError: true,
      };
      setExecutionResult(errRes);
      setErrorTranslation(translatePythonError(errRes.stderr));
    } finally {
      setIsRunning(false);
    }
  };

  const handleStopCode = () => {
    stopPythonExecution();
    setIsRunning(false);
  };

  // Extract code from message to sandbox
  const handleCopyCodeToSandbox = (extractedCode: string) => {
    setSandboxCode(extractedCode);
    setShowSandbox(true);
  };

  const handleCopyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const filteredSessions = savedSessions.filter((s) =>
    s.title.toLowerCase().includes(historySearchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-7.5rem)] md:h-[calc(100vh-3.5rem)] bg-slate-900 text-slate-100 overflow-hidden font-sans select-none">
      {/* Top Fullscreen Tutor Header */}
      <div className="h-12 bg-slate-950 border-b border-slate-800 px-3 sm:px-4 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs shrink-0">
            <Brain className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-bold text-xs sm:text-sm text-white tracking-tight truncate">
                AI Tutor Classroom
              </span>
            </div>
          </div>
        </div>

        {/* Center / Right Header Controls */}
        <div className="flex items-center gap-1.5 text-xs shrink-0">
          {/* New Chat Button */}
          <button
            onClick={handleStartNewSession}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors cursor-pointer touch-target"
            title="Start new tutoring conversation"
          >
            <PlusCircle className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">New Session</span>
          </button>

          {/* History Drawer Toggle */}
          <button
            onClick={() => setShowHistoryDrawer(!showHistoryDrawer)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer touch-target ${
              showHistoryDrawer
                ? "bg-blue-600 border-blue-500 text-white"
                : "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
            }`}
            title="View saved sessions"
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden md:inline">History</span>
          </button>

          {/* Toggle Split-Screen Sandbox */}
          <button
            onClick={() => setShowSandbox(!showSandbox)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer touch-target ${
              showSandbox
                ? "bg-slate-800 text-blue-300 border-blue-500/50"
                : "bg-slate-850 hover:bg-slate-800 text-slate-400 border-slate-800"
            }`}
            title={showSandbox ? "Hide Sandbox IDE" : "Show Sandbox IDE"}
          >
            <Code2 className="w-3.5 h-3.5 text-blue-400" />
            <span>{showSandbox ? "Chat" : "Sandbox"}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace (Split: Left Chat + Right Sandbox) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Chat History Slide-over Drawer */}
        <AnimatePresence>
          {showHistoryDrawer && (
            <motion.div
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              className="absolute top-0 bottom-0 left-0 w-80 bg-slate-950 border-r border-slate-800 z-30 flex flex-col shadow-2xl"
            >
              <div className="p-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Past Tutoring Sessions
                  </span>
                </div>
                <button
                  onClick={() => setShowHistoryDrawer(false)}
                  className="text-slate-400 hover:text-white text-xs p-1"
                >
                  ✕
                </button>
              </div>

              {/* Search History */}
              <div className="p-2 border-b border-slate-800">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search past conversations..."
                    value={historySearchQuery}
                    onChange={(e) => setHistorySearchQuery(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Sessions List */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {filteredSessions.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-6">
                    No sessions saved yet.
                  </p>
                ) : (
                  filteredSessions.map((session) => (
                    <div
                      key={session.id}
                      onClick={() => handleSelectSession(session)}
                      className={`group p-2.5 rounded-xl border flex items-center justify-between transition-colors cursor-pointer text-xs ${
                        activeSessionId === session.id
                          ? "bg-blue-600/20 border-blue-500 text-white font-semibold"
                          : "bg-slate-900/60 hover:bg-slate-900 border-slate-800 text-slate-300"
                      }`}
                    >
                      <div className="truncate pr-2">
                        <div className="truncate">{session.title}</div>
                        <div className="text-[10px] text-slate-500">
                          {new Date(session.timestamp).toLocaleDateString()} · {session.messages.length} msgs
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleDeleteSession(session.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 transition-opacity"
                        title="Delete session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Zone 1: Chat Stream */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-900">
          {/* Welcome Screen or Messages */}
          {chatMessages.length === 0 ? (
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center justify-center max-w-3xl mx-auto text-center space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                <Brain className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Milky AI Assistant & Python Classroom
                </h1>
                <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
                  Ask anything—general topics, coding help, debugging, or interactive lessons straight from the MilkyPy Python curriculum.
                </p>
              </div>

              {/* Starter Question Cards */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left pt-2">
                {TUTOR_PROMPT_SUGGESTIONS.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(item.prompt)}
                      className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500/80 transition-all text-xs group cursor-pointer space-y-1 shadow-xs"
                    >
                      <div className="flex items-center justify-between text-slate-400 group-hover:text-blue-400">
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          {item.category}
                        </span>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="font-semibold text-slate-200 group-hover:text-white leading-snug">
                        {item.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-4xl w-full mx-auto">
              {chatMessages.map((msg, index) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={index}
                    className={`flex gap-3 text-xs leading-relaxed ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isUser && (
                      <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                        <Sparkles className="w-4 h-4 text-amber-300" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl p-4 shadow-xs select-text ${
                        isUser
                          ? "bg-blue-600 text-white font-medium rounded-tr-xs"
                          : "bg-slate-800 border border-slate-700/80 text-slate-200 rounded-tl-xs space-y-2.5"
                      }`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      ) : (
                        <div>
                          <div className="prose prose-invert prose-xs max-w-none text-slate-200">
                            <ReactMarkdown
                              components={{
                                code: ({ node, className, children, ...props }) => {
                                  const match = /language-(\w+)/.exec(className || "");
                                  const codeContent = String(children).replace(/\n$/, "");
                                  const isInline = !match && !codeContent.includes("\n");

                                  if (isInline) {
                                    return (
                                      <code className="px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-emerald-300 font-mono text-[11px]">
                                        {children}
                                      </code>
                                    );
                                  }

                                  return (
                                    <div className="my-3 rounded-xl border border-slate-700 bg-slate-950 overflow-hidden not-prose">
                                      <div className="px-3 py-1.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                                        <span>python</span>
                                        <div className="flex items-center gap-1.5">
                                          <button
                                            onClick={() => handleCopyCodeToSandbox(codeContent)}
                                            className="px-2 py-0.5 rounded bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white text-[10px] font-sans font-bold flex items-center gap-1 transition-colors cursor-pointer"
                                            title="Send code to Sandbox IDE on the right"
                                          >
                                            <Play className="w-2.5 h-2.5 fill-current" />
                                            <span>Test in Sandbox</span>
                                          </button>
                                          <button
                                            onClick={() => navigator.clipboard.writeText(codeContent)}
                                            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-sans font-bold transition-colors cursor-pointer"
                                            title="Copy code snippet"
                                          >
                                            Copy
                                          </button>
                                        </div>
                                      </div>
                                      <pre className="p-3 font-mono text-emerald-400 text-xs overflow-x-auto leading-relaxed">
                                        <code>{codeContent}</code>
                                      </pre>
                                    </div>
                                  );
                                },
                              }}
                            >
                              {msg.text}
                            </ReactMarkdown>
                          </div>

                          {/* Message Footer Action Tools */}
                          <div className="pt-2 border-t border-slate-700/60 flex items-center justify-end gap-2 text-[11px]">
                            <button
                              onClick={() => handleCopyText(msg.text, index)}
                              className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                            >
                              {copiedIndex === index ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy Response</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {isUser && (
                      <div className="w-8 h-8 rounded-xl bg-slate-700 flex items-center justify-center text-white shrink-0 mt-0.5">
                        <span className="text-xs font-bold">You</span>
                      </div>
                    )}
                  </div>
                );
              })}

              {loading && (
                <div className="flex gap-3 text-xs justify-start">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 mt-0.5 animate-pulse">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </div>
                  <div className="bg-slate-800 border border-slate-700 p-3.5 rounded-2xl rounded-tl-xs text-slate-300 flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0.4s]" />
                    </div>
                    <span className="text-xs">Milky is crafting a step-by-step explanation...</span>
                    <button
                      type="button"
                      onClick={handleCancelAiRequest}
                      className="px-2.5 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600/35 text-rose-300 border border-rose-500/30 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                    >
                      <Square className="w-2.5 h-2.5 fill-current" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          )}

          {/* Bottom Chat Input Bar */}
          <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 shrink-0">
            <div className="max-w-4xl mx-auto space-y-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="relative flex items-end gap-2 bg-slate-900 border border-slate-800 focus-within:border-blue-500 rounded-2xl p-2 shadow-inner transition-colors"
              >
                <textarea
                  ref={inputRef}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Ask anything — general questions, Python help, or curriculum lessons... (Shift+Enter for newline)"
                  rows={2}
                  className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-hidden resize-none p-1.5"
                />

                {loading ? (
                  <button
                    type="button"
                    onClick={handleCancelAiRequest}
                    className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer shrink-0"
                    title="Stop AI response"
                  >
                    <Square className="w-3.5 h-3.5 fill-white" />
                    <span className="hidden sm:inline">Stop</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!chatInput.trim()}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                )}
              </form>

              <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                <span>General AI assistant · Python & MilkyPy curriculum specialist</span>
                <span>Press Enter to send</span>
              </div>
            </div>
          </div>
        </div>

        {/* Zone 2: Split-Screen Interactive Sandbox IDE */}
        {showSandbox && (
          <div className="w-[420px] lg:w-[480px] xl:w-[540px] 2xl:w-[600px] border-l border-slate-800 bg-slate-950 flex flex-col h-full overflow-hidden shrink-0 shadow-2xl z-10">
            {/* Sandbox Header */}
            <div className="h-11 px-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Live Python Sandbox
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onNavigateToPlayground(sandboxCode)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                  title="Open code in full Playground view"
                >
                  Full Playground
                </button>

                {isRunning ? (
                  <button
                    onClick={handleStopCode}
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                    title="Stop running code"
                  >
                    <Square className="w-3 h-3 fill-white" />
                    <span>Stop</span>
                  </button>
                ) : (
                  <button
                    onClick={handleRunCode}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>Run</span>
                  </button>
                )}

                <button
                  onClick={() => setShowSandbox(false)}
                  className="p-1 text-slate-400 hover:text-white"
                  title="Close sandbox panel"
                >
                  <PanelRightClose className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sandbox Editor Top Half */}
            <div className="flex-1 min-h-[240px] border-b border-slate-800 overflow-hidden flex flex-col">
              <CodeEditor
                code={sandboxCode}
                onChange={setSandboxCode}
                onRun={handleRunCode}
                isRunning={isRunning}
                title="tutor_sandbox.py"
              />
            </div>

            {/* Live Terminal Console Bottom Half */}
            <div className="h-48 sm:h-56 bg-slate-950 flex flex-col min-h-0 overflow-hidden">
              <div className="px-3 py-1.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400 shrink-0">
                <div className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-blue-400" />
                  <span>Output Console</span>
                </div>
                {executionResult && (
                  <span className="text-[10px] text-slate-500">
                    {executionResult.executionTimeMs}ms
                  </span>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-3 font-mono text-xs space-y-2">
                {/* Friendly Error Translator */}
                {errorTranslation && (
                  <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-800/80 font-sans space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-rose-300">
                      <Bug className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{errorTranslation.headline}</span>
                    </div>
                    <p className="text-[11px] text-rose-200 leading-relaxed">
                      {errorTranslation.explanation}
                    </p>
                    <div className="pt-1 border-t border-rose-900/60 text-[11px] text-amber-200">
                      <strong>Friendly Fix: </strong> {errorTranslation.solutionHint}
                    </div>
                  </div>
                )}

                {/* Output text */}
                {executionResult ? (
                  <>
                    {executionResult.stdout && (
                      <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed">
                        {executionResult.stdout}
                      </pre>
                    )}
                    {executionResult.stderr && !errorTranslation && (
                      <pre className="text-rose-400 whitespace-pre-wrap leading-relaxed">
                        {executionResult.stderr}
                      </pre>
                    )}
                  </>
                ) : (
                  <p className="text-slate-600 italic">
                    Press "Run" to test your Python script in instant browser WASM...
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
