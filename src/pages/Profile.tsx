
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DonorOverview } from "@/components/profile/DonorOverview";
import { AdoptionHistory } from "@/components/profile/AdoptionHistory";
import { ContactMessages } from "@/components/profile/ContactMessages";
import { DonorSettings } from "@/components/profile/DonorSettings";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { AuthDialog } from "@/components/AuthDialog";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setShowAuthDialog(true);
        setLoading(false);
        return;
      }

      setUser(user);
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/');
      } else if (session?.user) {
        setUser(session.user);
        setShowAuthDialog(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuthSuccess = () => {
    setShowAuthDialog(false);
    window.location.reload();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-christmas-cream to-background">
        <Header user={null} onAuthClick={() => setShowAuthDialog(true)} />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold text-christmas-green-700 mb-6">
            Please Sign In
          </h1>
          <p className="text-gray-600 mb-8">
            You need to be signed in to view your donor profile.
          </p>
        </div>
        <Footer />
        <AuthDialog 
          open={showAuthDialog}
          onOpenChange={setShowAuthDialog}
          onSuccess={handleAuthSuccess}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-christmas-cream to-background">
      <Header user={user} onAuthClick={() => setShowAuthDialog(true)} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-christmas-green-700 mb-2">
            Your Donor Profile
          </h1>
          <p className="text-gray-600">
            Manage your adoptions, view donation history, and stay connected with families.
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="adoptions">My Adoptions</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <DonorOverview user={user} />
          </TabsContent>

          <TabsContent value="adoptions" className="space-y-6">
            <AdoptionHistory user={user} />
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <ContactMessages user={user} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <DonorSettings user={user} />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
