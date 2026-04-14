import { Home, MessageCircle, Users, User, Plus } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const tabs = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Users, label: "Rooms", path: "/rooms" },
  { icon: Plus, label: "Post", path: "__post__" },
  { icon: MessageCircle, label: "Chat", path: "/messages" },
  { icon: User, label: "Profile", path: "/profile" },
];

interface BottomNavProps {
  onPostClick?: () => void;
}

const BottomNav = ({ onPostClick }: BottomNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname.startsWith("/messages/")) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50" style={{
      background: 'rgba(11, 11, 15, 0.85)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '20px 20px 0 0',
    }}>
      <div className="max-w-lg mx-auto flex items-center justify-around py-2 px-4">
        {tabs.map((tab) => {
          const isPost = tab.path === "__post__";
          const isActive = !isPost && location.pathname === tab.path;

          if (isPost) {
            return (
              <button
                key="post"
                onClick={onPostClick}
                className="w-12 h-12 -mt-6 rounded-full flex items-center justify-center gradient-primary btn-glow fab-pulse"
              >
                <Plus className="w-6 h-6 text-primary-foreground" />
              </button>
            );
          }

          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-2xl transition-all duration-300 ${
                isActive ? "scale-110" : "scale-100 hover:scale-105"
              }`}
              style={isActive ? {
                background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(59,130,246,0.1))',
                boxShadow: '0 0 16px rgba(99,102,241,0.15)',
              } : undefined}
            >
              <tab.icon
                className={`w-5 h-5 transition-all duration-300 ${
                  isActive ? "text-primary drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]" : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-[10px] font-medium transition-colors duration-300 ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
