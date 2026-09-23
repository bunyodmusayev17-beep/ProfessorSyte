import { NavLink } from "react-router-dom";
import { Home, PlayCircle, FolderKanban, Bookmark, ShieldCheck, Cpu } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/videos", label: "All videos", icon: PlayCircle },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/my-progress", label: "My progress", icon: Bookmark, requiresAuth: true },
];

export default function Sidebar() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <aside className="hidden md:flex md:flex-col w-60 shrink-0 border-r border-border bg-white h-screen sticky top-0">
      <div className="flex items-center gap-2 px-5 py-5">
        <Cpu className="text-primary" size={22} />
        <span className="font-semibold text-ink text-lg">RobotTexnika</span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          if (item.requiresAuth && !isAuthenticated) return null;
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary-light text-primary"
                    : "text-muted hover:bg-surface hover:text-ink"
                }`
              }
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          );
        })}

        {isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-light text-primary"
                  : "text-muted hover:bg-surface hover:text-ink"
              }`
            }
          >
            <ShieldCheck size={18} />
            Admin panel
          </NavLink>
        )}
      </nav>

      <div className="px-5 py-4 text-xs text-muted border-t border-border">
        Robototexnika &amp; tech darsliklar
      </div>
    </aside>
  );
}
