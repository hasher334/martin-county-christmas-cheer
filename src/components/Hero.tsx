
import { Button } from "@/components/ui/button";
import { Snowflake, Gift, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo } from "react";

export const Hero = () => {
  const scrollToWishlists = () => {
    const element = document.querySelector('[data-section="wishlists"]');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  // Generate non-overlapping snowflake positions
  const snowflakePositions = useMemo(() => {
    const positions = [];
    const snowflakeSize = 16; // 4 * 4 (h-4 w-4 in pixels)
    const minDistance = snowflakeSize * 2; // Minimum distance between snowflakes
    const maxAttempts = 1000; // Prevent infinite loops
    const targetCount = 300;

    // Helper function to check if a position overlaps with existing positions
    const isValidPosition = (x: number, y: number) => {
      return positions.every(pos => {
        const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
        return distance >= minDistance;
      });
    };

    // Generate positions
    for (let i = 0; i < targetCount; i++) {
      let attempts = 0;
      let validPosition = false;
      let x, y;

      while (!validPosition && attempts < maxAttempts) {
        x = Math.random() * 100;
        y = Math.random() * 100;
        
        if (isValidPosition(x, y)) {
          validPosition = true;
          positions.push({
            x,
            y,
            animationDelay: Math.random() * 2,
            animationDuration: 2 + Math.random() * 2,
          });
        }
        attempts++;
      }

      // If we can't find a valid position after max attempts, stop adding more
      if (!validPosition) {
        break;
      }
    }

    return positions;
  }, []);

  return (
    <section 
      className="relative py-20 text-white overflow-hidden"
      style={{
        background: `
          repeating-linear-gradient(
            -45deg,
            #dc2626 0px,
            #dc2626 20px,
            #ffffff 20px,
            #ffffff 40px,
            #fecaca 40px,
            #fecaca 60px,
            #ffffff 60px,
            #ffffff 80px
          )
        `
      }}
    >
      {/* Floating Christmas Elements */}
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
            <Snowflake className="h-4 w-4 text-white/40 drop-shadow-sm" />
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in text-white drop-shadow-lg">
          Make Christmas Magical
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white drop-shadow-md">
          Help bring joy to children in Martin County by adopting them for Christmas. 
          Every child deserves to experience the wonder of the holiday season.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/wishlists">
            <Button
              size="lg"
              className="bg-white/95 text-red-600 hover:bg-white text-lg px-8 py-3 rounded-full font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Gift className="h-5 w-5 mr-2" />
              Browse Wishlists
            </Button>
          </Link>
          <div className="text-center">
            <p className="text-sm text-white/90 drop-shadow-sm">No registration required to browse</p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="bg-white/25 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white drop-shadow-sm">Choose a Child</h3>
            <p className="text-sm text-white/95 drop-shadow-sm">Browse profiles and find a child whose story touches your heart</p>
          </div>
          <div className="text-center">
            <div className="bg-white/25 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Gift className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white drop-shadow-sm">Fulfill Wishes</h3>
            <p className="text-sm text-white/95 drop-shadow-sm">Purchase gifts from their wishlist and make their dreams come true</p>
          </div>
          <div className="text-center">
            <div className="bg-white/25 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Snowflake className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white drop-shadow-sm">Spread Joy</h3>
            <p className="text-sm text-white/95 drop-shadow-sm">Experience the magic of giving and create lasting Christmas memories</p>
          </div>
        </div>
      </div>
    </section>
  );
};
