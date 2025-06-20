
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Charity } from "@/components/Charity";
import { Stats } from "@/components/Stats";
import { AuthDialog } from "@/components/AuthDialog";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MobileLoadingSpinner } from "@/components/MobileLoadingSpinner";
import { Heart, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
      {/* Header - Always show for navigation */}
      <Header user={user} onAuthClick={() => setShowAuthDialog(true)} />
      
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

      {/* Founders Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-christmas-green-800 mb-6 font-christmas">
              Our Founders' Heart for Giving
            </h2>
            <p className="text-lg text-christmas-brown-700 max-w-3xl mx-auto">
              The passion behind Candy Cane Kindness comes from a family's deep commitment to serving others
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Card className="bg-christmas-cream border-christmas-green-200">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Heart className="h-8 w-8 text-christmas-red-500 mr-3" />
                  <h3 className="text-2xl font-bold text-christmas-green-800 font-christmas">
                    A Family Legacy of Giving
                  </h3>
                </div>
                <p className="text-lg text-christmas-brown-700 mb-4">
                  At the heart of Candy Cane Kindness is Suzanne Sindone and her daughters, 
                  Ashley Valderrey and Krysti DeMario. For years, this remarkable family has 
                  dedicated themselves to giving back to the community with unwavering passion 
                  and commitment.
                </p>
                <p className="text-lg text-christmas-brown-700">
                  Their journey of service has touched countless lives throughout the Treasure Coast 
                  of Florida, creating a ripple effect of kindness that continues to grow each year.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-christmas-green-50 to-christmas-green-100 border-christmas-green-300">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Users className="h-8 w-8 text-christmas-green-600 mr-3" />
                  <h3 className="text-2xl font-bold text-christmas-green-800 font-christmas">
                    Holiday Magic for All
                  </h3>
                </div>
                <p className="text-lg text-christmas-brown-700 mb-4">
                  The Sindone family has always believed that the holiday season should be a time 
                  of joy and wonder for everyone, especially those who are less fortunate. Their 
                  passion for giving during these special moments stems from a deep understanding 
                  that the magic of Christmas shouldn't depend on circumstances.
                </p>
                <p className="text-lg text-christmas-brown-700">
                  Through their years of community service across the Treasure Coast, they've 
                  witnessed firsthand how a simple act of kindness can transform not just a 
                  holiday, but an entire family's sense of hope and belonging.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center bg-christmas-red-50 rounded-lg p-8">
            <h4 className="text-xl font-bold text-christmas-green-800 mb-4 font-christmas">
              Years of Community Impact
            </h4>
            <p className="text-lg text-christmas-brown-700 max-w-4xl mx-auto">
              What started as a family's desire to help others has grown into Candy Cane Kindness, 
              a beacon of hope for families throughout the Treasure Coast. 
              Suzanne, Ashley, and Krysti continue to lead by example, showing that when we come 
              together with open hearts, we can create extraordinary moments of joy for those who 
              need it most.
            </p>
          </div>
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
