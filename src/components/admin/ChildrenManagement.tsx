
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChildrenTable } from './ChildrenTable';
import { ChildForm } from './ChildForm';
import { Plus, Users } from 'lucide-react';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

type Child = Tables<'children'>;
type ChildInsert = TablesInsert<'children'>;

export const ChildrenManagement = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setChildren(data || []);
    } catch (error: any) {
      console.error('Error fetching children:', error);
      toast({
        title: "Error",
        description: "Failed to fetch children profiles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddChild = () => {
    setEditingChild(null);
    setShowForm(true);
  };

  const handleEditChild = (child: Child) => {
    setEditingChild(child);
    setShowForm(true);
  };

  const handleFormSubmit = async (childData: Partial<Child>) => {
    try {
      if (editingChild) {
        // Update existing child
        const { error } = await supabase
          .from('children')
          .update(childData)
          .eq('id', editingChild.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Child profile updated successfully",
        });
      } else {
        // Create new child - ensure required fields are present
        const insertData: ChildInsert = {
          name: childData.name || '',
          age: childData.age || 0,
          gender: childData.gender || '',
          location: childData.location || null,
          story: childData.story || null,
          wishes: childData.wishes || null,
          photo_url: childData.photo_url || null,
          status: (childData.status as any) || 'available',
        };

        const { error } = await supabase
          .from('children')
          .insert([insertData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Child profile created successfully",
        });
      }

      setShowForm(false);
      setEditingChild(null);
      fetchChildren();
    } catch (error: any) {
      console.error('Error saving child:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save child profile",
        variant: "destructive",
      });
    }
  };

  const handleDeleteChild = async (childId: string) => {
    if (!confirm('Are you sure you want to delete this child profile?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('children')
        .delete()
        .eq('id', childId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Child profile deleted successfully",
      });

      fetchChildren();
    } catch (error: any) {
      console.error('Error deleting child:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete child profile",
        variant: "destructive",
      });
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingChild(null);
  };

  if (showForm) {
    return (
      <ChildForm
        child={editingChild}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Children Management
            </CardTitle>
            <Button onClick={handleAddChild} className="bg-christmas-green-600 hover:bg-christmas-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Child
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ChildrenTable
            children={children}
            loading={loading}
            onEdit={handleEditChild}
            onDelete={handleDeleteChild}
          />
        </CardContent>
      </Card>
    </div>
  );
};
