import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell, SectionCard, StatCard } from "@/components/page-shell";
import { useStore } from "@/lib/store";
import { inr } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { TrendingUp, Plus, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/investments")({
  head: () => ({ meta: [{ title: "Investments — YONO AI" }] }),
  component: Investments,
});

function Investments() {
  const investments = useStore(s => s.investments);
  const invest = useStore(s => s.invest);
  const redeem = useStore(s => s.redeem);
  const [selected, setSelected] = useState<string | null>(null);
  const [mode, setMode] = useState<"invest" | "redeem">("invest");
  const [amount, setAmount] = useState("");

  const totalInv = investments.reduce((a, b) => a + b.invested, 0);
  const totalCur = investments.reduce((a, b) => a + b.current, 0);
  const gain = totalCur - totalInv;
  const gainPct = ((gain / totalInv) * 100).toFixed(2);

  const byType = (t: string) => investments.filter(i => i.type === t);

  function submit() {
    const amt = parseFloat(amount);
    if (!amt || !selected) return;
    if (mode === "invest") invest(selected, amt);
    else redeem(selected, amt);
    toast.success(`${mode === "invest" ? "Invested" : "Redeemed"} ${inr(amt)}`);
    setSelected(null); setAmount("");
  }

  return (
    <PageShell title="Investments" description="Track and grow your portfolio across asset classes.">
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Invested" value={inr(totalInv)} accent="primary" />
        <StatCard label="Current Value" value={inr(totalCur)} icon={<TrendingUp className="h-4 w-4" />} accent="success" />
        <StatCard label="Total Returns" value={inr(gain)} change={`${gainPct}%`} accent="success" />
        <StatCard label="Holdings" value={`${investments.length}`} accent="primary" />
      </div>

      <Tabs defaultValue="all">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="all">All ({investments.length})</TabsTrigger>
          <TabsTrigger value="Mutual Fund">Mutual Funds ({byType("Mutual Fund").length})</TabsTrigger>
          <TabsTrigger value="Stock">Stocks ({byType("Stock").length})</TabsTrigger>
          <TabsTrigger value="Gold">Gold ({byType("Gold").length})</TabsTrigger>
          <TabsTrigger value="Bond">Bonds ({byType("Bond").length})</TabsTrigger>
        </TabsList>
        {["all", "Mutual Fund", "Stock", "Gold", "Bond"].map(t => (
          <TabsContent key={t} value={t} className="mt-4">
            <SectionCard>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs uppercase text-muted-foreground"><tr>
                    <th className="px-3 py-2 text-left">Holding</th>
                    <th className="px-3 py-2 text-right">Invested</th>
                    <th className="px-3 py-2 text-right">Current</th>
                    <th className="px-3 py-2 text-right">P&L</th>
                    <th className="px-3 py-2 text-right">1Y Return</th>
                    <th className="px-3 py-2 text-right">Action</th>
                  </tr></thead>
                  <tbody>
                    {(t === "all" ? investments : byType(t)).map(i => {
                      const pl = i.current - i.invested;
                      const plPct = ((pl / i.invested) * 100).toFixed(2);
                      return (
                        <tr key={i.id} className="border-t hover:bg-muted/30">
                          <td className="px-3 py-3">
                            <div className="font-medium">{i.name}</div>
                            <div className="text-xs text-muted-foreground">{i.type} · {i.risk} risk{i.category ? ` · ${i.category}` : ""}</div>
                          </td>
                          <td className="px-3 py-3 text-right tabular-nums">{inr(i.invested)}</td>
                          <td className="px-3 py-3 text-right font-semibold tabular-nums">{inr(i.current)}</td>
                          <td className={`px-3 py-3 text-right tabular-nums ${pl >= 0 ? "text-success" : "text-destructive"}`}>
                            {pl >= 0 ? "+" : ""}{inr(pl)} ({plPct}%)
                          </td>
                          <td className="px-3 py-3 text-right">
                            <Badge className={i.return1y >= 0 ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}>
                              {i.return1y >= 0 ? <ArrowUpRight className="mr-0.5 h-3 w-3" /> : <ArrowDownRight className="mr-0.5 h-3 w-3" />}
                              {i.return1y}%
                            </Badge>
                          </td>
                          <td className="px-3 py-3 text-right">
                            <Button size="sm" variant="outline" onClick={() => { setSelected(i.id); setMode("invest"); }}><Plus className="mr-1 h-3 w-3" />Invest</Button>
                            <Button size="sm" variant="ghost" className="ml-1" onClick={() => { setSelected(i.id); setMode("redeem"); }}>Redeem</Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>{mode === "invest" ? "Invest more" : "Redeem"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{investments.find(i => i.id === selected)?.name}</p>
            <div className="space-y-1.5">
              <Label>Amount (₹)</Label>
              <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" />
            </div>
            <div className="flex gap-2">
              {[1000, 5000, 10000, 25000].map(v => (
                <Button key={v} size="sm" variant="outline" onClick={() => setAmount(String(v))}>+{v / 1000}K</Button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>Cancel</Button>
            <Button onClick={submit}>{mode === "invest" ? "Invest now" : "Redeem"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
