import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Bell, ChevronRight } from "lucide-react";
import { BLOOD_GROUPS } from "@/lib/blood";

function RequestForm({ onSaved, onClose }: { onSaved: () => void; onClose: () => void }) {
  const { user } = useAuth();
  const [f, setF] = useState({
    patient_name: "", blood_group: "O+", units_needed: 1, urgency: "urgent",
    hospital: "", city: "", notes: "",
  });
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { data, error } = await supabase.from("blood_requests")
      .insert({ ...f, user_id: user!.id })
      .select("id").single();
    if (error) { setBusy(false); return toast.error(error.message); }
    // Trigger AI matching
    toast.promise(
      supabase.functions.invoke("match-donors", { body: { request_id: data!.id } }),
      { loading: "Running AI matching…", success: "Matches ready!", error: "Matching failed" }
    );
    setBusy(false); onSaved(); onClose();
  }

  return (
    <form onSubmit={save} className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <div><Label>Patient name</Label><Input required value={f.patient_name} onChange={(e) => setF({ ...f, patient_name: e.target.value })} /></div>
        <div>
          <Label>Blood group needed</Label>
          <Select value={f.blood_group} onValueChange={(v) => setF({ ...f, blood_group: v })}>
            <SelectTrigger><SelectValue/></SelectTrigger>
            <SelectContent>{BLOOD_GROUPS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>Units needed</Label><Input type="number" min={1} value={f.units_needed} onChange={(e) => setF({ ...f, units_needed: parseInt(e.target.value || "1") })} /></div>
        <div>
          <Label>Urgency</Label>
          <Select value={f.urgency} onValueChange={(v) => setF({ ...f, urgency: v })}>
            <SelectTrigger><SelectValue/></SelectTrigger>
            <SelectContent>
              <SelectItem value="routine">Routine</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="critical">Critical (trauma)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div><Label>Hospital</Label><Input required value={f.hospital} onChange={(e) => setF({ ...f, hospital: e.target.value })} /></div>
        <div><Label>City</Label><Input required value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} /></div>
      </div>
      <div><Label>Notes (optional)</Label><Textarea rows={2} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></div>
      <Button disabled={busy} className="w-full bg-accent-gradient shadow-glow">{busy ? "Saving…" : "Post & run AI matching"}</Button>
    </form>
  );
}

export default function Requests() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  async function load() {
    const { data } = await supabase.from("blood_requests").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
  }
  useEffect(() => { load(); }, [user]);

  useEffect(() => {
    const ch = supabase.channel("requests-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "blood_requests" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Blood requests</h1>
          <p className="text-sm text-muted-foreground">{items.length} request(s) tracked</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent-gradient shadow-glow"><Plus className="h-4 w-4 mr-2"/>New request</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create blood request</DialogTitle></DialogHeader>
            <RequestForm onSaved={load} onClose={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {items.map(r => (
          <Link key={r.id} to={`/app/requests/${r.id}`}>
            <Card className="p-4 hover:shadow-glow transition-shadow bg-card-gradient h-full">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-semibold">{r.patient_name}</div>
                  <div className="text-xs text-muted-foreground">{r.hospital} • {r.city}</div>
                </div>
                <Badge className="bg-primary text-primary-foreground">{r.blood_group}</Badge>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={r.urgency === "critical" ? "destructive" : "secondary"}>{r.urgency}</Badge>
                <Badge variant="outline">{r.units_needed} unit(s)</Badge>
                <Badge variant="outline">{r.status}</Badge>
              </div>
              <div className="flex items-center text-sm text-primary mt-3"><Bell className="h-3 w-3 mr-1"/> View AI matches <ChevronRight className="h-3 w-3"/></div>
            </Card>
          </Link>
        ))}
        {items.length === 0 && <p className="text-sm text-muted-foreground col-span-full text-center py-8">No requests yet.</p>}
      </div>
    </div>
  );
}
