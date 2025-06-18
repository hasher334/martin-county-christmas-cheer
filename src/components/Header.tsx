
import { Button } from "@/components/ui/button";
import { Heart, User, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface HeaderProps {
  user: any;
  onAuthClick: () => void;
}

export const Header = ({ user, onAuthClick }: HeaderProps) => {
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "Thank you for spreading Christmas cheer!",
      });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="bg-gradient-to-r from-christmas-red-700 to-christmas-red-800 shadow-xl border-b-4 border-christmas-red-900">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Heart className="h-8 w-8 text-christmas-cream fill-christmas-cream" />
            <div>
              <h1 className="text-2xl font-bold text-christmas-cream">
                Martin County Christmas Cheer
              </h1>
              <p className="text-sm text-christmas-red-100">Spreading joy, one child at a time</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-christmas-cream">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Welcome, {user.email?.split('@')[0]}!
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-christmas-cream border-christmas-cream hover:bg-christmas-cream hover:text-christmas-red-700 transition-all duration-200"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                onClick={onAuthClick}
                className="bg-christmas-green-700 hover:bg-christmas-green-800 text-christmas-cream border-2 border-christmas-green-600 shadow-lg transition-all duration-200 hover:shadow-xl"
              >
                <User className="h-4 w-4 mr-2" />
                Sign In to Adopt
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
