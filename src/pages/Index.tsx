
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
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Gift, Users, Heart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Child = Tables<"children">;

const Index = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;
    
    const initializeApp = async () => {
      console.log("Index page initializing");
      
      try {
        // Check current auth state
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (isMounted) {
          setUser(currentUser);
        }

        // Fetch children data
        await fetchChildren();
      } catch (error) {
        console.error("Initialization error:", error);
        if (isMounted) {
          setError("Failed to initialize application");
          setLoading(false);
        }
      }
    };

    initializeApp();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (isMounted) {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchChildren = async () => {
    try {
      console.log('Fetching children data...');
      const { data, error } = await supabase
        .from("children")
        .select("*")
        .eq("status", "available")
        .order("created_at", { ascending: true });

      if (error) {
        console.error('Error fetching children:', error);
        throw error;
      }
      
      console.log('Children data fetched successfully:', data?.length || 0, 'children');
      setChildren(data || []);
      setError(null);
    } catch (error) {
      console.error("Error fetching children:", error);
      setError("Failed to load children profiles");
      toast({
        title: "Error",
        description: "Failed to load children profiles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdopt = (childId: string) => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
  };

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-christmas-cream to-background mobile-optimized">
        <LoadingSpinner message="Loading Christmas magic..." size="lg" />
      </div>
    );
  }

  // Show error state if there was a critical error
  if (error && children.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-christmas-cream to-background mobile-optimized">
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-christmas-red-600 text-center mb-4">{error}</p>
          <button 
            onClick={() => {
              setLoading(true);
              setError(null);
              fetchChildren();
            }}
            className="bg-christmas-green-600 hover:bg-christmas-green-700 text-white px-6 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
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
          
          <div className="animate-fade-in">
            <InteractiveChristmasTree 
              children={children} 
              onAdopt={handleAdopt}
              user={user}
            />
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
