
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Gift, Star, Users } from "lucide-react";
import { StatsModal } from "@/components/StatsModal";

export const Stats = () => {
  const [stats, setStats] = useState({
    totalChildren: 0,
    adoptedChildren: 0,
    totalDonors: 0,
    deliveredGifts: 0,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStat, setSelectedStat] = useState<"children" | "adopted" | "donors" | "gifts" | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Use the dashboard_stats view for some metrics and fetch others directly
      const { data: dashboardData, error: dashboardError } = await supabase
        .from("dashboard_stats")
        .select("*")
        .single();

      if (dashboardError) {
        console.error("Error fetching dashboard stats:", dashboardError);
      }

      // Get total donors
      const { count: totalDonors } = await supabase
        .from("donors")
        .select("*", { count: "exact", head: true });

      // Get delivered gifts
      const { count: deliveredGifts } = await supabase
        .from("adoptions")
        .select("*", { count: "exact", head: true })
        .eq("gift_delivered", true);

      // Calculate total children (available + adopted)
      const totalChildren = (dashboardData?.available_children || 0) + (dashboardData?.adopted_children || 0);

      setStats({
        totalChildren: totalChildren,
        adoptedChildren: dashboardData?.adopted_children || 0,
        totalDonors: totalDonors || 0,
        deliveredGifts: deliveredGifts || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleStatClick = (statType: "children" | "adopted" | "donors" | "gifts") => {
    setSelectedStat(statType);
    setModalOpen(true);
  };

  const statItems = [
    {
      icon: Users,
      label: "Children Helped",
      value: stats.totalChildren,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      type: "children" as const,
    },
    {
      icon: Heart,
      label: "Children Adopted",
      value: stats.adoptedChildren,
      color: "text-red-600",
      bgColor: "bg-red-50",
      type: "adopted" as const,
    },
    {
      icon: Star,
      label: "Generous Donors",
      value: stats.totalDonors,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      type: "donors" as const,
    },
    {
      icon: Gift,
      label: "Gifts Delivered",
      value: stats.deliveredGifts,
      color: "text-green-600",
      bgColor: "bg-green-50",
      type: "gifts" as const,
    },
  ];

  return (
    <>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-8">
            Our Christmas Impact
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {statItems.map((item, index) => (
              <Card 
                key={index} 
                className={`${item.bgColor} border-none shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105`}
                onClick={() => handleStatClick(item.type)}
              >
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
                  <div className="text-xs text-gray-500 mt-2">
                    Click to learn more
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <StatsModal 
        open={modalOpen}
        onOpenChange={setModalOpen}
        statType={selectedStat}
      />
    </>
  );
};
