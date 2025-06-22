
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Plus, Edit, Trash2, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Tables } from "@/integrations/supabase/types";

type AuditLog = Tables<"audit_logs">;

export const AuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchAuditLogs();
  }, [actionFilter]);

  const fetchAuditLogs = async () => {
    try {
      let query = supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false });

      if (actionFilter !== "all") {
        query = query.eq("action_type", actionFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      toast({
        title: "Error",
        description: "Failed to load audit logs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case "INSERT":
        return <Plus className="h-4 w-4" />;
      case "UPDATE":
        return <Edit className="h-4 w-4" />;
      case "DELETE":
        return <Trash2 className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActionBadge = (actionType: string) => {
    switch (actionType) {
      case "INSERT":
        return <Badge className="bg-green-100 text-green-800">Created</Badge>;
      case "UPDATE":
        return <Badge className="bg-blue-100 text-blue-800">Updated</Badge>;
      case "DELETE":
        return <Badge className="bg-red-100 text-red-800">Deleted</Badge>;
      default:
        return <Badge variant="outline">{actionType}</Badge>;
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

  const insertCount = logs.filter(log => log.action_type === 'INSERT').length;
  const updateCount = logs.filter(log => log.action_type === 'UPDATE').length;
  const deleteCount = logs.filter(log => log.action_type === 'DELETE').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Created</p>
                <p className="text-3xl font-bold text-green-600">{insertCount}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Plus className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Updated</p>
                <p className="text-3xl font-bold text-blue-600">{updateCount}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Edit className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Deleted</p>
                <p className="text-3xl font-bold text-red-600">{deleteCount}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Audit Trail</CardTitle>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="INSERT">Created</SelectItem>
                <SelectItem value="UPDATE">Updated</SelectItem>
                <SelectItem value="DELETE">Deleted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {logs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No audit logs found
              </div>
            ) : (
              logs.map((log) => (
                <Card key={log.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          {getActionIcon(log.action_type)}
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {log.action_type} on {log.target_table}
                            </h4>
                            <div className="flex items-center text-sm text-gray-600 space-x-4">
                              <span>Admin: {log.admin_user_id.slice(0, 8)}...</span>
                              <span>{new Date(log.created_at || "").toLocaleString()}</span>
                              {log.ip_address && (
                                <span>IP: {log.ip_address.toString()}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getActionBadge(log.action_type)}
                          </div>
                        </div>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedLog(log)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Audit Log Details</DialogTitle>
                          </DialogHeader>
                          {selectedLog && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium mb-2">Action Information</h4>
                                  <div className="space-y-2 text-sm">
                                    <p><strong>Action:</strong> {selectedLog.action_type}</p>
                                    <p><strong>Table:</strong> {selectedLog.target_table}</p>
                                    <p><strong>Target ID:</strong> {selectedLog.target_id}</p>
                                    <p><strong>Admin User:</strong> {selectedLog.admin_user_id}</p>
                                    <p><strong>Timestamp:</strong> {new Date(selectedLog.created_at || "").toLocaleString()}</p>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Request Information</h4>
                                  <div className="space-y-2 text-sm">
                                    <p><strong>IP Address:</strong> {selectedLog.ip_address?.toString() || "N/A"}</p>
                                    <p><strong>User Agent:</strong> {selectedLog.user_agent || "N/A"}</p>
                                  </div>
                                </div>
                              </div>

                              {selectedLog.old_values && (
                                <div>
                                  <h4 className="font-medium mb-2">Previous Values</h4>
                                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
                                    {JSON.stringify(selectedLog.old_values, null, 2)}
                                  </pre>
                                </div>
                              )}

                              {selectedLog.new_values && (
                                <div>
                                  <h4 className="font-medium mb-2">New Values</h4>
                                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
                                    {JSON.stringify(selectedLog.new_values, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
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
