
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthDialog } from "@/components/AuthDialog";
import { ChildProfileModal } from "@/components/ChildProfileModal";
import { ChristmasColorUtility } from "@/components/ChristmasColorUtility";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gift, Heart, MapPin, User } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Child = Tables<"children">;

const Wishlists = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [showModal, setShowModal] = useState(false);
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
    // We'll implement the adoption flow in the child profile modal
  };

  const handleViewProfile = (child: Child) => {
    setSelectedChild(child);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-christmas-cream to-background">
      <ChristmasColorUtility />
      <Header user={user} onAuthClick={() => setShowAuthDialog(true)} />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-[#c51212] via-[#a20a0a] to-[#4d0000] text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Children's Christmas Wishlists
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Browse through the Christmas wishes of children in Martin County. 
            Each wishlist represents a child's hopes and dreams for the holiday season.
          </p>
        </div>
      </section>

      {/* Wishlists Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-christmas-green-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {children.map((child) => (
                <Card key={child.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200 border-2 border-christmas-green-100">
                  <CardHeader className="bg-gradient-to-r from-christmas-green-50 to-christmas-cream">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-christmas-green-800 flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {child.name}
                      </CardTitle>
                      <Badge variant="secondary" className="bg-christmas-red-100 text-christmas-red-700">
                        Age {child.age}
                      </Badge>
                    </div>
                    {child.location && (
                      <div className="flex items-center gap-1 text-sm text-christmas-brown-600">
                        <MapPin className="h-4 w-4" />
                        {child.location}
                      </div>
                    )}
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    {child.photo_url && (
                      <div className="mb-4">
                        <img 
                          src={child.photo_url} 
                          alt={`${child.name}'s photo`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    
                    {child.story && (
                      <p className="text-sm text-christmas-brown-700 mb-4 line-clamp-3">
                        {child.story}
                      </p>
                    )}
                    
                    {child.wishes && child.wishes.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-christmas-green-800 mb-2 flex items-center gap-2">
                          <Gift className="h-4 w-4" />
                          Christmas Wishes:
                        </h4>
                        <ul className="space-y-1">
                          {child.wishes.slice(0, 3).map((wish, index) => (
                            <li key={index} className="text-sm text-christmas-brown-600 flex items-start gap-2">
                              <Heart className="h-3 w-3 mt-0.5 text-christmas-red-500 flex-shrink-0" />
                              {wish}
                            </li>
                          ))}
                          {child.wishes.length > 3 && (
                            <li className="text-sm text-christmas-brown-500 italic">
                              ...and {child.wishes.length - 3} more wishes
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                    
                    <Button 
                      onClick={() => handleViewProfile(child)}
                      className="w-full bg-christmas-green-600 hover:bg-christmas-green-700 text-white"
                    >
                      View Full Profile & Adopt
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {!loading && children.length === 0 && (
            <div className="text-center py-12">
              <Gift className="h-16 w-16 text-christmas-brown-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-christmas-brown-600 mb-2">
                No wishlists available
              </h3>
              <p className="text-christmas-brown-500">
                Check back later for new children's wishlists.
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

      {selectedChild && (
        <ChildProfileModal
          open={showModal}
          onOpenChange={setShowModal}
          child={selectedChild}
          onAdopt={handleAdopt}
          user={user}
        />
      )}
    </div>
  );
};

export default Wishlists;
