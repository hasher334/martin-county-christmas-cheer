
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, CheckCircle, XCircle, Clock, FileText } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Application = Tables<"applications"> & {
  children: Tables<"children"> | null;
  donors: Tables<"donors"> | null;
};

export const ApplicationManagement = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const fetchApplications = async () => {
    try {
      let query = supabase
        .from("applications")
        .select(`
          *,
          children (*),
          donors (*)
        `)
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast({
        title: "Error",
        description: "Failed to load applications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("applications")
        .update({
          status: newStatus,
          admin_notes: adminNotes,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", applicationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Application status updated successfully",
      });

      fetchApplications();
      setSelectedApplication(null);
      setAdminNotes("");
    } catch (error) {
      console.error("Error updating application:", error);
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="text-yellow-600"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "approved":
        return <Badge variant="outline" className="text-green-600"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="text-red-600"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      case "draft":
        return <Badge variant="outline" className="text-gray-600"><FileText className="h-3 w-3 mr-1" />Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Application Management</CardTitle>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {applications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No applications found
              </div>
            ) : (
              applications.map((application) => (
                <Card key={application.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {application.children?.name || "Unknown Child"}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Donor: {application.donors?.name || application.donors?.email || "Unknown"}
                            </p>
                            <p className="text-xs text-gray-500">
                              Submitted: {new Date(application.created_at || "").toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(application.status || "unknown")}
                          </div>
                        </div>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedApplication(application);
                              setAdminNotes(application.admin_notes || "");
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Review Application</DialogTitle>
                          </DialogHeader>
                          {selectedApplication && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium">Child Information</h4>
                                  <p>Name: {selectedApplication.children?.name}</p>
                                  <p>Age: {selectedApplication.children?.age}</p>
                                  <p>Gender: {selectedApplication.children?.gender}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium">Donor Information</h4>
                                  <p>Name: {selectedApplication.donors?.name}</p>
                                  <p>Email: {selectedApplication.donors?.email}</p>
                                  <p>Phone: {selectedApplication.donors?.phone || "Not provided"}</p>
                                </div>
                              </div>

                              {selectedApplication.application_data && (
                                <div>
                                  <h4 className="font-medium">Application Data</h4>
                                  <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                                    {JSON.stringify(selectedApplication.application_data, null, 2)}
                                  </pre>
                                </div>
                              )}

                              <div>
                                <label className="block text-sm font-medium mb-2">Admin Notes</label>
                                <Textarea
                                  value={adminNotes}
                                  onChange={(e) => setAdminNotes(e.target.value)}
                                  placeholder="Add notes about this application..."
                                  rows={3}
                                />
                              </div>

                              <div className="flex space-x-2">
                                <Button
                                  onClick={() => updateApplicationStatus(selectedApplication.id, "approved")}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve
                                </Button>
                                <Button
                                  onClick={() => updateApplicationStatus(selectedApplication.id, "rejected")}
                                  variant="destructive"
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject
                                </Button>
                                <Button
                                  onClick={() => updateApplicationStatus(selectedApplication.id, "pending")}
                                  variant="outline"
                                >
                                  <Clock className="h-4 w-4 mr-2" />
                                  Mark Pending
                                </Button>
                              </div>
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
