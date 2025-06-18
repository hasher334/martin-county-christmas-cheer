
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthDialog } from "@/components/AuthDialog";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Shield, Users, Settings } from "lucide-react";
import { ProfileForm } from "@/components/ProfileForm";
import { RoleManagement } from "@/components/RoleManagement";

const Admin = () => {
  const [user, setUser] = useState(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showRoleManagement, setShowRoleManagement] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check auth state
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // Check if user is admin
        const { data: adminCheck } = await supabase
          .rpc('is_admin', { user_id: user.id });
        setIsAdmin(adminCheck);
        
        if (adminCheck) {
          fetchProfiles();
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setIsAdmin(false);
        setProfiles([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          user_roles!inner(role)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      toast({
        title: "Error",
        description: "Failed to load user profiles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = async (profileId) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", profileId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile deleted successfully",
      });
      
      fetchProfiles();
    } catch (error) {
      console.error("Error deleting profile:", error);
      toast({
        title: "Error",
        description: "Failed to delete profile",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-christmas-cream to-background">
        <Header user={user} onAuthClick={() => setShowAuthDialog(true)} />
        
        <div className="container mx-auto px-4 py-20 text-center">
          <Shield className="h-16 w-16 text-christmas-red-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-christmas-green-800 mb-4">
            Admin Access Required
          </h1>
          <p className="text-christmas-brown-600 mb-8">
            Please sign in to access the admin dashboard.
          </p>
          <Button
            onClick={() => setShowAuthDialog(true)}
            className="bg-christmas-red-600 hover:bg-christmas-red-700 text-white"
          >
            Sign In
          </Button>
        </div>

        <Footer />
        <AuthDialog 
          open={showAuthDialog} 
          onOpenChange={setShowAuthDialog}
          onSuccess={() => setShowAuthDialog(false)}
        />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-christmas-cream to-background">
        <Header user={user} onAuthClick={() => setShowAuthDialog(true)} />
        
        <div className="container mx-auto px-4 py-20 text-center">
          <Shield className="h-16 w-16 text-christmas-red-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-christmas-green-800 mb-4">
            Access Denied
          </h1>
          <p className="text-christmas-brown-600 mb-8">
            You don't have admin privileges to access this page.
          </p>
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="border-christmas-green-600 text-christmas-green-600"
          >
            Go Back
          </Button>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-christmas-cream to-background">
      <Header user={user} onAuthClick={() => setShowAuthDialog(true)} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-christmas-green-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-christmas-brown-600">
            Manage user profiles and roles
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-christmas-green-700">
                Total Profiles
              </CardTitle>
              <Users className="h-4 w-4 text-christmas-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-christmas-green-800">
                {profiles.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-christmas-green-700">
                Quick Actions
              </CardTitle>
              <Settings className="h-4 w-4 text-christmas-green-600" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                onClick={() => setShowProfileForm(true)}
                className="w-full bg-christmas-green-600 hover:bg-christmas-green-700 text-white"
                size="sm"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Profile
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-christmas-green-700">
                Role Management
              </CardTitle>
              <Shield className="h-4 w-4 text-christmas-green-600" />
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setShowRoleManagement(true)}
                variant="outline"
                className="w-full border-christmas-red-600 text-christmas-red-600 hover:bg-christmas-red-50"
                size="sm"
              >
                Manage Roles
              </Button>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-christmas-green-600"></div>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-christmas-green-800">User Profiles</CardTitle>
            </CardHeader>
            <CardContent>
              {profiles.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-christmas-green-400 mx-auto mb-4" />
                  <p className="text-christmas-brown-600">No profiles found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {profiles.map((profile) => (
                    <div
                      key={profile.id}
                      className="flex items-center justify-between p-4 border border-christmas-green-200 rounded-lg bg-white/50"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-christmas-green-800">
                          {profile.first_name} {profile.last_name}
                        </h3>
                        <p className="text-sm text-christmas-brown-600">
                          {profile.email}
                        </p>
                        <div className="flex gap-2 mt-2">
                          {profile.user_roles?.map((roleData, index) => (
                            <Badge
                              key={index}
                              variant={roleData.role === 'admin' ? 'destructive' : 'secondary'}
                              className="text-xs"
                            >
                              {roleData.role}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleDeleteProfile(profile.id)}
                          variant="outline"
                          size="sm"
                          className="border-christmas-red-300 text-christmas-red-600 hover:bg-christmas-red-50"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />

      <ProfileForm 
        open={showProfileForm}
        onOpenChange={setShowProfileForm}
        onSuccess={() => {
          setShowProfileForm(false);
          fetchProfiles();
        }}
      />

      <RoleManagement
        open={showRoleManagement}
        onOpenChange={setShowRoleManagement}
        onSuccess={() => {
          setShowRoleManagement(false);
          fetchProfiles();
        }}
      />
    </div>
  );
};

export default Admin;
