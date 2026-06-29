import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, SectionCard, EmptyState } from "@/components/page-shell";
import { useStore } from "@/lib/store";
import { Bell, AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications — YONO AI" }] }),
  component: Notifications,
});

const ICONS = { alert: AlertCircle, success: CheckCircle2, info: Info, warning: AlertTriangle };
const TONES: Record<string, string> = { alert: "text-destructive bg-destructive/10", success: "text-success bg-success/10", info: "text-primary bg-primary/10", warning: "text-warning bg-warning/10" };

function Notifications() {
  const notifications = useStore(s => s.notifications);
  const markRead = useStore(s => s.markRead);
  const markAllRead = useStore(s => s.markAllRead);
  const unread = notifications.filter(n => !n.read).length;

  return (
    <PageShell title="Notifications" description={`${unread} unread of ${notifications.length}`} actions={
      <Button size="sm" variant="outline" disabled={unread === 0} onClick={markAllRead}>Mark all read</Button>
    }>
      <SectionCard>
        {notifications.length === 0 ? (
          <EmptyState icon={<Bell className="h-5 w-5" />} title="You're all caught up" />
        ) : (
          <div className="divide-y">
            {notifications.map(n => {
              const Icon = ICONS[n.type as keyof typeof ICONS] || Info;
              return (
                <Link key={n.id} to={n.link || "/notifications"} onClick={() => markRead(n.id)}
                  className={`grid grid-cols-[auto_1fr_auto] items-start gap-3 py-3 transition hover:bg-muted/30 ${!n.read ? "bg-primary/[0.02]" : ""}`}>
                  <div className={`grid h-10 w-10 place-items-center rounded-xl ${TONES[n.type]}`}><Icon className="h-5 w-5" /></div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {!n.read && <span className="h-2 w-2 rounded-full bg-primary" />}
                      <span className="font-semibold">{n.title}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{n.body}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{n.time}</span>
                </Link>
              );
            })}
          </div>
        )}
      </SectionCard>
    </PageShell>
  );
}
