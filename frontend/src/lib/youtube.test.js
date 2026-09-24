import { describe, expect, it } from 'vitest';

import {
  extractYoutubeId,
  getYoutubeEmbedUrl,
  getYoutubeThumbnailUrl,
  isValidYoutubeUrl,
} from './youtube';

describe('extractYoutubeId', () => {
  it.each([
    ['https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://youtube.com/watch?feature=share&v=dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://youtu.be/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://www.youtube.com/embed/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://www.youtube.com/shorts/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://www.youtube.com/live/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
  ])('reads the id out of %s', (url, expected) => {
    expect(extractYoutubeId(url)).toBe(expected);
  });

  it.each([null, undefined, '', 'not a url', 'https://vimeo.com/12345678'])(
    'returns null for %s',
    (url) => {
      expect(extractYoutubeId(url)).toBeNull();
    }
  );
});

describe('url builders', () => {
  it('builds a privacy-friendly embed url', () => {
    expect(getYoutubeEmbedUrl('https://youtu.be/dQw4w9WgXcQ')).toBe(
      'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0'
    );
  });

  it('builds a thumbnail url', () => {
    expect(getYoutubeThumbnailUrl('https://youtu.be/dQw4w9WgXcQ')).toBe(
      'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg'
    );
  });

  it('returns null instead of a broken url', () => {
    expect(getYoutubeEmbedUrl('nope')).toBeNull();
    expect(getYoutubeThumbnailUrl('nope')).toBeNull();
  });

  it('validates urls', () => {
    expect(isValidYoutubeUrl('https://youtu.be/dQw4w9WgXcQ')).toBe(true);
    expect(isValidYoutubeUrl('https://example.com')).toBe(false);
  });
});
