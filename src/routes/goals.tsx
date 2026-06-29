import { createFileRoute } from "@tanstack/react-router";
import { PageShell, SectionCard, StatCard } from "@/components/page-shell";
import { useStore } from "@/lib/store";
import { inr } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Target, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const CATS = ["House", "Car", "Education", "Retirement", "Vacation", "Wedding", "Emergency", "Business"] as const;
const ICONS: Record<string, string> = { House: "🏡", Car: "🚗", Education: "🎓", Retirement: "🌴", Vacation: "✈️", Wedding: "💍", Emergency: "🛟", Business: "💼" };

export const Route = createFileRoute("/goals")({
  head: () => ({ meta: [{ title: "Goals — YONO AI" }] }),
  component: Goals,
});

function Goals() {
  const goals = useStore(s => s.goals);
  const addGoal = useStore(s => s.addGoal);
  const updateGoal = useStore(s => s.updateGoal);
  const deleteGoal = useStore(s => s.deleteGoal);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", target: "", saved: "0", deadline: "", category: "Vacation" as typeof CATS[number] });

  const totalSaved = goals.reduce((a, b) => a + b.saved, 0);
  const totalTarget = goals.reduce((a, b) => a + b.target, 0);

  function create() {
    if (!form.title || !form.target || !form.deadline) { toast.error("Fill all required fields"); return; }
    const target = +form.target;
    const saved = +form.saved;
    const months = Math.max(1, Math.round((+new Date(form.deadline) - Date.now()) / (1000 * 60 * 60 * 24 * 30)));
    addGoal({
      title: form.title, icon: ICONS[form.category], target, saved, deadline: form.deadline,
      monthlyContribution: Math.round((target - saved) / months), category: form.category,
    });
    toast.success("Goal created");
    setOpen(false);
    setForm({ title: "", target: "", saved: "0", deadline: "", category: "Vacation" });
  }

  return (
    <PageShell title="Financial Goals" description="Define what you want. We'll show you how to get there."
      actions={<Button size="sm" onClick={() => setOpen(true)}><Plus className="mr-1.5 h-3.5 w-3.5" />New goal</Button>}>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Goals" value={`${goals.length}`} icon={<Target className="h-4 w-4" />} accent="primary" />
        <StatCard label="Total Target" value={inr(totalTarget)} accent="warning" />
        <StatCard label="Saved" value={inr(totalSaved)} change={`${((totalSaved / totalTarget) * 100).toFixed(0)}% funded`} accent="success" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {goals.map(g => {
          const pct = Math.min(100, (g.saved / g.target) * 100);
          const remaining = g.target - g.saved;
          const months = Math.max(1, Math.round((+new Date(g.deadline) - Date.now()) / (1000 * 60 * 60 * 24 * 30)));
          return (
            <div key={g.id} className="rounded-2xl border p-5">
              <div className="flex items-start gap-3">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-muted text-2xl">{g.icon}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div><div className="font-display text-lg font-semibold">{g.title}</div>
                      <div className="text-xs text-muted-foreground">{g.category} · by {new Date(g.deadline).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</div></div>
                    <Button size="icon" variant="ghost" onClick={() => { deleteGoal(g.id); toast.success("Goal deleted"); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                  <div className="mt-3 flex items-end justify-between">
                    <div><div className="number-ticker text-2xl font-bold">{inr(g.saved)}</div>
                      <div className="text-xs text-muted-foreground">of {inr(g.target)}</div></div>
                    <div className="text-right"><div className="text-xs text-muted-foreground">Monthly</div>
                      <div className="font-semibold">{inr(g.monthlyContribution)}</div></div>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full gradient-primary transition-all" style={{ width: `${pct}%` }} /></div>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="font-medium text-success">{pct.toFixed(1)}% complete</span>
                    <span className="text-muted-foreground">{inr(remaining)} to go · {months}m left</span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" className="flex-1" onClick={() => { updateGoal(g.id, { saved: g.saved + g.monthlyContribution }); toast.success(`Added ${inr(g.monthlyContribution)}`); }}>Contribute</Button>
                    <Button size="sm" variant="outline" onClick={() => toast.info("AI plan generated")}>AI plan</Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Create financial goal</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label>Goal title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Buy a Tesla" /></div>
            <div className="space-y-1.5"><Label>Category</Label>
              <Select value={form.category} onValueChange={(v: any) => setForm({ ...form, category: v })}><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CATS.map(c => <SelectItem key={c} value={c}>{ICONS[c]} {c}</SelectItem>)}</SelectContent></Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Target (₹)</Label><Input type="number" value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Already saved (₹)</Label><Input type="number" value={form.saved} onChange={(e) => setForm({ ...form, saved: e.target.value })} /></div>
            </div>
            <div className="space-y-1.5"><Label>Target date</Label><Input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={create}>Create goal</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
