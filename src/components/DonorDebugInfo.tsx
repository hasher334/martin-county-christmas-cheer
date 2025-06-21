
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Bug, RefreshCw } from "lucide-react";

interface DonorDebugInfoProps {
  user: any;
}

export const DonorDebugInfo = ({ user }: DonorDebugInfoProps) => {
  const [debugData, setDebugData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchDebugData = async () => {
    if (!user?.id || !user?.email) return;

    setLoading(true);
    try {
      // Get all donors with this email
      const { data: donorsByEmail } = await supabase
        .from("donors")
        .select("*")
        .eq("email", user.email);

      // Get donor by user_id
      const { data: donorByUserId } = await supabase
        .from("donors")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      // Get all adoptions for all donors with this email
      const { data: allAdoptions } = await supabase
        .from("adoptions")
        .select(`
          *,
          children (*),
          donors (*)
        `)
        .in("donor_id", donorsByEmail?.map(d => d.id) || []);

      setDebugData({
        user: {
          id: user.id,
          email: user.email,
          metadata: user.user_metadata
        },
        donorsByEmail,
        donorByUserId,
        allAdoptions,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Debug fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && isOpen) {
      fetchDebugData();
    }
  }, [user, isOpen]);

  if (!user) return null;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" size="sm" className="mb-4">
          <Bug className="h-4 w-4 mr-2" />
          Debug Info
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-orange-800">Debug Information</CardTitle>
              <Button onClick={fetchDebugData} disabled={loading} size="sm" variant="outline">
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="text-xs space-y-3">
            {debugData ? (
              <>
                <div>
                  <strong>Current User:</strong>
                  <pre className="mt-1 p-2 bg-white rounded text-xs overflow-auto">
                    {JSON.stringify(debugData.user, null, 2)}
                  </pre>
                </div>
                
                <div>
                  <strong>Donors by Email ({debugData.donorsByEmail?.length || 0}):</strong>
                  <pre className="mt-1 p-2 bg-white rounded text-xs overflow-auto max-h-32">
                    {JSON.stringify(debugData.donorsByEmail, null, 2)}
                  </pre>
                </div>

                <div>
                  <strong>Donor by User ID:</strong>
                  <pre className="mt-1 p-2 bg-white rounded text-xs overflow-auto">
                    {JSON.stringify(debugData.donorByUserId, null, 2)}
                  </pre>
                </div>

                <div>
                  <strong>All Adoptions ({debugData.allAdoptions?.length || 0}):</strong>
                  <pre className="mt-1 p-2 bg-white rounded text-xs overflow-auto max-h-32">
                    {JSON.stringify(debugData.allAdoptions, null, 2)}
                  </pre>
                </div>

                <Badge variant="outline" className="text-xs">
                  Last updated: {new Date(debugData.timestamp).toLocaleTimeString()}
                </Badge>
              </>
            ) : (
              <p className="text-orange-700">Click refresh to load debug data...</p>
            )}
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
};
