import { ShieldCheck, UserRound, Users } from 'lucide-react';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { EmptyState, ErrorState } from '@/components/ui/EmptyState';
import { RowsSkeleton } from '@/components/ui/Skeleton';
import { UserRole } from '@/constants';
import { useUsers } from '@/hooks/useAdmin';
import { getErrorMessage } from '@/lib/apiError';
import { formatDate } from '@/lib/format';

export default function AdminUsers() {
  const usersQuery = useUsers();

  if (usersQuery.isPending) return <RowsSkeleton count={6} />;

  if (usersQuery.error) {
    return <ErrorState message={getErrorMessage(usersQuery.error)} onRetry={usersQuery.refetch} />;
  }

  const users = usersQuery.data ?? [];

  if (users.length === 0) {
    return <EmptyState icon={Users} title="No users yet" />;
  }

  return (
    <>
      {/* Phones: cards. The 4-column table is unreadable at 375px. */}
      <div className="space-y-3 md:hidden">
        {users.map((user) => (
          <Card key={user.id} className="flex items-center gap-3 p-3">
            <span className="bg-raised text-muted flex size-9 shrink-0 items-center justify-center rounded-full">
              {user.role === UserRole.Admin ? (
                <ShieldCheck size={16} className="text-primary" />
              ) : (
                <UserRound size={16} />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-fg truncate text-sm font-medium">{user.userName}</p>
              <p className="text-subtle truncate text-xs">{user.email}</p>
              <p className="text-subtle mt-0.5 text-xs">{formatDate(user.createdAt)}</p>
            </div>
            <Badge tone={user.role === UserRole.Admin ? 'primary' : 'neutral'}>{user.role}</Badge>
          </Card>
        ))}
      </div>

      {/* Tablet and up: a proper table. */}
      <Card className="hidden overflow-hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-line text-subtle border-b text-left">
                <th className="px-4 py-2.5 font-medium">Username</th>
                <th className="px-4 py-2.5 font-medium">Email</th>
                <th className="px-4 py-2.5 font-medium">Role</th>
                <th className="px-4 py-2.5 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-line divide-y">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="text-fg px-4 py-2.5 font-medium">{user.userName}</td>
                  <td className="text-muted px-4 py-2.5">{user.email}</td>
                  <td className="px-4 py-2.5">
                    <Badge tone={user.role === UserRole.Admin ? 'primary' : 'neutral'}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="text-subtle px-4 py-2.5">{formatDate(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
