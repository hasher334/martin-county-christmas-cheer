
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Home, Gift, UserPlus, Heart, User, LogOut, Settings, X } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onAuthClick: () => void;
  onLogout: () => void;
  onAdminAccess: () => void;
}

export const MobileMenu = ({ 
  isOpen, 
  onClose, 
  user, 
  onAuthClick, 
  onLogout, 
  onAdminAccess 
}: MobileMenuProps) => {
  const handleNavigation = (href: string) => {
    window.location.href = href;
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[300px] bg-gradient-to-b from-christmas-cream to-white">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-xl">🎄</div>
              <SheetTitle className="text-christmas-green-800 font-christmas">
                Candy Cane Kindness
              </SheetTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-christmas-green-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <SheetDescription className="text-christmas-brown-600 font-nunito">
            Spreading Christmas joy throughout our community
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 mt-6">
          {/* Navigation Links */}
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-christmas-green-700 hover:bg-christmas-green-50"
              onClick={() => handleNavigation("/")}
            >
              <Home className="h-5 w-5 mr-3" />
              Home
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start text-christmas-green-700 hover:bg-christmas-green-50"
              onClick={() => handleNavigation("/wishlists")}
            >
              <Gift className="h-5 w-5 mr-3" />
              Wishlists
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start text-christmas-green-700 hover:bg-christmas-green-50"
              onClick={() => handleNavigation("/register")}
            >
              <UserPlus className="h-5 w-5 mr-3" />
              Register Child
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start text-christmas-green-700 hover:bg-christmas-green-50"
              onClick={() => handleNavigation("/about")}
            >
              <Heart className="h-5 w-5 mr-3" />
              About
            </Button>
          </div>

          {/* Divider */}
          <div className="border-t border-christmas-green-200 my-4"></div>

          {/* Auth Section */}
          <div className="space-y-2">
            {user ? (
              <>
                <Button
                  variant="outline"
                  className="w-full justify-start border-christmas-green-600 text-christmas-green-700 hover:bg-christmas-green-50"
                  onClick={() => {
                    onAdminAccess();
                    onClose();
                  }}
                >
                  <Settings className="h-5 w-5 mr-3" />
                  Admin Panel
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start border-christmas-red-600 text-christmas-red-700 hover:bg-christmas-red-50"
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="w-full justify-start border-christmas-green-600 text-christmas-green-700 hover:bg-christmas-green-50"
                  onClick={() => {
                    onAuthClick();
                    onClose();
                  }}
                >
                  <User className="h-5 w-5 mr-3" />
                  Login
                </Button>
                
                <Button
                  className="w-full justify-start bg-christmas-red-600 hover:bg-christmas-red-700 text-white"
                  onClick={() => {
                    onAuthClick();
                    onClose();
                  }}
                >
                  <UserPlus className="h-5 w-5 mr-3" />
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
