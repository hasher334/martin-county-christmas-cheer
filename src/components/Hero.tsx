
import { Button } from "@/components/ui/button";
import { Snowflake, Gift, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo } from "react";

export const Hero = () => {
  // Generate fewer snowflakes for better performance
  const snowflakePositions = useMemo(() => {
    const positions = [];
    const isMobile = window.innerWidth < 768;
    const targetCount = isMobile ? 30 : 60; // Significantly reduced from 100/200

    // Simplified positioning without collision detection for better performance
    for (let i = 0; i < targetCount; i++) {
      positions.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        animationDelay: Math.random() * 2,
        animationDuration: 2 + Math.random() * 2,
      });
    }

    return positions;
  }, []);

  return (
    <section className="relative py-20 bg-gradient-to-b from-[#c51212] via-[#a20a0a] to-[#4d0000] text-white overflow-hidden">
      {/* Simplified Candy Cane Stripe Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent 0px,
            transparent 10px,
            rgba(255, 255, 255, 0.8) 10px,
            rgba(255, 255, 255, 0.8) 20px,
            transparent 20px,
            transparent 30px,
            #dc2626 30px,
            #dc2626 40px
          )`
        }}
      ></div>

      {/* Optimized Floating Christmas Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {snowflakePositions.map((position, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              animationDelay: `${position.animationDelay}s`,
              animationDuration: `${position.animationDuration}s`,
            }}
          >
            <Snowflake className="h-3 w-3 text-white/20" />
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
          Make Christmas Magical
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
          Help bring joy to children in the Treasure Coast by adopting them for Christmas. 
          Every child deserves to experience the wonder of the holiday season.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/wishlists">
            <Button
              size="lg"
              className="bg-white/90 text-red-600 hover:bg-white text-lg px-8 py-3 rounded-full font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Gift className="h-5 w-5 mr-2" />
              Browse Wishlists
            </Button>
          </Link>
          <div className="text-center">
            <p className="text-sm opacity-75">No registration required to browse</p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Choose a Child</h3>
            <p className="text-sm opacity-90">Browse profiles and find a child whose story touches your heart</p>
          </div>
          <div className="text-center">
            <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Gift className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Fulfill Wishes</h3>
            <p className="text-sm opacity-90">Purchase gifts from their wishlist and make their dreams come true</p>
          </div>
          <div className="text-center">
            <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Snowflake className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Spread Joy</h3>
            <p className="text-sm opacity-90">Experience the magic of giving and create lasting Christmas memories</p>
          </div>
        </div>
      </div>
    </section>
  );
};
