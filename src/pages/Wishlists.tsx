import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthDialog } from "@/components/AuthDialog";
import { ChildCard } from "@/components/ChildCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Snowflake, Wifi, WifiOff, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useChildrenData } from "@/hooks/useChildrenData";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Wishlists = () => {
  const [user, setUser] = useState(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { toast } = useToast();
  const networkStatus = useNetworkStatus();
  const { children, loading, error, refetch, retryCount, isUsingFallback, networkDiagnostics } = useChildrenData();

  // Generate snowflakes with the same logic as Hero component
  const snowflakePositions = useMemo(() => {
    const positions = [];
    const isMobile = window.innerWidth < 768;
    const snowflakeSize = 16; // 4 * 4 (h-4 w-4 in pixels)
    const minDistance = snowflakeSize * 2; // Minimum distance between snowflakes
    const maxAttempts = 500; // Reduced attempts for better performance
    const targetCount = isMobile ? 100 : 200; // Fewer snowflakes on mobile

    // Helper function to check if a position overlaps with existing positions
    const isValidPosition = (x: number, y: number) => {
      return positions.every(pos => {
        const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
        return distance >= minDistance;
      });
    };

    // Generate positions
    for (let i = 0; i < targetCount; i++) {
      let attempts = 0;
      let validPosition = false;
      let x, y;

      while (!validPosition && attempts < maxAttempts) {
        x = Math.random() * 100;
        y = Math.random() * 100;
        
        if (isValidPosition(x, y)) {
          validPosition = true;
          positions.push({
            x,
            y,
            animationDelay: Math.random() * 2,
            animationDuration: 2 + Math.random() * 2,
          });
        }
        attempts++;
      }

      // If we can't find a valid position after max attempts, stop adding more
      if (!validPosition) {
        break;
      }
    }

    return positions;
  }, []);

  useEffect(() => {
    console.log("Wishlists page - Mobile scroll test");
    console.log("Page can scroll:", document.body.scrollHeight > window.innerHeight);
    console.log("Network status on mount:", networkStatus);
    
    // Log enhanced data loading status
    if (networkDiagnostics) {
      console.log("Network diagnostics:", networkDiagnostics);
    }
  }, [networkStatus, networkDiagnostics]);

  useEffect(() => {
    // Check auth state
    const checkAuth = async () => {
      console.log("🔐 Checking authentication status...");
      try {
        const { data: { user } } = await supabase.auth.getUser();
        console.log("🔐 Auth check result:", { user: !!user, userId: user?.id });
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
      console.log("🔐 User not authenticated, showing auth dialog");
      setShowAuthDialog(true);
      return;
    }
    // Adoption flow will be handled by the child card/modal
  };

  const handleRetry = async () => {
    console.log("🔄 User triggered manual retry");
    await refetch();
  };

  const handleRunDiagnostics = () => {
    console.log("🔧 User requested network diagnostics");
    toast({
      title: "Running Diagnostics",
      description: "Check the browser console for detailed network information.",
    });
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-christmas-cream to-background mobile-optimized no-horizontal-scroll">
        <Header user={user} onAuthClick={() => setShowAuthDialog(true)} />
        
        {/* Network Status Alert */}
        {!networkStatus.isOnline && (
          <Alert className="mx-4 mb-4 border-orange-500 bg-orange-50">
            <WifiOff className="h-4 w-4" />
            <AlertDescription>
              You appear to be offline. Some features may not work properly.
            </AlertDescription>
          </Alert>
        )}

        {/* Fallback Data Alert */}
        {isUsingFallback && (
          <Alert className="mx-4 mb-4 border-blue-500 bg-blue-50">
            <Wifi className="h-4 w-4" />
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

        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-b from-[#c51212] via-[#a20a0a] to-[#4d0000] text-white overflow-hidden mobile-optimized">
          {/* Candy Cane Stripe Pattern Overlay */}
          <div 
            className="absolute inset-0 opacity-15"
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

          {/* Floating Christmas Elements - Same as Hero component */}
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
                <Snowflake className="h-4 w-4 text-white/30" />
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
              <LoadingSpinner 
                message={retryCount > 0 ? `Loading... (attempt ${retryCount + 1})` : "Loading children's wishlists..."} 
              />
            )}

            {/* Error State */}
            {!loading && error && !isUsingFallback && (
              <div className="text-center py-20">
                <div className="max-w-md mx-auto">
                  <Alert variant="destructive" className="mb-4">
                    <WifiOff className="h-4 w-4" />
                    <AlertDescription>
                      {error.includes('fetch') 
                        ? 'Unable to connect to our servers. Please check your internet connection and try again.'
                        : error
                      }
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-2">
                    <Button onClick={handleRetry} disabled={loading}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Try Again
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={handleRunDiagnostics}
                      className="ml-2"
                    >
                      Run Diagnostics
                    </Button>
                    
                    <div className="flex items-center justify-center text-sm text-gray-500 mt-2">
                      {networkStatus.isOnline ? (
                        <><Wifi className="h-4 w-4 mr-1" /> Online</>
                      ) : (
                        <><WifiOff className="h-4 w-4 mr-1" /> Offline</>
                      )}
                    </div>
                  </div>
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
