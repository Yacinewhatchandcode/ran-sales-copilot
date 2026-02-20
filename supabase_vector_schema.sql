-- Supabase Vector Memory Schema for RAN AI Sales Co-Pilot
-- Part of Q2 "The Auto-Execution Layer"

-- 1. Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create the Memory Collection
CREATE TABLE IF NOT EXISTS public.deal_memory (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    transcript_id UUID REFERENCES public.transcripts(id) ON DELETE CASCADE,
    content TEXT NOT NULL,          -- What happened (e.g. objection+reversal context)
    embedding VECTOR(1536),         -- OpenAI / OpenRouter typical embedding size
    metadata JSONB DEFAULT '{}'::jsonb, -- e.g., deal_probability, won/lost
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Index for Fast Similarity Search
-- Using HNSW (Hierarchical Navigable Small World) for scalable vector search
CREATE INDEX IF NOT EXISTS deal_memory_embedding_idx ON public.deal_memory USING hnsw (embedding vector_ip_ops);

-- 4. Enable RLS
ALTER TABLE public.deal_memory ENABLE ROW LEVEL SECURITY;

-- 5. Add Policies
CREATE POLICY "Service Role Access Deal Memory" ON public.deal_memory FOR ALL USING (true);

-- 6. Create RPC Vector Search Function for Langchain
CREATE OR REPLACE FUNCTION match_deal_memory(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  transcript_id uuid,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    deal_memory.id,
    deal_memory.transcript_id,
    deal_memory.content,
    deal_memory.metadata,
    1 - (deal_memory.embedding <=> query_embedding) AS similarity
  FROM deal_memory
  WHERE 1 - (deal_memory.embedding <=> query_embedding) > match_threshold
  ORDER BY deal_memory.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
