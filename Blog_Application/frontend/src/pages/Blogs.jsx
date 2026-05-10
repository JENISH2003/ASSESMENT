import { useState, useEffect, useMemo } from "react";

import axiosInstance from "../services/axiosInstance";
import { Link } from "react-router-dom";
import {
  X,
  Search,
  Menu,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import BlogCard from "../components/BlogCard";
import Loader from "../components/ui/Loader";

const RAW_CATEGORIES = [
  "Technology",
  "Programming",
  "Lifestyle",
  "Health",
  "Business",
  "Travel",
  "Food",
  "Fashion",
  "Fitness",
  "Education",
  "Finance",
  "Entertainment",
  "Sports",
  "Music",
  "Art",
  "Photography",
  "Science",
];


export default function Blogs() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [tagFilter, setTagFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        let endpoint = `/posts?page=${currentPage}&limit=18`;

        if (searchTerm) endpoint += `&search=${searchTerm}`;
        if (tagFilter && tagFilter !== "all") endpoint += `&tag=${tagFilter}`;

        const res = await axiosInstance.get(endpoint);

        setPosts(res.data.data || []);
        if (res.data.meta) {
          setTotalPages(res.data.meta.totalPages);
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts.");
      } finally {
        setLoading(false);
      }
    };

    if (searchTerm) {
      const delayFetch = setTimeout(() => fetchPosts(), 300);
      return () => clearTimeout(delayFetch);
    } else {
      fetchPosts();
    }
  }, [searchTerm, tagFilter, currentPage]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setTagFilter("all");
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleJumpToPage = (e) => {
    const page = parseInt(e.target.value);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };


  const UNIQUE_CATEGORIES = useMemo(
    () => ["all", ...Array.from(new Set(RAW_CATEGORIES))],
    [],
  );

  const filteredCategories = useMemo(() => {
    return UNIQUE_CATEGORIES.filter((cat) =>
      cat.toLowerCase().includes(categorySearchTerm.toLowerCase()),
    );
  }, [UNIQUE_CATEGORIES, categorySearchTerm]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div
      id="blogs-page-layout"
      className="flex flex-col md:flex-row pb-24 pt-8 md:pt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:gap-8 overflow-hidden"
    >
      {/* L E F T   S I D E B A R */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-white/90 dark:bg-black/90 backdrop-blur-xl border-r border-border/50 transform transition-all duration-300 ease-in-out md:relative md:bg-transparent md:border-none md:flex md:flex-col ${isSidebarOpen ? "translate-x-0 md:w-64 md:opacity-100" : "-translate-x-full md:w-0 md:opacity-0 md:overflow-hidden"}`}
      >
        <div
          className={`blogs-sidebar-inner p-6 md:p-0 flex flex-col h-full md:sticky md:top-24 transition-opacity duration-300 ${!isSidebarOpen && "md:opacity-0"}`}
        >
          <div className="flex justify-between items-center md:hidden mb-6">
            <span className="font-bold text-lg text-gradient">Categories</span>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 bg-secondary/50 rounded-full hover:bg-secondary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-6 relative z-10 pb-2 flex-shrink-0">
            <h3 className="text-lg font-bold mb-4 hidden md:block">
              Categories
            </h3>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Find category..."
                value={categorySearchTerm}
                onChange={(e) => setCategorySearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-secondary/30 border border-border/50 rounded-xl text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-medium shadow-sm hover:bg-secondary/50"
              />
              {categorySearchTerm && (
                <button
                  onClick={() => setCategorySearchTerm("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 overflow-y-auto hide-scrollbar space-y-1.5 pr-2 pb-20 md:pb-6"
          >
            {filteredCategories.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No categories found
              </p>
            ) : (
              filteredCategories.map((cat) => (
                <motion.button
                  variants={itemVariants}
                  key={cat}
                  onClick={() => {
                    setTagFilter(cat);
                    setCurrentPage(1);
                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between group whitespace-nowrap ${
                    tagFilter === cat
                      ? "bg-primary text-primary-foreground shadow-md blogs-cat-btn-active"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground blogs-cat-btn-hover"
                  }`}
                >
                  <span className="capitalize truncate pr-2 flex items-center gap-2">
                    {cat === "all" ? "All Posts" : cat}
                  </span>
                  {tagFilter === cat && (
                    <motion.div
                      layoutId="active-indicator"
                      className="w-1.5 h-1.5 rounded-full bg-primary-foreground flex-shrink-0"
                    />
                  )}
                </motion.button>
              ))
            )}
          </motion.div>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* M A I N   C O N T E N T */}
      <section className="flex-1 min-w-0 relative z-20 transition-all duration-300">
        {/* Top Controls Bar */}
        <div className="flex gap-4 items-center mb-8 w-full z-20 relative">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-3 bg-secondary text-foreground shadow-sm hover:bg-secondary/80 rounded-xl border border-border/50 transition-all active:scale-95 flex-shrink-0"
            aria-label="Toggle Categories"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="relative group w-full max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              className="w-full pl-12 pr-12 py-3 bg-background/60 border border-border/50 rounded-xl text-base focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all hover:bg-secondary/20 shadow-sm glass"
              placeholder="Search articles, topics, or keywords..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <div className="bg-secondary/50 rounded-full p-1 hover:bg-secondary transition-colors">
                  <X className="w-3.5 h-3.5" />
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader
              size="lg"
              className="text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.3)]"
            />
            <p className="text-muted-foreground font-medium tracking-wide">
              Searching our archives...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-destructive/5 rounded-3xl border border-destructive/20 text-destructive shadow-sm max-w-2xl mx-auto">
            <p className="font-semibold text-lg">{error}</p>
          </div>
        ) : posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24 glass rounded-3xl border border-border/50 max-w-2xl mx-auto shadow-sm"
          >
            <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-2xl font-heading font-bold mb-3">
              No stories found
            </h3>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              We couldn't find any articles matching your current search and
              filters. Try adjusting your search criteria.
            </p>
            {(searchTerm || tagFilter !== "all") && (
              <button
                onClick={clearFilters}
                className="px-8 py-3.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full text-sm font-semibold transition-all shadow-md active:scale-95"
              >
                Clear all filters
              </button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-12 transition-all duration-300">
            <motion.div
              layout
              className={`grid grid-cols-1 gap-x-8 gap-y-12 transition-all duration-300 ${
                isSidebarOpen
                  ? "md:grid-cols-2 lg:grid-cols-2"
                  : "md:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              <AnimatePresence mode="popLayout">
                {posts.map((post, index) => (
                  <motion.div
                    key={post._id}
                    layout
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                      transition: { duration: 0.2 },
                    }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.05,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    whileHover={{ y: -8 }}
                    className="h-full"
                  >
                    <BlogCard post={post} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination Section */}
            <div className="flex justify-center items-center pt-10 border-t border-border/40 space-x-2 animate-fade-in relative z-20">
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
        )}
      </section>
    </div>
  );
}
