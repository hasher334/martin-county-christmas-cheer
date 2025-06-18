
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdoptionDialog } from "@/components/AdoptionDialog";
import { Heart, Gift, MapPin, Calendar, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tables } from "@/integrations/supabase/types";

type Child = Tables<"children">;

interface ChildProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  child: Child;
  onAdopt: (childId: string) => void;
  user: any;
}

export const ChildProfileModal = ({ open, onOpenChange, child, onAdopt, user }: ChildProfileModalProps) => {
  const [showAdoptDialog, setShowAdoptDialog] = useState(false);

  const handleAdoptClick = () => {
    if (!user) {
      onAdopt(child.id);
      return;
    }
    setShowAdoptDialog(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-red-50 via-white to-green-50 border-4 border-red-200">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-green-800 flex items-center justify-center">
              <Sparkles className="h-8 w-8 mr-3 text-yellow-500" />
              Meet {child.name}
              <Sparkles className="h-8 w-8 ml-3 text-yellow-500" />
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 animate-fade-in">
            {/* Child Photo/Avatar */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-green-100 to-red-100 flex items-center justify-center border-4 border-red-300 shadow-xl">
                  {child.photo_url ? (
                    <img 
                      src={child.photo_url} 
                      alt={child.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="text-8xl">
                      {child.gender === 'Female' ? '👧' : '👦'}
                    </div>
                  )}
                </div>
                <div className="absolute -top-2 -right-2">
                  <Badge className="bg-green-500 text-white text-sm px-3 py-1">Available</Badge>
                </div>
                {/* Floating hearts animation */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <Heart
                      key={i}
                      className={cn(
                        "absolute w-4 h-4 text-red-400 animate-pulse",
                        "opacity-70"
                      )}
                      style={{
                        top: `${20 + Math.random() * 60}%`,
                        left: `${20 + Math.random() * 60}%`,
                        animationDelay: `${i * 0.5}s`,
                        animationDuration: "2s"
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Child Information */}
            <div className="bg-white rounded-lg p-6 border-2 border-green-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-green-800">{child.name}</h3>
                <div className="flex items-center space-x-4 text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span className="font-medium">{child.age} years old</span>
                  </div>
                  {child.location && (
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>{child.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {child.story && (
                <div className="mb-6">
                  <h4 className="font-semibold text-green-700 mb-3 text-lg">Their Story:</h4>
                  <p className="text-gray-700 leading-relaxed text-lg">{child.story}</p>
                </div>
              )}

              {child.wishes && child.wishes.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-green-700 mb-3 flex items-center text-lg">
                    <Gift className="h-5 w-5 mr-2" />
                    Christmas Wishes:
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {child.wishes.map((wish, index) => (
                      <Badge 
                        key={index} 
                        className="bg-red-100 text-red-700 border-2 border-red-200 px-3 py-1 text-sm font-medium hover:bg-red-200 transition-colors"
                      >
                        🎁 {wish}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-red-100 to-green-100 rounded-lg p-6 border-2 border-yellow-300">
              <div className="text-center mb-4">
                <h4 className="text-xl font-bold text-green-800 mb-2">
                  🎄 Make {child.name}'s Christmas Magical! 🎄
                </h4>
                <p className="text-gray-700">
                  By adopting {child.name} for Christmas, you'll bring joy and wonder to their holiday season. 
                  Your kindness will create memories that last a lifetime!
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1 border-2 border-gray-300 hover:bg-gray-50"
                >
                  Maybe Later
                </Button>
                <Button
                  onClick={handleAdoptClick}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Adopt {child.name} for Christmas
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AdoptionDialog
        open={showAdoptDialog}
        onOpenChange={setShowAdoptDialog}
        child={child}
        user={user}
      />
    </>
  );
};
