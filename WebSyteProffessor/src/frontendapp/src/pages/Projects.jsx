import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getAllProjects } from "../api/projects";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProjects()
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <h1 className="text-xl font-semibold text-ink mb-6">Loyihalar</h1>

      {loading ? (
        <p className="text-muted text-sm">Yuklanmoqda...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => (
            <div key={project.projectId} className="card overflow-hidden">
              {project.imageUrls?.[0] && (
                <div className="aspect-video bg-ink/5">
                  <img
                    src={project.imageUrls[0]}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-medium text-ink text-sm mb-1">{project.title}</h3>
                <p className="text-xs text-muted line-clamp-3">{project.description}</p>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <p className="text-muted text-sm col-span-full">Hali loyiha qo'shilmagan.</p>
          )}
        </div>
      )}
    </Layout>
  );
}
