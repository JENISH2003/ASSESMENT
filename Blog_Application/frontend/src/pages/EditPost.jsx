import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../services/axiosInstance";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import ErrorMessage from "../components/ui/ErrorMessage";
import Loader from "../components/ui/Loader";
import PageHeader from "../components/ui/PageHeader";

import { PenTool, Tag, Image as ImageIcon, CheckCircle, X } from "lucide-react";

const ALLOWED_TAGS = [
  "Business", "Education", "Entertainment", "Fashion", "Finance", 
  "Fitness", "Food", "Gaming", "Health", "Lifestyle", 
  "Programming", "Science", "Sports", "Technology", "Travel"
];

export default function EditPost() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axiosInstance.get(`/posts/${id}`);
        const post = res.data.data;
        setTitle(post.title || "");
        setContent(post.content || "");
        if (post.tags && post.tags.length > 0) {
          setTags(post.tags.join(", "));
        }
        if (post.imageUrl) {
          setImagePreview(post.imageUrl);
        } else {
          setImagePreview("/images/post-default.jpg");
        }
      } catch (err) {
        console.error("Error fetching post to edit:", err);
        setError("Failed to fetch post. It may have been deleted or you don't have permission.");
      } finally {
        setIsFetching(false);
      }
    };
    if (user) {
      fetchPost();
    }
  }, [id, user]);

  if (!user) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="text-muted-foreground mb-6">You must be logged in to edit a post.</p>
        <Button onClick={() => navigate("/login")}>Go to Login</Button>
      </div>
    );
  }

  if (isFetching) {
    return (
      <div className="flex justify-center py-20">
        <Loader size="xl" className="text-primary" />
      </div>
    );
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleTagToggle = (tag) => {
    let currentTags = tags ? tags.split(",").map(t => t.trim().toLowerCase()).filter(Boolean) : [];
    const lowerTag = tag.toLowerCase();
    
    if (currentTags.includes(lowerTag)) {
      currentTags = currentTags.filter(t => t !== lowerTag);
    } else {
      currentTags.push(lowerTag);
    }
    
    // Convert back to Pascal Case for visual aesthetic in input
    const formattedTags = currentTags.map(t => {
      const original = ALLOWED_TAGS.find(at => at.toLowerCase() === t);
      return original || t; // fallback to lowercase if somehow custom
    });
    
    setTags(formattedTags.join(", "));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      setError("Title and content are required.");
      return;
    }
    
    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      
      if (tags) {
        const tagArray = tags.split(",").map(t => t.trim()).filter(Boolean);
        tagArray.forEach(t => formData.append("tags[]", t));
      }
      
      if (image) {
        formData.append("image", image);
      }

      await axiosInstance.patch(`/posts/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      
      navigate(`/post/${id}`);
    } catch (err) {
      console.error("Error updating post:", err);
      setError(err.response?.data?.message || "Failed to update post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 animate-fade-in relative z-10">
      <div className="glass-card p-8 md:p-12 rounded-[2rem]">
        <PageHeader 
          title="Edit Post" 
          subtitle="Make changes to your article..." 
          icon={PenTool} 
        />

        <ErrorMessage message={error} />



        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold ml-1">Title</label>
            <Input
              type="text"
              placeholder="Give your post a striking title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-14 text-lg font-medium px-4 bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold ml-1">Content</label>
            <textarea
              placeholder="What's on your mind?..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="flex w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-none"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3 md:col-span-2 border border-border/50 p-6 rounded-2xl bg-secondary/5 relative">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold ml-1 flex items-center">
                  <Tag className="w-4 h-4 mr-1"/> Select Categories (Tags)
                </label>
                {tags && (
                  <button 
                    type="button" 
                    onClick={() => setTags("")} 
                    className="text-xs font-semibold text-muted-foreground hover:text-destructive flex items-center transition-colors bg-background px-2.5 py-1 rounded-full border border-border hover:border-destructive/30"
                  >
                    <X className="w-3 h-3 mr-1" /> Clear All
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
                {ALLOWED_TAGS.map(tag => {
                  const currentTags = tags ? tags.split(",").map(t => t.trim().toLowerCase()) : [];
                  const isSelected = currentTags.includes(tag.toLowerCase());
                  
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagToggle(tag)}
                      className={`w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 duration-200 border text-center ${
                        isSelected 
                          ? "bg-primary/15 text-primary border-primary shadow-sm"
                          : "bg-background text-muted-foreground hover:bg-secondary/80 hover:text-foreground border-border/70 hover:border-primary/30"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold ml-1 flex items-center"><ImageIcon className="w-4 h-4 mr-1"/> Cover Image (optional)</label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="bg-background/50 pt-2"
              />
            </div>
          </div>

          {imagePreview && (
            <div className="mt-4 relative rounded-xl overflow-hidden aspect-video border border-border">
              <img src={imagePreview} alt="Preview" className="object-cover w-full h-full" />
            </div>
          )}

          <div className="pt-6 flex justify-end space-x-4">
            <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" className="min-w-[120px]" disabled={isLoading}>
              {isLoading ? (
                <Loader size="sm" />
              ) : (
                <>Save Changes <CheckCircle className="w-4 h-4 ml-2" /></>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
