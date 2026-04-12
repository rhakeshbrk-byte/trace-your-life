import { Home, MessageCircle, Activity, Users, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const tabs = [
  { icon: Home, label: "Home", path: "/" },
  { icon: MessageCircle, label: "Messages", path: "/messages" },
  { icon: Activity, label: "Trace", path: "/trace" },
  { icon: Users, label: "People", path: "/people" },
  { icon: User, label: "Profile", path: "/profile" },
];

const BottomNav = () => {
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
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-0.5 py-1.5 px-3 transition-all duration-300 rounded-2xl ${
                isActive ? "scale-110" : "scale-100"
              }`}
              style={isActive ? {
                background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(59,130,246,0.1))',
              } : undefined}
            >
              <tab.icon
                className={`w-5 h-5 transition-all duration-300 ${
                  isActive ? "text-primary drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]" : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
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
