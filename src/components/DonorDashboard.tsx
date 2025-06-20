
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useToast } from "@/components/ui/use-toast";
import { Gift, Heart, User, Mail, Phone, MapPin, Calendar } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Child = Tables<"children">;
type Adoption = Tables<"adoptions">;
type Donor = Tables<"donors">;

interface AdoptionWithChild extends Adoption {
  children: Child;
}

interface DonorDashboardProps {
  user: any;
}

export const DonorDashboard = ({ user }: DonorDashboardProps) => {
  const [adoptions, setAdoptions] = useState<AdoptionWithChild[]>([]);
  const [donorProfile, setDonorProfile] = useState<Donor | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchDonorData();
    }
  }, [user]);

  const fetchDonorData = async () => {
    try {
      setLoading(true);
      
      // First, get the donor profile
      const { data: donor, error: donorError } = await supabase
        .from("donors")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (donorError) {
        console.error("Error fetching donor profile:", donorError);
        return;
      }

      setDonorProfile(donor);

      // Then get all adoptions for this donor with child details
      const { data: adoptionsData, error: adoptionsError } = await supabase
        .from("adoptions")
        .select(`
          *,
          children (*)
        `)
        .eq("donor_id", donor.id)
        .order("adopted_at", { ascending: false });

      if (adoptionsError) {
        console.error("Error fetching adoptions:", adoptionsError);
        throw adoptionsError;
      }

      setAdoptions(adoptionsData as AdoptionWithChild[] || []);
      
    } catch (error) {
      console.error("Error fetching donor data:", error);
      toast({
        title: "Error",
        description: "Failed to load your adoption activity. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContactFamily = (childName: string) => {
    toast({
      title: "Contact Request",
      description: `We'll help you get in touch regarding ${childName}. Check your email for contact details.`,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <LoadingSpinner message="Loading your adoption activity..." />;
  }

  if (!donorProfile) {
    return (
      <div className="text-center py-12">
        <Heart className="h-16 w-16 text-christmas-red-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-christmas-green-800 mb-2">No Donor Profile Found</h2>
        <p className="text-christmas-brown-700">
          You haven't adopted any children yet. Start spreading Christmas joy by browsing our wishlists!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Donor Profile Summary */}
      <Card className="bg-gradient-to-r from-christmas-green-50 to-christmas-red-50 border-christmas-green-200">
        <CardHeader>
          <CardTitle className="flex items-center text-christmas-green-800">
            <User className="h-6 w-6 mr-2" />
            Your Donor Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-christmas-green-700 mb-2">Contact Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-christmas-green-600" />
                  <span>{donorProfile.name}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-christmas-green-600" />
                  <span>{donorProfile.email}</span>
                </div>
                {donorProfile.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-christmas-green-600" />
                    <span>{donorProfile.phone}</span>
                  </div>
                )}
                {donorProfile.address && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-christmas-green-600" />
                    <span>{donorProfile.address}</span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-christmas-green-700 mb-2">Impact Summary</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-christmas-brown-700">Children Adopted:</span>
                  <Badge className="bg-christmas-red-100 text-christmas-red-700">
                    {adoptions.length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-christmas-brown-700">Gifts Delivered:</span>
                  <Badge className="bg-christmas-green-100 text-christmas-green-700">
                    {adoptions.filter(a => a.gift_delivered).length}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Adoptions List */}
      <div>
        <h2 className="text-2xl font-bold text-christmas-green-800 mb-6 flex items-center">
          <Gift className="h-6 w-6 mr-2" />
          Your Christmas Adoptions
        </h2>

        {adoptions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Gift className="h-16 w-16 text-christmas-red-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-christmas-green-800 mb-2">
                No Adoptions Yet
              </h3>
              <p className="text-christmas-brown-700 mb-4">
                Start your Christmas giving journey by adopting a child from our wishlist!
              </p>
              <Button className="bg-christmas-red-600 hover:bg-christmas-red-700">
                Browse Wishlists
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {adoptions.map((adoption) => (
              <Card key={adoption.id} className="border-christmas-green-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-christmas-green-800 flex items-center">
                      <Heart className="h-5 w-5 mr-2 text-christmas-red-500" />
                      {adoption.children.name}
                    </CardTitle>
                    <Badge 
                      className={
                        adoption.gift_delivered 
                          ? "bg-green-100 text-green-700" 
                          : "bg-yellow-100 text-yellow-700"
                      }
                    >
                      {adoption.gift_delivered ? "Delivered" : "Pending"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center text-sm text-christmas-brown-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      Adopted on {formatDate(adoption.adopted_at || "")}
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-christmas-green-700 mb-2">Child Details:</h4>
                      <div className="text-sm text-christmas-brown-700 space-y-1">
                        <p><strong>Age:</strong> {adoption.children.age} years old</p>
                        <p><strong>Gender:</strong> {adoption.children.gender}</p>
                        {adoption.children.location && (
                          <p><strong>Location:</strong> {adoption.children.location}</p>
                        )}
                      </div>
                    </div>

                    {adoption.children.wishes && adoption.children.wishes.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-christmas-green-700 mb-2">Christmas Wishes:</h4>
                        <div className="flex flex-wrap gap-1">
                          {adoption.children.wishes.map((wish, index) => (
                            <Badge 
                              key={index} 
                              variant="outline" 
                              className="text-xs border-christmas-red-200 text-christmas-red-700"
                            >
                              {wish}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {adoption.notes && (
                      <div>
                        <h4 className="font-semibold text-christmas-green-700 mb-2">Your Message:</h4>
                        <p className="text-sm text-christmas-brown-700 italic">
                          "{adoption.notes}"
                        </p>
                      </div>
                    )}

                    <div className="pt-4 border-t border-christmas-green-100">
                      <Button
                        onClick={() => handleContactFamily(adoption.children.name)}
                        variant="outline"
                        size="sm"
                        className="w-full border-christmas-green-300 text-christmas-green-700 hover:bg-christmas-green-50"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Contact Family
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
