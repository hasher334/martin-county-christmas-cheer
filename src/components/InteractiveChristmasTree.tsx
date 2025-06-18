
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

  // Repositioned ornaments to match the tree structure - positioned on actual branches
  const ornamentPositions = [
    // Top star area (just below the star)
    { x: 50, y: 15 },
    // Upper section branches
    { x: 42, y: 22 }, { x: 58, y: 24 },
    // Second tier branches
    { x: 38, y: 30 }, { x: 50, y: 32 }, { x: 62, y: 31 },
    // Third tier branches  
    { x: 35, y: 38 }, { x: 48, y: 40 }, { x: 65, y: 39 },
    // Fourth tier branches
    { x: 32, y: 46 }, { x: 45, y: 48 }, { x: 55, y: 49 }, { x: 68, y: 47 },
    // Fifth tier branches
    { x: 30, y: 54 }, { x: 42, y: 56 }, { x: 58, y: 57 }, { x: 70, y: 55 }
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

      <div className="relative z-10 flex flex-col items-center justify-center py-12 px-4">
        {/* Responsive Tree Container */}
        <div className="relative w-full max-w-4xl mx-auto">
          {/* Christmas Tree Image - Responsive */}
          <div className="relative w-full aspect-[4/5] max-w-[800px] mx-auto">
            <img 
              src="/lovable-uploads/9b7c78e5-e2e5-4e1d-9ff0-05333593d9f4.png"
              alt="Christmas Tree"
              className="w-full h-full object-contain drop-shadow-2xl"
            />

            {/* Interactive Ornaments positioned responsively */}
            {children.slice(0, 16).map((child, index) => {
              const position = ornamentPositions[index] || ornamentPositions[0];
              
              return (
                <button
                  key={child.id}
                  onClick={() => handleOrnamentClick(child)}
                  className={cn(
                    "absolute rounded-full shadow-xl transition-all duration-300 z-30 cursor-pointer",
                    "hover:scale-150 hover:shadow-2xl transform-gpu hover:z-40",
                    (twinkle + index) % 4 === 0 ? "animate-pulse scale-110" : "",
                    "hover:animate-bounce border-2 border-white/80",
                    // Responsive sizing
                    "w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
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
                  <div className="absolute inset-1 sm:inset-1.5 rounded-full border border-white/20"></div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Enhanced Instructions with winter theme */}
        <div className="relative z-20 mt-8 sm:mt-12 text-center max-w-3xl px-6">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 sm:p-8 border border-white/30 shadow-xl">
            <p className={cn(
              "text-xl sm:text-2xl md:text-3xl font-bold transition-all duration-500 mb-4 sm:mb-6",
              twinkle % 2 === 0 ? "text-yellow-400 scale-105 drop-shadow-lg" : "text-red-600 scale-100"
            )}>
              ✨ Click any ornament to meet a child ✨
            </p>
            <p className="text-base sm:text-lg md:text-xl text-slate-700 leading-relaxed font-medium">
              Each sparkling ornament represents a child hoping for Christmas magic. 
              Discover their story and help make their holiday dreams come true!
            </p>
            <div className="mt-4 sm:mt-6 flex justify-center space-x-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300",
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
