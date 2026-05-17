import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Droplet, Heart } from "lucide-react";

export default function Auth() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) nav("/app", { replace: true });
    });
  }, [nav]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: `${window.location.origin}/app`,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        toast.success("Account created! Check your email to confirm.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        nav("/app", { replace: true });
      }
    } catch (e: any) {
      toast.error(e.message ?? "Auth failed");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/app` });
    if (r.error) toast.error(r.error.message ?? "Google sign-in failed");
  }

  return (
    <div className="min-h-screen bg-hero flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-glow">
        <Link to="/" className="flex items-center gap-2 justify-center mb-6">
          <div className="h-10 w-10 rounded-xl bg-accent-gradient grid place-items-center shadow-glow">
            <Droplet className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-gradient">BloodLink AI</span>
        </Link>

        <h1 className="text-2xl font-bold text-center mb-1">
          {mode === "signin" ? "Welcome back" : "Join the mission"}
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          {mode === "signin" ? "Sign in to coordinate matches" : "Help save lives with AI matching"}
        </p>

        <form onSubmit={submit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <Label>Full name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          )}
          <div>
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          <Button type="submit" disabled={busy} className="w-full bg-accent-gradient hover:opacity-90 shadow-glow">
            {busy ? "..." : mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </form>

        <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex-1 h-px bg-border" /> or <div className="flex-1 h-px bg-border" />
        </div>
        <Button type="button" variant="outline" onClick={google} className="w-full">
          <Heart className="h-4 w-4 mr-2 text-primary" /> Continue with Google
        </Button>

        <p className="text-sm text-center mt-6 text-muted-foreground">
          {mode === "signin" ? "New here?" : "Have an account?"}{" "}
          <button className="text-primary font-medium hover:underline" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>
            {mode === "signin" ? "Create account" : "Sign in"}
          </button>
        </p>
      </Card>
    </div>
  );
}
