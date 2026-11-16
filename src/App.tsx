import React, { useState, useEffect } from "react";
import { AppMode, ThemeMode, UserProgress, UserCloudFile } from "./types";
import { Navbar } from "./components/Navbar";
import { PlaygroundView } from "./components/PlaygroundView";
import { CurriculumView } from "./components/curriculum/CurriculumView";
import { QuizView } from "./components/QuizView";
import { GamesView } from "./components/GamesView";
import { AIAssistPanel } from "./components/AIAssistPanel";
import { StudentAuthModal } from "./components/StudentAuthModal";
import { OfflineIndicator } from "./components/OfflineIndicator";
import { initPyodide } from "./lib/pyodideRunner";
import { X } from "lucide-react";
import {
  loadUserProgress,
  saveUserProgress,
  loadThemePreference,
  saveThemePreference,
} from "./lib/cacheStorage";
import { getApiUrl } from "./lib/apiConfig";

export default function App() {
  const [mode, setMode] = useState<AppMode>("playground");
  const [theme, setTheme] = useState<ThemeMode>(() => loadThemePreference());
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress());
  const [pyodideStatus, setPyodideStatus] = useState<"unloaded" | "loading" | "ready" | "error">("ready");
  const [pyodideProgress, setPyodideProgress] = useState<number>(100);
  const [pyodideStage, setPyodideStage] = useState<string>("Instant Python Ready");

  // User Auth & Cloud Storage State
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    return localStorage.getItem("milkypy_user_id") || null;
  });
  const [userFiles, setUserFiles] = useState<UserCloudFile[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  // AI Modal State
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiCode, setAiCode] = useState("");
  const [aiErrorMessage, setAiErrorMessage] = useState<string | undefined>();
  const [aiLessonContext, setAiLessonContext] = useState<any>();

  // Editor State
  const [currentActiveCode, setCurrentActiveCode] = useState("");

  // Shared snippet notification banner state
  const [sharedToast, setSharedToast] = useState<{ title: string; author?: string } | null>(null);

  // Cross-mode deep-link targets (Curriculum <-> Quiz)
  const [requestedStudyLessonId, setRequestedStudyLessonId] = useState<string | null>(null);
  const [requestedQuizLessonId, setRequestedQuizLessonId] = useState<string | null>(null);
  const [quizReturnContext, setQuizReturnContext] = useState<{
    topicTitle: string;
    question?: string;
  } | null>(null);

  // Check URL for shared snippet parameter (?snippet=... or ?share=...) or mode parameter (?mode=...)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const modeParam = params.get("mode");
      const lessonParam = params.get("lesson");
      const gameParam = params.get("game");

      if (lessonParam || modeParam === "study" || modeParam === "lessons") {
        setMode("study");
      } else if (modeParam === "quiz" || modeParam === "quizzes") {
        setMode("quiz");
      } else if (gameParam || modeParam === "games" || modeParam === "arcade") {
        setMode("games");
      } else if (modeParam === "playground" || modeParam === "code") {
        setMode("playground");
      }

      const snippetId = params.get("snippet") || params.get("share");
      if (snippetId) {
        fetch(getApiUrl(`/api/snippets/${snippetId}`))
          .then(async (res) => {
            const ct = res.headers.get("content-type") || "";
            if (!ct.includes("application/json")) return null;
            return res.json();
          })
          .then((data) => {
            if (data && data.success && data.snippet?.code) {
              setCurrentActiveCode(data.snippet.code);
              setMode("playground");
              setSharedToast({
                title: data.snippet.title || "Shared Python Script",
                author: data.snippet.author,
              });
              setTimeout(() => setSharedToast(null), 6000);
            }
          })
          .catch((err) => {
            console.warn("Failed to load shared snippet from URL:", err);
          });
      }
    } catch (e) {
      console.warn("Error parsing URL params:", e);
    }
  }, []);

  const handleInitPyodide = (simulateCrash = false) => {
    // If explicitly simulating crash, show loading/error
    if (simulateCrash) {
      setPyodideStatus("loading");
    }
    initPyodide((info) => {
      if (simulateCrash) {
        setPyodideStatus(info.status);
      }
      setPyodideProgress(info.progress);
      setPyodideStage(info.stage);
    }, simulateCrash).then(() => {
      setPyodideStatus("ready");
      setPyodideProgress(100);
      setPyodideStage("Python ready");
    });
  };

  // Pre-initialize Pyodide in background and track progress
  useEffect(() => {
    handleInitPyodide(false);
  }, []);

  // Fetch Cloud Files for Current User
  const loadUserCloudFiles = async (userId: string) => {
    try {
      const res = await fetch(getApiUrl(`/api/user/files/${encodeURIComponent(userId)}`));
      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) return;
      const data = await res.json();
      if (data.success && Array.isArray(data.files)) {
        setUserFiles(data.files);
        if (data.files.length > 0) {
          setActiveFileId(data.files[0].id);
          setCurrentActiveCode(data.files[0].code);
        }
      }
    } catch (e) {
      console.warn("Failed to fetch cloud files:", e);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadUserCloudFiles(currentUser);
    }
  }, [currentUser]);

  // Sync theme with DOM class
  useEffect(() => {
    saveThemePreference(theme);
    if (theme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, [theme]);

  const handleUpdateProgress = (newProgress: UserProgress) => {
    setProgress(newProgress);
    // Always persist to local cache so logged-out, guest, and offline users never lose where they left off
    saveUserProgress(newProgress);
  };

  const handleLoginSuccess = (userId: string, files: UserCloudFile[]) => {
    localStorage.setItem("milkypy_user_id", userId);
    setCurrentUser(userId);
    setUserFiles(files);
    if (files.length > 0) {
      setActiveFileId(files[0].id);
      setCurrentActiveCode(files[0].code);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("milkypy_user_id");
    setCurrentUser(null);
    setUserFiles([]);
    setActiveFileId(null);
  };

  const handleSelectFile = (file: UserCloudFile) => {
    setActiveFileId(file.id);
    setCurrentActiveCode(file.code);
  };

  const handleSaveCloudFile = async (fileName: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch(getApiUrl("/api/user/files/save"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser,
          fileId: activeFileId,
          name: fileName,
          code: currentActiveCode,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setUserFiles(data.files || []);
        if (data.file) {
          setActiveFileId(data.file.id);
        }
      }
    } catch (e) {
      console.error("Error saving file to cloud:", e);
    }
  };

  const handleCreateCloudFile = async (fileName: string) => {
    if (!currentUser) return;
    const initialCode = `# ${fileName}\n# Created by student ${currentUser}\n\n# Write your code here\n`;
    try {
      const res = await fetch(getApiUrl("/api/user/files/save"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser,
          name: fileName,
          code: initialCode,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setUserFiles(data.files || []);
        if (data.file) {
          setActiveFileId(data.file.id);
          setCurrentActiveCode(data.file.code);
        }
      }
    } catch (e) {
      console.error("Error creating cloud file:", e);
    }
  };

  const handleDeleteCloudFile = async (fileId: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch(getApiUrl("/api/user/files/delete"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser,
          fileId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const updatedFiles = data.files || [];
        setUserFiles(updatedFiles);
        if (updatedFiles.length > 0) {
          setActiveFileId(updatedFiles[0].id);
          setCurrentActiveCode(updatedFiles[0].code);
        } else {
          setActiveFileId(null);
        }
      }
    } catch (e) {
      console.error("Error deleting cloud file:", e);
    }
  };

  const handleOpenAiAssist = (
    code: string,
    errorMsg?: string,
    lessonCtx?: any
  ) => {
    setAiCode(code);
    setAiErrorMessage(errorMsg);
    setAiLessonContext(lessonCtx);
    setAiModalOpen(true);
  };

  const handleApplyAiCode = (newCode: string) => {
    setCurrentActiveCode(newCode);
    setAiModalOpen(false);
  };

  // Global Keyboard Shortcuts (Ctrl+Enter / Cmd+Enter for Run, Ctrl+K / Cmd+K for AI Assist)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      // 1. Ctrl+K or Cmd+K: Toggle AI Assist Panel
      if (isCtrlOrCmd && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setAiModalOpen((prev) => {
          if (prev) {
            return false;
          } else {
            setAiCode(currentActiveCode);
            setAiErrorMessage(undefined);
            setAiLessonContext(undefined);
            return true;
          }
        });
        return;
      }

      // 2. Ctrl+Enter or Cmd+Enter: Execute / Run Python Code
      if (isCtrlOrCmd && e.key === "Enter") {
        e.preventDefault();
        if (mode !== "playground") {
          setMode("playground");
        }
        window.dispatchEvent(new CustomEvent("milkypy:run-code"));
        return;
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown, true);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown, true);
  }, [currentActiveCode, mode]);

  // Native Android Hardware Back Button listener (Capacitor)
  useEffect(() => {
    let backListenerRemove: (() => void) | null = null;

    import("@capacitor/app")
      .then(({ App: CapacitorApp }) => {
        CapacitorApp.addListener("backButton", ({ canGoBack }) => {
          if (aiModalOpen) {
            setAiModalOpen(false);
          } else if (authModalOpen) {
            setAuthModalOpen(false);
          } else if (mode !== "playground") {
            setMode("playground");
          } else if (!canGoBack) {
            CapacitorApp.exitApp();
          }
        }).then((handle) => {
          backListenerRemove = () => handle.remove();
        });
      })
      .catch(() => {
        // Not running in Capacitor container
      });

    return () => {
      if (backListenerRemove) backListenerRemove();
    };
  }, [aiModalOpen, authModalOpen, mode]);

  return (
    <div className={`min-h-[100dvh] flex flex-col font-sans ${theme === "dark" ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"}`}>
      {/* Navigation Header */}
      <Navbar
        mode={mode}
        setMode={setMode}
        theme={theme}
        setTheme={setTheme}
        pyodideStatus={pyodideStatus}
        pyodideProgress={pyodideProgress}
        pyodideStage={pyodideStage}
        onOpenAiAssist={() => handleOpenAiAssist(currentActiveCode)}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        onReloadPyodide={handleInitPyodide}
      />

      {/* Shared Snippet Loaded Banner */}
      {sharedToast && (
        <div className="bg-blue-600 text-white px-4 py-2 flex items-center justify-between shadow-sm text-xs z-30">
          <div className="flex items-center gap-2">
            <span className="font-bold">Shared:</span>
            <span>
              Loaded <strong className="underline underline-offset-2">{sharedToast.title}</strong>
              {sharedToast.author && ` by ${sharedToast.author}`}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSharedToast(null)}
            className="text-white/80 hover:text-white font-bold ml-4 p-1 cursor-pointer"
            aria-label="Close shared notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Mode Layout */}
      <div className="flex-1 flex flex-col min-h-0 pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
        {mode === "study" ? (
          <CurriculumView
            progress={progress}
            onUpdateProgress={handleUpdateProgress}
            onOpenAiAssist={handleOpenAiAssist}
            currentUser={currentUser}
            onPracticeClick={(code: string) => {
              setQuizReturnContext(null);
              setCurrentActiveCode(code);
              setMode("playground");
            }}
            requestedLessonId={requestedStudyLessonId}
            onClearRequestedLesson={() => setRequestedStudyLessonId(null)}
            onStartLessonQuiz={(lessonId: string) => {
              setQuizReturnContext(null);
              setRequestedQuizLessonId(lessonId);
              setMode("quiz");
            }}
            quizReturnContext={quizReturnContext}
            onReturnToQuiz={() => {
              setQuizReturnContext(null);
              setMode("quiz");
            }}
            onDismissQuizReturn={() => setQuizReturnContext(null)}
          />
        ) : mode === "quiz" ? (
          <QuizView
            progress={progress}
            onUpdateProgress={handleUpdateProgress}
            onOpenAiAssist={handleOpenAiAssist}
            onPracticeClick={(code: string, meta?: { topicTitle?: string; question?: string }) => {
              setQuizReturnContext({
                topicTitle: meta?.topicTitle || "Python Quiz",
                question: meta?.question,
              });
              setCurrentActiveCode(code);
              setMode("playground");
            }}
            onOpenLesson={(lessonId: string, meta?: { topicTitle?: string; question?: string }) => {
              setQuizReturnContext({
                topicTitle: meta?.topicTitle || "Python Quiz",
                question: meta?.question,
              });
              setRequestedStudyLessonId(lessonId);
              setMode("study");
            }}
            requestedLessonId={requestedQuizLessonId}
            onClearRequestedLesson={() => setRequestedQuizLessonId(null)}
          />
        ) : mode === "games" ? (
          <GamesView
            onOpenAiAssist={handleOpenAiAssist}
            onPracticeClick={(code: string) => {
              setQuizReturnContext(null);
              setCurrentActiveCode(code);
              setMode("playground");
            }}
          />
        ) : (
          <PlaygroundView
            activeCode={currentActiveCode}
            onCodeChange={setCurrentActiveCode}
            onOpenAiAssist={handleOpenAiAssist}
            currentUser={currentUser}
            userFiles={userFiles}
            activeFileId={activeFileId}
            onSelectFile={handleSelectFile}
            onSaveFile={handleSaveCloudFile}
            onCreateFile={handleCreateCloudFile}
            onDeleteFile={handleDeleteCloudFile}
            onOpenAuth={() => setAuthModalOpen(true)}
            quizReturnContext={quizReturnContext}
            onReturnToQuiz={() => {
              setQuizReturnContext(null);
              setMode("quiz");
            }}
            onDismissQuizReturn={() => setQuizReturnContext(null)}
          />
        )}
      </div>

      {/* Student Auth Modal */}
      <StudentAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Code Help Sidebar Panel */}
      <AIAssistPanel
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        code={aiCode}
        errorMessage={aiErrorMessage}
        onApplyCode={handleApplyAiCode}
        lessonContext={aiLessonContext}
      />

      {/* Offline Status Indicator */}
      <OfflineIndicator />
    </div>
  );
}
