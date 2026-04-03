import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Rss, PenLine, ArrowRight } from "lucide-react";
import BlogCard from "../components/BlogCard";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        // Fetch front page posts - limit to 4
        const res = await axios.get(`${apiUrl}/api/posts?page=1&limit=4`);
        setPosts(res.data.data || []);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const featuredPost = posts[0];
  const recentPosts = posts.slice(1, 4);

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 font-sans">
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Full-Screen Readable Hero Section */}
        <section className="min-h-[calc(100vh-80px)] relative text-center flex flex-col items-center justify-center animate-fade-in-up">
          <div className="max-w-5xl mx-auto -mt-16 sm:-mt-20 px-2 lg:px-0">
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-heading font-extrabold tracking-tight text-foreground mb-6 leading-[1.1]">
              The <span className="text-gradient">BlogVerse</span>
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground w-full mx-auto max-w-3xl leading-relaxed mb-10 font-medium">
              Discover stories, thinking, and expertise from writers on any
              topic. A clean, transparent space to read, write, and deepen your
              understanding.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto px-4 sm:px-0">
              <Link
                to="/blogs"
                className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-primary-foreground bg-primary rounded-full hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                Start reading
                <Rss className="ml-2 w-5 h-5 opacity-90" />
              </Link>
              <Link
                to="/create"
                className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-foreground bg-secondary/40 border border-border rounded-full hover:bg-secondary transition-all hover:-translate-y-0.5 shadow-sm"
              >
                Write a story
                <PenLine className="ml-2 w-5 h-5 opacity-70" />
              </Link>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="custom-loader w-8 h-8 text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="p-6 bg-destructive/10 text-destructive rounded-xl text-center font-medium max-w-lg mx-auto border border-destructive/20">
            {error}
          </div>
        ) : posts.length === 0 ? (
          <div className="py-24 text-center text-muted-foreground text-lg border-2 border-dashed border-border/50 rounded-3xl mx-auto max-w-3xl">
            No stories published yet. Be the first to start writing!
          </div>
        ) : (
          <div className="space-y-16 animate-fade-in mx-auto w-full min-h-[calc(100vh-80px)] flex flex-col justify-center py-10">
            {/* Featured Post - highly readable layout */}
            {featuredPost && (
              <section className="mb-16">
                <Link
                  to={`/post/${featuredPost._id}`}
                  className="group block focus:outline-none focus:ring-2 focus:ring-primary rounded-3xl"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] bg-secondary/20 shadow-sm group-hover:shadow-md transition-shadow duration-300 w-full border border-border/40">
                      <img
                        src={
                          featuredPost.imageUrl ||
                          "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2670&auto=format&fit=crop"
                        }
                        alt={featuredPost.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-in-out"
                        loading="eager"
                      />
                    </div>
                    <div className="flex flex-col justify-center space-y-5 lg:pr-8 py-4">
                      <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-muted-foreground">
                        <span className="flex items-center space-x-2 bg-secondary/40 px-3 py-1.5 rounded-full">
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-[10px] uppercase">
                            {featuredPost.author?.name
                              ? featuredPost.author.name.charAt(0)
                              : "A"}
                          </div>
                          <span className="text-foreground/80">
                            {featuredPost.author?.name || "Anonymous"}
                          </span>
                        </span>
                        <span>•</span>
                        <time dateTime={featuredPost.createdAt}>
                          {featuredPost.createdAt
                            ? new Date(
                                featuredPost.createdAt,
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "Jan 1, 2024"}
                        </time>
                      </div>
                      <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors leading-[1.15] line-clamp-3">
                        {featuredPost.title}
                      </h2>
                      <p className="text-lg text-muted-foreground line-clamp-3 leading-relaxed">
                        {featuredPost.content}
                      </p>
                      <div className="pt-2 text-primary font-semibold hover:underline flex items-center underline-offset-4">
                        Read full story{" "}
                        <ArrowRight className="w-4 h-4 ml-1.5" />
                      </div>
                    </div>
                  </div>
                </Link>
              </section>
            )}

            {/* Recent Posts Grid */}
            {recentPosts.length > 0 && (
              <section className="border-t border-border/50 pt-16">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 space-y-3 sm:space-y-0">
                  <h3 className="text-2xl font-bold tracking-tight text-foreground">
                    Latest thinking
                  </h3>
                  <Link
                    to="/blogs"
                    className="text-sm font-semibold text-primary/80 hover:text-primary bg-primary/10 hover:bg-primary/15 px-4 py-2 rounded-full transition-colors flex items-center"
                  >
                    See all posts <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                  {recentPosts.map((post) => (
                    <BlogCard key={post._id} post={post} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
