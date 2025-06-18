
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
    "#3b82f6", "#d97706", "#8b5cf6", "#e11d48",
    "#16a34a", "#c2410c", "#be123c", "#9333ea",
    "#0284c7", "#dc2626", "#ca8a04", "#7c2d12"
  ];

  // Much wider tree with many more ornament positions
  const ornamentPositions = [
    // Top section (narrow)
    { x: 600, y: 180 }, { x: 580, y: 210 }, { x: 620, y: 210 },
    { x: 560, y: 240 }, { x: 640, y: 240 }, { x: 600, y: 260 },
    
    // Upper-middle section
    { x: 540, y: 300 }, { x: 660, y: 300 }, { x: 580, y: 320 }, { x: 620, y: 320 },
    { x: 520, y: 340 }, { x: 680, y: 340 }, { x: 560, y: 360 }, { x: 640, y: 360 },
    { x: 500, y: 380 }, { x: 700, y: 380 }, { x: 540, y: 400 }, { x: 660, y: 400 },
    
    // Middle section
    { x: 480, y: 440 }, { x: 720, y: 440 }, { x: 520, y: 460 }, { x: 680, y: 460 },
    { x: 460, y: 480 }, { x: 740, y: 480 }, { x: 500, y: 500 }, { x: 700, y: 500 },
    { x: 440, y: 520 }, { x: 760, y: 520 }, { x: 480, y: 540 }, { x: 720, y: 540 },
    
    // Lower-middle section
    { x: 420, y: 580 }, { x: 780, y: 580 }, { x: 460, y: 600 }, { x: 740, y: 600 },
    { x: 400, y: 620 }, { x: 800, y: 620 }, { x: 440, y: 640 }, { x: 760, y: 640 },
    { x: 380, y: 660 }, { x: 820, y: 660 }, { x: 420, y: 680 }, { x: 780, y: 680 },
    
    // Bottom section (widest)
    { x: 360, y: 720 }, { x: 840, y: 720 }, { x: 400, y: 740 }, { x: 800, y: 740 },
    { x: 340, y: 760 }, { x: 860, y: 760 }, { x: 380, y: 780 }, { x: 820, y: 780 },
    { x: 320, y: 800 }, { x: 880, y: 800 }, { x: 360, y: 820 }, { x: 840, y: 820 }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-800 via-slate-600 to-slate-400 overflow-hidden">
      {/* Enhanced Winter Wonderland Background */}
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
          <svg 
            width="1200" 
            height="900" 
            viewBox="0 0 1200 900" 
            className="drop-shadow-2xl"
          >
            {/* Enhanced Snow Ground with Shadows */}
            <defs>
              <radialGradient id="groundGradient" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="white" stopOpacity="1" />
                <stop offset="70%" stopColor="#f1f5f9" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.8" />
              </radialGradient>
              
              <radialGradient id="treeGradient" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#166534" stopOpacity="1" />
                <stop offset="50%" stopColor="#15803d" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0.8" />
              </radialGradient>
              
              <filter id="treeShadow">
                <feDropShadow dx="3" dy="6" stdDeviation="4" floodColor="#000" floodOpacity="0.3"/>
              </filter>
            </defs>

            {/* Ground with realistic snow texture */}
            <ellipse 
              cx="600" 
              cy="850" 
              rx="500" 
              ry="50" 
              fill="url(#groundGradient)"
            />
            
            {/* Tree shadow on ground */}
            <ellipse 
              cx="600" 
              cy="850" 
              rx="300" 
              ry="30" 
              fill="#cbd5e1"
              opacity="0.4"
            />
            
            {/* Realistic Tree Trunk with Bark Texture */}
            <rect 
              x="580" 
              y="750" 
              width="40" 
              height="100" 
              fill="#8b4513"
              rx="6"
              filter="url(#treeShadow)"
            />
            
            {/* Bark texture lines */}
            {[...Array(15)].map((_, i) => (
              <line
                key={`bark-${i}`}
                x1="585"
                y1={760 + i * 6}
                x2="615"
                y2={760 + i * 6}
                stroke="#654321"
                strokeWidth="1"
                opacity="0.6"
              />
            ))}
            
            {/* Tree base with snow */}
            <rect 
              x="560" 
              y="840" 
              width="80" 
              height="25" 
              fill="#8b4513"
              rx="12"
            />
            <ellipse 
              cx="600" 
              cy="845" 
              rx="45" 
              ry="8" 
              fill="white"
              opacity="0.9"
            />

            {/* Hyper-realistic Christmas Tree Layers - Much Wider */}
            
            {/* Bottom Layer - Very Wide and Detailed */}
            <path 
              d="M 600 650 L 300 750 L 900 750 Z" 
              fill="url(#treeGradient)"
              stroke="#0f172a"
              strokeWidth="1"
              filter="url(#treeShadow)"
            />
            
            {/* Individual needle clusters for bottom layer */}
            {[...Array(80)].map((_, i) => {
              const x = 320 + (i * 7.25);
              const y = 740 - (Math.abs(x - 600) * 0.15);
              return (
                <path
                  key={`needle-bottom-${i}`}
                  d={`M ${x} ${y} L ${x + 2} ${y - 3} L ${x + 4} ${y} L ${x + 6} ${y - 2} L ${x + 8} ${y}`}
                  stroke="#15803d"
                  strokeWidth="0.8"
                  fill="none"
                  opacity="0.8"
                />
              );
            })}
            
            {/* Second Layer */}
            <path 
              d="M 600 550 L 350 680 L 850 680 Z" 
              fill="url(#treeGradient)"
              stroke="#0f172a"
              strokeWidth="1"
              filter="url(#treeShadow)"
            />
            
            {/* Individual needle clusters for second layer */}
            {[...Array(70)].map((_, i) => {
              const x = 360 + (i * 7);
              const y = 670 - (Math.abs(x - 600) * 0.12);
              return (
                <path
                  key={`needle-second-${i}`}
                  d={`M ${x} ${y} L ${x + 2} ${y - 3} L ${x + 4} ${y} L ${x + 6} ${y - 2} L ${x + 8} ${y}`}
                  stroke="#15803d"
                  strokeWidth="0.8"
                  fill="none"
                  opacity="0.8"
                />
              );
            })}
            
            {/* Third Layer */}
            <path 
              d="M 600 450 L 400 610 L 800 610 Z" 
              fill="url(#treeGradient)"
              stroke="#0f172a"
              strokeWidth="1"
              filter="url(#treeShadow)"
            />
            
            {/* Individual needle clusters for third layer */}
            {[...Array(56)].map((_, i) => {
              const x = 410 + (i * 7);
              const y = 600 - (Math.abs(x - 600) * 0.1);
              return (
                <path
                  key={`needle-third-${i}`}
                  d={`M ${x} ${y} L ${x + 2} ${y - 3} L ${x + 4} ${y} L ${x + 6} ${y - 2} L ${x + 8} ${y}`}
                  stroke="#15803d"
                  strokeWidth="0.8"
                  fill="none"
                  opacity="0.8"
                />
              );
            })}
            
            {/* Fourth Layer */}
            <path 
              d="M 600 350 L 450 540 L 750 540 Z" 
              fill="url(#treeGradient)"
              stroke="#0f172a"
              strokeWidth="1"
              filter="url(#treeShadow)"
            />
            
            {/* Individual needle clusters for fourth layer */}
            {[...Array(42)].map((_, i) => {
              const x = 460 + (i * 7);
              const y = 530 - (Math.abs(x - 600) * 0.08);
              return (
                <path
                  key={`needle-fourth-${i}`}
                  d={`M ${x} ${y} L ${x + 2} ${y - 3} L ${x + 4} ${y} L ${x + 6} ${y - 2} L ${x + 8} ${y}`}
                  stroke="#15803d"
                  strokeWidth="0.8"
                  fill="none"
                  opacity="0.8"
                />
              );
            })}

            {/* Fifth Layer */}
            <path 
              d="M 600 250 L 500 470 L 700 470 Z" 
              fill="url(#treeGradient)"
              stroke="#0f172a"
              strokeWidth="1"
              filter="url(#treeShadow)"
            />
            
            {/* Individual needle clusters for fifth layer */}
            {[...Array(28)].map((_, i) => {
              const x = 510 + (i * 7);
              const y = 460 - (Math.abs(x - 600) * 0.06);
              return (
                <path
                  key={`needle-fifth-${i}`}
                  d={`M ${x} ${y} L ${x + 2} ${y - 3} L ${x + 4} ${y} L ${x + 6} ${y - 2} L ${x + 8} ${y}`}
                  stroke="#15803d"
                  strokeWidth="0.8"
                  fill="none"
                  opacity="0.8"
                />
              );
            })}

            {/* Top Layer */}
            <path 
              d="M 600 150 L 550 400 L 650 400 Z" 
              fill="url(#treeGradient)"
              stroke="#0f172a"
              strokeWidth="1"
              filter="url(#treeShadow)"
            />
            
            {/* Individual needle clusters for top layer */}
            {[...Array(14)].map((_, i) => {
              const x = 560 + (i * 7);
              const y = 390 - (Math.abs(x - 600) * 0.04);
              return (
                <path
                  key={`needle-top-${i}`}
                  d={`M ${x} ${y} L ${x + 2} ${y - 3} L ${x + 4} ${y} L ${x + 6} ${y - 2} L ${x + 8} ${y}`}
                  stroke="#15803d"
                  strokeWidth="0.8"
                  fill="none"
                  opacity="0.8"
                />
              );
            })}

            {/* Realistic Garland with Depth */}
            <path 
              d="M 320 740 Q 460 720 600 730 Q 740 720 880 740" 
              stroke="#ffd700"
              strokeWidth="4"
              fill="none"
              opacity="0.9"
              filter="url(#treeShadow)"
            />
            <path 
              d="M 370 670 Q 485 650 600 660 Q 715 650 830 670" 
              stroke="#ffd700"
              strokeWidth="4"
              fill="none"
              opacity="0.9"
              filter="url(#treeShadow)"
            />
            <path 
              d="M 420 600 Q 510 580 600 590 Q 690 580 780 600" 
              stroke="#ffd700"
              strokeWidth="4"
              fill="none"
              opacity="0.9"
              filter="url(#treeShadow)"
            />
            <path 
              d="M 470 530 Q 535 510 600 520 Q 665 510 730 530" 
              stroke="#ffd700"
              strokeWidth="4"
              fill="none"
              opacity="0.9"
              filter="url(#treeShadow)"
            />
            <path 
              d="M 520 460 Q 560 440 600 450 Q 640 440 680 460" 
              stroke="#ffd700"
              strokeWidth="4"
              fill="none"
              opacity="0.9"
              filter="url(#treeShadow)"
            />

            {/* Hyper-realistic Tree Star */}
            <g transform="translate(600, 120)">
              <defs>
                <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fff" stopOpacity="1" />
                  <stop offset="30%" stopColor="#ffd700" stopOpacity="0.9" />
                  <stop offset="70%" stopColor="#ffa500" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#ff8c00" stopOpacity="0.5" />
                </radialGradient>
                
                <filter id="starFilter">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Star Glow Effect */}
              <circle 
                cx="0" 
                cy="0" 
                r="50" 
                fill="url(#starGlow)" 
                opacity="0.8"
                filter="url(#starFilter)"
                className={cn(
                  "transition-all duration-1000",
                  twinkle % 2 === 0 ? "scale-150 opacity-90" : "scale-120 opacity-70"
                )}
              />
              
              {/* Main Star with 3D Effect */}
              <path 
                d="M 0 -35 L 10.5 -10.5 L 35 -10.5 L 17.5 3.5 L 28 28 L 0 14 L -28 28 L -17.5 3.5 L -35 -10.5 L -10.5 -10.5 Z"
                fill="url(#starGlow)"
                stroke="#ffa500"
                strokeWidth="3"
                filter="url(#starFilter)"
                className={cn(
                  "transition-all duration-500 drop-shadow-xl",
                  twinkle % 2 === 0 ? "scale-115 brightness-125" : "scale-105 brightness-100"
                )}
              />
              
              {/* Inner Star Highlights */}
              <path 
                d="M 0 -21 L 6.3 -6.3 L 21 -6.3 L 10.5 2.1 L 16.8 16.8 L 0 8.4 L -16.8 16.8 L -10.5 2.1 L -21 -6.3 L -6.3 -6.3 Z"
                fill="#fff"
                opacity="0.9"
              />
              
              {/* Center sparkle */}
              <circle cx="0" cy="0" r="4" fill="#fff" opacity="0.95" />
              
              {/* Star rays */}
              {[...Array(8)].map((_, i) => {
                const angle = (i * 45) * Math.PI / 180;
                const x = Math.cos(angle) * 60;
                const y = Math.sin(angle) * 60;
                return (
                  <line
                    key={`ray-${i}`}
                    x1="0"
                    y1="0"
                    x2={x}
                    y2={y}
                    stroke="#fff"
                    strokeWidth="2"
                    opacity="0.6"
                    className={cn(
                      "transition-opacity duration-300",
                      (twinkle + i) % 4 === 0 ? "opacity-80" : "opacity-40"
                    )}
                  />
                );
              })}
            </g>

            {/* Detailed Branch Texture */}
            {[...Array(150)].map((_, i) => {
              const layer = Math.floor(i / 30);
              const baseWidth = 300 + (5 - layer) * 100;
              const baseY = 150 + layer * 100;
              const x = 600 - baseWidth/2 + Math.random() * baseWidth;
              const y = baseY + Math.random() * 80;
              const angle = Math.random() * 360;
              const length = 4 + Math.random() * 6;
              
              return (
                <line
                  key={`branch-${i}`}
                  x1={x}
                  y1={y}
                  x2={x + Math.cos(angle) * length}
                  y2={y + Math.sin(angle) * length}
                  stroke="#0f5132"
                  strokeWidth="1.2"
                  opacity="0.7"
                />
              );
            })}

            {/* Snow on Branches */}
            {[...Array(100)].map((_, i) => {
              const layer = Math.floor(i / 20);
              const baseWidth = 280 + (5 - layer) * 95;
              const baseY = 160 + layer * 100;
              const x = 600 - baseWidth/2 + Math.random() * baseWidth;
              const y = baseY + Math.random() * 70;
              
              return (
                <circle
                  key={`snow-branch-${i}`}
                  cx={x}
                  cy={y}
                  r={1 + Math.random() * 2}
                  fill="white"
                  opacity="0.8"
                />
              );
            })}
          </svg>

          {/* Interactive Ornaments positioned on the wide realistic tree */}
          {children.slice(0, ornamentPositions.length).map((child, index) => {
            const position = ornamentPositions[index];
            const ornamentSize = 12 + Math.random() * 6; // Varied sizes
            
            return (
              <button
                key={child.id}
                onClick={() => handleOrnamentClick(child)}
                className={cn(
                  "absolute rounded-full shadow-2xl transition-all duration-300 z-30 cursor-pointer",
                  "hover:scale-150 hover:shadow-2xl transform-gpu hover:z-40",
                  (twinkle + index) % 4 === 0 ? "animate-pulse scale-110" : "",
                  "hover:animate-bounce border-3 border-white/90"
                )}
                style={{
                  left: `${position.x - ornamentSize/2}px`,
                  top: `${position.y - ornamentSize/2}px`,
                  width: `${ornamentSize}px`,
                  height: `${ornamentSize}px`,
                  backgroundColor: ornamentColors[index % ornamentColors.length],
                  boxShadow: `0 8px 25px ${ornamentColors[index % ornamentColors.length]}50, 0 0 20px ${ornamentColors[index % ornamentColors.length]}40, inset 0 2px 4px rgba(255,255,255,0.3)`
                }}
                title={`Click to meet ${child.name}`}
              >
                {/* Realistic ornament highlight */}
                <div 
                  className="absolute inset-1 rounded-full bg-gradient-to-br from-white/80 via-white/40 to-transparent"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 40%, transparent 70%)`
                  }}
                ></div>
                
                {/* Ornament cap */}
                <div 
                  className="absolute -top-1 left-1/2 transform -translate-x-1/2 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full border border-yellow-300"
                  style={{
                    width: `${ornamentSize * 0.4}px`,
                    height: `${ornamentSize * 0.25}px`
                  }}
                ></div>
                
                {/* Ornament pattern */}
                <div className="absolute inset-2 rounded-full border border-white/30"></div>
              </button>
            );
          })}
        </div>

        {/* Enhanced Instructions with photorealistic styling */}
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
