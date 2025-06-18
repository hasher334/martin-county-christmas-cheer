
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
import { Gift, Users, Heart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Child = Tables<"children">;

const Index = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check auth state
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fetchChildren();
  }, []);

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
    // We'll implement the adoption flow in the child profile
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-christmas-cream to-background no-horizontal-scroll">
      <ChristmasColorUtility />
      <Header user={user} onAuthClick={() => setShowAuthDialog(true)} />
      
      {/* Hero Section */}
      <Hero />

      {/* Main Interactive Christmas Tree Section */}
      <section className="py-20 bg-gradient-to-b from-christmas-cream via-background to-christmas-green-50" data-section="wishlists">
        <div className="container mx-auto px-4 text-center no-horizontal-scroll">
          <h2 className="text-4xl md:text-5xl font-bold text-christmas-green-800 mb-6">
            Our Christmas Tree of Hope
          </h2>
          <p className="text-xl text-christmas-brown-700 mb-12 max-w-3xl mx-auto">
            Each ornament represents a child waiting for Christmas magic. Click on any ornament to meet them and help make their holiday dreams come true!
          </p>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-christmas-green-600"></div>
            </div>
          ) : (
            <InteractiveChristmasTree 
              children={children} 
              onAdopt={handleAdopt}
              user={user}
            />
          )}

          {/* Navigation Banners under Christmas Tree */}
          <div className="mt-16 mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
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
      <Stats />

      <Footer />

      <AuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog}
        onSuccess={() => setShowAuthDialog(false)}
      />
    </div>
  );
};

export default Index;
