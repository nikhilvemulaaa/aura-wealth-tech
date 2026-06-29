import { createFileRoute } from "@tanstack/react-router";
import { PageShell, SectionCard } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — YONO AI" }] }),
  component: Settings,
});

function Settings() {
  const profile = useStore(s => s.profile);
  const updateProfile = useStore(s => s.updateProfile);
  const theme = useStore(s => s.theme);
  const toggleTheme = useStore(s => s.toggleTheme);
  const resetData = useStore(s => s.resetData);
  const [prefs, setPrefs] = useState({ email: true, push: true, sms: false, marketing: false, biometric: true, twofa: true });

  return (
    <PageShell title="Settings" description="Customize your experience and security.">
      <SectionCard title="Appearance">
        <div className="flex items-center justify-between"><Label>Dark mode</Label><Switch checked={theme === "dark"} onCheckedChange={toggleTheme} /></div>
      </SectionCard>

      <SectionCard title="Notifications">
        {[
          { k: "email", l: "Email notifications" },
          { k: "push", l: "Push notifications" },
          { k: "sms", l: "SMS alerts" },
          { k: "marketing", l: "Marketing & offers" },
        ].map(p => (
          <div key={p.k} className="flex items-center justify-between border-b py-3 last:border-0">
            <Label>{p.l}</Label>
            <Switch checked={(prefs as any)[p.k]} onCheckedChange={(v) => { setPrefs({ ...prefs, [p.k]: v }); toast.success("Preference saved"); }} />
          </div>
        ))}
      </SectionCard>

      <SectionCard title="Security">
        <div className="flex items-center justify-between border-b py-3"><Label>Biometric login</Label><Switch checked={prefs.biometric} onCheckedChange={(v) => setPrefs({ ...prefs, biometric: v })} /></div>
        <div className="flex items-center justify-between border-b py-3"><Label>Two-factor authentication</Label><Switch checked={prefs.twofa} onCheckedChange={(v) => setPrefs({ ...prefs, twofa: v })} /></div>
        <div className="flex items-center justify-between py-3"><Label>Auto sign-out after</Label>
          <Select defaultValue="15"><SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>{["5", "15", "30", "60"].map(v => <SelectItem key={v} value={v}>{v} min</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </SectionCard>

      <SectionCard title="Preferences">
        <div className="flex items-center justify-between border-b py-3"><Label>Risk profile</Label>
          <Select value={profile.riskProfile} onValueChange={(v: any) => { updateProfile({ riskProfile: v }); toast.success("Risk profile updated"); }}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>{["Conservative", "Moderate", "Aggressive"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between border-b py-3"><Label>Default currency</Label>
          <Select defaultValue="INR"><SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>{["INR", "USD", "EUR", "GBP"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between py-3"><Label>Language</Label>
          <Select defaultValue="en"><SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="en">English</SelectItem><SelectItem value="hi">हिंदी</SelectItem></SelectContent>
          </Select>
        </div>
      </SectionCard>

      <SectionCard title="Danger zone">
        <div className="flex items-center justify-between rounded-xl border border-destructive/30 bg-destructive/5 p-3">
          <div><div className="font-semibold">Reset demo data</div><div className="text-xs text-muted-foreground">Restore all accounts, transactions and goals.</div></div>
          <Button variant="destructive" size="sm" onClick={() => { resetData(); toast.success("Data reset"); }}>Reset</Button>
        </div>
      </SectionCard>
    </PageShell>
  );
}
