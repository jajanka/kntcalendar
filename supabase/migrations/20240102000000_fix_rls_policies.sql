-- Fix RLS policies for entries table to handle upsert operations properly

-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert own entries" ON public.entries;
DROP POLICY IF EXISTS "Users can update own entries" ON public.entries;

-- Create improved policies that handle upsert operations
CREATE POLICY "Users can insert own entries" ON public.entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own entries" ON public.entries
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Add a policy for upsert operations specifically
CREATE POLICY "Users can upsert own entries" ON public.entries
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id); 