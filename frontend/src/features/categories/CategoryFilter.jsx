import { cn } from '@/lib/cn';

import { CategoryIcon } from './CategoryIcon';

/** Horizontal pill filter. `activeId` is a string (URL search params are strings). */
export function CategoryFilter({ categories = [], activeId, onChange }) {
  const options = [{ categoryId: null, name: 'All', iconUrl: null }, ...categories];

  return (
    <div className="no-scrollbar -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0">
      {options.map((category) => {
        const id = category.categoryId === null ? null : String(category.categoryId);
        const isActive = id === activeId;

        return (
          <button
            key={id ?? 'all'}
            type="button"
            onClick={() => onChange(id)}
            aria-pressed={isActive}
            className={cn(
              'flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
              isActive
                ? 'border-primary bg-primary text-white'
                : 'border-line bg-surface text-muted hover:border-primary/50 hover:text-fg'
            )}
          >
            {id && <CategoryIcon iconUrl={category.iconUrl} size={15} />}
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
