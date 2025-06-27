import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// GET all entries for the current user
export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching entries:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Convert to the format expected by the frontend
    const entriesMap = {};
    data.forEach(entry => {
      entriesMap[entry.date] = {
        success: entry.success,
        happy: entry.happy,
        notes: entry.notes,
      };
    });

    return NextResponse.json(entriesMap);
  } catch (error) {
    console.error('Error in GET /api/entries:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST new entry
export async function POST(request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ensure user exists in public.users table
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single();

    if (userError && userError.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error checking user:', userError);
      return NextResponse.json({ error: 'User verification failed' }, { status: 500 });
    }

    // If user doesn't exist in public.users, create them
    if (!existingUser) {
      console.log('Creating user record for:', user.id);
      const { error: createUserError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          name: user.user_metadata?.name || user.email,
          email: user.email,
          image: user.user_metadata?.avatar_url,
        });

      if (createUserError) {
        console.error('Error creating user record:', createUserError);
        return NextResponse.json({ error: 'User creation failed' }, { status: 500 });
      }
    }

    const { date, success, happy, notes } = await request.json();

    console.log('Attempting to save entry for user:', user.id, 'date:', date);

    const { data, error } = await supabase
      .from('entries')
      .upsert({
        user_id: user.id,
        date: date,
        success: success,
        happy: happy,
        notes: notes,
      }, {
        onConflict: 'user_id,date'
      });

    if (error) {
      console.error('Error saving entry:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      return NextResponse.json({ error: 'Database error', details: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: success,
      happy: happy,
      notes: notes,
    });
  } catch (error) {
    console.error('Error in POST /api/entries:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 