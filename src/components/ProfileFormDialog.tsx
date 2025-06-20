
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ProfileForm, Profile } from "@/components/ProfileForm";
import { supabase } from "@/integrations/supabase/client";

interface ProfileFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  profile?: Profile;
}

export const ProfileFormDialog = ({ 
  open, 
  onOpenChange, 
  onSuccess,
  profile 
}: ProfileFormDialogProps) => {
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Get current user for creating new profiles
  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  };

  const handleSave = async (profileData: Profile) => {
    onSuccess();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleCreateProfile = async () => {
    const user = await getCurrentUser();
    if (user) {
      return {
        user_id: user.id,
        first_name: '',
        last_name: '',
        email: user.email || '',
        phone: '',
        address: '',
        bio: '',
      };
    }
    return {
      user_id: '',
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      address: '',
      bio: '',
    };
  };

  const getProfileForForm = async () => {
    if (profile) {
      return profile;
    }
    return await handleCreateProfile();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <ProfileForm
          profile={profile}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};
