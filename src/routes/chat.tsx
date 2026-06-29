import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, SectionCard } from "@/components/page-shell";
import { Bot, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "AI Chat — YONO AI" }] }),
  component: Chat,
});

function Chat() {
  return (
    <PageShell title="AI Chat" description="Quick AI conversations about your money.">
      <SectionCard>
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-2xl gradient-primary text-white"><MessageSquare className="h-8 w-8" /></div>
          <h2 className="font-display text-xl font-bold">Continue in AI Advisor</h2>
          <p className="max-w-sm text-sm text-muted-foreground">For full context-aware conversations with portfolio access, use the AI Financial Advisor.</p>
          <Button asChild><Link to="/advisor"><Bot className="mr-1.5 h-4 w-4" />Open Advisor</Link></Button>
        </div>
      </SectionCard>
    </PageShell>
  );
}
