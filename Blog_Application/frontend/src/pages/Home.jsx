import { useState, useEffect } from "react";

import axiosInstance from "../services/axiosInstance";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Code,
  ExternalLink,
  Activity,
  BookOpen,
  Layers,
  Rss,
  PenLine,
} from "lucide-react";
import BlogCard from "../components/BlogCard";
import Loader from "../components/ui/Loader";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        // Fetch front page posts - limit to 4
        const res = await axiosInstance.get(`/posts?page=1&limit=4`);
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

  const latestPosts = posts.slice(0, 3);

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

        {/* About platform CTA Section (Always visible) */}
        <section className="mb-20 mt-8 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="relative aspect-square sm:aspect-video lg:aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl border border-border/50 group">
              <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10 group-hover:bg-transparent transition-colors duration-700 pointer-events-none" />
              <img
                src="/images/home-hero.jpg"
                alt="Creative team collaborating"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 pointer-events-none" />
            </div>

            <div className="flex flex-col justify-center space-y-6 lg:pl-4">
              <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold w-max shadow-sm">
                <Sparkles className="w-4 h-4" />
                <span>Discover Our Story</span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-foreground leading-[1.15]">
                Where great minds{" "}
                <span className="text-gradient">come to write.</span>
              </h2>

              <p className="text-xl text-muted-foreground leading-relaxed">
                We believe that every person has a story worth telling. Our
                platform provides a beautifully crafted, distraction-free
                environment designed to help you share your knowledge,
                connect with readers, and grow a dedicated audience.
              </p>

              <div className="pt-4">
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-primary-foreground bg-primary rounded-2xl hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
                >
                  Read full story
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader size="md" className="text-muted-foreground" />
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
          <div className="space-y-16 animate-fade-in mx-auto w-full flex flex-col justify-center pb-10">
            {/* Recent Posts Grid */}
            {latestPosts.length > 0 && (
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
                  {latestPosts.map((post) => (
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
