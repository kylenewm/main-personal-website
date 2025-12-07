// Vector search using OpenAI embeddings
// Simple in-memory implementation - can upgrade to Pinecone/Weaviate later

import { KnowledgeChunk, getAllChunks } from "./knowledge-segments";

// Cache for embeddings (generated on first search)
let embeddingsCache: Map<string, number[]> | null = null;
let isGeneratingEmbeddings = false;

// Cosine similarity between two vectors
function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Generate embedding for a single text
async function generateEmbedding(text: string, apiKey: string): Promise<number[]> {
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "text-embedding-3-small",
      input: text,
    }),
  });

  if (!response.ok) {
    throw new Error(`Embedding API error: ${response.status}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

// Initialize embeddings cache for all knowledge chunks
async function initializeEmbeddings(apiKey: string): Promise<void> {
  if (embeddingsCache || isGeneratingEmbeddings) return;
  
  isGeneratingEmbeddings = true;
  embeddingsCache = new Map();
  
  const allChunks = getAllChunks();
  console.log("Generating embeddings for knowledge base...");
  
  for (const chunk of allChunks) {
    const textToEmbed = `${chunk.subcategory}: ${chunk.content}`;
    const embedding = await generateEmbedding(textToEmbed, apiKey);
    embeddingsCache.set(chunk.id, embedding);
  }
  
  console.log(`Generated embeddings for ${allChunks.length} chunks`);
  isGeneratingEmbeddings = false;
}

// Search interface
export interface SearchResult {
  chunk: KnowledgeChunk;
  score: number;
}

// Search knowledge base
export async function searchKnowledge(
  query: string,
  apiKey: string,
  options?: {
    category?: KnowledgeChunk["category"];
    limit?: number;
    minScore?: number;
  }
): Promise<SearchResult[]> {
  const { category, limit = 3, minScore = 0.3 } = options || {};

  // Initialize embeddings if needed
  await initializeEmbeddings(apiKey);
  
  if (!embeddingsCache) {
    throw new Error("Embeddings not initialized");
  }

  // Generate query embedding
  const queryEmbedding = await generateEmbedding(query, apiKey);

  // Filter chunks by category if specified
  const allChunks = getAllChunks();
  const chunksToSearch = category
    ? allChunks.filter((c) => c.category === category)
    : allChunks;

  // Calculate similarity scores
  const results: SearchResult[] = [];
  
  for (const chunk of chunksToSearch) {
    const chunkEmbedding = embeddingsCache.get(chunk.id);
    if (!chunkEmbedding) continue;
    
    const score = cosineSimilarity(queryEmbedding, chunkEmbedding);
    
    if (score >= minScore) {
      results.push({ chunk, score });
    }
  }

  // Sort by score (highest first), then by priority (lower = more important)
  // Priority weighting: boost high-priority results slightly in the scoring
  results.sort((a, b) => {
    // Get priority (default to 5 if not set)
    const priorityA = a.chunk.priority || 5;
    const priorityB = b.chunk.priority || 5;
    
    // Adjust score by priority: lower priority number gets a small nudge
    // Minimal boost (0.01 per level) - just enough to break ties, not override intent
    const adjustedScoreA = a.score + (5 - priorityA) * 0.01;
    const adjustedScoreB = b.score + (5 - priorityB) * 0.01;
    
    return adjustedScoreB - adjustedScoreA;
  });
  return results.slice(0, limit);
}

// Simple keyword-based fallback search (doesn't require API key)
export function searchByKeywords(
  query: string,
  category?: KnowledgeChunk["category"]
): KnowledgeChunk[] {
  const queryWords = query.toLowerCase().split(/\s+/);
  
  const allChunks = getAllChunks();
  const chunksToSearch = category
    ? allChunks.filter((c) => c.category === category)
    : allChunks;

  // Score each chunk by keyword matches
  const scored = chunksToSearch.map((chunk) => {
    let score = 0;
    
    for (const word of queryWords) {
      // Check keywords
      if (chunk.keywords.some((kw) => kw.includes(word))) {
        score += 2;
      }
      // Check content
      if (chunk.content.toLowerCase().includes(word)) {
        score += 1;
      }
    }
    
    return { chunk, score };
  });

  // Filter and sort by score, then by priority (lower = more important)
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => {
      // Primary: sort by keyword score
      if (b.score !== a.score) return b.score - a.score;
      // Secondary: sort by priority (lower number = higher importance)
      const priorityA = a.chunk.priority || 5;
      const priorityB = b.chunk.priority || 5;
      return priorityA - priorityB;
    })
    .slice(0, 3)
    .map((s) => s.chunk);
}

// Format search results for the AI response
export function formatSearchResults(results: SearchResult[]): string {
  if (results.length === 0) {
    return "No specific information found on that topic.";
  }

  return results
    .map((r) => r.chunk.content)
    .join("\n\n");
}

