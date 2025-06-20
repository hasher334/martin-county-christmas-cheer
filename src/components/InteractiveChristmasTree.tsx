
import { useState, useEffect, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { ChildProfileModal } from "@/components/ChildProfileModal";
import type { Tables } from "@/integrations/supabase/types";

type Child = Tables<"children">;

interface InteractiveChristmasTreeProps {
  children: Child[];
  onAdopt: (childId: string) => void;
  user: any;
}

export const InteractiveChristmasTree = ({ children, onAdopt, user }: InteractiveChristmasTreeProps) => {
  const [twinkle, setTwinkle] = useState(0);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Log the children data for debugging
  useEffect(() => {
    console.log("InteractiveChristmasTree received children:", children.length);
    console.log("Children data:", children);
  }, [children]);

  useEffect(() => {
    console.log("InteractiveChristmasTree mobile optimization active");
    
    // Reduced animation frequency for mobile performance
    const isMobile = window.innerWidth < 768;
    const animationInterval = isMobile ? 3000 : 2000;
    
    const interval = setInterval(() => {
      setTwinkle(prev => (prev + 1) % 4);
    }, animationInterval);
    
    return () => clearInterval(interval);
  }, []);

  const handleOrnamentClick = useCallback((child: Child) => {
    console.log("Ornament clicked:", child.name);
    setSelectedChild(child);
    setShowModal(true);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  // Memoized ornament colors and positions for performance
  const ornamentColors = useMemo(() => [
    "#dc2626", "#f59e0b", "#2563eb", "#7c3aed", 
    "#db2777", "#059669", "#ea580c", "#b91c1c",
    "#3b82f6", "#d97706", "#8b5cf6", "#e11d48"
  ], []);

  const ornamentPositions = useMemo(() => [
    // Top section
    { x: 50, y: 19 }, { x: 56, y: 23 }, { x: 44, y: 23 },
    // Upper middle section
    { x: 40, y: 28 }, { x: 60, y: 28 }, { x: 50, y: 32 },
    { x: 37, y: 36 }, { x: 63, y: 36 },
    // Lower middle section
    { x: 35, y: 43 }, { x: 65, y: 43 }, { x: 45, y: 47 }, { x: 55, y: 47 },
    // Bottom section
    { x: 32, y: 54 }, { x: 68, y: 54 }, { x: 42, y: 58 }, { x: 58, y: 58 }
  ], []);

  // Limit children for mobile performance
  const displayChildren = useMemo(() => {
    const isMobile = window.innerWidth < 768;
    return children.slice(0, isMobile ? 12 : 16);
  }, [children]);

  // Show debug info if no children
  if (children.length === 0) {
    return (
      <div className="relative bg-gradient-to-b from-slate-300 via-slate-200 to-white mobile-optimized no-horizontal-scroll">
        <div className="relative z-10 flex flex-col items-center justify-center py-8 md:py-12 mobile-optimized">
          <div className="relative w-full max-w-4xl mx-auto px-4">
            <div className="text-center p-8 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-lg font-semibold text-yellow-800 mb-2">No Children Data Available</p>
              <p className="text-yellow-700">Waiting for children profiles to load...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-b from-slate-300 via-slate-200 to-white mobile-optimized no-horizontal-scroll">
      {/* Simplified static background for mobile performance */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-slate-100 to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-slate-400 via-slate-300 to-transparent opacity-40"></div>
        
        {/* Static snowflakes - desktop only */}
        <div className="hidden lg:block">
          {[...Array(15)].map((_, i) => (
            <div
              key={`snow-${i}`}
              className="absolute w-1.5 h-1.5 bg-white rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center py-8 md:py-12 mobile-optimized">
        <div className="relative w-full max-w-4xl mx-auto px-4">
          {/* Christmas Tree Image with loading optimization */}
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

            {/* Interactive Ornaments - Mobile optimized */}
            {imageLoaded && displayChildren.length > 0 && displayChildren.map((child, index) => {
              const position = ornamentPositions[index] || ornamentPositions[0];
              
              return (
                <button
                  key={child.id}
                  onClick={() => handleOrnamentClick(child)}
                  className={cn(
                    "absolute rounded-full shadow-lg z-30 cursor-pointer touch-optimized",
                    "border-2 border-white/80 transition-opacity duration-300",
                    // Mobile-first sizing with better touch targets
                    "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14",
                    // Reduced hover effects for mobile performance
                    "md:hover:scale-125 md:hover:shadow-xl md:hover:z-40",
                    // Simplified animation
                    (twinkle + index) % 4 === 0 ? "opacity-95" : "opacity-80"
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

            {/* Debug info for development */}
            {imageLoaded && displayChildren.length === 0 && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 p-4 rounded-lg">
                <p className="text-sm text-gray-700">No ornaments to display</p>
                <p className="text-xs text-gray-500">Children count: {children.length}</p>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Instructions - Mobile optimized */}
        <div className="relative z-20 mt-8 md:mt-12 text-center max-w-3xl px-4 md:px-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 md:p-6 lg:p-8 border border-white/30 shadow-lg">
            <p className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4 lg:mb-6 text-red-600 font-christmas">
              ✨ Click any ornament to meet a child ✨
            </p>
            <p className="text-sm md:text-base lg:text-lg xl:text-xl text-slate-700 leading-relaxed font-medium font-nunito">
              Each sparkling ornament represents a child hoping for Christmas magic. 
              Discover their story and help make their holiday dreams come true!
            </p>
            {displayChildren.length > 0 && (
              <p className="text-sm text-slate-600 mt-2">
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
