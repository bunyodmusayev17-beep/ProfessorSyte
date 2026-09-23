import { NavLink } from "react-router-dom";
import { Home, PlayCircle, FolderKanban, Bookmark, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function MobileNav() {
  const { isAuthenticated, isAdmin } = useAuth();

  const items = [
    { to: "/", label: "Home", icon: Home },
    { to: "/videos", label: "Videos", icon: PlayCircle },
    { to: "/projects", label: "Projects", icon: FolderKanban },
    isAuthenticated
      ? { to: "/my-progress", label: "Progress", icon: Bookmark }
      : isAdmin
      ? { to: "/admin", label: "Admin", icon: ShieldCheck }
      : { to: "/login", label: "Login", icon: Bookmark },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border flex items-center justify-around py-2 z-20">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-xs px-3 py-1 rounded-lg ${
                isActive ? "text-primary" : "text-muted"
              }`
            }
          >
            <Icon size={20} />
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );
}
