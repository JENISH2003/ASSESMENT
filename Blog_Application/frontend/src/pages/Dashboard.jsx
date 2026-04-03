import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../services/axiosInstance";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import {
  User,
  Layout as LayoutIcon,
  Mail, Settings, LogOut, Calendar, Eye, Pencil, Trash, PenTool, ArrowRight
} from "lucide-react";

export default function Dashboard() {
  const { user, logout, setUser } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(null);
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchPosts = async () => {
        try {
          const apiEndpoint =
            user.role === "admin" ? "/posts" : `/posts?author=${user._id}`;
          const res = await axiosInstance.get(apiEndpoint);
          setPosts(res.data.data);
        } catch (error) {
          console.error("Failed to fetch posts", error);
        } finally {
          setLoading(false);
        }
      };
      fetchPosts();
    }
  }, [user]);

  const handleDelete = async (postId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this post? This action cannot be undone.",
      )
    ) {
      setIsDeleting(postId);
      try {
        await axiosInstance.delete(`/posts/${postId}`);
        setPosts((prevPosts) => prevPosts.filter((p) => p._id !== postId));
      } catch (err) {
        console.error("Failed to delete post:", err);
        alert(err.response?.data?.message || "Failed to delete post.");
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await axiosInstance.patch(
        "/users/profile-picture",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      setUser(res.data.data);
    } catch (err) {
      console.error("Avatar upload failed", err);
      alert(err.response?.data?.message || "Failed to update profile picture");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleAccountSettingsClick = () => {
    fileInputRef.current?.click();
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">
          Please log in to view your dashboard
        </h2>
        <Link to="/login">
          <Button>Go to Login</Button>
        </Link>
      </div>
    );
  }

  const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);

  const stats = [
    { label: "Total Posts", value: posts.length.toString(), icon: LayoutIcon },
    { label: "Total Views", value: totalViews.toString(), icon: User },
  ];

  return (
    <div className="max-w-6xl mx-auto py-10 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Profile */}
        <div className="w-full md:w-1/3 space-y-6">
          <div className="glass flex-1 border border-border/50 p-6 rounded-3xl mb-8 md:mb-0 xl:sticky xl:top-24 h-max">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg border-4 border-background overflow-hidden relative group">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-white" />
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <div className="w-full text-center">
              <h2 className="text-2xl font-heading font-bold text-foreground">
                {user.name}
              </h2>
            </div>
            <div className="flex items-center justify-center text-muted-foreground mt-2 text-sm font-medium">
              <Mail className="w-4 h-4 mr-2" /> {user.email}
            </div>

            <div className="mt-8 space-y-3">
              <Button className="w-full" asChild>
                <Link to="/create">Write New Post</Link>
              </Button>
              <div className="space-y-3 pt-6 border-t border-border/50 mt-6">
                <Button
                  variant="outline"
                  className="w-full text-muted-foreground hover:text-foreground"
                  onClick={handleAccountSettingsClick}
                  disabled={isUploading}
                >
                  <Settings className="w-4 h-4 mr-2" />{" "}
                  {isUploading ? "Uploading..." : "Change Picture"}
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
                <Button
                  variant="ghost"
                  className="w-full text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                  onClick={logout}
                >
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-full md:w-2/3 space-y-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="glass border border-border/50 p-6 rounded-3xl flex items-center justify-between group hover:border-primary/30 transition-colors cursor-default"
              >
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-heading font-bold mt-1 text-foreground">
                    {stat.value}
                  </p>
                </div>
                <div className="p-3 bg-secondary rounded-2xl group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="glass-card rounded-3xl overflow-hidden pt-8 px-8 pb-4">
            <h3 className="text-xl font-heading font-bold mb-6">
              Recent Activity
            </h3>

            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : posts.length > 0 ? (
                posts.map((post) => (
                  <div
                    key={post._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-secondary/20 rounded-xl border border-border/50 hover:border-primary/30 transition-colors"
                  >
                    <div className="mb-4 sm:mb-0 pr-4">
                      <h4 className="font-semibold text-foreground truncate max-w-md text-lg">
                        {post.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <span className="flex items-center text-xs text-muted-foreground bg-secondary/60 px-2.5 py-1 rounded-md">
                          <Calendar className="w-3 h-3 mr-1.5" />
                          {new Date(post.createdAt).toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span className="flex items-center text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                          <Eye className="w-3 h-3 mr-1.5" />
                          {post.views || 0} Views
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0 items-center justify-end w-full sm:w-auto mt-4 sm:mt-0">
                      <Link to={`/edit/${post._id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-primary"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(post._id)}
                        disabled={isDeleting === post._id}
                      >
                        {isDeleting === post._id ? (
                          <div className="w-4 h-4 border-2 border-destructive border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Trash className="w-4 h-4" />
                        )}
                      </Button>
                      <Link to={`/post/${post._id}`}>
                        <Button variant="outline" size="sm" className="ml-2">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border/60 rounded-2xl bg-secondary/20">
                  <PenTool className="w-12 h-12 text-muted-foreground mb-4" />
                  <h4 className="text-lg font-semibold text-foreground mb-2">
                    No posts yet
                  </h4>
                  <p className="text-muted-foreground text-sm max-w-sm mb-6">
                    You haven't written anything yet. Share your knowledge and
                    start your first blog post today.
                  </p>
                  <Link to="/create">
                    <Button
                      variant="outline"
                      className="rounded-full shadow-sm"
                    >
                      Create First Post <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
