import { createFileRoute } from "@tanstack/react-router";
import { PageShell, SectionCard, StatCard } from "@/components/page-shell";
import { useStore } from "@/lib/store";
import { inr } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Banknote, Home, Car, GraduationCap } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/loans")({
  head: () => ({ meta: [{ title: "Loans — YONO AI" }] }),
  component: Loans,
});

function Loans() {
  const loans = useStore(s => s.loans);
  const total = loans.reduce((a, b) => a + b.outstanding, 0);
  const emi = loans.reduce((a, b) => a + b.emi, 0);

  const [type, setType] = useState("Home");
  const [amount, setAmount] = useState(2500000);
  const [rate, setRate] = useState(8.65);
  const [years, setYears] = useState(20);

  const monthlyEMI = useMemo(() => {
    const r = rate / 12 / 100;
    const n = years * 12;
    return Math.round((amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  }, [amount, rate, years]);
  const totalPay = monthlyEMI * years * 12;
  const interest = totalPay - amount;

  const icons = { Home, Car, Education: GraduationCap, Personal: Banknote } as any;

  return (
    <PageShell title="Loans" description="Manage existing loans and explore new financing options.">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Outstanding" value={inr(total)} icon={<Banknote className="h-4 w-4" />} accent="warning" />
        <StatCard label="Monthly EMI" value={inr(emi)} accent="primary" />
        <StatCard label="Active Loans" value={`${loans.length}`} accent="primary" />
      </div>

      <SectionCard title="My active loans">
        <div className="grid gap-3 lg:grid-cols-2">
          {loans.map(l => {
            const Icon = icons[l.type] || Banknote;
            const paid = ((l.principal - l.outstanding) / l.principal) * 100;
            return (
              <div key={l.id} className="rounded-2xl border p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-warning/10 text-warning"><Icon className="h-5 w-5" /></div>
                    <div><div className="font-semibold">{l.type} Loan</div><div className="text-xs text-muted-foreground">{l.rate}% · {l.tenureMonths} months</div></div>
                  </div>
                  <Badge variant="outline">Next: {new Date(l.nextDue).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</Badge>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                  <div><div className="text-xs text-muted-foreground">Principal</div><div className="font-semibold">{inr(l.principal)}</div></div>
                  <div><div className="text-xs text-muted-foreground">Outstanding</div><div className="font-semibold text-warning">{inr(l.outstanding)}</div></div>
                  <div><div className="text-xs text-muted-foreground">EMI</div><div className="font-semibold">{inr(l.emi)}</div></div>
                </div>
                <div className="mt-3"><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full gradient-primary" style={{ width: `${paid}%` }} /></div>
                  <div className="mt-1 text-xs text-muted-foreground">{paid.toFixed(0)}% paid</div></div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => toast.success("EMI paid")}>Pay EMI</Button>
                  <Button size="sm" variant="outline" onClick={() => toast.info("Foreclosure quote sent")}>Foreclose</Button>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="EMI calculator" description="Estimate your monthly EMI">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
          <div className="space-y-4">
            <div className="space-y-1.5"><Label>Loan type</Label>
              <Select value={type} onValueChange={setType}><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["Home", "Personal", "Car", "Education"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label>Loan amount: {inr(amount)}</Label>
              <Slider value={[amount]} onValueChange={(v) => setAmount(v[0])} min={100000} max={20000000} step={50000} />
            </div>
            <div className="space-y-1.5"><Label>Interest rate: {rate}%</Label>
              <Slider value={[rate]} onValueChange={(v) => setRate(v[0])} min={5} max={18} step={0.05} />
            </div>
            <div className="space-y-1.5"><Label>Tenure: {years} years</Label>
              <Slider value={[years]} onValueChange={(v) => setYears(v[0])} min={1} max={30} step={1} />
            </div>
          </div>
          <div className="rounded-2xl gradient-primary p-6 text-white lg:w-80">
            <div className="text-sm opacity-90">Monthly EMI</div>
            <div className="number-ticker text-4xl font-bold">{inr(monthlyEMI)}</div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="opacity-80">Principal</span><span className="font-semibold">{inr(amount)}</span></div>
              <div className="flex justify-between"><span className="opacity-80">Total interest</span><span className="font-semibold">{inr(interest)}</span></div>
              <div className="flex justify-between border-t border-white/20 pt-2"><span className="opacity-80">Total payable</span><span className="font-bold">{inr(totalPay)}</span></div>
            </div>
            <Button className="mt-4 w-full bg-white text-primary hover:bg-white/90" onClick={() => toast.success("Loan application started")}>Apply now</Button>
          </div>
        </div>
      </SectionCard>
    </PageShell>
  );
}
