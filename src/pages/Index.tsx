
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChristmasTree } from "@/components/ChristmasTree";
import { ChildCard } from "@/components/ChildCard";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { Footer } from "@/components/Footer";
import { AuthDialog } from "@/components/AuthDialog";
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
    // We'll implement the adoption flow in the ChildCard component
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-red-50">
      <Header user={user} onAuthClick={() => setShowAuthDialog(true)} />
      
      {/* Hero Section */}
      <Hero />

      {/* Animated Christmas Tree */}
      <section className="py-12 bg-gradient-to-b from-green-100 to-green-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-green-800 mb-8">
            Our Christmas Tree of Hope
          </h2>
          <p className="text-lg text-green-700 mb-8 max-w-2xl mx-auto">
            Each ornament represents a child waiting for Christmas magic. Help us light up their holidays!
          </p>
          <ChristmasTree />
        </div>
      </section>

      {/* Stats Section */}
      <Stats />

      {/* Children Profiles */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-4">
            Meet the Children
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            These wonderful children are waiting for someone special to make their Christmas dreams come true.
          </p>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg h-96"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
