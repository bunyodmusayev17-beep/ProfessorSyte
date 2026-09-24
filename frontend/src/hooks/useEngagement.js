import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';

import * as engagementApi from '@/api/engagement';
import { queryKeys } from '@/constants/queryKeys';
import { reactionStore } from '@/lib/reactionStore';

import { useAuth } from './useAuth';

// --- Comments -------------------------------------------------------------

export function useComments(videoId) {
  return useQuery({
    queryKey: queryKeys.comments.byVideo(videoId),
    queryFn: () => engagementApi.getComments(videoId),
    enabled: Boolean(videoId),
  });
}

function useCommentInvalidation(videoId) {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.comments.byVideo(videoId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.admin.analytics });
  };
}

export function useCreateComment(videoId) {
  const invalidate = useCommentInvalidation(videoId);
  return useMutation({
    mutationFn: (text) => engagementApi.createComment({ videoId, text }),
    onSuccess: invalidate,
  });
}

export function useUpdateComment(videoId) {
  const invalidate = useCommentInvalidation(videoId);
  return useMutation({
    mutationFn: ({ commentId, text }) => engagementApi.updateComment(commentId, text),
    onSuccess: invalidate,
  });
}

export function useDeleteComment(videoId) {
  const invalidate = useCommentInvalidation(videoId);
  return useMutation({
    mutationFn: engagementApi.deleteComment,
    onSuccess: invalidate,
  });
}

// --- Favorites ------------------------------------------------------------

export function useMyFavorites() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: queryKeys.favorites.mine,
    queryFn: engagementApi.getMyFavorites,
    enabled: isAuthenticated,
  });
}

/** Toggle for a single video, driven off the user's favorites list. */
export function useFavorite(videoId) {
  const queryClient = useQueryClient();
  const { data: favorites = [], isPending } = useMyFavorites();

  const isFavorited = useMemo(
    () => favorites.some((favorite) => String(favorite.videoId) === String(videoId)),
    [favorites, videoId]
  );

  const mutation = useMutation({
    mutationFn: () =>
      isFavorited ? engagementApi.removeFavorite(videoId) : engagementApi.addFavorite(videoId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.favorites.mine }),
  });

  return { isFavorited, isLoading: isPending, toggle: mutation.mutateAsync, ...mutation };
}

// --- Watch progress -------------------------------------------------------

export function useMyProgress() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: queryKeys.progress.mine,
    queryFn: engagementApi.getMyProgress,
    enabled: isAuthenticated,
  });
}

export function useMarkAsWatched() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: engagementApi.markAsWatched,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.progress.mine }),
  });
}

// --- Reactions ------------------------------------------------------------

/**
 * Like/dislike for one video. `POST /reaction` is a toggle on the backend
 * (sending the same type twice removes it), and the counts are adjusted in the
 * cached VideoDto rather than refetched — refetching the video would inflate
 * its ViewCount.
 */
export function useReaction(videoId, { likeCount = 0, dislikeCount = 0 } = {}) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [myReaction, setMyReaction] = useState(() => reactionStore.get(user?.id, videoId));

  const applyCountDelta = useCallback(
    (likeDelta, dislikeDelta) => {
      queryClient.setQueryData(queryKeys.videos.detail(videoId), (video) =>
        video
          ? {
              ...video,
              likeCount: Math.max(0, (video.likeCount ?? 0) + likeDelta),
              dislikeCount: Math.max(0, (video.dislikeCount ?? 0) + dislikeDelta),
            }
          : video
      );
    },
    [queryClient, videoId]
  );

  const mutation = useMutation({
    mutationFn: (type) => engagementApi.setReaction(videoId, type),
    onSuccess: (_data, type) => {
      const previous = myReaction;
      const next = previous === type ? null : type;

      // Undo the previous reaction's contribution, then add the new one's.
      let likeDelta = 0;
      let dislikeDelta = 0;
      if (previous === 1) likeDelta -= 1;
      if (previous === 2) dislikeDelta -= 1;
      if (next === 1) likeDelta += 1;
      if (next === 2) dislikeDelta += 1;

      applyCountDelta(likeDelta, dislikeDelta);
      setMyReaction(next);
      reactionStore.set(user?.id, videoId, next);
      queryClient.invalidateQueries({ queryKey: queryKeys.videos.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.analytics });
    },
  });

  return {
    myReaction,
    likeCount,
    dislikeCount,
    react: mutation.mutate,
    isReacting: mutation.isPending,
  };
}
