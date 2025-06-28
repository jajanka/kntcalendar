import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { walletAddress } = await request.json();

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }

    // Update user's wallet address
    const { error } = await supabase
      .from('users')
      .update({ wallet_address: walletAddress })
      .eq('id', user.id);

    if (error) {
      console.error('Error updating wallet address:', error);
      return NextResponse.json({ error: 'Failed to update wallet address' }, { status: 500 });
    }

    return NextResponse.json({ success: true, walletAddress });
  } catch (error) {
    console.error('Error in wallet API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's wallet address
    const { data, error } = await supabase
      .from('users')
      .select('wallet_address')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching wallet address:', error);
      return NextResponse.json({ error: 'Failed to fetch wallet address' }, { status: 500 });
    }

    return NextResponse.json({ walletAddress: data?.wallet_address || null });
  } catch (error) {
    console.error('Error in wallet API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 