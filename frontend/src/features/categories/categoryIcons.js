import { BarChart3, BookOpen, FolderKanban, Users } from 'lucide-react';

import { ArduinoIcon, DroneIcon, PrinterCubeIcon, RobotArmIcon } from './categoryIconSvgs';

/**
 * Preset category icons. A category stores its choice in `IconUrl` as
 * "preset:<key>"; any other non-empty value is an uploaded image URL.
 *
 * `key` is what gets persisted, `label` is shown in the admin picker.
 */
export const CATEGORY_ICON_PRESETS = [
  { key: 'arduino', label: 'Arduino', Icon: ArduinoIcon },
  { key: '3d-printing', label: '3D Printing', Icon: PrinterCubeIcon },
  { key: 'robotics', label: 'Robotics', Icon: RobotArmIcon },
  { key: 'drones', label: 'Drones', Icon: DroneIcon },
  { key: 'projects', label: 'Projects', Icon: FolderKanban },
  { key: 'courses', label: 'Courses', Icon: BookOpen },
  { key: 'community', label: 'Community', Icon: Users },
  { key: 'progress', label: 'Progress', Icon: BarChart3 },
];

const PRESET_PREFIX = 'preset:';

export const PRESETS_BY_KEY = new Map(CATEGORY_ICON_PRESETS.map((preset) => [preset.key, preset]));

export function toPresetValue(key) {
  return `${PRESET_PREFIX}${key}`;
}

/** Returns the preset key when `iconUrl` holds a known one, otherwise null. */
export function getPresetKey(iconUrl) {
  if (typeof iconUrl !== 'string' || !iconUrl.startsWith(PRESET_PREFIX)) return null;
  const key = iconUrl.slice(PRESET_PREFIX.length);
  return PRESETS_BY_KEY.has(key) ? key : null;
}

export function isUploadedIcon(iconUrl) {
  return typeof iconUrl === 'string' && iconUrl.length > 0 && getPresetKey(iconUrl) === null;
}
