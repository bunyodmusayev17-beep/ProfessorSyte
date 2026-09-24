import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import * as projectsApi from '@/api/projects';
import { queryKeys } from '@/constants/queryKeys';

export function useProjects() {
  return useQuery({
    queryKey: queryKeys.projects.all,
    queryFn: projectsApi.getProjects,
  });
}

export function useProject(projectId) {
  return useQuery({
    queryKey: queryKeys.projects.detail(projectId),
    queryFn: () => projectsApi.getProject(projectId),
    enabled: Boolean(projectId),
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ onProgress, ...input }) => projectsApi.createProject(input, { onProgress }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.projects.all }),
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: projectsApi.deleteProject,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.projects.all }),
  });
}
