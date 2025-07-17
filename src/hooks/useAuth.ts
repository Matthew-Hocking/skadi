import type { User, Provider } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user ?? null);
      setLoading(false);
    };

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    getSession();

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signInWithProvider = async (provider: string) => {
    const redirectTo = import.meta.env.PROD 
      ? `https://skadi-job-hunt.vercel.app/auth/callback`
      : `${window.location.origin}/auth/callback`;

    return supabase.auth.signInWithOAuth({
      provider: provider as Provider,
      options: {
        redirectTo
      }
    });
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
    }
    return { error };
  };

  return {
    user,
    signInWithProvider,
    logout,
    loading,
  };
}
