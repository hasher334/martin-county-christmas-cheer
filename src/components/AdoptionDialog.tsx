
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Heart, Gift, MapPin, Calendar } from "lucide-react";
import { notifyAdoption } from "@/utils/notificationService";
import type { Tables } from "@/integrations/supabase/types";

type Child = Tables<"children">;

interface AdoptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  child: Child;
  user: any;
}

export const AdoptionDialog = ({ open, onOpenChange, child, user }: AdoptionDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [donorInfo, setDonorInfo] = useState({
    name: "",
    email: user?.email || "",
    phone: "",
    address: "",
  });
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First, create or update donor profile
      const { data: existingDonor } = await supabase
        .from("donors")
        .select("*")
        .eq("user_id", user.id)
        .single();

      let donorId;

      if (existingDonor) {
        // Update existing donor
        const { data: updatedDonor, error: updateError } = await supabase
          .from("donors")
          .update(donorInfo)
          .eq("id", existingDonor.id)
          .select()
          .single();

        if (updateError) throw updateError;
        donorId = updatedDonor.id;
      } else {
        // Create new donor
        const { data: newDonor, error: insertError } = await supabase
          .from("donors")
          .insert({
            ...donorInfo,
            user_id: user.id,
          })
          .select()
          .single();

        if (insertError) throw insertError;
        donorId = newDonor.id;
      }

      // Create adoption record
      const { error: adoptionError } = await supabase
        .from("adoptions")
        .insert({
          child_id: child.id,
          donor_id: donorId,
          notes: notes,
        });

      if (adoptionError) throw adoptionError;

      // Update child status
      const { error: updateChildError } = await supabase
        .from("children")
        .update({ status: "adopted" })
        .eq("id", child.id);

      if (updateChildError) throw updateChildError;

      // Send adoption notification using the updated notification service
      await notifyAdoption(child.name, donorInfo.name, donorInfo.email, notes);

      toast({
        title: "Adoption successful! 🎄",
        description: `Thank you for adopting ${child.name} for Christmas! We'll be in touch with delivery details.`,
      });

      onOpenChange(false);
      
      // Refresh the page to update the children list
      window.location.reload();
    } catch (error: any) {
      console.error("Adoption error:", error);
      toast({
        title: "Adoption failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-800 flex items-center">
            <Heart className="h-6 w-6 mr-2 text-red-500" />
            Adopt {child.name} for Christmas
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Child Summary */}
          <div className="bg-gradient-to-r from-green-50 to-red-50 p-4 rounded-lg border-2 border-green-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-bold text-green-800">{child.name}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {child.age} years old
                </div>
                {child.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {child.location}
                  </div>
                )}
              </div>
            </div>

            {child.story && (
              <p className="text-gray-700 mb-4">{child.story}</p>
            )}

            {child.wishes && child.wishes.length > 0 && (
              <div>
                <h4 className="font-semibold text-green-700 mb-2 flex items-center">
                  <Gift className="h-4 w-4 mr-1" />
                  Christmas Wishes:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {child.wishes.map((wish, index) => (
                    <Badge 
                      key={index} 
                      className="bg-red-100 text-red-700 border-red-200"
                    >
                      {wish}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Donor Information Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={donorInfo.name}
                  onChange={(e) => setDonorInfo(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={donorInfo.email}
                  onChange={(e) => setDonorInfo(prev => ({ ...prev, email: e.target.value }))}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={donorInfo.phone}
                  onChange={(e) => setDonorInfo(prev => ({ ...prev, phone: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={donorInfo.address}
                  onChange={(e) => setDonorInfo(prev => ({ ...prev, address: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Special Notes or Message</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special message for the child or delivery instructions..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">What happens next?</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• We'll confirm your adoption and send you the child's full wishlist</li>
                <li>• You can purchase gifts and arrange delivery through our coordinators</li>
                <li>• We'll keep you updated on the delivery and the child's reaction</li>
                <li>• You're making a child's Christmas truly magical! 🎄</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-red-500 hover:bg-red-600"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Heart className="mr-2 h-4 w-4" />
                Complete Adoption
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
