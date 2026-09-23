import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import CategoryCard from "../components/CategoryCard";
import VideoCard from "../components/VideoCard";
import { getAllCategories } from "../api/categories";
import { getAllVideos } from "../api/videos";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [categoriesData, videosData] = await Promise.all([
          getAllCategories(),
          getAllVideos(),
        ]);
        setCategories(categoriesData);
        setVideos(videosData);
      } catch {
        setError("Ma'lumotlarni yuklashda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const recentVideos = [...videos]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 8);

  return (
    <Layout>
      <section className="card p-6 mb-8">
        <h1 className="text-2xl font-semibold text-ink mb-2">
          Robototexnika va tech darsliklar
        </h1>
        <p className="text-muted text-sm">
          Video darsliklar, jihoz linklari va loyihalar galereyasi — bir joyda.
        </p>
      </section>

      {loading && <p className="text-muted text-sm">Yuklanmoqda...</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {!loading && !error && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-ink">Kategoriyalar</h2>
            <Link to="/videos" className="text-sm text-primary font-medium">
              Barchasini ko'rish →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
            {categories.map((category) => (
              <CategoryCard key={category.categoryId} category={category} />
            ))}
            {categories.length === 0 && (
              <p className="text-muted text-sm col-span-full">Hali kategoriya qo'shilmagan.</p>
            )}
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-ink">So'nggi videolar</h2>
            <Link to="/videos" className="text-sm text-primary font-medium">
              Barchasini ko'rish →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentVideos.map((video) => (
              <VideoCard key={video.videoId} video={video} />
            ))}
            {recentVideos.length === 0 && (
              <p className="text-muted text-sm col-span-full">Hali video qo'shilmagan.</p>
            )}
          </div>
        </>
      )}
    </Layout>
  );
}
