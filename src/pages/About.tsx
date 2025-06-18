
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Charity } from "@/components/Charity";
import { Stats } from "@/components/Stats";
import { AuthDialog } from "@/components/AuthDialog";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MobileLoadingSpinner } from "@/components/MobileLoadingSpinner";

const About = () => {
  const [user, setUser] = useState(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [componentsLoaded, setComponentsLoaded] = useState({
    header: false,
    charity: false,
    stats: false,
    footer: false
  });

  useEffect(() => {
    console.log("About page mounting - mobile optimization active");
    
    // Check auth state with mobile optimization
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

    // Progressive component loading with mobile-first timing
    const componentLoadSequence = [
      { key: 'charity', delay: 100 },
      { key: 'stats', delay: 200 },
      { key: 'footer', delay: 300 }
    ];

    componentLoadSequence.forEach(({ key, delay }) => {
      setTimeout(() => {
        setComponentsLoaded(prev => ({ ...prev, [key]: true }));
      }, delay);
    });

    // Complete loading after all components are ready
    setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => subscription.unsubscribe();
  }, []);

  // Show mobile loading spinner while components load
  if (isLoading) {
    return <MobileLoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-christmas-cream to-background font-nunito mobile-optimized">
      {/* Header - loads first */}
      {componentsLoaded.header && (
        <Header user={user} onAuthClick={() => setShowAuthDialog(true)} />
      )}
      
      {/* Page Title Section - Mobile optimized */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-christmas-red-600 to-christmas-red-700 text-white mobile-optimized">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 font-christmas">
            About Our Mission
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto font-nunito">
            Learn more about Candy Cane Kindness and the impact we're making in our community
          </p>
        </div>
      </section>

      {/* Progressive component loading */}
      {componentsLoaded.charity && (
        <div className="animate-fade-in">
          <Charity />
        </div>
      )}

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

export default About;
