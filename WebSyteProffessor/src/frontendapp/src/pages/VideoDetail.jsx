import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { ThumbsUp, ThumbsDown, Bookmark, BookmarkCheck, CheckCircle2, ExternalLink } from "lucide-react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { isMineOrAdmin } from "../utils/permissions";
import { getVideoById } from "../api/videos";
import {
  getCommentsByVideo,
  createComment,
  deleteComment,
  setReaction,
  removeReaction,
  addFavorite,
  removeFavorite,
  getMyFavorites,
  markAsWatched,
} from "../api/engagement";
import { getYoutubeEmbedUrl } from "../utils/youtube";

export default function VideoDetail() {
  const { videoId } = useParams();
  const { isAuthenticated, user } = useAuth();

  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isFavorited, setIsFavorited] = useState(false);
  const [myReaction, setMyReaction] = useState(null); // 1 = like, 2 = dislike (local only)
  const [loading, setLoading] = useState(true);
  const [watchedMarked, setWatchedMarked] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const videoData = await getVideoById(videoId);
      setVideo(videoData);

      const commentsData = await getCommentsByVideo(videoId);
      setComments(commentsData);

      if (isAuthenticated) {
        const favorites = await getMyFavorites();
        setIsFavorited(favorites.some((f) => String(f.videoId) === String(videoId)));
      }
    } finally {
      setLoading(false);
    }
  }, [videoId, isAuthenticated]);

  useEffect(() => {
    load();
  }, [load]);

  // Mark as watched once, shortly after opening the page
  useEffect(() => {
    if (!isAuthenticated || watchedMarked) return;
    const timer = setTimeout(async () => {
      try {
        await markAsWatched(videoId);
        setWatchedMarked(true);
      } catch {
        // non-critical, ignore
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [isAuthenticated, videoId, watchedMarked]);

  async function handleReaction(type) {
    if (!isAuthenticated) return;
    try {
      if (myReaction === type) {
        await removeReaction(videoId);
        setMyReaction(null);
      } else {
        await setReaction(videoId, type);
        setMyReaction(type);
      }
      const refreshed = await getVideoById(videoId);
      setVideo(refreshed);
    } catch {
      // ignore
    }
  }

  async function toggleFavorite() {
    if (!isAuthenticated) return;
    try {
      if (isFavorited) {
        await removeFavorite(videoId);
      } else {
        await addFavorite(videoId);
      }
      setIsFavorited(!isFavorited);
    } catch {
      // ignore
    }
  }

  async function handleAddComment(e) {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await createComment({ videoId: Number(videoId), text: newComment.trim() });
      setNewComment("");
      const commentsData = await getCommentsByVideo(videoId);
      setComments(commentsData);
    } catch {
      // ignore
    }
  }

  async function handleDeleteComment(commentId) {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.commentId !== commentId));
    } catch {
      // ignore
    }
  }

  if (loading) {
    return (
      <Layout>
        <p className="text-muted text-sm">Yuklanmoqda...</p>
      </Layout>
    );
  }

  if (!video) {
    return (
      <Layout>
        <p className="text-muted text-sm">Video topilmadi.</p>
      </Layout>
    );
  }

  const embedUrl = getYoutubeEmbedUrl(video.youtubeUrl);

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="aspect-video bg-black rounded-card overflow-hidden">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={video.title}
                className="w-full h-full"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-sm">
                Video ochilmadi
              </div>
            )}
          </div>

          <h1 className="text-xl font-semibold text-ink">{video.title}</h1>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleReaction(1)}
              disabled={!isAuthenticated}
              className={`btn-secondary flex items-center gap-2 text-sm ${
                myReaction === 1 ? "border-primary text-primary" : ""
              }`}
            >
              <ThumbsUp size={16} /> {video.likeCount ?? 0}
            </button>
            <button
              onClick={() => handleReaction(2)}
              disabled={!isAuthenticated}
              className={`btn-secondary flex items-center gap-2 text-sm ${
                myReaction === 2 ? "border-primary text-primary" : ""
              }`}
            >
              <ThumbsDown size={16} /> {video.dislikeCount ?? 0}
            </button>
            <button
              onClick={toggleFavorite}
              disabled={!isAuthenticated}
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              {isFavorited ? <BookmarkCheck size={16} className="text-primary" /> : <Bookmark size={16} />}
              {isFavorited ? "Saqlangan" : "Saqlash"}
            </button>
            {watchedMarked && (
              <span className="text-xs text-success flex items-center gap-1">
                <CheckCircle2 size={14} /> Ko'rildi
              </span>
            )}
          </div>

          <p className="text-sm text-muted whitespace-pre-line">{video.description}</p>

          {video.productLinks?.length > 0 && (
            <div className="card p-4">
              <h3 className="text-sm font-semibold text-ink mb-3">Videoda ishlatilgan jihozlar</h3>
              <ul className="space-y-2">
                {video.productLinks.map((link) => (
                  <li key={link.productLinkId}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary flex items-center gap-1.5 hover:underline"
                    >
                      <ExternalLink size={14} />
                      {link.productName} — {link.storeName}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Comments */}
          <div className="card p-4">
            <h3 className="text-sm font-semibold text-ink mb-3">
              Izohlar ({comments.length})
            </h3>

            {isAuthenticated ? (
              <form onSubmit={handleAddComment} className="flex gap-2 mb-4">
                <input
                  className="input-field"
                  placeholder="Izoh yozing..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button type="submit" className="btn-primary text-sm shrink-0">
                  Yuborish
                </button>
              </form>
            ) : (
              <p className="text-xs text-muted mb-4">
                Izoh yozish uchun <Link to="/login" className="text-primary">kiring</Link>.
              </p>
            )}

            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.commentId} className="border-b border-border pb-3 last:border-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-ink">{comment.userName}</span>
                    {isMineOrAdmin(user, comment.userId) && (
                      <button
                        onClick={() => handleDeleteComment(comment.commentId)}
                        className="text-xs text-muted hover:text-red-500"
                      >
                        O'chirish
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-muted mt-1">{comment.text}</p>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-xs text-muted">Hali izoh yo'q — birinchi bo'lib yozing.</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-4">
            <h3 className="text-sm font-semibold text-ink mb-2">Kategoriya</h3>
            <Link
              to={`/videos?categoryId=${video.categoryId}`}
              className="text-sm text-primary"
            >
              {video.categoryName}
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
