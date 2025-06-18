
import { Button } from "@/components/ui/button";
import { Star, Gift, Heart, Snowflake } from "lucide-react";

export const Hero = () => {
  const scrollToChildren = () => {
    const element = document.querySelector('[data-section="children"]');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative py-24 bg-gradient-to-br from-red-700 via-red-600 to-green-700 text-white overflow-hidden">
      {/* Christmas Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Christmas Elements */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          >
            {i % 4 === 0 ? (
              <Star className="h-6 w-6 text-yellow-300 sparkle" />
            ) : i % 4 === 1 ? (
              <Gift className="h-5 w-5 text-yellow-200" />
            ) : i % 4 === 2 ? (
              <Heart className="h-4 w-4 text-red-200" />
            ) : (
              <Snowflake className="h-5 w-5 text-blue-100" />
            )}
          </div>
        ))}
        
        {/* Christmas Garland Pattern */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-r from-green-600 via-red-500 to-green-600 opacity-60"></div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-r from-green-600 via-red-500 to-green-600 opacity-60"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Main Heading with Christmas Styling */}
        <div className="mb-8">
          <div className="flex justify-center items-center space-x-4 text-6xl mb-4">
            <span className="twinkle">🎄</span>
            <span className="twinkle">🎅</span>
            <span className="twinkle">🎄</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-yellow-300 via-white to-yellow-300 bg-clip-text text-transparent drop-shadow-2xl">
            Make Christmas Magical
          </h1>
          <div className="flex justify-center items-center space-x-4 text-6xl mb-6">
            <span className="twinkle">⭐</span>
            <span className="twinkle">🎁</span>
            <span className="twinkle">⭐</span>
          </div>
        </div>
        
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 mb-10 border-2 border-white/30 christmas-glow">
          <p className="text-2xl md:text-3xl mb-8 max-w-4xl mx-auto font-semibold leading-relaxed">
            🌟 Help bring joy to children in Martin County by adopting them for Christmas 🌟
            <br />
            <span className="text-yellow-200">Every child deserves to experience the wonder of the holiday season!</span>
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
          <Button
            size="lg"
            onClick={scrollToChildren}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-xl px-12 py-4 rounded-full font-bold shadow-2xl transform hover:scale-110 transition-all duration-300 border-4 border-white/30 christmas-glow-green"
          >
            <Gift className="h-6 w-6 mr-3" />
            🎄 Browse Our Christmas Tree 🎄
          </Button>
          <div className="text-center bg-white/20 rounded-xl p-4 backdrop-blur-sm">
            <p className="text-lg font-semibold">✨ No registration required to browse ✨</p>
          </div>
        </div>

        {/* Christmas Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="text-center bg-white/20 backdrop-blur-md rounded-2xl p-8 border-2 border-red-300/50 christmas-glow-red">
            <div className="bg-red-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Heart className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-yellow-200">🎅 Choose a Child</h3>
            <p className="text-lg leading-relaxed">Browse our magical Christmas tree and find a child whose story touches your heart ❤️</p>
          </div>
          
          <div className="text-center bg-white/20 backdrop-blur-md rounded-2xl p-8 border-2 border-green-300/50 christmas-glow-green">
            <div className="bg-green-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Gift className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-yellow-200">🎁 Fulfill Wishes</h3>
            <p className="text-lg leading-relaxed">Purchase gifts from their wishlist and make their Christmas dreams come true! 🌟</p>
          </div>
          
          <div className="text-center bg-white/20 backdrop-blur-md rounded-2xl p-8 border-2 border-yellow-300/50 christmas-glow">
            <div className="bg-yellow-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Star className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-yellow-200">⭐ Spread Joy</h3>
            <p className="text-lg leading-relaxed">Experience the magic of giving and create lasting Christmas memories! ✨</p>
          </div>
        </div>

        {/* Christmas Decoration Border */}
        <div className="mt-12 flex justify-center items-center space-x-6 text-5xl">
          <span className="twinkle">🎄</span>
          <span className="twinkle">🎅</span>
          <span className="twinkle">🤶</span>
          <span className="twinkle">🎁</span>
          <span className="twinkle">⭐</span>
          <span className="twinkle">🔔</span>
          <span className="twinkle">🎄</span>
        </div>
      </div>
    </section>
  );
};
