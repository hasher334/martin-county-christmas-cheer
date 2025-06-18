
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
    const interval = setInterval(() => {
      setTwinkle(prev => (prev + 1) % 4);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleOrnamentClick = (child: Child) => {
    setSelectedChild(child);
    setShowModal(true);
  };

  const ornamentColors = [
    "#dc2626", "#f59e0b", "#2563eb", "#7c3aed", 
    "#db2777", "#059669", "#ea580c", "#b91c1c",
    "#3b82f6", "#d97706", "#8b5cf6", "#e11d48"
  ];

  // More uniformly distributed ornament positions across the entire tree
  const ornamentPositions = [
    // Top tier (narrow)
    { x: 50, y: 20 }, { x: 47, y: 22 }, { x: 53, y: 22 },
    
    // Upper-middle tier (wider)
    { x: 43, y: 26 }, { x: 57, y: 26 }, { x: 50, y: 28 },
    { x: 40, y: 30 }, { x: 60, y: 30 },
    
    // Middle tier (wider still)
    { x: 37, y: 34 }, { x: 63, y: 34 }, { x: 45, y: 36 }, 
    { x: 55, y: 36 }, { x: 50, y: 38 },
    
    // Lower-middle tier (getting wider)
    { x: 34, y: 42 }, { x: 66, y: 42 }, { x: 42, y: 44 },
    { x: 58, y: 44 }, { x: 38, y: 46 }, { x: 62, y: 46 },
    
    // Bottom tier (widest part)
    { x: 31, y: 50 }, { x: 69, y: 50 }, { x: 40, y: 52 },
    { x: 60, y: 52 }, { x: 35, y: 54 }, { x: 65, y: 54 },
    { x: 45, y: 56 }, { x: 55, y: 56 }, { x: 50, y: 58 },
    
    // Lower bottom tier (very wide)
    { x: 28, y: 60 }, { x: 72, y: 60 }, { x: 33, y: 62 },
    { x: 67, y: 62 }, { x: 38, y: 64 }, { x: 62, y: 64 }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-300 via-slate-200 to-white overflow-hidden">
      {/* Winter Wonderland Background */}
      <div className="absolute inset-0">
        {/* Falling Snow Animation */}
        {[...Array(100)].map((_, i) => (
          <div
            key={`snow-${i}`}
            className="absolute w-2 h-2 bg-white rounded-full opacity-80 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
              transform: `scale(${0.3 + Math.random() * 0.8})`,
            }}
          />
        ))}

        {/* Larger Snow Flakes */}
        {[...Array(30)].map((_, i) => (
          <div
            key={`snowflake-${i}`}
            className="absolute text-white animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
              fontSize: `${8 + Math.random() * 8}px`,
            }}
          >
            ❄
          </div>
        ))}

        {/* Ground Snow Drifts */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-slate-100 to-transparent"></div>
        
        {/* Snow Clouds in Background */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-slate-400 via-slate-300 to-transparent opacity-60"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center py-12">
        <div className="relative w-full max-w-4xl mx-auto px-4">
          {/* Christmas Tree Image - Responsive Container */}
          <div className="relative w-full">
            <img 
              src="/lovable-uploads/9b7c78e5-e2e5-4e1d-9ff0-05333593d9f4.png"
              alt="Christmas Tree"
              className="w-full h-auto max-w-[800px] mx-auto drop-shadow-2xl"
            />

            {/* Interactive Ornaments with uniform distribution */}
            {children.map((child, index) => {
              // Use modulo to cycle through positions if we have more children than positions
              const position = ornamentPositions[index % ornamentPositions.length];
              
              return (
                <button
                  key={child.id}
                  onClick={() => handleOrnamentClick(child)}
                  className={cn(
                    "absolute rounded-full shadow-xl transition-all duration-300 z-30 cursor-pointer",
                    "hover:scale-150 hover:shadow-2xl transform-gpu hover:z-40",
                    (twinkle + index) % 4 === 0 ? "animate-pulse scale-110" : "",
                    "border-2 border-white/80",
                    // Responsive sizing
                    "w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
                  )}
                  style={{
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                    transform: `translate(-50%, -50%)`,
                    backgroundColor: ornamentColors[index % ornamentColors.length],
                    boxShadow: `0 6px 20px ${ornamentColors[index % ornamentColors.length]}40, 0 0 15px ${ornamentColors[index % ornamentColors.length]}30`
                  }}
                  title={`Click to meet ${child.name}`}
                >
                  <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/60 to-transparent"></div>
                  <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white/90 rounded-full"></div>
                  <div className="absolute inset-1.5 rounded-full border border-white/20"></div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Enhanced Instructions with winter theme */}
        <div className="relative z-20 mt-12 text-center max-w-3xl px-6">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 border border-white/30 shadow-xl">
            <p className={cn(
              "text-2xl sm:text-3xl font-bold transition-all duration-500 mb-6",
              twinkle % 2 === 0 ? "text-yellow-400 scale-105 drop-shadow-lg" : "text-red-600 scale-100"
            )}>
              ✨ Click any ornament to meet a child ✨
            </p>
            <p className="text-lg sm:text-xl text-slate-700 leading-relaxed font-medium">
              Each sparkling ornament represents a child hoping for Christmas magic. 
              Discover their story and help make their holiday dreams come true!
            </p>
            <div className="mt-6 flex justify-center space-x-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all duration-300",
                    (twinkle + i) % 5 === 0 ? "bg-yellow-400 scale-125" : "bg-red-500/70"
                  )}
                />
              ))}
            </div>
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
