"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Eye, EyeOff, Lock, AlertCircle } from "lucide-react";

const ADMIN_PASSWORD = "Hina Mohsin";

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [shake, setShake] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true);
      setErr("");
    } else {
      setErr("Incorrect password. Please try again.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  if (authed) return <>{children}</>;

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div
          className={`bg-[var(--surface)] border border-[var(--border)] rounded-[16px] p-8 ${shake ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
          style={shake ? { animation: "shake 0.5s ease-in-out" } : undefined}
        >
          <div className="flex justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-[16px] bg-[rgba(59,130,246,0.12)] border border-[rgba(59,130,246,0.2)]">
              <ShieldCheck className="h-8 w-8 text-[var(--primary)]" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-[24px] font-semibold text-[var(--text-primary)] mb-2">Admin Access</h2>
            <p className="text-[14px] text-[var(--text-secondary)]">Enter the admin password to access the configuration panel.</p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-[12px] font-medium text-[var(--text-muted)] uppercase tracking-[0.08em] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                <input
                  type={show ? "text" : "password"}
                  value={pw}
                  onChange={(e) => { setPw(e.target.value); setErr(""); }}
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                  className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--background)] py-3 pl-10 pr-12 text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[rgba(59,130,246,0.2)] transition-colors"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {err && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 mt-2 text-[12px] text-[var(--error)]"
                >
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{err}</span>
                </motion.div>
              )}
            </div>

            <motion.button
              type="submit"
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-6 text-[14px] font-medium bg-[var(--primary)] text-white rounded-[10px] hover:bg-[var(--primary-hover)] hover:shadow-[0_0_24px_rgba(59,130,246,0.45)] transition-all duration-200"
            >
              Unlock Admin Panel
            </motion.button>
          </form>
        </div>

        <p className="text-center text-[11px] text-[var(--text-muted)] mt-4">
          Restricted area. Authorized personnel only.
        </p>
      </motion.div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}
