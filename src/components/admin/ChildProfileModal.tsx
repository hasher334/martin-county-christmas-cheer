
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, User, Heart } from "lucide-react";

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
  created_at: string;
  approved_at: string;
}

interface ChildProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  child: Child | null;
}

export const ChildProfileModal = ({ open, onOpenChange, child }: ChildProfileModalProps) => {
  if (!child) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'adopted':
        return 'bg-blue-100 text-blue-800';
      case 'fulfilled':
        return 'bg-purple-100 text-purple-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'pending_review':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{child.name}'s Profile</span>
            <Badge className={getStatusColor(child.status)}>
              {child.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {child.photo_url && (
            <div className="text-center">
              <img
                src={child.photo_url}
                alt={child.name}
                className="w-48 h-48 object-cover rounded-lg mx-auto border-2 border-gray-200"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="h-4 w-4 text-gray-600" />
                  <span className="font-medium">Basic Information</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{child.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Age:</span>
                    <span className="font-medium">{child.age} years old</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gender:</span>
                    <span className="font-medium capitalize">{child.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge className={getStatusColor(child.status)} variant="secondary">
                      {child.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  <span className="font-medium">Location & Dates</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{child.location || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium">{formatDate(child.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Approved:</span>
                    <span className="font-medium">{formatDate(child.approved_at)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {child.story && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Calendar className="h-4 w-4 text-gray-600" />
                  <span className="font-medium">Story</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{child.story}</p>
              </CardContent>
            </Card>
          )}

          {child.wishes && child.wishes.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="font-medium">Wishes</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {child.wishes.map((wish, index) => (
                    <div
                      key={index}
                      className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm"
                    >
                      <div className="flex items-start space-x-2">
                        <Heart className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-red-800">{wish}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="text-xs text-gray-500 text-center">
            Profile ID: {child.id}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
