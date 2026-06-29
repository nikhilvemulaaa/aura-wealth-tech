import { createFileRoute } from "@tanstack/react-router";
import { PageShell, SectionCard } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useStore } from "@/lib/store";
import { inr } from "@/lib/mock-data";
import { Bot, Send, Sparkles, TrendingUp, Target, Shield, PiggyBank } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";

export const Route = createFileRoute("/advisor")({
  head: () => ({ meta: [{ title: "AI Financial Advisor — YONO AI" }] }),
  component: Advisor,
});

const PROMPTS = [
  { icon: PiggyBank, text: "Can I afford to buy a home worth ₹80 lakh in 5 years?" },
  { icon: TrendingUp, text: "Where should I invest ₹50,000 this month?" },
  { icon: Target, text: "How can I save ₹15 lakh in 3 years?" },
  { icon: Shield, text: "Am I over-spending? What should I cut?" },
];

function Advisor() {
  const profile = useStore(s => s.profile);
  const accounts = useStore(s => s.accounts);
  const investments = useStore(s => s.investments);
  const goals = useStore(s => s.goals);
  const loans = useStore(s => s.loans);

  const context = useMemo(() => {
    const cash = accounts.reduce((a, b) => a + b.balance, 0);
    const inv = investments.reduce((a, b) => a + b.current, 0);
    return [
      `Name: ${profile.name}; Risk profile: ${profile.riskProfile}`,
      `Cash: ${inr(cash)}; Investments: ${inr(inv)}`,
      `Top goals: ${goals.slice(0, 3).map(g => `${g.title} (${inr(g.saved)}/${inr(g.target)})`).join(", ")}`,
      `Loans outstanding: ${inr(loans.reduce((a, b) => a + b.outstanding, 0))}`,
    ].join("\n");
  }, [profile, accounts, investments, goals, loans]);

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat", body: { context } }),
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  function ask(text: string) {
    if (!text.trim()) return;
    sendMessage({ text });
  }

  return (
    <PageShell title="AI Financial Advisor" description="Personalized guidance based on your real financial data.">
      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <SectionCard className="flex flex-col" >
          <div className="mb-3 flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-white"><Bot className="h-5 w-5" /></div>
            <div><div className="font-semibold">YONO AI Advisor</div><div className="text-xs text-success">● Online · Personalized</div></div>
            <Badge variant="outline" className="ml-auto"><Sparkles className="mr-1 h-3 w-3" />RAG-powered</Badge>
          </div>

          <div className="flex min-h-[460px] flex-col gap-3 overflow-y-auto rounded-xl border bg-muted/20 p-4">
            {messages.length === 0 && (
              <div className="my-auto text-center text-sm text-muted-foreground">
                <Bot className="mx-auto mb-2 h-8 w-8 text-primary" />
                Ask me anything about your finances.
              </div>
            )}
            {messages.map(m => (
              <div key={m.id} className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-semibold ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border"}`}>
                  {m.role === "user" ? profile.avatar : "AI"}
                </div>
                <div className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border"}`}>
                  {m.parts.map((p, i) => p.type === "text" ? <span key={i}>{p.text}</span> : null)}
                </div>
              </div>
            ))}
            {(status === "submitted" || status === "streaming") && messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-2">
                <div className="grid h-7 w-7 place-items-center rounded-full border bg-card text-xs font-semibold">AI</div>
                <div className="rounded-2xl border bg-card px-3.5 py-2.5">
                  <span className="inline-flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={(e) => { e.preventDefault(); const v = inputRef.current?.value || ""; if (v) { ask(v); if (inputRef.current) inputRef.current.value = ""; } }}
            className="mt-3 flex gap-2">
            <Input ref={inputRef} placeholder="Ask about your money…" disabled={status === "streaming" || status === "submitted"} />
            <Button type="submit" disabled={status === "streaming" || status === "submitted"}><Send className="h-4 w-4" /></Button>
          </form>
        </SectionCard>

        <div className="space-y-3">
          <SectionCard title="Try asking">
            <div className="space-y-2">
              {PROMPTS.map(p => (
                <button key={p.text} onClick={() => ask(p.text)} className="flex w-full items-start gap-2 rounded-xl border bg-muted/20 p-3 text-left text-sm transition hover:bg-muted/50">
                  <p.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{p.text}</span>
                </button>
              ))}
            </div>
          </SectionCard>
          <SectionCard title="Your snapshot">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Risk profile</span><span className="font-medium">{profile.riskProfile}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Cash</span><span className="font-medium">{inr(accounts.reduce((a, b) => a + b.balance, 0))}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Investments</span><span className="font-medium">{inr(investments.reduce((a, b) => a + b.current, 0))}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Active goals</span><span className="font-medium">{goals.length}</span></div>
            </div>
            <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => setMessages([])}>Clear conversation</Button>
          </SectionCard>
        </div>
      </div>
    </PageShell>
  );
}
