
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

  // Better positioned ornaments for the scaled tree
  const ornamentPositions = [
    // Top section
    { x: 500, y: 220 }, { x: 470, y: 250 }, { x: 530, y: 250 },
    // Upper middle section
    { x: 450, y: 300 }, { x: 550, y: 300 }, { x: 500, y: 330 },
    { x: 420, y: 360 }, { x: 580, y: 360 },
    // Lower middle section
    { x: 400, y: 420 }, { x: 600, y: 420 }, { x: 480, y: 450 }, { x: 520, y: 450 },
    // Bottom section
    { x: 380, y: 500 }, { x: 620, y: 500 }, { x: 450, y: 530 }, { x: 550, y: 530 }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-blue-900 overflow-hidden">
      {/* Magical Background Effects */}
      <div className="absolute inset-0">
        {/* Falling Snow */}
        {[...Array(50)].map((_, i) => (
          <div
            key={`snow-${i}`}
            className="absolute w-2 h-2 bg-white rounded-full opacity-70 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
        
        {/* Twinkling Stars */}
        {[...Array(30)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute w-1 h-1 bg-yellow-200 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 50}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center py-12">
        <div className="relative">
          <svg 
            width="1000" 
            height="800" 
            viewBox="0 0 1000 800" 
            className="drop-shadow-2xl"
          >
            {/* Ground Shadow */}
            <ellipse 
              cx="500" 
              cy="780" 
              rx="180" 
              ry="20" 
              fill="rgba(0,0,0,0.3)"
            />
            
            {/* Tree Trunk - More prominent */}
            <rect 
              x="480" 
              y="650" 
              width="40" 
              height="100" 
              fill="#6B4423"
              rx="8"
            />
            <rect 
              x="475" 
              y="740" 
              width="50" 
              height="25" 
              fill="#5A3A1F"
              rx="12"
            />
            
            {/* Tree Base/Pot */}
            <path 
              d="M 460 765 L 540 765 L 530 785 L 470 785 Z" 
              fill="#8B4513"
              stroke="#654321"
              strokeWidth="2"
            />

            {/* Tree Layers - Bottom to Top, much larger and more realistic */}
            
            {/* Bottom Layer - Largest */}
            <path 
              d="M 500 520 L 350 650 L 650 650 Z" 
              fill="#0F4C3A"
              stroke="#0A3A2A"
              strokeWidth="3"
            />
            <path 
              d="M 500 530 L 370 640 L 630 640 L 500 530" 
              fill="#1B5E20"
              opacity="0.9"
            />
            
            {/* Second Layer */}
            <path 
              d="M 500 450 L 370 580 L 630 580 Z" 
              fill="#0F4C3A"
              stroke="#0A3A2A"
              strokeWidth="3"
            />
            <path 
              d="M 500 460 L 390 570 L 610 570 L 500 460" 
              fill="#1B5E20"
              opacity="0.9"
            />
            
            {/* Third Layer */}
            <path 
              d="M 500 380 L 390 510 L 610 510 Z" 
              fill="#0F4C3A"
              stroke="#0A3A2A"
              strokeWidth="3"
            />
            <path 
              d="M 500 390 L 410 500 L 590 500 L 500 390" 
              fill="#1B5E20"
              opacity="0.9"
            />
            
            {/* Fourth Layer */}
            <path 
              d="M 500 310 L 410 440 L 590 440 Z" 
              fill="#0F4C3A"
              stroke="#0A3A2A"
              strokeWidth="3"
            />
            <path 
              d="M 500 320 L 430 430 L 570 430 L 500 320" 
              fill="#1B5E20"
              opacity="0.9"
            />

            {/* Top Layer */}
            <path 
              d="M 500 240 L 430 370 L 570 370 Z" 
              fill="#0F4C3A"
              stroke="#0A3A2A"
              strokeWidth="3"
            />
            <path 
              d="M 500 250 L 450 360 L 550 360 L 500 250" 
              fill="#1B5E20"
              opacity="0.9"
            />

            {/* Tree Star - Much larger and more prominent */}
            <g transform="translate(500, 200)">
              <path 
                d="M 0 -30 L 9 -9 L 30 -9 L 15 3 L 24 24 L 0 12 L -24 24 L -15 3 L -30 -9 L -9 -9 Z"
                fill="#FFD700"
                stroke="#FFA500"
                strokeWidth="3"
                className={cn(
                  "transition-all duration-500 drop-shadow-2xl",
                  twinkle % 2 === 0 ? "scale-110 drop-shadow-2xl filter brightness-125" : "scale-100"
                )}
              />
              <circle cx="0" cy="0" r="5" fill="#FFF" opacity="0.9" />
              <path 
                d="M 0 -15 L 4.5 -4.5 L 15 -4.5 L 7.5 1.5 L 12 12 L 0 6 L -12 12 L -7.5 1.5 L -15 -4.5 L -4.5 -4.5 Z"
                fill="#FFF"
                opacity="0.6"
              />
            </g>

            {/* Garland - Swirling decoration around the tree */}
            {[...Array(6)].map((_, layer) => {
              const y = 300 + layer * 60;
              const width = 120 + layer * 40;
              return (
                <path
                  key={`garland-${layer}`}
                  d={`M ${500 - width} ${y} Q ${500} ${y + 20} ${500 + width} ${y}`}
                  stroke="#FFD700"
                  strokeWidth="4"
                  fill="none"
                  opacity="0.8"
                  className="animate-pulse"
                />
              );
            })}

            {/* Enhanced String Lights - More realistic placement */}
            {[...Array(40)].map((_, i) => {
              const layer = Math.floor(i / 8);
              const angle = (i % 8) / 8 * Math.PI * 2;
              const radius = 60 + layer * 35;
              const x = 500 + Math.cos(angle) * radius;
              const y = 280 + layer * 70 + Math.sin(angle) * 15;
              
              return (
                <g key={`light-${i}`}>
                  <circle
                    cx={x}
                    cy={y}
                    r="6"
                    fill={i % 4 === 0 ? "#FFD700" : i % 4 === 1 ? "#FF4444" : i % 4 === 2 ? "#4444FF" : "#44FF44"}
                    className={cn(
                      "transition-all duration-300",
                      (twinkle + i) % 4 === 0 ? "animate-pulse opacity-100 filter brightness-125" : "opacity-80"
                    )}
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r="3"
                    fill="white"
                    opacity="0.6"
                  />
                </g>
              );
            })}

            {/* Tree Texture and Branch Details */}
            {[...Array(12)].map((_, i) => (
              <path
                key={`texture-${i}`}
                d={`M ${420 + i * 12} ${280 + i * 35} Q ${500} ${260 + i * 35} ${580 - i * 12} ${280 + i * 35}`}
                stroke="#0A3A2A"
                strokeWidth="2"
                fill="none"
                opacity="0.4"
              />
            ))}

            {/* Pine Needle Details */}
            {[...Array(20)].map((_, i) => {
              const x = 400 + Math.random() * 200;
              const y = 280 + Math.random() * 350;
              return (
                <line
                  key={`needle-${i}`}
                  x1={x}
                  y1={y}
                  x2={x + 3}
                  y2={y + 6}
                  stroke="#1B5E20"
                  strokeWidth="1"
                  opacity="0.6"
                />
              );
            })}
          </svg>

          {/* Interactive Ornaments positioned on the scaled tree */}
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
                  "hover:animate-bounce border-3 border-white/60"
                )}
                style={{
                  left: `${position.x - 20}px`,
                  top: `${position.y - 20}px`,
                  backgroundColor: ornamentColors[index % ornamentColors.length],
                  boxShadow: `0 6px 20px ${ornamentColors[index % ornamentColors.length]}60, 0 0 15px ${ornamentColors[index % ornamentColors.length]}40`
                }}
                title={`Click to meet ${child.name}`}
              >
                <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/70 to-transparent"></div>
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white/90 rounded-full"></div>
                <div className="absolute inset-2 rounded-full border border-white/30"></div>
              </button>
            );
          })}
        </div>

        {/* Enhanced Instructions */}
        <div className="relative z-20 mt-12 text-center max-w-3xl px-6">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <p className={cn(
              "text-3xl font-bold transition-all duration-500 mb-6",
              twinkle % 2 === 0 ? "text-yellow-300 scale-105 drop-shadow-lg" : "text-green-300 scale-100"
            )}>
              ✨ Click any ornament to meet a child ✨
            </p>
            <p className="text-xl text-white/90 leading-relaxed">
              Each sparkling ornament represents a child hoping for Christmas magic. 
              Discover their story and help make their holiday dreams come true!
            </p>
            <div className="mt-6 flex justify-center space-x-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all duration-300",
                    (twinkle + i) % 5 === 0 ? "bg-yellow-300 scale-125" : "bg-white/50"
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
