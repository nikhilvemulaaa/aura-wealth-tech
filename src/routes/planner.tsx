import { createFileRoute } from "@tanstack/react-router";
import { PageShell, SectionCard, StatCard } from "@/components/page-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useMemo, useState } from "react";
import { inr } from "@/lib/mock-data";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { CalendarClock, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/planner")({
  head: () => ({ meta: [{ title: "Financial Planner — YONO AI" }] }),
  component: Planner,
});

function Planner() {
  const [monthly, setMonthly] = useState(20000);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(12);
  const [initial, setInitial] = useState(100000);

  const data = useMemo(() => {
    const out = [];
    let val = initial;
    const r = rate / 100 / 12;
    for (let y = 0; y <= years; y++) {
      out.push({ year: y, value: Math.round(val), invested: initial + monthly * 12 * y });
      for (let m = 0; m < 12; m++) val = val * (1 + r) + monthly;
    }
    return out;
  }, [monthly, years, rate, initial]);

  const final = data[data.length - 1];
  const invested = final.invested;
  const corpus = final.value;
  const wealth = corpus - invested;

  return (
    <PageShell title="Financial Planner" description="Project your future wealth with SIP and goal calculators.">
      <Tabs defaultValue="sip">
        <TabsList><TabsTrigger value="sip">SIP Calculator</TabsTrigger><TabsTrigger value="retire">Retirement</TabsTrigger><TabsTrigger value="goal">Goal Planner</TabsTrigger></TabsList>
        <TabsContent value="sip" className="mt-4 space-y-4">
          <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
            <SectionCard title="Inputs">
              <div className="space-y-4">
                <div><Label>Initial investment: {inr(initial)}</Label><Slider value={[initial]} onValueChange={(v) => setInitial(v[0])} min={0} max={1000000} step={5000} /></div>
                <div><Label>Monthly SIP: {inr(monthly)}</Label><Slider value={[monthly]} onValueChange={(v) => setMonthly(v[0])} min={500} max={200000} step={500} /></div>
                <div><Label>Expected return: {rate}%</Label><Slider value={[rate]} onValueChange={(v) => setRate(v[0])} min={4} max={20} step={0.5} /></div>
                <div><Label>Investment period: {years} years</Label><Slider value={[years]} onValueChange={(v) => setYears(v[0])} min={1} max={40} step={1} /></div>
              </div>
            </SectionCard>
            <SectionCard title="Projection">
              <div className="mb-3 grid grid-cols-3 gap-3">
                <StatCard label="Invested" value={inr(invested)} accent="primary" />
                <StatCard label="Wealth gained" value={inr(wealth)} accent="success" />
                <StatCard label="Total corpus" value={inr(corpus)} icon={<TrendingUp className="h-4 w-4" />} accent="success" />
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="oklch(0.55 0.2 255)" stopOpacity={0.5} /><stop offset="95%" stopColor="oklch(0.55 0.2 255)" stopOpacity={0} /></linearGradient>
                    <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="oklch(0.65 0.18 155)" stopOpacity={0.5} /><stop offset="95%" stopColor="oklch(0.65 0.18 155)" stopOpacity={0} /></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} tickFormatter={(v) => inr(v)} />
                  <Tooltip formatter={(v: any) => inr(v as number)} contentStyle={{ borderRadius: 10, border: "1px solid var(--border)", background: "var(--card)" }} />
                  <Area type="monotone" dataKey="invested" stroke="oklch(0.65 0.18 155)" fill="url(#g2)" />
                  <Area type="monotone" dataKey="value" stroke="oklch(0.55 0.2 255)" fill="url(#g1)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </SectionCard>
          </div>
        </TabsContent>
        <TabsContent value="retire" className="mt-4">
          <SectionCard title="Retirement readiness">
            <p className="text-sm text-muted-foreground">Use the same calculator above with a longer horizon (25–40 years) and target corpus of 25–30× annual expenses.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <StatCard label="Suggested corpus" value="₹3.5 Cr" accent="primary" />
              <StatCard label="Years to retirement" value="22" accent="success" />
              <StatCard label="Monthly SIP needed" value="₹35,000" accent="warning" />
            </div>
          </SectionCard>
        </TabsContent>
        <TabsContent value="goal" className="mt-4">
          <SectionCard title="Goal-based planning">
            <p className="text-sm text-muted-foreground">Visit the Goals page to create and track specific financial goals.</p>
            <Button asChild className="mt-3"><a href="/goals">Go to Goals</a></Button>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
