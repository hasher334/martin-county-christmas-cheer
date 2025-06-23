
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthDialog } from "@/components/AuthDialog";
import { ChildCard } from "@/components/ChildCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Snowflake, RefreshCw } from "lucide-react";
import { useChildrenData } from "@/hooks/useChildrenData";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Wishlists = () => {
  const [user, setUser] = useState(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { children, loading, error, refetch, retryCount, isUsingFallback } = useChildrenData();

  // Optimized snowflakes with fewer count
  const snowflakePositions = useMemo(() => {
    const positions = [];
    const isMobile = window.innerWidth < 768;
    const targetCount = isMobile ? 25 : 50; // Significantly reduced

    // Simplified positioning for better performance
    for (let i = 0; i < targetCount; i++) {
      positions.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        animationDelay: Math.random() * 2,
        animationDuration: 2 + Math.random() * 2,
      });
    }

    return positions;
  }, []);

  useEffect(() => {
    // Simplified auth check
    const checkAuth = async () => {
      console.log("🔐 Checking authentication status...");
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error("🔐 Auth check failed:", error);
      }
    };
    
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("🔐 Auth state changed:", { event, user: !!session?.user });
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAdopt = (childId: string) => {
    console.log("🎁 Adoption initiated for child:", childId);
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
  };

  const handleRetry = async () => {
    console.log("🔄 User triggered manual retry");
    await refetch();
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-christmas-cream to-background mobile-optimized no-horizontal-scroll">
        <Header user={user} onAuthClick={() => setShowAuthDialog(true)} />
        
        {/* Simplified Fallback Data Alert */}
        {isUsingFallback && (
          <Alert className="mx-4 mb-4 border-blue-500 bg-blue-50">
            <AlertDescription className="flex items-center justify-between">
              <span>Showing sample data while restoring connection...</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRetry}
                disabled={loading}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Optimized Hero Section */}
        <section className="relative py-20 bg-gradient-to-b from-[#c51212] via-[#a20a0a] to-[#4d0000] text-white overflow-hidden mobile-optimized">
          {/* Simplified Candy Cane Stripe Pattern */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent 0px,
                transparent 10px,
                rgba(255, 255, 255, 0.8) 10px,
                rgba(255, 255, 255, 0.8) 20px,
                transparent 20px,
                transparent 30px,
                #dc2626 30px,
                #dc2626 40px
              )`
            }}
          ></div>

          {/* Optimized Floating Christmas Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {snowflakePositions.map((position, i) => (
              <div
                key={i}
                className="absolute animate-pulse"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  animationDelay: `${position.animationDelay}s`,
                  animationDuration: `${position.animationDuration}s`,
                }}
              >
                <Snowflake className="h-3 w-3 text-white/20" />
              </div>
            ))}
          </div>

          <div className="container mx-auto px-4 text-center relative z-10 mobile-optimized">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 animate-fade-in">
              Christmas Wishlists
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto opacity-90">
              Browse through the Christmas wishlists of children in our community. 
              Each child has shared their holiday dreams - help make them come true!
            </p>
          </div>
        </section>

        {/* Wishlists Section */}
        <section className="py-20 mobile-optimized" data-section="wishlists">
          <div className="container mx-auto px-4 mobile-optimized no-horizontal-scroll">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-christmas-green-800 mb-4">
                Children's Wishlists
              </h2>
              <p className="text-base md:text-lg text-christmas-brown-700 max-w-2xl mx-auto">
                Each child below has created a special wishlist for Christmas. Click on their profile to see what would make their holiday magical.
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <LoadingSp‌inner 
                message={retryCount > 0 ? `Loading... (attempt ${retryCount + 1})` : "Loading children's wishlists..."} 
              />
            )}

            {/* Simplified Error State */}
            {!loading && error && !isUsingFallback && (
              <div className="text-center py-20">
                <div className="max-w-md mx-auto">
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>
                      Unable to connect to our servers. Please check your internet connection and try again.
                    </AlertDescription>
                  </Alert>
                  
                  <Button onClick={handleRetry} disabled={loading}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              </div>
            )}

            {/* Success State */}
            {!loading && (children.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mobile-optimized">
                {children.map((child) => (
                  <ChildCard
                    key={child.id}
                    child={child}
                    onAdopt={handleAdopt}
                    user={user}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && children.length === 0 && !isUsingFallback && (
              <div className="text-center py-20">
                <Snowflake className="h-16 w-16 text-christmas-green-400 mx-auto mb-4" />
                <h3 className="text-xl md:text-2xl font-semibold text-christmas-green-800 mb-2">
                  No Wishlists Available
                </h3>
                <p className="text-christmas-brown-600">
                  Check back soon for new children's wishlists!
                </p>
              </div>
            )}
          </div>
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

export default Wishlists;
