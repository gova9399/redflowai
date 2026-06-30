
-- Replace broad SELECT policy with owner-only
DROP POLICY IF EXISTS "auth read donors" ON public.donors;

CREATE POLICY "own donors select"
  ON public.donors FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Public directory view excluding phone, readable by all authenticated users.
-- Uses security_invoker=off (definer) so it bypasses base-table RLS.
CREATE OR REPLACE VIEW public.donors_directory
WITH (security_invoker=off) AS
SELECT
  id, user_id, full_name, blood_group, city,
  last_donation_date, eligible, antigen_notes,
  latitude, longitude, created_at, updated_at
FROM public.donors;

GRANT SELECT ON public.donors_directory TO authenticated;
