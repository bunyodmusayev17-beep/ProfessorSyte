import { useEffect, useState } from "react";
import { Trash2, Plus, X } from "lucide-react";
import { getAllVideos, createVideo, deleteVideo } from "../../api/videos";
import { getAllCategories } from "../../api/categories";

const emptyForm = {
  title: "",
  description: "",
  youtubeUrl: "",
  categoryId: "",
  isExclusive: false,
  productLinks: [],
};

export default function AdminVideos() {
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    const [videosData, categoriesData] = await Promise.all([
      getAllVideos(),
      getAllCategories(),
    ]);
    setVideos(videosData);
    setCategories(categoriesData);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function addProductLink() {
    setForm((f) => ({
      ...f,
      productLinks: [...f.productLinks, { storeName: "", productName: "", url: "" }],
    }));
  }

  function updateProductLink(index, field, value) {
    setForm((f) => {
      const updated = [...f.productLinks];
      updated[index] = { ...updated[index], [field]: value };
      return { ...f, productLinks: updated };
    });
  }

  function removeProductLink(index) {
    setForm((f) => ({
      ...f,
      productLinks: f.productLinks.filter((_, i) => i !== index),
    }));
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    try {
      await createVideo({
        title: form.title,
        description: form.description,
        youtubeUrl: form.youtubeUrl,
        categoryId: Number(form.categoryId),
        isExclusive: form.isExclusive,
        projectId: null,
        productLinks: form.productLinks,
      });
      setForm(emptyForm);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Xatolik yuz berdi");
    }
  }

  async function handleDelete(videoId) {
    if (!confirm("Ushbu videoni o'chirishga ishonchingiz komilmi?")) return;
    await deleteVideo(videoId);
    await load();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreate} className="card p-4 space-y-3">
        <h3 className="text-sm font-semibold text-ink">Yangi video qo'shish</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-ink block mb-1">Sarlavha</label>
            <input
              className="input-field"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink block mb-1">Kategoriya</label>
            <select
              className="input-field"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              required
            >
              <option value="">Tanlang</option>
              {categories.map((c) => (
                <option key={c.categoryId} value={c.categoryId}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-ink block mb-1">YouTube URL</label>
          <input
            className="input-field"
            placeholder="https://www.youtube.com/watch?v=... yoki https://youtu.be/..."
            value={form.youtubeUrl}
            onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink block mb-1">Tavsif</label>
          <textarea
            className="input-field"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={form.isExclusive}
            onChange={(e) => setForm({ ...form, isExclusive: e.target.checked })}
          />
          Exclusive (pullik) video
        </label>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-ink">Jihoz linklari</label>
            <button type="button" onClick={addProductLink} className="text-xs text-primary flex items-center gap-1">
              <Plus size={14} /> Qo'shish
            </button>
          </div>
          <div className="space-y-2">
            {form.productLinks.map((link, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-start">
                <input
                  className="input-field"
                  placeholder="Do'kon (masalan AliExpress)"
                  value={link.storeName}
                  onChange={(e) => updateProductLink(idx, "storeName", e.target.value)}
                />
                <input
                  className="input-field"
                  placeholder="Mahsulot nomi"
                  value={link.productName}
                  onChange={(e) => updateProductLink(idx, "productName", e.target.value)}
                />
                <input
                  className="input-field"
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) => updateProductLink(idx, "url", e.target.value)}
                />
                <button type="button" onClick={() => removeProductLink(idx)} className="text-muted hover:text-red-500 mt-2">
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" className="btn-primary text-sm">
          Video qo'shish
        </button>
      </form>

      {loading ? (
        <p className="text-muted text-sm">Yuklanmoqda...</p>
      ) : (
        <div className="card divide-y divide-border">
          {videos.map((v) => (
            <div key={v.videoId} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium text-ink">{v.title}</p>
                <p className="text-xs text-muted">{v.categoryName}</p>
              </div>
              <button onClick={() => handleDelete(v.videoId)} className="text-muted hover:text-red-500">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {videos.length === 0 && <p className="text-sm text-muted px-4 py-3">Hali video yo'q.</p>}
        </div>
      )}
    </div>
  );
}
