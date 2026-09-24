import { Link } from 'react-router-dom';

import { Card } from '@/components/ui/Card';
import { Image } from '@/components/ui/Image';
import { formatCount } from '@/lib/format';

import { CategoryIcon } from './CategoryIcon';

/**
 * Category card from the reference design: cover photo, the icon floating over
 * it, then the name and video count. Falls back to the brand gradient with a
 * large icon when no cover has been uploaded yet.
 */
export function CategoryCard({ category, ...props }) {
  return (
    <Card
      as={Link}
      to={`/videos?categoryId=${category.categoryId}`}
      className="group hover:border-primary/50 hover:shadow-card-hover flex flex-col overflow-hidden transition-all"
      {...props}
    >
      <div className="bg-media relative aspect-[4/3] overflow-hidden">
        <Image
          src={category.coverImageUrl}
          alt=""
          className="opacity-90 transition-transform duration-300 group-hover:scale-[1.05]"
          fallback={
            <CategoryIcon iconUrl={category.iconUrl} size={44} className="text-primary/60" />
          }
        />

        {/* Keeps the icon chip legible over any photo. */}
        <span className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 to-transparent" />

        <span className="bg-primary absolute bottom-2 left-2 flex size-9 items-center justify-center rounded-lg text-white shadow-lg">
          <CategoryIcon iconUrl={category.iconUrl} size={19} />
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="text-fg group-hover:text-primary-light truncate text-sm font-semibold transition-colors">
          {category.name}
        </h3>

        {category.description ? (
          <p className="text-muted line-clamp-2 text-xs">{category.description}</p>
        ) : null}

        <p className="text-subtle mt-auto pt-1 text-xs">{formatCount(category.videoCount)} video</p>
      </div>
    </Card>
  );
}
