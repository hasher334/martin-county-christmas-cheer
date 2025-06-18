
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { MobileMenu } from "./MobileMenu";

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
          <Link to="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
            <img 
              src="/lovable-uploads/c7f04c93-4d0b-4c6b-8363-f9c2f59a1093.png" 
              alt="Candy Cane Kindness Logo" 
              className="h-12 w-12"
            />
            <div>
              <h1 className="text-2xl font-bold text-christmas-green-800 font-chopin">
                Candy Cane Kindness
              </h1>
              <p className="text-sm text-christmas-brown-600">Spreading joy, one child at a time</p>
            </div>
          </Link>
          
          <div className="flex items-center space-x-8">
            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center">
              <div className="flex items-center space-x-1 bg-white/50 rounded-full px-2 py-1 backdrop-blur-sm">
                <Link 
                  to="/wishlists" 
                  className="px-4 py-2 rounded-full text-christmas-green-700 hover:text-christmas-green-800 hover:bg-white/80 font-medium transition-all duration-200 ease-in-out"
                >
                  Browse Wishlists
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 rounded-full text-christmas-green-700 hover:text-christmas-green-800 hover:bg-white/80 font-medium transition-all duration-200 ease-in-out"
                >
                  Register Child
                </Link>
                <Link 
                  to="/about" 
                  className="px-4 py-2 rounded-full text-christmas-green-700 hover:text-christmas-green-800 hover:bg-white/80 font-medium transition-all duration-200 ease-in-out"
                >
                  About Our Mission
                </Link>
              </div>
            </nav>

            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-christmas-green-700 bg-white/30 rounded-full px-4 py-2">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Welcome, {user.email?.split('@')[0]}!
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="text-christmas-red-600 border-christmas-red-300 hover:bg-christmas-red-50 hover:border-christmas-red-400 transition-all duration-200"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={onAuthClick}
                  className="bg-christmas-red-600 hover:bg-christmas-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <User className="h-4 w-4 mr-2" />
                  Sign In to Adopt
                </Button>
              )}
            </div>

            {/* Mobile Menu */}
            <MobileMenu user={user} onAuthClick={onAuthClick} />
          </div>
        </div>
      </div>
    </header>
  );
};
