import { UPLOAD } from '@/constants';

/** Mirrors FileUploadService's validation so the user hears about it instantly. */
export function validateImageFile(file) {
  if (!UPLOAD.acceptedMimeTypes.includes(file.type)) {
    return 'Only JPG, PNG or WEBP images are allowed.';
  }
  if (file.size > UPLOAD.maxFileSizeBytes) {
    return 'The image must be 5MB or smaller.';
  }
  return null;
}

export function formatFileSize(bytes) {
  return bytes < 1024 * 1024
    ? `${Math.round(bytes / 1024)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
