import { createFileRoute } from "@tanstack/react-router";
import { PageShell, SectionCard, StatCard } from "@/components/page-shell";
import { useStore } from "@/lib/store";
import { inr } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Search, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { toast } from "sonner";

const STOCKS = [
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

function Stocks() {
  const inv = useStore(s => s.investments.filter(i => i.type === "Stock"));
  const [q, setQ] = useState("");
  const filtered = STOCKS.filter(s => s.name.toLowerCase().includes(q.toLowerCase()) || s.sym.toLowerCase().includes(q.toLowerCase()));
  const portValue = inv.reduce((a, b) => a + b.current, 0);

  return (
    <PageShell title="Stocks" description="Trade equities and monitor your portfolio in real time.">
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Portfolio Value" value={inr(portValue)} icon={<TrendingUp className="h-4 w-4" />} accent="primary" />
        <StatCard label="Today's P&L" value="+₹4,820" change="0.84%" accent="success" />
        <StatCard label="Total P&L" value={inr(inv.reduce((a, b) => a + (b.current - b.invested), 0))} change="22.4%" accent="success" />
        <StatCard label="Holdings" value={`${inv.length}`} accent="primary" />
      </div>

      <SectionCard title="My holdings">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-muted-foreground"><tr>
              <th className="px-3 py-2 text-left">Stock</th><th className="px-3 py-2 text-right">Qty</th><th className="px-3 py-2 text-right">Avg Price</th><th className="px-3 py-2 text-right">LTP</th><th className="px-3 py-2 text-right">P&L</th><th className="px-3 py-2"></th>
            </tr></thead>
            <tbody>{inv.map(s => (
              <tr key={s.id} className="border-t hover:bg-muted/30">
                <td className="px-3 py-2.5"><div className="font-medium">{s.name}</div></td>
                <td className="px-3 py-2.5 text-right">{s.units}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">₹{((s.invested) / (s.units || 1)).toFixed(2)}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">₹{s.nav}</td>
                <td className={`px-3 py-2.5 text-right tabular-nums ${s.current >= s.invested ? "text-success" : "text-destructive"}`}>{inr(s.current - s.invested)}</td>
                <td className="px-3 py-2.5 text-right"><Button size="sm" variant="outline" onClick={() => toast.success("Order placed")}>Trade</Button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
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
                  {s.change >= 0 ? <ArrowUpRight className="mr-0.5 h-3 w-3" /> : <ArrowDownRight className="mr-0.5 h-3 w-3" />}{Math.abs(s.change)}%
                </Badge>
              </div>
              <div className="mt-2 number-ticker text-xl font-bold">₹{s.price}</div>
              <div className="text-xs text-muted-foreground">M.Cap ₹{s.mcap}</div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button size="sm" className="bg-success hover:bg-success/90" onClick={() => toast.success(`Buy order placed for ${s.sym}`)}>Buy</Button>
                <Button size="sm" variant="outline" onClick={() => toast.info(`Sell order for ${s.sym}`)}>Sell</Button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </PageShell>
  );
}
