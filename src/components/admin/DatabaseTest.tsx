
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Database, CheckCircle, XCircle } from "lucide-react";

export const DatabaseTest = () => {
  const [testResults, setTestResults] = useState<{
    children: { success: boolean; count?: number; error?: string };
    auth: { success: boolean; user?: any; error?: string };
  } | null>(null);
  const [testing, setTesting] = useState(false);

  const runTests = async () => {
    setTesting(true);
    console.log('🧪 Running database connectivity tests...');
    
    const results = {
      children: { success: false, count: 0, error: '' },
      auth: { success: false, user: null, error: '' }
    };

    // Test 1: Children table access
    try {
      const { data, error, count } = await supabase
        .from('children')
        .select('*', { count: 'exact' });
      
      if (error) {
        results.children = { success: false, error: error.message };
        console.error('❌ Children table test failed:', error);
      } else {
        results.children = { success: true, count: count || 0 };
        console.log('✅ Children table test passed:', { count, dataLength: data?.length });
      }
    } catch (err) {
      results.children = { success: false, error: 'Connection failed' };
      console.error('❌ Children table connection error:', err);
    }

    // Test 2: Auth check
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        results.auth = { success: false, error: error.message };
        console.error('❌ Auth test failed:', error);
      } else {
        results.auth = { success: true, user };
        console.log('✅ Auth test passed:', { userEmail: user?.email });
      }
    } catch (err) {
      results.auth = { success: false, error: 'Auth check failed' };
      console.error('❌ Auth connection error:', err);
    }

    setTestResults(results);
    setTesting(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Connectivity Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span>Test Status:</span>
          <Button 
            onClick={runTests} 
            disabled={testing}
            variant="outline"
            size="sm"
          >
            {testing ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {testing ? 'Testing...' : 'Run Tests'}
          </Button>
        </div>

        {testResults && (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                {testResults.children.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="font-medium">Children Table Access</span>
              </div>
              <div className="flex items-center gap-2">
                {testResults.children.success ? (
                  <Badge variant="default">
                    {testResults.children.count} records
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    {testResults.children.error}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                {testResults.auth.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="font-medium">Authentication</span>
              </div>
              <div className="flex items-center gap-2">
                {testResults.auth.success ? (
                  <Badge variant="default">
                    {testResults.auth.user?.email || 'Authenticated'}
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    {testResults.auth.error}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
          <p><strong>Debug Info:</strong></p>
          <p>Project URL: https://urbpoknwecnkhnukzxcb.supabase.co</p>
          <p>Current Route: /admin</p>
          <p>Timestamp: {new Date().toISOString()}</p>
        </div>
      </CardContent>
    </Card>
  );
};
