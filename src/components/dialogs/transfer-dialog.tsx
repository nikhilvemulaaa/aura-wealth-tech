import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { inr } from "@/lib/mock-data";

export function TransferDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const accounts = useStore((s) => s.accounts);
  const transfer = useStore((s) => s.transfer);
  const [from, setFrom] = useState(accounts[0]?.id);
  const [to, setTo] = useState("payee-1");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const amt = parseFloat(amount);
    const fromAcc = accounts.find(a => a.id === from);
    if (!amt || amt <= 0) { toast.error("Enter a valid amount"); return; }
    if (!fromAcc) { toast.error("Select source account"); return; }
    if (amt > fromAcc.balance) { toast.error("Insufficient balance"); return; }
    setLoading(true);
    setTimeout(() => {
      transfer(from!, to, amt, note || "Quick transfer");
      toast.success(`Transferred ${inr(amt)} successfully`);
      setAmount(""); setNote(""); setLoading(false); onOpenChange(false);
    }, 700);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transfer money</DialogTitle>
          <DialogDescription>Move funds between accounts or to a payee.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>From account</Label>
            <Select value={from} onValueChange={setFrom}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {accounts.map(a => (
                  <SelectItem key={a.id} value={a.id}>{a.name} · {a.number} · {inr(a.balance)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>To</Label>
            <Select value={to} onValueChange={setTo}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="payee-1">Priya Sharma · HDFC ····5512</SelectItem>
                <SelectItem value="payee-2">Rahul Mehta · ICICI ····8821</SelectItem>
                <SelectItem value="payee-3">Landlord · Axis ····2200</SelectItem>
                {accounts.filter(a => a.id !== from).map(a => (
                  <SelectItem key={a.id} value={a.id}>{a.name} (self)</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Amount (₹)</Label>
              <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" min="1" required />
            </div>
            <div className="space-y-1.5">
              <Label>Note</Label>
              <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Transferring…" : "Confirm transfer"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
