
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Shield, UserX } from "lucide-react";

const roleSchema = z.object({
  user_id: z.string().uuid("Please enter a valid user ID"),
  role: z.enum(["admin", "user"], {
    required_error: "Please select a role",
  }),
});

interface RoleManagementProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const RoleManagement = ({ open, onOpenChange, onSuccess }: RoleManagementProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userRoles, setUserRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof roleSchema>>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      user_id: "",
      role: "user",
    },
  });

  useEffect(() => {
    if (open) {
      fetchUserRoles();
    }
  }, [open]);

  const fetchUserRoles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUserRoles(data || []);
    } catch (error) {
      console.error("Error fetching user roles:", error);
      toast({
        title: "Error",
        description: "Failed to load user roles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof roleSchema>) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from("user_roles")
        .insert([values]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Role assigned successfully",
      });

      form.reset();
      fetchUserRoles();
      onSuccess();
    } catch (error) {
      console.error("Error assigning role:", error);
      toast({
        title: "Error",
        description: "Failed to assign role. User may already have this role.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveRole = async (roleId: string) => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("id", roleId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Role removed successfully",
      });

      fetchUserRoles();
      onSuccess();
    } catch (error) {
      console.error("Error removing role:", error);
      toast({
        title: "Error",
        description: "Failed to remove role",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-christmas-green-800">Role Management</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-christmas-green-700 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Assign New Role
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="user_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-christmas-green-700">User ID</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter user UUID from auth.users table"
                            {...field}
                            className="border-christmas-green-300 focus:border-christmas-green-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-christmas-green-700">Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-christmas-green-300 focus:border-christmas-green-500">
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-christmas-green-600 hover:bg-christmas-green-700 text-white"
                  >
                    {isSubmitting ? "Assigning..." : "Assign Role"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-christmas-green-700">Current Role Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-christmas-green-600"></div>
                </div>
              ) : userRoles.length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-christmas-green-400 mx-auto mb-4" />
                  <p className="text-christmas-brown-600">No role assignments found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userRoles.map((userRole) => (
                    <div
                      key={userRole.id}
                      className="flex items-center justify-between p-3 border border-christmas-green-200 rounded-lg bg-white/50"
                    >
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium text-christmas-green-800">
                            User ID: {userRole.user_id}
                          </p>
                          <Badge
                            variant={userRole.role === 'admin' ? 'destructive' : 'secondary'}
                            className="mt-1"
                          >
                            {userRole.role}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleRemoveRole(userRole.id)}
                        variant="outline"
                        size="sm"
                        className="border-christmas-red-300 text-christmas-red-600 hover:bg-christmas-red-50"
                      >
                        <UserX className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-christmas-green-300 text-christmas-green-700"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
