
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Heart, Gift, MessageCircle, Edit, Calendar, MapPin } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface AdoptionHistoryProps {
  user: any;
}

export const AdoptionHistory = ({ user }: AdoptionHistoryProps) => {
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAdoption, setEditingAdoption] = useState(null);
  const [giftDescription, setGiftDescription] = useState("");
  const [giftAmount, setGiftAmount] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchAdoptions();
  }, [user.id]);

  const fetchAdoptions = async () => {
    try {
      const { data: donor } = await supabase
        .from("donors")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!donor) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("adoptions")
        .select(`
          *,
          children (
            name,
            age,
            gender,
            location,
            story,
            wishes,
            photo_url
          )
        `)
        .eq("donor_id", donor.id)
        .order("adopted_at", { ascending: false });

      setAdoptions(data || []);
    } catch (error) {
      console.error("Error fetching adoptions:", error);
      toast({
        title: "Error",
        description: "Failed to load your adoptions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGift = async () => {
    if (!editingAdoption) return;

    try {
      const { error } = await supabase
        .from("adoptions")
        .update({
          gift_description: giftDescription,
          gift_amount: giftAmount ? parseFloat(giftAmount) : null,
        })
        .eq("id", editingAdoption.id);

      if (error) throw error;

      toast({
        title: "Gift Updated",
        description: "Your gift information has been updated successfully.",
      });

      setEditingAdoption(null);
      setGiftDescription("");
      setGiftAmount("");
      fetchAdoptions();
    } catch (error) {
      console.error("Error updating gift:", error);
      toast({
        title: "Error",
        description: "Failed to update gift information",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (adoption) => {
    setEditingAdoption(adoption);
    setGiftDescription(adoption.gift_description || "");
    setGiftAmount(adoption.gift_amount ? adoption.gift_amount.toString() : "");
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-christmas-green-700">Your Adoption History</CardTitle>
          <CardDescription>
            Manage your Christmas adoptions and gift information
          </CardDescription>
        </CardHeader>
      </Card>

      {adoptions.length > 0 ? (
        <div className="space-y-6">
          {adoptions.map((adoption: any) => (
            <Card key={adoption.id} className="border-l-4 border-l-christmas-green-500">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-christmas-green-700 mb-2">
                      {adoption.children?.name}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Age {adoption.children?.age}
                      </div>
                      {adoption.children?.location && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {adoption.children?.location}
                        </div>
                      )}
                    </div>
                    {adoption.children?.story && (
                      <p className="text-gray-700 mb-3">{adoption.children.story}</p>
                    )}
                    {adoption.children?.wishes && adoption.children.wishes.length > 0 && (
                      <div className="mb-3">
                        <h4 className="font-semibold text-sm text-gray-700 mb-1">Wishes:</h4>
                        <div className="flex flex-wrap gap-1">
                          {adoption.children.wishes.map((wish, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {wish}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <Badge variant={adoption.gift_delivered ? "default" : "secondary"} className="mb-2">
                      {adoption.gift_delivered ? "Delivered" : "Pending"}
                    </Badge>
                    <p className="text-sm text-gray-600">
                      Adopted {new Date(adoption.adopted_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Gift Information */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-700 flex items-center">
                      <Gift className="h-4 w-4 mr-2" />
                      Gift Information
                    </h4>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(adoption)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Update Gift Information</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="gift-description">Gift Description</Label>
                            <Textarea
                              id="gift-description"
                              value={giftDescription}
                              onChange={(e) => setGiftDescription(e.target.value)}
                              placeholder="Describe the gifts you're planning to give..."
                              rows={3}
                            />
                          </div>
                          <div>
                            <Label htmlFor="gift-amount">Gift Amount ($)</Label>
                            <Input
                              id="gift-amount"
                              type="number"
                              step="0.01"
                              value={giftAmount}
                              onChange={(e) => setGiftAmount(e.target.value)}
                              placeholder="0.00"
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setEditingAdoption(null)}>
                              Cancel
                            </Button>
                            <Button onClick={handleUpdateGift}>
                              Update Gift
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="space-y-2">
                    {adoption.gift_description ? (
                      <p className="text-sm text-gray-600">{adoption.gift_description}</p>
                    ) : (
                      <p className="text-sm text-gray-400 italic">No gift description added yet</p>
                    )}
                    {adoption.gift_amount && (
                      <p className="text-sm font-semibold text-green-600">
                        Gift Value: ${adoption.gift_amount}
                      </p>
                    )}
                  </div>
                </div>

                {/* Notes */}
                {adoption.notes && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <h4 className="font-semibold text-yellow-800 text-sm mb-1">Your Notes:</h4>
                    <p className="text-sm text-yellow-700">{adoption.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Adoptions Yet
            </h3>
            <p className="text-gray-500 mb-6">
              You haven't adopted any children for Christmas yet. Start spreading joy today!
            </p>
            <Button onClick={() => window.location.href = "/"} className="bg-christmas-green-600 hover:bg-christmas-green-700">
              Browse Children
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
