
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Gift, Star, Users, Calendar, MapPin, Handshake } from "lucide-react";

interface StatsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  statType: "children" | "adopted" | "donors" | "gifts" | null;
}

export const StatsModal = ({ open, onOpenChange, statType }: StatsModalProps) => {
  const getStatContent = () => {
    switch (statType) {
      case "children":
        return {
          icon: Users,
          title: "Children Helped",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          description: "Since our founding, we've helped hundreds of children in Martin County experience the joy of Christmas.",
          details: [
            "Children from ages 2-17 participate in our program",
            "Each child creates a personalized wishlist",
            "We work with local schools and organizations to identify families in need",
            "All children receive age-appropriate gifts based on their interests"
          ]
        };
      case "adopted":
        return {
          icon: Heart,
          title: "Children Adopted for Christmas",
          color: "text-red-600",
          bgColor: "bg-red-50",
          description: "These are the children who have been matched with generous donors who have committed to fulfilling their Christmas wishes.",
          details: [
            "Each adoption includes 2-3 gifts per child",
            "Donors can choose to remain anonymous or connect with families",
            "Adoptions are processed within 24-48 hours",
            "Follow-up support ensures gifts are delivered on time"
          ]
        };
      case "donors":
        return {
          icon: Star,
          title: "Generous Donors",
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          description: "Our amazing community of donors makes the magic happen. From individuals to families to local businesses, everyone contributes.",
          details: [
            "Donors range from individuals to corporate sponsors",
            "Many donors return year after year to help",
            "Some donors adopt multiple children",
            "Local businesses often sponsor entire families"
          ]
        };
      case "gifts":
        return {
          icon: Gift,
          title: "Gifts Delivered",
          color: "text-green-600",
          bgColor: "bg-green-50",
          description: "Every gift represents a moment of joy and the spirit of giving that defines our community.",
          details: [
            "Gifts range from toys and clothes to books and educational materials",
            "All gifts are wrapped and ready for Christmas morning",
            "Delivery is coordinated with families for convenience",
            "Special care is taken to ensure gifts match each child's interests"
          ]
        };
      default:
        return null;
    }
  };

  const content = getStatContent();

  if (!content) return null;

  const IconComponent = content.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3 text-2xl">
            <div className={`p-3 rounded-full ${content.bgColor}`}>
              <IconComponent className={`h-8 w-8 ${content.color}`} />
            </div>
            <span className={content.color}>{content.title}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <p className="text-gray-700 text-lg leading-relaxed">
            {content.description}
          </p>
          
          <Card className={`${content.bgColor} border-none`}>
            <CardContent className="p-6">
              <h4 className={`font-semibold mb-4 ${content.color}`}>Key Details:</h4>
              <ul className="space-y-2">
                {content.details.map((detail, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className={`w-2 h-2 rounded-full ${content.color.replace('text-', 'bg-')} mt-2 flex-shrink-0`} />
                    <span className="text-gray-700">{detail}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="flex items-center space-x-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
            <Calendar className="h-4 w-4" />
            <span>Program runs annually from November through December</span>
            <MapPin className="h-4 w-4 ml-4" />
            <span>Serving all of Martin County, Florida</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
