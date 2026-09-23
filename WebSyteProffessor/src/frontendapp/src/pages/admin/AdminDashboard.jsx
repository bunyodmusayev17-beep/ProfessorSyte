import { useEffect, useState } from "react";
import { getAnalytics } from "../../api/admin";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalytics()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted text-sm">Yuklanmoqda...</p>;
  if (!data) return <p className="text-muted text-sm">Ma'lumot topilmadi.</p>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Jami videolar" value={data.totalVideos} />
        <StatCard label="Jami userlar" value={data.totalUsers} />
        <StatCard label="Jami izohlar" value={data.totalComments} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-ink mb-3">
            Eng ko'p ko'rilgan videolar
          </h3>
          <ol className="space-y-2 text-sm">
            {data.mostViewedVideos.map((v, idx) => (
              <li key={v.videoId} className="flex justify-between text-ink">
                <span>{idx + 1}. {v.title}</span>
                <span className="text-muted">{v.viewCount} ko'rish</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="card p-4">
          <h3 className="text-sm font-semibold text-ink mb-3">
            Eng ko'p like olgan videolar
          </h3>
          <ol className="space-y-2 text-sm">
            {data.mostLikedVideos.map((v, idx) => (
              <li key={v.videoId} className="flex justify-between text-ink">
                <span>{idx + 1}. {v.title}</span>
                <span className="text-muted">{v.likeCount} like</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="card p-4">
      <p className="text-xs text-muted mb-1">{label}</p>
      <p className="text-2xl font-semibold text-ink">{value}</p>
    </div>
  );
}
