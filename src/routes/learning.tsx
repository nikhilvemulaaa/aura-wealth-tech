import { createFileRoute } from "@tanstack/react-router";
import { PageShell, SectionCard } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { GraduationCap, Play, Clock, BookOpen, Search, Sparkles, ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import knowledge from "@/data/finance-knowledge.json";

type QA = { q: string; a: string; category: string };
const KB = knowledge as QA[];
const CATEGORIES = ["All", ...Array.from(new Set(KB.map(k => k.category))).sort()];

const COURSES = [
  { title: "Personal finance fundamentals", level: "Beginner", duration: "45 min", lessons: 8, category: "Basics" },
  { title: "Understanding mutual funds", level: "Beginner", duration: "60 min", lessons: 10, category: "Investing" },
  { title: "Build a balanced portfolio", level: "Intermediate", duration: "90 min", lessons: 12, category: "Investing" },
  { title: "Tax planning for salaried Indians", level: "Intermediate", duration: "75 min", lessons: 9, category: "Tax" },
  { title: "Retirement planning blueprint", level: "Advanced", duration: "2 hours", lessons: 14, category: "Planning" },
  { title: "Stock market for beginners", level: "Beginner", duration: "60 min", lessons: 8, category: "Investing" },
];

const ARTICLES = [
  "Why your emergency fund needs 6 months of expenses",
  "ELSS vs PPF: which 80C option wins in 2026?",
  "5 mistakes first-time investors make",
  "How to read a mutual fund factsheet in 5 minutes",
  "SIP step-up: the secret to early retirement",
];

export const Route = createFileRoute("/learning")({
  head: () => ({ meta: [{ title: "Learning Hub — YONO AI" }] }),
  component: Learning,
});

function Learning() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");

  const filtered = useMemo(() => {
    const ql = q.toLowerCase();
    return KB.filter(k => (cat === "All" || k.category === cat) && (!ql || k.q.toLowerCase().includes(ql) || k.a.toLowerCase().includes(ql))).slice(0, 30);
  }, [q, cat]);

  return (
    <PageShell title="Learning Hub" description="Build financial confidence with bite-sized lessons and real-world guidance.">
      <SectionCard title="Featured courses">
        <div className="grid gap-3 lg:grid-cols-3">
          {COURSES.map(c => (
            <div key={c.title} className="group relative overflow-hidden rounded-2xl border bg-card transition hover:shadow-lg">
              <div className="h-32 gradient-mesh" />
              <div className="p-4">
                <Badge variant="secondary" className="mb-2">{c.category}</Badge>
                <h3 className="font-display font-semibold">{c.title}</h3>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{c.duration}</span>
                  <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{c.lessons} lessons</span>
                  <Badge variant="outline" className="ml-auto">{c.level}</Badge>
                </div>
                <Button size="sm" className="mt-3 w-full" onClick={() => toast.success(`"${c.title}" — Lesson 1 started`)}>
                  <Play className="mr-1.5 h-3 w-3" />Start course
                </Button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Financial guidance knowledge base"
        description={`${KB.length} verified answers on credit, borrowing, government schemes & fraud protection`}
        action={
          <Button asChild variant="outline" size="sm">
            <Link to="/advisor"><Sparkles className="mr-1.5 h-3.5 w-3.5" />Ask AI</Link>
          </Button>
        }
      >
        <div className="mb-3 flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search topics — MUDRA, CIBIL, PMAY, fraud…" className="pl-9" />
          </div>
        </div>
        <div className="mb-4 flex flex-wrap gap-1.5">
          {CATEGORIES.map(c => (
            <Badge
              key={c}
              variant={cat === c ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setCat(c)}
            >
              {c}
            </Badge>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">No results for "{q}"</div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {filtered.map((item, i) => (
              <AccordionItem key={i} value={`i${i}`}>
                <AccordionTrigger className="text-left">
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[10px]">{item.category}</Badge>
                    </div>
                    <div className="mt-1 font-medium">{item.q}</div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{item.a}</div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </SectionCard>

      <SectionCard title="Editor picks">
        <div className="space-y-2">{ARTICLES.map(a => (
          <div key={a} className="flex items-center gap-3 rounded-xl border p-3 transition hover:bg-muted/40">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary"><GraduationCap className="h-4 w-4" /></div>
            <span className="flex-1 font-medium">{a}</span>
            <Button size="sm" variant="ghost" onClick={() => toast.info(`Opening "${a}"…`)}>Read <ArrowRight className="ml-1 h-3 w-3" /></Button>
          </div>
        ))}</div>
      </SectionCard>
    </PageShell>
  );
}
