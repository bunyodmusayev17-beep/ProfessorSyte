/**
 * Every React Query key in one place, so invalidation after a mutation can
 * never drift from the key a hook actually subscribes with.
 */
export const queryKeys = {
  categories: {
    all: ['categories'],
    detail: (categoryId) => ['categories', String(categoryId)],
  },
  videos: {
    all: ['videos'],
    byCategory: (categoryId) => ['videos', 'category', String(categoryId)],
    detail: (videoId) => ['videos', String(videoId)],
  },
  projects: {
    all: ['projects'],
    detail: (projectId) => ['projects', String(projectId)],
  },
  comments: {
    byVideo: (videoId) => ['comments', 'video', String(videoId)],
  },
  favorites: {
    mine: ['favorites', 'mine'],
  },
  progress: {
    mine: ['progress', 'mine'],
  },
  admin: {
    analytics: ['admin', 'analytics'],
    users: ['admin', 'users'],
  },
};
