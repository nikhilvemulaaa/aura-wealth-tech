import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Bell, Search, Moon, Sun, Plus, ArrowRightLeft, Target, Bot, FileText } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator,
} from "@/components/ui/command";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

const QUICK_PAGES = [
  { label: "Dashboard", url: "/" }, { label: "Profile", url: "/profile" },
  { label: "Accounts", url: "/accounts" }, { label: "Investments", url: "/investments" },
  { label: "Mutual Funds", url: "/mutual-funds" }, { label: "Stocks", url: "/stocks" },
  { label: "Fixed Deposits", url: "/fixed-deposits" }, { label: "Goals", url: "/goals" },
  { label: "Loans", url: "/loans" }, { label: "Insurance", url: "/insurance" },
  { label: "Analytics", url: "/analytics" }, { label: "AI Advisor", url: "/advisor" },
  { label: "AI Chat", url: "/chat" }, { label: "Documents", url: "/documents" },
  { label: "Statements", url: "/statements" }, { label: "Notifications", url: "/notifications" },
  { label: "Settings", url: "/settings" }, { label: "Planner", url: "/planner" },
  { label: "Wealth", url: "/wealth" }, { label: "Admin", url: "/admin" },
  { label: "Learning Hub", url: "/learning" }, { label: "Help", url: "/help" },
];

export function AppHeader() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const profile = useStore((s) => s.profile);
  const notifications = useStore((s) => s.notifications);
  const transactions = useStore((s) => s.transactions);
  const goals = useStore((s) => s.goals);
  const toggleTheme = useStore((s) => s.toggleTheme);
  const theme = useStore((s) => s.theme);
  const markRead = useStore((s) => s.markRead);
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setOpen((o) => !o); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const recentTxns = useMemo(() => transactions.slice(0, 6), [transactions]);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur-md">
      <SidebarTrigger />
      <button
        onClick={() => setOpen(true)}
        className="ml-1 flex h-9 min-w-0 flex-1 items-center gap-2 rounded-lg border bg-muted/40 px-3 text-left text-sm text-muted-foreground transition hover:bg-muted max-w-xl"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="truncate">Search transactions, investments, goals…</span>
        <kbd className="ml-auto hidden rounded border bg-background px-1.5 py-0.5 text-[10px] sm:inline">⌘K</kbd>
      </button>

      <div className="ml-auto flex items-center gap-1">
        <Button size="icon" variant="ghost" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="relative" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              {unread > 0 && (
                <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                  {unread}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              Notifications
              <Link to="/notifications" className="text-xs font-normal text-primary hover:underline">View all</Link>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.slice(0, 5).map((n) => (
              <DropdownMenuItem key={n.id} asChild onClick={() => markRead(n.id)}>
                <Link to={n.link || "/notifications"} className="flex flex-col items-start gap-0.5 py-2">
                  <div className="flex w-full items-center gap-2">
                    <span className={`h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-muted" : "bg-primary"}`} />
                    <span className="truncate text-sm font-medium">{n.title}</span>
                    <span className="ml-auto text-[10px] text-muted-foreground">{n.time}</span>
                  </div>
                  <span className="line-clamp-2 text-xs text-muted-foreground">{n.body}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 gap-2 px-2">
              <Avatar className="h-7 w-7"><AvatarFallback className="bg-primary text-xs text-primary-foreground">{profile.avatar}</AvatarFallback></Avatar>
              <span className="hidden text-sm font-medium md:inline">{profile.name.split(" ")[0]}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="font-semibold">{profile.name}</div>
              <div className="text-xs font-normal text-muted-foreground">{profile.customerId}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link to="/profile">My Profile</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link to="/settings">Settings</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link to="/help">Help & Support</Link></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { toast.success("Signed out (demo)"); }}>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search YONO…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick actions">
            <CommandItem onSelect={() => { setOpen(false); navigate({ to: "/accounts", search: { transfer: "1" } as any }); }}>
              <ArrowRightLeft className="mr-2 h-4 w-4" /> Transfer money
            </CommandItem>
            <CommandItem onSelect={() => { setOpen(false); navigate({ to: "/goals" }); }}>
              <Target className="mr-2 h-4 w-4" /> Create a goal
            </CommandItem>
            <CommandItem onSelect={() => { setOpen(false); navigate({ to: "/advisor" }); }}>
              <Bot className="mr-2 h-4 w-4" /> Ask AI Advisor
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Pages">
            {QUICK_PAGES.map((p) => (
              <CommandItem key={p.url} onSelect={() => { setOpen(false); navigate({ to: p.url }); }}>
                {p.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Recent transactions">
            {recentTxns.map((t) => (
              <CommandItem key={t.id} onSelect={() => { setOpen(false); navigate({ to: "/accounts" }); }}>
                <FileText className="mr-2 h-4 w-4" />
                <span className="truncate">{t.description}</span>
                <span className={`ml-auto text-xs ${t.amount < 0 ? "text-destructive" : "text-success"}`}>
                  {t.amount < 0 ? "−" : "+"}₹{Math.abs(t.amount).toLocaleString("en-IN")}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Goals">
            {goals.map((g) => (
              <CommandItem key={g.id} onSelect={() => { setOpen(false); navigate({ to: "/goals" }); }}>
                <span className="mr-2">{g.icon}</span>{g.title}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </header>
  );
}

export function QuickActionFab() {
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full gradient-primary shadow-2xl shadow-primary/30 transition hover:scale-105"
          aria-label="Quick actions"
        >
          <Plus className="h-6 w-6 text-white" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top" className="w-56">
        <DropdownMenuLabel>Quick actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate({ to: "/accounts" })}><ArrowRightLeft className="mr-2 h-4 w-4" /> Transfer money</DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate({ to: "/mutual-funds" })}><Bot className="mr-2 h-4 w-4" /> Start SIP</DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate({ to: "/fixed-deposits" })}><Target className="mr-2 h-4 w-4" /> Open FD</DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate({ to: "/advisor" })}><Bot className="mr-2 h-4 w-4" /> Ask AI</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Breadcrumbs() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return null;
  return (
    <nav className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
      <Link to="/" className="hover:text-foreground">Home</Link>
      {parts.map((p, i) => (
        <span key={p + i} className="flex items-center gap-1.5">
          <span>/</span>
          <span className="capitalize text-foreground">{p.replace(/-/g, " ")}</span>
        </span>
      ))}
    </nav>
  );
}

