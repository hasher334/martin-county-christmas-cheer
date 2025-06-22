
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Search, Eye, Mail, Phone, MapPin, Calendar } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Donor = Tables<"donors"> & {
  adoptions?: any[];
};

export const UserManagement = () => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      const { data, error } = await supabase
        .from("donors")
        .select(`
          *,
          adoptions (
            *,
            children (*)
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDonors(data || []);
    } catch (error) {
      console.error("Error fetching donors:", error);
      toast({
        title: "Error",
        description: "Failed to load donors",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredDonors = donors.filter(donor =>
    donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getProfileStatusBadge = (status: string | null) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map((i) => (
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
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              User Management ({donors.length} total)
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search donors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredDonors.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? "No donors match your search" : "No donors found"}
              </div>
            ) : (
              filteredDonors.map((donor) => (
                <Card key={donor.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h4 className="font-medium text-gray-900">{donor.name}</h4>
                            <div className="flex items-center text-sm text-gray-600 space-x-4">
                              <span className="flex items-center">
                                <Mail className="h-3 w-3 mr-1" />
                                {donor.email}
                              </span>
                              {donor.phone && (
                                <span className="flex items-center">
                                  <Phone className="h-3 w-3 mr-1" />
                                  {donor.phone}
                                </span>
                              )}
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                Joined {new Date(donor.created_at || "").toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getProfileStatusBadge(donor.profile_status)}
                            <Badge variant="outline">
                              {donor.adoptions?.length || 0} adoptions
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedDonor(donor)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Donor Profile</DialogTitle>
                          </DialogHeader>
                          {selectedDonor && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium mb-2">Personal Information</h4>
                                  <div className="space-y-2 text-sm">
                                    <p><strong>Name:</strong> {selectedDonor.name}</p>
                                    <p><strong>Email:</strong> {selectedDonor.email}</p>
                                    <p><strong>Phone:</strong> {selectedDonor.phone || "Not provided"}</p>
                                    <p><strong>Address:</strong> {selectedDonor.address || "Not provided"}</p>
                                    <p><strong>Status:</strong> {getProfileStatusBadge(selectedDonor.profile_status)}</p>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Account Details</h4>
                                  <div className="space-y-2 text-sm">
                                    <p><strong>User ID:</strong> {selectedDonor.user_id || "Not linked"}</p>
                                    <p><strong>Created:</strong> {new Date(selectedDonor.created_at || "").toLocaleString()}</p>
                                    <p><strong>Total Adoptions:</strong> {selectedDonor.adoptions?.length || 0}</p>
                                  </div>
                                </div>
                              </div>

                              {selectedDonor.notes && (
                                <div>
                                  <h4 className="font-medium mb-2">Admin Notes</h4>
                                  <p className="text-sm bg-gray-100 p-3 rounded">{selectedDonor.notes}</p>
                                </div>
                              )}

                              {selectedDonor.application_data && (
                                <div>
                                  <h4 className="font-medium mb-2">Application Data</h4>
                                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-32">
                                    {JSON.stringify(selectedDonor.application_data, null, 2)}
                                  </pre>
                                </div>
                              )}

                              {selectedDonor.adoptions && selectedDonor.adoptions.length > 0 && (
                                <div>
                                  <h4 className="font-medium mb-2">Adoption History</h4>
                                  <div className="space-y-2">
                                    {selectedDonor.adoptions.map((adoption: any, index: number) => (
                                      <div key={index} className="border rounded p-3 text-sm">
                                        <p><strong>Child:</strong> {adoption.children?.name || "Unknown"}</p>
                                        <p><strong>Adopted:</strong> {new Date(adoption.adopted_at).toLocaleDateString()}</p>
                                        <p><strong>Gift Delivered:</strong> {adoption.gift_delivered ? "Yes" : "No"}</p>
                                        {adoption.notes && <p><strong>Notes:</strong> {adoption.notes}</p>}
                                      </div>
                                    ))}
                                  </div>
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
