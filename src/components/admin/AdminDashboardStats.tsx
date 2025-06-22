
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Gift, DollarSign, Heart, TrendingUp } from "lucide-react";

interface DashboardStat {
  stat_name: string;
  stat_value: number;
  stat_description: string;
}

export const AdminDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase.rpc('get_admin_dashboard_data');
      if (error) throw error;
      setStats(data || []);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatIcon = (statName: string) => {
    switch (statName) {
      case 'available_children':
        return <Users className="h-6 w-6" />;
      case 'pending_applications':
        return <FileText className="h-6 w-6" />;
      case 'new_donors_week':
        return <Heart className="h-6 w-6" />;
      case 'total_donations_month':
        return <DollarSign className="h-6 w-6" />;
      default:
        return <TrendingUp className="h-6 w-6" />;
    }
  };

  const getStatColor = (statName: string) => {
    switch (statName) {
      case 'available_children':
        return 'text-blue-600 bg-blue-50';
      case 'pending_applications':
        return 'text-yellow-600 bg-yellow-50';
      case 'new_donors_week':
        return 'text-green-600 bg-green-50';
      case 'total_donations_month':
        return 'text-purple-600 bg-purple-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatStatValue = (statName: string, value: number) => {
    if (statName === 'total_donations_month') {
      return `$${(value / 100).toFixed(2)}`;
    }
    return value.toString();
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.stat_name} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.stat_description}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatStatValue(stat.stat_name, stat.stat_value)}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${getStatColor(stat.stat_name)}`}>
                  {getStatIcon(stat.stat_name)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">Manage Children</h4>
                  <p className="text-sm text-gray-600">Add or edit child profiles</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">Review Applications</h4>
                  <p className="text-sm text-gray-600">Process pending applications</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Gift className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium">Track Deliveries</h4>
                  <p className="text-sm text-gray-600">Update gift delivery status</p>
                </div>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
