
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Gift, Users, Calendar } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface DonorOverviewProps {
  user: any;
}

export const DonorOverview = ({ user }: DonorOverviewProps) => {
  const [stats, setStats] = useState({
    totalAdoptions: 0,
    totalGiftAmount: 0,
    recentAdoptions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get donor info
        const { data: donor } = await supabase
          .from("donors")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (!donor) {
          setLoading(false);
          return;
        }

        // Get adoption stats
        const { data: adoptions } = await supabase
          .from("adoptions")
          .select(`
            *,
            children (
              name,
              age,
              location,
              photo_url
            )
          `)
          .eq("donor_id", donor.id)
          .order("adopted_at", { ascending: false });

        if (adoptions) {
          const totalGiftAmount = adoptions.reduce((sum, adoption) => 
            sum + (adoption.gift_amount || 0), 0
          );

          setStats({
            totalAdoptions: adoptions.length,
            totalGiftAmount,
            recentAdoptions: adoptions.slice(0, 3)
          });
        }
      } catch (error) {
        console.error("Error fetching donor stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user.id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-christmas-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Adoptions</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-christmas-green-700">
              {stats.totalAdoptions}
            </div>
            <p className="text-xs text-muted-foreground">
              Children you've adopted for Christmas
            </p>
          </CardContent>
        </Card>

        <Card className="border-christmas-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gifts Value</CardTitle>
            <Gift className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-christmas-green-700">
              ${stats.totalGiftAmount.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Value of gifts donated
            </p>
          </CardContent>
        </Card>

        <Card className="border-christmas-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Families Helped</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-christmas-green-700">
              {stats.totalAdoptions}
            </div>
            <p className="text-xs text-muted-foreground">
              Families touched by your generosity
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Adoptions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-christmas-green-700">Recent Adoptions</CardTitle>
          <CardDescription>
            Your most recent Christmas adoptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentAdoptions.length > 0 ? (
            <div className="space-y-4">
              {stats.recentAdoptions.map((adoption: any) => (
                <div key={adoption.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-christmas-green-100 rounded-full flex items-center justify-center">
                    <Heart className="h-6 w-6 text-christmas-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-christmas-green-700">
                      {adoption.children?.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Age {adoption.children?.age} • {adoption.children?.location}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        Adopted {new Date(adoption.adopted_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={adoption.gift_delivered ? "default" : "secondary"}>
                      {adoption.gift_delivered ? "Delivered" : "Pending"}
                    </Badge>
                    {adoption.gift_amount && (
                      <p className="text-sm text-gray-600 mt-1">
                        ${adoption.gift_amount}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No Adoptions Yet
              </h3>
              <p className="text-gray-500">
                Start making a difference by adopting a child for Christmas!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
