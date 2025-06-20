
import { Mail, MapPin, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const ContactInfo = () => {
  return (
    <Card className="bg-white shadow-lg border-0">
      <CardContent className="p-8">
        <div className="flex items-center space-x-3 mb-6">
          <Heart className="h-8 w-8 text-christmas-red-500" />
          <h2 className="text-2xl font-bold text-christmas-green-800 font-dancing">
            Get in Touch
          </h2>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <Mail className="h-6 w-6 text-christmas-green-600 mt-1" />
            <div>
              <h3 className="font-semibold text-christmas-green-800 mb-1">Email Us</h3>
              <p className="text-christmas-brown-700">info@candycanekindness.com</p>
              <p className="text-sm text-christmas-brown-600 mt-1">
                We typically respond within 24 hours
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <MapPin className="h-6 w-6 text-christmas-green-600 mt-1" />
            <div>
              <h3 className="font-semibold text-christmas-green-800 mb-1">Service Area</h3>
              <p className="text-christmas-brown-700">Treasure Coast, Florida</p>
              <p className="text-sm text-christmas-brown-600 mt-1">
                Serving Martin, St. Lucie, and Indian River Counties
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-christmas-green-50 rounded-lg">
          <h3 className="font-semibold text-christmas-green-800 mb-3">
            Ways to Get Involved
          </h3>
          <ul className="space-y-2 text-christmas-brown-700">
            <li>• Adopt a child for Christmas</li>
            <li>• Volunteer during the holidays</li>
            <li>• Partner with us as an organization</li>
            <li>• Spread the word in your community</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
