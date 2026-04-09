import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import Messages from "./pages/Messages";
import ChatThread from "./pages/ChatThread";
import Trace from "./pages/Trace";
import People from "./pages/People";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/messages/:id" element={<ChatThread />} />
          <Route element={<AppLayout><Routes><Route path="/" element={<Index />} /><Route path="/messages" element={<Messages />} /><Route path="/trace" element={<Trace />} /><Route path="/people" element={<People />} /><Route path="/profile" element={<Profile />} /><Route path="*" element={<NotFound />} /></Routes></AppLayout>}>
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
