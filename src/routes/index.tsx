import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Wallet, TrendingUp, PiggyBank, Target, ArrowRightLeft, Bot, Plus, ArrowUpRight, ArrowDownRight,
  Sparkles, RefreshCw,
} from "lucide-react";
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell,
  BarChart, Bar, CartesianGrid, Legend,
} from "recharts";
import { PageShell, StatCard, SectionCard } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { inr, MONTHLY_TREND, NET_WORTH_TREND, SPEND_CATEGORIES, MARKET_INDICES } from "@/lib/mock-data";
import { TransferDialog } from "@/components/dialogs/transfer-dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Dashboard — YONO AI" }, { name: "description", content: "Your personalized wealth dashboard." }] }),
  component: Dashboard,
});

function Dashboard() {
  const accounts = useStore((s) => s.accounts);
  const investments = useStore((s) => s.investments);
  const goals = useStore((s) => s.goals);
  const transactions = useStore((s) => s.transactions);
  const profile = useStore((s) => s.profile);

  const totalBalance = useMemo(() => accounts.reduce((a, b) => a + b.balance, 0), [accounts]);
  const totalInvested = useMemo(() => investments.reduce((a, b) => a + b.invested, 0), [investments]);
  const totalCurrent = useMemo(() => investments.reduce((a, b) => a + b.current, 0), [investments]);
  const totalGoalSaved = useMemo(() => goals.reduce((a, b) => a + b.saved, 0), [goals]);
  const netWorth = totalBalance + totalCurrent + totalGoalSaved;
  const investGain = totalCurrent - totalInvested;
  const investGainPct = ((investGain / totalInvested) * 100).toFixed(2);

  const [transferOpen, setTransferOpen] = useState(false);
  const [period, setPeriod] = useState<"1M" | "3M" | "6M" | "1Y">("6M");

  const healthScore = Math.round(72 + (investGainPct as any) * 0.3);

  return (
    <PageShell
      title={`Hello, ${profile.name.split(" ")[0]} 👋`}
      description="Here's your financial snapshot for today."
      actions={
        <>
          <Button variant="outline" size="sm" onClick={() => toast.success("Dashboard refreshed")}>
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Refresh
          </Button>
          <Button size="sm" onClick={() => setTransferOpen(true)}>
            <ArrowRightLeft className="mr-1.5 h-3.5 w-3.5" /> Transfer
          </Button>
        </>
      }
    >
      {/* Hero net worth */}
      <div className="relative overflow-hidden rounded-3xl border gradient-mesh p-6 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" /> Total Net Worth
            </div>
            <div className="mt-2 number-ticker text-4xl font-bold tracking-tight sm:text-5xl">{inr(netWorth)}</div>
            <div className="mt-2 flex items-center gap-2 text-sm">
              <Badge variant="secondary" className="bg-success/15 text-success">
                <ArrowUpRight className="mr-1 h-3 w-3" /> +12.4% this quarter
              </Badge>
              <span className="text-muted-foreground">vs ₹46.1L last quarter</span>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
              {[
                { label: "Cash", val: inr(totalBalance) },
                { label: "Investments", val: inr(totalCurrent) },
                { label: "Goals", val: inr(totalGoalSaved) },
              ].map((x) => (
                <div key={x.label} className="rounded-xl border bg-card/70 p-3 backdrop-blur">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{x.label}</div>
                  <div className="number-ticker mt-1 text-sm font-bold sm:text-base">{x.val}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="-m-2">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={NET_WORTH_TREND}>
                <defs>
                  <linearGradient id="nw" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.55 0.2 255)" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="oklch(0.55 0.2 255)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="oklch(0.55 0.2 255)" strokeWidth={2.5} fill="url(#nw)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 10, border: "1px solid var(--border)", background: "var(--card)" }}
                  formatter={(v: any) => inr(v as number)}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Balance" value={inr(totalBalance)} change="3.2%" icon={<Wallet className="h-4 w-4" />} accent="primary" />
        <StatCard label="Investments" value={inr(totalCurrent)} change={`${investGainPct}%`} icon={<TrendingUp className="h-4 w-4" />} accent="success" />
        <StatCard label="Active Goals" value={`${goals.length}`} change="2 on track" icon={<Target className="h-4 w-4" />} accent="warning" />
        <StatCard label="Health Score" value={`${healthScore}/100`} change="Excellent" icon={<PiggyBank className="h-4 w-4" />} accent="success" />
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <SectionCard
          title="Income vs Expense"
          description="Last 6 months"
          action={
            <div className="flex gap-1 rounded-lg border bg-muted/30 p-0.5">
              {(["1M", "3M", "6M", "1Y"] as const).map((p) => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium ${period === p ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                  {p}
                </button>
              ))}
            </div>
          }
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={MONTHLY_TREND}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => inr(v)} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--border)", background: "var(--card)" }} formatter={(v: any) => inr(v as number)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="income" fill="oklch(0.65 0.18 155)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expense" fill="oklch(0.65 0.2 25)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="savings" fill="oklch(0.55 0.2 255)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Spending Breakdown" description="This month">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={SPEND_CATEGORIES} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                {SPEND_CATEGORIES.map((e, i) => <Cell key={i} fill={`oklch(${0.6 + i * 0.05} 0.18 ${200 + i * 30})`} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--border)", background: "var(--card)" }} formatter={(v: any) => inr(v as number)} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            {SPEND_CATEGORIES.map((c, i) => (
              <div key={c.name} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: `oklch(${0.6 + i * 0.05} 0.18 ${200 + i * 30})` }} />
                <span className="truncate text-muted-foreground">{c.name}</span>
                <span className="ml-auto font-medium">{inr(c.value)}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* AI insight + Market */}
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <SectionCard
          title="AI Insights"
          description="Personalized for you"
          action={<Button size="sm" variant="outline" asChild><Link to="/advisor"><Bot className="mr-1.5 h-3.5 w-3.5" /> Ask AI</Link></Button>}
          className="relative overflow-hidden"
        >
          <div className="space-y-3">
            {[
              { t: "Tax saving opportunity", b: `You can still invest ₹42,000 under 80C to save up to ₹13,000 in taxes.`, tone: "warning" },
              { t: "Portfolio rebalance", b: `Equity is 18% over your moderate allocation. Shift ₹85,000 to debt.`, tone: "primary" },
              { t: "Spending alert", b: `Shopping is 38% above your 3-month average. Set a monthly cap?`, tone: "destructive" },
            ].map((i) => (
              <div key={i.t} className="rounded-xl border bg-muted/30 p-3 transition hover:bg-muted/60">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full bg-${i.tone}`} />
                  <span className="font-medium">{i.t}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{i.b}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Market today" description="Live market overview">
          <div className="space-y-2">
            {MARKET_INDICES.map((m) => (
              <div key={m.name} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-lg border bg-muted/20 px-3 py-2.5">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{m.name}</div>
                </div>
                <div className="number-ticker text-sm font-semibold">{m.value.toLocaleString("en-IN")}</div>
                <Badge variant="secondary" className={m.change >= 0 ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}>
                  {m.change >= 0 ? <ArrowUpRight className="mr-0.5 h-3 w-3" /> : <ArrowDownRight className="mr-0.5 h-3 w-3" />}
                  {Math.abs(m.change)}%
                </Badge>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Goals + Recent */}
      <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <SectionCard title="Goals progress" description={`${goals.length} active`} action={<Button size="sm" variant="ghost" asChild><Link to="/goals">View all</Link></Button>}>
          <div className="space-y-3">
            {goals.slice(0, 4).map((g) => {
              const pct = Math.min(100, (g.saved / g.target) * 100);
              return (
                <Link key={g.id} to="/goals" className="block rounded-xl border bg-muted/20 p-3 transition hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-background text-lg">{g.icon}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="truncate text-sm font-medium">{g.title}</span>
                        <span className="text-xs font-semibold tabular-nums">{pct.toFixed(0)}%</span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full gradient-primary transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
                        <span>{inr(g.saved)}</span>
                        <span>{inr(g.target)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="Recent activity" description="Latest transactions" action={<Button size="sm" variant="ghost" asChild><Link to="/accounts">View all</Link></Button>}>
          <div className="divide-y">
            {transactions.slice(0, 6).map((t) => (
              <div key={t.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-2.5">
                <div className={`grid h-9 w-9 place-items-center rounded-full ${t.amount > 0 ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                  {t.amount > 0 ? <ArrowDownRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{t.description}</div>
                  <div className="text-xs text-muted-foreground">{new Date(t.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {t.category} · {t.channel}</div>
                </div>
                <div className={`text-sm font-semibold tabular-nums ${t.amount > 0 ? "text-success" : ""}`}>
                  {t.amount > 0 ? "+" : "−"}₹{Math.abs(t.amount).toLocaleString("en-IN")}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <TransferDialog open={transferOpen} onOpenChange={setTransferOpen} />
    </PageShell>
  );
}
