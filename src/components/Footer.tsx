
import { Heart, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-christmas-green-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="h-6 w-6 text-christmas-red-400" />
              <h3 className="text-xl font-bold">Martin County Christmas Cheer</h3>
            </div>
            <p className="text-christmas-green-100 mb-4">
              Bringing Christmas joy to children in need throughout Martin County, Florida. 
              Every child deserves to experience the magic of Christmas.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-christmas-green-300" />
                <span className="text-christmas-green-100">info@martincountycheer.org</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-christmas-green-300" />
                <span className="text-christmas-green-100">(772) 555-CHEER</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-christmas-green-300" />
                <span className="text-christmas-green-100">Martin County, Florida</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">How It Works</h4>
            <ul className="space-y-2 text-christmas-green-100">
              <li>• Browse available children</li>
              <li>• Choose a child to adopt for Christmas</li>
              <li>• Purchase gifts from their wishlist</li>
              <li>• Deliver joy and create memories</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-christmas-green-700 mt-8 pt-8 text-center">
          <p className="text-christmas-green-200">
            © 2024 Martin County Christmas Cheer. Made with ❤️ for the children of Martin County.
          </p>
        </div>
      </div>
    </footer>
  );
};
