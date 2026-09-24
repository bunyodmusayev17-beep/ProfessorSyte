import { Boxes } from 'lucide-react';

import { PRESETS_BY_KEY, getPresetKey, isUploadedIcon } from './categoryIcons';

/**
 * Renders whatever a category has stored: a preset icon, an uploaded image, or
 * the generic fallback.
 */
export function CategoryIcon({ iconUrl, className, size = 20 }) {
  const presetKey = getPresetKey(iconUrl);

  if (presetKey) {
    const { Icon } = PRESETS_BY_KEY.get(presetKey);
    return <Icon width={size} height={size} className={className} />;
  }

  if (isUploadedIcon(iconUrl)) {
    return (
      <img src={iconUrl} alt="" width={size} height={size} className={className} loading="lazy" />
    );
  }

  return <Boxes width={size} height={size} className={className} />;
}
