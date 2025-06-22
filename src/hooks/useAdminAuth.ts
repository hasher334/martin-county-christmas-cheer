
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useAdminAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Ref to track if we're already checking auth to prevent duplicates
  const checkingAuthRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  // Known admin emails for fallback
  const knownAdminEmails = ['arodseo@gmail.com'];

  useEffect(() => {
    console.log('useAdminAuth: Starting authentication check');
    
    // Set up timeout protection - if auth takes too long, show fallback for known admins
    timeoutRef.current = setTimeout(() => {
      console.log('useAdminAuth: Auth timeout reached, checking for fallback');
      const currentUser = user;
      if (!currentUser && loading) {
        console.log('useAdminAuth: No user found after timeout, still loading');
        setLoading(false);
        setAuthError('Authentication timeout');
      } else if (currentUser && knownAdminEmails.includes(currentUser.email) && loading) {
        console.log('useAdminAuth: Known admin user timeout fallback activated');
        setIsAdmin(true);
        setLoading(false);
        setAuthError(null);
      }
    }, 10000); // 10 second timeout

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('useAdminAuth: Auth state changed', { event, hasSession: !!session, email: session?.user?.email });
        
        if (event === 'SIGNED_OUT') {
          console.log('useAdminAuth: User signed out');
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
          setAuthError(null);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          return;
        }
        
        if (session?.user) {
          console.log('useAdminAuth: Session found, setting user');
          setUser(session.user);
          
          // Check admin status asynchronously
          setTimeout(() => {
            checkAdminStatus(session.user);
          }, 0);
        } else {
          console.log('useAdminAuth: No session found');
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
          setAuthError(null);
        }
      }
    );

    // Then check for existing session
    checkAuth();

    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const checkAuth = async () => {
    if (checkingAuthRef.current) {
      console.log('useAdminAuth: Auth check already in progress, skipping');
      return;
    }

    checkingAuthRef.current = true;
    console.log('useAdminAuth: Starting auth check');

    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('useAdminAuth: Error getting user:', error);
        throw error;
      }

      console.log('useAdminAuth: Got user from auth:', { hasUser: !!user, email: user?.email });
      setUser(user);

      if (!user) {
        console.log('useAdminAuth: No user found');
        setIsAdmin(false);
        setLoading(false);
        setAuthError(null);
        return;
      }

      // Check admin status
      await checkAdminStatus(user);

    } catch (error) {
      console.error('useAdminAuth: Auth error:', error);
      setUser(null);
      setIsAdmin(false);
      setAuthError(error instanceof Error ? error.message : 'Authentication failed');
      
      // Retry logic
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        console.log(`useAdminAuth: Retrying auth check (${retryCountRef.current}/${maxRetries})`);
        setTimeout(() => {
          checkingAuthRef.current = false;
          checkAuth();
        }, 2000 * retryCountRef.current); // Exponential backoff
        return;
      }
      
      setLoading(false);
    } finally {
      checkingAuthRef.current = false;
    }
  };

  const checkAdminStatus = async (user: any) => {
    try {
      console.log('useAdminAuth: Checking admin status for user:', user.email);
      
      // Fallback for known admin email
      if (knownAdminEmails.includes(user.email)) {
        console.log('useAdminAuth: Known admin email detected, granting admin access');
        setIsAdmin(true);
        setLoading(false);
        setAuthError(null);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        return;
      }

      // Check user_roles table with timeout
      const adminCheckPromise = supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Admin check timeout')), 5000)
      );

      const { data: roleData, error: roleError } = await Promise.race([
        adminCheckPromise,
        timeoutPromise
      ]) as any;

      if (roleError && roleError.code !== 'PGRST116') {
        console.error('useAdminAuth: Error checking admin role:', roleError);
        // Don't fail completely, use fallback
        const adminAccess = knownAdminEmails.includes(user.email);
        setIsAdmin(adminAccess);
      } else {
        const adminAccess = !!roleData || knownAdminEmails.includes(user.email);
        console.log('useAdminAuth: Admin status determined:', { adminAccess, hasRoleData: !!roleData });
        setIsAdmin(adminAccess);
      }

    } catch (error) {
      console.error('useAdminAuth: Error in checkAdminStatus:', error);
      // Fallback for known admin emails
      const adminAccess = knownAdminEmails.includes(user.email);
      console.log('useAdminAuth: Using fallback admin check:', { adminAccess });
      setIsAdmin(adminAccess);
    } finally {
      setLoading(false);
      setAuthError(null);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
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
    retryCountRef.current = 0;
    setLoading(true);
    setAuthError(null);
    checkAuth();
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
