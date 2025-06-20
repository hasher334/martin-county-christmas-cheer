import { Mail, MapPin, Heart, Send } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthDialog } from "@/components/AuthDialog";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [user, setUser] = useState(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check auth state
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error("Auth check error:", error);
      }
    };
    
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you soon.",
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-christmas-cream to-white">
      <Header user={user} onAuthClick={() => setShowAuthDialog(true)} />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-christmas-green-800 mb-6 font-christmas">
            Contact Us
          </h1>
          <p className="text-xl text-christmas-brown-700 max-w-3xl mx-auto">
            Have questions about our Christmas adoption program? Want to get involved? 
            We'd love to hear from you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div>
            <Card className="bg-white shadow-lg border-0">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Heart className="h-8 w-8 text-christmas-red-500" />
                  <h2 className="text-2xl font-bold text-christmas-green-800 font-dancing">
                    Get in Touch
                  </h2>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Mail className="h-6 w-6 text-christmas-green-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-christmas-green-800 mb-1">Email Us</h3>
                      <p className="text-christmas-brown-700">info@candycanekindness.com</p>
                      <p className="text-sm text-christmas-brown-600 mt-1">
                        We typically respond within 24 hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-christmas-green-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-christmas-green-800 mb-1">Service Area</h3>
                      <p className="text-christmas-brown-700">Treasure Coast, Florida</p>
                      <p className="text-sm text-christmas-brown-600 mt-1">
                        Serving Martin, St. Lucie, and Indian River Counties
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-christmas-green-50 rounded-lg">
                  <h3 className="font-semibold text-christmas-green-800 mb-3">
                    Ways to Get Involved
                  </h3>
                  <ul className="space-y-2 text-christmas-brown-700">
                    <li>• Adopt a child for Christmas</li>
                    <li>• Volunteer during the holidays</li>
                    <li>• Partner with us as an organization</li>
                    <li>• Spread the word in your community</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
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
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-christmas-green-600 hover:bg-christmas-green-700 text-white py-3"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />

      <AuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog}
        onSuccess={() => setShowAuthDialog(false)}
      />
    </div>
  );
};

export default Contact;
