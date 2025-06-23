
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useAdminAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const checkingAuthRef = useRef(false);
  const mountedRef = useRef(true);

  // Known admin emails for immediate access
  const knownAdminEmails = ['arodseo@gmail.com'];

  useEffect(() => {
    mountedRef.current = true;
    console.log('useAdminAuth: Starting auth check');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mountedRef.current) return;
        
        console.log('useAdminAuth: Auth state changed', { event, hasSession: !!session });
        
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
          setAuthError(null);
          return;
        }
        
        if (session?.user) {
          setUser(session.user);
          
          // Check for known admin emails first
          if (knownAdminEmails.includes(session.user.email)) {
            console.log('useAdminAuth: Known admin email detected');
            if (mountedRef.current) {
              setIsAdmin(true);
              setLoading(false);
              setAuthError(null);
            }
            return;
          }

          // For other emails, check admin status with shorter timeout
          try {
            await Promise.race([
              checkAdminStatus(session.user),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Admin check timeout')), 2000)
              )
            ]);
          } catch (error) {
            console.error('useAdminAuth: Admin check failed:', error);
            if (mountedRef.current) {
              setIsAdmin(false);
              setLoading(false);
              setAuthError('Admin verification failed');
            }
          }
        } else {
          if (mountedRef.current) {
            setUser(null);
            setIsAdmin(false);
            setLoading(false);
            setAuthError(null);
          }
        }
      }
    );

    // Check for existing session with shorter timeout
    const timeoutId = setTimeout(() => {
      if (mountedRef.current && loading) {
        console.log("⚠️ Auth check timeout - proceeding without auth");
        setLoading(false);
      }
    }, 2000); // Reduced from 3000ms

    checkInitialAuth().finally(() => {
      clearTimeout(timeoutId);
    });

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  const checkInitialAuth = async () => {
    if (checkingAuthRef.current) return;
    
    checkingAuthRef.current = true;
    console.log('useAdminAuth: Checking initial auth state');

    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (!mountedRef.current) return;
      
      if (error) {
        console.error('useAdminAuth: Error getting user:', error);
        throw error;
      }

      console.log('useAdminAuth: Initial auth check complete', { hasUser: !!user });
      setUser(user);

      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        setAuthError(null);
        return;
      }

      // Check for known admin emails first
      if (knownAdminEmails.includes(user.email)) {
        console.log('useAdminAuth: Known admin email detected during initial check');
        setIsAdmin(true);
        setLoading(false);
        setAuthError(null);
        return;
      }

      // For other emails, check admin status
      await checkAdminStatus(user);

    } catch (error) {
      console.error('useAdminAuth: Initial auth error:', error);
      if (mountedRef.current) {
        setUser(null);
        setIsAdmin(false);
        setAuthError(error instanceof Error ? error.message : 'Authentication failed');
        setLoading(false);
      }
    } finally {
      checkingAuthRef.current = false;
    }
  };

  const checkAdminStatus = async (user: any) => {
    try {
      console.log('useAdminAuth: Checking admin status for user:', user.email);
      
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (!mountedRef.current) return;

      if (roleError && roleError.code !== 'PGRST116') {
        console.error('useAdminAuth: Error checking admin role:', roleError);
        setIsAdmin(false);
      } else {
        const adminAccess = !!roleData;
        console.log('useAdminAuth: Admin status determined:', { adminAccess });
        setIsAdmin(adminAccess);
      }

    } catch (error) {
      console.error('useAdminAuth: Error in checkAdminStatus:', error);
      if (mountedRef.current) {
        setIsAdmin(false);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
        setAuthError(null);
      }
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAdmin(false);
      setAuthError(null);
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const refetch = () => {
    setLoading(true);
    setAuthError(null);
    checkInitialAuth();
  };

  return {
    user,
    isAdmin,
    loading,
    authError,
    signOut,
    refetch
  };
};
