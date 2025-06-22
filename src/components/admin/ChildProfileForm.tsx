
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Upload, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Child {
  id: string;
  name: string;
  age: number;
  gender: string;
  status: string;
  location: string;
  photo_url: string;
  story: string;
  wishes: string[];
}

interface ChildProfileFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  child: Child | null;
  editMode: boolean;
  onSuccess: () => void;
}

interface FormData {
  name: string;
  age: number;
  gender: string;
  status: string;
  location: string;
  story: string;
  wishes: string[];
}

export const ChildProfileForm = ({ open, onOpenChange, child, editMode, onSuccess }: ChildProfileFormProps) => {
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [wishInput, setWishInput] = useState("");
  const { toast } = useToast();

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: "",
      age: 5,
      gender: "male",
      status: "draft",
      location: "",
      story: "",
      wishes: [],
    },
  });

  const wishes = watch("wishes") || [];

  useEffect(() => {
    if (child && editMode) {
      reset({
        name: child.name,
        age: child.age,
        gender: child.gender,
        status: child.status,
        location: child.location || "",
        story: child.story || "",
        wishes: child.wishes || [],
      });
      setPhotoUrl(child.photo_url || "");
    } else {
      reset({
        name: "",
        age: 5,
        gender: "male",
        status: "draft",
        location: "",
        story: "",
        wishes: [],
      });
      setPhotoUrl("");
    }
  }, [child, editMode, reset]);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `child-photos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('child-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('child-photos')
        .getPublicUrl(filePath);

      setPhotoUrl(data.publicUrl);
      toast({
        title: "Photo uploaded",
        description: "Child photo has been uploaded successfully.",
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const addWish = () => {
    if (wishInput.trim()) {
      const currentWishes = wishes || [];
      setValue("wishes", [...currentWishes, wishInput.trim()]);
      setWishInput("");
    }
  };

  const removeWish = (index: number) => {
    const currentWishes = wishes || [];
    setValue("wishes", currentWishes.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const childData = {
        ...data,
        photo_url: photoUrl,
        updated_at: new Date().toISOString(),
      };

      if (editMode && child) {
        const { error } = await supabase
          .from('children')
          .update(childData)
          .eq('id', child.id);

        if (error) throw error;

        toast({
          title: "Profile updated",
          description: "Child profile has been updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from('children')
          .insert([{
            ...childData,
            created_at: new Date().toISOString(),
          }]);

        if (error) throw error;

        toast({
          title: "Profile created",
          description: "New child profile has been created successfully.",
        });
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving child profile:', error);
      toast({
        title: "Error",
        description: "Failed to save child profile. Please try again.",
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
          <DialogTitle>
            {editMode ? "Edit Child Profile" : "Add New Child Profile"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                {...register("name", { required: "Name is required" })}
                className="mt-1"
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                min="1"
                max="18"
                {...register("age", { 
                  required: "Age is required",
                  min: { value: 1, message: "Age must be at least 1" },
                  max: { value: 18, message: "Age must be 18 or under" }
                })}
                className="mt-1"
              />
              {errors.age && (
                <p className="text-sm text-red-600 mt-1">{errors.age.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="gender">Gender *</Label>
              <Select onValueChange={(value) => setValue("gender", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={(value) => setValue("status", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending_review">Pending Review</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="adopted">Adopted</SelectItem>
                  <SelectItem value="fulfilled">Fulfilled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              {...register("location")}
              placeholder="e.g., Martin County, FL"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="photo">Photo</Label>
            <div className="mt-1 space-y-2">
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={uploadingPhoto}
              />
              {uploadingPhoto && (
                <div className="flex items-center text-sm text-gray-600">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Uploading photo...
                </div>
              )}
              {photoUrl && (
                <div className="mt-2">
                  <img
                    src={photoUrl}
                    alt="Child photo"
                    className="w-32 h-32 object-cover rounded-md border"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="story">Story</Label>
            <Textarea
              id="story"
              {...register("story")}
              placeholder="Tell us about this child's background and needs..."
              className="mt-1 min-h-[100px]"
            />
          </div>

          <div>
            <Label>Wishes</Label>
            <div className="mt-1 space-y-2">
              <div className="flex space-x-2">
                <Input
                  value={wishInput}
                  onChange={(e) => setWishInput(e.target.value)}
                  placeholder="Add a wish item..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addWish())}
                />
                <Button type="button" onClick={addWish} variant="outline">
                  Add
                </Button>
              </div>
              {wishes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {wishes.map((wish, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {wish}
                      <button
                        type="button"
                        onClick={() => removeWish(index)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {editMode ? "Update Profile" : "Create Profile"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
