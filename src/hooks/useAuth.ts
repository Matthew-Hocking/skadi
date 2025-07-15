import type { User } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
      setLoading(false);
    };

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    getSession();

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signup = async (email: string, password: string) => {
    return supabase.auth.signUp({ email, password });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return { user, login, signup, logout, loading };
}