-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  organization TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile select" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Blood group enum
CREATE TYPE public.blood_group AS ENUM (
  'A+','A-','B+','B-','AB+','AB-','O+','O-','Bombay'
);
CREATE TYPE public.urgency_level AS ENUM ('routine','urgent','critical');
CREATE TYPE public.request_status AS ENUM ('open','matched','fulfilled','cancelled');
CREATE TYPE public.match_status AS ENUM ('pending','accepted','declined','completed');

-- Donors
CREATE TABLE public.donors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  blood_group public.blood_group NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  last_donation_date DATE,
  eligible BOOLEAN NOT NULL DEFAULT true,
  antigen_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read donors" ON public.donors FOR SELECT TO authenticated USING (true);
CREATE POLICY "own donors insert" ON public.donors FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own donors update" ON public.donors FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own donors delete" ON public.donors FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Requests
CREATE TABLE public.blood_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  blood_group public.blood_group NOT NULL,
  units_needed INTEGER NOT NULL DEFAULT 1,
  urgency public.urgency_level NOT NULL DEFAULT 'urgent',
  hospital TEXT NOT NULL,
  city TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  notes TEXT,
  status public.request_status NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.blood_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read requests" ON public.blood_requests FOR SELECT TO authenticated USING (true);
CREATE POLICY "own requests insert" ON public.blood_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own requests update" ON public.blood_requests FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own requests delete" ON public.blood_requests FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Matches
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.blood_requests(id) ON DELETE CASCADE,
  donor_id UUID NOT NULL REFERENCES public.donors(id) ON DELETE CASCADE,
  compatibility_score INTEGER NOT NULL DEFAULT 0,
  distance_km DOUBLE PRECISION,
  urgency_rank INTEGER NOT NULL DEFAULT 0,
  reasoning TEXT,
  status public.match_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (request_id, donor_id)
);
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "match visible to involved" ON public.matches FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.donors d WHERE d.id = donor_id AND d.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.blood_requests r WHERE r.id = request_id AND r.user_id = auth.uid())
);
CREATE POLICY "match update by involved" ON public.matches FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.donors d WHERE d.id = donor_id AND d.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.blood_requests r WHERE r.id = request_id AND r.user_id = auth.uid())
);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.matches;
ALTER PUBLICATION supabase_realtime ADD TABLE public.blood_requests;

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;
CREATE TRIGGER trg_donors_touch BEFORE UPDATE ON public.donors FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_requests_touch BEFORE UPDATE ON public.blood_requests FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_profiles_touch BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();