
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

  // Positioned ornaments to match the tree structure in the image
  const ornamentPositions = [
    // Top section
    { x: 400, y: 150 }, { x: 450, y: 180 }, { x: 350, y: 180 },
    // Upper middle section
    { x: 320, y: 220 }, { x: 480, y: 220 }, { x: 400, y: 250 },
    { x: 300, y: 280 }, { x: 500, y: 280 },
    // Lower middle section
    { x: 280, y: 340 }, { x: 520, y: 340 }, { x: 360, y: 370 }, { x: 440, y: 370 },
    // Bottom section
    { x: 260, y: 420 }, { x: 540, y: 420 }, { x: 340, y: 450 }, { x: 460, y: 450 }
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
        <div className="relative">
          {/* Christmas Tree Image */}
          <img 
            src="/lovable-uploads/9b7c78e5-e2e5-4e1d-9ff0-05333593d9f4.png"
            alt="Christmas Tree"
            className="w-[800px] h-auto drop-shadow-2xl"
          />

          {/* Interactive Ornaments positioned on the tree image */}
          {children.slice(0, 16).map((child, index) => {
            const position = ornamentPositions[index] || ornamentPositions[0];
            
            return (
              <button
                key={child.id}
                onClick={() => handleOrnamentClick(child)}
                className={cn(
                  "absolute w-10 h-10 rounded-full shadow-xl transition-all duration-300 z-30 cursor-pointer",
                  "hover:scale-150 hover:shadow-2xl transform-gpu hover:z-40",
                  (twinkle + index) % 4 === 0 ? "animate-pulse scale-110" : "",
                  "hover:animate-bounce border-2 border-white/80"
                )}
                style={{
                  left: `${position.x - 20}px`,
                  top: `${position.y - 20}px`,
                  backgroundColor: ornamentColors[index % ornamentColors.length],
                  boxShadow: `0 6px 20px ${ornamentColors[index % ornamentColors.length]}40, 0 0 15px ${ornamentColors[index % ornamentColors.length]}30`
                }}
                title={`Click to meet ${child.name}`}
              >
                <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/60 to-transparent"></div>
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white/90 rounded-full"></div>
                <div className="absolute inset-1.5 rounded-full border border-white/20"></div>
              </button>
            );
          })}
        </div>

        {/* Enhanced Instructions with winter theme */}
        <div className="relative z-20 mt-12 text-center max-w-3xl px-6">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 border border-white/30 shadow-xl">
            <p className={cn(
              "text-3xl font-bold transition-all duration-500 mb-6",
              twinkle % 2 === 0 ? "text-yellow-400 scale-105 drop-shadow-lg" : "text-red-600 scale-100"
            )}>
              ✨ Click any ornament to meet a child ✨
            </p>
            <p className="text-xl text-slate-700 leading-relaxed font-medium">
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
