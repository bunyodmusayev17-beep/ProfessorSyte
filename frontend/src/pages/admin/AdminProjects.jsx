import { FolderKanban, Images, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { TextArea, TextInput } from '@/components/ui/Field';
import { EmptyState, ErrorState } from '@/components/ui/EmptyState';
import { Image } from '@/components/ui/Image';
import { ConfirmDialog, Modal } from '@/components/ui/Modal';
import { MultiImageUpload } from '@/components/ui/MultiImageUpload';
import { SkeletonGrid, VideoCardSkeleton } from '@/components/ui/Skeleton';
import { useCreateProject, useDeleteProject, useProjects } from '@/hooks/useProjects';
import { getErrorMessage, getFieldErrors } from '@/lib/apiError';
import { formatDate } from '@/lib/format';

const EMPTY_FORM = { title: '', description: '', images: [] };
const GRID = 'grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3';

/** Mounted only while open, so the form always starts from fresh state. */
function ProjectFormModal({ onClose }) {
  const createProject = useCreateProject();
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [progress, setProgress] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      setFieldErrors({ title: 'A title is required' });
      return;
    }
    setFieldErrors({});

    try {
      await createProject.mutateAsync({ ...form, onProgress: setProgress });
      toast.success('Project created');
      onClose();
    } catch (error) {
      const errors = getFieldErrors(error);
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
      } else {
        toast.error(getErrorMessage(error));
      }
    } finally {
      setProgress(null);
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="New project"
      description="Title, description and photos"
      className="sm:max-w-xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={createProject.isPending}>
            Cancel
          </Button>
          <Button form="project-form" type="submit" isLoading={createProject.isPending}>
            Create
          </Button>
        </>
      }
    >
      <form id="project-form" onSubmit={handleSubmit} className="space-y-5">
        <TextInput
          label="Title"
          value={form.title}
          onChange={(event) => setForm({ ...form, title: event.target.value })}
          error={fieldErrors.title}
          maxLength={200}
          required
        />

        <TextArea
          label="Description"
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
          error={fieldErrors.description}
          rows={4}
          maxLength={2000}
        />

        <MultiImageUpload
          label="Photos"
          files={form.images}
          onChange={(images) => setForm({ ...form, images })}
        />

        {progress !== null && progress < 100 && (
          <div className="bg-raised h-1.5 overflow-hidden rounded-full">
            <div
              className="bg-primary h-full transition-[width]"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </form>
    </Modal>
  );
}

export default function AdminProjects() {
  const projectsQuery = useProjects();
  const deleteProject = useDeleteProject();

  const [isCreating, setIsCreating] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  async function handleDelete() {
    try {
      await deleteProject.mutateAsync(pendingDelete.projectId);
      toast.success('Project deleted');
      setPendingDelete(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  const projects = projectsQuery.data ?? [];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsCreating(true)}>
          <Plus size={16} />
          Add project
        </Button>
      </div>

      {projectsQuery.isPending ? (
        <SkeletonGrid count={3} className={GRID}>
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
          description="Add your first project along with its photos."
          action={
            <Button onClick={() => setIsCreating(true)}>
              <Plus size={16} />
              Add project
            </Button>
          }
        />
      ) : (
        <div className={GRID}>
          {projects.map((project) => (
            <Card key={project.projectId} className="flex flex-col overflow-hidden">
              <div className="bg-media relative aspect-video">
                <Image
                  src={project.imageUrls?.[0]}
                  alt={project.title}
                  fallback={<FolderKanban size={24} />}
                />
                {project.imageUrls?.length > 1 && (
                  <span className="absolute top-2 right-2">
                    <Badge
                      tone="neutral"
                      className="border-transparent bg-black/70 text-white backdrop-blur"
                    >
                      <Images size={11} />
                      {project.imageUrls.length}
                    </Badge>
                  </span>
                )}
              </div>

              <div className="flex flex-1 items-start justify-between gap-2 p-3">
                <div className="min-w-0">
                  <p className="text-fg truncate text-sm font-medium">{project.title}</p>
                  <p className="text-subtle mt-0.5 text-xs">{formatDate(project.createdAt)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Delete ${project.title}`}
                  className="hover:text-danger shrink-0"
                  onClick={() => setPendingDelete(project)}
                >
                  <Trash2 size={15} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {isCreating && <ProjectFormModal onClose={() => setIsCreating(false)} />}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleDelete}
        isLoading={deleteProject.isPending}
        title="Delete project"
        message={`"${pendingDelete?.title}" and all of its photos will be deleted.`}
      />
    </div>
  );
}
