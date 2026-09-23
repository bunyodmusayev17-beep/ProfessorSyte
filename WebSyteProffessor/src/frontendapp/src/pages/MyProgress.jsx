import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, CheckCircle2 } from "lucide-react";
import Layout from "../components/Layout";
import { getMyFavorites, getMyProgress } from "../api/engagement";

export default function MyProgress() {
  const [favorites, setFavorites] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyFavorites(), getMyProgress()])
      .then(([favoritesData, progressData]) => {
        setFavorites(favoritesData);
        setProgress(progressData);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Layout>
        <p className="text-muted text-sm">Yuklanmoqda...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-xl font-semibold text-ink mb-6">Mening progressim</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-4">
          <h2 className="text-sm font-semibold text-ink mb-3 flex items-center gap-2">
            <Bookmark size={16} className="text-primary" /> Saqlangan videolar
          </h2>
          <div className="space-y-2">
            {favorites.map((f) => (
              <Link
                key={f.favoriteId}
                to={`/videos/${f.videoId}`}
                className="block text-sm text-ink hover:text-primary py-1.5 border-b border-border last:border-0"
              >
                {f.videoTitle}
              </Link>
            ))}
            {favorites.length === 0 && (
              <p className="text-xs text-muted">Hali hech narsa saqlanmagan.</p>
            )}
          </div>
        </div>

        <div className="card p-4">
          <h2 className="text-sm font-semibold text-ink mb-3 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-success" /> Ko'rilgan videolar
          </h2>
          <div className="space-y-2">
            {progress.map((p) => (
              <Link
                key={p.watchProgressId}
                to={`/videos/${p.videoId}`}
                className="block text-sm text-ink hover:text-primary py-1.5 border-b border-border last:border-0"
              >
                {p.videoTitle}
              </Link>
            ))}
            {progress.length === 0 && (
              <p className="text-xs text-muted">Hali hech narsa ko'rilmagan.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
