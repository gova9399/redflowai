import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles, Phone, MapPin, Droplet } from "lucide-react";
import { toast } from "sonner";

export default function RequestDetail() {
  const { id } = useParams();
  const [req, setReq] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [donorsMap, setDonorsMap] = useState<Record<string, any>>({});
  const [running, setRunning] = useState(false);

  async function load() {
    const { data: r } = await supabase.from("blood_requests").select("*").eq("id", id).single();
    setReq(r);
    const { data: m } = await supabase.from("matches").select("*").eq("request_id", id).order("compatibility_score", { ascending: false });
    setMatches(m ?? []);
    if (m?.length) {
      const ids = m.map((x) => x.donor_id);
      const { data: ds } = await supabase.from("donors").select("*").in("id", ids);
      const map: Record<string, any> = {};
      (ds ?? []).forEach((d) => { map[d.id] = d; });
      setDonorsMap(map);
    }
  }
  useEffect(() => { load(); }, [id]);

  useEffect(() => {
    const ch = supabase.channel(`matches-${id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "matches", filter: `request_id=eq.${id}` }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [id]);

  async function rerun() {
    setRunning(true);
    const { error } = await supabase.functions.invoke("match-donors", { body: { request_id: id } });
    setRunning(false);
    if (error) return toast.error(error.message);
    toast.success("Matches refreshed");
    load();
  }

  async function setStatus(mid: string, status: string) {
    const { error } = await supabase.from("matches").update({ status }).eq("id", mid);
    if (error) return toast.error(error.message);
    load();
  }

  if (!req) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-5">
      <Link to="/app/requests"><Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1"/>Back</Button></Link>

      <Card className="p-6 bg-card-gradient">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{req.patient_name}</h1>
            <p className="text-muted-foreground">{req.hospital} • {req.city}</p>
            <div className="flex gap-2 mt-3">
              <Badge className="bg-primary text-primary-foreground"><Droplet className="h-3 w-3 mr-1"/>{req.blood_group}</Badge>
              <Badge variant={req.urgency === "critical" ? "destructive" : "secondary"}>{req.urgency}</Badge>
              <Badge variant="outline">{req.units_needed} unit(s)</Badge>
              <Badge variant="outline">{req.status}</Badge>
            </div>
            {req.notes && <p className="text-sm mt-3 text-muted-foreground">📝 {req.notes}</p>}
          </div>
          <Button onClick={rerun} disabled={running} className="bg-accent-gradient shadow-glow">
            <Sparkles className="h-4 w-4 mr-2"/>{running ? "Matching…" : "Re-run AI matching"}
          </Button>
        </div>
      </Card>

      <div>
        <h2 className="text-lg font-semibold mb-3">AI-ranked matches ({matches.length})</h2>
        {matches.length === 0 ? (
          <Card className="p-6 text-center text-muted-foreground">
            No matches yet. Click "Re-run AI matching" to score available donors.
          </Card>
        ) : (
          <div className="space-y-2">
            {matches.map((m) => {
              const d = donorsMap[m.donor_id];
              if (!d) return null;
              return (
                <Card key={m.id} className="p-4 flex flex-wrap items-center gap-4 bg-card-gradient">
                  <div className="grid place-items-center h-14 w-14 rounded-xl bg-accent-gradient text-white shadow-glow">
                    <div className="text-xl font-bold leading-none">{m.compatibility_score}</div>
                    <div className="text-[10px] opacity-80">score</div>
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{d.full_name}</span>
                      <Badge className="bg-primary text-primary-foreground">{d.blood_group}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground flex flex-wrap gap-x-3 gap-y-1 mt-1">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3"/>{d.city}{m.distance_km != null && ` • ${m.distance_km.toFixed(1)} km`}</span>
                      <span className="flex items-center gap-1"><Phone className="h-3 w-3"/>{d.phone}</span>
                    </div>
                    <p className="text-xs mt-1 text-muted-foreground">{m.reasoning}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge variant={m.status === "accepted" ? "default" : m.status === "declined" ? "destructive" : "outline"}>{m.status}</Badge>
                    {m.status === "pending" && (
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => setStatus(m.id, "accepted")}>Accept</Button>
                        <Button size="sm" variant="ghost" onClick={() => setStatus(m.id, "declined")}>Decline</Button>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
