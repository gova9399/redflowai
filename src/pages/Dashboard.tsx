import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Bell, Activity, Droplet, ChevronRight } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ donors: 0, openRequests: 0, matches: 0 });
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const [{ count: dc }, { count: rc }, { count: mc }] = await Promise.all([
        supabase.from("donors").select("id", { count: "exact", head: true }),
        supabase.from("blood_requests").select("id", { count: "exact", head: true }).eq("status", "open"),
        supabase.from("matches").select("id", { count: "exact", head: true }),
      ]);
      setStats({ donors: dc ?? 0, openRequests: rc ?? 0, matches: mc ?? 0 });
      const { data } = await supabase
        .from("blood_requests")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      setRecent(data ?? []);
    })();
  }, [user]);

  const cards = [
    { label: "Active Donors", value: stats.donors, icon: Users, color: "text-primary" },
    { label: "Open Requests", value: stats.openRequests, icon: Bell, color: "text-accent" },
    { label: "AI Matches Made", value: stats.matches, icon: Activity, color: "text-secondary" },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-hero text-white p-8 shadow-glow">
        <h1 className="text-3xl font-bold mb-1">Welcome back 👋</h1>
        <p className="opacity-90">Coordinate donors, requests, and AI-powered matches in real time.</p>
        <div className="flex flex-wrap gap-2 mt-4">
          <Link to="/app/donors"><Button variant="secondary" className="bg-white text-primary hover:bg-white/90">Register a donor</Button></Link>
          <Link to="/app/requests"><Button variant="outline" className="border-white/40 text-white hover:bg-white/10">Post a request</Button></Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Card key={c.label} className="p-5 bg-card-gradient shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">{c.label}</div>
                <div className="text-3xl font-bold mt-1">{c.value}</div>
              </div>
              <div className="h-12 w-12 rounded-xl bg-accent-gradient grid place-items-center shadow-glow">
                <c.icon className="h-5 w-5 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold flex items-center gap-2"><Droplet className="h-4 w-4 text-primary"/> Recent requests</h2>
          <Link to="/app/requests"><Button variant="ghost" size="sm">View all <ChevronRight className="h-4 w-4"/></Button></Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">No requests yet. Post one to see AI matches.</p>
        ) : (
          <div className="space-y-2">
            {recent.map((r) => (
              <Link key={r.id} to={`/app/requests/${r.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition">
                <div className="flex items-center gap-3">
                  <Badge className="bg-primary text-primary-foreground">{r.blood_group}</Badge>
                  <div>
                    <div className="font-medium">{r.patient_name} • {r.hospital}</div>
                    <div className="text-xs text-muted-foreground">{r.city} • {r.units_needed} unit(s)</div>
                  </div>
                </div>
                <Badge variant={r.urgency === "critical" ? "destructive" : "secondary"}>{r.urgency}</Badge>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
