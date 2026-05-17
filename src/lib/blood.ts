// Compatibility constants for ABO/Rh donor → patient direction.
// Bombay can only donate to Bombay; Bombay patients can only receive from Bombay.
export const BLOOD_GROUPS = ["A+","A-","B+","B-","AB+","AB-","O+","O-","Bombay"] as const;
export type BloodGroup = typeof BLOOD_GROUPS[number];

const compatMap: Record<BloodGroup, BloodGroup[]> = {
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

export function isCompatible(donor: BloodGroup, patient: BloodGroup) {
  if (patient === "Bombay") return donor === "Bombay";
  if (donor === "Bombay") return patient === "Bombay";
  return compatMap[donor]?.includes(patient) ?? false;
}

export const RARE_GROUPS: BloodGroup[] = ["Bombay","AB-","B-","O-"];
export const isRare = (g: BloodGroup) => RARE_GROUPS.includes(g);

export function haversineKm(
  a?: { lat?: number | null; lng?: number | null },
  b?: { lat?: number | null; lng?: number | null },
) {
  if (!a?.lat || !a?.lng || !b?.lat || !b?.lng) return null;
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(x));
}
