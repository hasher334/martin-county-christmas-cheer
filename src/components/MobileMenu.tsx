
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Menu, X, User, LogOut } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";

interface MobileMenuProps {
  user: any;
  onAuthClick: () => void;
}

export const MobileMenu = ({ user, onAuthClick }: MobileMenuProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Fix #2: Hard-clean on every route change
  useEffect(() => {
    const clearBodyClasses = () => {
      console.log("Clearing body scroll lock classes on route change");
      document.body.classList.remove('overflow-hidden', 'fixed', 'inset-0');
      document.documentElement.classList.remove('overflow-hidden', 'fixed');
    };

    // Clear classes when location changes
    clearBodyClasses();
  }, [location.pathname]);

  // Fix #1: Always close drawer before routing
  const handleNavigation = (href: string) => {
    console.log(`Mobile menu navigation to: ${href}`);
    setIsOpen(false); // Close drawer first
    
    // Small delay to ensure drawer cleanup completes
    setTimeout(() => {
      navigate(href);
    }, 50);
  };

  const handleSignOut = async () => {
    try {
      setIsOpen(false); // Close drawer before sign out
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "Thank you for spreading Christmas cheer!",
      });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleAuthClick = () => {
    setIsOpen(false); // Close drawer before opening auth
    onAuthClick();
  };

  return (
    <div className="md:hidden">
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button variant="ghost" size="icon" className="text-christmas-green-700">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent className="bg-christmas-cream font-nunito">
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-christmas-green-800 font-christmas">Menu</DrawerTitle>
            <DrawerClose className="absolute right-4 top-4">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DrawerClose>
          </DrawerHeader>
          
          <div className="px-4 pb-8">
            <nav className="space-y-4">
              <button
                onClick={() => handleNavigation("/wishlists")}
                className="block w-full text-left py-3 px-4 text-christmas-green-700 hover:bg-white/50 rounded-lg transition-colors"
              >
                Browse Wishlists
              </button>
              
              <button
                onClick={() => handleNavigation("/register")}
                className="block w-full text-left py-3 px-4 text-christmas-green-700 hover:bg-white/50 rounded-lg transition-colors"
              >
                Register Child
              </button>
              
              {user && (
                <button
                  onClick={() => handleNavigation("/activity")}
                  className="block w-full text-left py-3 px-4 text-christmas-green-700 hover:bg-white/50 rounded-lg transition-colors"
                >
                  My Activity
                </button>
              )}
              
              <button
                onClick={() => handleNavigation("/about")}
                className="block w-full text-left py-3 px-4 text-christmas-green-700 hover:bg-white/50 rounded-lg transition-colors"
              >
                About Our Mission
              </button>
            </nav>

            <div className="mt-6 pt-6 border-t border-christmas-green-200">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-christmas-green-700 bg-white/30 rounded-lg px-4 py-3">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Welcome, {user.email?.split('@')[0]}!
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleSignOut}
                    className="w-full text-christmas-red-600 border-christmas-red-300 hover:bg-christmas-red-50 hover:border-christmas-red-400"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleAuthClick}
                  className="w-full bg-christmas-red-600 hover:bg-christmas-red-700 text-white"
                >
                  <User className="h-4 w-4 mr-2" />
                  Sign In to Adopt
                </Button>
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
