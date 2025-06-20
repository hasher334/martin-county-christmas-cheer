
import { useAuthNotifications } from "@/hooks/useAuthNotifications";
import { useEmailConfirmation } from "@/hooks/useEmailConfirmation";
import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Wishlists from "@/pages/Wishlists";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";

function AppProviders() {
  // Initialize auth notifications
  useAuthNotifications();
  
  // Handle email confirmations
  useEmailConfirmation();

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/wishlists" element={<Wishlists />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/register" element={<Register />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppProviders;
