
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create coaching table
CREATE TABLE public.coaching (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  logo_url TEXT DEFAULT '',
  banner_url TEXT DEFAULT '',
  address TEXT DEFAULT '',
  google_map_link TEXT DEFAULT '',
  contact_number TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.coaching ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view coaching" ON public.coaching FOR SELECT USING (true);
CREATE POLICY "Owners can insert coaching" ON public.coaching FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can update coaching" ON public.coaching FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owners can delete coaching" ON public.coaching FOR DELETE USING (auth.uid() = owner_id);

-- Create notes table
CREATE TABLE public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coaching_id UUID NOT NULL REFERENCES public.coaching(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subject TEXT DEFAULT '',
  file_url TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view notes" ON public.notes FOR SELECT USING (true);
CREATE POLICY "Coaching owners can insert notes" ON public.notes FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.coaching WHERE id = coaching_id AND owner_id = auth.uid()));
CREATE POLICY "Coaching owners can update notes" ON public.notes FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.coaching WHERE id = coaching_id AND owner_id = auth.uid()));
CREATE POLICY "Coaching owners can delete notes" ON public.notes FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.coaching WHERE id = coaching_id AND owner_id = auth.uid()));

-- Create notices table
CREATE TABLE public.notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coaching_id UUID NOT NULL REFERENCES public.coaching(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view notices" ON public.notices FOR SELECT USING (true);
CREATE POLICY "Coaching owners can insert notices" ON public.notices FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.coaching WHERE id = coaching_id AND owner_id = auth.uid()));
CREATE POLICY "Coaching owners can update notices" ON public.notices FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.coaching WHERE id = coaching_id AND owner_id = auth.uid()));
CREATE POLICY "Coaching owners can delete notices" ON public.notices FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.coaching WHERE id = coaching_id AND owner_id = auth.uid()));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_coaching_updated_at
  BEFORE UPDATE ON public.coaching
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('coaching-assets', 'coaching-assets', true);

CREATE POLICY "Anyone can view coaching assets" ON storage.objects FOR SELECT USING (bucket_id = 'coaching-assets');
CREATE POLICY "Authenticated users can upload coaching assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'coaching-assets' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update coaching assets" ON storage.objects FOR UPDATE USING (bucket_id = 'coaching-assets' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete coaching assets" ON storage.objects FOR DELETE USING (bucket_id = 'coaching-assets' AND auth.role() = 'authenticated');

-- Indexes
CREATE INDEX idx_coaching_slug ON public.coaching(slug);
CREATE INDEX idx_notes_coaching_id ON public.notes(coaching_id);
CREATE INDEX idx_notices_coaching_id ON public.notices(coaching_id);
