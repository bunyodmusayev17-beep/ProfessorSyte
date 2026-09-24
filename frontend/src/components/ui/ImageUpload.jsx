import { ImagePlus, Trash2, Upload } from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';

import { UPLOAD } from '@/constants';
import { cn } from '@/lib/cn';
import { formatFileSize, validateImageFile } from '@/lib/imageValidation';

import { Button } from './Button';

/**
 * Single-image picker with drag & drop and a live preview.
 *
 * @param file          the newly chosen File, or null
 * @param existingUrl   an already-uploaded image to show when no new file is picked
 * @param onChange      (File | null) => void
 * @param onRemoveExisting  called when the user clears a previously saved image
 */
export function ImageUpload({
  label,
  hint,
  file,
  existingUrl,
  onChange,
  onRemoveExisting,
  aspect = 'aspect-video',
  className,
}) {
  const inputId = useId();
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  // Derive the blob URL from the file rather than mirroring it into state.
  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  // Revoke on unmount and whenever the URL is replaced, or the blob leaks for
  // the lifetime of the page.
  useEffect(() => {
    if (!previewUrl) return undefined;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  function accept(nextFile) {
    if (!nextFile) return;

    const validationError = validateImageFile(nextFile);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    onChange(nextFile);
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    accept(event.dataTransfer.files?.[0] ?? null);
  }

  function handleClear() {
    setError('');
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
    // Only drop the stored image when there is one and the user isn't merely
    // cancelling a freshly picked file.
    if (!file && existingUrl) onRemoveExisting?.();
  }

  const shownUrl = previewUrl ?? existingUrl ?? null;

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label htmlFor={inputId} className="text-fg block text-sm font-medium">
          {label}
        </label>
      )}

      {shownUrl ? (
        <div className={cn('border-line relative overflow-hidden rounded-lg border', aspect)}>
          <img src={shownUrl} alt="" className="h-full w-full object-cover" />

          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-black/70 px-2 py-1.5 backdrop-blur-sm">
            <span className="text-muted truncate text-xs">
              {file ? `${file.name} · ${formatFileSize(file.size)}` : 'Current image'}
            </span>
            <div className="flex shrink-0 gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                aria-label="Replace image"
                onClick={() => inputRef.current?.click()}
              >
                <Upload size={14} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Remove image"
                className="hover:text-danger size-7"
                onClick={handleClear}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            'flex w-full flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed transition-colors',
            aspect,
            isDragging
              ? 'border-primary bg-primary/10'
              : 'border-line bg-raised/50 hover:border-primary/50 hover:bg-raised'
          )}
        >
          <ImagePlus className="text-subtle" size={22} />
          <span className="text-muted px-3 text-center text-sm">
            Choose an image or drop it here
          </span>
          <span className="text-subtle text-xs">JPG, PNG, WEBP · max 5MB</span>
        </button>
      )}

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={UPLOAD.acceptAttribute}
        className="hidden"
        onChange={(event) => accept(event.target.files?.[0] ?? null)}
      />

      {error ? (
        <p className="text-danger text-xs">{error}</p>
      ) : (
        hint && <p className="text-subtle text-xs">{hint}</p>
      )}
    </div>
  );
}
