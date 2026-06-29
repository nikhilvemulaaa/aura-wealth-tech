import { createFileRoute } from "@tanstack/react-router";
import { PageShell, SectionCard } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, Play, Clock, BookOpen } from "lucide-react";

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
  return (
    <PageShell title="Learning Hub" description="Build financial confidence with bite-sized lessons.">
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
                <Button size="sm" className="mt-3 w-full"><Play className="mr-1.5 h-3 w-3" />Start course</Button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Editor picks">
        <div className="space-y-2">{ARTICLES.map(a => (
          <div key={a} className="flex items-center gap-3 rounded-xl border p-3 transition hover:bg-muted/40">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary"><GraduationCap className="h-4 w-4" /></div>
            <span className="flex-1 font-medium">{a}</span>
            <Button size="sm" variant="ghost">Read</Button>
          </div>
        ))}</div>
      </SectionCard>
    </PageShell>
  );
}
