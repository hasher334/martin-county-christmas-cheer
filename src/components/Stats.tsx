
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Gift, Star, Users } from "lucide-react";

export const Stats = () => {
  const [stats, setStats] = useState({
    totalChildren: 0,
    adoptedChildren: 0,
    totalDonors: 0,
    deliveredGifts: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get total children
      const { count: totalChildren } = await supabase
        .from("children")
        .select("*", { count: "exact", head: true });

      // Get adopted children
      const { count: adoptedChildren } = await supabase
        .from("children")
        .select("*", { count: "exact", head: true })
        .neq("status", "available");

      // Get total donors
      const { count: totalDonors } = await supabase
        .from("donors")
        .select("*", { count: "exact", head: true });

      // Get delivered gifts
      const { count: deliveredGifts } = await supabase
        .from("adoptions")
        .select("*", { count: "exact", head: true })
        .eq("gift_delivered", true);

      setStats({
        totalChildren: totalChildren || 0,
        adoptedChildren: adoptedChildren || 0,
        totalDonors: totalDonors || 0,
        deliveredGifts: deliveredGifts || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const statItems = [
    {
      icon: Users,
      label: "Children Helped",
      value: stats.totalChildren,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Heart,
      label: "Children Adopted",
      value: stats.adoptedChildren,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      icon: Star,
      label: "Generous Donors",
      value: stats.totalDonors,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      icon: Gift,
      label: "Gifts Delivered",
      value: stats.deliveredGifts,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-green-800 mb-8">
          Our Christmas Impact
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {statItems.map((item, index) => (
            <Card key={index} className={`${item.bgColor} border-none shadow-lg hover:shadow-xl transition-shadow duration-300`}>
              <CardContent className="p-6 text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${item.color} bg-white mb-4`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <div className={`text-3xl font-bold ${item.color} mb-2`}>
                  {item.value}
                </div>
                <div className="text-gray-700 font-medium">
                  {item.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
