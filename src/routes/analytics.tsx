import { createFileRoute } from "@tanstack/react-router";
import { PageShell, SectionCard, StatCard } from "@/components/page-shell";
import { useStore } from "@/lib/store";
import { inr, SPEND_CATEGORIES, MONTHLY_TREND } from "@/lib/mock-data";
import { useMemo, useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";

const RADAR = [
  { metric: "Savings", value: 82 }, { metric: "Investments", value: 76 }, { metric: "Insurance", value: 88 },
  { metric: "Debt", value: 68 }, { metric: "Emergency", value: 90 }, { metric: "Tax planning", value: 60 },
];

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Spending Analytics — YONO AI" }] }),
  component: Analytics,
});

function Analytics() {
  const txns = useStore(s => s.transactions);
  const [range, setRange] = useState("6M");

  const expense = useMemo(() => txns.filter(t => t.amount < 0).reduce((a, b) => a + Math.abs(b.amount), 0), [txns]);
  const income = useMemo(() => txns.filter(t => t.amount > 0).reduce((a, b) => a + b.amount, 0), [txns]);
  const topMerchants = useMemo(() => {
    const m: Record<string, number> = {};
    txns.filter(t => t.amount < 0 && t.merchant).forEach(t => { m[t.merchant!] = (m[t.merchant!] || 0) + Math.abs(t.amount); });
    return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, value]) => ({ name, value }));
  }, [txns]);

  return (
    <PageShell title="Spending Analytics" description="Understand where your money goes — and where it could go."
      actions={
        <Select value={range} onValueChange={setRange}><SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
          <SelectContent>{["1M", "3M", "6M", "1Y", "All"].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
        </Select>
      }>
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Total income" value={inr(income)} icon={<TrendingUp className="h-4 w-4" />} accent="success" change="4.2%" />
        <StatCard label="Total expense" value={inr(expense)} icon={<TrendingDown className="h-4 w-4" />} accent="destructive" change="6.8%" />
        <StatCard label="Net savings" value={inr(income - expense)} icon={<Wallet className="h-4 w-4" />} accent="primary" />
        <StatCard label="Savings rate" value={`${(((income - expense) / income) * 100).toFixed(1)}%`} accent="success" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <SectionCard title="Income vs Expense trend">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={MONTHLY_TREND}>
              <defs>
                <linearGradient id="inc" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="oklch(0.65 0.18 155)" stopOpacity={0.4} /><stop offset="95%" stopColor="oklch(0.65 0.18 155)" stopOpacity={0} /></linearGradient>
                <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="oklch(0.65 0.2 25)" stopOpacity={0.4} /><stop offset="95%" stopColor="oklch(0.65 0.2 25)" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} tickFormatter={(v) => inr(v)} />
              <Tooltip formatter={(v: any) => inr(v as number)} contentStyle={{ borderRadius: 10, border: "1px solid var(--border)", background: "var(--card)" }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="income" stroke="oklch(0.65 0.18 155)" fill="url(#inc)" strokeWidth={2} />
              <Area type="monotone" dataKey="expense" stroke="oklch(0.65 0.2 25)" fill="url(#exp)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Financial health radar">
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={RADAR}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis tick={{ fontSize: 10 }} angle={90} />
              <Radar dataKey="value" stroke="oklch(0.55 0.2 255)" fill="oklch(0.55 0.2 255)" fillOpacity={0.4} />
            </RadarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Spending by category">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={SPEND_CATEGORIES} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} tickFormatter={(v) => inr(v)} />
              <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} width={80} />
              <Tooltip formatter={(v: any) => inr(v as number)} contentStyle={{ borderRadius: 10, border: "1px solid var(--border)", background: "var(--card)" }} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>{SPEND_CATEGORIES.map((_, i) => <Cell key={i} fill={`oklch(${0.6 + i * 0.04} 0.18 ${220 + i * 25})`} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Top merchants">
          <div className="space-y-3">
            {topMerchants.map((m, i) => {
              const max = topMerchants[0].value;
              return (
                <div key={m.name}>
                  <div className="mb-1 flex justify-between text-sm"><span className="font-medium">{m.name}</span><span className="tabular-nums">{inr(m.value)}</span></div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full gradient-primary" style={{ width: `${(m.value / max) * 100}%` }} /></div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>
    </PageShell>
  );
}
