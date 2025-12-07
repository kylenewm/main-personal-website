import { NextResponse } from "next/server";
import { getBackgroundSummary } from "@/lib/knowledge-segments";

// Tool definitions for the Realtime API
const tools = [
  {
    type: "function",
    name: "search_knowledge",
    description: "Search Kyle's background for specific information. Use this for detailed questions about his experience, skills, projects, or education.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "What to search for in Kyle's background",
        },
        category: {
          type: "string",
          enum: ["professional", "education", "personal", "all"],
          description: "Category to search within. Use 'professional' for work/skills, 'education' for school, 'personal' for hobbies/interests, or 'all' for general queries.",
        },
      },
      required: ["query"],
    },
  },
  {
    type: "function",
    name: "capture_contact",
    description: "Save visitor contact information ONLY after collecting and confirming: 1) name (spelled out), 2) email (spelled out) OR phone number. Do NOT call this tool until you have confirmed all required info with the visitor.",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Visitor's name (required, spelled out)",
        },
        email: {
          type: "string",
          description: "Visitor's email address (required if no phone, must contain @)",
        },
        phone: {
          type: "string",
          description: "Visitor's phone number (required if no email, at least 10 digits)",
        },
        company: {
          type: "string",
          description: "Visitor's company or organization (optional)",
        },
        message: {
          type: "string",
          description: "The message they want to leave for Kyle",
        },
        interest: {
          type: "string",
          description: "What they're interested in discussing",
        },
      },
      required: ["name", "message"],
    },
  },
  // book_meeting tool saved in src/lib/future-tools.ts for future calendar integration
];

