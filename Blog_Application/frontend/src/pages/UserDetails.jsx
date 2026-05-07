import { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import {
  User,
  Mail,
  Calendar,
  FileText,
  ChevronLeft,
  ChevronRight,
  Edit3,
  PlusCircle,
  Search,
  X,
  Trash2,
} from "lucide-react";
import Loader from "../components/ui/Loader";
import ErrorMessage from "../components/ui/ErrorMessage";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axiosInstance.get(`/users/${id}/history`);
        setData(res.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [id]);

  const limit = 5;
  const blogs = data?.blogs || [];

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [blogs, searchTerm]);

  const totalPages = useMemo(() => Math.ceil(filteredBlogs.length / limit) || 1, [filteredBlogs.length]);
  const currentBlogs = useMemo(() => {
    return filteredBlogs.slice(
      (currentPage - 1) * limit,
      currentPage * limit,
    );
  }, [filteredBlogs, currentPage]);

  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  if (error)
    return (
      <div className="p-8 text-center text-destructive">
        <ErrorMessage message={error} />
      </div>
    );
  if (!data || !data.user)
    return (
      <div className="p-8 text-center text-muted-foreground">
        User not found
      </div>
    );

  const { user, totalBlogs, totalDeletions } = data;

  const handlePreviousPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNextPage = () =>
    setCurrentPage((p) => Math.min(totalPages, p + 1));
  const handleJumpToPage = (e) => {
    const page = parseInt(e.target.value);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 animate-fade-in pb-16">
      <Link
        to="/superadmin/users"
        className="inline-flex items-center text-primary hover:underline mb-6 font-medium"
      >
        <ChevronLeft className="w-5 h-5 mr-1" /> Back to Users
      </Link>

      {/* User Profile Card */}
      <div className="glass-card p-8 rounded-3xl mb-8 flex flex-col md:flex-row items-center gap-8 shadow-sm">
        <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center overflow-hidden shrink-0 border-4 border-background shadow-md">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-10 h-10 text-muted-foreground" />
          )}
        </div>
        <div className="text-center md:text-left flex-1">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
            {user.name}
          </h1>
          <div className="flex items-center justify-center md:justify-start text-muted-foreground text-sm font-medium">
            <Mail className="w-4 h-4 mr-2" /> {user.email}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <div className="glass p-6 rounded-2xl border border-border/50 flex items-center gap-4 hover:border-primary/30 transition-colors">
          <div className="p-4 bg-primary/10 rounded-2xl text-primary">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Blogs Created
            </p>
            <p className="text-3xl font-heading font-bold text-foreground mt-1">
              {totalBlogs}
            </p>
          </div>
        </div>
        <div className="glass p-6 rounded-2xl border border-border/50 flex items-center gap-4 hover:border-primary/30 transition-colors">
          <div className="p-4 bg-destructive/10 rounded-2xl text-destructive">
            <Trash2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Deletions
            </p>
            <p className="text-3xl font-heading font-bold text-foreground mt-1">
              {totalDeletions || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Blog List with History */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-heading font-bold">
            Blog Activity History
          </h2>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search specific blog..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-10 py-2 h-10 bg-secondary/30 backdrop-blur-sm border border-border/50 rounded-xl text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
                className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {blogs && blogs.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border p-10 text-center flex flex-col items-center shadow-sm">
            <FileText className="w-12 h-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-lg">
              No blogs found for this user.
            </p>
          </div>
        ) : filteredBlogs.length > 0 ? (
          <div className="space-y-6">
            {currentBlogs.map((blog) => {
              const isDeleted = blog.history?.some(item => item.action === "Deleted");
              
              return (
              <div
                key={blog._id}
                onClick={() => navigate(`/post/${blog._id}`)}
                role="button"
                tabIndex={0}
                className={`bg-card cursor-pointer rounded-2xl border shadow-md overflow-hidden p-6 relative transition-all duration-300 ${
                  isDeleted
                    ? "border-destructive/20 shadow-[0_4px_24px_-8px_rgba(239,68,68,0.25)] hover:shadow-[0_4px_24px_-4px_rgba(239,68,68,0.35)] opacity-90"
                    : "border-green-500/20 shadow-[0_4px_24px_-8px_rgba(34,197,94,0.25)] hover:shadow-[0_4px_24px_-4px_rgba(34,197,94,0.35)]"
                }`}
              >
                <div className="mb-4 pb-4 border-b border-border/50">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center flex-wrap gap-2 mb-1">
                        <h3 className="text-xl font-heading font-bold text-foreground">
                          {blog.title}
                        </h3>
                        {isDeleted && (
                          <span className="text-sm font-semibold text-destructive">
                            (Deleted)
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        {blog.tags && blog.tags.length > 0 ? (
                          blog.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-md"
                            >
                              #{tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs font-medium text-muted-foreground bg-secondary/50 px-2.5 py-1 rounded-md">
                            No tags
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0 mt-2 sm:mt-0">
                      <span className="inline-block text-xs font-semibold bg-secondary text-secondary-foreground px-3 py-1.5 rounded-lg border border-border/50">
                        Total Actions: {blog.totalCount}
                      </span>
                    </div>
                  </div>
                </div>

                {blog.history && blog.history.length > 0 ? (
                  <ul className="space-y-3">
                    {blog.history.map((item, index) => (
                      <li
                        key={item._id}
                        className="flex items-center gap-4 text-sm p-2 hover:bg-muted/30 rounded-lg transition-colors"
                      >
                        <span className="w-6 h-6 flex items-center justify-center bg-secondary font-bold text-muted-foreground rounded-full shrink-0 text-xs">
                          {index + 1}
                        </span>
                        <div className="flex-1 font-medium text-foreground">
                          {item.action === "Created" ? (
                            <span className="text-primary flex items-center gap-2">
                              <PlusCircle className="w-4 h-4" /> Created
                            </span>
                          ) : item.action === "Deleted" ? (
                            <span className="text-destructive flex items-center gap-2">
                              <Trash2 className="w-4 h-4" /> Deleted
                            </span>
                          ) : (
                            <span className="text-blue-500 flex items-center gap-2">
                              <Edit3 className="w-4 h-4" /> Updated
                            </span>
                          )}
                        </div>
                        <div className="text-muted-foreground bg-secondary/50 px-2 py-1 flex items-center rounded-md font-medium shrink-0">
                          <Calendar className="w-3.5 h-3.5 mr-1.5" />
                          {new Date(item.date).toLocaleString()}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No history recorded for this blog yet.
                  </p>
                )}
              </div>
              );
            })}

            {/* Pagination Section */}
            <div className="flex justify-center items-center pt-8 space-x-2 animate-fade-in relative z-20">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="p-3.5 rounded-full border border-border/80 bg-background hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>

              <div className="flex items-center space-x-2 bg-secondary/30 rounded-full px-8 py-3 border border-border/50 mx-2 shadow-sm font-heading">
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider text-xs">
                  Page
                </span>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={currentPage}
                  onChange={handleJumpToPage}
                  className="w-12 p-1 text-center font-bold text-lg bg-transparent focus:outline-none focus:bg-background/50 focus:ring-1 focus:ring-border rounded-md transition-all text-foreground"
                  aria-label="Jump to page"
                />
                <span className="text-sm font-medium text-muted-foreground">
                  of {totalPages}
                </span>
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="p-3.5 rounded-full border border-border/80 bg-background hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
                aria-label="Next Page"
              >
                <ChevronRight className="w-5 h-5 text-foreground" />
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-border p-10 text-center flex flex-col items-center shadow-sm">
            <FileText className="w-12 h-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-lg">
              No blogs match your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
