import { createFileRoute } from "@tanstack/react-router";
import { PageShell, SectionCard, StatCard } from "@/components/page-shell";
import { useStore } from "@/lib/store";
import { inr } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Users, ShieldAlert, Activity, Database, Search } from "lucide-react";
import { useMemo, useState } from "react";

const USERS = Array.from({ length: 16 }, (_, i) => ({
  id: `USR-${1000 + i}`,
  name: ["Priya Sharma", "Rahul Verma", "Ananya Patel", "Vikram Singh", "Neha Reddy", "Aman Khan", "Sonia Iyer", "Karthik Rao"][i % 8],
  email: `user${i + 1}@yono.ai`,
  balance: 50000 + i * 31000,
  status: i % 5 === 0 ? "Flagged" : "Active",
  joined: `2024-${(i % 12) + 1}-15`,
}));

import { AdminGate } from "@/components/admin-gate";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — YONO AI" }] }),
  component: () => (
    <AdminGate>
      <Admin />
    </AdminGate>
  ),
});

function Admin() {

  const txns = useStore(s => s.transactions);
  const [q, setQ] = useState("");
  const filtered = useMemo(() => USERS.filter(u => u.name.toLowerCase().includes(q.toLowerCase()) || u.email.includes(q)), [q]);

  return (
    <PageShell title="Admin Dashboard" description="Operational overview of the platform.">
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Total users" value="10,482" change="3.2%" icon={<Users className="h-4 w-4" />} accent="primary" />
        <StatCard label="Active today" value="3,821" change="8.4%" icon={<Activity className="h-4 w-4" />} accent="success" />
        <StatCard label="Flagged cases" value="14" icon={<ShieldAlert className="h-4 w-4" />} accent="destructive" />
        <StatCard label="AI calls today" value="48,290" change="12%" icon={<Database className="h-4 w-4" />} accent="warning" />
      </div>

      <Tabs defaultValue="users">
        <TabsList><TabsTrigger value="users">Users</TabsTrigger><TabsTrigger value="txns">Transactions</TabsTrigger><TabsTrigger value="fraud">Fraud</TabsTrigger><TabsTrigger value="ai">AI Logs</TabsTrigger></TabsList>
        <TabsContent value="users" className="mt-4">
          <SectionCard>
            <div className="relative mb-3"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search users…" className="pl-9" />
            </div>
            <div className="overflow-x-auto"><table className="w-full text-sm">
              <thead className="text-xs uppercase text-muted-foreground"><tr>
                <th className="px-3 py-2 text-left">ID</th><th className="px-3 py-2 text-left">Name</th><th className="px-3 py-2 text-left">Email</th><th className="px-3 py-2 text-right">Balance</th><th className="px-3 py-2 text-left">Joined</th><th className="px-3 py-2 text-left">Status</th>
              </tr></thead>
              <tbody>{filtered.map(u => (
                <tr key={u.id} className="border-t hover:bg-muted/30">
                  <td className="px-3 py-2.5 font-mono text-xs">{u.id}</td>
                  <td className="px-3 py-2.5 font-medium">{u.name}</td>
                  <td className="px-3 py-2.5 text-xs text-muted-foreground">{u.email}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{inr(u.balance)}</td>
                  <td className="px-3 py-2.5 text-xs">{u.joined}</td>
                  <td className="px-3 py-2.5"><Badge className={u.status === "Active" ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}>{u.status}</Badge></td>
                </tr>
              ))}</tbody>
            </table></div>
          </SectionCard>
        </TabsContent>
        <TabsContent value="txns" className="mt-4">
          <SectionCard title="Recent transactions"><div className="overflow-x-auto"><table className="w-full text-sm">
            <thead className="text-xs uppercase text-muted-foreground"><tr>
              <th className="px-3 py-2 text-left">ID</th><th className="px-3 py-2 text-left">Date</th><th className="px-3 py-2 text-left">Description</th><th className="px-3 py-2 text-right">Amount</th>
            </tr></thead><tbody>{txns.slice(0, 20).map(t => (
              <tr key={t.id} className="border-t"><td className="px-3 py-2 font-mono text-xs">{t.id}</td><td className="px-3 py-2 text-xs">{new Date(t.date).toLocaleDateString("en-IN")}</td><td className="px-3 py-2">{t.description}</td><td className={`px-3 py-2 text-right tabular-nums ${t.amount > 0 ? "text-success" : ""}`}>{inr(t.amount)}</td></tr>
            ))}</tbody></table></div></SectionCard>
        </TabsContent>
        <TabsContent value="fraud" className="mt-4">
          <SectionCard title="Fraud cases">
            <div className="space-y-2">{[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-3">
                <ShieldAlert className="h-5 w-5 text-destructive" />
                <div className="flex-1"><div className="font-semibold">Suspicious login attempt</div><div className="text-xs text-muted-foreground">User USR-{1000 + i} · 5 failed attempts from Mumbai</div></div>
                <Button size="sm" variant="outline">Review</Button>
              </div>
            ))}</div>
          </SectionCard>
        </TabsContent>
        <TabsContent value="ai" className="mt-4">
          <SectionCard title="AI Gateway logs">
            <div className="space-y-2 font-mono text-xs">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border bg-muted/30 p-2">
                  <span className="text-success">200</span>
                  <span className="text-muted-foreground">{new Date(Date.now() - i * 60000).toISOString().slice(11, 19)}</span>
                  <span>POST /chat</span>
                  <span className="text-muted-foreground">gemini-3-flash · {220 + i * 13}ms · {340 + i * 21}tok</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
