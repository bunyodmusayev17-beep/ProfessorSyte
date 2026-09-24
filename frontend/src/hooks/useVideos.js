import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import * as videosApi from '@/api/videos';
import { queryKeys } from '@/constants/queryKeys';

/** All videos, or just one category's when `categoryId` is given. */
export function useVideos(categoryId = null) {
  return useQuery({
    queryKey: categoryId ? queryKeys.videos.byCategory(categoryId) : queryKeys.videos.all,
    queryFn: () => (categoryId ? videosApi.getVideosByCategory(categoryId) : videosApi.getVideos()),
  });
}

export function useVideo(videoId) {
  return useQuery({
    queryKey: queryKeys.videos.detail(videoId),
    queryFn: () => videosApi.getVideo(videoId),
    enabled: Boolean(videoId),
    // This endpoint bumps ViewCount server-side, so don't refetch on every focus.
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}

function useVideoInvalidation() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.videos.all });
    // Category cards show a video count.
    queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.admin.analytics });
  };
}

export function useCreateVideo() {
  const invalidate = useVideoInvalidation();
  return useMutation({
    mutationFn: ({ onProgress, ...input }) => videosApi.createVideo(input, { onProgress }),
    onSuccess: invalidate,
  });
}

export function useUpdateVideo() {
  const invalidate = useVideoInvalidation();
  return useMutation({
    mutationFn: ({ videoId, onProgress, ...input }) =>
      videosApi.updateVideo(videoId, input, { onProgress }),
    onSuccess: invalidate,
  });
}

export function useDeleteVideo() {
  const invalidate = useVideoInvalidation();
  return useMutation({
    mutationFn: videosApi.deleteVideo,
    onSuccess: invalidate,
  });
}
