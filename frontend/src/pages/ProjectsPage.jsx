import { FolderKanban, Images } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { EmptyState, ErrorState } from '@/components/ui/EmptyState';
import { Image } from '@/components/ui/Image';
import { Modal } from '@/components/ui/Modal';
import { PageHeader } from '@/components/ui/PageHeader';
import { SkeletonGrid, VideoCardSkeleton } from '@/components/ui/Skeleton';
import { useProjects } from '@/hooks/useProjects';
import { getErrorMessage } from '@/lib/apiError';
import { formatDate } from '@/lib/format';

const GRID = 'grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3';

function ProjectCard({ project, onOpen }) {
  const imageCount = project.imageUrls?.length ?? 0;

  return (
    <Card
      as="button"
      type="button"
      onClick={() => onOpen(project)}
      className="group hover:border-primary/50 hover:shadow-card-hover flex flex-col overflow-hidden text-left transition-all"
    >
      <div className="bg-media relative aspect-video overflow-hidden">
        <Image
          src={project.imageUrls?.[0]}
          alt={project.title}
          className="transition-transform duration-300 group-hover:scale-[1.04]"
          fallback={<FolderKanban size={26} />}
        />

        <span className="absolute top-2 left-2">
          <Badge tone="accent" className="bg-accent/90 border-transparent text-white backdrop-blur">
            Project
          </Badge>
        </span>

        {imageCount > 1 && (
          <span className="absolute top-2 right-2">
            <Badge
              tone="neutral"
              className="border-transparent bg-black/70 text-white backdrop-blur"
            >
              <Images size={11} />
              {imageCount}
            </Badge>
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 className="text-fg group-hover:text-primary-light text-sm font-semibold transition-colors">
          {project.title}
        </h3>
        {project.description && (
          <p className="text-muted line-clamp-3 text-xs">{project.description}</p>
        )}
        <p className="text-subtle mt-auto pt-1 text-xs">{formatDate(project.createdAt)}</p>
      </div>
    </Card>
  );
}

export default function ProjectsPage() {
  const projectsQuery = useProjects();
  const [activeProject, setActiveProject] = useState(null);

  const projects = projectsQuery.data ?? [];

  return (
    <>
      <PageHeader title="Projects" description="Real builds put together from the lessons" />

      {projectsQuery.isPending ? (
        <SkeletonGrid count={6} className={GRID}>
          <VideoCardSkeleton />
        </SkeletonGrid>
      ) : projectsQuery.error ? (
        <ErrorState
          message={getErrorMessage(projectsQuery.error)}
          onRetry={projectsQuery.refetch}
        />
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Add the first project, with its photos, from the admin panel."
        />
      ) : (
        <div className={GRID}>
          {projects.map((project) => (
            <ProjectCard key={project.projectId} project={project} onOpen={setActiveProject} />
          ))}
        </div>
      )}

      <Modal
        open={Boolean(activeProject)}
        onClose={() => setActiveProject(null)}
        title={activeProject?.title ?? ''}
        description={activeProject ? formatDate(activeProject.createdAt) : undefined}
        className="sm:max-w-2xl"
      >
        {activeProject && (
          <div className="space-y-4">
            {activeProject.description && (
              <p className="text-muted text-sm whitespace-pre-line">{activeProject.description}</p>
            )}

            {activeProject.imageUrls?.length > 0 && (
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {activeProject.imageUrls.map((url) => (
                  <li
                    key={url}
                    className="border-line bg-media aspect-video overflow-hidden rounded-lg border"
                  >
                    <Image src={url} alt={activeProject.title} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
