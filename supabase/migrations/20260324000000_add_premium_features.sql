-- Add new columns to coaching table
ALTER TABLE public.coaching 
ADD COLUMN IF NOT EXISTS calendly_url TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS youtube_url TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS page_views INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'light',
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb;

-- Create inquiries table
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coaching_id UUID NOT NULL REFERENCES public.coaching(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS for inquiries
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Coaching owners can view inquiries" ON public.inquiries FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.coaching WHERE id = coaching_id AND owner_id = auth.uid())
);
CREATE POLICY "Coaching owners can update inquiries" ON public.inquiries FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.coaching WHERE id = coaching_id AND owner_id = auth.uid())
);
CREATE POLICY "Coaching owners can delete inquiries" ON public.inquiries FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.coaching WHERE id = coaching_id AND owner_id = auth.uid())
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coaching_id UUID NOT NULL REFERENCES public.coaching(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
  content TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS for testimonials
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Coaching owners can insert testimonials" ON public.testimonials FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.coaching WHERE id = coaching_id AND owner_id = auth.uid())
);
CREATE POLICY "Coaching owners can update testimonials" ON public.testimonials FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.coaching WHERE id = coaching_id AND owner_id = auth.uid())
);
CREATE POLICY "Coaching owners can delete testimonials" ON public.testimonials FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.coaching WHERE id = coaching_id AND owner_id = auth.uid())
);

-- Optional: RPC function to increment page views securely
CREATE OR REPLACE FUNCTION increment_page_view(coaching_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.coaching
  SET page_views = page_views + 1
  WHERE id = coaching_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
