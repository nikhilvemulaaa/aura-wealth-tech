// Comprehensive mock data for YONO AI Wealth Navigator
export type Account = {
  id: string;
  type: "Savings" | "Current" | "Salary" | "NRE";
  name: string;
  number: string;
  balance: number;
  ifsc: string;
  branch: string;
};

export type Txn = {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number; // negative = debit
  account: string;
  merchant?: string;
  channel: "UPI" | "Card" | "NEFT" | "IMPS" | "ATM" | "Auto";
};

export type Investment = {
  id: string;
  type: "Mutual Fund" | "Stock" | "FD" | "Bond" | "Gold";
  name: string;
  invested: number;
  current: number;
  units?: number;
  nav?: number;
  category?: string;
  risk: "Low" | "Medium" | "High";
  return1y: number;
  return3y: number;
};

export type FD = {
  id: string;
  bank: string;
  principal: number;
  rate: number;
  tenureMonths: number;
  startDate: string;
  maturityDate: string;
  maturityAmount: number;
};

export type Goal = {
  id: string;
  title: string;
  icon: string;
  target: number;
  saved: number;
  deadline: string;
  monthlyContribution: number;
  category: "House" | "Car" | "Education" | "Retirement" | "Vacation" | "Wedding" | "Emergency" | "Business";
};

export type Loan = {
  id: string;
  type: "Home" | "Personal" | "Car" | "Education";
  principal: number;
  outstanding: number;
  emi: number;
  rate: number;
  tenureMonths: number;
  nextDue: string;
};

export type Insurance = {
  id: string;
  type: "Life" | "Health" | "Vehicle" | "Term";
  provider: string;
  policyNo: string;
  cover: number;
  premium: number;
  renewal: string;
};

export type Notification = {
  id: string;
  type: "alert" | "info" | "success" | "warning";
  title: string;
  body: string;
  time: string;
  read: boolean;
  link?: string;
};

const CATEGORIES = ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Health", "Education", "Travel", "Investment", "Salary", "Rent", "Groceries"];
const MERCHANTS = ["Swiggy", "Zomato", "Amazon", "Flipkart", "Uber", "BookMyShow", "Apollo Pharmacy", "BigBasket", "DMart", "IRCTC", "MakeMyTrip", "Netflix", "Spotify", "Jio", "Airtel", "Electricity Board"];

function seed(n: number) { let s = n; return () => (s = (s * 9301 + 49297) % 233280) / 233280; }
const rng = seed(42);

function pick<T>(arr: T[]): T { return arr[Math.floor(rng() * arr.length)]; }
function rand(min: number, max: number) { return Math.floor(rng() * (max - min) + min); }

export const PROFILE = {
  id: "USR-001",
  name: "Arjun Sharma",
  email: "arjun.sharma@yono.ai",
  phone: "+91 98765 43210",
  pan: "ABCDE1234F",
  aadhaar: "XXXX-XXXX-7890",
  dob: "1990-06-15",
  address: "MG Road, Bengaluru, 560001",
  customerId: "YNO-7821554",
  kycStatus: "Verified",
  riskProfile: "Moderate" as "Conservative" | "Moderate" | "Aggressive",
  avatar: "AS",
};

export const ACCOUNTS: Account[] = [
  { id: "A1", type: "Savings", name: "Primary Savings", number: "•••• 4521", balance: 487650, ifsc: "SBIN0001234", branch: "Bengaluru MG Road" },
  { id: "A2", type: "Salary", name: "Salary Account", number: "•••• 8832", balance: 142300, ifsc: "SBIN0001234", branch: "Bengaluru MG Road" },
  { id: "A3", type: "Current", name: "Business Current", number: "•••• 2244", balance: 1820000, ifsc: "SBIN0005678", branch: "Bengaluru Whitefield" },
];

