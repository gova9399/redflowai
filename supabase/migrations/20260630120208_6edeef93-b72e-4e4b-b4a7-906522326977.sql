
-- Roll back definer view
DROP VIEW IF EXISTS public.donors_directory;
DROP POLICY IF EXISTS "own donors select" ON public.donors;

-- Restore broad row read, but use column-level grants to hide `phone`
CREATE POLICY "auth read donors"
  ON public.donors FOR SELECT
  TO authenticated
  USING (true);

-- Revoke blanket SELECT and grant only non-sensitive columns to authenticated
REVOKE SELECT ON public.donors FROM authenticated;
GRANT SELECT (
  id, user_id, full_name, blood_group, city,
  last_donation_date, eligible, antigen_notes,
  latitude, longitude, created_at, updated_at
) ON public.donors TO authenticated;

-- Security-definer function lets a donor read their OWN phone
CREATE OR REPLACE FUNCTION public.get_my_donor_phone(_donor_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT phone FROM public.donors
  WHERE id = _donor_id AND user_id = auth.uid()
$$;

GRANT EXECUTE ON FUNCTION public.get_my_donor_phone(uuid) TO authenticated;
