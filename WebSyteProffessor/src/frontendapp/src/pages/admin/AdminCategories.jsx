import { useEffect, useState } from "react";
import { Trash2, Plus } from "lucide-react";
import {
  getAllCategories,
  createCategory,
  deleteCategory,
} from "../../api/categories";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    const data = await getAllCategories();
    setCategories(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    try {
      await createCategory({ name, description, iconUrl: null });
      setName("");
      setDescription("");
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Xatolik yuz berdi");
    }
  }

  async function handleDelete(categoryId) {
    if (!confirm("Ushbu kategoriyani o'chirishga ishonchingiz komilmi?")) return;
    await deleteCategory(categoryId);
    await load();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreate} className="card p-4 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[160px]">
          <label className="text-sm font-medium text-ink block mb-1">Nomi</label>
          <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="text-sm font-medium text-ink block mb-1">Tavsif</label>
          <input className="input-field" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <button type="submit" className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Qo'shish
        </button>
      </form>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-muted text-sm">Yuklanmoqda...</p>
      ) : (
        <div className="card divide-y divide-border">
          {categories.map((c) => (
            <div key={c.categoryId} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium text-ink">{c.name}</p>
                <p className="text-xs text-muted">{c.videoCount} video</p>
              </div>
              <button onClick={() => handleDelete(c.categoryId)} className="text-muted hover:text-red-500">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-sm text-muted px-4 py-3">Hali kategoriya yo'q.</p>
          )}
        </div>
      )}
    </div>
  );
}
