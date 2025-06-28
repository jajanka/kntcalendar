import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (!date) {
    return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 });
  }

  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Fetch all entries for the specific date with user information
    const { data, error } = await supabase
      .from('entries')
      .select(`
        *,
        users (
          id,
          name,
          email,
          image
        )
      `)
      .eq('date', date)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching entries:', error);
      return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 });
    }

    return NextResponse.json({ entries: data || [] });
  } catch (error) {
    console.error('Error in entries by-date API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 