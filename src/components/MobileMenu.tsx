
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
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface MobileMenuProps {
  user: any;
  onAuthClick: () => void;
}

export const MobileMenu = ({ user, onAuthClick }: MobileMenuProps) => {
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
    <div className="md:hidden">
      <Drawer>
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
              <DrawerClose asChild>
                <Link 
                  to="/wishlists" 
                  className="block py-3 px-4 text-christmas-green-700 hover:bg-white/50 rounded-lg transition-colors"
                >
                  Browse Wishlists
                </Link>
              </DrawerClose>
              
              <DrawerClose asChild>
                <Link 
                  to="/register" 
                  className="block py-3 px-4 text-christmas-green-700 hover:bg-white/50 rounded-lg transition-colors"
                >
                  Register Child
                </Link>
              </DrawerClose>
              
              <DrawerClose asChild>
                <Link 
                  to="/about" 
                  className="block py-3 px-4 text-christmas-green-700 hover:bg-white/50 rounded-lg transition-colors"
                >
                  About Our Mission
                </Link>
              </DrawerClose>
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
                  <DrawerClose asChild>
                    <Button
                      variant="outline"
                      onClick={handleSignOut}
                      className="w-full text-christmas-red-600 border-christmas-red-300 hover:bg-christmas-red-50 hover:border-christmas-red-400"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </DrawerClose>
                </div>
              ) : (
                <DrawerClose asChild>
                  <Button
                    onClick={onAuthClick}
                    className="w-full bg-christmas-red-600 hover:bg-christmas-red-700 text-white"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Sign In to Adopt
                  </Button>
                </DrawerClose>
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
