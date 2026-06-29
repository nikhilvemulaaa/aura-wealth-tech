import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell, SectionCard } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { Pencil, ShieldCheck, BadgeCheck } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "My Profile — YONO AI" }] }),
  component: Profile,
});

function Profile() {
  const profile = useStore(s => s.profile);
  const update = useStore(s => s.updateProfile);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile);

  function save(e: React.FormEvent) {
    e.preventDefault();
    update(form);
    toast.success("Profile updated");
    setEditing(false);
  }

  return (
    <PageShell title="My Profile" description="Manage your personal information and KYC.">
      <SectionCard>
        <div className="grid gap-6 sm:grid-cols-[auto_1fr] items-start">
          <Avatar className="h-24 w-24"><AvatarFallback className="bg-primary text-2xl text-primary-foreground">{profile.avatar}</AvatarFallback></Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-2xl font-bold">{profile.name}</h2>
              <Badge className="bg-success/15 text-success"><BadgeCheck className="mr-1 h-3 w-3" />KYC Verified</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Customer ID · {profile.customerId}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="outline"><ShieldCheck className="mr-1 h-3 w-3" />Risk: {profile.riskProfile}</Badge>
              <Badge variant="outline">PAN linked</Badge>
              <Badge variant="outline">Aadhaar linked</Badge>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Personal information" action={
        <Button size="sm" variant="outline" onClick={() => setEditing(!editing)}>
          <Pencil className="mr-1.5 h-3.5 w-3.5" />{editing ? "Cancel" : "Edit"}
        </Button>
      }>
        <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
          {[
            { k: "name", l: "Full name" },
            { k: "email", l: "Email", type: "email" },
            { k: "phone", l: "Phone" },
            { k: "dob", l: "Date of birth", type: "date" },
            { k: "pan", l: "PAN" },
            { k: "aadhaar", l: "Aadhaar" },
          ].map(f => (
            <div key={f.k} className="space-y-1.5">
              <Label>{f.l}</Label>
              <Input
                disabled={!editing}
                type={(f as any).type || "text"}
                value={(form as any)[f.k]}
                onChange={(e) => setForm({ ...form, [f.k]: e.target.value })}
              />
            </div>
          ))}
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Address</Label>
            <Input disabled={!editing} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          {editing && <div className="sm:col-span-2"><Button type="submit">Save changes</Button></div>}
        </form>
      </SectionCard>

      <SectionCard title="Security">
        <div className="space-y-3">
          {[
            { t: "Two-factor authentication", b: "SMS OTP enabled", action: "Manage" },
            { t: "Login activity", b: "5 sessions in last 30 days", action: "View" },
            { t: "Change password", b: "Last changed 45 days ago", action: "Update" },
          ].map(i => (
            <div key={i.t} className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl border p-3">
              <div className="min-w-0">
                <div className="font-medium">{i.t}</div>
                <div className="text-xs text-muted-foreground">{i.b}</div>
              </div>
              <Button size="sm" variant="outline" onClick={() => toast.info(`${i.action} (demo)`)}>{i.action}</Button>
            </div>
          ))}
        </div>
      </SectionCard>
    </PageShell>
  );
}
