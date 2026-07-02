import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, SectionCard, StatCard } from "@/components/page-shell";
import { useStore } from "@/lib/store";
import { inr } from "@/lib/mock-data";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Treemap } from "recharts";
import { TrendingUp, Briefcase, Shield, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/wealth")({
  head: () => ({ meta: [{ title: "Wealth — YONO AI" }] }),
  component: Wealth,
});

function Wealth() {
  const accounts = useStore(s => s.accounts);
  const inv = useStore(s => s.investments);
  const fds = useStore(s => s.fds);
  const loans = useStore(s => s.loans);
  const ins = useStore(s => s.insurance);

  const cash = accounts.reduce((a, b) => a + b.balance, 0);
  const investments = inv.reduce((a, b) => a + b.current, 0);
  const fdValue = fds.reduce((a, b) => a + b.principal, 0);
  const outstanding = loans.reduce((a, b) => a + b.outstanding, 0);
  const net = cash + investments + fdValue - outstanding;
  const cover = ins.reduce((a, b) => a + b.cover, 0);

  const alloc = [
    { name: "Equity MF & Stocks", value: inv.filter(i => i.type === "Mutual Fund" || i.type === "Stock").reduce((a, b) => a + b.current, 0) },
    { name: "Fixed Deposits", value: fdValue },
    { name: "Cash", value: cash },
    { name: "Gold & Bonds", value: inv.filter(i => i.type === "Gold" || i.type === "Bond").reduce((a, b) => a + b.current, 0) },
  ];

  return (
    <PageShell title="Wealth Overview" description="A complete picture of what you own and what you owe.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Net Worth" value={inr(net)} change="12.4%" icon={<TrendingUp className="h-4 w-4" />} accent="success" />
        <StatCard label="Assets" value={inr(cash + investments + fdValue)} change="8.7%" icon={<Briefcase className="h-4 w-4" />} accent="primary" />
        <StatCard label="Liabilities" value={inr(outstanding)} change="-2.1%" icon={<Target className="h-4 w-4" />} accent="warning" />
        <StatCard label="Insurance Cover" value={inr(cover)} icon={<Shield className="h-4 w-4" />} accent="success" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Asset allocation">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={alloc} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={3}>
                {alloc.map((_, i) => <Cell key={i} fill={`oklch(${0.6 + i * 0.05} 0.18 ${220 + i * 30})`} />)}
              </Pie>
              <Tooltip formatter={(v: any) => inr(v as number)} contentStyle={{ borderRadius: 10, border: "1px solid var(--border)", background: "var(--card)" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-2">
            {alloc.map((a, i) => (
              <div key={a.name} className="flex items-center gap-2 text-sm">
                <span className="h-2 w-2 rounded-full" style={{ background: `oklch(${0.6 + i * 0.05} 0.18 ${220 + i * 30})` }} />
                <span className="flex-1 truncate">{a.name}</span>
                <span className="font-semibold tabular-nums">{inr(a.value)}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Portfolio heatmap" description="Holdings sized by value">
          <ResponsiveContainer width="100%" height={280}>
            <Treemap data={inv.map(i => ({ name: i.name, size: i.current }))} dataKey="size" stroke="var(--background)" fill="oklch(0.55 0.2 255)" />

          </ResponsiveContainer>
        </SectionCard>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[
          { to: "/investments", label: "Investments", desc: "Manage portfolio" },
          { to: "/mutual-funds", label: "Mutual Funds", desc: "SIP & lump sum" },
          { to: "/stocks", label: "Stocks", desc: "Buy & sell equity" },
          { to: "/fixed-deposits", label: "Fixed Deposits", desc: "Open new FD" },
          { to: "/insurance", label: "Insurance", desc: "View policies" },
          { to: "/loans", label: "Loans", desc: "Manage debt" },
        ].map(c => (
          <Button key={c.to} variant="outline" asChild className="h-auto justify-start py-4">
            <Link to={c.to}>
              <div className="text-left">
                <div className="font-semibold">{c.label}</div>
                <div className="text-xs text-muted-foreground">{c.desc}</div>
              </div>
            </Link>
          </Button>
        ))}
      </div>
    </PageShell>
  );
}
