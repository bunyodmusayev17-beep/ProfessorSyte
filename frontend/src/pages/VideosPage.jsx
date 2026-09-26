import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { PageHeader } from '@/components/ui/PageHeader';
import { CategoryFilter } from '@/features/categories/CategoryFilter';
import { VideoGrid } from '@/features/videos/VideoGrid';
import { useCategories } from '@/hooks/useCategories';
import { useVideos } from '@/hooks/useVideos';

export default function VideosPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get('categoryId');
  const search = searchParams.get('search') ?? '';

  const { data: categories = [] } = useCategories();
  const videosQuery = useVideos(categoryId);

  const activeCategory = categories.find((category) => String(category.categoryId) === categoryId);

  const filteredVideos = useMemo(() => {
    const videos = videosQuery.data ?? [];
    const needle = search.trim().toLowerCase();
    if (!needle) return videos;

    return videos.filter(
      (video) =>
        video.title?.toLowerCase().includes(needle) ||
        video.description?.toLowerCase().includes(needle) ||
        video.categoryName?.toLowerCase().includes(needle)
    );
  }, [videosQuery.data, search]);

  /** Change the category without losing an active search term. */
  function handleCategoryChange(nextCategoryId) {
    const next = new URLSearchParams(searchParams);
    if (nextCategoryId) {
      next.set('categoryId', nextCategoryId);
    } else {
      next.delete('categoryId');
    }
    setSearchParams(next, { replace: true });
  }

  const description = search
    ? `${filteredVideos.length} result${filteredVideos.length === 1 ? '' : 's'} for "${search}"`
    : (activeCategory?.description ?? 'Newest lessons first');

  return (
    <>
      <PageHeader
        eyebrow={search ? 'Search' : 'Library'}
        title={activeCategory ? activeCategory.name : 'All videos'}
        description={description}
      />

      <CategoryFilter
        categories={categories}
        activeId={categoryId}
        onChange={handleCategoryChange}
      />

      <VideoGrid
        videos={filteredVideos}
        isPending={videosQuery.isPending}
        error={videosQuery.error}
        onRetry={videosQuery.refetch}
        emptyTitle={search ? 'Nothing found' : 'No videos in this category'}
        emptyDescription={
          search ? 'Try a different search term.' : 'Pick another category to explore.'
        }
      />
    </>
  );
}
