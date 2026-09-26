import { LayoutGrid } from 'lucide-react';

import { cn } from '@/lib/cn';

import { CategoryIcon } from './CategoryIcon';

/** Horizontal pill filter. `activeId` is a string (URL search params are strings). */
export function CategoryFilter({ categories = [], activeId, onChange }) {
  const options = [{ categoryId: null, name: 'All', iconUrl: null }, ...categories];

  return (
    <div className="no-scrollbar -mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0">
      {options.map((category, index) => {
        const id = category.categoryId === null ? null : String(category.categoryId);
        const isActive = id === activeId;

        return (
          <button
            key={id ?? 'all'}
            type="button"
            onClick={() => onChange(id)}
            aria-pressed={isActive}
            style={{ animationDelay: `${Math.min(index, 10) * 40}ms` }}
            className={cn(
              'animate-reveal flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 active:scale-95',
              isActive
                ? 'bg-brand shadow-glow border-transparent text-white'
                : 'border-line bg-surface/70 text-muted hover:border-primary/50 hover:text-fg backdrop-blur hover:-translate-y-0.5'
            )}
          >
            {id ? <CategoryIcon iconUrl={category.iconUrl} size={15} /> : <LayoutGrid size={15} />}
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
