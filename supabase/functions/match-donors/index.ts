// Edge function: match-donors
// Given a request_id, score all eligible donors, persist matches and return them.
// Uses Lovable AI Gateway to produce reasoning text.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type BG = "A+"|"A-"|"B+"|"B-"|"AB+"|"AB-"|"O+"|"O-"|"Bombay";

const compatMap: Record<BG, BG[]> = {
  "O-":  ["O-","O+","A-","A+","B-","B+","AB-","AB+"],
  "O+":  ["O+","A+","B+","AB+"],
  "A-":  ["A-","A+","AB-","AB+"],
  "A+":  ["A+","AB+"],
  "B-":  ["B-","B+","AB-","AB+"],
  "B+":  ["B+","AB+"],
  "AB-": ["AB-","AB+"],
  "AB+": ["AB+"],
  "Bombay": ["Bombay"],
};
const isCompatible = (d: BG, p: BG) =>
  p === "Bombay" ? d === "Bombay" :
  d === "Bombay" ? p === "Bombay" :
  compatMap[d]?.includes(p) ?? false;

const RARE: BG[] = ["Bombay","AB-","B-","O-"];

function haversineKm(a: any, b: any) {
  if (!a?.latitude || !a?.longitude || !b?.latitude || !b?.longitude) return null;
  const R = 6371;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const la1 = (a.latitude * Math.PI) / 180, la2 = (b.latitude * Math.PI) / 180;
  const x = Math.sin(dLat/2)**2 + Math.sin(dLon/2)**2 * Math.cos(la1) * Math.cos(la2);
  return 2 * R * Math.asin(Math.sqrt(x));
}

function urgencyWeight(u: string) {
  return u === "critical" ? 1.0 : u === "urgent" ? 0.7 : 0.4;
}

function daysSince(d?: string | null) {
  if (!d) return 999;
  const ms = Date.now() - new Date(d).getTime();
  return ms / (1000*60*60*24);
}

function scoreDonor(req: any, donor: any) {
  // Base 50 for compatible match, +20 for exact ABO, +rare bonus
  let score = 0;
  const reasons: string[] = [];
  if (!isCompatible(donor.blood_group, req.blood_group)) return { score: 0, reasons: ["incompatible"], distance: null };
  score += 50; reasons.push(`compatible (${donor.blood_group}→${req.blood_group})`);
  if (donor.blood_group === req.blood_group) { score += 15; reasons.push("exact ABO/Rh match"); }
  if (RARE.includes(req.blood_group as BG)) { score += 10; reasons.push("rare type availability"); }
  if (!donor.eligible) { score -= 40; reasons.push("currently ineligible"); }
  // Recency: donors who donated <90d are typically deferred
  const ds = daysSince(donor.last_donation_date);
  if (ds < 90) { score -= 25; reasons.push(`donated ${Math.round(ds)}d ago`); }
  else if (ds < 9999) { reasons.push(`last donation ${Math.round(ds)}d ago`); }
  // Distance
  const distance = haversineKm(req, donor);
  if (distance != null) {
    const d = distance;
    if (d < 5) { score += 25; reasons.push("<5 km away"); }
    else if (d < 20) { score += 15; reasons.push(`${d.toFixed(1)} km away`); }
    else if (d < 50) { score += 5; reasons.push(`${d.toFixed(1)} km away`); }
    else { reasons.push(`${d.toFixed(0)} km away`); }
  } else if (donor.city?.toLowerCase() === req.city?.toLowerCase()) {
    score += 15; reasons.push("same city");
  }
  // Urgency multiplier
  const w = urgencyWeight(req.urgency);
  score = Math.round(score * (0.6 + 0.4 * w * 1.5));
  return { score: Math.max(0, Math.min(100, score)), reasons, distance };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { request_id } = await req.json();
    if (!request_id) return new Response(JSON.stringify({ error: "request_id required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const supa = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: reqRow, error: rErr } = await supa.from("blood_requests").select("*").eq("id", request_id).single();
    if (rErr || !reqRow) throw new Error(rErr?.message || "request not found");

    const { data: donors, error: dErr } = await supa.from("donors").select("*");
    if (dErr) throw dErr;

    const scored = (donors ?? []).map(d => ({ donor: d, ...scoreDonor(reqRow, d) }))
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 25);

    // Optional AI reasoning summary (best-effort)
    let aiSummary = "";
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (LOVABLE_API_KEY && scored.length) {
      try {
        const top = scored.slice(0, 5).map(s => `${s.donor.full_name} (${s.donor.blood_group}, ${s.donor.city}) score=${s.score} — ${s.reasons.join(", ")}`).join("\n");
        const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Lovable-API-Key": LOVABLE_API_KEY,
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [
              { role: "system", content: "You are a clinical blood-bank coordinator. Be concise (1–2 sentences). No medical advice." },
              { role: "user", content: `Request: ${reqRow.units_needed} unit(s) of ${reqRow.blood_group} for ${reqRow.patient_name} at ${reqRow.hospital}, urgency=${reqRow.urgency}.\nTop candidates:\n${top}\n\nSummarize who to contact first and why.` },
            ],
          }),
        });
        if (resp.ok) {
          const j = await resp.json();
          aiSummary = j.choices?.[0]?.message?.content ?? "";
        }
      } catch (_) { /* ignore */ }
    }

    // Persist matches (upsert)
    const rows = scored.map((s, i) => ({
      request_id,
      donor_id: s.donor.id,
      compatibility_score: s.score,
      distance_km: s.distance,
      urgency_rank: i + 1,
      reasoning: s.reasons.join(" • "),
    }));
    if (rows.length) {
      await supa.from("matches").upsert(rows, { onConflict: "request_id,donor_id" });
    }
    if (scored.length) {
      await supa.from("blood_requests").update({ status: "matched" }).eq("id", request_id);
    }

    return new Response(JSON.stringify({ count: scored.length, aiSummary }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
