-- Fix: Restrict storage policies so users can only manage their OWN coaching assets.
-- The previous migration allowed ANY authenticated user to update/delete ANY file.

-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can update coaching assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete coaching assets" ON storage.objects;

-- Re-create with owner-scoped checks.
-- The storage path convention is: {coachingId}/...
-- We join coaching to verify the user owns that coachingId directory.

CREATE POLICY "Owners can update their coaching assets"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'coaching-assets'
    AND auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM public.coaching
      WHERE id::text = split_part(storage.objects.name, '/', 1)
        AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Owners can delete their coaching assets"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'coaching-assets'
    AND auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM public.coaching
      WHERE id::text = split_part(storage.objects.name, '/', 1)
        AND owner_id = auth.uid()
    )
  );

-- Also tighten INSERT to only allow uploads into the user's own coaching directory
DROP POLICY IF EXISTS "Authenticated users can upload coaching assets" ON storage.objects;

CREATE POLICY "Owners can upload to their coaching directory"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'coaching-assets'
    AND auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM public.coaching
      WHERE id::text = split_part(storage.objects.name, '/', 1)
        AND owner_id = auth.uid()
    )
  );
