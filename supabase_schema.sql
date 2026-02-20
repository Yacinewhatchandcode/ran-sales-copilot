-- Supabase Schema for RAN AI Sales Co-Pilot

-- Ensure UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: users (Optional, ties to auth.users if using full Supabase Auth)
-- For MVP, we will rely directly on emails

-- Table: transcripts
CREATE TABLE IF NOT EXISTS public.transcripts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_email TEXT NOT NULL,
    raw_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: analyses
CREATE TABLE IF NOT EXISTS public.analyses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    transcript_id UUID REFERENCES public.transcripts(id) ON DELETE CASCADE,
    deal_probability INTEGER,
    closing_strategy TEXT,
    sdr_target_persona TEXT,
    sdr_sequence JSONB,
    pain_points JSONB,
    objections JSONB,
    authority_positioning JSONB,
    emotional_shifts JSONB,
    financial_tiers JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE public.transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

-- Allow insert & select from service role unconditionally
CREATE POLICY "Service Role Select All Transcripts" ON public.transcripts FOR SELECT USING (true);
CREATE POLICY "Service Role Insert All Transcripts" ON public.transcripts FOR INSERT WITH CHECK (true);

CREATE POLICY "Service Role Select All Analyses" ON public.analyses FOR SELECT USING (true);
CREATE POLICY "Service Role Insert All Analyses" ON public.analyses FOR INSERT WITH CHECK (true);
