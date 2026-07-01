import { useState, useEffect, ReactNode } from "react";
import { ShieldCheck, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ADMIN_PASSWORD = "yono-admin-2026";
const KEY = "yono-admin-unlock";

export function AdminGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [pwd, setPwd] = useState("");
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(KEY) === "1") {
      setUnlocked(true);
    }
  }, []);

  if (unlocked) {
    return (
      <div>
        <div className="mx-auto mb-2 flex w-full max-w-7xl items-center justify-end px-4 pt-4 sm:px-6 lg:px-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              sessionStorage.removeItem(KEY);
              setUnlocked(false);
              setPwd("");
              toast.info("Admin session locked");
            }}
          >
            <Lock className="mr-1.5 h-3.5 w-3.5" /> Lock admin
          </Button>
        </div>
        {children}
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd === ADMIN_PASSWORD) {
      sessionStorage.setItem(KEY, "1");
      setUnlocked(true);
      toast.success("Admin access granted");
    } else {
      setAttempts((a) => a + 1);
      toast.error("Incorrect admin password");
      setPwd("");
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
        </p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <Input
            type="password"
            autoFocus
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            placeholder="Admin password"
            className="h-11"
          />
          <Button type="submit" className="h-11 w-full" disabled={!pwd}>
            Unlock admin dashboard
          </Button>
          {attempts >= 2 && (
            <p className="text-center text-xs text-muted-foreground">
              Hint: default admin password is <code className="rounded bg-muted px-1.5 py-0.5">yono-admin-2026</code>
            </p>
          )}
        </form>
        <div className="mt-6 rounded-xl border bg-muted/30 p-3 text-xs text-muted-foreground">
          <strong className="text-foreground">Security notice.</strong> Admin session auto-locks when you close this tab.
          All actions are logged to the AI gateway audit trail.
        </div>
      </div>
    </div>
  );
}
