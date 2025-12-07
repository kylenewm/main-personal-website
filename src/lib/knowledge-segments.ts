// Segmented knowledge base for RAG and voice assistant
// Each segment contains structured information for more precise retrieval

export interface KnowledgeChunk {
  id: string;
  category: "professional" | "education" | "personal" | "meta" | "projects";
  subcategory: string;
  content: string;
  keywords: string[];
  priority?: 1 | 2 | 3 | 4 | 5; // 1=PM role, 2=Associate DS, 3=Personal projects, 4=Analyst work, 5=Education/Other
}

export const knowledgeSegments: KnowledgeChunk[] = [
  // ============== PROFESSIONAL ==============
  // Note: Career history covered in detail in interview-chunks.ts
  
  {
    id: "prof-skills",
    category: "professional",
    subcategory: "skills",
    content: `My technical skills include:
- AI/ML: Conversational AI, LLMs, Prompt Engineering, Speech-to-Speech models, ASR/TTS, Agentic workflows
- Product: Product Strategy, Roadmap Execution, Cross-functional Leadership, KPI Definition
- Technical: Python, SQL, Data Pipelines, Tableau, ML Personalization, Reinforcement Learning
- Domain expertise in enterprise AI, virtual agents, and latency optimization`,
    keywords: ["skills", "technical", "python", "sql", "llm", "ai", "ml", "machine learning", "good at"],
  },
  {
    id: "prof-projects-slack",
    category: "professional",
    subcategory: "projects",
    content: `I built the Slack Intelligence Suite - a system that intelligently prioritizes daily Slack messages using weighted scoring with LLMs.
It surfaces key items in real-time while batching lower-priority messages for periodic review.
I also engineered a pipeline that creates Notion tasks and research-backed Jira tickets using AI web search.
You can find it on my GitHub at github.com/kylenewm/slack-intelligence`,
    keywords: ["slack", "project", "intelligence", "notion", "jira", "github", "built", "side project"],
  },
  {
    id: "prof-projects-briefing",
    category: "professional",
    subcategory: "projects",
    content: `I created an AI-Powered Morning Briefing System that automates daily AI briefings.
It reduces weekly content consumption from hours to 10-minute daily digests by orchestrating multi-agent search, podcast transcription, and content evaluation across multiple sources.
I designed the agentic architecture and LLM-based evaluation pipeline to filter out noise from newsletters and search results.
Check it out at github.com/kylenewm/ai-morning-briefing`,
    keywords: ["morning", "briefing", "project", "podcast", "newsletter", "automation", "github", "agent"],
  },

  // ============== EDUCATION ==============
  // Note: Education covered in detail in interview-chunks.ts (education-cu-boulder)

  // ============== PERSONAL ==============
  // Note: Hobbies/interests covered in detail in interview-chunks.ts (personal-hobbies-*)
  
  {
    id: "personal-location",
    category: "personal",
    subcategory: "location",
    content: `I'm based in New York, NY. I enjoy the energy of the city, how much there is to do that is so close by, and the professional community here where I am surrounded by so many other driven people.`,
    keywords: ["location", "live", "based", "where", "city", "new york", "nyc"],
  },

  // ============== META ==============
  // Note: "looking for" content removed - can be discussed in direct conversation
  
  {
    id: "meta-availability",
    category: "meta",
    subcategory: "availability",
    content: `The best way to reach me is messaging me on LinkedIn or email. You can also just say to the assistant you'd like to connect and leave a message.
My email is at kylenewman1214@gmail.com and LinkedIn is linkedin.com/in/kylenewman2023.
I typically respond within 24 hours.`,
    keywords: ["contact", "reach", "email", "linkedin", "connect", "schedule", "availability", "talk"],
  },
  {
    id: "meta-response-time",
    category: "meta",
    subcategory: "availability",
    content: `I try to respond to all inquiries within 24 hours.`,
    keywords: ["response", "time", "fast", "urgent", "quickly", "when"],
  },
];

// Import interview chunks (auto-generated from transcripts)
// Source: data/processed/clean_transcript.txt
import { interviewChunks } from "./interview-chunks";

// Convert interview chunks to KnowledgeChunk format
const interviewKnowledge: KnowledgeChunk[] = interviewChunks.map(chunk => ({
  id: chunk.id,
  category: chunk.category as KnowledgeChunk["category"],
  subcategory: chunk.topic.toLowerCase().replace(/\s+/g, "_").slice(0, 30),
  content: chunk.content,
  keywords: [], // Not needed with embeddings
  priority: chunk.priority,
}));

// Combined knowledge base
const allKnowledge = [...knowledgeSegments, ...interviewKnowledge];

// Helper function to get all chunks for a category
export function getChunksByCategory(category: KnowledgeChunk["category"]): KnowledgeChunk[] {
  return allKnowledge.filter((chunk) => chunk.category === category);
}

// Helper function to get all chunks
export function getAllChunks(): KnowledgeChunk[] {
  return allKnowledge;
}

// Get a summary of Kyle's background (for system prompt context)
export function getBackgroundSummary(): string {
  return `Kyle is an AI Product Manager at Red Ventures, leading the Conversational AI experience on Compass—a sales center transformation platform. He has a Master's in Data Science from CU Boulder and is based in New York. He focuses on building AI products at scale and is currently leading R&D efforts for next-generation voice AI.`;
}

