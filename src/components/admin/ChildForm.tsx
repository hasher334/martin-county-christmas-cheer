
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, X } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Child = Tables<'children'>;

interface ChildFormProps {
  child: Child | null;
  onSubmit: (childData: Partial<Child>) => void;
  onCancel: () => void;
}

export const ChildForm = ({ child, onSubmit, onCancel }: ChildFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    location: '',
    story: '',
    wishes: ['', '', ''],
    photo_url: '',
    status: 'available',
  });

  useEffect(() => {
    if (child) {
      setFormData({
        name: child.name || '',
        age: child.age?.toString() || '',
        gender: child.gender || '',
        location: child.location || '',
        story: child.story || '',
        wishes: child.wishes || ['', '', ''],
        photo_url: child.photo_url || '',
        status: child.status || 'available',
      });
    }
  }, [child]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleWishChange = (index: number, value: string) => {
    const newWishes = [...formData.wishes];
    newWishes[index] = value;
    setFormData(prev => ({
      ...prev,
      wishes: newWishes
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const childData: Partial<Child> = {
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender,
      location: formData.location,
      story: formData.story,
      wishes: formData.wishes.filter(wish => wish.trim() !== ''),
      photo_url: formData.photo_url || null,
      status: formData.status as any,
    };

    onSubmit(childData);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="mr-2 p-1"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            {child ? 'Edit Child Profile' : 'Add New Child'}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                min="1"
                max="18"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleInputChange('gender', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., Martin County, FL"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="adopted">Adopted</SelectItem>
                  <SelectItem value="fulfilled">Fulfilled</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending_review">Pending Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="photo_url">Photo URL</Label>
              <Input
                id="photo_url"
                type="url"
                value={formData.photo_url}
                onChange={(e) => handleInputChange('photo_url', e.target.value)}
                placeholder="https://example.com/photo.jpg"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="story">Story</Label>
            <Textarea
              id="story"
              value={formData.story}
              onChange={(e) => handleInputChange('story', e.target.value)}
              rows={4}
              placeholder="Tell us about this child..."
            />
          </div>
          
          <div className="space-y-4">
            <Label>Wishes (up to 3)</Label>
            {formData.wishes.map((wish, index) => (
              <div key={index} className="space-y-2">
                <Label htmlFor={`wish-${index}`}>Wish {index + 1}</Label>
                <Input
                  id={`wish-${index}`}
                  value={wish}
                  onChange={(e) => handleWishChange(index, e.target.value)}
                  placeholder={`Enter wish ${index + 1}...`}
                />
              </div>
            ))}
          </div>
          
          <div className="flex items-center space-x-4 pt-6">
            <Button type="submit" className="bg-christmas-green-600 hover:bg-christmas-green-700">
              <Save className="w-4 h-4 mr-2" />
              {child ? 'Update Child' : 'Create Child'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
