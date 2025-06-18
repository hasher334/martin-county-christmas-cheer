
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

  // Better positioned ornaments for the realistic tree shape
  const ornamentPositions = [
    // Top section
    { x: 500, y: 200 }, { x: 480, y: 230 }, { x: 520, y: 230 },
    // Upper middle section
    { x: 460, y: 280 }, { x: 540, y: 280 }, { x: 500, y: 310 },
    { x: 440, y: 340 }, { x: 560, y: 340 },
    // Lower middle section
    { x: 420, y: 390 }, { x: 580, y: 390 }, { x: 480, y: 420 }, { x: 520, y: 420 },
    // Bottom section
    { x: 400, y: 470 }, { x: 600, y: 470 }, { x: 460, y: 500 }, { x: 540, y: 500 }
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
          <svg 
            width="1000" 
            height="650" 
            viewBox="0 0 1000 650" 
            className="drop-shadow-2xl"
          >
            {/* Snow Ground */}
            <ellipse 
              cx="500" 
              cy="620" 
              rx="400" 
              ry="30" 
              fill="white"
              opacity="0.9"
            />
            
            {/* Tree Base/Stand - Red and White */}
            <rect 
              x="485" 
              y="580" 
              width="30" 
              height="40" 
              fill="#8B4513"
              rx="4"
            />
            <rect 
              x="470" 
              y="615" 
              width="60" 
              height="20" 
              fill="#dc2626"
              rx="10"
            />
            <rect 
              x="475" 
              y="618" 
              width="50" 
              height="14" 
              fill="white"
              rx="7"
            />

            {/* Tree Layers - More realistic conical shape like the reference */}
            
            {/* Bottom Layer - Largest */}
            <path 
              d="M 500 450 L 350 580 L 650 580 Z" 
              fill="#0d5016"
              stroke="#0a3d12"
              strokeWidth="2"
            />
            <path 
              d="M 500 460 L 370 570 L 630 570 Z" 
              fill="#165a1f"
              opacity="0.9"
            />
            
            {/* Second Layer */}
            <path 
              d="M 500 370 L 380 500 L 620 500 Z" 
              fill="#0d5016"
              stroke="#0a3d12"
              strokeWidth="2"
            />
            <path 
              d="M 500 380 L 400 490 L 600 490 Z" 
              fill="#165a1f"
              opacity="0.9"
            />
            
            {/* Third Layer */}
            <path 
              d="M 500 300 L 410 420 L 590 420 Z" 
              fill="#0d5016"
              stroke="#0a3d12"
              strokeWidth="2"
            />
            <path 
              d="M 500 310 L 430 410 L 570 410 Z" 
              fill="#165a1f"
              opacity="0.9"
            />
            
            {/* Fourth Layer */}
            <path 
              d="M 500 240 L 440 350 L 560 350 Z" 
              fill="#0d5016"
              stroke="#0a3d12"
              strokeWidth="2"
            />
            <path 
              d="M 500 250 L 460 340 L 540 340 Z" 
              fill="#165a1f"
              opacity="0.9"
            />

            {/* Top Layer */}
            <path 
              d="M 500 180 L 470 280 L 530 280 Z" 
              fill="#0d5016"
              stroke="#0a3d12"
              strokeWidth="2"
            />
            <path 
              d="M 500 190 L 485 270 L 515 270 Z" 
              fill="#165a1f"
              opacity="0.9"
            />

            {/* Decorative Garland - Golden strings */}
            <path 
              d="M 380 560 Q 440 540 500 550 Q 560 540 620 560" 
              stroke="#ffd700"
              strokeWidth="3"
              fill="none"
              opacity="0.9"
            />
            <path 
              d="M 400 480 Q 450 460 500 470 Q 550 460 600 480" 
              stroke="#ffd700"
              strokeWidth="3"
              fill="none"
              opacity="0.9"
            />
            <path 
              d="M 420 400 Q 460 380 500 390 Q 540 380 580 400" 
              stroke="#ffd700"
              strokeWidth="3"
              fill="none"
              opacity="0.9"
            />
            <path 
              d="M 450 330 Q 475 315 500 320 Q 525 315 550 330" 
              stroke="#ffd700"
              strokeWidth="3"
              fill="none"
              opacity="0.9"
            />
            <path 
              d="M 475 260 Q 487.5 250 500 255 Q 512.5 250 525 260" 
              stroke="#ffd700"
              strokeWidth="3"
              fill="none"
              opacity="0.9"
            />

            {/* Tree Star - Large and radiant like in reference */}
            <g transform="translate(500, 150)">
              <defs>
                <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fff" stopOpacity="1" />
                  <stop offset="50%" stopColor="#ffd700" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#ffa500" stopOpacity="0.6" />
                </radialGradient>
              </defs>
              
              {/* Star Glow Effect */}
              <circle 
                cx="0" 
                cy="0" 
                r="35" 
                fill="url(#starGlow)" 
                opacity="0.6"
                className={cn(
                  "transition-all duration-1000",
                  twinkle % 2 === 0 ? "scale-125 opacity-80" : "scale-100 opacity-60"
                )}
              />
              
              {/* Main Star */}
              <path 
                d="M 0 -25 L 7.5 -7.5 L 25 -7.5 L 12.5 2.5 L 20 20 L 0 10 L -20 20 L -12.5 2.5 L -25 -7.5 L -7.5 -7.5 Z"
                fill="#ffd700"
                stroke="#ffa500"
                strokeWidth="2"
                className={cn(
                  "transition-all duration-500 drop-shadow-2xl",
                  twinkle % 2 === 0 ? "scale-110 brightness-125" : "scale-100"
                )}
              />
              
              {/* Inner Star Light */}
              <path 
                d="M 0 -15 L 4.5 -4.5 L 15 -4.5 L 7.5 1.5 L 12 12 L 0 6 L -12 12 L -7.5 1.5 L -15 -4.5 L -4.5 -4.5 Z"
                fill="#fff"
                opacity="0.8"
              />
              
              {/* Center sparkle */}
              <circle cx="0" cy="0" r="3" fill="#fff" opacity="0.9" />
            </g>

            {/* Needle Texture - More detailed and realistic */}
            {[...Array(80)].map((_, i) => {
              const x = 350 + Math.random() * 300;
              const y = 200 + Math.random() * 350;
              const angle = Math.random() * 360;
              const length = 3 + Math.random() * 4;
              return (
                <line
                  key={`needle-${i}`}
                  x1={x}
                  y1={y}
                  x2={x + Math.cos(angle) * length}
                  y2={y + Math.sin(angle) * length}
                  stroke="#165a1f"
                  strokeWidth="0.8"
                  opacity="0.6"
                />
              );
            })}
          </svg>

          {/* Interactive Ornaments positioned on the realistic tree */}
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
