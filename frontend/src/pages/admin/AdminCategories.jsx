import { Boxes, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState, ErrorState } from '@/components/ui/EmptyState';
import { Image } from '@/components/ui/Image';
import { ConfirmDialog } from '@/components/ui/Modal';
import { RowsSkeleton } from '@/components/ui/Skeleton';
import { CategoryFormModal } from '@/features/categories/CategoryFormModal';
import { CategoryIcon } from '@/features/categories/CategoryIcon';
import { useCategories, useDeleteCategory } from '@/hooks/useCategories';
import { getErrorMessage } from '@/lib/apiError';
import { formatCount } from '@/lib/format';

export default function AdminCategories() {
  const categoriesQuery = useCategories();
  const deleteCategory = useDeleteCategory();

  const [editing, setEditing] = useState(null); // null = closed, {} = create
  const [pendingDelete, setPendingDelete] = useState(null);

  async function handleDelete() {
    try {
      await deleteCategory.mutateAsync(pendingDelete.categoryId);
      toast.success('Category deleted');
      setPendingDelete(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  const categories = categoriesQuery.data ?? [];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setEditing({})}>
          <Plus size={16} />
          Add category
        </Button>
      </div>

      {categoriesQuery.isPending ? (
        <RowsSkeleton count={4} />
      ) : categoriesQuery.error ? (
        <ErrorState
          message={getErrorMessage(categoriesQuery.error)}
          onRetry={categoriesQuery.refetch}
        />
      ) : categories.length === 0 ? (
        <EmptyState
          icon={Boxes}
          title="No categories yet"
          description="Add your first category with a name, an icon and a cover image."
          action={
            <Button onClick={() => setEditing({})}>
              <Plus size={16} />
              Add category
            </Button>
          }
        />
      ) : (
        <Card className="divide-line divide-y">
          {categories.map((category) => (
            <div
              key={category.categoryId}
              className="flex items-center gap-3 px-3 py-3 sm:gap-4 sm:px-4"
            >
              <div className="border-line bg-media size-12 shrink-0 overflow-hidden rounded-lg border sm:size-14">
                <Image
                  src={category.coverImageUrl}
                  alt=""
                  fallback={<CategoryIcon iconUrl={category.iconUrl} size={20} />}
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <CategoryIcon
                    iconUrl={category.iconUrl}
                    size={14}
                    className="text-primary-light shrink-0"
                  />
                  <p className="text-fg truncate text-sm font-medium">{category.name}</p>
                </div>
                {category.description && (
                  <p className="text-subtle mt-0.5 line-clamp-1 text-xs">{category.description}</p>
                )}
                <p className="text-subtle mt-0.5 text-xs">
                  {formatCount(category.videoCount)} videos
                </p>
              </div>

              <div className="flex shrink-0 gap-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Edit ${category.name}`}
                  onClick={() => setEditing(category)}
                >
                  <Pencil size={15} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Delete ${category.name}`}
                  className="hover:text-danger"
                  onClick={() => setPendingDelete(category)}
                >
                  <Trash2 size={15} />
                </Button>
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* Mounted only while open, so the form always starts from fresh state. */}
      {editing && (
        <CategoryFormModal
          onClose={() => setEditing(null)}
          category={editing.categoryId ? editing : null}
        />
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleDelete}
        isLoading={deleteCategory.isPending}
        title="Delete category"
        message={`"${pendingDelete?.name}" and every video in it will be deleted. This cannot be undone.`}
      />
    </div>
  );
}
