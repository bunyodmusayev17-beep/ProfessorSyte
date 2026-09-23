import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Cpu } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError("");
    setLoading(true);
    try {
      await register(email, password, userName);
      navigate("/");
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        setFieldErrors(data.errors);
      } else {
        setGeneralError(data?.message || "Ro'yxatdan o'tishda xatolik yuz berdi");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="card w-full max-w-sm p-8">
        <div className="flex items-center gap-2 justify-center mb-6">
          <Cpu className="text-primary" size={22} />
          <span className="font-semibold text-ink text-lg">RobotTexnika</span>
        </div>

        <h1 className="text-xl font-semibold text-ink mb-1">Ro'yxatdan o'tish</h1>
        <p className="text-sm text-muted mb-6">Yangi hisob yarating</p>

        {generalError && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-ink block mb-1">Username</label>
            <input
              className={`input-field ${fieldErrors.userName ? "border-red-400" : ""}`}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
            {fieldErrors.userName && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.userName}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-ink block mb-1">Email</label>
            <input
              className={`input-field ${fieldErrors.email ? "border-red-400" : ""}`}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {fieldErrors.email && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.email}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-ink block mb-1">Parol</label>
            <input
              className="input-field"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Yaratilyapti..." : "Ro'yxatdan o'tish"}
          </button>
        </form>

        <p className="text-sm text-muted mt-6 text-center">
          Hisobingiz bormi?{" "}
          <Link to="/login" className="text-primary font-medium">
            Kiring
          </Link>
        </p>
      </div>
    </div>
  );
}
