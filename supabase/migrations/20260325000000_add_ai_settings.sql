-- Add ai_settings column to coaching table
ALTER TABLE public.coaching 
ADD COLUMN IF NOT EXISTS ai_settings JSONB DEFAULT '{"provider": "openai", "model": "gpt-4o-mini", "apiKey": ""}'::jsonb,
ADD COLUMN IF NOT EXISTS seo_settings JSONB DEFAULT '{"metaTitle": "", "metaDescription": "", "keywords": ""}'::jsonb,
ADD COLUMN IF NOT EXISTS inquiry_config JSONB DEFAULT '{"questions": ["Tell us about your background", "Which class/grade are you in?"]}'::jsonb;
