import { Link } from "react-router-dom";
import { Clock, User } from "lucide-react";

export default function BlogCard({ post }) {
  const imageUrl =
    post.imageUrl ||
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2670&auto=format&fit=crop";
  const dateStr = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Jan 1, 2024";

  return (
    <Link to={`/post/${post._id}`} className="group block h-full">
      <article className="glass-card rounded-2xl overflow-hidden flex flex-col h-full bg-card">
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={imageUrl}
            alt={post.title}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-3 font-medium">
            <span className="flex items-center bg-secondary/50 px-2 py-1 rounded-full">
              <Clock className="w-3 h-3 mr-1" /> {dateStr}
            </span>
            <span className="flex items-center">
              <User className="w-3 h-3 mr-1" />{" "}
              {post.author?.name || "Anonymous"}
            </span>
          </div>

          <h3 className="text-xl font-heading font-semibold pb-2 line-clamp-2 mix-blend-normal group-hover:text-primary transition-colors">
            {post.title}
          </h3>

          <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-grow">
            {post.content}
          </p>

          <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
            <span className="text-primary text-sm font-medium flex items-center group-hover:underline underline-offset-4">
              Read article &rarr;
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
