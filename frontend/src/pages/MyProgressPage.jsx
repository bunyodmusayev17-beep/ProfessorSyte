import { Bookmark, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { ProgressSummary } from '@/features/engagement/ProgressSummary';
import { useMyFavorites, useMyProgress } from '@/hooks/useEngagement';
import { getErrorMessage } from '@/lib/apiError';
import { formatRelativeTime } from '@/lib/format';

function VideoList({ items, getKey, getLabel, getTimestamp, emptyMessage, isPending }) {
  if (isPending) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-5 w-full" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return <p className="text-subtle text-sm">{emptyMessage}</p>;
  }

  return (
    <ul className="divide-line divide-y">
      {items.map((item) => (
        <li key={getKey(item)}>
          <Link
            to={`/videos/${item.videoId}`}
            className="hover:bg-raised -mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 transition-colors"
          >
            <span className="text-fg min-w-0 flex-1 truncate text-sm">{getLabel(item)}</span>
            <span className="text-subtle shrink-0 text-xs">{getTimestamp(item)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function MyProgressPage() {
  const favoritesQuery = useMyFavorites();
  const progressQuery = useMyProgress();

  const error = favoritesQuery.error ?? progressQuery.error;
  if (error) {
    return (
      <>
        <PageHeader title="My progress" />
        <ErrorState
          message={getErrorMessage(error)}
          onRetry={() => {
            favoritesQuery.refetch();
            progressQuery.refetch();
          }}
        />
      </>
    );
  }

  return (
    <>
      <PageHeader title="My progress" description="The videos you have watched and saved" />

      <div className="mb-6">
        <ProgressSummary />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Watched videos"
            action={<CheckCircle2 size={16} className="text-success shrink-0" />}
          />
          <CardBody>
            <VideoList
              isPending={progressQuery.isPending}
              items={progressQuery.data ?? []}
              getKey={(item) => item.watchProgressId}
              getLabel={(item) => item.videoTitle}
              getTimestamp={(item) => formatRelativeTime(item.lastWatchedAt)}
              emptyMessage="You have not watched any videos yet."
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Saved videos"
            action={<Bookmark size={16} className="text-accent shrink-0" />}
          />
          <CardBody>
            <VideoList
              isPending={favoritesQuery.isPending}
              items={favoritesQuery.data ?? []}
              getKey={(item) => item.favoriteId}
              getLabel={(item) => item.videoTitle}
              getTimestamp={(item) => formatRelativeTime(item.createdAt)}
              emptyMessage="You have not saved anything yet."
            />
          </CardBody>
        </Card>
      </div>
    </>
  );
}
