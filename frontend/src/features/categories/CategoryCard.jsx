import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Card } from '@/components/ui/Card';
import { Image } from '@/components/ui/Image';
import { useSpotlight } from '@/hooks/useSpotlight';
import { formatCount } from '@/lib/format';

import { CategoryIcon } from './CategoryIcon';

/**
 * Category card: cover photo, the icon floating over it, then the name and
 * video count. Falls back to the brand gradient with a large icon when no
 * cover has been uploaded yet.
 */
export function CategoryCard({ category, ...props }) {
  const onMouseMove = useSpotlight();

  return (
    <Card
      as={Link}
      to={`/videos?categoryId=${category.categoryId}`}
      onMouseMove={onMouseMove}
      className="group spotlight ring-gradient hover:shadow-card-hover flex flex-col overflow-hidden transition-all duration-500 ease-(--ease-out-soft) hover:-translate-y-1.5"
      {...props}
    >
      <div className="bg-media relative aspect-[4/3] overflow-hidden">
        <Image
          src={category.coverImageUrl}
          alt=""
          className="opacity-90 transition-all duration-700 ease-(--ease-out-soft) group-hover:scale-110 group-hover:opacity-100"
          fallback={
            <CategoryIcon
              iconUrl={category.iconUrl}
              size={52}
              className="text-primary/60 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6"
            />
          }
        />

        {/* Keeps the icon chip legible over any photo. */}
        <span className="from-bg/90 absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t to-transparent" />

        <span className="bg-brand shadow-glow absolute bottom-3 left-3 flex size-10 items-center justify-center rounded-xl text-white transition-transform duration-500 ease-(--ease-spring) group-hover:scale-110 group-hover:-rotate-6">
          <CategoryIcon iconUrl={category.iconUrl} size={20} />
        </span>

        <span className="glass absolute top-3 right-3 flex size-8 translate-x-2 -translate-y-2 items-center justify-center rounded-full text-white opacity-0 transition-all duration-500 group-hover:translate-0 group-hover:opacity-100">
          <ArrowUpRight size={15} />
        </span>
      </div>

      <div className="relative z-[3] flex flex-1 flex-col gap-1 p-4">
        <h3 className="text-fg group-hover:text-primary-light truncate text-[15px] font-semibold transition-colors">
          {category.name}
        </h3>

        {category.description ? (
          <p className="text-muted line-clamp-2 text-xs leading-relaxed">{category.description}</p>
        ) : null}

        <p className="text-subtle mt-auto flex items-center gap-1.5 pt-2 text-xs">
          <span className="bg-primary-light size-1.5 rounded-full" />
          {formatCount(category.videoCount)} videos
        </p>
      </div>
    </Card>
  );
}
