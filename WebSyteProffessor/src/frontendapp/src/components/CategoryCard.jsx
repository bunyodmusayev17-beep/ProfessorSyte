import { Link } from "react-router-dom";
import { Boxes } from "lucide-react";

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/videos?categoryId=${category.categoryId}`}
      className="card p-4 flex flex-col gap-3 hover:shadow-sm transition-shadow"
    >
      <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center">
        <Boxes className="text-primary" size={20} />
      </div>
      <div>
        <h3 className="font-medium text-ink text-sm">{category.name}</h3>
        <p className="text-xs text-muted mt-0.5">{category.videoCount} video</p>
      </div>
    </Link>
  );
}
