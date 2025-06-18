
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export const ChristmasTree = () => {
  const [twinkle, setTwinkle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTwinkle(prev => (prev + 1) % 4);
    }, 800);
    
    return () => clearInterval(interval);
  }, []);

  const ornaments = [
    { color: "bg-red-500", position: "top-12 left-1/2 transform -translate-x-1/2" },
    { color: "bg-gold-400", position: "top-16 left-1/3" },
    { color: "bg-blue-500", position: "top-16 right-1/3" },
    { color: "bg-purple-500", position: "top-20 left-1/4" },
    { color: "bg-pink-500", position: "top-20 right-1/4" },
    { color: "bg-green-400", position: "top-24 left-1/3" },
    { color: "bg-orange-500", position: "top-24 right-1/3" },
    { color: "bg-red-400", position: "top-28 left-1/5" },
    { color: "bg-blue-400", position: "top-28 right-1/5" },
    { color: "bg-yellow-400", position: "top-32 left-1/4" },
    { color: "bg-purple-400", position: "top-32 right-1/4" },
    { color: "bg-pink-400", position: "top-36 left-1/3" },
    { color: "bg-green-500", position: "top-36 right-1/3" },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative">
        {/* Tree Star */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20">
          <div className={cn(
            "w-8 h-8 bg-yellow-400 rotate-12 transform transition-all duration-300",
            twinkle % 2 === 0 ? "scale-110 shadow-lg shadow-yellow-400/50" : "scale-100"
          )} 
          style={{ clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" }} />
        </div>

        {/* Tree Layers */}
        <div className="relative">
          {/* Top layer */}
          <div className="w-0 h-0 border-l-12 border-r-12 border-b-16 border-l-transparent border-r-transparent border-b-green-600 mx-auto relative z-10" />
          
          {/* Second layer */}
          <div className="w-0 h-0 border-l-16 border-r-16 border-b-20 border-l-transparent border-r-transparent border-b-green-700 mx-auto -mt-2 relative z-10" />
          
          {/* Third layer */}
          <div className="w-0 h-0 border-l-20 border-r-20 border-b-24 border-l-transparent border-r-transparent border-b-green-600 mx-auto -mt-2 relative z-10" />
          
          {/* Fourth layer */}
          <div className="w-0 h-0 border-l-24 border-r-24 border-b-28 border-l-transparent border-r-transparent border-b-green-700 mx-auto -mt-2 relative z-10" />
          
          {/* Fifth layer */}
          <div className="w-0 h-0 border-l-28 border-r-28 border-b-32 border-l-transparent border-r-transparent border-b-green-600 mx-auto -mt-2 relative z-10" />
          
          {/* Sixth layer */}
          <div className="w-0 h-0 border-l-32 border-r-32 border-b-36 border-l-transparent border-r-transparent border-b-green-700 mx-auto -mt-2 relative z-10" />

          {/* Ornaments */}
          {ornaments.map((ornament, index) => (
            <div
              key={index}
              className={cn(
                "absolute w-3 h-3 rounded-full shadow-lg transition-all duration-300 z-20",
                ornament.color,
                ornament.position,
                (twinkle + index) % 4 === 0 ? "animate-pulse scale-110" : ""
              )}
            />
          ))}

          {/* Lights */}
          {[...Array(12)].map((_, i) => (
            <div
              key={`light-${i}`}
              className={cn(
                "absolute w-2 h-2 rounded-full z-15",
                i % 3 === 0 ? "bg-yellow-300" : i % 3 === 1 ? "bg-red-300" : "bg-blue-300",
                (twinkle + i) % 3 === 0 ? "animate-pulse" : "",
              )}
              style={{
                top: `${20 + (i * 3)}px`,
                left: `${45 + (i % 2 === 0 ? -15 : 15) + Math.sin(i) * 10}px`,
              }}
            />
          ))}
        </div>

        {/* Tree Trunk */}
        <div className="w-8 h-12 bg-amber-800 mx-auto relative z-10" />
        <div className="w-12 h-4 bg-amber-900 mx-auto relative z-10" />
      </div>

      {/* Twinkling Text */}
      <div className="mt-8 text-center">
        <p className={cn(
          "text-lg font-semibold transition-all duration-500",
          twinkle % 2 === 0 ? "text-green-600 scale-105" : "text-red-600 scale-100"
        )}>
          ✨ Every ornament represents hope ✨
        </p>
      </div>
    </div>
  );
};
