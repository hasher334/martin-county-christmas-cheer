
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Mail, AlertCircle } from "lucide-react";
import { sendCustomConfirmationEmail } from "@/utils/emailService";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

// Email validation helper
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const AuthDialog = ({ open, onOpenChange, onSuccess }: AuthDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showEmailSent, setShowEmailSent] = useState(false);
  const [emailError, setEmailError] = useState("");
  const { toast } = useToast();

  // Email validation on change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    // Clear error when user starts typing
    if (emailError) {
      setEmailError("");
    }
    
    // Validate email format if not empty
    if (newEmail && !isValidEmail(newEmail)) {
      setEmailError("Please enter a valid email address");
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email before proceeding
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address");
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Attempting sign in with email:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        
        if (error.message.includes('Email not confirmed')) {
          toast({
            title: "Email Not Confirmed",
            description: "Please check your email and click the confirmation link before signing in.",
            variant: "destructive",
          });
          return;
        }
        
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Invalid Credentials",
            description: "The email or password you entered is incorrect. Please try again.",
            variant: "destructive",
          });
          return;
        }
        
        throw error;
      }

      console.log('Sign in successful:', data);
      
      toast({
        title: "Welcome back! 🎄",
        description: "You're now signed in and ready to adopt a child for Christmas.",
      });
      
      onSuccess();
    } catch (error: any) {
      console.error('Unexpected sign in error:', error);
      toast({
        title: "Sign in failed",
        description: error.message || "An error occurred while signing in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email before proceeding
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address");
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address with a proper domain (e.g., user@example.com).",
        variant: "destructive",
      });
      return;
    }

    // Validate name
    if (!name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your full name.",
        variant: "destructive",
      });
      return;
    }

    // Validate password
    if (password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Attempting sign up with email:', email);
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: name.trim(),
            full_name: name.trim(),
          },
        },
      });

      if (error) {
        console.error('Sign up error:', error);
        
        if (error.message.includes('User already registered')) {
          toast({
            title: "Account Already Exists",
            description: "An account with this email already exists. Please sign in instead.",
            variant: "destructive",
          });
          return;
        }
        
        if (error.message.includes('Email address') && error.message.includes('invalid')) {
          setEmailError("This email address is not valid");
          toast({
            title: "Invalid Email Address",
            description: "Please enter a valid email address with a proper domain (e.g., user@gmail.com).",
            variant: "destructive",
          });
          return;
        }
        
        throw error;
      }

      console.log('Sign up successful:', data);

      // Show email sent confirmation
      setShowEmailSent(true);

      // Also send our custom beautiful confirmation email
      try {
        await sendCustomConfirmationEmail(email, name.trim());
        console.log('Custom confirmation email sent');
      } catch (emailError) {
        console.error('Error sending custom confirmation email:', emailError);
        // Don't block the signup flow for email sending errors
      }

      toast({
        title: "Account Created! 📧",
        description: "Please check your email to confirm your account before signing in.",
      });
      
    } catch (error: any) {
      console.error('Unexpected sign up error:', error);
      toast({
        title: "Sign up failed",
        description: error.message || "An error occurred while creating your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to resend confirmation.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;

      // Also send our custom confirmation email
      try {
        await sendCustomConfirmationEmail(email, name);
      } catch (emailError) {
        console.error('Error sending custom confirmation email:', emailError);
      }

      toast({
        title: "Confirmation Email Sent! 📧",
        description: "Please check your email for the confirmation link.",
      });
    } catch (error: any) {
      console.error('Resend confirmation error:', error);
      toast({
        title: "Failed to Resend",
        description: error.message || "Could not resend confirmation email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (showEmailSent) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-green-800">
              Check Your Email! 📧
            </DialogTitle>
          </DialogHeader>

          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-green-600" />
            </div>
            
            <div className="space-y-2">
              <p className="text-gray-700">
                We've sent a confirmation email to:
              </p>
              <p className="font-semibold text-green-800">{email}</p>
              <p className="text-sm text-gray-600">
                Please click the link in the email to confirm your account and complete registration.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleResendConfirmation}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Resend Confirmation Email
              </Button>
              
              <Button
                onClick={() => {
                  setShowEmailSent(false);
                  onOpenChange(false);
                }}
                variant="ghost"
                className="w-full"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-green-800">
            Join Our Christmas Mission
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                  className={`mt-1 ${emailError ? 'border-red-500' : ''}`}
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  title="Please enter a valid email address"
                />
                {emailError && (
                  <div className="flex items-center mt-1 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {emailError}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <Button
                type="submit"
                disabled={loading || !!emailError}
                className="w-full bg-red-500 hover:bg-red-600"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <Label htmlFor="signup-name">Full Name</Label>
                <Input
                  id="signup-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                  className={`mt-1 ${emailError ? 'border-red-500' : ''}`}
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  title="Please enter a valid email address"
                  placeholder="user@example.com"
                />
                {emailError && (
                  <div className="flex items-center mt-1 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {emailError}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="mt-1"
                  placeholder="At least 6 characters"
                />
              </div>
              <Button
                type="submit"
                disabled={loading || !!emailError || !name.trim()}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <p className="text-xs text-gray-600 text-center mt-4">
          By signing up, you agree to help spread Christmas cheer to children in need.
        </p>
      </DialogContent>
    </Dialog>
  );
};
