
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { InteractiveChristmasTree } from "@/components/InteractiveChristmasTree";
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
    // We'll implement the adoption flow in the child profile
  };

  return (
    <div className="min-h-screen relative">
      {/* Christmas Snow Effect */}
      <div className="snow"></div>
      
      {/* Christmas Lights Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 rounded-full twinkle ${
              i % 3 === 0 ? 'bg-red-500' : i % 3 === 1 ? 'bg-green-500' : 'bg-yellow-400'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 bg-gradient-to-b from-red-900/10 via-green-900/5 to-red-900/10 min-h-screen">
        <Header user={user} onAuthClick={() => setShowAuthDialog(true)} />
        
        {/* Hero Section */}
        <Hero />

        {/* Main Interactive Christmas Tree Section */}
        <section className="py-20 bg-gradient-to-b from-green-900/20 via-red-900/10 to-green-900/30 min-h-screen relative" data-section="children">
          {/* Christmas Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                radial-gradient(circle at 25% 25%, #dc2626 2px, transparent 2px),
                radial-gradient(circle at 75% 75%, #16a34a 2px, transparent 2px),
                radial-gradient(circle at 50% 50%, #eab308 1px, transparent 1px)
              `,
              backgroundSize: '100px 100px, 150px 150px, 80px 80px'
            }}></div>
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 mb-12 shadow-2xl border-4 border-red-500/30 christmas-glow">
              <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-red-600 via-green-600 to-red-600 bg-clip-text text-transparent mb-6">
                🎄 Our Magical Christmas Tree 🎄
              </h2>
              <p className="text-2xl text-green-800 mb-8 max-w-4xl mx-auto font-semibold">
                Each sparkling ornament represents a precious child waiting for Christmas magic. 
                Click on any ornament to meet them and help make their holiday dreams come true! ✨
              </p>
              
              {/* Christmas Border */}
              <div className="flex justify-center items-center space-x-4 text-4xl mb-6">
                <span className="twinkle">🎁</span>
                <span className="twinkle">⭐</span>
                <span className="twinkle">🎅</span>
                <span className="twinkle">🤶</span>
                <span className="twinkle">🎄</span>
                <span className="twinkle">❄️</span>
                <span className="twinkle">🔔</span>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="relative">
                  <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-red-600"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-2xl">🎁</div>
                </div>
              </div>
            ) : (
              <InteractiveChristmasTree 
                children={children} 
                onAdopt={handleAdopt}
                user={user}
              />
            )}
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
    </div>
  );
};

export default Index;
