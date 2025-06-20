import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Plus, X, Send, AlertCircle, CheckCircle } from "lucide-react";
import { notifyChildRegistration } from "@/utils/notificationService";

const formSchema = z.object({
  childName: z.string().min(1, "Child's name is required"),
  age: z.number().min(1).max(18, "Age must be between 1 and 18"),
  gender: z.string().min(1, "Please select a gender"),
  location: z.string().min(1, "Location is required"),
  story: z.string().min(50, "Please provide at least 50 characters for the story"),
  wishes: z.array(z.string()).min(1, "Please add at least one wish"),
  // Parent/Guardian Information
  parentName: z.string().min(1, "Your name is required"),
  parentEmail: z.string().email("Valid email is required"),
  parentPhone: z.string().min(10, "Phone number is required"),
  relationship: z.string().min(1, "Please specify your relationship to the child"),
  // Additional Information
  householdSize: z.number().min(1, "Household size is required"),
  annualIncome: z.string().min(1, "Please select an income range"),
  specialNeeds: z.string().optional(),
  additionalInfo: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface ChildRegistrationFormProps {
  user?: any;
  onSuccess: () => void;
  onAuthRequired?: () => void;
}

export const ChildRegistrationForm = ({ onSuccess }: ChildRegistrationFormProps) => {
  const [currentWish, setCurrentWish] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      childName: "",
      age: 5,
      gender: "",
      location: "",
      story: "",
      wishes: [],
      parentName: "",
      parentEmail: "",
      parentPhone: "",
      relationship: "",
      householdSize: 1,
      annualIncome: "",
      specialNeeds: "",
      additionalInfo: "",
    },
  });

  const wishes = form.watch("wishes");

  const addWish = () => {
    if (currentWish.trim() && !wishes.includes(currentWish.trim())) {
      form.setValue("wishes", [...wishes, currentWish.trim()]);
      setCurrentWish("");
    }
  };

  const removeWish = (index: number) => {
    const newWishes = wishes.filter((_, i) => i !== index);
    form.setValue("wishes", newWishes);
  };

  const sendNotificationEmail = async (data: FormData) => {
    try {
      console.log("Sending notification email for child registration");
      setEmailStatus('sending');
      
      await notifyChildRegistration(data.parentName, data.childName, data);
      
      console.log("Notification email sent successfully");
      setEmailStatus('success');
    } catch (error) {
      console.error("Error in sendNotificationEmail:", error);
      setEmailStatus('error');
      throw error;
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setEmailStatus('idle');

    try {
      console.log("Starting registration submission process...");
      
      // Send notification email
      await sendNotificationEmail(data);

      toast({
        title: "Registration submitted successfully!",
        description: "Your child's profile has been submitted and our team has been notified. We'll review it shortly.",
      });

      console.log("Registration process completed successfully");
      onSuccess();
    } catch (error) {
      console.error("Error submitting registration:", error);
      
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      
      toast({
        title: "Submission failed",
        description: `There was an error submitting the registration: ${errorMessage}. Please try again or contact support.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = () => {
    switch (emailStatus) {
      case 'sending':
        return <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Child Information Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-christmas-green-800">Child Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="childName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Child's Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter child's name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
                          max="18" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location *</FormLabel>
                      <FormControl>
                        <Input placeholder="City, State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="story"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Child's Story *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about your child's situation, interests, and why they would benefit from Christmas assistance..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Share what makes your child special and why they need help this Christmas (minimum 50 characters)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Christmas Wishes Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-christmas-green-800">Christmas Wishes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a Christmas wish..."
                  value={currentWish}
                  onChange={(e) => setCurrentWish(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addWish())}
                />
                <Button type="button" onClick={addWish} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {wishes.map((wish, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {wish}
                    <button
                      type="button"
                      onClick={() => removeWish(index)}
                      className="ml-2 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              
              {wishes.length === 0 && (
                <p className="text-sm text-gray-500">Add at least one Christmas wish for your child</p>
              )}
            </CardContent>
          </Card>

          {/* Parent/Guardian Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-christmas-green-800">Parent/Guardian Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="parentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parentEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parentPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="relationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship to Child *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Parent">Parent</SelectItem>
                          <SelectItem value="Guardian">Guardian</SelectItem>
                          <SelectItem value="Grandparent">Grandparent</SelectItem>
                          <SelectItem value="Other Relative">Other Relative</SelectItem>
                          <SelectItem value="Foster Parent">Foster Parent</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Household Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-christmas-green-800">Household Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="householdSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Household Size *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
                          placeholder="Number of people in household"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="annualIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Annual Household Income *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select income range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Under $15,000">Under $15,000</SelectItem>
                          <SelectItem value="$15,000 - $25,000">$15,000 - $25,000</SelectItem>
                          <SelectItem value="$25,000 - $35,000">$25,000 - $35,000</SelectItem>
                          <SelectItem value="$35,000 - $50,000">$35,000 - $50,000</SelectItem>
                          <SelectItem value="Over $50,000">Over $50,000</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="specialNeeds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Special Needs or Circumstances</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please describe any special needs, medical conditions, or circumstances we should be aware of..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This helps us better understand your situation (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="additionalInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Information</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Is there anything else you'd like potential donors to know?"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Any additional context that might help donors connect with your child's story
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Submit Button with Status */}
          <div className="flex flex-col items-end space-y-4">
            {emailStatus !== 'idle' && (
              <div className="flex items-center space-x-2 text-sm">
                {getStatusIcon()}
                <span className={`
                  ${emailStatus === 'sending' ? 'text-blue-600' : ''}
                  ${emailStatus === 'success' ? 'text-green-600' : ''}
                  ${emailStatus === 'error' ? 'text-red-600' : ''}
                `}>
                  {emailStatus === 'sending' && 'Sending notification email...'}
                  {emailStatus === 'success' && 'Notification email sent successfully'}
                  {emailStatus === 'error' && 'Email notification failed'}
                </span>
              </div>
            )}
            
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-christmas-red-600 hover:bg-christmas-red-700"
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? "Submitting..." : "Submit Registration"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
