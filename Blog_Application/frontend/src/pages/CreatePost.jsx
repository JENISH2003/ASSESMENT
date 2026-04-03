import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import ErrorMessage from "../components/ui/ErrorMessage";
import Loader from "../components/ui/Loader";
import PageHeader from "../components/ui/PageHeader";
import AIAssistant from "../components/AIAssistant";
import { PenTool, Tag, Image as ImageIcon, Send } from "lucide-react";

export default function CreatePost() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Need to be logged in to create post
  if (!user) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="text-muted-foreground mb-6">You must be logged in to create a post.</p>
        <Button onClick={() => navigate("/login")}>Go to Login</Button>
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      setError("Title and content are required.");
      return;
    }
    
    setIsLoading(true);
    setError("");

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      
      // Parse tags
      if (tags) {
        const tagArray = tags.split(",").map(t => t.trim()).filter(Boolean);
        tagArray.forEach(t => formData.append("tags[]", t));
      }
      
      if (image) {
        formData.append("image", image);
      }

      await axios.post(`${apiUrl}/api/posts`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${user.token}`
        },
        withCredentials: true
      });
      
      navigate("/");
    } catch (err) {
      console.error("Error creating post:", err);
      setError(err.response?.data?.message || "Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 animate-fade-in relative z-10">
      <div className="glass-card p-8 md:p-12 rounded-[2rem]">
        <PageHeader 
          title="Create New Post" 
          subtitle="Share your thoughts with the world" 
          icon={PenTool} 
        />

        <ErrorMessage message={error} />

        <AIAssistant 
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          tags={tags}
          setTags={setTags}
        />

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
            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1 flex items-center"><Tag className="w-4 h-4 mr-1"/> Tags (comma separated)</label>
              <Input
                type="text"
                placeholder="tech, lifestyle, coding..."
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="bg-background/50"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1 flex items-center"><ImageIcon className="w-4 h-4 mr-1"/> Cover Image</label>
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
            <Button type="button" variant="ghost" onClick={() => navigate("/")}>
              Cancel
            </Button>
            <Button type="submit" className="min-w-[120px]" disabled={isLoading}>
              {isLoading ? (
                <Loader size="sm" />
              ) : (
                <>Publish <Send className="w-4 h-4 ml-2" /></>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
