import { NextRequest, NextResponse } from "next/server";
import { searchKnowledge, searchByKeywords, formatSearchResults } from "@/lib/embeddings";
import type { KnowledgeChunk } from "@/lib/knowledge-segments";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, category } = body as {
      query: string;
      category?: KnowledgeChunk["category"];
    };

    if (!query) {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    // If we have an API key, use vector search
    if (apiKey) {
      try {
        const results = await searchKnowledge(query, apiKey, {
          category,
          limit: 5,
          minScore: 0.2,
        });

        return NextResponse.json({
          success: true,
          results: results.map((r) => ({
            id: r.chunk.id,
            category: r.chunk.category,
            subcategory: r.chunk.subcategory,
            content: r.chunk.content,
            score: r.score,
          })),
          formatted: formatSearchResults(results),
        });
      } catch (embeddingError) {
        console.error("Embedding search failed, falling back to keywords:", embeddingError);
        // Fall through to keyword search
      }
    }

    // Fallback: keyword-based search
    const keywordResults = searchByKeywords(query, category);

    return NextResponse.json({
      success: true,
      results: keywordResults.map((chunk) => ({
        id: chunk.id,
        category: chunk.category,
        subcategory: chunk.subcategory,
        content: chunk.content,
        score: null, // No score for keyword search
      })),
      formatted: keywordResults.length > 0
        ? keywordResults.map((c) => c.content).join("\n\n")
        : "No specific information found on that topic.",
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}

