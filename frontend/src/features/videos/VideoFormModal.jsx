import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/Button';
import { Checkbox, Select, TextArea, TextInput } from '@/components/ui/Field';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Modal } from '@/components/ui/Modal';
import { useCategories } from '@/hooks/useCategories';
import { useCreateVideo, useUpdateVideo } from '@/hooks/useVideos';
import { getErrorMessage, getFieldErrors } from '@/lib/apiError';
import { getYoutubeThumbnailUrl, isValidYoutubeUrl } from '@/lib/youtube';

const EMPTY_PRODUCT_LINK = { storeName: '', productName: '', url: '' };

/** Build the initial state from the video being edited, or blank for a new one. */
function initialForm(video) {
  return {
    title: video?.title ?? '',
    description: video?.description ?? '',
    youtubeUrl: video?.youtubeUrl ?? '',
    categoryId: video?.categoryId ? String(video.categoryId) : '',
    isExclusive: Boolean(video?.isExclusive),
    productLinks: (video?.productLinks ?? []).map((link) => ({
      storeName: link.storeName ?? '',
      productName: link.productName ?? '',
      url: link.url ?? '',
    })),
    thumbnailFile: null,
    removeThumbnail: false,
  };
}

/**
 * Create or edit a video. The parent mounts this only while the dialog should be
 * open, so the form starts fresh every time without a reset effect.
 */
export function VideoFormModal({ onClose, video = null }) {
  const isEditing = Boolean(video);
  const { data: categories = [] } = useCategories();
  const createVideo = useCreateVideo();
  const updateVideo = useUpdateVideo();

  const [form, setForm] = useState(() => initialForm(video));
  const [fieldErrors, setFieldErrors] = useState({});
  const [progress, setProgress] = useState(null);

  function update(patch) {
    setForm((previous) => ({ ...previous, ...patch }));
  }

  function updateProductLink(index, field, value) {
    setForm((previous) => ({
      ...previous,
      productLinks: previous.productLinks.map((link, current) =>
        current === index ? { ...link, [field]: value } : link
      ),
    }));
  }

  const isSubmitting = createVideo.isPending || updateVideo.isPending;

  function validate() {
    const errors = {};
    if (!form.title.trim()) errors.title = 'A title is required';
    if (!form.categoryId) errors.categoryId = 'Pick a category';
    if (!form.youtubeUrl.trim()) {
      errors.youtubeUrl = 'A YouTube link is required';
    } else if (!isValidYoutubeUrl(form.youtubeUrl)) {
      errors.youtubeUrl = 'Link not recognised. watch?v=, youtu.be/ and /shorts/ are all accepted';
    }
    return errors;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    const payload = {
      title: form.title,
      description: form.description,
      youtubeUrl: form.youtubeUrl,
      categoryId: form.categoryId,
      isExclusive: form.isExclusive,
      productLinks: form.productLinks,
      thumbnail: form.thumbnailFile,
      onProgress: setProgress,
    };

    try {
      if (isEditing) {
        await updateVideo.mutateAsync({
          videoId: video.videoId,
          ...payload,
          removeThumbnail: form.removeThumbnail,
        });
        toast.success('Video updated');
      } else {
        await createVideo.mutateAsync(payload);
        toast.success('Video created');
      }
      onClose();
    } catch (error) {
      const serverErrors = getFieldErrors(error);
      if (Object.keys(serverErrors).length > 0) {
        setFieldErrors(serverErrors);
      } else {
        toast.error(getErrorMessage(error));
      }
    } finally {
      setProgress(null);
    }
  }

  /**
   * Show the uploaded thumbnail when editing; otherwise preview the YouTube one
   * so the admin can see what the card will look like without uploading.
   */
  const existingThumbnailUrl = form.removeThumbnail
    ? getYoutubeThumbnailUrl(form.youtubeUrl)
    : isEditing && video.hasCustomThumbnail
      ? video.thumbnailUrl
      : getYoutubeThumbnailUrl(form.youtubeUrl);

  return (
    <Modal
      open
      onClose={onClose}
      title={isEditing ? 'Edit video' : 'New video'}
      description="Title, category, link and card image"
      className="sm:max-w-2xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button form="video-form" type="submit" isLoading={isSubmitting}>
            {isEditing ? 'Save' : 'Create'}
          </Button>
        </>
      }
    >
      <form id="video-form" onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextInput
            label="Title"
            value={form.title}
            onChange={(event) => update({ title: event.target.value })}
            error={fieldErrors.title}
            maxLength={200}
            required
          />

          <Select
            label="Category"
            value={form.categoryId}
            onChange={(event) => update({ categoryId: event.target.value })}
            error={fieldErrors.categoryId}
            required
          >
            <option value="">Select...</option>
            {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.name}
              </option>
            ))}
          </Select>
        </div>

        <TextInput
          label="YouTube link"
          value={form.youtubeUrl}
          onChange={(event) => update({ youtubeUrl: event.target.value })}
          error={fieldErrors.youtubeUrl}
          placeholder="https://www.youtube.com/watch?v=..."
          required
        />

        <TextArea
          label="Description"
          value={form.description}
          onChange={(event) => update({ description: event.target.value })}
          error={fieldErrors.description}
          rows={3}
          maxLength={2000}
        />

        <ImageUpload
          label="Card image"
          hint="Leave empty to use the YouTube thumbnail · 16:9"
          file={form.thumbnailFile}
          existingUrl={existingThumbnailUrl}
          aspect="aspect-video max-w-sm"
          onChange={(thumbnailFile) => update({ thumbnailFile, removeThumbnail: false })}
          onRemoveExisting={() => update({ removeThumbnail: true })}
        />

        <Checkbox
          label="Exclusive (paid) video"
          description="Shows a lock badge on the card"
          checked={form.isExclusive}
          onChange={(event) => update({ isExclusive: event.target.checked })}
        />

        <fieldset className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <legend className="text-fg text-sm font-medium">Gear links</legend>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                update({ productLinks: [...form.productLinks, { ...EMPTY_PRODUCT_LINK }] })
              }
            >
              <Plus size={14} />
              Add
            </Button>
          </div>

          {form.productLinks.length === 0 && (
            <p className="text-subtle text-xs">
              Optionally link to the store pages for the gear used in this video.
            </p>
          )}

          {form.productLinks.map((link, index) => (
            <div key={index} className="border-line bg-raised/50 space-y-2 rounded-lg border p-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-subtle text-xs">#{index + 1}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove link ${index + 1}`}
                  className="hover:text-danger size-7"
                  onClick={() =>
                    update({
                      productLinks: form.productLinks.filter((_, current) => current !== index),
                    })
                  }
                >
                  <X size={14} />
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <TextInput
                  placeholder="Product name"
                  aria-label="Product name"
                  value={link.productName}
                  onChange={(event) => updateProductLink(index, 'productName', event.target.value)}
                />
                <TextInput
                  placeholder="Store (AliExpress...)"
                  aria-label="Store name"
                  value={link.storeName}
                  onChange={(event) => updateProductLink(index, 'storeName', event.target.value)}
                />
              </div>

              <TextInput
                type="url"
                placeholder="https://..."
                aria-label="Product link"
                value={link.url}
                onChange={(event) => updateProductLink(index, 'url', event.target.value)}
              />
            </div>
          ))}
        </fieldset>

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
