import { useNavigate } from "react-router-dom";
import { Search, LogOut, User, Cpu } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Topbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/videos?search=${encodeURIComponent(query.trim())}`);
    }
  }

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-border px-4 md:px-8 py-3 flex items-center justify-between gap-3">
      <div className="md:hidden flex items-center gap-1.5 shrink-0">
        <Cpu className="text-primary" size={20} />
        <span className="font-semibold text-ink text-sm">WebSyteProfessor</span>
      </div>

      <form onSubmit={handleSearch} className="flex-1 max-w-md relative min-w-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          placeholder="Video qidirish..."
          className="input-field pl-9"
        />
      </form>

      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        {isAuthenticated ? (
          <>
            <div className="hidden sm:flex items-center gap-2 text-sm text-ink">
              <User size={16} className="text-muted" />
              {user.email}
            </div>
            <button onClick={handleLogout} className="btn-secondary flex items-center gap-2 text-sm px-2.5 md:px-4">
              <LogOut size={16} />
              <span className="hidden sm:inline">Chiqish</span>
            </button>
          </>
        ) : (
          <>
            <button onClick={() => navigate("/login")} className="btn-secondary text-sm px-2.5 md:px-4">
              Kirish
            </button>
            <button onClick={() => navigate("/register")} className="btn-primary text-sm px-2.5 md:px-4 hidden sm:inline-block">
              Ro'yxatdan o'tish
            </button>
          </>
        )}
      </div>
    </header>
  );
}
