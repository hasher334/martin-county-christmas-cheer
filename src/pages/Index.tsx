
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
import { Gift, Users, Heart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Child = Tables<"children">;

const Index = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [componentsLoaded, setComponentsLoaded] = useState({
    header: false,
    hero: false,
    tree: false,
    navigation: false,
    stats: false,
    footer: false
  });
  const { toast } = useToast();

  useEffect(() => {
    console.log("Index page mobile optimization active");
    
    // Check auth state
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        setComponentsLoaded(prev => ({ ...prev, header: true }));
      } catch (error) {
        console.error("Auth check error:", error);
      }
    };
    
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    // Progressive component loading
    const loadSequence = [
      { key: 'hero', delay: 50 },
      { key: 'tree', delay: 150 },
      { key: 'navigation', delay: 250 },
      { key: 'stats', delay: 350 },
      { key: 'footer', delay: 450 }
    ];

    loadSequence.forEach(({ key, delay }) => {
      setTimeout(() => {
        setComponentsLoaded(prev => ({ ...prev, [key]: true }));
      }, delay);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (componentsLoaded.tree) {
      fetchChildren();
    }
  }, [componentsLoaded.tree]);

  const fetchChildren = async () => {
    try {
      const { data, error } = await supabase
        .from("children")
        .select("*")
        .eq("status", "available")
        .order("created_at", { ascending: true });

      if (error) throw error;
      setChildren(data || []);
    } catch (error) {
      console.error("Error fetching children:", error);
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

  // Show loading spinner until core components are ready
  if (!componentsLoaded.header || !componentsLoaded.hero) {
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
          
          {componentsLoaded.tree && (
            <div className="animate-fade-in">
              {loading ? (
                <div className="flex justify-center items-center py-16 md:py-20">
                  <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-b-2 border-christmas-green-600"></div>
                </div>
              ) : (
                <InteractiveChristmasTree 
                  children={children} 
                  onAdopt={handleAdopt}
                  user={user}
                />
              )}
            </div>
          )}

          {/* Navigation Banners */}
          {componentsLoaded.navigation && (
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
          )}
        </div>
      </section>

      {/* Stats Section */}
      {componentsLoaded.stats && (
        <div className="animate-fade-in">
          <Stats />
        </div>
      )}

      {componentsLoaded.footer && (
        <div className="animate-fade-in">
          <Footer />
        </div>
      )}

      <AuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog}
        onSuccess={() => setShowAuthDialog(false)}
      />
    </div>
  );
};

export default Index;
