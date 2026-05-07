import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/ui/Loader";
import { ArrowLeft, Calendar, User, Clock, Eye, Tag, Send } from "lucide-react";

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Comment states
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentError, setCommentError] = useState("");

  const currentPostId = useRef(null);

  useEffect(() => {
    // Prevent double-fetching in React Strict Mode (dev only behavior)
    if (currentPostId.current === id) return;
    currentPostId.current = id;

    const fetchPost = async () => {
      try {
        const res = await axiosInstance.get(`/posts/${id}`);
        setPost(res.data.data);

        // Fetch comments simply
        const commentsRes = await axiosInstance.get(`/comments/${id}`);
        setComments(commentsRes.data.data);
      } catch (err) {
        console.error("Error fetching post data:", err);
        setError("Failed to load post. It might have been deleted.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  // Handle simple comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    setCommentError("");

    try {
      const res = await axiosInstance.post(`/comments`, {
        content: newComment,
        postId: id,
      });
      // Add new comment to the list
      setComments([res.data.data, ...comments]);
      setNewComment(""); // Clear input
    } catch (err) {
      console.error("Error posting comment:", err);
      setCommentError(err.response?.data?.message || "Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center flex-col items-center gap-4 py-32">
        <Loader size="xl" className="text-primary" />
        <p className="text-muted-foreground animate-pulse font-medium">
          Fetching details...
        </p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <div className="bg-destructive/10 p-8 rounded-2xl border border-destructive/20 mb-6">
          <p className="text-destructive font-semibold text-lg">
            {error || "Post not found"}
          </p>
        </div>
        <Link
          to="/"
          className="text-primary hover:underline font-medium inline-flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
      </div>
    );
  }

  const imageUrl =
    post.imageUrl ||
    "/images/post-default.jpg";
  const dateStr = new Date(post.createdAt || Date.now()).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    },
  );

  return (
    <article className="max-w-4xl mx-auto animate-fade-in pb-20">
      <Link
        to="/"
        className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8 font-medium"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to articles
      </Link>

      <header className="mb-10 text-center">
        <div className="flex flex-wrap justify-center items-center gap-4 text-sm font-medium text-muted-foreground mb-6">
          <span className="flex items-center bg-secondary/50 px-3 py-1.5 rounded-full">
            <Calendar className="w-4 h-4 mr-2" /> {dateStr}
          </span>
          <span className="flex items-center bg-secondary/50 px-3 py-1.5 rounded-full">
            <User className="w-4 h-4 mr-2" /> {post.author?.name || "Anonymous"}
          </span>
          <span className="flex items-center bg-secondary/50 px-3 py-1.5 rounded-full">
            <Eye className="w-4 h-4 mr-2" /> {post.views || 0} Views
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-heading font-extrabold tracking-tight mb-6 leading-tight">
          {post.title}
        </h1>
        {post.tags && post.tags.length > 0 && (
          <div className="flex justify-center gap-2 mt-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded-md flex items-center"
              >
                <Tag className="w-3 h-3 mr-1" /> {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="relative aspect-[21/9] w-full mb-12 rounded-3xl overflow-hidden shadow-2xl">
        <img
          src={imageUrl}
          alt={post.title}
          className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
        />
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-heading prose-a:text-primary whitespace-pre-wrap">
        {post.content}
      </div>

      {/* Divider */}
      <hr className="my-12 border-border" />

      {/* Comments Section */}
      <section className="glass p-8 rounded-3xl mt-12">
        <h3 className="text-2xl font-heading font-bold mb-6">
          Comments ({comments.length})
        </h3>

        {/* Simple Comment Form */}
        {user ? (
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <textarea
              className="w-full p-4 rounded-xl border border-border bg-background/50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
              rows="3"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={isSubmitting}
            />
            {commentError && (
              <p className="text-destructive text-sm mt-2">{commentError}</p>
            )}
            <div className="flex justify-end mt-3">
              <button
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center"
              >
                {isSubmitting ? (
                  <Loader size="xs" className="mr-2" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Post Comment
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-secondary/30 p-6 rounded-xl text-center mb-8 border border-border/50">
            <p className="text-muted-foreground mb-4">
              Please log in to leave a comment.
            </p>
            <Link
              to="/login"
              className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Log In
            </Link>
          </div>
        )}

        {/* Simple Comments List */}
        <div className="space-y-6">
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div
                key={comment._id || index}
                className="flex gap-4 p-5 rounded-2xl bg-secondary/10 border border-border/50"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0 overflow-hidden">
                  {comment.author?.avatarUrl ? (
                    <img
                      src={comment.author.avatarUrl}
                      alt={comment.author?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    comment.author?.name?.charAt(0).toUpperCase() || "U"
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold">
                      {comment.author?.name || "Anonymous User"}
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground italic py-8">
              No comments yet. Be the first to share your thoughts!
            </p>
          )}
        </div>
      </section>
    </article>
  );
}
