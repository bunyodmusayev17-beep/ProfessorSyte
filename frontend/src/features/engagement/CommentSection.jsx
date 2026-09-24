import { MessageSquare, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { UserRole } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import {
  useComments,
  useCreateComment,
  useDeleteComment,
  useUpdateComment,
} from '@/hooks/useEngagement';
import { getErrorMessage } from '@/lib/apiError';
import { formatRelativeTime } from '@/lib/format';

/** Matches the backend rule: the author may edit, the author or an admin may delete. */
function canEdit(user, comment) {
  return Boolean(user) && String(user.id) === String(comment.userId);
}
function canDelete(user, comment) {
  return canEdit(user, comment) || user?.role === UserRole.Admin;
}

export function CommentSection({ videoId }) {
  const { isAuthenticated, user } = useAuth();
  const { data: comments = [], isPending, error } = useComments(videoId);

  const createComment = useCreateComment(videoId);
  const updateComment = useUpdateComment(videoId);
  const deleteComment = useDeleteComment(videoId);

  const [draft, setDraft] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);

  async function handleCreate(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;

    try {
      await createComment.mutateAsync(text);
      setDraft('');
    } catch (mutationError) {
      toast.error(getErrorMessage(mutationError));
    }
  }

  async function handleUpdate(event) {
    event.preventDefault();
    const text = editingText.trim();
    if (!text) return;

    try {
      await updateComment.mutateAsync({ commentId: editingId, text });
      setEditingId(null);
      setEditingText('');
    } catch (mutationError) {
      toast.error(getErrorMessage(mutationError));
    }
  }

  async function handleDelete() {
    try {
      await deleteComment.mutateAsync(pendingDelete.commentId);
      toast.success('Comment deleted');
      setPendingDelete(null);
    } catch (mutationError) {
      toast.error(getErrorMessage(mutationError));
    }
  }

  return (
    <Card>
      <CardHeader
        title={`Comments${isPending ? '' : ` (${comments.length})`}`}
        description="Ask a question or share what you built"
      />

      <CardBody className="space-y-5">
        {isAuthenticated ? (
          <form onSubmit={handleCreate} className="flex flex-col gap-2 sm:flex-row">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Write a comment..."
              maxLength={1000}
              aria-label="Comment text"
              className="border-line bg-raised text-fg placeholder:text-subtle focus:border-primary w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none"
            />
            <Button
              type="submit"
              disabled={!draft.trim()}
              isLoading={createComment.isPending}
              className="sm:w-auto"
            >
              Post
            </Button>
          </form>
        ) : (
          <p className="text-muted flex flex-wrap items-center gap-1.5 text-sm">
            <MessageSquare size={15} />
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
            to leave a comment.
          </p>
        )}

        {isPending && (
          <div className="space-y-4">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-3.5 w-full" />
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-danger text-sm">{getErrorMessage(error)}</p>}

        {!isPending && !error && comments.length === 0 && (
          <p className="text-muted text-sm">No comments yet — be the first.</p>
        )}

        <ul className="divide-line divide-y">
          {comments.map((comment) => (
            <li key={comment.commentId} className="animate-reveal py-3 first:pt-0 last:pb-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2">
                    <span className="text-fg text-sm font-medium">{comment.userName}</span>
                    <span className="text-subtle text-xs">
                      {formatRelativeTime(comment.createdAt)}
                    </span>
                  </div>

                  {editingId === comment.commentId ? (
                    <form onSubmit={handleUpdate} className="mt-2 flex flex-col gap-2 sm:flex-row">
                      <input
                        value={editingText}
                        onChange={(event) => setEditingText(event.target.value)}
                        maxLength={1000}
                        aria-label="Edit comment"
                        className="border-line bg-raised text-fg focus:border-primary w-full rounded-lg border px-3 py-1.5 text-sm transition-colors focus:outline-none"
                      />
                      <div className="flex gap-2">
                        <Button
                          type="submit"
                          size="sm"
                          disabled={!editingText.trim()}
                          isLoading={updateComment.isPending}
                        >
                          Save
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <p className="text-muted mt-1 text-sm break-words whitespace-pre-line">
                      {comment.text}
                    </p>
                  )}
                </div>

                {editingId !== comment.commentId && (
                  <div className="flex shrink-0 gap-0.5">
                    {canEdit(user, comment) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Edit comment"
                        onClick={() => {
                          setEditingId(comment.commentId);
                          setEditingText(comment.text);
                        }}
                      >
                        <Pencil size={14} />
                      </Button>
                    )}
                    {canDelete(user, comment) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Delete comment"
                        className="hover:text-danger"
                        onClick={() => setPendingDelete(comment)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardBody>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleDelete}
        isLoading={deleteComment.isPending}
        title="Delete comment"
        message="This comment will be removed permanently. Continue?"
      />
    </Card>
  );
}
