-- Simplify RLS policies to avoid upsert issues

-- Drop all existing policies for entries table
DROP POLICY IF EXISTS "Users can view own entries" ON public.entries;
DROP POLICY IF EXISTS "Users can insert own entries" ON public.entries;
DROP POLICY IF EXISTS "Users can update own entries" ON public.entries;
DROP POLICY IF EXISTS "Users can delete own entries" ON public.entries;
DROP POLICY IF EXISTS "Users can upsert own entries" ON public.entries;

-- Create a single comprehensive policy for all operations
CREATE POLICY "Users can manage own entries" ON public.entries
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Also ensure users table has proper policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

CREATE POLICY "Users can manage own profile" ON public.users
    FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id); 