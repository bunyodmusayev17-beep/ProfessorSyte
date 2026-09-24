/**
 * Helpers for building the multipart bodies the backend now expects for
 * categories and videos (image uploads travel with the text fields).
 */

/** Skip null/undefined/'' so optional fields don't arrive as the string "null". */
export function appendIfPresent(formData, key, value) {
  if (value === null || value === undefined || value === '') return;
  formData.append(key, value);
}

/** ASP.NET Core binds booleans from the literal strings "true"/"false". */
export function appendBoolean(formData, key, value) {
  formData.append(key, value ? 'true' : 'false');
}

export function appendFile(formData, key, file) {
  if (file instanceof File && file.size > 0) {
    formData.append(key, file);
  }
}

/**
 * Model-bind a list of objects: ASP.NET Core reads indexed keys such as
 * `ProductLinks[0].ProductName`.
 */
export function appendList(formData, key, items) {
  items.forEach((item, index) => {
    Object.entries(item).forEach(([field, value]) => {
      appendIfPresent(formData, `${key}[${index}].${field}`, value);
    });
  });
}

/** Turns axios upload events into a 0-100 percentage. */
export function toProgressHandler(onProgress) {
  if (!onProgress) return undefined;
  return (event) => onProgress(event.total ? Math.round((event.loaded / event.total) * 100) : 0);
}
