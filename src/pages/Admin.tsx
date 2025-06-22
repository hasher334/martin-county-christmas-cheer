
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, FileText, Gift, DollarSign, AlertCircle, Activity } from "lucide-react";
import { AdminDashboardStats } from "@/components/admin/AdminDashboardStats";
import { ApplicationManagement } from "@/components/admin/ApplicationManagement";
import { UserManagement } from "@/components/admin/UserManagement";
import { DonationManagement } from "@/components/admin/DonationManagement";
import { AuditLogs } from "@/components/admin/AuditLogs";
import { NotificationCenter } from "@/components/admin/NotificationCenter";

export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const { toast } = useToast();

  const addDebugLog = (message: string) => {
    console.log(`[Admin Debug] ${message}`);
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    addDebugLog("Admin component mounted, starting auth check");
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      addDebugLog("Starting authentication check...");
      
      const { data: { user }, error } = await supabase.auth.getUser();
      addDebugLog(`Auth getUser result - User: ${user ? 'Found' : 'None'}, Error: ${error ? error.message : 'None'}`);
      
      if (error) {
        addDebugLog(`Auth error: ${error.message}`);
        throw error;
      }

      if (!user) {
        addDebugLog("No user found, should redirect to home");
        // Don't redirect immediately in debug mode, let's see what's happening
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      addDebugLog(`User found: ${user.email} (ID: ${user.id})`);
      setUser(user);

      // Check if user is admin
      addDebugLog("Checking admin role in user_roles table...");
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (roleError && roleError.code !== 'PGRST116') {
        addDebugLog(`Role check error: ${roleError.message} (Code: ${roleError.code})`);
        console.error('Error checking admin role:', roleError);
      } else if (roleError && roleError.code === 'PGRST116') {
        addDebugLog("No admin role found in user_roles table (PGRST116 - no rows)");
      } else {
        addDebugLog(`Role data found: ${JSON.stringify(roleData)}`);
      }

      // Check email-based admin access
      const emailAdmin = user.email === 'arodseo@gmail.com';
      addDebugLog(`Email admin check: ${user.email} === 'arodseo@gmail.com' = ${emailAdmin}`);

      const adminAccess = !!roleData || emailAdmin;
      addDebugLog(`Final admin access: roleData=${!!roleData}, emailAdmin=${emailAdmin}, result=${adminAccess}`);
      
      setIsAdmin(adminAccess);

      if (!adminAccess) {
        addDebugLog("Access denied - user is not admin");
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the admin panel.",
          variant: "destructive",
        });
        // Don't redirect in debug mode
        return;
      } else {
        addDebugLog("Access granted - user is admin");
      }
    } catch (error) {
      addDebugLog(`Unexpected error in checkAuth: ${error}`);
      console.error('Auth error:', error);
      setUser(null);
      setIsAdmin(false);
    } finally {
      addDebugLog("Auth check completed, setting loading to false");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
          <div className="mt-4 text-xs text-gray-500">
            <p>Debug logs:</p>
            {debugInfo.map((log, index) => (
              <p key={index} className="font-mono text-left">{log}</p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Debug information panel for troubleshooting
  const DebugPanel = () => (
    <Card className="mb-6 border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="text-yellow-800">Debug Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <p><strong>Current URL:</strong> {window.location.href}</p>
          <p><strong>User:</strong> {user ? `${user.email} (${user.id})` : 'None'}</p>
          <p><strong>Is Admin:</strong> {isAdmin ? 'Yes' : 'No'}</p>
          <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
          <div className="mt-4">
            <strong>Debug Logs:</strong>
            <div className="bg-white p-2 rounded border max-h-40 overflow-y-auto">
              {debugInfo.map((log, index) => (
                <p key={index} className="font-mono text-xs">{log}</p>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <DebugPanel />
          <Card className="w-full">
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-gray-600 mb-4">You don't have permission to access this area.</p>
              <Button onClick={() => window.location.href = '/'}>
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Martin County Christmas Cheer Administration</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                <Activity className="h-3 w-3 mr-1" />
                Admin Access
              </Badge>
              <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <DebugPanel />
        
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="donations">Donations</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AdminDashboardStats />
          </TabsContent>

          <TabsContent value="applications">
            <ApplicationManagement />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="donations">
            <DonationManagement />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationCenter />
          </TabsContent>

          <TabsContent value="audit">
            <AuditLogs />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
