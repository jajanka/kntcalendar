-- Add public read access to entries for community view
-- This allows non-authenticated users to see entries for community features

-- Drop the existing comprehensive policy
DROP POLICY IF EXISTS "Users can manage own entries" ON public.entries;

-- Create separate policies for different operations
-- Read access: Allow public to read entries (for community view)
CREATE POLICY "Public can view entries" ON public.entries
    FOR SELECT USING (true);

-- Write access: Only authenticated users can modify their own entries
CREATE POLICY "Users can insert own entries" ON public.entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own entries" ON public.entries
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own entries" ON public.entries
    FOR DELETE USING (auth.uid() = user_id);

-- Also allow public read access to users table for community features
DROP POLICY IF EXISTS "Users can manage own profile" ON public.users;

CREATE POLICY "Public can view users" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id); 