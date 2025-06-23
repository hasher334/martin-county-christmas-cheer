
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { AuthDialog } from "@/components/AuthDialog";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { OptimizedInteractiveTree } from "@/components/OptimizedInteractiveTree";
import { OptimizedLoadingSpinner } from "@/components/OptimizedLoadingSpinner";
import { useChildrenData } from "@/hooks/useChildrenData";

const Index = () => {
  const [user, setUser] = useState(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { children, loading, error, refetch } = useChildrenData();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAdopt = (childId: string) => {
    console.log("Adoption initiated for child:", childId);
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-christmas-cream to-background">
        <Header user={user} onAuthClick={() => setShowAuthDialog(true)} />
        <Hero />
        
        {/* Interactive Christmas Tree Section */}
        <section className="py-16">
          {loading ? (
            <OptimizedLoadingSpinner message="Loading Christmas magic..." />
          ) : error && children.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-red-600 mb-4">Unable to load children profiles</p>
              <button 
                onClick={refetch}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <OptimizedInteractiveTree
              children={children}
              onAdopt={handleAdopt}
              user={user}
            />
          )}
        </section>

        <Footer />

        <AuthDialog 
          open={showAuthDialog} 
          onOpenChange={setShowAuthDialog}
          onSuccess={() => setShowAuthDialog(false)}
        />
      </div>
    </ErrorBoundary>
  );
};

export default Index;
