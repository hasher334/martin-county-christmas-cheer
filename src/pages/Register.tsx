
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChildRegistrationForm } from "@/components/ChildRegistrationForm";
import { useToast } from "@/components/ui/use-toast";
import { Heart, Users, FileText } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegistrationSuccess = () => {
    toast({
      title: "Registration Successful!",
      description: "Your child's profile has been submitted for review. You'll be notified once it's approved.",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-christmas-cream to-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-christmas-green-600 to-christmas-green-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Register Your Child
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Help us create a magical Christmas for your child by sharing their story and wishes with our community of generous donors.
          </p>
          
          {/* Process Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="bg-white/20 rounded-full p-4 mb-4">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Fill Out Profile</h3>
              <p className="text-sm opacity-90">Share your child's story and Christmas wishes</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-white/20 rounded-full p-4 mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Review & Approval</h3>
              <p className="text-sm opacity-90">Our team reviews submissions for authenticity</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-white/20 rounded-full p-4 mb-4">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Get Matched</h3>
              <p className="text-sm opacity-90">Connect with donors who want to help</p>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <ChildRegistrationForm 
            onSuccess={handleRegistrationSuccess}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Register;
