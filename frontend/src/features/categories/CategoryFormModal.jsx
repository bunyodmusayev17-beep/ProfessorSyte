import { useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/Button';
import { TextArea, TextInput } from '@/components/ui/Field';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Modal } from '@/components/ui/Modal';
import { useCreateCategory, useUpdateCategory } from '@/hooks/useCategories';
import { getErrorMessage, getFieldErrors } from '@/lib/apiError';

import { CategoryIconPicker } from './CategoryIconPicker';
import { getPresetKey, isUploadedIcon, toPresetValue } from './categoryIcons';

/** Build the initial state from the category being edited, or blank for a new one. */
function initialForm(category) {
  return {
    name: category?.name ?? '',
    description: category?.description ?? '',
    iconPreset: getPresetKey(category?.iconUrl),
    iconFile: null,
    coverFile: null,
    removeIcon: false,
    removeCoverImage: false,
  };
}

/**
 * Create or edit a category. The parent mounts this only while the dialog should
 * be open, so the form starts fresh every time without a reset effect.
 */
export function CategoryFormModal({ onClose, category = null }) {
  const isEditing = Boolean(category);
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const [form, setForm] = useState(() => initialForm(category));
  const [fieldErrors, setFieldErrors] = useState({});
  const [progress, setProgress] = useState(null);

  function update(patch) {
    setForm((previous) => ({ ...previous, ...patch }));
  }

  const isSubmitting = createCategory.isPending || updateCategory.isPending;

  async function handleSubmit(event) {
    event.preventDefault();
    setFieldErrors({});

    if (!form.name.trim()) {
      setFieldErrors({ name: 'A category name is required' });
      return;
    }

    const payload = {
      name: form.name,
      description: form.description,
      iconKey: form.iconPreset ? toPresetValue(form.iconPreset) : null,
      iconFile: form.iconFile,
      coverImage: form.coverFile,
      onProgress: setProgress,
    };

    try {
      if (isEditing) {
        await updateCategory.mutateAsync({
          categoryId: category.categoryId,
          ...payload,
          removeIcon: form.removeIcon,
          removeCoverImage: form.removeCoverImage,
        });
        toast.success('Category updated');
      } else {
        await createCategory.mutateAsync(payload);
        toast.success('Category created');
      }
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

  // Only show a stored icon when it is an uploaded image, not a preset key.
  const existingIconUrl =
    isEditing && !form.removeIcon && isUploadedIcon(category.iconUrl) ? category.iconUrl : null;
  const existingCoverUrl =
    isEditing && !form.removeCoverImage ? (category.coverImageUrl ?? null) : null;

  return (
    <Modal
      open
      onClose={onClose}
      title={isEditing ? 'Edit category' : 'New category'}
      description="Name, icon and cover image"
      className="sm:max-w-xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button form="category-form" type="submit" isLoading={isSubmitting}>
            {isEditing ? 'Save' : 'Create'}
          </Button>
        </>
      }
    >
      <form id="category-form" onSubmit={handleSubmit} className="space-y-5">
        <TextInput
          label="Name"
          value={form.name}
          onChange={(event) => update({ name: event.target.value })}
          error={fieldErrors.name}
          placeholder="e.g. Arduino"
          maxLength={100}
          required
        />

        <TextArea
          label="Description"
          value={form.description}
          onChange={(event) => update({ description: event.target.value })}
          error={fieldErrors.description}
          placeholder="What does this category cover?"
          rows={2}
          maxLength={500}
        />

        <CategoryIconPicker
          value={form.iconPreset}
          onChange={(iconPreset) => update({ iconPreset })}
          file={form.iconFile}
          existingUrl={existingIconUrl}
          onFileChange={(iconFile) => update({ iconFile, removeIcon: false })}
          onRemoveExisting={() => update({ removeIcon: true, iconPreset: null })}
        />

        <ImageUpload
          label="Cover image"
          hint="Shown behind the card · 4:3 or 16:9 works best"
          file={form.coverFile}
          existingUrl={existingCoverUrl}
          aspect="aspect-[4/3] max-w-xs"
          onChange={(coverFile) => update({ coverFile, removeCoverImage: false })}
          onRemoveExisting={() => update({ removeCoverImage: true })}
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
