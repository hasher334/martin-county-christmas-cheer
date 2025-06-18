
import { Button } from "@/components/ui/button";
import { Heart, User, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

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
    <header className="bg-christmas-cream shadow-lg border-b-4 border-christmas-red-600">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <Heart className="h-8 w-8 text-christmas-red-600" />
            <div>
              <h1 className="text-2xl font-bold text-christmas-green-800">
                Martin County Christmas Cheer
              </h1>
              <p className="text-sm text-christmas-brown-600">Spreading joy, one child at a time</p>
            </div>
          </Link>
          
          <div className="flex items-center space-x-6">
            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                to="/wishlists" 
                className="text-christmas-green-700 hover:text-christmas-green-800 font-medium transition-colors"
              >
                Browse Wishlists
              </Link>
              <Link 
                to="/register" 
                className="text-christmas-green-700 hover:text-christmas-green-800 font-medium transition-colors"
              >
                Register Child
              </Link>
              <Link 
                to="/about" 
                className="text-christmas-green-700 hover:text-christmas-green-800 font-medium transition-colors"
              >
                About Our Mission
              </Link>
            </nav>

            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-christmas-green-700">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Welcome, {user.email?.split('@')[0]}!
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-christmas-red-600 border-christmas-red-200 hover:bg-christmas-red-50"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                onClick={onAuthClick}
                className="bg-christmas-red-600 hover:bg-christmas-red-700 text-white"
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
