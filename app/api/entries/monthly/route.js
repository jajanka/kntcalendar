import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get('year');
  const month = searchParams.get('month');

  if (!year || !month) {
    return NextResponse.json({ error: 'Year and month parameters are required' }, { status: 400 });
  }

  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Create date range for the month
    const startDate = `${year}-${month.padStart(2, '0')}-01`;
    const endDate = `${year}-${month.padStart(2, '0')}-31`;

    // Fetch all entries for the month with user information
    const { data, error } = await supabase
      .from('entries')
      .select(`
        date,
        users (
          id,
          name,
          email
        )
      `)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching monthly entries:', error);
      return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 });
    }

    // Group entries by date and count unique users
    const entriesByDate = {};
    data.forEach(entry => {
      if (!entriesByDate[entry.date]) {
        entriesByDate[entry.date] = {
          count: 0,
          users: []
        };
      }
      
      // Only count unique users per day
      const existingUser = entriesByDate[entry.date].users.find(u => u.id === entry.users.id);
      if (!existingUser) {
        entriesByDate[entry.date].count++;
        entriesByDate[entry.date].users.push(entry.users);
      }
    });

    return NextResponse.json({ entries: entriesByDate });
  } catch (error) {
    console.error('Error in monthly entries API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 