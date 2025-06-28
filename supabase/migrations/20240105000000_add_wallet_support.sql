-- Add wallet address support for Web3 integration

-- Add wallet_address column to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS wallet_address TEXT;

-- Add index for wallet address lookups
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON public.users(wallet_address);

-- Add function to update wallet address
CREATE OR REPLACE FUNCTION public.update_user_wallet_address(
  user_id UUID,
  wallet_address TEXT
) RETURNS void AS $$
BEGIN
  UPDATE public.users 
  SET wallet_address = wallet_address,
      updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add RLS policy for wallet address updates
CREATE POLICY "Users can update own wallet address" ON public.users
    FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Add function to get user by wallet address
CREATE OR REPLACE FUNCTION public.get_user_by_wallet_address(
  wallet_addr TEXT
) RETURNS TABLE (
  id UUID,
  name TEXT,
  email TEXT,
  image TEXT,
  wallet_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.name, u.email, u.image, u.wallet_address, u.created_at, u.updated_at
  FROM public.users u
  WHERE u.wallet_address = wallet_addr;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 