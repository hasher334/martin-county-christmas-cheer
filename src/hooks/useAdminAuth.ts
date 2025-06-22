
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useAdminAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        console.log("Starting auth check...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          throw error;
        }

        if (!mounted) return; // Prevent state updates if component unmounted

        if (!session?.user) {
          console.log("No session found");
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        const currentUser = session.user;
        console.log("User session found:", currentUser.email);
        setUser(currentUser);

        // Simple email-based admin check
        const adminEmails = ['arodseo@gmail.com'];
        const hasAdminAccess = adminEmails.includes(currentUser.email || '');
        console.log("Admin access granted:", hasAdminAccess);
        setIsAdmin(hasAdminAccess);

      } catch (error) {
        console.error('Auth error:', error);
        if (mounted) {
          setUser(null);
          setIsAdmin(false);
        }
      } finally {
        if (mounted) {
          console.log("Setting loading to false");
          setLoading(false);
        }
      }
    };

    // Initial auth check
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        
        if (!mounted) return;

        if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
        } else if (session?.user) {
          setUser(session.user);
          const adminEmails = ['arodseo@gmail.com'];
          const hasAdminAccess = adminEmails.includes(session.user.email || '');
          setIsAdmin(hasAdminAccess);
          setLoading(false);
        } else {
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setIsAdmin(false);
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
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    isAdmin,
    loading,
    signOut,
    refetch: () => {
      setLoading(true);
      // This will trigger the auth state check
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user);
          const adminEmails = ['arodseo@gmail.com'];
          const hasAdminAccess = adminEmails.includes(session.user.email || '');
          setIsAdmin(hasAdminAccess);
        } else {
          setUser(null);
          setIsAdmin(false);
        }
        setLoading(false);
      });
    }
  };
};
