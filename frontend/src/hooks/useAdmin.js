import { useQuery } from '@tanstack/react-query';

import * as adminApi from '@/api/admin';
import { queryKeys } from '@/constants/queryKeys';

export function useAnalytics() {
  return useQuery({
    queryKey: queryKeys.admin.analytics,
    queryFn: adminApi.getAnalytics,
  });
}

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.admin.users,
    queryFn: adminApi.getUsers,
  });
}
