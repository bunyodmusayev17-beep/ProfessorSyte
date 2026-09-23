import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Cpu } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [emailOrUserName, setEmailOrUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(emailOrUserName, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login yoki parol xato");
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

        <h1 className="text-xl font-semibold text-ink mb-1">Kirish</h1>
        <p className="text-sm text-muted mb-6">Hisobingizga kiring</p>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-ink block mb-1">Email yoki username</label>
            <input
              className="input-field"
              value={emailOrUserName}
              onChange={(e) => setEmailOrUserName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink block mb-1">Parol</label>
            <input
              className="input-field"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Kirilyapti..." : "Kirish"}
          </button>
        </form>

        <p className="text-sm text-muted mt-6 text-center">
          Hisobingiz yo'qmi?{" "}
          <Link to="/register" className="text-primary font-medium">
            Ro'yxatdan o'ting
          </Link>
        </p>
      </div>
    </div>
  );
}
