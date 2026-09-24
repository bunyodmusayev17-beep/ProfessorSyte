import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import * as categoriesApi from '@/api/categories';
import { queryKeys } from '@/constants/queryKeys';

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: categoriesApi.getCategories,
  });
}

export function useCategory(categoryId) {
  return useQuery({
    queryKey: queryKeys.categories.detail(categoryId),
    queryFn: () => categoriesApi.getCategory(categoryId),
    enabled: Boolean(categoryId),
  });
}

function useCategoryInvalidation() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
}

export function useCreateCategory() {
  const invalidate = useCategoryInvalidation();
  return useMutation({
    mutationFn: ({ onProgress, ...input }) => categoriesApi.createCategory(input, { onProgress }),
    onSuccess: invalidate,
  });
}

export function useUpdateCategory() {
  const invalidate = useCategoryInvalidation();
  return useMutation({
    mutationFn: ({ categoryId, onProgress, ...input }) =>
      categoriesApi.updateCategory(categoryId, input, { onProgress }),
    onSuccess: invalidate,
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: categoriesApi.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      // Deleting a category cascades to its videos on the backend.
      queryClient.invalidateQueries({ queryKey: queryKeys.videos.all });
    },
  });
}
