
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthDialog } from "@/components/AuthDialog";
import { ChildCard } from "@/components/ChildCard";
import { Gift, Heart, Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Child = Tables<"children">;

const Wishlists = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log("Wishlists page - Mobile scroll test");
    console.log("Page can scroll:", document.body.scrollHeight > window.innerHeight);
  }, []);

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
    // Adoption flow will be handled by the child card/modal
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-christmas-cream to-background mobile-optimized no-horizontal-scroll">
      <Header user={user} onAuthClick={() => setShowAuthDialog(true)} />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-christmas-red-600 to-christmas-red-800 text-white mobile-optimized">
        <div className="absolute inset-0 overflow-hidden decorative-only mobile-no-animation">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute md:animate-pulse decorative-only"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              {i % 3 === 0 ? (
                <Star className="h-4 w-4 text-yellow-300" />
              ) : i % 3 === 1 ? (
                <Gift className="h-4 w-4 text-white/80" />
              ) : (
                <Heart className="h-3 w-3 text-pink-200" />
              )}
            </div>
          ))}
        </div>

        <div className="container mx-auto px-4 text-center relative z-10 mobile-optimized">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
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

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-christmas-green-600"></div>
            </div>
          ) : (
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

          {!loading && children.length === 0 && (
            <div className="text-center py-20">
              <Gift className="h-16 w-16 text-christmas-green-400 mx-auto mb-4" />
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
  );
};

export default Wishlists;
