
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Wishlists from "./pages/Wishlists";
import Register from "./pages/Register";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import { useScrollCleanup } from "./hooks/useScrollCleanup";

const queryClient = new QueryClient();

function AppContent() {
  useScrollCleanup(); // Clean up scroll locks on route changes
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/wishlists" element={<Wishlists />} />
      <Route path="/register" element={<Register />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
