
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Child = Tables<'children'>;

interface ChildrenTableProps {
  children: Child[];
  loading: boolean;
  onEdit: (child: Child) => void;
  onDelete: (childId: string) => void;
}

export const ChildrenTable = ({ children, loading, onEdit, onDelete }: ChildrenTableProps) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      available: { variant: 'default' as const, label: 'Available' },
      adopted: { variant: 'secondary' as const, label: 'Adopted' },
      fulfilled: { variant: 'outline' as const, label: 'Fulfilled' },
      draft: { variant: 'destructive' as const, label: 'Draft' },
      pending_review: { variant: 'secondary' as const, label: 'Pending Review' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.available;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No children profiles found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="text-left p-4 font-medium">Name</th>
            <th className="text-left p-4 font-medium">Age</th>
            <th className="text-left p-4 font-medium">Gender</th>
            <th className="text-left p-4 font-medium">Location</th>
            <th className="text-left p-4 font-medium">Status</th>
            <th className="text-left p-4 font-medium">Created</th>
            <th className="text-center p-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {children.map((child) => (
            <tr key={child.id} className="border-b hover:bg-gray-50">
              <td className="p-4">
                <div className="flex items-center space-x-3">
                  {child.photo_url && (
                    <img
                      src={child.photo_url}
                      alt={child.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-medium">{child.name}</p>
                  </div>
                </div>
              </td>
              <td className="p-4">{child.age}</td>
              <td className="p-4 capitalize">{child.gender}</td>
              <td className="p-4">{child.location || 'Not specified'}</td>
              <td className="p-4">{getStatusBadge(child.status || 'available')}</td>
              <td className="p-4 text-sm text-gray-600">
                {child.created_at ? new Date(child.created_at).toLocaleDateString() : 'N/A'}
              </td>
              <td className="p-4">
                <div className="flex items-center justify-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(child)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(child.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
