import { ArrowRight, Boxes, FolderKanban, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { EmptyState, ErrorState } from '@/components/ui/EmptyState';
import { Reveal, Stagger } from '@/components/ui/Reveal';
import { CategoryCardSkeleton, SkeletonGrid } from '@/components/ui/Skeleton';
import { CategoryCard } from '@/features/categories/CategoryCard';
import { ProgressSummary } from '@/features/engagement/ProgressSummary';
import { VideoGrid } from '@/features/videos/VideoGrid';
import { useAuth } from '@/hooks/useAuth';
import { useCategories } from '@/hooks/useCategories';
import { useVideos } from '@/hooks/useVideos';
import { getErrorMessage } from '@/lib/apiError';
import { formatCount } from '@/lib/format';

const CATEGORY_GRID = 'grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4';

function SectionHeading({ title, description, to, linkLabel = 'View all' }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
      <div>
        <h2 className="text-fg text-base font-semibold">{title}</h2>
        {description && <p className="text-subtle mt-0.5 text-xs">{description}</p>}
      </div>
      {to && (
        <Link
          to={to}
          className="text-primary hover:text-primary-light group inline-flex shrink-0 items-center gap-1 text-sm font-medium"
        >
          {linkLabel}
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const categoriesQuery = useCategories();
  const videosQuery = useVideos();

  // The API orders by CreatedAt descending, so the newest video comes first.
  const videos = videosQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];

  return (
    <>
      <Reveal
        as="section"
        className="rounded-card border-line bg-hero relative isolate mb-10 overflow-hidden border p-6 md:p-10"
      >
        {/* Slow-drifting glow so the hero is never completely static. */}
        <span
          aria-hidden
          className="animate-drift bg-primary/25 absolute -top-24 -right-16 -z-10 size-72 rounded-full blur-3xl"
        />
        <span
          aria-hidden
          className="animate-drift bg-accent/20 absolute -bottom-28 -left-10 -z-10 size-64 rounded-full blur-3xl"
          style={{ animationDelay: '-7s' }}
        />

        <p className="text-primary-light mb-3 text-xs font-semibold tracking-[0.18em] uppercase">
          Learn · Build · Innovate
        </p>

        <h1 className="text-fg text-2xl leading-tight font-semibold md:text-4xl">
          Real Skills.
          <br />
          <span className="text-primary">Real Projects.</span>
        </h1>

        <p className="text-muted mt-3 max-w-xl text-sm md:text-base">
          Arduino, 3D printing, robotics, drones and more — learn by building, not just reading.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button to="/videos">
            <PlayCircle size={16} />
            Start learning
          </Button>
          <Button to="/projects" variant="secondary">
            <FolderKanban size={16} />
            Browse projects
          </Button>
        </div>

        {!videosQuery.isPending && !videosQuery.error && (
          <p className="text-subtle mt-6 text-xs">
            {formatCount(videos.length)} videos · {formatCount(categories.length)} categories
          </p>
        )}
      </Reveal>

      {/* Newest videos first — this is the primary content of the page. */}
      <Reveal as="section" delay={80} className="mb-10">
        <SectionHeading
          title="Latest videos"
          description="Newest lessons first"
          to="/videos"
          linkLabel="Browse & filter"
        />
        <VideoGrid
          videos={videos}
          isPending={videosQuery.isPending}
          error={videosQuery.error}
          onRetry={videosQuery.refetch}
        />
      </Reveal>

      <Reveal as="section" delay={140} className="mb-10">
        <SectionHeading title="Categories" description="Pick a topic to explore" to="/videos" />

        {categoriesQuery.isPending ? (
          <SkeletonGrid count={4} className={CATEGORY_GRID}>
            <CategoryCardSkeleton />
          </SkeletonGrid>
        ) : categoriesQuery.error ? (
          <ErrorState
            message={getErrorMessage(categoriesQuery.error)}
            onRetry={categoriesQuery.refetch}
          />
        ) : categories.length === 0 ? (
          <EmptyState
            icon={Boxes}
            title="No categories yet"
            description="Add your first category — with a name, an icon and a cover image — from the admin panel."
          />
        ) : (
          <Stagger className={CATEGORY_GRID}>
            {categories.map((category) => (
              <CategoryCard key={category.categoryId} category={category} />
            ))}
          </Stagger>
        )}
      </Reveal>

      {isAuthenticated && (
        <Reveal as="section" delay={200}>
          <SectionHeading title="My progress" description="What you have watched and saved" />
          <ProgressSummary />
        </Reveal>
      )}
    </>
  );
}
