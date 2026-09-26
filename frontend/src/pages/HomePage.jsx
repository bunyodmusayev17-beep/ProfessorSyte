import {
  ArrowRight,
  Boxes,
  FolderKanban,
  Hammer,
  PlayCircle,
  ShoppingBag,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { EmptyState, ErrorState } from '@/components/ui/EmptyState';
import { Reveal, Stagger } from '@/components/ui/Reveal';
import { CategoryCardSkeleton, SkeletonGrid } from '@/components/ui/Skeleton';
import { CategoryCard } from '@/features/categories/CategoryCard';
import { CategoryIcon } from '@/features/categories/CategoryIcon';
import { ProgressSummary } from '@/features/engagement/ProgressSummary';
import { HeroVisual } from '@/features/home/HeroVisual';
import { VideoGrid } from '@/features/videos/VideoGrid';
import { useAuth } from '@/hooks/useAuth';
import { useCategories } from '@/hooks/useCategories';
import { useCountUp } from '@/hooks/useCountUp';
import { useInView } from '@/hooks/useInView';
import { useProjects } from '@/hooks/useProjects';
import { useSpotlight } from '@/hooks/useSpotlight';
import { useVideos } from '@/hooks/useVideos';
import { getErrorMessage } from '@/lib/apiError';
import { cn } from '@/lib/cn';

const CATEGORY_GRID = 'grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4';

const ROTATING_WORDS = ['robots.', 'drones.', 'Arduino.', '3D prints.', 'the future.'];

/** Topics shown in the marquee when the API has no categories yet. */
const FALLBACK_TOPICS = ['Arduino', '3D Printing', 'Robotics', 'Drones', 'Electronics', 'IoT'];

const STEPS = [
  {
    icon: PlayCircle,
    title: 'Watch the lesson',
    text: 'Short, focused videos that walk through every wire, line of code and print setting.',
    tone: 'from-primary/30 text-primary-light',
  },
  {
    icon: ShoppingBag,
    title: 'Grab the exact gear',
    text: 'Each video lists the parts used, with store links — no guessing which sensor to buy.',
    tone: 'from-warning/30 text-warning',
  },
  {
    icon: Hammer,
    title: 'Build & track progress',
    text: 'Follow along, mark lessons watched and see your builds join the projects gallery.',
    tone: 'from-success/30 text-success',
  },
];

/** Types out each word, pauses, deletes it and moves on to the next. */
function TypewriterWord({ words }) {
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const word = words[index];

  useEffect(() => {
    let delay = isDeleting ? 45 : 95;
    if (!isDeleting && length === word.length) delay = 1600;
    if (isDeleting && length === 0) delay = 250;

    const timer = setTimeout(() => {
      if (!isDeleting && length === word.length) {
        setIsDeleting(true);
      } else if (isDeleting && length === 0) {
        setIsDeleting(false);
        setIndex((current) => (current + 1) % words.length);
      } else {
        setLength((current) => current + (isDeleting ? -1 : 1));
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [isDeleting, length, word, words.length]);

  return (
    <span className="whitespace-nowrap">
      <span className="text-gradient">{word.slice(0, length)}</span>
      <span className="bg-primary-light animate-blink ml-1 inline-block h-[0.85em] w-[3px] translate-y-[0.08em] rounded-full" />
      <span className="sr-only">{words.join(', ')}</span>
    </span>
  );
}

function Stat({ value, label, start }) {
  const count = useCountUp(value, { start });
  return (
    <div>
      <p className="font-display text-fg text-2xl font-bold md:text-3xl">
        {count}
        {value > 0 && <span className="text-gradient">+</span>}
      </p>
      <p className="text-subtle mt-0.5 text-xs">{label}</p>
    </div>
  );
}

function Hero({ videoCount, categoryCount, projectCount, isReady }) {
  const [statsRef, statsInView] = useInView();

  return (
    <section className="rounded-card border-line bg-hero relative isolate mb-8 overflow-hidden border">
      <span aria-hidden className="bg-grid mask-fade absolute inset-0 -z-10 opacity-70" />
      <span
        aria-hidden
        className="animate-drift bg-primary/25 absolute -top-24 -right-16 -z-10 size-80 rounded-full blur-3xl"
      />
      <span
        aria-hidden
        className="animate-drift bg-accent/20 absolute -bottom-28 -left-10 -z-10 size-72 rounded-full blur-3xl"
        style={{ animationDelay: '-7s' }}
      />

      <div className="grid items-center gap-10 p-6 sm:p-10 lg:grid-cols-[1.15fr_1fr] lg:p-14">
        <div>
          <p className="animate-reveal border-primary/30 bg-primary/10 text-primary-light mb-6 inline-flex items-center gap-2 rounded-full border py-1 pr-3 pl-1.5 text-xs font-medium">
            <span className="bg-brand flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white">
              <Sparkles size={10} />
              NEW
            </span>
            Fresh lessons every week
            <span className="relative flex size-2">
              <span className="bg-success animate-ping-slow absolute inset-0 rounded-full" />
              <span className="bg-success relative size-2 rounded-full" />
            </span>
          </p>

          <h1 className="text-fg text-4xl leading-[1.05] font-bold sm:text-5xl xl:text-6xl">
            <span className="word-in" style={{ animationDelay: '80ms' }}>
              Learn
            </span>{' '}
            <span className="word-in" style={{ animationDelay: '160ms' }}>
              to
            </span>{' '}
            <span className="word-in" style={{ animationDelay: '240ms' }}>
              build
            </span>
            <br />
            <span className="word-in" style={{ animationDelay: '340ms' }}>
              <TypewriterWord words={ROTATING_WORDS} />
            </span>
          </h1>

          <p
            className="animate-reveal text-muted mt-5 max-w-xl text-base leading-relaxed md:text-lg"
            style={{ animationDelay: '450ms' }}
          >
            Arduino, 3D printing, robotics and drones — hands-on video lessons with the exact gear
            list for every build. Learn by building, not just reading.
          </p>

          <div
            className="animate-reveal mt-8 flex flex-wrap items-center gap-3"
            style={{ animationDelay: '550ms' }}
          >
            <Button to="/videos" size="lg" className="group">
              <PlayCircle size={18} />
              Start learning
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Button>
            <Button to="/projects" variant="secondary" size="lg">
              <FolderKanban size={18} />
              Browse projects
            </Button>
          </div>

          <div
            ref={statsRef}
            className="animate-reveal border-line mt-10 grid max-w-md grid-cols-3 gap-6 border-t pt-6"
            style={{ animationDelay: '650ms' }}
          >
            <Stat value={videoCount} label="Video lessons" start={statsInView && isReady} />
            <Stat value={categoryCount} label="Categories" start={statsInView && isReady} />
            <Stat value={projectCount} label="Projects built" start={statsInView && isReady} />
          </div>
        </div>

        <div className="animate-scale-in hidden sm:block" style={{ animationDelay: '300ms' }}>
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

/** Endless strip of topics; duplicated once so the loop is seamless. */
function TopicMarquee({ categories }) {
  const topics =
    categories.length > 0
      ? categories.map((category) => ({
          key: category.categoryId,
          name: category.name,
          iconUrl: category.iconUrl,
          to: `/videos?categoryId=${category.categoryId}`,
        }))
      : FALLBACK_TOPICS.map((name) => ({ key: name, name, iconUrl: null, to: '/videos' }));

  // Repeat short lists so one copy is always wider than the screen.
  const repeated = Array.from(
    { length: Math.max(1, Math.ceil(8 / topics.length)) },
    () => topics
  ).flat();

  return (
    <div className="mask-fade-x group relative mb-14 overflow-hidden py-2">
      <div className="animate-marquee flex w-max gap-3 group-hover:[animation-play-state:paused]">
        {[0, 1].map((copy) =>
          repeated.map((topic, index) => (
            <Link
              key={`${copy}-${topic.key}-${index}`}
              to={topic.to}
              tabIndex={copy === 1 ? -1 : undefined}
              aria-hidden={copy === 1 || undefined}
              className="border-line bg-surface/60 text-muted hover:border-primary/50 hover:text-fg flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium backdrop-blur transition-colors"
            >
              <span className="text-primary-light">
                {topic.iconUrl ? (
                  <CategoryIcon iconUrl={topic.iconUrl} size={15} />
                ) : (
                  <Zap size={14} />
                )}
              </span>
              {topic.name}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

function SectionHeading({ eyebrow, title, description, to, linkLabel = 'View all' }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && (
          <p className="text-primary-light mb-2 flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] uppercase">
            <span className="bg-brand h-px w-6" />
            {eyebrow}
          </p>
        )}
        <h2 className="text-fg text-2xl font-semibold md:text-3xl">{title}</h2>
        {description && <p className="text-muted mt-1 text-sm">{description}</p>}
      </div>
      {to && (
        <Link
          to={to}
          className="border-line bg-surface/60 text-fg hover:border-primary/50 hover:bg-primary/10 group inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all"
        >
          {linkLabel}
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}

function StepCard({ step, index }) {
  const onMouseMove = useSpotlight();
  const Icon = step.icon;

  return (
    <div
      onMouseMove={onMouseMove}
      className="spotlight ring-gradient group rounded-card border-line bg-surface/70 relative overflow-hidden border p-6 backdrop-blur transition-transform duration-500 hover:-translate-y-1.5"
    >
      <span className="font-display pointer-events-none absolute -top-4 right-3 text-8xl font-bold text-white/[0.03] transition-colors duration-500 group-hover:text-white/[0.06]">
        0{index + 1}
      </span>
      <span
        className={cn(
          'mb-5 flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br to-transparent transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6',
          step.tone
        )}
      >
        <Icon size={22} />
      </span>
      <h3 className="text-fg text-lg font-semibold">{step.title}</h3>
      <p className="text-muted mt-2 text-sm leading-relaxed">{step.text}</p>
    </div>
  );
}

function JoinBanner() {
  return (
    <Reveal
      as="section"
      className="rounded-card border-primary/30 relative isolate mt-4 overflow-hidden border p-8 text-center md:p-14"
    >
      <span className="bg-brand animate-gradient absolute inset-0 -z-20 bg-[length:200%_200%] opacity-[0.18]" />
      <span className="bg-grid mask-fade absolute inset-0 -z-10" />
      <span className="animate-float bg-primary/30 absolute -top-10 left-10 -z-10 size-40 rounded-full blur-3xl" />
      <span
        className="animate-float bg-accent/30 absolute right-10 -bottom-10 -z-10 size-40 rounded-full blur-3xl"
        style={{ animationDelay: '-3s' }}
      />

      <Zap size={30} className="text-primary-light mx-auto mb-4 fill-current" />
      <h2 className="text-fg mx-auto max-w-2xl text-3xl font-bold md:text-4xl">
        Your next build starts <span className="text-gradient">today</span>
      </h2>
      <p className="text-muted mx-auto mt-3 max-w-lg">
        Create a free account to save lessons, track what you&#39;ve watched and join the
        conversation under every video.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button to="/register" size="lg">
          Create free account
          <ArrowRight size={16} />
        </Button>
        <Button to="/videos" variant="secondary" size="lg">
          Explore lessons
        </Button>
      </div>
    </Reveal>
  );
}

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const categoriesQuery = useCategories();
  const videosQuery = useVideos();
  const projectsQuery = useProjects();

  // The API orders by CreatedAt descending, so the newest video comes first.
  const videos = videosQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];

  return (
    <>
      <Hero
        videoCount={videos.length}
        categoryCount={categories.length}
        projectCount={projectsQuery.data?.length ?? 0}
        isReady={!videosQuery.isPending && !categoriesQuery.isPending && !projectsQuery.isPending}
      />

      <TopicMarquee categories={categories} />

      {/* Newest videos first — this is the primary content of the page. */}
      <Reveal as="section" className="mb-16">
        <SectionHeading
          eyebrow="Fresh drops"
          title="Latest videos"
          description="Newest lessons first"
          to="/videos"
          linkLabel="Browse & filter"
        />
        <VideoGrid
          videos={videos.slice(0, 8)}
          isPending={videosQuery.isPending}
          error={videosQuery.error}
          onRetry={videosQuery.refetch}
        />
      </Reveal>

      <Reveal as="section" className="mb-16">
        <SectionHeading
          eyebrow="How it works"
          title="From lesson to finished build"
          description="Three steps, repeated until you're the one teaching."
        />
        <Stagger step={120} className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <StepCard key={step.title} step={step} index={index} />
          ))}
        </Stagger>
      </Reveal>

      <Reveal as="section" className="mb-16">
        <SectionHeading
          eyebrow="Explore"
          title="Categories"
          description="Pick a topic to explore"
          to="/videos"
        />

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

      {isAuthenticated ? (
        <Reveal as="section">
          <SectionHeading
            eyebrow="Your journey"
            title="My progress"
            description="What you have watched and saved"
            to="/my-progress"
            linkLabel="Details"
          />
          <ProgressSummary />
        </Reveal>
      ) : (
        <JoinBanner />
      )}
    </>
  );
}
