import { Eye, MessageSquare, PlayCircle, ThumbsUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAnalytics } from '@/hooks/useAdmin';
import { useCountUp } from '@/hooks/useCountUp';
import { getErrorMessage } from '@/lib/apiError';
import { cn } from '@/lib/cn';
import { formatCount } from '@/lib/format';

function StatCard({ icon: Icon, label, value, tone }) {
  const count = useCountUp(value);
  const tones = {
    primary: 'from-primary/30 text-primary-light',
    accent: 'from-accent/30 text-accent',
    success: 'from-success/30 text-success',
  };

  return (
    <Card className="group flex items-center gap-4 p-5 transition-transform duration-500 hover:-translate-y-1">
      <span
        className={cn(
          'flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br to-transparent transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6',
          tones[tone]
        )}
      >
        <Icon size={21} />
      </span>
      <span className="min-w-0">
        <span className="font-display text-fg block text-3xl font-bold">{formatCount(count)}</span>
        <span className="text-subtle block truncate text-xs">{label}</span>
      </span>
    </Card>
  );
}

function TopList({ title, icon: Icon, items, getMetric }) {
  return (
    <Card>
      <CardHeader title={title} action={<Icon size={16} className="text-subtle shrink-0" />} />
      <CardBody className="p-0">
        {items.length === 0 ? (
          <p className="text-subtle px-4 py-4 text-sm">No data yet.</p>
        ) : (
          <ol className="divide-line divide-y">
            {items.map((video, index) => (
              <li key={video.videoId}>
                <Link
                  to={`/videos/${video.videoId}`}
                  className="hover:bg-raised flex items-center gap-3 px-4 py-2.5 transition-colors"
                >
                  <span className="bg-raised text-subtle flex size-6 shrink-0 items-center justify-center rounded text-xs font-medium">
                    {index + 1}
                  </span>
                  <span className="text-fg min-w-0 flex-1 truncate text-sm">{video.title}</span>
                  <span className="text-subtle shrink-0 text-xs">
                    {formatCount(getMetric(video))}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </CardBody>
    </Card>
  );
}

export default function AdminDashboard() {
  const analyticsQuery = useAnalytics();

  if (analyticsQuery.isPending) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-[74px]" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (analyticsQuery.error) {
    return (
      <ErrorState
        message={getErrorMessage(analyticsQuery.error)}
        onRetry={analyticsQuery.refetch}
      />
    );
  }

  const data = analyticsQuery.data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={PlayCircle} tone="primary" label="Total videos" value={data.totalVideos} />
        <StatCard icon={Users} tone="accent" label="Total users" value={data.totalUsers} />
        <StatCard
          icon={MessageSquare}
          tone="success"
          label="Total comments"
          value={data.totalComments}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TopList
          title="Most viewed videos"
          icon={Eye}
          items={data.mostViewedVideos ?? []}
          getMetric={(video) => video.viewCount}
        />
        <TopList
          title="Most liked videos"
          icon={ThumbsUp}
          items={data.mostLikedVideos ?? []}
          getMetric={(video) => video.likeCount}
        />
      </div>
    </div>
  );
}
