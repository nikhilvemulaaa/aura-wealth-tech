import { ReactNode } from "react";
import { Breadcrumbs } from "@/components/app-header";

export function PageShell({
  title, description, actions, children,
}: { title: string; description?: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <Breadcrumbs />
      <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
        <div className="min-w-0">
          <h1 className="truncate font-display text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  );
}

export function StatCard({
  label, value, change, icon, accent,
}: { label: string; value: string; change?: string; icon?: ReactNode; accent?: "primary" | "success" | "warning" | "destructive" }) {
  const accentClass = {
    primary: "text-primary bg-primary/10",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
    destructive: "text-destructive bg-destructive/10",
  }[accent || "primary"];
  const isPos = change && !change.startsWith("-");
  return (
    <div className="group relative overflow-hidden rounded-2xl border bg-card p-5 transition hover:shadow-lg hover:shadow-primary/5">
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
        {icon && <div className={`grid h-9 w-9 place-items-center rounded-xl ${accentClass}`}>{icon}</div>}
      </div>
      <div className="mt-3 number-ticker text-2xl font-bold tracking-tight">{value}</div>
      {change && (
        <div className={`mt-1 text-xs font-medium ${isPos ? "text-success" : "text-destructive"}`}>
          {isPos ? "↑" : "↓"} {change.replace("-", "")}
        </div>
      )}
    </div>
  );
}

export function SectionCard({ title, description, action, children, className = "" }: { title?: string; description?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border bg-card p-5 ${className}`}>
      {(title || action) && (
        <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="min-w-0">
            {title && <h2 className="truncate font-display text-base font-semibold">{title}</h2>}
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function EmptyState({ icon, title, description, action }: { icon?: ReactNode; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-12 text-center">
      {icon && <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground">{icon}</div>}
      <h3 className="font-display font-semibold">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
