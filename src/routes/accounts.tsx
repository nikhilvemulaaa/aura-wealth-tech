import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageShell, SectionCard, StatCard } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TransferDialog } from "@/components/dialogs/transfer-dialog";
import { useStore } from "@/lib/store";
import { inr } from "@/lib/mock-data";
import { ArrowRightLeft, Download, Search, ArrowUpRight, ArrowDownRight, Wallet, CreditCard } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/accounts")({
  head: () => ({ meta: [{ title: "Accounts — YONO AI" }] }),
  component: Accounts,
});

function Accounts() {
  const accounts = useStore(s => s.accounts);
  const txns = useStore(s => s.transactions);
  const [transferOpen, setTransferOpen] = useState(false);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [type, setType] = useState("all");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = useMemo(() => {
    return txns.filter(t => {
      if (q && !t.description.toLowerCase().includes(q.toLowerCase()) && !t.category.toLowerCase().includes(q.toLowerCase())) return false;
      if (cat !== "all" && t.category !== cat) return false;
      if (type === "credit" && t.amount < 0) return false;
      if (type === "debit" && t.amount > 0) return false;
      return true;
    });
  }, [txns, q, cat, type]);

  const paged = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const cats = Array.from(new Set(txns.map(t => t.category)));
  const total = accounts.reduce((a, b) => a + b.balance, 0);

  function exportCSV() {
    const headers = ["Date", "Description", "Category", "Channel", "Amount"];
    const rows = filtered.map(t => [t.date, t.description, t.category, t.channel, t.amount].join(","));
    const blob = new Blob([headers.join(",") + "\n" + rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "transactions.csv"; a.click();
    toast.success("CSV downloaded");
  }

  return (
    <PageShell title="Accounts" description="All your bank accounts and transactions in one place." actions={
      <>
        <Button variant="outline" size="sm" onClick={exportCSV}><Download className="mr-1.5 h-3.5 w-3.5" />Export</Button>
        <Button size="sm" onClick={() => setTransferOpen(true)}><ArrowRightLeft className="mr-1.5 h-3.5 w-3.5" />Transfer</Button>
      </>
    }>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total balance" value={inr(total)} icon={<Wallet className="h-4 w-4" />} change="3.2%" accent="primary" />
        <StatCard label="Accounts" value={`${accounts.length}`} icon={<CreditCard className="h-4 w-4" />} accent="success" />
        <StatCard label="Avg monthly inflow" value={inr(186500)} change="4.1%" accent="success" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {accounts.map(a => (
          <div key={a.id} className="relative overflow-hidden rounded-2xl border gradient-primary p-5 text-white shadow-lg">
            <div className="flex items-start justify-between">
              <span className="text-xs uppercase tracking-wider opacity-80">{a.type}</span>
              <Badge className="bg-white/20 text-white hover:bg-white/20">Active</Badge>
            </div>
            <div className="mt-6 text-xs opacity-80">Balance</div>
            <div className="number-ticker text-3xl font-bold tracking-tight">{inr(a.balance)}</div>
            <div className="mt-4 flex justify-between text-xs opacity-90">
              <span>{a.number}</span>
              <span>{a.ifsc}</span>
            </div>
          </div>
        ))}
      </div>

      <SectionCard title="Transaction history" description={`${filtered.length} transactions`}>
        <div className="mb-4 grid gap-2 sm:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search transactions…" className="pl-9" />
          </div>
          <Select value={cat} onValueChange={(v) => { setCat(v); setPage(1); }}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {cats.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={type} onValueChange={(v) => { setType(v); setPage(1); }}>
            <SelectTrigger className="w-32"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="credit">Credit</SelectItem>
              <SelectItem value="debit">Debit</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
              <tr><th className="px-3 py-2 text-left">Date</th><th className="px-3 py-2 text-left">Description</th><th className="px-3 py-2 text-left">Category</th><th className="px-3 py-2 text-left">Channel</th><th className="px-3 py-2 text-right">Amount</th></tr>
            </thead>
            <tbody>
              {paged.map(t => (
                <tr key={t.id} className="border-t hover:bg-muted/30">
                  <td className="px-3 py-2.5 text-xs text-muted-foreground">{new Date(t.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className={`grid h-7 w-7 place-items-center rounded-full ${t.amount > 0 ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                        {t.amount > 0 ? <ArrowDownRight className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
                      </span>
                      <span className="truncate font-medium">{t.description}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5"><Badge variant="secondary">{t.category}</Badge></td>
                  <td className="px-3 py-2.5 text-xs text-muted-foreground">{t.channel}</td>
                  <td className={`px-3 py-2.5 text-right font-semibold tabular-nums ${t.amount > 0 ? "text-success" : ""}`}>
                    {t.amount > 0 ? "+" : "−"}₹{Math.abs(t.amount).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr><td colSpan={5} className="px-3 py-12 text-center text-muted-foreground">No transactions match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      </SectionCard>

      <TransferDialog open={transferOpen} onOpenChange={setTransferOpen} />
    </PageShell>
  );
}
