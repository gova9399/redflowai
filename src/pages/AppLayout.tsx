import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Droplet, Users, Activity, LogOut, Bell } from "lucide-react";

export default function AppLayout() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    if (!loading && !user) nav("/auth", { replace: true });
  }, [user, loading, nav]);

  if (loading || !user) return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;

  const tabs = [
    { to: "/app", label: "Dashboard", icon: Activity },
    { to: "/app/donors", label: "Donors", icon: Users },
    { to: "/app/requests", label: "Requests", icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/app" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-accent-gradient grid place-items-center shadow-glow">
              <Droplet className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-gradient">BloodLink AI</span>
          </Link>
          <nav className="hidden md:flex gap-1">
            {tabs.map((t) => {
              const active = loc.pathname === t.to;
              return (
                <Link key={t.to} to={t.to}>
                  <Button variant={active ? "default" : "ghost"} className={active ? "bg-accent-gradient" : ""}>
                    <t.icon className="h-4 w-4 mr-2" /> {t.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
          <Button variant="ghost" size="sm" onClick={async () => { await supabase.auth.signOut(); nav("/"); }}>
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
        <div className="md:hidden border-t flex">
          {tabs.map((t) => {
            const active = loc.pathname === t.to;
            return (
              <Link key={t.to} to={t.to} className={`flex-1 py-2 text-center text-sm ${active ? "text-primary font-medium" : "text-muted-foreground"}`}>
                <t.icon className="h-4 w-4 mx-auto mb-0.5" />{t.label}
              </Link>
            );
          })}
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
