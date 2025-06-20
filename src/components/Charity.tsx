
import { Heart, Users, Gift, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const Charity = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-christmas-cream to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-christmas-green-800 mb-6">
            About Candy Cane Kindness
          </h2>
          <p className="text-xl text-christmas-brown-700 mb-8 max-w-4xl mx-auto">
            For over a decade, Candy Cane Kindness has been dedicated to ensuring that every child in our community experiences the magic and joy of Christmas, regardless of their family's financial circumstances.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-2xl font-bold text-christmas-green-800 mb-6">Our Mission</h3>
            <p className="text-lg text-christmas-brown-700 mb-6">
              We believe that every child deserves to wake up on Christmas morning with gifts under the tree. Our mission is to connect generous community members with families in need, creating lasting bonds and spreading holiday joy throughout the Treasure Coast.
            </p>
            <p className="text-lg text-christmas-brown-700 mb-6">
              Through our Christmas adoption program, we provide a platform where donors can "adopt" children for the holidays, purchasing gifts from their carefully curated wishlists and helping to create magical Christmas memories.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h4 className="text-xl font-semibold text-christmas-green-800 mb-4">How We Help</h4>
            <ul className="space-y-3 text-christmas-brown-700">
              <li className="flex items-start space-x-3">
                <Heart className="h-5 w-5 text-christmas-red-500 mt-1 flex-shrink-0" />
                <span>Connect caring donors with children in need</span>
              </li>
              <li className="flex items-start space-x-3">
                <Gift className="h-5 w-5 text-christmas-green-600 mt-1 flex-shrink-0" />
                <span>Coordinate gift collection and distribution</span>
              </li>
              <li className="flex items-start space-x-3">
                <Users className="h-5 w-5 text-christmas-brown-600 mt-1 flex-shrink-0" />
                <span>Partner with local organizations and schools</span>
              </li>
              <li className="flex items-start space-x-3">
                <Star className="h-5 w-5 text-yellow-500 mt-1 flex-shrink-0" />
                <span>Create lasting positive impact in our community</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center bg-christmas-green-50 rounded-lg p-8">
          <h4 className="text-2xl font-bold text-christmas-green-800 mb-4">
            Join Our Community of Givers
          </h4>
          <p className="text-lg text-christmas-brown-700 max-w-3xl mx-auto">
            Whether you're adopting a child for Christmas, volunteering your time, or spreading the word about our mission, 
            every contribution helps us bring more joy to families throughout the Treasure Coast. Together, we can ensure that no child 
            goes without the magic of Christmas.
          </p>
        </div>
      </div>
    </section>
  );
};
