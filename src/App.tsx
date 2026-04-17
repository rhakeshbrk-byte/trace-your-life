import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import BottomNav from "@/components/layout/BottomNav";
import Sidebar from "@/components/layout/Sidebar";
import PostModal from "@/components/PostModal";
import PageTransition from "@/components/PageTransition";
import Onboarding from "@/components/Onboarding";
import Index from "./pages/Index";
import Rooms from "./pages/Rooms";
import Messages from "./pages/Messages";
import ChatThread from "./pages/ChatThread";
import Profile from "./pages/Profile";
import Mirror from "./pages/Mirror";
import EchoChain from "./pages/EchoChain";
import Signal from "./pages/Signal";
import Pulse from "./pages/Pulse";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ONBOARDING_KEY = "stardust_onboarded";

const AppContent = () => {
  const location = useLocation();
  const hideNav = location.pathname.startsWith("/messages/");
  const [postOpen, setPostOpen] = useState(false);

  const [onboarded, setOnboarded] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ONBOARDING_KEY) === "true";
    } catch {
      return false;
    }
  });

  const handleOnboardingComplete = (data: { username: string; moods: string[] }) => {
    try {
      localStorage.setItem(ONBOARDING_KEY, "true");
      if (data.username) localStorage.setItem("stardust_username", data.username);
      if (data.moods.length > 0) localStorage.setItem("stardust_moods", JSON.stringify(data.moods));
    } catch {
      // ignore
    }
    setOnboarded(true);
  };

  if (!onboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="h-screen bg-background flex overflow-hidden relative">
      {/* Aurora background — fixed so it covers the whole screen */}
      <div className="aurora-bg">
        <div className="aurora-blob" />
        <div className="aurora-blob-secondary" />
      </div>

      {/* Sidebar — desktop/tablet only */}
      {!hideNav && <Sidebar onPostClick={() => setPostOpen(true)} />}

      {/* Main scrollable content */}
      <div
        className={`flex-1 relative z-10 overflow-y-auto ${!hideNav ? "pb-20 md:pb-0" : ""}`}
      >
        <PageTransition locationKey={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<Index />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/messages/:id" element={<ChatThread />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/mirror" element={<Mirror />} />
            <Route path="/echo" element={<EchoChain />} />
            <Route path="/signal" element={<Signal />} />
            <Route path="/pulse" element={<Pulse />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>
      </div>

      {/* Bottom nav — mobile only */}
      {!hideNav && <BottomNav onPostClick={() => setPostOpen(true)} />}
      <PostModal open={postOpen} onClose={() => setPostOpen(false)} />
    </div>
  );
};

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
