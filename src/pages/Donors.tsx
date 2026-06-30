import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Droplet, MapPin } from "lucide-react";
import { BLOOD_GROUPS, isRare } from "@/lib/blood";

type Donor = any;

function DonorForm({ initial, onSaved, onClose }: { initial?: Donor; onSaved: () => void; onClose: () => void }) {
  const { user } = useAuth();
  const [f, setF] = useState({
    full_name: initial?.full_name ?? "",
    blood_group: initial?.blood_group ?? "O+",
    phone: initial?.phone ?? "",
    city: initial?.city ?? "",
    last_donation_date: initial?.last_donation_date ?? "",
    eligible: initial?.eligible ?? true,
    antigen_notes: initial?.antigen_notes ?? "",
  });
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const payload = { ...f, user_id: user!.id, last_donation_date: f.last_donation_date || null };
    const { error } = initial
      ? await supabase.from("donors").update(payload).eq("id", initial.id)
      : await supabase.from("donors").insert(payload);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(initial ? "Donor updated" : "Donor registered");
    onSaved(); onClose();
  }

  return (
    <form onSubmit={save} className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <div><Label>Full name</Label><Input required value={f.full_name} onChange={(e) => setF({ ...f, full_name: e.target.value })} /></div>
        <div>
          <Label>Blood group</Label>
          <Select value={f.blood_group} onValueChange={(v) => setF({ ...f, blood_group: v as any })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{BLOOD_GROUPS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>Phone</Label><Input required value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></div>
        <div><Label>City</Label><Input required value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} /></div>
        <div><Label>Last donation date</Label><Input type="date" value={f.last_donation_date} onChange={(e) => setF({ ...f, last_donation_date: e.target.value })} /></div>
        <div className="flex items-end gap-2"><Checkbox checked={f.eligible} onCheckedChange={(c) => setF({ ...f, eligible: !!c })} id="el" /><Label htmlFor="el">Currently eligible</Label></div>
      </div>
      <div><Label>Antigen / medical notes (optional)</Label><Textarea rows={2} value={f.antigen_notes} onChange={(e) => setF({ ...f, antigen_notes: e.target.value })} /></div>
      <Button disabled={busy} className="bg-accent-gradient w-full">{busy ? "Saving…" : initial ? "Update donor" : "Register donor"}</Button>
    </form>
  );
}

export default function Donors() {
  const { user } = useAuth();
  const [donors, setDonors] = useState<Donor[]>([]);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<Donor | null>(null);
  const [q, setQ] = useState("");
  const [bg, setBg] = useState<string>("all");

  async function load() {
    const { data } = await supabase.from("donors").select("*").order("created_at", { ascending: false });
    setDonors(data ?? []);
  }
  useEffect(() => { load(); }, [user]);

  async function del(id: string) {
    if (!confirm("Delete this donor?")) return;
    const { error } = await supabase.from("donors").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); load();
  }

  const filtered = donors.filter((d) =>
    (bg === "all" || d.blood_group === bg) &&
    (q === "" || [d.full_name, d.city, d.phone].some((x: string) => x?.toLowerCase().includes(q.toLowerCase())))
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Donor registry</h1>
          <p className="text-sm text-muted-foreground">{donors.length} donor(s) • {donors.filter((d) => isRare(d.blood_group)).length} rare-type</p>
        </div>
        <Dialog open={open || !!edit} onOpenChange={(o) => { if (!o) { setOpen(false); setEdit(null); } }}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpen(true)} className="bg-accent-gradient shadow-glow"><Plus className="h-4 w-4 mr-2" />Add donor</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{edit ? "Edit donor" : "Register donor"}</DialogTitle></DialogHeader>
            <DonorForm initial={edit ?? undefined} onSaved={load} onClose={() => { setOpen(false); setEdit(null); }} />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-4 flex flex-wrap gap-3">
        <Input placeholder="Search by name, city, phone…" value={q} onChange={(e) => setQ(e.target.value)} className="flex-1 min-w-[200px]" />
        <Select value={bg} onValueChange={setBg}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All groups</SelectItem>
            {BLOOD_GROUPS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
          </SelectContent>
        </Select>
      </Card>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((d) => {
          const mine = d.user_id === user?.id;
          return (
            <Card key={d.id} className="p-4 bg-card-gradient hover:shadow-glow transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-semibold">{d.full_name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3"/>{d.city}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge className="bg-primary text-primary-foreground"><Droplet className="h-3 w-3 mr-1"/>{d.blood_group}</Badge>
                  {isRare(d.blood_group) && <Badge variant="secondary" className="bg-accent text-accent-foreground">Rare</Badge>}
                </div>
              </div>
              <div className="text-sm">📞 {mine ? d.phone ?? "—" : <span className="text-muted-foreground italic">Hidden for privacy</span>}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {d.last_donation_date ? `Last: ${d.last_donation_date}` : "No donation yet"} • {d.eligible ? "Eligible" : "Deferred"}
              </div>
              {mine && (
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" onClick={async () => {
                    const { data } = await supabase.rpc("get_my_donor_phone", { _donor_id: d.id });
                    setEdit({ ...d, phone: data ?? "" });
                  }}><Pencil className="h-3 w-3 mr-1"/>Edit</Button>
                  <Button size="sm" variant="ghost" onClick={() => del(d.id)} className="text-destructive"><Trash2 className="h-3 w-3 mr-1"/>Delete</Button>
                </div>
              )}
            </Card>
          );
        })}
        {filtered.length === 0 && <p className="text-sm text-muted-foreground col-span-full text-center py-8">No donors match.</p>}
      </div>
    </div>
  );
}
