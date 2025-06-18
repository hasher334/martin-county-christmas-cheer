
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
    }, 800);
    
    return () => clearInterval(interval);
  }, []);

  const handleOrnamentClick = (child: Child) => {
    setSelectedChild(child);
    setShowModal(true);
  };

  const ornamentColors = [
    "#dc2626", "#f59e0b", "#2563eb", "#7c3aed", 
    "#db2777", "#059669", "#ea580c", "#b91c1c",
    "#3b82f6", "#d97706", "#8b5cf6", "#e11d48",
    "#10b981", "#f97316", "#6366f1", "#ef4444"
  ];

  // Larger tree with more ornament positions - much bigger and more realistic
  const ornamentPositions = [
    // Top section (smaller)
    { x: 600, y: 180 }, { x: 570, y: 210 }, { x: 630, y: 210 },
    { x: 545, y: 240 }, { x: 655, y: 240 }, { x: 600, y: 265 },
    
    // Upper middle section
    { x: 520, y: 310 }, { x: 680, y: 310 }, { x: 575, y: 340 }, { x: 625, y: 340 },
    { x: 495, y: 370 }, { x: 705, y: 370 }, { x: 550, y: 395 }, { x: 650, y: 395 },
    
    // Middle section (wider)
    { x: 470, y: 440 }, { x: 730, y: 440 }, { x: 525, y: 470 }, { x: 675, y: 470 },
    { x: 445, y: 500 }, { x: 755, y: 500 }, { x: 500, y: 530 }, { x: 700, y: 530 },
    { x: 420, y: 560 }, { x: 780, y: 560 },
    
    // Lower section (widest)
    { x: 395, y: 610 }, { x: 805, y: 610 }, { x: 475, y: 640 }, { x: 725, y: 640 },
    { x: 370, y: 670 }, { x: 830, y: 670 }, { x: 450, y: 700 }, { x: 750, y: 700 },
    { x: 345, y: 730 }, { x: 855, y: 730 }, { x: 425, y: 760 }, { x: 775, y: 760 }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-indigo-900 via-blue-900 to-indigo-800 overflow-hidden rounded-3xl border-8 border-red-500/50 christmas-glow">
      {/* Enhanced Christmas Background Effects */}
      <div className="absolute inset-0">
        {/* Falling Snow - More dramatic */}
        {[...Array(100)].map((_, i) => (
          <div
            key={`snow-${i}`}
            className="absolute bg-white rounded-full opacity-80 animate-pulse"
            style={{
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
        
        {/* Twinkling Stars */}
        {[...Array(60)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute text-yellow-300 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              animationDelay: `${Math.random() * 3}s`,
              fontSize: `${8 + Math.random() * 16}px`
            }}
          >
            ⭐
          </div>
        ))}

        {/* Aurora Borealis Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-blue-500/20 to-purple-500/20 animate-pulse"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center py-16">
        <div className="relative">
          {/* Much Larger SVG Tree */}
          <svg 
            width="1200" 
            height="900" 
            viewBox="0 0 1200 900" 
            className="drop-shadow-2xl filter brightness-110"
          >
            {/* Enhanced Ground Shadow */}
            <ellipse 
              cx="600" 
              cy="870" 
              rx="300" 
              ry="30" 
              fill="rgba(0,0,0,0.4)"
            />
            
            {/* Tree Trunk - Much more prominent and realistic */}
            <defs>
              <linearGradient id="trunkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3E2723" />
                <stop offset="50%" stopColor="#5D4037" />
                <stop offset="100%" stopColor="#3E2723" />
              </linearGradient>
              <linearGradient id="treeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2E7D32" />
                <stop offset="50%" stopColor="#388E3C" />
                <stop offset="100%" stopColor="#1B5E20" />
              </linearGradient>
            </defs>
            
            <rect 
              x="575" 
              y="750" 
              width="50" 
              height="120" 
              fill="url(#trunkGradient)"
              rx="10"
              stroke="#2E2E2E"
              strokeWidth="2"
            />
            
            {/* Tree Base/Pot - More decorative */}
            <path 
              d="M 550 870 L 650 870 L 640 890 L 560 890 Z" 
              fill="#8D6E63"
              stroke="#5D4037"
              strokeWidth="3"
            />
            <rect 
              x="560" 
              y="885" 
              width="80" 
              height="10" 
              fill="#6D4C41"
              rx="5"
            />

            {/* Much Larger Tree Layers - Bottom to top, more realistic proportions */}
            
            {/* Bottom Layer - Massive and wide */}
            <path 
              d="M 600 620 L 280 770 L 920 770 Z" 
              fill="url(#treeGradient)"
              stroke="#1B5E20"
              strokeWidth="4"
            />
            <path 
              d="M 600 635 L 300 755 L 900 755 L 600 635" 
              fill="#4CAF50"
              opacity="0.8"
            />
            
            {/* Second Layer */}
            <path 
              d="M 600 540 L 300 690 L 900 690 Z" 
              fill="url(#treeGradient)"
              stroke="#1B5E20"
              strokeWidth="4"
            />
            <path 
              d="M 600 555 L 320 675 L 880 675 L 600 555" 
              fill="#4CAF50"
              opacity="0.8"
            />
            
            {/* Third Layer */}
            <path 
              d="M 600 460 L 320 610 L 880 610 Z" 
              fill="url(#treeGradient)"
              stroke="#1B5E20"
              strokeWidth="4"
            />
            <path 
              d="M 600 475 L 340 595 L 860 595 L 600 475" 
              fill="#4CAF50"
              opacity="0.8"
            />
            
            {/* Fourth Layer */}
            <path 
              d="M 600 380 L 340 530 L 860 530 Z" 
              fill="url(#treeGradient)"
              stroke="#1B5E20"
              strokeWidth="4"
            />
            <path 
              d="M 600 395 L 360 515 L 840 515 L 600 395" 
              fill="#4CAF50"
              opacity="0.8"
            />

            {/* Fifth Layer */}
            <path 
              d="M 600 300 L 360 450 L 840 450 Z" 
              fill="url(#treeGradient)"
              stroke="#1B5E20"
              strokeWidth="4"
            />
            <path 
              d="M 600 315 L 380 435 L 820 435 L 600 315" 
              fill="#4CAF50"
              opacity="0.8"
            />

            {/* Top Layer */}
            <path 
              d="M 600 220 L 380 370 L 820 370 Z" 
              fill="url(#treeGradient)"
              stroke="#1B5E20"
              strokeWidth="4"
            />
            <path 
              d="M 600 235 L 400 355 L 800 355 L 600 235" 
              fill="#4CAF50"
              opacity="0.8"
            />

            {/* Very Top Small Layer */}
            <path 
              d="M 600 160 L 450 290 L 750 290 Z" 
              fill="url(#treeGradient)"
              stroke="#1B5E20"
              strokeWidth="4"
            />
            <path 
              d="M 600 175 L 470 275 L 730 275 L 600 175" 
              fill="#4CAF50"
              opacity="0.8"
            />

            {/* Massive Christmas Star - Much larger and more impressive */}
            <g transform="translate(600, 120)">
              <defs>
                <radialGradient id="starGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFD700" />
                  <stop offset="50%" stopColor="#FFA500" />
                  <stop offset="100%" stopColor="#FF8C00" />
                </radialGradient>
              </defs>
              <path 
                d="M 0 -50 L 15 -15 L 50 -15 L 25 5 L 40 40 L 0 20 L -40 40 L -25 5 L -50 -15 L -15 -15 Z"
                fill="url(#starGradient)"
                stroke="#FF8C00"
                strokeWidth="4"
                className={cn(
                  "transition-all duration-500 drop-shadow-2xl",
                  twinkle % 2 === 0 ? "scale-125 brightness-150 christmas-glow" : "scale-100"
                )}
              />
              <circle cx="0" cy="0" r="8" fill="#FFF" opacity="0.9" />
              <path 
                d="M 0 -25 L 7.5 -7.5 L 25 -7.5 L 12.5 2.5 L 20 20 L 0 10 L -20 20 L -12.5 2.5 L -25 -7.5 L -7.5 -7.5 Z"
                fill="#FFF"
                opacity="0.7"
              />
            </g>

            {/* Enhanced Tree Texture - More realistic needles and branches */}
            {[...Array(80)].map((_, i) => {
              const layer = Math.floor(i / 10);
              const x = 320 + (i % 10) * 56 + Math.random() * 30;
              const y = 200 + layer * 80 + Math.random() * 60;
              return (
                <g key={`texture-${i}`}>
                  <path
                    d={`M ${x - 20} ${y} Q ${x} ${y - 12} ${x + 20} ${y} Q ${x} ${y + 12} ${x - 20} ${y}`}
                    fill="#4CAF50"
                    opacity="0.7"
                  />
                  <path
                    d={`M ${x - 15} ${y + 8} Q ${x} ${y - 4} ${x + 15} ${y + 8} Q ${x} ${y + 20} ${x - 15} ${y + 8}`}
                    fill="#2E7D32"
                    opacity="0.5"
                  />
                </g>
              );
            })}

            {/* More realistic pine needle details */}
            {[...Array(150)].map((_, i) => {
              const x = 300 + Math.random() * 600;
              const y = 200 + Math.random() * 550;
              const angle = Math.random() * 360;
              return (
                <line
                  key={`needle-${i}`}
                  x1={x}
                  y1={y}
                  x2={x + Math.cos(angle) * 6}
                  y2={y + Math.sin(angle) * 6}
                  stroke="#4CAF50"
                  strokeWidth="1.5"
                  opacity="0.8"
                />
              );
            })}

            {/* Christmas Garland around the tree */}
            <path
              d="M 350 700 Q 450 680 550 690 Q 650 700 750 680 Q 850 690 950 700"
              stroke="#FFD700"
              strokeWidth="6"
              fill="none"
              opacity="0.8"
            />
            <path
              d="M 370 600 Q 470 580 570 590 Q 670 600 770 580 Q 870 590 930 600"
              stroke="#FFD700"
              strokeWidth="5"
              fill="none"
              opacity="0.8"
            />
          </svg>

          {/* Interactive Ornaments positioned on the much larger tree */}
          {children.slice(0, 32).map((child, index) => {
            const position = ornamentPositions[index] || ornamentPositions[0];
            
            return (
              <button
                key={child.id}
                onClick={() => handleOrnamentClick(child)}
                className={cn(
                  "absolute w-16 h-16 rounded-full shadow-2xl transition-all duration-300 z-30 cursor-pointer",
                  "hover:scale-175 hover:shadow-2xl transform-gpu hover:z-40",
                  (twinkle + index) % 4 === 0 ? "animate-pulse scale-125 christmas-glow" : "",
                  "hover:animate-bounce border-4 border-white/80"
                )}
                style={{
                  left: `${position.x - 32}px`,
                  top: `${position.y - 32}px`,
                  backgroundColor: ornamentColors[index % ornamentColors.length],
                  boxShadow: `0 12px 35px ${ornamentColors[index % ornamentColors.length]}80, 0 0 30px ${ornamentColors[index % ornamentColors.length]}60`
                }}
                title={`Click to meet ${child.name} 🎄`}
              >
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/80 to-transparent"></div>
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white/95 rounded-full"></div>
                <div className="absolute inset-3 rounded-full border-2 border-white/40"></div>
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">
                  🎁
                </div>
              </button>
            );
          })}
        </div>

        {/* Enhanced Instructions with Christmas Styling */}
        <div className="relative z-20 mt-16 text-center max-w-5xl px-8">
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-12 border-8 border-red-500/40 christmas-glow shadow-2xl">
            <div className="text-6xl mb-6">🎄✨🎅✨🎄</div>
            <p className={cn(
              "text-4xl font-bold transition-all duration-500 mb-8",
              twinkle % 2 === 0 ? "text-red-600 scale-110 drop-shadow-lg" : "text-green-600 scale-100"
            )}>
              🌟 Click any ornament to meet a child! 🌟
            </p>
            <p className="text-2xl text-gray-800 leading-relaxed mb-8">
              Each sparkling ornament represents a precious child hoping for Christmas magic. 
              Discover their story and help make their holiday dreams come true! Every child deserves a magical Christmas! 🎁✨
            </p>
            <div className="flex justify-center space-x-3">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-4 h-4 rounded-full transition-all duration-300",
                    (twinkle + i) % 7 === 0 ? "bg-red-500 scale-150 christmas-glow-red" : 
                    (twinkle + i) % 7 === 1 ? "bg-green-500 scale-125 christmas-glow-green" : 
                    "bg-yellow-400 scale-100"
                  )}
                />
              ))}
            </div>
            <div className="text-5xl mt-8">🎁⭐🎄⭐🎁</div>
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
