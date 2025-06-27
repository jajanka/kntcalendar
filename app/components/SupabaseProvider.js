'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const SupabaseContext = createContext({});

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};

export function SupabaseProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabaseClient = createClientComponentClient();

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabaseClient.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        }
        setUser(session?.user ?? null);
        setLoading(false);
      } catch (error) {
        console.error('Error in getSession:', error);
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabaseClient.auth]);

  const signIn = async (provider, credentials = {}) => {
    try {
      if (provider === 'email') {
        const { email, password, isSignUp } = credentials;
        
        if (isSignUp) {
          const { data, error } = await supabaseClient.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/api/auth/supabase`,
            },
          });
          if (error) {
            console.error('Sign up error:', error);
          } else {
            console.log('Sign up successful:', data);
          }
          return { data, error };
        } else {
          const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password,
          });
          if (error) {
            console.error('Sign in error:', error);
          } else {
            console.log('Sign in successful:', data);
          }
          return { data, error };
        }
      } else {
        // OAuth sign in
        const { data, error } = await supabaseClient.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: `${window.location.origin}/api/auth/supabase`,
          },
        });
        if (error) {
          console.error('OAuth sign in error:', error);
        }
        return { data, error };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabaseClient.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      }
      return { error };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error };
    }
  };

  const getUserEntries = async () => {
    if (!user) {
      console.log('No user found, returning empty entries');
      return {};
    }
    
    try {
      console.log('Fetching entries for user:', user.id);
      const { data, error } = await supabaseClient
        .from('entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching entries:', error);
        return {};
      }

      console.log('Fetched entries:', data);

      // Convert to the format expected by the frontend
      const entriesMap = {};
      data.forEach(entry => {
        entriesMap[entry.date] = {
          success: entry.success,
          happy: entry.happy,
          notes: entry.notes,
        };
      });

      return entriesMap;
    } catch (error) {
      console.error('Error in getUserEntries:', error);
      return {};
    }
  };

  const saveEntry = async (date, entry) => {
    if (!user) {
      console.error('No user found for saveEntry');
      throw new Error('User not authenticated');
    }
    
    try {
      console.log('Saving entry for user:', user.id, 'date:', date, 'entry:', entry);
      
      // Ensure user exists in public.users table
      const { data: existingUser, error: userError } = await supabaseClient
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

      if (userError && userError.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error checking user:', userError);
        throw new Error('User verification failed');
      }

      // If user doesn't exist in public.users, create them
      if (!existingUser) {
        console.log('Creating user record for:', user.id);
        const { error: createUserError } = await supabaseClient
          .from('users')
          .insert({
            id: user.id,
            name: user.user_metadata?.name || user.email,
            email: user.email,
            image: user.user_metadata?.avatar_url,
          });

        if (createUserError) {
          console.error('Error creating user record:', createUserError);
          throw new Error('User creation failed');
        }
      }

      const { data, error } = await supabaseClient
        .from('entries')
        .upsert({
          user_id: user.id,
          date: date,
          success: entry.success,
          happy: entry.happy,
          notes: entry.notes,
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
        throw error;
      }

      console.log('Entry saved successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in saveEntry:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
    getUserEntries,
    saveEntry,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
} 