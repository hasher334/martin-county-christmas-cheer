
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Heart, Gift, Clock, TrendingUp } from 'lucide-react';

interface AdminStatsData {
  total_children: number;
  available_children: number;
  adopted_children: number;
  pending_applications: number;
  total_donors: number;
}

export const AdminStats = () => {
  const [stats, setStats] = useState<AdminStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_admin_stats');
      
      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setStats(data[0]);
      }
      setError(null);
    } catch (error: any) {
      console.error('Error fetching admin stats:', error);
      setError(error.message || 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Failed to load statistics</p>
        <button
          onClick={fetchStats}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Children',
      value: stats?.total_children || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Available Children',
      value: stats?.available_children || 0,
      icon: Heart,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Adopted Children',
      value: stats?.adopted_children || 0,
      icon: Gift,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Pending Applications',
      value: stats?.pending_applications || 0,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className={`${stat.bgColor} border-none`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className={`text-3xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.color} bg-white`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            System Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Total Donors</h4>
              <p className="text-2xl font-bold text-christmas-green-600">
                {stats?.total_donors || 0}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Adoption Rate</h4>
              <p className="text-2xl font-bold text-christmas-red-600">
                {stats?.total_children ? 
                  Math.round((stats.adopted_children / stats.total_children) * 100) : 0}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
