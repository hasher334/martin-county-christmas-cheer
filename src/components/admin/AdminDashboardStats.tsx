
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Gift, DollarSign, Heart, TrendingUp } from "lucide-react";

interface DashboardStats {
  available_children: number;
  pending_applications: number;
  new_donors_this_month: number;
  donations_this_month: number;
  adopted_children: number;
  recent_adoptions: number;
}

export const AdminDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    available_children: 0,
    pending_applications: 0,
    new_donors_this_month: 0,
    donations_this_month: 0,
    adopted_children: 0,
    recent_adoptions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('dashboard_stats')
        .select('*')
        .single();
      
      if (error) throw error;
      
      if (data) {
        setStats({
          available_children: data.available_children || 0,
          pending_applications: data.pending_applications || 0,
          new_donors_this_month: data.new_donors_this_month || 0,
          donations_this_month: data.donations_this_month || 0,
          adopted_children: data.adopted_children || 0,
          recent_adoptions: data.recent_adoptions || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statItems = [
    {
      key: 'available_children',
      icon: Users,
      label: 'Available Children',
      value: stats.available_children,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      key: 'pending_applications',
      icon: FileText,
      label: 'Pending Applications',
      value: stats.pending_applications,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      key: 'new_donors_this_month',
      icon: Heart,
      label: 'New Donors This Week',
      value: stats.new_donors_this_month,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      key: 'donations_this_month',
      icon: DollarSign,
      label: 'Donations This Month',
      value: stats.donations_this_month,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      format: 'currency',
    },
  ];

  const formatValue = (value: number, format?: string) => {
    if (format === 'currency') {
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
        {statItems.map((item) => (
          <Card key={item.key} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {item.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatValue(item.value, item.format)}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${item.bgColor}`}>
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Adopted Children
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.adopted_children}
                </p>
              </div>
              <div className="p-3 rounded-full bg-red-50">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Recent Adoptions (7 days)
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.recent_adoptions}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
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
