
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, User, UserPlus, LogOut, Settings } from "lucide-react";
import { MobileMenu } from "./MobileMenu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface HeaderProps {
  user: any;
  onAuthClick: () => void;
}

export const Header = ({ user, onAuthClick }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAdminAccess = () => {
    window.location.href = '/admin';
  };

  return (
    <>
      <header className="bg-white shadow-lg border-b-4 border-christmas-red-500 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🎄</div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-christmas-green-800 font-christmas">
                  Candy Cane Kindness
                </h1>
                <p className="text-sm text-christmas-brown-600 font-nunito hidden md:block">
                  Spreading Christmas joy throughout our community
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <a 
                href="/" 
                className="text-christmas-green-700 hover:text-christmas-red-600 font-medium transition-colors font-nunito"
              >
                Home
              </a>
              <a 
                href="/wishlists" 
                className="text-christmas-green-700 hover:text-christmas-red-600 font-medium transition-colors font-nunito"
              >
                Wishlists
              </a>
              <a 
                href="/register" 
                className="text-christmas-green-700 hover:text-christmas-red-600 font-medium transition-colors font-nunito"
              >
                Register Child
              </a>
              <a 
                href="/about" 
                className="text-christmas-green-700 hover:text-christmas-red-600 font-medium transition-colors font-nunito"
              >
                About
              </a>
              
              {/* Auth Buttons */}
              <div className="flex items-center space-x-3">
                {user ? (
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={handleAdminAccess}
                      variant="outline"
                      size="sm"
                      className="border-christmas-green-600 text-christmas-green-700 hover:bg-christmas-green-50"
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Admin
                    </Button>
                    <Button
                      onClick={handleLogout}
                      variant="outline" 
                      size="sm"
                      className="border-christmas-red-600 text-christmas-red-700 hover:bg-christmas-red-50"
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={onAuthClick}
                      variant="outline"
                      size="sm"
                      className="border-christmas-green-600 text-christmas-green-700 hover:bg-christmas-green-50"
                    >
                      <User className="h-4 w-4 mr-1" />
                      Login
                    </Button>
                    <Button
                      onClick={onAuthClick}
                      size="sm"
                      className="bg-christmas-red-600 hover:bg-christmas-red-700 text-white"
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-christmas-green-700"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        user={user}
        onAuthClick={onAuthClick}
        onLogout={handleLogout}
        onAdminAccess={handleAdminAccess}
      />
    </>
  );
};
