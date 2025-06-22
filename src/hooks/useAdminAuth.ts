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

  // Known admin emails for fallback
  const knownAdminEmails = ['areodseo@gmail.com'];

  useEffect(() => {
    mountedRef.current = true;
    console.log('useAdminAuth: Component mounted, starting auth check');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mountedRef.current) return;
        
        console.log('useAdminAuth: Auth state changed', { event, hasSession: !!session, email: session?.user?.email });
        
        if (event === 'SIGNED_OUT') {
          console.log('useAdminAuth: User signed out');
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
          setAuthError(null);
          return;
        }
        
        if (session?.user) {
          console.log('useAdminAuth: Session found, checking admin status');
          setUser(session.user);
          
          // Check admin status with timeout
          const adminCheckPromise = checkAdminStatus(session.user);
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Admin check timeout')), 5000)
          );

          try {
            await Promise.race([adminCheckPromise, timeoutPromise]);
          } catch (error) {
            console.error('useAdminAuth: Admin check failed:', error);
            // Use fallback for known admin emails
            const adminAccess = knownAdminEmails.includes(session.user.email);
            if (mountedRef.current) {
              setIsAdmin(adminAccess);
              setLoading(false);
              if (!adminAccess) {
                setAuthError('Admin verification failed');
              }
            }
          }
        } else {
          console.log('useAdminAuth: No session found');
          if (mountedRef.current) {
            setUser(null);
            setIsAdmin(false);
            setLoading(false);
            setAuthError(null);
          }
        }
      }
    );

    // Check for existing session
    checkInitialAuth();

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
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

      console.log('useAdminAuth: Initial auth check complete', { hasUser: !!user, email: user?.email });
      setUser(user);

      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        setAuthError(null);
        return;
      }

      // Check admin status for existing user
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
      
      // Quick fallback check for known admin emails
      if (knownAdminEmails.includes(user.email)) {
        console.log('useAdminAuth: Known admin email detected, granting access');
        if (mountedRef.current) {
          setIsAdmin(true);
          setLoading(false);
          setAuthError(null);
        }
        return;
      }

      // Try to check user_roles table
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (!mountedRef.current) return;

      if (roleError && roleError.code !== 'PGRST116') {
        console.error('useAdminAuth: Error checking admin role:', roleError);
        // Fall back to known admin emails on database error
        const adminAccess = knownAdminEmails.includes(user.email);
        setIsAdmin(adminAccess);
      } else {
        const adminAccess = !!roleData || knownAdminEmails.includes(user.email);
        console.log('useAdminAuth: Admin status determined:', { adminAccess, hasRoleData: !!roleData });
        setIsAdmin(adminAccess);
      }

    } catch (error) {
      console.error('useAdminAuth: Error in checkAdminStatus:', error);
      if (mountedRef.current) {
        // Fallback for known admin emails
        const adminAccess = knownAdminEmails.includes(user.email);
        console.log('useAdminAuth: Using fallback admin check:', { adminAccess });
        setIsAdmin(adminAccess);
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
