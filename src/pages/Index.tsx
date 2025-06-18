import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { InteractiveChristmasTree } from "@/components/InteractiveChristmasTree";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { AuthDialog } from "@/components/AuthDialog";
import { ChristmasColorUtility } from "@/components/ChristmasColorUtility";
import { Button } from "@/components/ui/button";
import { Gift, Users, Heart } from "lucide-react";
import { Link } from "react-router-dom";
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
    <div className="min-h-screen bg-gradient-to-b from-christmas-cream to-background">
      <ChristmasColorUtility />
      <Header user={user} onAuthClick={() => setShowAuthDialog(true)} />
      
      {/* Hero Section */}
      <Hero />

      {/* Main Interactive Christmas Tree Section */}
      <section className="py-20 bg-gradient-to-b from-christmas-cream via-background to-christmas-green-50 min-h-screen" data-section="wishlists">
        <div className="container mx-auto px-4 text-center">
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

          {/* Navigation Buttons under Christmas Tree */}
          <div className="mt-12 mb-16">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/wishlists">
                <Button
                  size="lg"
                  className="bg-christmas-red-600 hover:bg-christmas-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <Gift className="h-5 w-5 mr-2" />
                  Browse Wishlists
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-christmas-green-700 border-christmas-green-300 hover:bg-christmas-green-50 hover:border-christmas-green-400 transition-all duration-200"
                >
                  <Users className="h-5 w-5 mr-2" />
                  Register Child
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-christmas-brown-700 border-christmas-brown-300 hover:bg-christmas-brown-50 hover:border-christmas-brown-400 transition-all duration-200"
                >
                  <Heart className="h-5 w-5 mr-2" />
                  About Our Mission
                </Button>
              </Link>
            </div>
          </div>
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

export default Index;
