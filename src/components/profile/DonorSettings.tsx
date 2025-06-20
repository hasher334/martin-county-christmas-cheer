
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { User, Mail, Phone, MapPin, Settings, Save } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface DonorSettingsProps {
  user: any;
}

export const DonorSettings = ({ user }: DonorSettingsProps) => {
  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [contactAllowed, setContactAllowed] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDonorInfo();
  }, [user.id]);

  const fetchDonorInfo = async () => {
    try {
      const { data } = await supabase
        .from("donors")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setDonor(data);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
        });
      } else {
        // Pre-fill with user email if no donor profile exists
        setFormData({
          name: "",
          email: user.email || "",
          phone: "",
          address: "",
        });
      }
    } catch (error) {
      console.error("Error fetching donor info:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (donor) {
        // Update existing donor
        const { error } = await supabase
          .from("donors")
          .update(formData)
          .eq("id", donor.id);

        if (error) throw error;
      } else {
        // Create new donor profile
        const { error } = await supabase
          .from("donors")
          .insert({
            ...formData,
            user_id: user.id,
          });

        if (error) throw error;
      }

      // Update contact preferences for all adoptions
      if (donor) {
        await supabase
          .from("adoptions")
          .update({ contact_allowed: contactAllowed })
          .eq("donor_id", donor.id);
      }

      toast({
        title: "Settings Saved",
        description: "Your donor profile has been updated successfully.",
      });

      fetchDonorInfo();
    } catch (error) {
      console.error("Error saving donor info:", error);
      toast({
        title: "Error",
        description: "Failed to save your settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-christmas-green-700 flex items-center">
            <User className="h-5 w-5 mr-2" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Update your personal information and contact details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your full name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your@email.com"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(555) 123-4567"
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Your address"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Communication Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-christmas-green-700 flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Communication Preferences
          </CardTitle>
          <CardDescription>
            Control how families can contact you about adoptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Allow family contact</h4>
              <p className="text-sm text-gray-600">
                Allow families to send you messages about the children you've adopted
              </p>
            </div>
            <Switch
              checked={contactAllowed}
              onCheckedChange={setContactAllowed}
            />
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-christmas-green-700 flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Account Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-christmas-green-600 hover:bg-christmas-green-700"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="p-4">
          <div className="text-sm text-gray-600">
            <p><strong>Account Email:</strong> {user.email}</p>
            <p><strong>Member Since:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
