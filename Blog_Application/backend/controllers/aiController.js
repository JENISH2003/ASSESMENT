const axios = require('axios');

exports.generateAIResponse = async (req, res) => {
  try {
    const { type, content, title, instruction } = req.body;

    const RAW_CATEGORIES = [
      "Technology", "Programming", "Lifestyle", "Health", "Business", "Travel", "Food", 
      "Fashion", "Fitness", "Education", "Finance", "Entertainment", "Sports", "Music", 
      "Art", "Photography", "Science"
    ];

    let systemPrompt = "";
    let userPrompt = "";

    if (type === 'suggest_tags') {
      systemPrompt = `You are a tag suggestion system for a blog application.

Your job is to suggest relevant tags ONLY from the provided categories list based on the user's blog title and/or content.

STRICT RULES:
- Analyze the underlying meaning and concepts. Ignore typos or spelling errors (e.g., "schhol" means "school" -> map to "Education").
- Use ONLY the categories provided. Do NOT create new tags.
- Do NOT generate any extra words or explanations.
- Return ONLY the tags.
- Maximum 1 tags.

- If none are relevant, return an empty array: []
- Tags must exactly match the category names (case-sensitive).
- Output MUST be a valid JSON object in this exact format:
{
  "tags": ["tag1", "tag2"]
}`;

      userPrompt = `
Title: ${title || 'N/A'}
Content: ${content || 'N/A'}
Categories: ${RAW_CATEGORIES.join(', ')}
`;
    } else {
      systemPrompt = `You are an AI assistant inside a blog writing application.
Your job is to help the user improve ONLY the part they request.
STRICT RULES:
* Do NOT modify anything unless the user explicitly asks.
* Do NOT rewrite full blog unless user asks.
* Do NOT touch images or media.
* Always return response in JSON format.
* Be precise and minimal.

USER REQUEST TYPES:
1. "correct_content" → Fix grammar, spelling, clarity only
2. "improve_content" → Improve readability and engagement
3. "suggest_title" → Suggest better titles
4. "suggest_summary" → Generate short summary
5. "full_generate" → Generate complete but concise short blog post (max 200-250 words) including an engaging title, content, and an array of relevant tags (max 2) strictly chosen from: ${RAW_CATEGORIES.join(', ')}.

OUTPUT FORMAT:
{
"type": "<request_type>",
"title": "<Only include if type is full_generate>",
"tags": ["<tag1>", "<tag2>"], 
"result": "<Your generated content or modifications>"
}

SPECIAL RULES:
* If correcting → return ONLY corrected content
* For full_generate, make the result well-structured with markdown headings and paragraphs.
* No explanation text`;

      userPrompt = `
Type of request: ${type}
Current Title: ${title || 'N/A'}
Instruction: ${instruction || "Perform the requested action based on type"}
Current Content: ${content || 'N/A'}
`;
    }

    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'phi3',
      prompt: `${systemPrompt}\n\nUser Request:\n${userPrompt}`,
      stream: false,
      format: 'json'
    });

    const aiRes = response.data.response;
    
    // Attempt to parse JSON strictly
    let parsedResult;
    try {
      parsedResult = JSON.parse(aiRes);
      
      // Robustly extract tags and wrap for the frontend
      if (type === 'suggest_tags') {
        let extractedTags = [];
        if (Array.isArray(parsedResult)) {
          extractedTags = parsedResult;
        } else if (parsedResult.tags && Array.isArray(parsedResult.tags)) {
          extractedTags = parsedResult.tags;
        } else if (parsedResult.result && Array.isArray(parsedResult.result)) {
          extractedTags = parsedResult.result;
        }
        
        parsedResult = {
          type: 'suggest_tags',
          result: extractedTags
        };
      }
    } catch (parseError) {
      // safe fallback if JSON parse fails
      return res.status(500).json({ error: "Invalid JSON from AI", raw: aiRes });
    }

    res.status(200).json(parsedResult);
  } catch (error) {
    console.error("AI Generation error: ", error);
    res.status(500).json({ error: "Failed to communicate with AI", message: error.message });
  }
};
