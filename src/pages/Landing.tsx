import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Droplet, Brain, MapPin, Bell, ShieldCheck, Heart } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="border-b bg-background/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-accent-gradient grid place-items-center shadow-glow">
              <Droplet className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg text-gradient">BloodLink AI</span>
          </Link>
          <div className="flex gap-2">
            <Link to="/auth"><Button variant="ghost">Sign in</Button></Link>
            <Link to="/auth"><Button className="bg-accent-gradient shadow-glow">Get started</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero opacity-10" />
        <div className="max-w-6xl mx-auto px-4 py-24 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Heart className="h-3.5 w-3.5" /> AI for Blood Donation & Care Coordination
            </div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              Every drop, <span className="text-gradient">matched in seconds.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Real-time AI matching between donors and patients — compatibility scoring,
              rare blood type prediction, and smart alerts for hospitals & blood banks.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/auth">
                <Button size="lg" className="bg-accent-gradient shadow-glow text-base">
                  Become a Blood Warrior
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="text-base">
                  Hospital / Blood Bank login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How BloodLink AI works</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { i: Brain, t: "Compatibility Scoring", d: "ABO/Rh, antigen notes, urgency, and donor history rolled into a single 0–100 score." },
            { i: Droplet, t: "Rare Type Prediction", d: "Surfaces Bombay, Rh-negative, and other scarce groups before shortages hit." },
            { i: MapPin, t: "Dynamic Prioritization", d: "Trauma vs elective, distance, and cold-chain feasibility shape the ranking." },
            { i: Bell, t: "Smart Alerts", d: "Real-time notifications when a match is found — no manual phone chains." },
          ].map(({ i: Icon, t, d }) => (
            <Card key={t} className="p-6 bg-card-gradient shadow-soft hover:shadow-glow transition-shadow">
              <div className="h-11 w-11 rounded-xl bg-accent-gradient grid place-items-center mb-4 shadow-glow">
                <Icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold mb-1">{t}</h3>
              <p className="text-sm text-muted-foreground">{d}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 pb-24">
        <Card className="p-10 bg-hero text-white text-center shadow-glow">
          <ShieldCheck className="h-10 w-10 mx-auto mb-3 opacity-90" />
          <h2 className="text-3xl font-bold mb-2">Ready to save lives?</h2>
          <p className="opacity-90 mb-6">Register as a donor or post an urgent request in under a minute.</p>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
              Get started free
            </Button>
          </Link>
        </Card>
      </section>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        BloodLink AI • Together, every drop counts.
      </footer>
    </div>
  );
}
