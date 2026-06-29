import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, SectionCard } from "@/components/page-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Bot, MessageSquare, Phone, Mail, Search } from "lucide-react";

const FAQS = [
  { q: "How do I transfer money?", a: "Use the Transfer button on the dashboard or Accounts page. Choose source, payee, enter the amount and confirm with OTP." },
  { q: "How is my AI advisor different from generic chatbots?", a: "It has secure access to your real portfolio, spending and goals to give specific, personalized answers — never generic advice." },
  { q: "Are my investments insured?", a: "Bank deposits are insured up to ₹5 lakh by DICGC. Mutual funds and stocks are market-linked." },
  { q: "How do I open a fixed deposit?", a: "Go to Fixed Deposits → Open new FD. Pick bank, tenure, amount and confirm." },
  { q: "Can I export my data?", a: "Yes — every list page has an Export CSV button. Statements can be downloaded as PDF." },
  { q: "How is my data secured?", a: "AES-256 encryption at rest, TLS 1.3 in transit, biometric login, and 2-factor authentication." },
];

export const Route = createFileRoute("/help")({
  head: () => ({ meta: [{ title: "Help Center — YONO AI" }] }),
  component: Help,
});

function Help() {
  return (
    <PageShell title="Help Center" description="We're here 24/7. Get answers or talk to a human.">
      <SectionCard>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search help articles…" className="h-12 pl-10 text-base" />
        </div>
      </SectionCard>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: Bot, title: "Ask AI", desc: "Get instant answers", to: "/advisor" },
          { icon: MessageSquare, title: "Live chat", desc: "Avg reply in 2 min", to: "/chat" },
          { icon: Phone, title: "Call us", desc: "1800-1234-5678", to: "/help" },
        ].map(c => (
          <Link key={c.title} to={c.to} className="rounded-2xl border p-5 transition hover:shadow-md">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><c.icon className="h-5 w-5" /></div>
            <div className="mt-3 font-display font-semibold">{c.title}</div>
            <div className="text-sm text-muted-foreground">{c.desc}</div>
          </Link>
        ))}
      </div>

      <SectionCard title="Frequently asked questions">
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`i${i}`}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </SectionCard>

      <SectionCard title="Contact">
        <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-primary" /><span className="text-sm">support@yono.ai</span></div>
        <div className="mt-2 flex items-center gap-3"><Phone className="h-4 w-4 text-primary" /><span className="text-sm">1800-1234-5678 · 24×7</span></div>
      </SectionCard>
    </PageShell>
  );
}
