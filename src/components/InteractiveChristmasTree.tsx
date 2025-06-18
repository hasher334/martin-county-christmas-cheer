
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

  const ornamentColors = {
    circle: ["#f59e0b", "#f59e0b", "#f59e0b", "#f59e0b", "#f59e0b", "#f59e0b", "#f59e0b", "#f59e0b"],
    star: ["#dc2626", "#dc2626", "#dc2626", "#dc2626", "#dc2626", "#dc2626", "#dc2626", "#dc2626"]
  };

  // Ornament positions for the simplified tree
  const ornamentPositions = [
    // Top section
    { x: 600, y: 200, type: "star" },
    
    // Layer 1
    { x: 560, y: 240, type: "circle" },
    { x: 620, y: 280, type: "star" },
    
    // Layer 2
    { x: 520, y: 320, type: "circle" },
    { x: 580, y: 350, type: "star" },
    { x: 640, y: 380, type: "circle" },
    
    // Layer 3
    { x: 500, y: 420, type: "circle" },
    { x: 550, y: 450, type: "star" },
    { x: 600, y: 480, type: "circle" },
    { x: 650, y: 510, type: "star" },
    
    // Layer 4
    { x: 480, y: 540, type: "star" },
    { x: 530, y: 570, type: "circle" },
    { x: 580, y: 600, type: "star" },
    { x: 630, y: 630, type: "circle" },
    
    // Bottom layer
    { x: 460, y: 660, type: "circle" },
    { x: 510, y: 690, type: "star" },
    { x: 560, y: 720, type: "circle" },
    { x: 610, y: 690, type: "star" },
    { x: 660, y: 660, type: "circle" },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-800 via-slate-600 to-slate-400 overflow-hidden">
      {/* Winter Wonderland Background - Kept from previous design */}
      <div className="absolute inset-0">
        {/* Heavy Snow Animation */}
        {[...Array(200)].map((_, i) => (
          <div
            key={`snow-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full opacity-90 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 4}s`,
              transform: `scale(${0.5 + Math.random() * 1.5})`,
            }}
          />
        ))}

        {/* Large Snowflakes */}
        {[...Array(50)].map((_, i) => (
          <div
            key={`snowflake-${i}`}
            className="absolute text-white animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
              fontSize: `${12 + Math.random() * 16}px`,
              opacity: 0.8 - Math.random() * 0.3,
            }}
          >
            ❄
          </div>
        ))}

        {/* Ground Snow with Texture */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-slate-50 to-transparent">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-white to-blue-50 opacity-60"></div>
        </div>
        
        {/* Atmospheric Lighting */}
        <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-slate-700 via-slate-500 to-transparent opacity-70"></div>
        
        {/* Distant Mountains */}
        <div className="absolute bottom-0 left-0 right-0 h-64">
          <svg viewBox="0 0 1200 300" className="w-full h-full opacity-30">
            <path d="M0,300 L200,100 L400,150 L600,80 L800,120 L1000,90 L1200,130 L1200,300 Z" fill="#1e293b" />
            <path d="M0,300 L150,180 L350,200 L550,160 L750,180 L950,170 L1200,190 L1200,300 Z" fill="#334155" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center py-12">
        <div className="relative">
          {/* Simple Stylized Tree SVG */}
          <svg 
            width="1200" 
            height="900" 
            viewBox="0 0 1200 900" 
            className="drop-shadow-xl"
          >
            {/* Ground with snow texture - kept from previous design */}
            <ellipse 
              cx="600" 
              cy="850" 
              rx="500" 
              ry="50" 
              fill="white"
              opacity="0.8"
            />
            
            {/* Tree trunk */}
            <rect 
              x="585" 
              y="750" 
              width="30" 
              height="80" 
              fill="#8B4513"
              rx="2"
              ry="2"
            />
            
            {/* Stylized Tree Layers (triangular sections) */}
            {/* Bottom section */}
            <path 
              d="M 450 750 L 600 550 L 750 750 Z" 
              fill="#0F5733"
              stroke="none"
            />
            {/* Middle section */}
            <path 
              d="M 475 580 L 600 400 L 725 580 Z" 
              fill="#0F5733"
              stroke="none"
            />
            {/* Top section */}
            <path 
              d="M 500 430 L 600 280 L 700 430 Z" 
              fill="#0F5733"
              stroke="none"
            />
            
            {/* White garland stripes across the tree */}
            {/* Bottom garland */}
            <path 
              d="M 470 710 C 530 690, 670 690, 730 710" 
              stroke="white"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
            
            {/* Second garland */}
            <path 
              d="M 490 650 C 540 630, 660 630, 710 650" 
              stroke="white"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
            
            {/* Third garland */}
            <path 
              d="M 510 590 C 550 570, 650 570, 690 590" 
              stroke="white"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
            
            {/* Fourth garland */}
            <path 
              d="M 520 510 C 550 490, 650 490, 680 510" 
              stroke="white"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
            
            {/* Fifth garland */}
            <path 
              d="M 540 440 C 560 420, 640 420, 660 440" 
              stroke="white"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
            
            {/* Tree shadow */}
            <ellipse 
              cx="600" 
              cy="830" 
              rx="200" 
              ry="20" 
              fill="#1e293b"
              opacity="0.2"
            />
            
            {/* Star on top */}
            <path 
              d="M 600 230 L 615 270 L 655 270 L 625 295 L 635 335 L 600 315 L 565 335 L 575 295 L 545 270 L 585 270 Z" 
              fill="#F59E0B"
              stroke="none"
              className={cn(
                "transition-all duration-1000",
                twinkle % 2 === 0 ? "opacity-100" : "opacity-85 scale-95"
              )}
            />
          </svg>

          {/* Interactive Ornaments - children mapping */}
          {children.slice(0, ornamentPositions.length).map((child, index) => {
            const position = ornamentPositions[index];
            const isStarOrnament = position.type === "star";
            const colorIndex = index % (isStarOrnament ? ornamentColors.star.length : ornamentColors.circle.length);
            const color = isStarOrnament ? ornamentColors.star[colorIndex] : ornamentColors.circle[colorIndex];
            
            // Return either a star or circle ornament
            return (
              <button
                key={child.id}
                onClick={() => handleOrnamentClick(child)}
                className={cn(
                  "absolute rounded-full shadow-lg transition-all duration-300 z-30 cursor-pointer",
                  "hover:scale-150 hover:shadow-2xl transform-gpu hover:z-40",
                  (twinkle + index) % 4 === 0 ? "animate-pulse" : ""
                )}
                style={{
                  left: `${position.x - (isStarOrnament ? 15 : 12)}px`,
                  top: `${position.y - (isStarOrnament ? 15 : 12)}px`,
                  width: isStarOrnament ? '30px' : '24px',
                  height: isStarOrnament ? '30px' : '24px'
                }}
                title={`Click to meet ${child.name}`}
              >
                {isStarOrnament ? (
                  // Star ornament
                  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none">
                    <path 
                      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                      fill={color} 
                      stroke="white" 
                      strokeWidth="1"
                    />
                  </svg>
                ) : (
                  // Circle ornament
                  <div 
                    className="w-full h-full rounded-full border-2 border-white/50"
                    style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}80` }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Enhanced Instructions with styling */}
        <div className="relative z-20 mt-16 text-center max-w-4xl px-6">
          <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-10 border border-white/20 shadow-2xl">
            <p className={cn(
              "text-4xl font-bold transition-all duration-500 mb-8",
              twinkle % 2 === 0 ? "text-yellow-300 scale-105 drop-shadow-2xl" : "text-red-400 scale-100"
            )}>
              ✨ Discover the Magic Within Each Ornament ✨
            </p>
            <p className="text-2xl text-white/90 leading-relaxed font-medium mb-6">
              Each beautifully crafted ornament holds the story of a child dreaming of Christmas joy. 
              Click any ornament to meet them and help make their holiday wishes come true!
            </p>
            <div className="mt-8 flex justify-center space-x-3">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-4 h-4 rounded-full transition-all duration-300 shadow-lg",
                    (twinkle + i) % 7 === 0 ? "bg-yellow-300 scale-150 shadow-yellow-300/50" : "bg-red-400/80 shadow-red-400/30"
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
