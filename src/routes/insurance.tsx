import { createFileRoute } from "@tanstack/react-router";
import { PageShell, SectionCard, StatCard } from "@/components/page-shell";
import { useStore } from "@/lib/store";
import { inr } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Heart, Car, Briefcase } from "lucide-react";
import { toast } from "sonner";

const PLANS = [
  { type: "Term", name: "HDFC Click 2 Protect", cover: "₹1 Cr", premium: "₹14,200/yr", features: ["Life cover till 75", "Return of premium", "Critical illness rider"] },
  { type: "Health", name: "Star Family Floater", cover: "₹10 L", premium: "₹28,400/yr", features: ["Cashless 9000+ hospitals", "No claim bonus", "Restoration benefit"] },
  { type: "Term", name: "ICICI Pru iProtect", cover: "₹1.5 Cr", premium: "₹16,800/yr", features: ["Whole life option", "Tax saving 80C", "Online discount"] },
];

export const Route = createFileRoute("/insurance")({
  head: () => ({ meta: [{ title: "Insurance — YONO AI" }] }),
  component: Insurance,
});

function Insurance() {
  const policies = useStore(s => s.insurance);
  const total = policies.reduce((a, b) => a + b.cover, 0);
  const premium = policies.reduce((a, b) => a + b.premium, 0);

  const icons = { Life: Heart, Health: Heart, Vehicle: Car, Term: Shield } as any;

  return (
    <PageShell title="Insurance" description="Protect your family, health and assets.">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Cover" value={inr(total)} icon={<Shield className="h-4 w-4" />} accent="success" />
        <StatCard label="Annual Premium" value={inr(premium)} accent="primary" />
        <StatCard label="Active Policies" value={`${policies.length}`} accent="primary" />
      </div>

      <SectionCard title="My policies">
        <div className="grid gap-3 lg:grid-cols-2">
          {policies.map(p => {
            const Icon = icons[p.type] || Shield;
            return (
              <div key={p.id} className="rounded-2xl border p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
                    <div><div className="font-semibold">{p.provider}</div><div className="text-xs text-muted-foreground">{p.type} · {p.policyNo}</div></div>
                  </div>
                  <Badge className="bg-success/15 text-success">Active</Badge>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                  <div><div className="text-xs text-muted-foreground">Cover</div><div className="font-semibold">{inr(p.cover)}</div></div>
                  <div><div className="text-xs text-muted-foreground">Premium</div><div className="font-semibold">{inr(p.premium)}/yr</div></div>
                  <div><div className="text-xs text-muted-foreground">Renews</div><div className="font-semibold">{new Date(p.renewal).toLocaleDateString("en-IN")}</div></div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.success("Premium paid")}>Renew</Button>
                  <Button size="sm" variant="outline" onClick={() => toast.info("Claim portal opened")}>Claim</Button>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="Recommended for you" description="Best plans based on your profile">
        <div className="grid gap-3 lg:grid-cols-3">
          {PLANS.map(p => (
            <div key={p.name} className="rounded-2xl border p-4">
              <Badge variant="secondary" className="mb-2">{p.type}</Badge>
              <div className="font-semibold">{p.name}</div>
              <div className="mt-2 text-2xl font-bold text-primary">{p.cover}</div>
              <div className="text-xs text-muted-foreground">{p.premium}</div>
              <ul className="mt-3 space-y-1 text-xs">{p.features.map(f => <li key={f}>✓ {f}</li>)}</ul>
              <Button size="sm" className="mt-3 w-full" onClick={() => toast.success("Quote requested")}>Get quote</Button>
            </div>
          ))}
        </div>
      </SectionCard>
    </PageShell>
  );
}
