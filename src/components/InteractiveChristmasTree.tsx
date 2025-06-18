
import { useState, useEffect } from "react";
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

  useEffect(() => {
    console.log("InteractiveChristmasTree mounted");
    
    const interval = setInterval(() => {
      setTwinkle(prev => (prev + 1) % 4);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleOrnamentClick = (child: Child) => {
    console.log("Ornament clicked:", child.name);
    setSelectedChild(child);
    setShowModal(true);
  };

  const ornamentColors = [
    "#dc2626", "#f59e0b", "#2563eb", "#7c3aed", 
    "#db2777", "#059669", "#ea580c", "#b91c1c",
    "#3b82f6", "#d97706", "#8b5cf6", "#e11d48"
  ];

  // Responsive ornament positions using percentages relative to the tree image
  const ornamentPositions = [
    // Top section
    { x: 50, y: 19 }, { x: 56, y: 23 }, { x: 44, y: 23 },
    // Upper middle section
    { x: 40, y: 28 }, { x: 60, y: 28 }, { x: 50, y: 32 },
    { x: 37, y: 36 }, { x: 63, y: 36 },
    // Lower middle section
    { x: 35, y: 43 }, { x: 65, y: 43 }, { x: 45, y: 47 }, { x: 55, y: 47 },
    // Bottom section
    { x: 32, y: 54 }, { x: 68, y: 54 }, { x: 42, y: 58 }, { x: 58, y: 58 }
  ];

  return (
    <div className="relative bg-gradient-to-b from-slate-300 via-slate-200 to-white mobile-scroll-fix">
      {/* Simplified Winter Background - Removed complex animations that could interfere with scrolling */}
      <div className="absolute inset-0 overflow-hidden decorative-only">
        {/* Static Snow Pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-slate-100 to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-slate-400 via-slate-300 to-transparent opacity-60"></div>
        
        {/* Simple static snowflakes - no animation on mobile */}
        {window.innerWidth >= 768 && [...Array(30)].map((_, i) => (
          <div
            key={`snow-${i}`}
            className="absolute w-2 h-2 bg-white rounded-full opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center py-12">
        <div className="relative w-full max-w-4xl mx-auto px-4">
          {/* Christmas Tree Image - Responsive Container */}
          <div className="relative w-full">
            <img 
              src="/lovable-uploads/9b7c78e5-e2e5-4e1d-9ff0-05333593d9f4.png"
              alt="Christmas Tree"
              className="w-full h-auto max-w-[800px] mx-auto drop-shadow-2xl"
              loading="lazy"
            />

            {/* Interactive Ornaments with simplified mobile interactions */}
            {children.slice(0, 16).map((child, index) => {
              const position = ornamentPositions[index] || ornamentPositions[0];
              
              return (
                <button
                  key={child.id}
                  onClick={() => handleOrnamentClick(child)}
                  className={cn(
                    "absolute rounded-full shadow-xl z-30 cursor-pointer",
                    "border-2 border-white/80",
                    // Simplified animations and larger touch targets for mobile
                    "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14",
                    // Only animate on desktop to prevent mobile performance issues
                    window.innerWidth >= 768 ? "transition-all duration-300 hover:scale-150 hover:shadow-2xl transform-gpu hover:z-40" : "",
                    (twinkle + index) % 4 === 0 ? "opacity-90" : "opacity-80"
                  )}
                  style={{
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                    transform: `translate(-50%, -50%)`,
                    backgroundColor: ornamentColors[index % ornamentColors.length],
                    touchAction: 'manipulation',
                  }}
                  title={`Click to meet ${child.name}`}
                  aria-label={`Meet ${child.name}`}
                >
                  <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/60 to-transparent"></div>
                  <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white/90 rounded-full"></div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Enhanced Instructions with simplified animations */}
        <div className="relative z-20 mt-12 text-center max-w-3xl px-6">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 border border-white/30 shadow-xl">
            <p className="text-2xl sm:text-3xl font-bold mb-6 text-red-600">
              ✨ Click any ornament to meet a child ✨
            </p>
            <p className="text-lg sm:text-xl text-slate-700 leading-relaxed font-medium">
              Each sparkling ornament represents a child hoping for Christmas magic. 
              Discover their story and help make their holiday dreams come true!
            </p>
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
