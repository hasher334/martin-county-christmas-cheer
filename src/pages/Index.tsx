
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { InteractiveChristmasTree } from "@/components/InteractiveChristmasTree";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { AuthDialog } from "@/components/AuthDialog";
import { ChristmasColorUtility } from "@/components/ChristmasColorUtility";
import { Stats } from "@/components/Stats";
import { NavigationBanner } from "@/components/NavigationBanner";
import { MobileLoadingSpinner } from "@/components/MobileLoadingSpinner";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Gift, Users, Heart } from "lucide-react";
import { useChildrenData } from "@/hooks/useChildrenData";

const Index = () => {
  const [user, setUser] = useState(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [pageReady, setPageReady] = useState(false);
  
  // Use the optimized useChildrenData hook
  const { children, loading: childrenLoading, error, refetch, isUsingFallback } = useChildrenData();

  useEffect(() => {
    console.log("🚀 Index page initializing...");
    
    const initializePage = async () => {
      try {
        // Shorter auth timeout for faster page load
        const authTimeout = setTimeout(() => {
          console.log("⚠️ Auth check timeout - proceeding without auth");
          setUser(null);
          setPageReady(true);
        }, 1500); // Reduced from 3000ms

        // Quick auth check without blocking page load
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        clearTimeout(authTimeout);
        
        if (authError) {
          console.error("❌ Auth error:", authError);
        } else {
          console.log("✅ Auth check complete:", user?.email || "No user");
          setUser(user);
        }
        
        setPageReady(true);
        
      } catch (error) {
        console.error("❌ Page initialization error:", error);
        setPageReady(true); // Still show page even if auth fails
      }
    };

    // Overall page timeout as fallback - reduced for faster loading
    const pageTimeout = setTimeout(() => {
      console.log("⚠️ Page initialization timeout - forcing page load");
      setPageReady(true);
    }, 2000); // Reduced from 5000ms

    initializePage();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("🔄 Auth state changed:", event, session?.user?.email || "No user");
      setUser(session?.user ?? null);
    });

    return () => {
      clearTimeout(pageTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const handleAdopt = (childId: string) => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
  };

  // Show loading spinner only briefly for initial page load
  if (!pageReady) {
    return <MobileLoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-christmas-cream to-background font-nunito mobile-optimized">
      <ChristmasColorUtility />
      
      <Header user={user} onAuthClick={() => setShowAuthDialog(true)} />
      
      {/* Hero Section */}
      <div className="animate-fade-in">
        <Hero />
      </div>

      {/* Main Interactive Christmas Tree Section */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-christmas-cream via-background to-christmas-green-50 mobile-optimized" data-section="wishlists">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-christmas-green-800 mb-4 md:mb-6 font-christmas">
            Our Christmas Tree of Hope
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-christmas-brown-700 mb-8 md:mb-12 max-w-3xl mx-auto font-nunito">
            Each ornament represents a child waiting for Christmas magic. Click on any ornament to meet them and help make their holiday dreams come true!
          </p>
          
          {/* Simplified error handling */}
          {error && !isUsingFallback && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">Unable to load children data. Please try again.</p>
              <button 
                onClick={refetch}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Simplified fallback notice */}
          {isUsingFallback && (
            <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-700">Showing sample data.</p>
              <button 
                onClick={refetch}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          )}
          
          <div className="animate-fade-in">
            {childrenLoading ? (
              <LoadingSpinner message="Loading children profiles..." />
            ) : (
              <InteractiveChristmasTree 
                children={children} 
                onAdopt={handleAdopt}
                user={user}
              />
            )}
          </div>

          {/* Navigation Banners */}
          <div className="mt-12 md:mt-16 mb-12 md:mb-16 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-6xl mx-auto px-4">
              <NavigationBanner
                title="Browse Wishlists"
                description="Discover children's Christmas wishes and choose the perfect child to sponsor"
                icon={Gift}
                href="/wishlists"
                variant="primary"
              />
              
              <NavigationBanner
                title="Register Child"
                description="Help a child in need by registering them for our Christmas program"
                icon={Users}
                href="/register"
                variant="secondary"
              />
              
              <NavigationBanner
                title="About Our Mission"
                description="Learn how Candy Cane Kindness spreads Christmas joy throughout our community"
                icon={Heart}
                href="/about"
                variant="tertiary"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <div className="animate-fade-in">
        <Stats />
      </div>

      <div className="animate-fade-in">
        <Footer />
      </div>

      <AuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog}
        onSuccess={() => setShowAuthDialog(false)}
      />
    </div>
  );
};

export default Index;
