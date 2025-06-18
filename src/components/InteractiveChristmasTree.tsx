
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
    "#ef4444", "#f59e0b", "#3b82f6", "#8b5cf6", 
    "#ec4899", "#10b981", "#f97316", "#dc2626",
    "#60a5fa", "#fbbf24", "#a78bfa", "#f472b6"
  ];

  // Position ornaments naturally on the tree branches
  const ornamentPositions = [
    { x: 400, y: 180 }, // Top section
    { x: 370, y: 210 }, { x: 430, y: 210 },
    { x: 350, y: 250 }, { x: 450, y: 250 }, { x: 400, y: 270 },
    { x: 330, y: 300 }, { x: 470, y: 300 }, { x: 380, y: 320 }, { x: 420, y: 320 },
    { x: 310, y: 360 }, { x: 490, y: 360 }
  ];

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative">
        <svg 
          width="800" 
          height="600" 
          viewBox="0 0 800 600" 
          className="drop-shadow-2xl"
        >
          {/* Tree Shadow */}
          <ellipse 
            cx="400" 
            cy="580" 
            rx="120" 
            ry="15" 
            fill="rgba(0,0,0,0.2)"
          />
          
          {/* Tree Trunk */}
          <rect 
            x="380" 
            y="480" 
            width="40" 
            height="80" 
            fill="#8B4513"
            rx="5"
          />
          <rect 
            x="375" 
            y="560" 
            width="50" 
            height="20" 
            fill="#654321"
            rx="10"
          />
          
          {/* Tree Layers - Bottom to Top for proper layering */}
          
          {/* Bottom Layer */}
          <path 
            d="M 400 380 L 300 480 L 500 480 Z" 
            fill="#0F5132"
            stroke="#0A4026"
            strokeWidth="2"
          />
          <path 
            d="M 400 390 L 320 470 L 480 470 L 400 390" 
            fill="#198754"
            opacity="0.8"
          />
          
          {/* Middle Layer */}
          <path 
            d="M 400 300 L 320 420 L 480 420 Z" 
            fill="#0F5132"
            stroke="#0A4026"
            strokeWidth="2"
          />
          <path 
            d="M 400 310 L 340 410 L 460 410 L 400 310" 
            fill="#198754"
            opacity="0.8"
          />
          
          {/* Upper Layer */}
          <path 
            d="M 400 220 L 340 360 L 460 360 Z" 
            fill="#0F5132"
            stroke="#0A4026"
            strokeWidth="2"
          />
          <path 
            d="M 400 230 L 360 350 L 440 350 L 400 230" 
            fill="#198754"
            opacity="0.8"
          />
          
          {/* Top Layer */}
          <path 
            d="M 400 140 L 360 280 L 440 280 Z" 
            fill="#0F5132"
            stroke="#0A4026"
            strokeWidth="2"
          />
          <path 
            d="M 400 150 L 380 270 L 420 270 L 400 150" 
            fill="#198754"
            opacity="0.8"
          />

          {/* Tree Star */}
          <g transform="translate(400, 120)">
            <path 
              d="M 0 -20 L 6 -6 L 20 -6 L 10 2 L 16 16 L 0 8 L -16 16 L -10 2 L -20 -6 L -6 -6 Z"
              fill="#FFD700"
              stroke="#FFA500"
              strokeWidth="2"
              className={cn(
                "transition-all duration-500 drop-shadow-lg",
                twinkle % 2 === 0 ? "scale-110 drop-shadow-2xl" : "scale-100"
              )}
            />
            <circle cx="0" cy="0" r="3" fill="#FFF" opacity="0.8" />
          </g>

          {/* Decorative String Lights */}
          {[...Array(24)].map((_, i) => {
            const angle = (i / 24) * Math.PI * 2;
            const radius = 80 + (i % 3) * 20;
            const x = 400 + Math.cos(angle) * (radius - Math.abs(Math.sin(angle * 3)) * 30);
            const y = 200 + Math.sin(angle) * 20 + (i % 4) * 60;
            
            return (
              <circle
                key={`light-${i}`}
                cx={x}
                cy={y}
                r="4"
                fill={i % 3 === 0 ? "#FFD700" : i % 3 === 1 ? "#FF4444" : "#4444FF"}
                className={cn(
                  "transition-all duration-300",
                  (twinkle + i) % 4 === 0 ? "animate-pulse opacity-100" : "opacity-70"
                )}
              />
            );
          })}

          {/* Tree Texture Lines */}
          {[...Array(8)].map((_, i) => (
            <path
              key={`texture-${i}`}
              d={`M ${350 + i * 10} ${200 + i * 40} Q ${400} ${180 + i * 40} ${450 - i * 10} ${200 + i * 40}`}
              stroke="#0A4026"
              strokeWidth="1"
              fill="none"
              opacity="0.3"
            />
          ))}
        </svg>

        {/* Interactive Ornaments positioned on the SVG tree */}
        {children.slice(0, 12).map((child, index) => {
          const position = ornamentPositions[index] || ornamentPositions[0];
          
          return (
            <button
              key={child.id}
              onClick={() => handleOrnamentClick(child)}
              className={cn(
                "absolute w-8 h-8 rounded-full shadow-lg transition-all duration-300 z-30 cursor-pointer",
                "hover:scale-125 hover:shadow-xl transform-gpu",
                (twinkle + index) % 4 === 0 ? "animate-pulse scale-110" : "",
                "hover:animate-bounce border-2 border-white/50"
              )}
              style={{
                left: `${position.x - 16}px`,
                top: `${position.y - 16}px`,
                backgroundColor: ornamentColors[index % ornamentColors.length],
                boxShadow: `0 4px 12px ${ornamentColors[index % ornamentColors.length]}40`
              }}
              title={`Click to meet ${child.name}`}
            >
              <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/60 to-transparent"></div>
              <div className="absolute top-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white/80 rounded-full"></div>
            </button>
          );
        })}
      </div>

      {/* Instructions */}
      <div className="mt-8 text-center max-w-2xl">
        <p className={cn(
          "text-2xl font-bold transition-all duration-500 mb-4",
          twinkle % 2 === 0 ? "text-green-600 scale-105" : "text-red-600 scale-100"
        )}>
          ✨ Click any ornament to meet a child ✨
        </p>
        <p className="text-lg text-gray-600">
          Each sparkling ornament represents a child hoping for Christmas magic. 
          Discover their story and help make their holiday dreams come true!
        </p>
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
  );
};
