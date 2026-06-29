import { createFileRoute } from "@tanstack/react-router";
import { PageShell, SectionCard, EmptyState } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Upload, FileText, FileScan, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

type Doc = { id: string; name: string; type: string; date: string; status: "Analyzed" | "Processing"; insights: string[] };

const DEMO: Doc[] = [
  { id: "D1", name: "Salary_Slip_Jun_2026.pdf", type: "Salary Slip", date: "2026-06-30", status: "Analyzed", insights: ["Net salary ₹1,82,400", "TDS deducted ₹18,200", "PF contribution ₹14,800"] },
  { id: "D2", name: "SBI_Statement_Q2.pdf", type: "Bank Statement", date: "2026-06-25", status: "Analyzed", insights: ["Avg balance ₹4.2L", "Highest spend: Shopping (₹24,600)", "Recurring SIPs detected: 3"] },
  { id: "D3", name: "Form_16_FY2024-25.pdf", type: "Tax Form", date: "2026-04-12", status: "Analyzed", insights: ["Gross salary ₹22.4L", "80C used ₹1.5L", "Refund eligible ₹8,200"] },
];

export const Route = createFileRoute("/documents")({
  head: () => ({ meta: [{ title: "AI Documents — YONO AI" }] }),
  component: Documents,
});

function Documents() {
  const [docs, setDocs] = useState<Doc[]>(DEMO);

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    files.forEach(f => {
      const id = `D${Date.now()}-${f.name}`;
      const doc: Doc = { id, name: f.name, type: "Document", date: new Date().toISOString(), status: "Processing", insights: [] };
      setDocs(d => [doc, ...d]);
      setTimeout(() => {
        setDocs(d => d.map(x => x.id === id ? { ...x, status: "Analyzed", insights: ["OCR extracted 1,242 characters", "Detected 8 transactions", "Suggested category: Bills"] } : x));
        toast.success(`${f.name} analyzed`);
      }, 1500);
    });
    toast.info(`${files.length} file(s) uploaded`);
  }

  return (
    <PageShell title="AI Document Center" description="Upload statements, tax forms or salary slips for instant AI analysis.">
      <SectionCard>
        <label className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed py-10 transition hover:border-primary hover:bg-muted/30">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary"><Upload className="h-7 w-7" /></div>
          <div className="text-center">
            <div className="font-semibold">Drop files or click to upload</div>
            <div className="text-xs text-muted-foreground">PDF, JPG, PNG · up to 20MB</div>
          </div>
          <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleUpload} />
        </label>
      </SectionCard>

      <SectionCard title="Recent documents" description={`${docs.length} files`}>
        {docs.length === 0 ? (
          <EmptyState icon={<FileText className="h-5 w-5" />} title="No documents yet" description="Upload your first document to begin analysis." />
        ) : (
          <div className="space-y-3">
            {docs.map(d => (
              <div key={d.id} className="rounded-2xl border p-4">
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><FileScan className="h-5 w-5" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2"><span className="truncate font-semibold">{d.name}</span>
                      {d.status === "Analyzed" ? <Badge className="bg-success/15 text-success"><CheckCircle2 className="mr-1 h-3 w-3" />Analyzed</Badge> : <Badge variant="secondary">Processing…</Badge>}
                    </div>
                    <div className="text-xs text-muted-foreground">{d.type} · {new Date(d.date).toLocaleDateString("en-IN")}</div>
                    {d.status === "Analyzed" && (
                      <div className="mt-3 rounded-xl bg-muted/40 p-3">
                        <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary"><Sparkles className="h-3 w-3" />AI insights</div>
                        <ul className="space-y-1 text-sm">{d.insights.map(i => <li key={i}>• {i}</li>)}</ul>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Button size="sm" variant="outline" onClick={() => toast.success("Downloaded")}>Download</Button>
                    <Button size="sm" variant="ghost" onClick={() => { setDocs(ds => ds.filter(x => x.id !== d.id)); toast.success("Deleted"); }}>Delete</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </PageShell>
  );
}
