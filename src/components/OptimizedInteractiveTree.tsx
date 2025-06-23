
import { useState, useEffect, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { ChildProfileModal } from "@/components/ChildProfileModal";
import type { Tables } from "@/integrations/supabase/types";

type Child = Tables<"children">;

interface OptimizedInteractiveTreeProps {
  children: Child[];
  onAdopt: (childId: string) => void;
  user: any;
}

export const OptimizedInteractiveTree = ({ children, onAdopt, user }: OptimizedInteractiveTreeProps) => {
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleOrnamentClick = useCallback((child: Child) => {
    console.log("Ornament clicked:", child.name);
    setSelectedChild(child);
    setShowModal(true);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  // Optimized ornament colors and positions
  const ornamentColors = useMemo(() => [
    "#dc2626", "#f59e0b", "#2563eb", "#7c3aed", 
    "#db2777", "#059669", "#ea580c", "#b91c1c",
    "#3b82f6", "#d97706", "#8b5cf6", "#e11d48"
  ], []);

  const ornamentPositions = useMemo(() => [
    { x: 50, y: 19 }, { x: 56, y: 23 }, { x: 44, y: 23 },
    { x: 40, y: 28 }, { x: 60, y: 28 }, { x: 50, y: 32 },
    { x: 37, y: 36 }, { x: 63, y: 36 },
    { x: 35, y: 43 }, { x: 65, y: 43 }, { x: 45, y: 47 }, { x: 55, y: 47 },
    { x: 32, y: 54 }, { x: 68, y: 54 }, { x: 42, y: 58 }, { x: 58, y: 58 }
  ], []);

  // Limit children for performance
  const displayChildren = useMemo(() => {
    return children.slice(0, 16);
  }, [children]);

  if (children.length === 0) {
    return (
      <div className="relative bg-gradient-to-b from-slate-300 via-slate-200 to-white">
        <div className="relative z-10 flex flex-col items-center justify-center py-12">
          <div className="text-center p-8 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md">
            <p className="text-lg font-semibold text-yellow-800 mb-2">Loading Children...</p>
            <p className="text-yellow-700">Please wait while we load the children profiles.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-b from-slate-300 via-slate-200 to-white">
      {/* Simplified background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-slate-100 to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-slate-400 via-slate-300 to-transparent opacity-40"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center py-12">
        <div className="relative w-full max-w-4xl mx-auto px-4">
          {/* Christmas Tree Image */}
          <div className="relative w-full">
            {!imageLoaded && (
              <div className="w-full h-96 bg-christmas-green-100 animate-pulse rounded-lg flex items-center justify-center">
                <p className="text-christmas-green-600 font-christmas">Loading Christmas Tree...</p>
              </div>
            )}
            
            <img 
              src="/lovable-uploads/9b7c78e5-e2e5-4e1d-9ff0-05333593d9f4.png"
              alt="Christmas Tree"
              className={cn(
                "w-full h-auto max-w-[800px] mx-auto drop-shadow-2xl transition-opacity duration-500",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              loading="lazy"
              onLoad={handleImageLoad}
            />

            {/* Interactive Ornaments */}
            {imageLoaded && displayChildren.map((child, index) => {
              const position = ornamentPositions[index] || ornamentPositions[0];
              
              return (
                <button
                  key={child.id}
                  onClick={() => handleOrnamentClick(child)}
                  className={cn(
                    "absolute rounded-full shadow-lg z-30 cursor-pointer",
                    "border-2 border-white/80 transition-transform duration-200",
                    "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14",
                    "hover:scale-110 hover:shadow-xl"
                  )}
                  style={{
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                    transform: `translate(-50%, -50%)`,
                    backgroundColor: ornamentColors[index % ornamentColors.length],
                  }}
                  title={`Click to meet ${child.name}`}
                  aria-label={`Meet ${child.name}`}
                >
                  <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/50 to-transparent"></div>
                  <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 md:w-1.5 md:h-1.5 bg-white/90 rounded-full"></div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Instructions */}
        <div className="relative z-20 mt-12 text-center max-w-3xl px-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border border-white/30 shadow-lg">
            <p className="text-3xl font-bold mb-6 text-red-600 font-christmas">
              ✨ Click any ornament to meet a child ✨
            </p>
            <p className="text-xl text-slate-700 leading-relaxed font-medium font-nunito">
              Each sparkling ornament represents a child hoping for Christmas magic. 
              Discover their story and help make their holiday dreams come true!
            </p>
            {displayChildren.length > 0 && (
              <p className="text-sm text-slate-600 mt-4">
                Showing {displayChildren.length} children ready for adoption
              </p>
            )}
          </div>
        </div>

        {/* Child Profile Modal */}
        {selectedChild && (
          <ChildProfileModal
            open={showModal}
            onOpenChange={setShowModal}
            child={selectedChild}
            onAdopt={onAdopt}
            user={user}
          />
        )}
      </div>
    </div>
  );
};
