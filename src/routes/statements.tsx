import { createFileRoute } from "@tanstack/react-router";
import { PageShell, SectionCard } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download } from "lucide-react";
import { toast } from "sonner";

const STATEMENTS = [
  { period: "June 2026", type: "Account Statement", account: "Primary Savings", size: "2.1 MB" },
  { period: "Q2 FY2026-27", type: "Capital Gains", account: "Investments", size: "186 KB" },
  { period: "May 2026", type: "Account Statement", account: "Primary Savings", size: "2.4 MB" },
  { period: "April 2026", type: "Account Statement", account: "Salary Account", size: "1.8 MB" },
  { period: "FY 2025-26", type: "Tax P&L", account: "All accounts", size: "412 KB" },
  { period: "March 2026", type: "Credit Card Statement", account: "Platinum Card", size: "640 KB" },
];

export const Route = createFileRoute("/statements")({
  head: () => ({ meta: [{ title: "Statements — YONO AI" }] }),
  component: Statements,
});

function Statements() {
  return (
    <PageShell title="Statements" description="Download and email your statements." actions={<Button size="sm"><Download className="mr-1.5 h-3.5 w-3.5" />Generate custom</Button>}>
      <SectionCard title="Available statements">
        <div className="divide-y">
          {STATEMENTS.map((s, i) => (
            <div key={i} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 py-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><FileText className="h-5 w-5" /></div>
              <div className="min-w-0">
                <div className="font-semibold">{s.type} — {s.period}</div>
                <div className="text-xs text-muted-foreground">{s.account} · {s.size}</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => toast.success("Emailed to you")}>Email</Button>
                <Button size="sm" variant="outline" onClick={() => toast.success("Downloaded PDF")}><Download className="mr-1 h-3 w-3" />PDF</Button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </PageShell>
  );
}
