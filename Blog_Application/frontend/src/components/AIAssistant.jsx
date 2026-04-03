import { useState, useRef } from 'react';
import axios from 'axios';
import axiosInstance from '../services/axiosInstance';

export default function AIAssistant({ 
  title, setTitle, 
  content, setContent, 
  tags, setTags 
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTask, setActiveTask] = useState("");
  const [error, setError] = useState("");
  const abortControllerRef = useRef(null);

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleAIRequest = async (type) => {
    let finalInstruction = "Process this request adhering strictly to the system rules format.";

    if (type === 'full_generate' && !title && (!content || content.trim() === '')) {
      const topic = window.prompt("What topic would you like the blog to be about? (e.g., Education, Lifestyle, Technology)");
      if (!topic) return; // Cancel if user didn't enter anything
      finalInstruction = `Generate a complete, engaging blog post specifically about: ${topic}.`;
    }

    setIsLoading(true);
    setActiveTask(type);
    setError("");

    abortControllerRef.current = new AbortController();

    try {
      const response = await axiosInstance.post('/ai', {
        type,
        title,
        content,
        instruction: finalInstruction
      }, {
        signal: abortControllerRef.current.signal
      });

      const data = response.data;
      if (data && data.type) {
        switch(data.type) {
          case 'correct_content':
          case 'improve_content':
          case 'suggest_summary':
            if (data.result) setContent(data.result);
            break;
          case 'full_generate':
            if (data.result) setContent(data.result);
            if (data.title && setTitle) setTitle(data.title);
            if (data.tags && setTags) {
              if (Array.isArray(data.tags)) setTags(data.tags.join(', '));
              else if (typeof data.tags === 'string') setTags(data.tags);
            }
            break;
          case 'suggest_tags':
            if (Array.isArray(data.result)) {
              setTags(data.result.join(', '));
            } else if (typeof data.result === 'string') {
              setTags(data.result);
            }
            break;
          case 'suggest_title':
            if (data.result) setTitle(data.result);
            break;
          default:
            console.log("Unknown AI response format check data:", data);
        }
      }
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log("Request canceled by user");
        setError("AI generation was stopped.");
      } else {
        console.error("AI Request Failed", err);
        setError(err.response?.data?.message || err.message || "Failed to communicate with AI");
      }
    } finally {
      setIsLoading(false);
      setActiveTask("");
    }
  };

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-primary">AI Assistant</h3>
        </div>
        {isLoading && (
          <Button 
            type="button" 
            variant="destructive" 
            size="sm"
            onClick={handleStop}
          >
            <XCircle className="w-4 h-4 mr-2"/>
            Stop
          </Button>
        )}
      </div>
      
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20 animate-fade-in">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Button 
          type="button" 
          variant="secondary" 
          size="sm" 
          disabled={isLoading}
          onClick={() => handleAIRequest('correct_content')}
        >
          {isLoading && activeTask === 'correct_content' ? <span className="custom-loader w-4 h-4 mr-2" /> : <CheckCircle className="w-4 h-4 mr-2"/>}
          Fix Grammar
        </Button>
        <Button 
          type="button" 
          variant="secondary" 
          size="sm"
          disabled={isLoading}
          onClick={() => handleAIRequest('improve_content')}
        >
          {isLoading && activeTask === 'improve_content' ? <span className="custom-loader w-4 h-4 mr-2" /> : <FileText className="w-4 h-4 mr-2"/>}
          Improve Content
        </Button>
        <Button 
          type="button" 
          variant="secondary" 
          size="sm"
          disabled={isLoading}
          onClick={() => handleAIRequest('suggest_tags')}
        >
          {isLoading && activeTask === 'suggest_tags' ? <span className="custom-loader w-4 h-4 mr-2" /> : <Tag className="w-4 h-4 mr-2"/>}
          Suggest Tags
        </Button>
        <Button 
          type="button" 
          variant="secondary" 
          size="sm"
          disabled={isLoading}
          onClick={() => handleAIRequest('suggest_title')}
        >
          {isLoading && activeTask === 'suggest_title' ? <span className="custom-loader w-4 h-4 mr-2" /> : <Type className="w-4 h-4 mr-2"/>}
          Suggest Title
        </Button>
        <Button 
          type="button" 
          variant="default" 
          size="sm"
          disabled={isLoading}
          onClick={() => handleAIRequest('full_generate')}
        >
          {isLoading && activeTask === 'full_generate' ? <span className="custom-loader w-4 h-4 mr-2" /> : <Wand2 className="w-4 h-4 mr-2"/>}
          Generate Complete Blog
        </Button>
      </div>
    </div>
  );
}
