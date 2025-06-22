
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Users, Search, Eye, Mail, Phone, MapPin, Calendar, Plus, Edit, Trash2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Donor = Tables<"donors"> & {
  adoptions?: any[];
};

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  profile_status: string;
  notes: string;
}

export const EnhancedUserManagement = () => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editingDonor, setEditingDonor] = useState<Donor | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    profile_status: "active",
    notes: ""
  });
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

  const handleSaveDonor = async () => {
    try {
      if (editingDonor) {
        // Update existing donor
        const { error } = await supabase
          .from("donors")
          .update({
            name: formData.name,
            email: formData.email,
            phone: formData.phone || null,
            address: formData.address || null,
            profile_status: formData.profile_status,
            notes: formData.notes || null
          })
          .eq("id", editingDonor.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Donor profile updated successfully",
        });
      } else {
        // Create new donor
        const { error } = await supabase
          .from("donors")
          .insert({
            name: formData.name,
            email: formData.email,
            phone: formData.phone || null,
            address: formData.address || null,
            profile_status: formData.profile_status,
            notes: formData.notes || null
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "New donor profile created successfully",
        });
      }

      setIsFormOpen(false);
      setEditingDonor(null);
      resetForm();
      fetchDonors();
    } catch (error) {
      console.error("Error saving donor:", error);
      toast({
        title: "Error",
        description: "Failed to save donor profile",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDonor = async (donorId: string) => {
    try {
      const { error } = await supabase
        .from("donors")
        .delete()
        .eq("id", donorId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Donor profile deleted successfully",
      });

      fetchDonors();
    } catch (error) {
      console.error("Error deleting donor:", error);
      toast({
        title: "Error",
        description: "Failed to delete donor profile",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      profile_status: "active",
      notes: ""
    });
  };

  const openEditForm = (donor: Donor) => {
    setEditingDonor(donor);
    setFormData({
      name: donor.name,
      email: donor.email,
      phone: donor.phone || "",
      address: donor.address || "",
      profile_status: donor.profile_status || "active",
      notes: donor.notes || ""
    });
    setIsFormOpen(true);
  };

  const openAddForm = () => {
    setEditingDonor(null);
    resetForm();
    setIsFormOpen(true);
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
              <Button onClick={openAddForm} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
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
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedDonor(donor);
                            setIsViewOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditForm(donor)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete User Profile</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {donor.name}'s profile? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteDonor(donor.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingDonor ? "Edit User Profile" : "Add New User Profile"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label htmlFor="status">Profile Status</Label>
                <select
                  id="status"
                  value={formData.profile_status}
                  onChange={(e) => setFormData({ ...formData, profile_status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter address"
              />
            </div>
            <div>
              <Label htmlFor="notes">Admin Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Enter any admin notes"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingDonor(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveDonor}
                disabled={!formData.name || !formData.email}
                className="bg-green-600 hover:bg-green-700"
              >
                {editingDonor ? "Update Profile" : "Create Profile"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Profile Details</DialogTitle>
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
  );
};
