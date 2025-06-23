
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Gift, MapPin, Calendar } from "lucide-react";
import { AdoptionDialog } from "@/components/AdoptionDialog";
import type { Tables } from "@/integrations/supabase/types";

type Child = Tables<"children">;

interface OptimizedChildCardProps {
  child: Child;
  onAdopt: (childId: string) => void;
  user: any;
}

export const OptimizedChildCard = ({ child, onAdopt, user }: OptimizedChildCardProps) => {
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
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 bg-gradient-to-b from-white to-red-50 border border-red-100">
        <div className="relative">
          <div className="h-48 bg-gradient-to-br from-green-100 to-red-100 flex items-center justify-center">
            {child.photo_url ? (
              <img 
                src={child.photo_url} 
                alt={child.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="text-6xl">
                {child.gender === 'Female' ? '👧' : '👦'}
              </div>
            )}
          </div>
          <div className="absolute top-2 right-2">
            <Badge className="bg-green-500 text-white text-xs">Available</Badge>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-green-800 truncate">{child.name}</h3>
            <div className="flex items-center text-gray-600 text-sm">
              <Calendar className="h-3 w-3 mr-1" />
              {child.age}
            </div>
          </div>

          {child.location && (
            <div className="flex items-center text-gray-600 text-sm mb-2">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="truncate">{child.location}</span>
            </div>
          )}

          {child.story && (
            <p className="text-gray-700 text-sm mb-3 line-clamp-2">
              {child.story.length > 100 ? `${child.story.substring(0, 100)}...` : child.story}
            </p>
          )}

          {child.wishes && child.wishes.length > 0 && (
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-green-700 mb-2 flex items-center">
                <Gift className="h-3 w-3 mr-1" />
                Wishes:
              </h4>
              <div className="flex flex-wrap gap-1">
                {child.wishes.slice(0, 2).map((wish, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="text-xs bg-red-50 text-red-700 border-red-200 truncate max-w-20"
                  >
                    {wish.length > 15 ? `${wish.substring(0, 15)}...` : wish}
                  </Badge>
                ))}
                {child.wishes.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{child.wishes.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            onClick={handleAdoptClick}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-full transition-colors duration-200"
            size="sm"
          >
            <Heart className="h-4 w-4 mr-2" />
            Adopt for Christmas
          </Button>
        </CardFooter>
      </Card>

      <AdoptionDialog
        open={showAdoptDialog}
        onOpenChange={setShowAdoptDialog}
        child={child}
        user={user}
      />
    </>
  );
};