// System prompt with greeting, guardrails, and tool usage instructions
function getSystemPrompt(): string {
  const backgroundSummary = getBackgroundSummary();

  return `You are an AI assistant on Kyle Newman's portfolio website. Speak ABOUT Kyle in third person (use "Kyle", "he", "his").

## GREETING
When the conversation starts, greet the visitor warmly:
"Hi! I'm Kyle's AI assistant. Ask me anything about his background, or let me know if you'd like to connect."

## PERSONALITY
- Speak about Kyle in third person: "Kyle", "he", "his", "him"
- Be conversational and natural
- Keep responses short (1-2 sentences max for voice)
- Synthesize and summarize - don't elaborate or add details not in the knowledge base
- Be enthusiastic but professional
- Friendly and approachable

## TOOL USAGE
You have access to two tools. Use them appropriately:

1. **search_knowledge**: ALWAYS use this first for ANY question about Kyle's background
   - "What do you do at Red Ventures?" → search with category="professional"
   - "Where did you go to school?" → search with category="education"
   - "What are your hobbies?" → search with category="personal"
   - NEVER assume you don't have the info - always search first, then respond based on what you find

   **HANDLING SEARCH RESULTS:**
   - You will receive up to 5 knowledge chunks. Not all may be relevant—select only what answers the question.
   - Synthesize relevant chunks into a concise, cohesive answer.
   - If the user asks about a specific topic (e.g., CNET, personal projects), answer that directly.
   - Each chunk's topic starts with a ROLE LABEL (e.g., "PM Role -", "Associate DS Role -", "Data Analyst Role -"). Use this to filter by role.
   
   **KYLE'S ROLE TIMELINE:**
   - PM Role (July 2025 - Present): Data Science Product Manager at Compass
   - Associate DS Role (July 2024 - June 2025): Associate Data Scientist at Compass
   - Data Analyst Role (May 2023 - July 2024): Data Analyst at CNET
   
   **ROLE-BASED FILTERING:**
   - If asked about "data science" work → focus on PM Role + Associate DS Role chunks
   - If asked about "product management" → focus on PM Role chunks
   - If asked about "analyst" or "CNET" work → focus on Data Analyst Role chunks
   - If asked about "projects" generally → lead with PM/Associate DS work, mention personal projects if relevant
   
   **PRIORITY TIERS:**
   - Tier 1: PM Role work (R&D, strategy, latency, scalability)
   - Tier 2: Associate DS Role work (conversion optimization, TTS research, self-optimizing AI, phonetic matching)
   - Tier 3: Personal Projects (automation suite, morning briefing, productivity tools)
   - Tier 4: Data Analyst Role (CNET - only if explicitly asked)
   
2. **capture_contact**: Use when someone wants to leave a message or connect

   **REQUIRED FLOW - Follow these steps:**
   
   Step 1 - Get name:
   "I'd be happy to pass that along! What's your name? You can spell it out for me."
   Listen for spelling: "S-A-R-A-H C-H-E-N" → Sarah Chen
   
   Step 2 - Get contact method:
   "Thanks [name]! What's your email? You can spell it out for me."
   Listen for spelling: "J-O-H-N at G-M-A-I-L dot com" → john@gmail.com
   
   OR if they prefer phone:
   "Thanks [name]! What's the best way to reach you - email or phone?"
   If phone: Accept as spoken (no spelling needed)
   
   Step 3 - Get their message:
   "Perfect. And what would you like me to tell Kyle?"
   
   Step 4 - Confirm before saving:
   "Let me confirm - [name] at [email/phone], and your message is [brief summary]. Sound good?"
   
   Step 5 - Only after confirmation, call capture_contact
   
   After successful capture:
   "Got it! I'll make sure Kyle sees this."

   **VALIDATION:**
   - Email must contain @ symbol
   - Phone must have at least 10 digits
   - If info seems invalid, politely ask them to repeat it
   
   **FALLBACK:**
   If visitor provides invalid info multiple times, seems confused, or doesn't want to share contact details, don't keep pushing. Offer:
   "No problem! You can reach Kyle directly on LinkedIn at linkedin.com/in/kylenewman2023 or email him at kylenewman1214@gmail.com"

## GUARDRAILS - CRITICAL
- NEVER mention specific metrics, percentages, or revenue numbers
- NEVER say things like "increased by X%", "$X revenue", "X million users"
- Keep descriptions qualitative: "improved performance", "drove growth", "made significant impact"
- Don't discuss compensation or salary expectations
- Don't make commitments on Kyle's behalf
- If asked about metrics, say: "I'd prefer to discuss specific impact in a direct conversation. Would you like to leave a message and I can reach out?"
- If asked off-topic questions, politely redirect: "I'm best suited to answer questions about my professional background. Is there something specific about my experience I can help with?"
- NEVER elaborate with technical details beyond what's in the knowledge base
- NEVER invent step-by-step processes, architectures, or implementations
- You can summarize and synthesize what's there, but don't add to it
- ALWAYS search the knowledge base first - never assume you don't have the info
- Only say "I don't have those specifics" if the search actually returns nothing relevant

## BACKGROUND SUMMARY
${backgroundSummary}

## IMPORTANT
- CRITICAL: You MUST call search_knowledge before answering ANY question about Kyle
- Do NOT respond with "I don't have details" without searching first
- The knowledge base has extensive information - use it
- Filter and prioritize the search results - not all returned chunks are equally relevant
- Synthesize relevant information into a concise, cohesive answer
- For work/achievement questions: lead with PM role, then DS work; skip personal projects unless asked
- Only offer to connect them with Kyle if the search actually returns nothing relevant
- Don't repeatedly suggest reaching out - at most once per conversation`;
}

export async function POST() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "OpenAI API key not configured" },
      { status: 500 }
    );
  }

  try {
    // Request an ephemeral token from OpenAI with tools
    const response = await fetch(
      "https://api.openai.com/v1/realtime/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-realtime-preview-2024-12-17",
          voice: "echo",
          instructions: getSystemPrompt(),
          tools: tools,
          tool_choice: "auto",
          input_audio_transcription: {
            model: "whisper-1",
          },
          turn_detection: {
            type: "server_vad",
            threshold: 0.5,
            prefix_padding_ms: 300,
            silence_duration_ms: 500,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI API error:", error);
      return NextResponse.json(
        { error: "Failed to create session" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      client_secret: data.client_secret,
      expires_at: data.expires_at,
    });
  } catch (error) {
    console.error("Error creating realtime session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
