import { useEffect, useState } from "react";
import { getAllUsers } from "../../api/admin";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUsers()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted text-sm">Yuklanmoqda...</p>;

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-muted border-b border-border">
            <th className="px-4 py-2 font-medium">Username</th>
            <th className="px-4 py-2 font-medium">Email</th>
            <th className="px-4 py-2 font-medium">Role</th>
            <th className="px-4 py-2 font-medium">Ro'yxatdan o'tgan</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b border-border last:border-0">
              <td className="px-4 py-2 text-ink">{u.userName}</td>
              <td className="px-4 py-2 text-ink">{u.email}</td>
              <td className="px-4 py-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    u.role === "Admin" ? "bg-primary-light text-primary" : "bg-surface text-muted"
                  }`}
                >
                  {u.role}
                </span>
              </td>
              <td className="px-4 py-2 text-muted">
                {new Date(u.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && <p className="text-sm text-muted px-4 py-3">Hali user yo'q.</p>}
    </div>
  );
}
