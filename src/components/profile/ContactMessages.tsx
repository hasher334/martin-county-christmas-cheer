
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { MessageCircle, Send, Clock, User } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface ContactMessagesProps {
  user: any;
}

export const ContactMessages = ({ user }: ContactMessagesProps) => {
  const [adoptions, setAdoptions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdoption, setSelectedAdoption] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAdoptionsAndMessages();
  }, [user.id]);

  const fetchAdoptionsAndMessages = async () => {
    try {
      const { data: donor } = await supabase
        .from("donors")
        .select("id, name, email")
        .eq("user_id", user.id)
        .single();

      if (!donor) {
        setLoading(false);
        return;
      }

      // Fetch adoptions
      const { data: adoptionsData } = await supabase
        .from("adoptions")
        .select(`
          *,
          children (name, age, location)
        `)
        .eq("donor_id", donor.id)
        .eq("contact_allowed", true)
        .order("adopted_at", { ascending: false });

      setAdoptions(adoptionsData || []);

      // Fetch all messages for these adoptions
      if (adoptionsData && adoptionsData.length > 0) {
        const adoptionIds = adoptionsData.map(a => a.id);
        const { data: messagesData } = await supabase
          .from("contact_messages")
          .select("*")
          .in("adoption_id", adoptionIds)
          .order("created_at", { ascending: true });

        setMessages(messagesData || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!selectedAdoption || !newMessage.trim()) return;

    setSending(true);
    try {
      const { data: donor } = await supabase
        .from("donors")
        .select("name, email")
        .eq("user_id", user.id)
        .single();

      const { error } = await supabase
        .from("contact_messages")
        .insert({
          adoption_id: selectedAdoption.id,
          sender_type: "donor",
          sender_name: donor?.name || user.email,
          sender_email: donor?.email || user.email,
          message: newMessage,
        });

      if (error) throw error;

      // Update last contact date
      await supabase
        .from("adoptions")
        .update({ last_contact_date: new Date().toISOString() })
        .eq("id", selectedAdoption.id);

      toast({
        title: "Message Sent",
        description: "Your message has been sent to the family.",
      });

      setNewMessage("");
      setSelectedAdoption(null);
      fetchAdoptionsAndMessages();
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const getMessagesForAdoption = (adoptionId: string) => {
    return messages.filter(msg => msg.adoption_id === adoptionId);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-christmas-green-700">Family Communications</CardTitle>
          <CardDescription>
            Send messages to the families of children you've adopted
          </CardDescription>
        </CardHeader>
      </Card>

      {adoptions.length > 0 ? (
        <div className="space-y-6">
          {adoptions.map((adoption: any) => {
            const adoptionMessages = getMessagesForAdoption(adoption.id);
            const lastMessage = adoptionMessages[adoptionMessages.length - 1];
            
            return (
              <Card key={adoption.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-christmas-green-700">
                        {adoption.children?.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Age {adoption.children?.age} • {adoption.children?.location}
                      </p>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedAdoption(adoption)}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Send Message
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>
                            Send Message to {adoption.children?.name}'s Family
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          {/* Previous Messages */}
                          {adoptionMessages.length > 0 && (
                            <div className="max-h-60 overflow-y-auto space-y-3 border rounded-lg p-4 bg-gray-50">
                              <h4 className="font-semibold text-sm text-gray-700">Previous Messages:</h4>
                              {adoptionMessages.map((msg) => (
                                <div
                                  key={msg.id}
                                  className={`p-3 rounded-lg ${
                                    msg.sender_type === 'donor'
                                      ? 'bg-blue-100 ml-8'
                                      : 'bg-green-100 mr-8'
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium">
                                      {msg.sender_type === 'donor' ? 'You' : msg.sender_name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {new Date(msg.created_at).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700">{msg.message}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* New Message */}
                          <div>
                            <Label htmlFor="new-message">Your Message</Label>
                            <Textarea
                              id="new-message"
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              placeholder="Write a message to the family..."
                              rows={4}
                            />
                          </div>

                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setSelectedAdoption(null);
                                setNewMessage("");
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={sendMessage}
                              disabled={sending || !newMessage.trim()}
                            >
                              {sending ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                  Sending...
                                </>
                              ) : (
                                <>
                                  <Send className="h-4 w-4 mr-2" />
                                  Send Message
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Message Summary */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        Messages: {adoptionMessages.length}
                      </span>
                      {adoption.last_contact_date && (
                        <div className="flex items-center text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          Last contact: {new Date(adoption.last_contact_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    {lastMessage && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center mb-1">
                          <User className="h-3 w-3 mr-1 text-gray-400" />
                          <span className="text-xs font-medium text-gray-600">
                            {lastMessage.sender_type === 'donor' ? 'You' : lastMessage.sender_name}
                          </span>
                          <span className="text-xs text-gray-400 ml-2">
                            {new Date(lastMessage.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {lastMessage.message}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Messages Available
            </h3>
            <p className="text-gray-500">
              You can send messages to families once you adopt children for Christmas.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
