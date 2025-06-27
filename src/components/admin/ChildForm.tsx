
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Save, X } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Child = Tables<'children'>;

interface ChildFormProps {
  child: Child | null;
  onSubmit: (childData: Partial<Child>) => Promise<void>;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

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
    } else {
      // Reset form for new child
      setFormData({
        name: '',
        age: '',
        gender: '',
        location: '',
        story: '',
        wishes: ['', '', ''],
        photo_url: '',
        status: 'available',
      });
    }
    setErrors({});
  }, [child]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.age || parseInt(formData.age) < 1 || parseInt(formData.age) > 18) {
      newErrors.age = 'Age must be between 1 and 18';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleWishChange = (index: number, value: string) => {
    const newWishes = [...formData.wishes];
    newWishes[index] = value;
    setFormData(prev => ({
      ...prev,
      wishes: newWishes
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('ChildForm: Form submission started', { formData });
    
    if (!validateForm()) {
      console.log('ChildForm: Form validation failed', { errors });
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const childData: Partial<Child> = {
        name: formData.name.trim(),
        age: parseInt(formData.age),
        gender: formData.gender,
        location: formData.location.trim() || null,
        story: formData.story.trim() || null,
        wishes: formData.wishes.filter(wish => wish.trim() !== ''),
        photo_url: formData.photo_url.trim() || null,
        status: formData.status as any,
      };

      console.log('ChildForm: Submitting child data:', childData);
      
      // Ensure we properly await the onSubmit promise
      await onSubmit(childData);
      
      console.log('ChildForm: Submission successful');
      
      // Reset form after successful submission for new children
      if (!child) {
        setFormData({
          name: '',
          age: '',
          gender: '',
          location: '',
          story: '',
          wishes: ['', '', ''],
          photo_url: '',
          status: 'available',
        });
      }
      
    } catch (error) {
      console.error('ChildForm: Error in form submission:', error);
      
      // Don't show duplicate error toasts since ChildrenManagement already shows them
      // The error handling is done in the parent component
      
    } finally {
      // Always reset the submitting state
      console.log('ChildForm: Resetting isSubmitting state');
      setIsSubmitting(false);
    }
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
              disabled={isSubmitting}
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
                className={errors.name ? 'border-red-500' : ''}
                placeholder="Enter child's name"
                disabled={isSubmitting}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
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
                className={errors.age ? 'border-red-500' : ''}
                placeholder="Enter age"
                disabled={isSubmitting}
              />
              {errors.age && <p className="text-sm text-red-500">{errors.age}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleInputChange('gender', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., Martin County, FL"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
              disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
              </div>
            ))}
          </div>
          
          <div className="flex items-center space-x-4 pt-6">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-christmas-green-600 hover:bg-christmas-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Saving...' : (child ? 'Update Child' : 'Create Child')}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
