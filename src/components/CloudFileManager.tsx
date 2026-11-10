import React, { useState, useEffect } from "react";
import { UserCloudFile } from "../types";
import { motion, AnimatePresence } from "motion/react";
import {
  Save,
  Plus,
  Trash2,
  FileCode,
  Check,
  RefreshCw,
  FolderOpen,
  Cloud,
} from "lucide-react";
import {
  LocalSnippet,
  saveLocalSnippet,
  getLocalSnippets,
  deleteLocalSnippet,
  ensureDefaultLocalSnippets,
} from "../lib/indexedDbStorage";

interface CloudFileManagerProps {
  currentUser: string | null;
  userFiles: UserCloudFile[];
  activeFileId: string | null;
  activeCode: string;
  onSelectFile: (file: UserCloudFile) => void;
  onSaveFile: (fileName: string) => Promise<void>;
  onCreateFile: (fileName: string) => Promise<void>;
  onDeleteFile: (fileId: string) => Promise<void>;
  onOpenAuth: () => void;
}

export const CloudFileManager: React.FC<CloudFileManagerProps> = ({
  currentUser,
  userFiles,
  activeFileId,
  activeCode,
  onSelectFile,
  onSaveFile,
  onCreateFile,
  onDeleteFile,
  onOpenAuth,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [newFileName, setNewFileName] = useState("");

  // Local storage snippets (handled silently in background)
  const [localSnippets, setLocalSnippets] = useState<LocalSnippet[]>([]);
  const [activeLocalSnippetId, setActiveLocalSnippetId] = useState<string | null>("local-main");

  // Load local snippets on mount & user changes
  const reloadLocalSnippets = async () => {
    try {
      await ensureDefaultLocalSnippets();
      const snippets = await getLocalSnippets(currentUser);
      setLocalSnippets(snippets);
    } catch (err) {
      console.warn("Could not load local snippets:", err);
    }
  };

  useEffect(() => {
    reloadLocalSnippets();
  }, [currentUser]);

  // Keep active code saved in background
  useEffect(() => {
    if (activeCode && activeLocalSnippetId) {
      const activeLocal = localSnippets.find((s) => s.id === activeLocalSnippetId);
      if (activeLocal) {
        saveLocalSnippet({
          ...activeLocal,
          code: activeCode,
          updatedAt: Date.now(),
        }).catch(() => {});
      }
    }
  }, [activeCode, activeLocalSnippetId]);

  const currentCloudFile = userFiles.find((f) => f.id === activeFileId);
  const currentLocalFile = localSnippets.find((s) => s.id === activeLocalSnippetId);

  // Clean, universal save button: works everywhere without tech jargon
  const handleSaveCurrent = async () => {
    setIsSaving(true);
    try {
      if (currentUser) {
        const fileName = currentCloudFile ? currentCloudFile.name : currentLocalFile ? currentLocalFile.name : "main.py";
        await onSaveFile(fileName);

        await saveLocalSnippet({
          id: activeFileId || `cached-${Date.now()}`,
          name: fileName,
          code: activeCode,
          updatedAt: Date.now(),
          userId: currentUser,
          synced: true,
        });
        await reloadLocalSnippets();
      } else {
        const fileName = currentLocalFile ? currentLocalFile.name : "main.py";
        const snippetId = activeLocalSnippetId || `local-${Date.now()}`;
        await saveLocalSnippet({
          id: snippetId,
          name: fileName,
          code: activeCode,
          updatedAt: Date.now(),
          userId: "local",
          isLocalDraft: true,
          synced: false,
        });
        setActiveLocalSnippetId(snippetId);
        await reloadLocalSnippets();
      }

      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    } catch (e) {
      console.error("Failed to save file:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    let name = newFileName.trim();
    if (!name.endsWith(".py")) name += ".py";

    if (currentUser) {
      await onCreateFile(name);
    } else {
      const newId = `local-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const newSnippet: LocalSnippet = {
        id: newId,
        name,
        code: `# ${name}\n\nprint("Hello from ${name}!")\n`,
        updatedAt: Date.now(),
        userId: "local",
        isLocalDraft: true,
        synced: false,
      };
      await saveLocalSnippet(newSnippet);
      await reloadLocalSnippets();
      setActiveLocalSnippetId(newId);
      onSelectFile({
        id: newId,
        userId: "local",
        name,
        code: newSnippet.code,
        updatedAt: newSnippet.updatedAt,
      });
    }

    setNewFileName("");
    setShowNewFileModal(false);
  };

  const handleSelectLocal = (snippet: LocalSnippet) => {
    setActiveLocalSnippetId(snippet.id);
    onSelectFile({
      id: snippet.id,
      userId: snippet.userId || currentUser || "local",
      name: snippet.name,
      code: snippet.code,
      updatedAt: snippet.updatedAt,
    });
  };

  const handleDeleteLocal = async (snippetId: string) => {
    try {
      await deleteLocalSnippet(snippetId);
      await reloadLocalSnippets();
      if (activeLocalSnippetId === snippetId) {
        const remaining = localSnippets.filter((s) => s.id !== snippetId);
        if (remaining.length > 0) {
          handleSelectLocal(remaining[0]);
        }
      }
    } catch (err) {
      console.error("Failed to delete snippet:", err);
    }
  };

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {/* Friendly Files Bar */}
      <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg p-1">
        <FolderOpen className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 ml-1 shrink-0" />

        {/* Clean File Selector */}
        <select
          value={activeFileId || activeLocalSnippetId || ""}
          onChange={(e) => {
            const val = e.target.value;
            const local = localSnippets.find((s) => s.id === val);
            if (local) {
              handleSelectLocal(local);
              return;
            }
            const cloudFile = userFiles.find((f) => f.id === val);
            if (cloudFile) {
              setActiveLocalSnippetId(null);
              onSelectFile(cloudFile);
            }
          }}
          className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs rounded-md px-2 py-1 font-medium focus:outline-none focus:border-blue-500 max-w-[130px] sm:max-w-[160px] md:max-w-[180px] truncate cursor-pointer"
        >
          {currentUser ? (
            <>
              <optgroup label="My Cloud Files">
                {userFiles.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </optgroup>
              {localSnippets.length > 0 && (
                <optgroup label="Saved on this Device">
                  {localSnippets.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </optgroup>
              )}
            </>
          ) : (
            localSnippets.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))
          )}
        </select>

        {/* Clean, Simple Save Button */}
        <button
          onClick={handleSaveCurrent}
          disabled={isSaving}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
            justSaved
              ? "bg-emerald-600 text-white"
              : "bg-blue-600 hover:bg-blue-500 text-white shadow-xs"
          }`}
          title="Save your code"
        >
          {isSaving ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : justSaved ? (
            <Check className="w-3.5 h-3.5" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          <span>{justSaved ? "Saved!" : "Save"}</span>
        </button>

        {/* New File Button */}
        <button
          onClick={() => setShowNewFileModal(true)}
          className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          title="Create a new file"
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* Delete Current File Button */}
        {activeLocalSnippetId && localSnippets.length > 1 && !activeFileId && (
          <button
            onClick={() => handleDeleteLocal(activeLocalSnippetId)}
            className="p-1 rounded-md hover:bg-rose-100 dark:hover:bg-rose-950 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
            title="Delete this file"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}

        {currentCloudFile && userFiles.length > 1 && (
          <button
            onClick={() => onDeleteFile(currentCloudFile.id)}
            className="p-1 rounded-md hover:bg-rose-100 dark:hover:bg-rose-950 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
            title="Delete this file"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Login Prompt (Warm & simple) */}
      {!currentUser && (
        <button
          onClick={onOpenAuth}
          className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
          title="Sign in to save files to your account"
        >
          <Cloud className="w-3.5 h-3.5 text-blue-500" />
          <span>Save to Cloud</span>
        </button>
      )}

      {/* New File Modal - Clean, friendly, simple */}
      <AnimatePresence>
        {showNewFileModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-2xl text-slate-800 dark:text-slate-100"
            >
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                  <span>New Python File</span>
                </h4>
                <button
                  onClick={() => setShowNewFileModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-100 cursor-pointer text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateNew} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
                    File Name:
                  </label>
                  <input
                    type="text"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder="e.g. my_game.py or drawing.py"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    autoFocus
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewFileModal(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold dark:hover:bg-slate-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
                  >
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
