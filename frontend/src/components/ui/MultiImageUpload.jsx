import { ImagePlus, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { UPLOAD } from '@/constants';
import { cn } from '@/lib/cn';
import { formatFileSize, validateImageFile } from '@/lib/imageValidation';

/** Multi-image picker used by the project form, with per-file previews. */
export function MultiImageUpload({ label, hint, files = [], onChange, max = 10, className }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  const previews = useMemo(() => files.map((file) => URL.createObjectURL(file)), [files]);

  useEffect(() => () => previews.forEach(URL.revokeObjectURL), [previews]);

  function accept(incoming) {
    const candidates = Array.from(incoming ?? []);
    if (candidates.length === 0) return;

    const rejected = candidates.map(validateImageFile).find(Boolean);
    if (rejected) {
      setError(rejected);
      return;
    }

    if (files.length + candidates.length > max) {
      setError(`You can upload at most ${max} images.`);
      return;
    }

    setError('');
    onChange([...files, ...candidates]);
  }

  function removeAt(index) {
    setError('');
    onChange(files.filter((_, current) => current !== index));
  }

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && <span className="text-fg block text-sm font-medium">{label}</span>}

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          accept(event.dataTransfer.files);
        }}
        className={cn(
          'rounded-lg border-2 border-dashed p-3 transition-colors',
          isDragging ? 'border-primary bg-primary/10' : 'border-line bg-raised/50'
        )}
      >
        {files.length > 0 && (
          <ul className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${file.lastModified}-${index}`}
                className="border-line relative aspect-video overflow-hidden rounded-md border"
              >
                {previews[index] && (
                  <img src={previews[index]} alt="" className="h-full w-full object-cover" />
                )}
                <button
                  type="button"
                  onClick={() => removeAt(index)}
                  aria-label={`Remove ${file.name}`}
                  className="absolute top-1 right-1 rounded-full bg-black/70 p-1 text-white transition-colors hover:bg-red-600"
                >
                  <X size={13} />
                </button>
                <span className="absolute inset-x-0 bottom-0 truncate bg-black/70 px-1.5 py-0.5 text-[10px] text-white">
                  {formatFileSize(file.size)}
                </span>
              </li>
            ))}
          </ul>
        )}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={files.length >= max}
          className="text-muted hover:text-fg flex w-full items-center justify-center gap-2 py-4 text-sm transition-colors disabled:opacity-50"
        >
          <ImagePlus size={18} />
          {files.length === 0 ? 'Choose images or drop them here' : 'Add more images'}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={UPLOAD.acceptAttribute}
        multiple
        className="hidden"
        onChange={(event) => {
          accept(event.target.files);
          event.target.value = '';
        }}
      />

      {error ? (
        <p className="text-danger text-xs">{error}</p>
      ) : (
        <p className="text-subtle text-xs">
          {hint ?? `JPG, PNG, WEBP · max 5MB each · ${files.length}/${max}`}
        </p>
      )}
    </div>
  );
}
