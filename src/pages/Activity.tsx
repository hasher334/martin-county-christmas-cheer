
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthDialog } from "@/components/AuthDialog";
import { DonorDashboard } from "@/components/DonorDashboard";
import { MobileLoadingSpinner } from "@/components/MobileLoadingSpinner";
import { Button } from "@/components/ui/button";
import { User, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

const Activity = () => {
  const [user, setUser] = useState(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Activity page mounting");
    
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return <MobileLoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-christmas-cream to-background font-nunito">
      <Header user={user} onAuthClick={() => setShowAuthDialog(true)} />
      
      {/* Page Title Section */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-christmas-green-600 to-christmas-green-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 font-christmas">
            Your Christmas Impact
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto font-nunito">
            Track your generous contributions and see the joy you've brought to children this Christmas
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {user ? (
            <DonorDashboard user={user} />
          ) : (
            <div className="text-center max-w-2xl mx-auto">
              <User className="h-24 w-24 text-christmas-green-300 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-christmas-green-800 mb-4 font-christmas">
                Sign In to View Your Activity
              </h2>
              <p className="text-lg text-christmas-brown-700 mb-8">
                Please sign in to access your donor dashboard and see all the children you've helped this Christmas.
              </p>
              <div className="space-y-4">
                <Button
                  onClick={() => setShowAuthDialog(true)}
                  className="bg-christmas-red-600 hover:bg-christmas-red-700 text-white px-8 py-3 text-lg"
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign In
                </Button>
                <p className="text-sm text-christmas-brown-600">
                  Don't have an account? Sign up when you adopt your first child from our{" "}
                  <Link to="/wishlists" className="text-christmas-red-600 hover:underline font-medium">
                    wishlist page
                  </Link>
                </p>
              </div>
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

export default Activity;
