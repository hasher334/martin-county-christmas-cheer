
import { Button } from "@/components/ui/button";
import { Star, Gift, Heart } from "lucide-react";

export const Hero = () => {
  const scrollToChildren = () => {
    const element = document.querySelector('[data-section="children"]');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative py-20 bg-gradient-to-r from-red-600 via-red-500 to-green-600 text-white overflow-hidden">
      {/* Floating Christmas Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          >
            {i % 3 === 0 ? (
              <Star className="h-4 w-4 text-yellow-300" />
            ) : i % 3 === 1 ? (
              <Gift className="h-4 w-4 text-green-200" />
            ) : (
              <Heart className="h-3 w-3 text-red-200" />
            )}
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
          Make Christmas Magical
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
          Help bring joy to children in Martin County by adopting them for Christmas. 
          Every child deserves to experience the wonder of the holiday season.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            onClick={scrollToChildren}
            className="bg-white text-red-600 hover:bg-gray-100 text-lg px-8 py-3 rounded-full font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <Gift className="h-5 w-5 mr-2" />
            Browse Children
          </Button>
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
              <Star className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Spread Joy</h3>
            <p className="text-sm opacity-90">Experience the magic of giving and create lasting Christmas memories</p>
          </div>
        </div>
      </div>
    </section>
  );
};
