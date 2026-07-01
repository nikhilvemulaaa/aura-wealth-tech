import { createFileRoute } from "@tanstack/react-router";
import { PageShell, SectionCard, StatCard } from "@/components/page-shell";
import { useStore } from "@/lib/store";
import { inr } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useMemo } from "react";
import { Search, TrendingUp, ArrowUpRight, ArrowDownRight, Landmark } from "lucide-react";
import { toast } from "sonner";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import sbinData from "@/data/sbin-stock.json";

const STOCKS = [
  { sym: "SBIN", name: "State Bank of India", price: sbinData.current, change: sbinData.changePct, mcap: "7.3L Cr", sector: "Banking" },
  { sym: "RELIANCE", name: "Reliance Industries", price: 2381.3, change: 1.24, mcap: "16.1L Cr", sector: "Energy" },
  { sym: "HDFCBANK", name: "HDFC Bank", price: 1621.5, change: 0.85, mcap: "12.3L Cr", sector: "Banking" },
  { sym: "TCS", name: "Tata Consultancy Services", price: 3848.0, change: -0.42, mcap: "13.9L Cr", sector: "IT" },
  { sym: "INFY", name: "Infosys", price: 1742.6, change: 1.05, mcap: "7.2L Cr", sector: "IT" },
  { sym: "ICICIBANK", name: "ICICI Bank", price: 1185.4, change: 1.92, mcap: "8.3L Cr", sector: "Banking" },
  { sym: "BHARTIARTL", name: "Bharti Airtel", price: 1521.2, change: 0.62, mcap: "8.6L Cr", sector: "Telecom" },
  { sym: "ITC", name: "ITC Limited", price: 428.7, change: -0.18, mcap: "5.4L Cr", sector: "FMCG" },
  { sym: "WIPRO", name: "Wipro", price: 542.3, change: -1.08, mcap: "2.8L Cr", sector: "IT" },
];

export const Route = createFileRoute("/stocks")({
  head: () => ({ meta: [{ title: "Stocks — YONO AI" }] }),
  component: Stocks,
});

type Range = "1M" | "6M" | "1Y" | "5Y" | "ALL";

