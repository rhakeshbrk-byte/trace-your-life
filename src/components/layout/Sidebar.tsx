import { Home, MessageCircle, Users, User, Zap, Radio, GitBranch, Sparkles } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logoImage from "../../assets/images/stardust-logo.png";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Users, label: "Rooms", path: "/rooms" },
  { icon: MessageCircle, label: "Messages", path: "/messages" },
  { icon: Radio, label: "Pulse", path: "/pulse" },
  { icon: Sparkles, label: "Mirror", path: "/mirror" },
  { icon: GitBranch, label: "Echo", path: "/echo" },
  { icon: Zap, label: "Signal", path: "/signal" },
  { icon: User, label: "Profile", path: "/profile" },
];

interface SidebarProps {
  onPostClick?: () => void;
}

const Sidebar = ({ onPostClick }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 h-screen sticky top-0 z-40 border-r border-white/[0.06]"
      style={{
        background: "rgba(11, 11, 15, 0.85)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
    >
      {/* Logo */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl overflow-hidden gradient-primary btn-glow flex items-center justify-center">
            <img src={logoImage} alt="StarDust logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground leading-none">StarDust</h1>
            <p className="text-[10px] text-muted-foreground leading-tight">Express freely</p>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 text-left group ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              style={
                isActive
                  ? {
                      background:
                        "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(59,130,246,0.08))",
                      boxShadow: "0 0 16px rgba(99,102,241,0.1)",
                      border: "1px solid rgba(99,102,241,0.15)",
                    }
                  : {
                      background: "transparent",
                      border: "1px solid transparent",
                    }
              }
            >
              <item.icon
                className={`w-5 h-5 shrink-0 transition-all duration-300 ${
                  isActive
                    ? "text-primary drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]"
                    : "text-muted-foreground group-hover:text-foreground"
                }`}
              />
              <span className="text-sm font-medium">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </nav>

      {/* New Post CTA */}
      <div className="p-4">
        <button
          onClick={onPostClick}
          className="w-full py-3 rounded-2xl gradient-primary btn-glow text-sm font-semibold text-foreground flex items-center justify-center gap-2 haptic-press"
        >
          <Sparkles className="w-4 h-4" />
          New Post
        </button>
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 pt-2 border-t border-white/[0.04]">
        <p className="text-[10px] text-muted-foreground/50 text-center">
          StarDust · Zero tracking · All local
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
