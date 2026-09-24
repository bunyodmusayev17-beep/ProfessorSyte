/**
 * The 11-character YouTube video id, reused by every pattern below.
 * `String.raw` keeps the backslashes literal so the regex source stays readable.
 */
const ID = String.raw`[a-zA-Z0-9_-]{11}`;

const PATTERNS = [
  // /watch?v=ID, with or without other query parameters in front of v=
  new RegExp(String.raw`youtube\.com/watch\?(?:[^#]*&)?v=(${ID})`),
  new RegExp(String.raw`youtu\.be/(${ID})`),
  new RegExp(String.raw`youtube\.com/embed/(${ID})`),
  new RegExp(String.raw`youtube\.com/shorts/(${ID})`),
  new RegExp(String.raw`youtube\.com/live/(${ID})`),
];

// A bare video id pasted straight into the admin form.
const BARE_ID = new RegExp(String.raw`^${ID}$`);

/** Extract the video id from any common YouTube URL shape, or null. */
export function extractYoutubeId(url) {
  if (typeof url !== 'string') return null;

  const trimmed = url.trim();
  if (!trimmed) return null;

  for (const pattern of PATTERNS) {
    const match = trimmed.match(pattern);
    if (match) return match[1];
  }

  return BARE_ID.test(trimmed) ? trimmed : null;
}

export function getYoutubeEmbedUrl(url) {
  const id = extractYoutubeId(url);
  return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0` : null;
}

export function getYoutubeThumbnailUrl(url) {
  const id = extractYoutubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}

export function isValidYoutubeUrl(url) {
  return extractYoutubeId(url) !== null;
}