function Stocks() {
  const inv = useStore(s => s.investments.filter(i => i.type === "Stock"));
  const invest = useStore(s => s.invest);
  const redeem = useStore(s => s.redeem);
  const [q, setQ] = useState("");
  const [range, setRange] = useState<Range>("1Y");
  const [trade, setTrade] = useState<{ sym: string; name: string; price: number; side: "Buy" | "Sell" } | null>(null);
  const [qty, setQty] = useState(10);

  const filtered = STOCKS.filter(s => s.name.toLowerCase().includes(q.toLowerCase()) || s.sym.toLowerCase().includes(q.toLowerCase()));
  const portValue = inv.reduce((a, b) => a + b.current, 0);

  const chartData = useMemo(() => {
    const monthly = sbinData.monthly;
    const daily = sbinData.daily;
    if (range === "1M") return daily.slice(-22).map(d => ({ date: d.date, close: d.close }));
    if (range === "6M") return daily.map(d => ({ date: d.date, close: d.close }));
    if (range === "1Y") return monthly.slice(-12);
    if (range === "5Y") return monthly.slice(-60);
    return monthly;
  }, [range]);

  const executeTrade = () => {
    if (!trade || qty <= 0) return;
    const total = trade.price * qty;
    const existing = inv.find(i => i.name.includes(trade.name));
    if (trade.side === "Buy") {
      if (existing) invest(existing.id, total);
      else toast.info(`Added ${qty} shares of ${trade.sym} to watchlist`);
      toast.success(`Bought ${qty} × ${trade.sym} @ ₹${trade.price.toFixed(2)} = ${inr(total)}`);
    } else {
      if (existing) redeem(existing.id, total);
      toast.success(`Sold ${qty} × ${trade.sym} @ ₹${trade.price.toFixed(2)} = ${inr(total)}`);
    }
    setTrade(null); setQty(10);
  };

  const sbiUp = sbinData.change >= 0;

  return (
    <PageShell title="Stocks" description="Trade equities and monitor your portfolio in real time.">
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Portfolio Value" value={inr(portValue)} icon={<TrendingUp className="h-4 w-4" />} accent="primary" />
        <StatCard label="Today's P&L" value="+₹4,820" change="0.84%" accent="success" />
        <StatCard label="Total P&L" value={inr(inv.reduce((a, b) => a + (b.current - b.invested), 0))} change="22.4%" accent="success" />
        <StatCard label="Holdings" value={`${inv.length}`} accent="primary" />
      </div>

      {/* SBIN featured — real historical data */}
      <SectionCard>
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                <Landmark className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <h2 className="font-display text-xl font-bold">SBIN</h2>
                  <span className="text-sm text-muted-foreground">{sbinData.name}</span>
                  <Badge variant="secondary" className="ml-1">NSE</Badge>
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">Last updated {sbinData.lastUpdate} · Historical data 1994–2025</div>
              </div>
            </div>
            <div className="mt-3 flex items-end gap-3">
              <span className="number-ticker text-3xl font-bold tracking-tight">₹{sbinData.current.toFixed(2)}</span>
              <Badge className={sbiUp ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}>
                {sbiUp ? <ArrowUpRight className="mr-0.5 h-3 w-3" /> : <ArrowDownRight className="mr-0.5 h-3 w-3" />}
                {sbinData.change >= 0 ? "+" : ""}{sbinData.change.toFixed(2)} ({sbinData.changePct.toFixed(2)}%)
              </Badge>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
              <Metric label="Prev Close" value={`₹${sbinData.prevClose.toFixed(2)}`} />
              <Metric label="52W High" value={`₹${sbinData.high52w.toFixed(2)}`} />
              <Metric label="52W Low" value={`₹${sbinData.low52w.toFixed(2)}`} />
              <Metric label="Volume" value={(sbinData.volume / 100000).toFixed(2) + " L"} />
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
            <Button className="bg-success hover:bg-success/90" onClick={() => setTrade({ sym: "SBIN", name: "State Bank of India", price: sbinData.current, side: "Buy" })}>Buy SBIN</Button>
            <Button variant="outline" onClick={() => setTrade({ sym: "SBIN", name: "State Bank of India", price: sbinData.current, side: "Sell" })}>Sell SBIN</Button>
          </div>
        </div>

        <div className="mt-5">
          <Tabs value={range} onValueChange={(v) => setRange(v as Range)}>
            <TabsList>
              <TabsTrigger value="1M">1M</TabsTrigger>
              <TabsTrigger value="6M">6M</TabsTrigger>
              <TabsTrigger value="1Y">1Y</TabsTrigger>
              <TabsTrigger value="5Y">5Y</TabsTrigger>
              <TabsTrigger value="ALL">ALL</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="mt-3 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="sbi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} minTickGap={40} tickFormatter={(v) => (range === "1M" || range === "6M") ? v.slice(5) : v.slice(0, 7)} />
                <YAxis tick={{ fontSize: 11 }} domain={["auto", "auto"]} tickFormatter={(v) => `₹${v}`} width={60} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
                  formatter={(v: number) => [`₹${v.toFixed(2)}`, "Close"]}
                />
                <Area type="monotone" dataKey="close" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#sbi)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="My holdings">
        {inv.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">No holdings yet. Buy your first stock above.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-muted-foreground"><tr>
                <th className="px-3 py-2 text-left">Stock</th><th className="px-3 py-2 text-right">Qty</th><th className="px-3 py-2 text-right">Avg Price</th><th className="px-3 py-2 text-right">LTP</th><th className="px-3 py-2 text-right">P&L</th><th className="px-3 py-2"></th>
              </tr></thead>
              <tbody>{inv.map(s => (
                <tr key={s.id} className="border-t hover:bg-muted/30">
                  <td className="px-3 py-2.5"><div className="font-medium">{s.name}</div></td>
                  <td className="px-3 py-2.5 text-right">{s.units}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">₹{(s.invested / (s.units || 1)).toFixed(2)}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">₹{s.nav}</td>
                  <td className={`px-3 py-2.5 text-right tabular-nums ${s.current >= s.invested ? "text-success" : "text-destructive"}`}>{inr(s.current - s.invested)}</td>
                  <td className="px-3 py-2.5 text-right">
                    <Button size="sm" variant="outline" onClick={() => setTrade({ sym: s.name.split(" ")[0].toUpperCase(), name: s.name, price: s.nav || 0, side: "Sell" })}>Trade</Button>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Discover stocks" description={`${filtered.length} stocks`}>
        <div className="relative mb-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search stocks…" className="pl-9" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map(s => (
            <div key={s.sym} className="rounded-2xl border p-4 transition hover:shadow-md">
              <div className="flex items-start justify-between">
                <div><div className="font-bold">{s.sym}</div><div className="text-xs text-muted-foreground">{s.sector}</div></div>
                <Badge className={s.change >= 0 ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}>
                  {s.change >= 0 ? <ArrowUpRight className="mr-0.5 h-3 w-3" /> : <ArrowDownRight className="mr-0.5 h-3 w-3" />}{Math.abs(s.change).toFixed(2)}%
                </Badge>
              </div>
              <div className="mt-2 number-ticker text-xl font-bold">₹{s.price.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">M.Cap ₹{s.mcap}</div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button size="sm" className="bg-success hover:bg-success/90" onClick={() => setTrade({ sym: s.sym, name: s.name, price: s.price, side: "Buy" })}>Buy</Button>
                <Button size="sm" variant="outline" onClick={() => setTrade({ sym: s.sym, name: s.name, price: s.price, side: "Sell" })}>Sell</Button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <Dialog open={!!trade} onOpenChange={(o) => !o && setTrade(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{trade?.side} {trade?.sym}</DialogTitle>
          </DialogHeader>
          {trade && (
            <div className="space-y-4">
              <div className="rounded-xl border bg-muted/30 p-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">{trade.name}</span><span className="font-semibold">₹{trade.price.toFixed(2)}</span></div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Quantity</label>
                <Input type="number" min={1} value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))} className="mt-1" />
              </div>
              <div className="flex justify-between rounded-xl bg-primary/5 p-3 text-sm">
                <span>Order value</span>
                <span className="font-bold tabular-nums">{inr(trade.price * qty)}</span>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setTrade(null)}>Cancel</Button>
                <Button className={trade.side === "Buy" ? "bg-success hover:bg-success/90" : ""} onClick={executeTrade}>
                  Confirm {trade.side}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-muted/20 p-2">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-semibold tabular-nums">{value}</div>
    </div>
  );
}
