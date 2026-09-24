import { LogIn, ShieldCheck, UserRound } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { UserRole } from '@/constants';
import { useAuth } from '@/hooks/useAuth';

/** The avatar + role block at the bottom of the sidebar, as in the reference design. */
export function SidebarUser() {
  const { isAuthenticated, isAdmin, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="border-line border-t p-4">
        <Button to="/login" variant="secondary" size="sm" fullWidth>
          <LogIn size={15} />
          Sign in
        </Button>
      </div>
    );
  }

  // The backend only returns the email, so use its local part as a display name.
  const displayName = user.email?.split('@')[0] || 'Account';

  return (
    <div className="border-line flex items-center gap-2.5 border-t px-4 py-4">
      <span className="bg-raised text-muted flex size-9 shrink-0 items-center justify-center rounded-full">
        {isAdmin ? <ShieldCheck size={17} className="text-primary" /> : <UserRound size={17} />}
      </span>
      <span className="min-w-0">
        <span className="text-fg block truncate text-sm font-medium" title={user.email}>
          {displayName}
        </span>
        <span className="text-subtle block text-xs">{isAdmin ? UserRole.Admin : 'Student'}</span>
      </span>
    </div>
  );
}
