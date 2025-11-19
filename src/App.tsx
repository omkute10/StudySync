import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignupPersonal from "./pages/signup/SignupPersonal";
import SignupInterests from "./pages/signup/SignupInterests";
import SignupRole from "./pages/signup/SignupRole";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import SearchTutors from "./pages/SearchTutors";
import SearchBuddies from "./pages/SearchBuddies";
import SearchPartners from "./pages/SearchPartners";
import Bookings from "./pages/tutor/Bookings";
import CreateCourse from "./pages/tutor/CreateCourse";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signup" element={<SignupPersonal />} />
          <Route path="/signup/interests" element={<SignupInterests />} />
          <Route path="/signup/role" element={<SignupRole />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/search-tutors" element={<SearchTutors />} />
          <Route path="/search-buddies" element={<SearchBuddies />} />
          <Route path="/search-partners" element={<SearchPartners />} />
          <Route path="/tutor/bookings" element={<Bookings />} />
          <Route path="/tutor/create-course" element={<CreateCourse />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
