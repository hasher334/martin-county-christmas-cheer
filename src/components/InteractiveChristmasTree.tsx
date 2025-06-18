
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
    "bg-red-500", "bg-gold-400", "bg-blue-500", "bg-purple-500", 
    "bg-pink-500", "bg-green-400", "bg-orange-500", "bg-red-400",
    "bg-blue-400", "bg-yellow-400", "bg-purple-400", "bg-pink-400"
  ];

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative scale-150 md:scale-200">
        {/* Tree Star */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-20">
          <div className={cn(
            "w-12 h-12 bg-yellow-400 rotate-12 transform transition-all duration-500",
            twinkle % 2 === 0 ? "scale-125 shadow-2xl shadow-yellow-400/60" : "scale-110"
          )} 
          style={{ clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" }} />
        </div>

        {/* Tree Layers */}
        <div className="relative">
          {/* Top layer */}
          <div className="w-0 h-0 border-l-20 border-r-20 border-b-24 border-l-transparent border-r-transparent border-b-green-600 mx-auto relative z-10" />
          
          {/* Second layer */}
          <div className="w-0 h-0 border-l-28 border-r-28 border-b-32 border-l-transparent border-r-transparent border-b-green-700 mx-auto -mt-3 relative z-10" />
          
          {/* Third layer */}
          <div className="w-0 h-0 border-l-36 border-r-36 border-b-40 border-l-transparent border-r-transparent border-b-green-600 mx-auto -mt-4 relative z-10" />
          
          {/* Fourth layer */}
          <div className="w-0 h-0 border-l-44 border-r-44 border-b-48 border-l-transparent border-r-transparent border-b-green-700 mx-auto -mt-5 relative z-10" />
          
          {/* Fifth layer */}
          <div className="w-0 h-0 border-l-52 border-r-52 border-b-56 border-l-transparent border-r-transparent border-b-green-600 mx-auto -mt-6 relative z-10" />
          
          {/* Sixth layer */}
          <div className="w-0 h-0 border-l-60 border-r-60 border-b-64 border-l-transparent border-r-transparent border-b-green-700 mx-auto -mt-7 relative z-10" />

          {/* Interactive Ornaments with Children */}
          {children.slice(0, 12).map((child, index) => {
            const positions = [
              "top-16 left-1/2 transform -translate-x-1/2",
              "top-24 left-1/3", "top-24 right-1/3",
              "top-32 left-1/4", "top-32 right-1/4",
              "top-40 left-1/3", "top-40 right-1/3",
              "top-48 left-1/5", "top-48 right-1/5",
              "top-56 left-1/4", "top-56 right-1/4",
              "top-64 left-1/3", "top-64 right-1/3"
            ];

            return (
              <button
                key={child.id}
                onClick={() => handleOrnamentClick(child)}
                className={cn(
                  "absolute w-6 h-6 rounded-full shadow-lg transition-all duration-300 z-30 cursor-pointer hover:scale-125 hover:shadow-xl",
                  ornamentColors[index % ornamentColors.length],
                  positions[index] || "top-32 left-1/2",
                  (twinkle + index) % 4 === 0 ? "animate-pulse scale-110" : "",
                  "hover:animate-bounce"
                )}
                title={`Click to meet ${child.name}`}
              >
                <div className="absolute inset-0 rounded-full bg-white/30 animate-pulse"></div>
              </button>
            );
          })}

          {/* Decorative Lights */}
          {[...Array(20)].map((_, i) => (
            <div
              key={`light-${i}`}
              className={cn(
                "absolute w-2 h-2 rounded-full z-15",
                i % 3 === 0 ? "bg-yellow-300" : i % 3 === 1 ? "bg-red-300" : "bg-blue-300",
                (twinkle + i) % 3 === 0 ? "animate-pulse" : "",
              )}
              style={{
                top: `${32 + (i * 4)}px`,
                left: `${60 + (i % 2 === 0 ? -25 : 25) + Math.sin(i) * 15}px`,
              }}
            />
          ))}
        </div>

        {/* Tree Trunk */}
        <div className="w-16 h-20 bg-amber-800 mx-auto relative z-10" />
        <div className="w-20 h-6 bg-amber-900 mx-auto relative z-10" />
      </div>

      {/* Instructions */}
      <div className="mt-16 text-center max-w-2xl">
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
