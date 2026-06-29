import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, SectionCard, StatCard } from "@/components/page-shell";
import { useStore } from "@/lib/store";
import { inr } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Search, TrendingUp } from "lucide-react";
import { toast } from "sonner";

const FUNDS = [
  { name: "Axis Bluechip Fund - Direct Growth", cat: "Large Cap", nav: 169.5, ret1y: 18.4, ret3y: 14.2, ret5y: 13.1, rating: 4, aum: "32,400 Cr", min: 500 },
  { name: "Parag Parikh Flexi Cap Fund", cat: "Flexi Cap", nav: 60.4, ret1y: 24.1, ret3y: 19.8, ret5y: 21.5, rating: 5, aum: "62,000 Cr", min: 1000 },
  { name: "ICICI Pru Liquid Fund", cat: "Liquid", nav: 322.7, ret1y: 7.2, ret3y: 6.5, ret5y: 6.1, rating: 4, aum: "48,200 Cr", min: 500 },
  { name: "Mirae Asset Emerging Bluechip", cat: "Large & Mid Cap", nav: 122.8, ret1y: 26.4, ret3y: 18.6, ret5y: 19.8, rating: 5, aum: "29,800 Cr", min: 1000 },
  { name: "SBI Small Cap Fund", cat: "Small Cap", nav: 180.2, ret1y: 32.1, ret3y: 22.5, ret5y: 24.4, rating: 4, aum: "25,500 Cr", min: 500 },
  { name: "HDFC Balanced Advantage", cat: "Hybrid", nav: 450.3, ret1y: 19.2, ret3y: 16.4, ret5y: 14.8, rating: 5, aum: "78,000 Cr", min: 500 },
  { name: "Kotak Equity Opportunities", cat: "Large & Mid Cap", nav: 296.1, ret1y: 22.8, ret3y: 17.3, ret5y: 17.2, rating: 4, aum: "18,600 Cr", min: 500 },
];

const navTrend = Array.from({ length: 12 }, (_, i) => ({ m: i + 1, v: 100 + i * 6 + Math.sin(i) * 3 }));

export const Route = createFileRoute("/mutual-funds")({
  head: () => ({ meta: [{ title: "Mutual Funds — YONO AI" }] }),
  component: MutualFunds,
});

function MutualFunds() {
  const inv = useStore(s => s.investments.filter(i => i.type === "Mutual Fund"));
  const [q, setQ] = useState("");
  const filtered = FUNDS.filter(f => f.name.toLowerCase().includes(q.toLowerCase()) || f.cat.toLowerCase().includes(q.toLowerCase()));

  return (
    <PageShell title="Mutual Funds" description="Discover, analyze and invest in top-rated mutual funds.">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Your MF Value" value={inr(inv.reduce((a, b) => a + b.current, 0))} icon={<TrendingUp className="h-4 w-4" />} accent="primary" />
        <StatCard label="Active SIPs" value="3" change="₹18,000/mo" accent="success" />
        <StatCard label="Average XIRR" value="17.8%" change="2.4%" accent="success" />
      </div>

      <SectionCard title="NAV trend — Axis Bluechip" description="12-month performance">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={navTrend}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--border)", background: "var(--card)" }} />
            <Line type="monotone" dataKey="v" stroke="oklch(0.55 0.2 255)" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </SectionCard>

      <SectionCard title="Explore funds" description={`${filtered.length} funds`}>
        <div className="relative mb-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or category…" className="pl-9" />
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          {filtered.map(f => (
            <div key={f.name} className="rounded-2xl border p-4 transition hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate font-semibold">{f.name}</div>
                  <div className="text-xs text-muted-foreground">{f.cat} · AUM ₹{f.aum}</div>
                </div>
                <div className="flex shrink-0 items-center gap-0.5">{Array.from({ length: 5 }).map((_, i) => <span key={i} className={i < f.rating ? "text-warning" : "text-muted"}>★</span>)}</div>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
                <div><div className="text-muted-foreground">NAV</div><div className="font-semibold">₹{f.nav}</div></div>
                <div><div className="text-muted-foreground">1Y</div><div className="font-semibold text-success">{f.ret1y}%</div></div>
                <div><div className="text-muted-foreground">3Y</div><div className="font-semibold text-success">{f.ret3y}%</div></div>
                <div><div className="text-muted-foreground">5Y</div><div className="font-semibold text-success">{f.ret5y}%</div></div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button size="sm" className="flex-1" onClick={() => toast.success(`SIP set up for ${f.name.split(" ")[0]}`)}>Start SIP</Button>
                <Button size="sm" variant="outline" onClick={() => toast.success("One-time invest initiated")}>Invest once</Button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </PageShell>
  );
}
