import { create } from "./store-impl";
import {
  ACCOUNTS, TRANSACTIONS, INVESTMENTS, FDS, GOALS, LOANS, INSURANCE,
  NOTIFICATIONS, PROFILE,
  type Account, type Txn, type Investment, type FD, type Goal, type Loan,
  type Insurance, type Notification,
} from "./mock-data";

type State = {
  profile: typeof PROFILE;
  accounts: Account[];
  transactions: Txn[];
  investments: Investment[];
  fds: FD[];
  goals: Goal[];
  loans: Loan[];
  insurance: Insurance[];
  notifications: Notification[];
  theme: "light" | "dark";
};

type Actions = {
  transfer: (from: string, to: string, amount: number, note: string) => void;
  addGoal: (g: Omit<Goal, "id">) => void;
  updateGoal: (id: string, patch: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  addFD: (f: Omit<FD, "id">) => void;
  invest: (id: string, amount: number) => void;
  redeem: (id: string, amount: number) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  updateProfile: (p: Partial<typeof PROFILE>) => void;
  toggleTheme: () => void;
  resetData: () => void;
};

const initial: State = {
  profile: PROFILE,
  accounts: ACCOUNTS,
  transactions: TRANSACTIONS,
  investments: INVESTMENTS,
  fds: FDS,
  goals: GOALS,
  loans: LOANS,
  insurance: INSURANCE,
  notifications: NOTIFICATIONS,
  theme: "light",
};

const STORAGE_KEY = "yono-state-v1";

function load(): State {
  if (typeof window === "undefined") return initial;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initial;
    return { ...initial, ...JSON.parse(raw) };
  } catch { return initial; }
}

export const useStore = create<State & Actions>((set, get) => ({
  ...load(),
  transfer: (from, to, amount, note) => set((s) => {
    const accounts = s.accounts.map(a => {
      if (a.id === from) return { ...a, balance: a.balance - amount };
      if (a.id === to) return { ...a, balance: a.balance + amount };
      return a;
    });
    const txn: Txn = {
      id: `T${Date.now()}`,
      date: new Date().toISOString(),
      description: note || `Transfer to ${to}`,
      category: "Transfer",
      amount: -amount,
      account: from,
      channel: "IMPS",
    };
    return { accounts, transactions: [txn, ...s.transactions] };
  }),
  addGoal: (g) => set((s) => ({ goals: [...s.goals, { ...g, id: `G${Date.now()}` }] })),
  updateGoal: (id, patch) => set((s) => ({ goals: s.goals.map(g => g.id === id ? { ...g, ...patch } : g) })),
  deleteGoal: (id) => set((s) => ({ goals: s.goals.filter(g => g.id !== id) })),
  addFD: (f) => set((s) => ({ fds: [...s.fds, { ...f, id: `F${Date.now()}` }] })),
  invest: (id, amount) => set((s) => ({
    investments: s.investments.map(i => i.id === id ? { ...i, invested: i.invested + amount, current: i.current + amount } : i),
  })),
  redeem: (id, amount) => set((s) => ({
    investments: s.investments.map(i => i.id === id ? { ...i, current: Math.max(0, i.current - amount) } : i),
  })),
  markRead: (id) => set((s) => ({ notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n) })),
  markAllRead: () => set((s) => ({ notifications: s.notifications.map(n => ({ ...n, read: true })) })),
  updateProfile: (p) => set((s) => ({ profile: { ...s.profile, ...p } })),
  toggleTheme: () => set((s) => {
    const t = s.theme === "light" ? "dark" : "light";
    if (typeof document !== "undefined") document.documentElement.classList.toggle("dark", t === "dark");
    return { theme: t };
  }),
  resetData: () => {
    if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
    set(() => initial);
  },
}));

// persistence
if (typeof window !== "undefined") {
  useStore.subscribe((s) => {
    const { profile, accounts, transactions, investments, fds, goals, loans, insurance, notifications, theme } = s;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ profile, accounts, transactions, investments, fds, goals, loans, insurance, notifications, theme }));
  });
  // apply theme on load
  if (load().theme === "dark") document.documentElement.classList.add("dark");
}
