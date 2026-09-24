import { Bookmark, FolderKanban, Home, PlayCircle, ShieldCheck } from 'lucide-react';

/**
 * Single source of truth for the sidebar and the mobile tab bar, so the two can
 * never disagree about what a signed-in or admin user should see.
 * `end: true` means "only active on an exact path match".
 */
export const NAV_ITEMS = [
  { to: '/', label: 'Home', shortLabel: 'Home', icon: Home, end: true },
  { to: '/videos', label: 'All videos', shortLabel: 'Videos', icon: PlayCircle },
  { to: '/projects', label: 'Projects', shortLabel: 'Projects', icon: FolderKanban },
  {
    to: '/my-progress',
    label: 'My progress',
    shortLabel: 'Progress',
    icon: Bookmark,
    requiresAuth: true,
  },
  {
    to: '/admin',
    label: 'Admin panel',
    shortLabel: 'Admin',
    icon: ShieldCheck,
    requiresAdmin: true,
  },
];

export function getVisibleNavItems({ isAuthenticated, isAdmin }) {
  return NAV_ITEMS.filter((item) => {
    if (item.requiresAdmin) return isAdmin;
    if (item.requiresAuth) return isAuthenticated;
    return true;
  });
}
