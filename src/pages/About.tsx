
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Charity } from "@/components/Charity";
import { Stats } from "@/components/Stats";
import { AuthDialog } from "@/components/AuthDialog";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const About = () => {
  const [user, setUser] = useState(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-christmas-cream to-background">
      <Header user={user} onAuthClick={() => setShowAuthDialog(true)} />
      
      {/* Page Title Section */}
      <section className="py-16 bg-gradient-to-b from-christmas-red-600 to-christmas-red-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About Our Mission
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Learn more about Martin County Christmas Cheer and the impact we're making in our community
          </p>
        </div>
      </section>

      {/* Charity Section */}
      <Charity />

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

export default About;
