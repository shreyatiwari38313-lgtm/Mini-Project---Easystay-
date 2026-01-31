import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";

import Index from "./pages/Index";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GuestDashboard from "./pages/GuestDashboard";
import HostDashboard from "./pages/HostDashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Payment from "./pages/Payment";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboards */}
        <Route
          path="/guest-dashboard"
          element={
            <ProtectedRoute>
              <GuestDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/host-dashboard"
          element={
       
              <HostDashboard />
          }
        />
        <Route path="/payment" element={<Payment/>}/>

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>

    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
