import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell, SectionCard, StatCard } from "@/components/page-shell";
import { useStore } from "@/lib/store";
import { inr } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { PiggyBank, Plus, Calendar } from "lucide-react";
import { toast } from "sonner";

const RATES = [
  { bank: "SBI", tenure: 12, rate: 6.8 }, { bank: "SBI", tenure: 24, rate: 7.1 }, { bank: "SBI", tenure: 36, rate: 7.25 },
  { bank: "HDFC", tenure: 12, rate: 6.9 }, { bank: "HDFC", tenure: 24, rate: 7.2 }, { bank: "HDFC", tenure: 36, rate: 7.3 },
  { bank: "ICICI", tenure: 12, rate: 7.0 }, { bank: "ICICI", tenure: 24, rate: 7.15 }, { bank: "ICICI", tenure: 36, rate: 7.4 },
  { bank: "Axis", tenure: 12, rate: 6.95 }, { bank: "Axis", tenure: 36, rate: 7.35 },
];

export const Route = createFileRoute("/fixed-deposits")({
  head: () => ({ meta: [{ title: "Fixed Deposits — YONO AI" }] }),
  component: FixedDeposits,
});

function FixedDeposits() {
  const fds = useStore(s => s.fds);
  const addFD = useStore(s => s.addFD);
  const [open, setOpen] = useState(false);
  const [bank, setBank] = useState("SBI");
  const [tenure, setTenure] = useState("24");
  const [amount, setAmount] = useState("");

  const total = fds.reduce((a, b) => a + b.principal, 0);
  const maturity = fds.reduce((a, b) => a + b.maturityAmount, 0);
  const rate = RATES.find(r => r.bank === bank && r.tenure === +tenure)?.rate || 7;
  const proj = amount ? +amount * Math.pow(1 + rate / 100, +tenure / 12) : 0;

  function open_() {
    const p = parseFloat(amount);
    if (!p) { toast.error("Enter amount"); return; }
    const start = new Date();
    const mat = new Date(); mat.setMonth(mat.getMonth() + +tenure);
    addFD({
      bank, principal: p, rate, tenureMonths: +tenure,
      startDate: start.toISOString(), maturityDate: mat.toISOString(),
      maturityAmount: Math.round(p * Math.pow(1 + rate / 100, +tenure / 12)),
    });
    toast.success(`FD of ${inr(p)} opened with ${bank}`);
    setOpen(false); setAmount("");
  }

  return (
    <PageShell title="Fixed Deposits" description="Lock in guaranteed returns with the best FD rates."
      actions={<Button size="sm" onClick={() => setOpen(true)}><Plus className="mr-1.5 h-3.5 w-3.5" />Open new FD</Button>}>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total FD Value" value={inr(total)} icon={<PiggyBank className="h-4 w-4" />} accent="primary" />
        <StatCard label="At Maturity" value={inr(maturity)} accent="success" />
        <StatCard label="Active FDs" value={`${fds.length}`} accent="warning" />
      </div>

      <SectionCard title="Your fixed deposits">
        <div className="grid gap-3 lg:grid-cols-2">
          {fds.map(f => (
            <div key={f.id} className="rounded-2xl border p-4 transition hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-display text-lg font-bold">{f.bank}</div>
                  <div className="text-xs text-muted-foreground">{f.tenureMonths} months · {f.rate}% p.a.</div>
                </div>
                <Badge className="bg-success/15 text-success">Active</Badge>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div><div className="text-xs text-muted-foreground">Principal</div><div className="font-semibold">{inr(f.principal)}</div></div>
                <div><div className="text-xs text-muted-foreground">Maturity</div><div className="font-semibold text-success">{inr(f.maturityAmount)}</div></div>
                <div><div className="text-xs text-muted-foreground">Started</div><div>{new Date(f.startDate).toLocaleDateString("en-IN")}</div></div>
                <div><div className="text-xs text-muted-foreground">Matures</div><div className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(f.maturityDate).toLocaleDateString("en-IN")}</div></div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Compare FD rates" description="Best rates across banks today">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-muted-foreground"><tr>
              <th className="px-3 py-2 text-left">Bank</th><th className="px-3 py-2 text-left">Tenure</th><th className="px-3 py-2 text-right">Interest Rate</th><th className="px-3 py-2 text-right">Senior Rate</th><th className="px-3 py-2"></th>
            </tr></thead>
            <tbody>
              {RATES.map((r, i) => (
                <tr key={i} className="border-t hover:bg-muted/30">
                  <td className="px-3 py-2.5 font-medium">{r.bank}</td>
                  <td className="px-3 py-2.5">{r.tenure} months</td>
                  <td className="px-3 py-2.5 text-right font-semibold">{r.rate}%</td>
                  <td className="px-3 py-2.5 text-right text-success">{(r.rate + 0.5).toFixed(2)}%</td>
                  <td className="px-3 py-2.5 text-right"><Button size="sm" variant="outline" onClick={() => { setBank(r.bank); setTenure(String(r.tenure)); setOpen(true); }}>Open</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Open new fixed deposit</DialogTitle><DialogDescription>Lock in today's rate.</DialogDescription></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Bank</Label>
                <Select value={bank} onValueChange={setBank}><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{Array.from(new Set(RATES.map(r => r.bank))).map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label>Tenure (months)</Label>
                <Select value={tenure} onValueChange={setTenure}><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{[12, 24, 36, 60].map(t => <SelectItem key={t} value={String(t)}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5"><Label>Amount (₹)</Label>
              <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="50,000" />
            </div>
            <div className="rounded-xl bg-muted/40 p-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Interest Rate</span><span className="font-semibold">{rate}% p.a.</span></div>
              {proj > 0 && <div className="mt-1 flex justify-between"><span className="text-muted-foreground">Maturity Amount</span><span className="font-bold text-success">{inr(proj)}</span></div>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={open_}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
