import React, { useState, useEffect } from "react";
import { UserCloudFile } from "../types";
import { User, Lock, AlertCircle, X, ArrowRight, Eye, EyeOff, UserPlus, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getApiUrl } from "../lib/apiConfig";

interface StudentAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userId: string, files: UserCloudFile[]) => void;
}

export const StudentAuthModal: React.FC<StudentAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");
  const [userIdInput, setUserIdInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setLoading(false);
    }
  }, [isOpen]);

  const handleSwitchTab = (tab: "login" | "signup") => {
    setAuthTab(tab);
    setError(null);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanId = userIdInput.trim().toLowerCase();

    if (!cleanId) {
      setError("Please enter a Student ID (e.g. m162, alex_py).");
      return;
    }
    if (!/^[a-zA-Z0-9_-]{2,32}$/.test(cleanId)) {
      setError("Student ID must be 2–32 characters using only letters, numbers, _ or -.");
      return;
    }
    if (!passwordInput) {
      setError("Please enter a password.");
      return;
    }
    if (authTab === "signup") {
      if (passwordInput.length < 4) {
        setError("Password must be at least 4 characters long.");
        return;
      }
      if (passwordInput !== confirmPasswordInput) {
        setError("Passwords do not match. Please re-enter carefully.");
        return;
      }
    }

    setLoading(true);
    setError(null);

    const endpoint = authTab === "signup" ? "/api/auth/signup" : "/api/auth/login";

    try {
      const res = await fetch(getApiUrl(endpoint), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: cleanId,
          password: passwordInput,
        }),
      });

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error(
          "Authentication service returned an unexpected response. Verify your API backend or Cloudflare Pages Functions deployment."
        );
      }

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(
          data.error || (authTab === "signup" ? "Sign up failed." : "Login failed.")
        );
      }

      onLoginSuccess(data.userId, data.files || []);
      setPasswordInput("");
      setConfirmPasswordInput("");
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to authenticate. Check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="w-full max-w-md bg-white dark:bg-[#15171E] border border-slate-200 dark:border-[#252933] rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-800 dark:text-[#F3F4F6] select-none"
          >
            {/* Header */}
            <div className="p-5 bg-white dark:bg-[#15171E] border-b border-slate-200 dark:border-[#252933] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 dark:bg-[#8BBEFF] flex items-center justify-center text-white dark:text-[#08090D] font-bold text-sm shadow-sm">
                  {authTab === "signup" ? (
                    <UserPlus className="w-5 h-5" />
                  ) : (
                    <LogIn className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-[#F3F4F6]">
                    {authTab === "signup" ? "Create Student Account" : "Student Account Login"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#BFC4CE]">
                    Sync your Python files & progress to the cloud
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#252933] text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Login / Sign Up Mode Switcher */}
            <div className="px-6 pt-5">
              <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-[#08090D] border border-slate-200 dark:border-[#252933]">
                <button
                  type="button"
                  onClick={() => handleSwitchTab("login")}
                  className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    authTab === "login"
                      ? "bg-white dark:bg-[#252933] text-blue-600 dark:text-[#8BBEFF] shadow-xs"
                      : "text-slate-500 dark:text-[#BFC4CE] hover:text-slate-800 dark:hover:text-white"
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Log In</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchTab("signup")}
                  className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    authTab === "signup"
                      ? "bg-white dark:bg-[#252933] text-blue-600 dark:text-[#8BBEFF] shadow-xs"
                      : "text-slate-500 dark:text-[#BFC4CE] hover:text-slate-800 dark:hover:text-white"
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 rounded-xl text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <p>{error}</p>
                    {authTab === "login" && error.toLowerCase().includes("sign up") && (
                      <button
                        type="button"
                        onClick={() => handleSwitchTab("signup")}
                        className="underline font-bold text-rose-800 dark:text-rose-200 cursor-pointer"
                      >
                        Switch to Sign Up →
                      </button>
                    )}
                    {authTab === "signup" && error.toLowerCase().includes("log in") && (
                      <button
                        type="button"
                        onClick={() => handleSwitchTab("login")}
                        className="underline font-bold text-rose-800 dark:text-rose-200 cursor-pointer"
                      >
                        Switch to Log In →
                      </button>
                    )}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 dark:text-[#BFC4CE] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-500 dark:text-[#8BBEFF]" />
                    <span>Student User ID</span>
                  </label>
                  <input
                    type="text"
                    value={userIdInput}
                    onChange={(e) => setUserIdInput(e.target.value)}
                    placeholder="e.g. m162 or alex_py"
                    className="w-full bg-slate-50 dark:bg-[#08090D] border border-slate-200 dark:border-[#252933] rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-[#F3F4F6] font-mono text-sm focus:outline-none focus:border-blue-500 dark:focus:border-[#8BBEFF] transition-colors"
                    autoCapitalize="none"
                    autoCorrect="off"
                    autoComplete="username"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 dark:text-[#BFC4CE] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-blue-500 dark:text-[#8BBEFF]" />
                    <span>Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder={authTab === "signup" ? "Choose a password (min 4 chars)" : "Enter your password"}
                      className="w-full bg-slate-50 dark:bg-[#08090D] border border-slate-200 dark:border-[#252933] rounded-xl pl-3.5 pr-10 py-2.5 text-slate-900 dark:text-[#F3F4F6] text-sm focus:outline-none focus:border-blue-500 dark:focus:border-[#8BBEFF] transition-colors"
                      autoComplete={authTab === "signup" ? "new-password" : "current-password"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {authTab === "signup" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 dark:text-[#BFC4CE] flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-blue-500 dark:text-[#8BBEFF]" />
                      <span>Confirm Password</span>
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPasswordInput}
                      onChange={(e) => setConfirmPasswordInput(e.target.value)}
                      placeholder="Re-enter your password"
                      className="w-full bg-slate-50 dark:bg-[#08090D] border border-slate-200 dark:border-[#252933] rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-[#F3F4F6] text-sm focus:outline-none focus:border-blue-500 dark:focus:border-[#8BBEFF] transition-colors"
                      autoComplete="new-password"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 dark:bg-[#8BBEFF] dark:hover:bg-[#8BBEFF]/90 disabled:opacity-60 text-white dark:text-[#08090D] font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <span>
                    {loading
                      ? authTab === "signup"
                        ? "Creating Account..."
                        : "Signing In..."
                      : authTab === "signup"
                      ? "Create Student Account"
                      : "Log In to Cloud Sync"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <p className="text-[11px] text-slate-500 dark:text-[#BFC4CE]/80 text-center">
                {authTab === "signup"
                  ? "Your Python files are synced securely to cloud storage across devices."
                  : "Demo accounts: m162 / pass123 — or create your own Student ID under Sign Up."}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
