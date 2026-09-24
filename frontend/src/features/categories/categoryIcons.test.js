import { describe, expect, it } from 'vitest';

import {
  CATEGORY_ICON_PRESETS,
  getPresetKey,
  isUploadedIcon,
  toPresetValue,
} from './categoryIcons';

describe('category icon values', () => {
  it('round-trips every preset key', () => {
    for (const { key } of CATEGORY_ICON_PRESETS) {
      expect(getPresetKey(toPresetValue(key))).toBe(key);
    }
  });

  it('rejects an unknown preset key', () => {
    expect(getPresetKey('preset:does-not-exist')).toBeNull();
  });

  it('treats an upload path as an uploaded icon, not a preset', () => {
    const url = '/uploads/categories/abc.png';
    expect(getPresetKey(url)).toBeNull();
    expect(isUploadedIcon(url)).toBe(true);
  });

  it('treats a preset value as not uploaded', () => {
    expect(isUploadedIcon('preset:arduino')).toBe(false);
  });

  it.each([null, undefined, ''])('handles %s', (value) => {
    expect(getPresetKey(value)).toBeNull();
    expect(isUploadedIcon(value)).toBe(false);
  });
});
