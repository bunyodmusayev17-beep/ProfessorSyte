import { ArrowUpRight, FolderKanban, Images } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { EmptyState, ErrorState } from '@/components/ui/EmptyState';
import { Image } from '@/components/ui/Image';
import { Modal } from '@/components/ui/Modal';
import { PageHeader } from '@/components/ui/PageHeader';
import { Stagger } from '@/components/ui/Reveal';
import { SkeletonGrid, VideoCardSkeleton } from '@/components/ui/Skeleton';
import { useProjects } from '@/hooks/useProjects';
import { useSpotlight } from '@/hooks/useSpotlight';
import { getErrorMessage } from '@/lib/apiError';
import { formatDate } from '@/lib/format';

const GRID = 'grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3';

function ProjectCard({ project, onOpen, style }) {
  const onMouseMove = useSpotlight();
  const imageCount = project.imageUrls?.length ?? 0;

  return (
    <Card
      as="button"
      type="button"
      onClick={() => onOpen(project)}
      onMouseMove={onMouseMove}
      style={style}
      className="group spotlight ring-gradient hover:shadow-card-hover flex flex-col overflow-hidden text-left transition-all duration-500 ease-(--ease-out-soft) hover:-translate-y-1.5"
    >
      <div className="bg-media relative aspect-video overflow-hidden">
        <Image
          src={project.imageUrls?.[0]}
          alt={project.title}
          className="transition-transform duration-700 ease-(--ease-out-soft) group-hover:scale-110"
          fallback={<FolderKanban size={28} />}
        />
        <span className="from-bg/80 absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />

        <span className="absolute top-2.5 left-2.5">
          <Badge className="bg-accent/85 border-transparent text-white backdrop-blur">
            Project
          </Badge>
        </span>

        {imageCount > 1 && (
          <span className="absolute top-2.5 right-2.5">
            <Badge className="border-white/10 bg-black/60 text-white backdrop-blur">
              <Images size={11} />
              {imageCount}
            </Badge>
          </span>
        )}

        <span className="bg-brand shadow-glow absolute right-3 bottom-3 flex size-9 translate-y-3 items-center justify-center rounded-full text-white opacity-0 transition-all duration-500 ease-(--ease-spring) group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight size={16} />
        </span>
      </div>

      <div className="relative z-[3] flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="text-fg group-hover:text-primary-light text-[15px] font-semibold transition-colors">
          {project.title}
        </h3>
        {project.description && (
          <p className="text-muted line-clamp-3 text-xs leading-relaxed">{project.description}</p>
        )}
        <p className="text-subtle border-line mt-auto border-t pt-3 text-xs">
          {formatDate(project.createdAt)}
        </p>
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
      <PageHeader
        eyebrow="Gallery"
        title="Projects"
        description="Real builds put together from the lessons"
      />

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
        <Stagger className={GRID}>
          {projects.map((project) => (
            <ProjectCard key={project.projectId} project={project} onOpen={setActiveProject} />
          ))}
        </Stagger>
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
                {activeProject.imageUrls.map((url, index) => (
                  <li
                    key={url}
                    className="border-line bg-media animate-reveal group aspect-video overflow-hidden rounded-xl border"
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <Image
                      src={url}
                      alt={activeProject.title}
                      className="transition-transform duration-700 group-hover:scale-105"
                    />
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
