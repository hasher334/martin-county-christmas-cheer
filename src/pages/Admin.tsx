
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Activity, RefreshCw } from "lucide-react";
import { AdminDashboardStats } from "@/components/admin/AdminDashboardStats";
import { ApplicationManagement } from "@/components/admin/ApplicationManagement";
import { UserManagement } from "@/components/admin/UserManagement";
import { DonationManagement } from "@/components/admin/DonationManagement";
import { AuditLogs } from "@/components/admin/AuditLogs";
import { NotificationCenter } from "@/components/admin/NotificationCenter";
import { useEffect } from "react";

export default function Admin() {
  const navigate = useNavigate();
  const { user, isAdmin, loading, authError, signOut, refetch } = useAdminAuth();

  // Debug logging
  useEffect(() => {
    console.log('Admin component: Auth state updated', { 
      userEmail: user?.email, 
      isAdmin, 
      loading, 
      authError 
    });
  }, [user, isAdmin, loading, authError]);

  // Redirect non-authenticated users
  useEffect(() => {
    if (!loading && !user && !authError) {
      console.log('Admin component: No user found, redirecting to home');
      navigate('/');
    }
  }, [user, loading, authError, navigate]);

  // Redirect non-admin users
  useEffect(() => {
    if (!loading && user && !isAdmin && !authError) {
      console.log('Admin component: User is not admin, redirecting to home');
      navigate('/');
    }
  }, [user, isAdmin, loading, authError, navigate]);

  if (loading) {
    console.log('Admin component: Showing loading spinner');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying admin access...</p>
          <Button 
            variant="outline" 
            onClick={refetch} 
            className="mt-4"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (authError) {
    console.log('Admin component: Showing auth error');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Authentication Error</h2>
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Button onClick={refetch} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Authentication
              </Button>
              <Button variant="outline" onClick={() => navigate('/')} className="w-full">
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    console.log('Admin component: No user, showing redirect message');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-4">Please sign in to access the admin panel.</p>
            <Button onClick={() => navigate('/')}>
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    console.log('Admin component: User is not admin, showing access denied');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">You don't have permission to access this area.</p>
            <Button onClick={() => navigate('/')}>
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  console.log('Admin component: Rendering admin dashboard');
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
              <Button 
                variant="outline" 
                onClick={signOut}
                className="text-sm"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
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
