import { LogIn, ShieldCheck } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { UserRole } from '@/constants';
import { useAuth } from '@/hooks/useAuth';

/** The avatar + role block at the bottom of the sidebar. */
export function SidebarUser() {
  const { isAuthenticated, isAdmin, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="border-line border-t p-4">
        <Button to="/login" fullWidth>
          <LogIn size={15} />
          Sign in
        </Button>
      </div>
    );
  }

  // The backend only returns the email, so use its local part as a display name.
  const displayName = user.email?.split('@')[0] || 'Account';

  return (
    <div className="border-line flex items-center gap-3 border-t px-4 py-4">
      <span className="relative shrink-0">
        <span className="bg-brand flex size-10 items-center justify-center rounded-full p-[2px]">
          <span className="bg-surface text-fg font-display flex size-full items-center justify-center rounded-full text-sm font-bold uppercase">
            {displayName.charAt(0)}
          </span>
        </span>
        <span className="border-sidebar bg-success absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2" />
      </span>
      <span className="min-w-0">
        <span className="text-fg block truncate text-sm font-medium" title={user.email}>
          {displayName}
        </span>
        <span className="text-subtle flex items-center gap-1 text-xs">
          {isAdmin && <ShieldCheck size={12} className="text-primary-light" />}
          {isAdmin ? UserRole.Admin : 'Student'}
        </span>
      </span>
    </div>
  );
}
