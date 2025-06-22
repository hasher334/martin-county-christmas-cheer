
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Mail, AlertCircle, CheckCircle, Clock } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Notification = Tables<"notifications">;

export const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchNotifications();
  }, [typeFilter]);

  const fetchNotifications = async () => {
    try {
      let query = supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });

      if (typeFilter !== "all") {
        query = query.eq("type", typeFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "application_status":
        return <AlertCircle className="h-4 w-4" />;
      case "donation_receipt":
        return <CheckCircle className="h-4 w-4" />;
      case "adoption_confirmation":
        return <Mail className="h-4 w-4" />;
      case "admin_alert":
        return <Bell className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "application_status":
        return <Badge variant="outline" className="text-blue-600">Application</Badge>;
      case "donation_receipt":
        return <Badge variant="outline" className="text-green-600">Donation</Badge>;
      case "adoption_confirmation":
        return <Badge variant="outline" className="text-purple-600">Adoption</Badge>;
      case "admin_alert":
        return <Badge variant="outline" className="text-red-600">Admin Alert</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getStatusBadge = (notification: Notification) => {
    if (notification.sent_at) {
      return <Badge className="bg-green-100 text-green-800">Sent</Badge>;
    } else if (notification.error_message) {
      return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
    } else {
      return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const sentCount = notifications.filter(n => n.sent_at).length;
  const pendingCount = notifications.filter(n => !n.sent_at && !n.error_message).length;
  const failedCount = notifications.filter(n => n.error_message).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Sent</p>
                <p className="text-3xl font-bold text-green-600">{sentCount}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Failed</p>
                <p className="text-3xl font-bold text-red-600">{failedCount}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Notification History</CardTitle>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="application_status">Application Status</SelectItem>
                <SelectItem value="donation_receipt">Donation Receipt</SelectItem>
                <SelectItem value="adoption_confirmation">Adoption Confirmation</SelectItem>
                <SelectItem value="admin_alert">Admin Alert</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No notifications found
              </div>
            ) : (
              notifications.map((notification) => (
                <Card key={notification.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getTypeIcon(notification.type)}
                          <h4 className="font-medium text-gray-900">{notification.subject}</h4>
                          {getTypeBadge(notification.type)}
                          {getStatusBadge(notification)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{notification.content}</p>
                        <div className="flex items-center text-xs text-gray-500 space-x-4">
                          <span>Created: {new Date(notification.created_at || "").toLocaleString()}</span>
                          {notification.sent_at && (
                            <span>Sent: {new Date(notification.sent_at).toLocaleString()}</span>
                          )}
                        </div>
                        {notification.error_message && (
                          <p className="text-xs text-red-600 mt-1">
                            Error: {notification.error_message}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
