
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface NavigationBannerProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  variant: "primary" | "secondary" | "tertiary";
  imageUrl?: string;
}

export const NavigationBanner = ({ 
  title, 
  description, 
  icon: Icon, 
  href, 
  variant,
  imageUrl 
}: NavigationBannerProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-gradient-to-r from-christmas-red-600 to-christmas-red-700 text-white shadow-xl";
      case "secondary":
        return "bg-gradient-to-r from-christmas-green-600 to-christmas-green-700 text-white shadow-xl";
      case "tertiary":
        return "bg-gradient-to-r from-christmas-brown-600 to-christmas-brown-700 text-white shadow-xl";
      default:
        return "bg-gradient-to-r from-christmas-red-600 to-christmas-red-700 text-white shadow-xl";
    }
  };

  return (
    <Link to={href} className="group block touch-optimized">
      <div className={`
        relative overflow-hidden rounded-2xl p-6 md:p-8 transition-all duration-300 
        hover:shadow-2xl hover:scale-105 transform ${getVariantStyles()}
        min-h-[120px] sm:min-h-[140px] no-horizontal-scroll
      `}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/20"></div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-white/10"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex items-center space-x-3 md:space-x-4 h-full">
          <div className="bg-white/20 rounded-full p-3 md:p-4 group-hover:bg-white/30 transition-colors flex-shrink-0">
            <Icon className="h-6 w-6 md:h-8 md:w-8" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg md:text-2xl font-bold mb-1 md:mb-2 leading-tight">{title}</h3>
            <p className="text-white/90 text-sm md:text-lg leading-relaxed line-clamp-2">{description}</p>
          </div>
          
          <div className="opacity-50 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <svg 
              className="w-5 h-5 md:w-6 md:h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7" 
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};
