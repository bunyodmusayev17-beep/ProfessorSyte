import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { getAllProjects, createProject, deleteProject } from "../../api/projects";

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    const data = await getAllProjects();
    setProjects(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await createProject({ title, description, images });
      setTitle("");
      setDescription("");
      setImages([]);
      e.target.reset();
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(projectId) {
    if (!confirm("Ushbu loyihani o'chirishga ishonchingiz komilmi?")) return;
    await deleteProject(projectId);
    await load();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreate} className="card p-4 space-y-3">
        <h3 className="text-sm font-semibold text-ink">Yangi loyiha qo'shish</h3>

        <div>
          <label className="text-sm font-medium text-ink block mb-1">Sarlavha</label>
          <input className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div>
          <label className="text-sm font-medium text-ink block mb-1">Tavsif</label>
          <textarea
            className="input-field"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink block mb-1">Rasmlar</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(e) => setImages(Array.from(e.target.files))}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary text-sm">
          {submitting ? "Yuklanmoqda..." : "Loyiha qo'shish"}
        </button>
      </form>

      {loading ? (
        <p className="text-muted text-sm">Yuklanmoqda...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <div key={p.projectId} className="card overflow-hidden">
              {p.imageUrls?.[0] && (
                <div className="aspect-video bg-ink/5">
                  <img src={p.imageUrls[0]} alt={p.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-3 flex items-center justify-between">
                <p className="text-sm font-medium text-ink">{p.title}</p>
                <button onClick={() => handleDelete(p.projectId)} className="text-muted hover:text-red-500">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {projects.length === 0 && <p className="text-sm text-muted">Hali loyiha yo'q.</p>}
        </div>
      )}
    </div>
  );
}
