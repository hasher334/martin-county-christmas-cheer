
import { useState } from "react";
import { Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const ContactFormSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("Sending contact form email");
      
      const { error } = await supabase.functions.invoke('send-notification-email', {
        body: {
          type: 'contact',
          contactName: formData.name,
          contactEmail: formData.email,
          subject: formData.subject,
          message: formData.message,
        }
      });

      if (error) {
        console.error("Error sending contact email:", error);
        throw error;
      }

      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });
      
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast({
        title: "Failed to send message",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Card className="bg-white shadow-lg border-0">
      <CardContent className="p-8">
        <h2 className="text-2xl font-bold text-christmas-green-800 mb-6 font-dancing">
          Send us a Message
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-christmas-green-800">
                Your Name *
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1"
                placeholder="Enter your full name"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-christmas-green-800">
                Email Address *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1"
                placeholder="your.email@example.com"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="subject" className="text-christmas-green-800">
              Subject *
            </Label>
            <Input
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="mt-1"
              placeholder="What is this regarding?"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="message" className="text-christmas-green-800">
              Message *
            </Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              className="mt-1 min-h-[120px]"
              placeholder="Tell us more about how we can help you..."
              disabled={isSubmitting}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-christmas-green-600 hover:bg-christmas-green-700 text-white py-3"
          >
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
