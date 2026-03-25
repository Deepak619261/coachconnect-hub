-- Add ai_settings column to coaching table for dynamic model selection and AI tagline generation
ALTER TABLE public.coaching 
ADD COLUMN IF NOT EXISTS ai_settings JSONB DEFAULT '{"provider": "openai", "model": "gpt-4o-mini", "apiKey": ""}'::jsonb;
