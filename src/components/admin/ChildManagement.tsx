import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ChildProfileForm } from "./ChildProfileForm";
import { ChildProfileModal } from "./ChildProfileModal";

interface Child {
  id: string;
  name: string;
  age: number;
  gender: string;
  status: "draft" | "available" | "adopted" | "fulfilled" | "pending_review";
  location: string;
  photo_url: string;
  story: string;
  wishes: string[];
  created_at: string;
  approved_at: string;
}

export const ChildManagement = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [editMode, setEditMode] = useState(false);
  const { toast } = useToast();

  const { data: children, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-children'],
    queryFn: async () => {
      console.log('🔄 Fetching children for admin management - START');
      console.log('📊 Supabase client config:', {
        url: 'https://urbpoknwecnkhnukzxcb.supabase.co',
        hasClient: !!supabase
      });
      
      try {
        // First, let's test basic connection
        console.log('🔍 Testing basic Supabase connection...');
        const { data: testData, error: testError } = await supabase
          .from('children')
          .select('count(*)', { count: 'exact', head: true });
        
        console.log('📈 Connection test result:', { testData, testError, count: testData });

        if (testError) {
          console.error('❌ Basic connection test failed:', testError);
          throw new Error(`Connection test failed: ${testError.message}`);
        }

        // Now try to fetch actual data
        console.log('📋 Fetching all children data...');
        const { data, error, count } = await supabase
          .from('children')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false });

        console.log('📊 Query result:', { 
          data: data, 
          dataLength: data?.length,
          count: count,
          error: error 
        });

        if (error) {
          console.error('❌ Error fetching children:', error);
          throw new Error(`Database error: ${error.message} (Code: ${error.code}, Details: ${error.details})`);
        }

        if (!data) {
          console.warn('⚠️ No data returned from query');
          return [];
        }

        console.log('✅ Successfully fetched children:', {
          count: data.length,
          firstChild: data[0] ? { id: data[0].id, name: data[0].name } : 'None',
          allStatuses: data.map(child => child.status)
        });

        return data as Child[];
      } catch (fetchError) {
        console.error('❌ Complete fetch failure in ChildManagement:', fetchError);
        console.error('📝 Error details:', {
          message: fetchError instanceof Error ? fetchError.message : 'Unknown error',
          stack: fetchError instanceof Error ? fetchError.stack : 'No stack trace'
        });
        throw fetchError;
      }
    },
    retry: (failureCount, error) => {
      console.log(`🔄 Retry attempt ${failureCount} for error:`, error);
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => {
      const delay = Math.min(1000 * 2 ** attemptIndex, 5000);
      console.log(`⏱️ Retry delay: ${delay}ms`);
      return delay;
    },
  });

  const handleDelete = async (childId: string) => {
    try {
      console.log('🗑️ Deleting child:', childId);
      const { error } = await supabase
        .from('children')
        .delete()
        .eq('id', childId);

      if (error) throw error;

      toast({
        title: "Child profile deleted",
        description: "The child profile has been successfully removed.",
      });

      refetch();
    } catch (error) {
      console.error('Error deleting child:', error);
      toast({
        title: "Error",
        description: "Failed to delete child profile.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (child: Child) => {
    setSelectedChild(child);
    setEditMode(true);
    setIsFormOpen(true);
  };

  const handleView = (child: Child) => {
    setSelectedChild(child);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedChild(null);
    setEditMode(false);
    setIsFormOpen(true);
  };

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

  if (error) {
    console.error('❌ Query error in ChildManagement:', error);
    return (
      <div className="flex items-center justify-center p-8">
        <Card className="w-full max-w-lg">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Children</h3>
            <p className="text-gray-600 mb-4 text-sm">
              {error instanceof Error ? error.message : 'Failed to load children data'}
            </p>
            <div className="bg-gray-50 p-3 rounded text-xs text-left mb-4">
              <strong>Debug Info:</strong>
              <br />Error Type: {error?.constructor?.name || 'Unknown'}
              <br />Time: {new Date().toISOString()}
              <br />Route: /admin
            </div>
            <Button onClick={() => refetch()} variant="outline" className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    console.log('⏳ ChildManagement is loading...');
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading children profiles...</p>
          <p className="text-sm text-gray-400 mt-2">Connecting to database...</p>
        </div>
      </div>
    );
  }

  console.log('✅ ChildManagement rendering with data:', { 
    childrenCount: children?.length,
    children: children 
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Child Profile Management</h2>
          <p className="text-gray-600">
            Manage child profiles and their information 
            {children && ` (${children.length} profiles)`}
          </p>
        </div>
        <Button onClick={handleAddNew} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Add New Child
        </Button>
      </div>

      {children && children.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {children.map((child) => (
            <Card key={child.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{child.name}</CardTitle>
                  <Badge className={getStatusColor(child.status)}>
                    {child.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Age:</span>
                    <span>{child.age}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Gender:</span>
                    <span>{child.gender}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Location:</span>
                    <span>{child.location || 'Not specified'}</span>
                  </div>
                  {child.photo_url && (
                    <div className="mt-3">
                      <img
                        src={child.photo_url}
                        alt={child.name}
                        className="w-full h-32 object-cover rounded-md"
                      />
                    </div>
                  )}
                  <div className="flex space-x-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(child)}
                      className="flex-1"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(child)}
                      className="flex-1"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(child.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">No Child Profiles Found</h3>
          <p className="text-gray-600 mb-4">
            There are currently no child profiles in the database. Add the first one to get started.
          </p>
          <Button onClick={handleAddNew} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Add First Child Profile
          </Button>
        </Card>
      )}

      <ChildProfileForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        child={selectedChild}
        editMode={editMode}
        onSuccess={() => {
          refetch();
          setIsFormOpen(false);
          setSelectedChild(null);
        }}
      />

      <ChildProfileModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        child={selectedChild}
      />
    </div>
  );
};
