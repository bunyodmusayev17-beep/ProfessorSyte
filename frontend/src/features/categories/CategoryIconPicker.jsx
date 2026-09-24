import { Upload } from 'lucide-react';

import { ImageUpload } from '@/components/ui/ImageUpload';
import { cn } from '@/lib/cn';

import { CATEGORY_ICON_PRESETS } from './categoryIcons';

/**
 * Lets an admin either pick one of the built-in icons or upload a custom one.
 * `value` is the selected preset key (or null when a custom file is used).
 */
export function CategoryIconPicker({
  value,
  onChange,
  file,
  existingUrl,
  onFileChange,
  onRemoveExisting,
}) {
  const usingCustomIcon = Boolean(file) || (Boolean(existingUrl) && !value);

  return (
    <div className="space-y-3">
      <span className="text-fg block text-sm font-medium">Icon</span>

      <ul className="grid grid-cols-4 gap-2 sm:grid-cols-8">
        {CATEGORY_ICON_PRESETS.map(({ key, label, Icon }) => {
          const isSelected = !usingCustomIcon && value === key;

          return (
            <li key={key}>
              <button
                type="button"
                title={label}
                aria-label={label}
                aria-pressed={isSelected}
                onClick={() => {
                  // Picking a preset discards any custom file.
                  onFileChange(null);
                  onChange(isSelected ? null : key);
                }}
                className={cn(
                  'flex aspect-square w-full items-center justify-center rounded-lg border transition-colors',
                  isSelected
                    ? 'border-primary bg-primary text-white'
                    : 'border-line bg-raised text-muted hover:border-primary/50 hover:text-fg'
                )}
              >
                <Icon width={20} height={20} />
              </button>
            </li>
          );
        })}
      </ul>

      <details className="group" open={usingCustomIcon}>
        <summary className="text-muted hover:text-fg flex cursor-pointer items-center gap-1.5 text-xs transition-colors">
          <Upload size={13} />
          Or upload your own icon
        </summary>

        <div className="mt-3">
          <ImageUpload
            file={file}
            existingUrl={existingUrl}
            aspect="aspect-square max-w-32"
            onChange={(nextFile) => {
              onFileChange(nextFile);
              // A custom file replaces the preset selection.
              if (nextFile) onChange(null);
            }}
            onRemoveExisting={onRemoveExisting}
            hint="A square image works best"
          />
        </div>
      </details>
    </div>
  );
}
