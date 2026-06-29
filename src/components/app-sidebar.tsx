import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, User, Wallet, TrendingUp, PiggyBank, LineChart, Briefcase,
  Shield, Banknote, Target, CalendarClock, BarChart3, Bot, FileScan, FileText,
  MessageSquare, Bell, Settings, ShieldCheck, GraduationCap, HelpCircle, Sparkles,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";

const SECTIONS: { label: string; items: { title: string; url: string; icon: any }[] }[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: "/", icon: LayoutDashboard },
      { title: "My Profile", url: "/profile", icon: User },
      { title: "Accounts", url: "/accounts", icon: Wallet },
    ],
  },
  {
    label: "Wealth",
    items: [
      { title: "Wealth", url: "/wealth", icon: TrendingUp },
      { title: "Investments", url: "/investments", icon: Briefcase },
      { title: "Mutual Funds", url: "/mutual-funds", icon: LineChart },
      { title: "Stocks", url: "/stocks", icon: BarChart3 },
      { title: "Fixed Deposits", url: "/fixed-deposits", icon: PiggyBank },
      { title: "Insurance", url: "/insurance", icon: Shield },
      { title: "Loans", url: "/loans", icon: Banknote },
    ],
  },
  {
    label: "Planning",
    items: [
      { title: "Goals", url: "/goals", icon: Target },
      { title: "Planner", url: "/planner", icon: CalendarClock },
      { title: "Analytics", url: "/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "AI Suite",
    items: [
      { title: "AI Advisor", url: "/advisor", icon: Bot },
      { title: "AI Documents", url: "/documents", icon: FileScan },
      { title: "AI Chat", url: "/chat", icon: MessageSquare },
    ],
  },
  {
    label: "Account",
    items: [
      { title: "Statements", url: "/statements", icon: FileText },
      { title: "Notifications", url: "/notifications", icon: Bell },
      { title: "Settings", url: "/settings", icon: Settings },
      { title: "Admin", url: "/admin", icon: ShieldCheck },
      { title: "Learning Hub", url: "/learning", icon: GraduationCap },
      { title: "Help Center", url: "/help", icon: HelpCircle },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <Link to="/" className="flex items-center gap-2 px-2 py-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl gradient-primary text-white shadow-md">
            <Sparkles className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="font-display text-base font-bold tracking-tight">YONO AI</div>
              <div className="truncate text-[10px] uppercase tracking-wider text-muted-foreground">Wealth Navigator</div>
            </div>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {SECTIONS.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const active = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                        <Link to={item.url} className="flex items-center gap-2">
                          <item.icon className="h-4 w-4 shrink-0" />
                          <span className="truncate">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
