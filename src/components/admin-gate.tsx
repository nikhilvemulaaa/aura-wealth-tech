import { useState, useEffect, ReactNode } from "react";
import { ShieldCheck, Lock, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function AdminGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(true);
  const [pwd, setPwd] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/verify", { credentials: "same-origin" })
      .then((r) => (r.ok ? r.json() : { unlocked: false }))
      .then((d) => {
        if (!cancelled) setUnlocked(Boolean(d?.unlocked));
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (checking) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const lock = async () => {
    try {
      await fetch("/api/admin/verify", { method: "DELETE", credentials: "same-origin" });
    } catch {}
    setUnlocked(false);
    setPwd("");
    toast.info("Admin session locked");
  };

  if (unlocked) {
    return (
      <div>
        <div className="mx-auto mb-2 flex w-full max-w-7xl items-center justify-end px-4 pt-4 sm:px-6 lg:px-8">
          <Button variant="outline" size="sm" onClick={lock}>
            <Lock className="mr-1.5 h-3.5 w-3.5" /> Lock admin
          </Button>
        </div>
        {children}
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pwd || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ password: pwd }),
      });
      if (res.ok) {
        setUnlocked(true);
        setPwd("");
        toast.success("Admin access granted");
      } else {
        toast.error("Incorrect admin password");
        setPwd("");
      }
    } catch {
      toast.error("Unable to reach admin service");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col items-center justify-center px-4 py-12">
      <div className="w-full rounded-3xl border bg-card p-8 shadow-xl">
        <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl gradient-primary text-white shadow-lg">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Admin access required</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          This module is restricted. Enter the admin password to view platform data, users and AI gateway logs.
          Credentials are verified server-side.
        </p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <Input
            type="password"
            autoFocus
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            placeholder="Admin password"
            className="h-11"
            maxLength={256}
            autoComplete="current-password"
            disabled={submitting}
          />
          <Button type="submit" className="h-11 w-full" disabled={!pwd || submitting}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Unlock admin dashboard"}
          </Button>
        </form>
        <div className="mt-6 rounded-xl border bg-muted/30 p-3 text-xs text-muted-foreground">
          <strong className="text-foreground">Security notice.</strong> Admin session is issued as a signed,
          HttpOnly cookie and expires after 8 hours or when you lock the session.
          <div className="mt-2">
            Hint: default admin password is{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono">sbiyono123</code>
          </div>
        </div>
      </div>
    </div>
  );
}