export function generateTxns(count = 80): Txn[] {
  const out: Txn[] = [];
  const now = Date.now();
  for (let i = 0; i < count; i++) {
    const isCredit = rng() < 0.18;
    const cat = isCredit ? (rng() < 0.7 ? "Salary" : "Investment") : pick(CATEGORIES.filter(c => c !== "Salary"));
    const merchant = isCredit ? (cat === "Salary" ? "Acme Corp Payroll" : "Dividend Credit") : pick(MERCHANTS);
    out.push({
      id: `T${1000 + i}`,
      date: new Date(now - i * 86400000 * (rng() * 1.5 + 0.3)).toISOString(),
      description: isCredit ? `Credit from ${merchant}` : `${merchant} payment`,
      category: cat,
      amount: isCredit ? rand(15000, 95000) : -rand(80, 8500),
      account: pick(ACCOUNTS).id,
      merchant,
      channel: pick(["UPI", "Card", "NEFT", "IMPS", "ATM", "Auto"] as const),
    });
  }
  return out.sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export const TRANSACTIONS = generateTxns(120);

export const INVESTMENTS: Investment[] = [
  { id: "I1", type: "Mutual Fund", name: "Axis Bluechip Fund - Direct Growth", invested: 240000, current: 312400, units: 1842.5, nav: 169.5, category: "Large Cap", risk: "Medium", return1y: 18.4, return3y: 14.2 },
  { id: "I2", type: "Mutual Fund", name: "Parag Parikh Flexi Cap Fund", invested: 180000, current: 248900, units: 4120.8, nav: 60.4, category: "Flexi Cap", risk: "Medium", return1y: 24.1, return3y: 19.8 },
  { id: "I3", type: "Mutual Fund", name: "ICICI Pru Liquid Fund", invested: 100000, current: 107200, units: 332.1, nav: 322.7, category: "Liquid", risk: "Low", return1y: 7.2, return3y: 6.5 },
  { id: "I4", type: "Stock", name: "Reliance Industries", invested: 145000, current: 178600, units: 75, nav: 2381.3, risk: "Medium", return1y: 22.7, return3y: 18.5 },
  { id: "I5", type: "Stock", name: "HDFC Bank", invested: 92000, current: 105400, units: 65, nav: 1621.5, risk: "Low", return1y: 14.6, return3y: 12.1 },
  { id: "I6", type: "Stock", name: "Tata Consultancy Services", invested: 78000, current: 96200, units: 25, nav: 3848, risk: "Low", return1y: 23.3, return3y: 16.9 },
  { id: "I7", type: "Gold", name: "Sovereign Gold Bond 2024", invested: 60000, current: 71800, risk: "Low", return1y: 19.6, return3y: 13.4 },
  { id: "I8", type: "Bond", name: "RBI Floating Rate Bond", invested: 50000, current: 53200, risk: "Low", return1y: 7.8, return3y: 7.1 },
];

export const FDS: FD[] = [
  { id: "F1", bank: "SBI", principal: 200000, rate: 7.1, tenureMonths: 24, startDate: "2024-03-10", maturityDate: "2026-03-10", maturityAmount: 230245 },
  { id: "F2", bank: "HDFC", principal: 150000, rate: 7.3, tenureMonths: 36, startDate: "2023-08-15", maturityDate: "2026-08-15", maturityAmount: 186420 },
  { id: "F3", bank: "ICICI", principal: 100000, rate: 7.0, tenureMonths: 12, startDate: "2025-01-20", maturityDate: "2026-01-20", maturityAmount: 107000 },
];

export const GOALS: Goal[] = [
  { id: "G1", title: "Buy a Home", icon: "🏡", target: 5000000, saved: 1850000, deadline: "2029-06-30", monthlyContribution: 45000, category: "House" },
  { id: "G2", title: "Child Education", icon: "🎓", target: 2500000, saved: 620000, deadline: "2032-04-30", monthlyContribution: 18000, category: "Education" },
  { id: "G3", title: "Retirement Corpus", icon: "🌴", target: 30000000, saved: 4200000, deadline: "2045-12-31", monthlyContribution: 35000, category: "Retirement" },
  { id: "G4", title: "Japan Vacation", icon: "🗼", target: 450000, saved: 285000, deadline: "2026-04-15", monthlyContribution: 25000, category: "Vacation" },
  { id: "G5", title: "Emergency Fund", icon: "🛟", target: 600000, saved: 540000, deadline: "2026-12-31", monthlyContribution: 10000, category: "Emergency" },
];

export const LOANS: Loan[] = [
  { id: "L1", type: "Home", principal: 4500000, outstanding: 3820000, emi: 38450, rate: 8.65, tenureMonths: 240, nextDue: "2026-07-05" },
  { id: "L2", type: "Car", principal: 800000, outstanding: 410000, emi: 17200, rate: 9.25, tenureMonths: 60, nextDue: "2026-07-10" },
];

export const INSURANCE: Insurance[] = [
  { id: "P1", type: "Term", provider: "HDFC Life Click 2 Protect", policyNo: "HLT-882341", cover: 10000000, premium: 14200, renewal: "2027-02-15" },
  { id: "P2", type: "Health", provider: "Star Health Family Floater", policyNo: "STR-554120", cover: 1000000, premium: 28400, renewal: "2026-09-22" },
  { id: "P3", type: "Vehicle", provider: "ICICI Lombard Motor", policyNo: "ICL-110045", cover: 850000, premium: 12800, renewal: "2026-08-30" },
];

export const NOTIFICATIONS: Notification[] = [
  { id: "N1", type: "warning", title: "SIP Due in 3 days", body: "Your ₹15,000 SIP in Axis Bluechip will debit on 1st Jul.", time: "2h ago", read: false, link: "/mutual-funds" },
  { id: "N2", type: "alert", title: "High spending alert", body: "Shopping this month is 38% above usual.", time: "5h ago", read: false, link: "/analytics" },
  { id: "N3", type: "info", title: "FD maturing soon", body: "ICICI FD of ₹1,07,000 matures on 20 Jan 2026.", time: "1d ago", read: false, link: "/fixed-deposits" },
  { id: "N4", type: "success", title: "Goal milestone reached", body: "Japan Vacation is now 63% funded! Keep going.", time: "2d ago", read: true, link: "/goals" },
  { id: "N5", type: "info", title: "Tax-saving reminder", body: "₹42,000 left under 80C. Invest before 31 Mar.", time: "3d ago", read: true, link: "/advisor" },
  { id: "N6", type: "alert", title: "Unusual login", body: "New device sign-in from Mumbai detected.", time: "4d ago", read: true, link: "/settings" },
];

export const SPEND_CATEGORIES = [
  { name: "Food", value: 18400, color: "var(--chart-1)" },
  { name: "Shopping", value: 24600, color: "var(--chart-2)" },
  { name: "Bills", value: 12800, color: "var(--chart-3)" },
  { name: "Transport", value: 8900, color: "var(--chart-4)" },
  { name: "Entertainment", value: 6200, color: "var(--chart-5)" },
  { name: "Health", value: 4100, color: "var(--chart-1)" },
];

export const MONTHLY_TREND = [
  { month: "Jan", income: 185000, expense: 92000, savings: 93000 },
  { month: "Feb", income: 185000, expense: 88500, savings: 96500 },
  { month: "Mar", income: 192000, expense: 105000, savings: 87000 },
  { month: "Apr", income: 185000, expense: 79000, savings: 106000 },
  { month: "May", income: 185000, expense: 96400, savings: 88600 },
  { month: "Jun", income: 198000, expense: 102800, savings: 95200 },
];

export const NET_WORTH_TREND = [
  { month: "Jan", value: 4200000 },
  { month: "Feb", value: 4380000 },
  { month: "Mar", value: 4520000 },
  { month: "Apr", value: 4710000 },
  { month: "May", value: 4920000 },
  { month: "Jun", value: 5180000 },
];

export const MARKET_INDICES = [
  { name: "NIFTY 50", value: 24812.45, change: 1.24 },
  { name: "SENSEX", value: 81245.30, change: 0.98 },
  { name: "BANK NIFTY", value: 52410.20, change: -0.32 },
  { name: "Gold (10g)", value: 73250, change: 0.45 },
];

export function inr(n: number) {
  if (Math.abs(n) >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (Math.abs(n) >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export function inrFull(n: number) {
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}
