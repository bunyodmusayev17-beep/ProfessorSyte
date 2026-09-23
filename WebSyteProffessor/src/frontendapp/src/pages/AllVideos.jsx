import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import VideoCard from "../components/VideoCard";
import { getAllVideos, getVideosByCategory } from "../api/videos";
import { getAllCategories } from "../api/categories";

export default function AllVideos() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const search = searchParams.get("search") || "";

  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [videosData, categoriesData] = await Promise.all([
          categoryId ? getVideosByCategory(categoryId) : getAllVideos(),
          getAllCategories(),
        ]);
        setVideos(videosData);
        setCategories(categoriesData);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [categoryId]);

  const filteredVideos = search
    ? videos.filter((v) => v.title.toLowerCase().includes(search.toLowerCase()))
    : videos;

  function selectCategory(id) {
    if (id) {
      setSearchParams({ categoryId: id });
    } else {
      setSearchParams({});
    }
  }

  const activeCategory = categories.find((c) => String(c.categoryId) === categoryId);

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-ink">
          {activeCategory ? activeCategory.name : "Barcha videolar"}
        </h1>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => selectCategory(null)}
          className={`text-sm px-3 py-1.5 rounded-full border ${
            !categoryId ? "bg-primary text-white border-primary" : "border-border text-muted"
          }`}
        >
          Hammasi
        </button>
        {categories.map((c) => (
          <button
            key={c.categoryId}
            onClick={() => selectCategory(c.categoryId)}
            className={`text-sm px-3 py-1.5 rounded-full border ${
              String(c.categoryId) === categoryId
                ? "bg-primary text-white border-primary"
                : "border-border text-muted"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-muted text-sm">Yuklanmoqda...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredVideos.map((video) => (
            <VideoCard key={video.videoId} video={video} />
          ))}
          {filteredVideos.length === 0 && (
            <p className="text-muted text-sm col-span-full">Hech narsa topilmadi.</p>
          )}
        </div>
      )}
    </Layout>
  );
}
