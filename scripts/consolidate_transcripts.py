"""
Consolidate transcripts into knowledge segments for the voice assistant.

This script:
1. Reads all transcript files
2. Uses GPT-4 to categorize and summarize them
3. Outputs a TypeScript file with knowledge segments

Usage:
    export OPENAI_API_KEY="your-key-here"
    python scripts/consolidate_transcripts.py
"""

import os
import json
from pathlib import Path
from openai import OpenAI

# Load .env file if it exists
env_path = Path(__file__).parent.parent / ".env"
if env_path.exists():
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, value = line.split("=", 1)
                os.environ[key] = value.strip('"').strip("'")

TRANSCRIPTS_DIR = Path(__file__).parent.parent / "transcripts"
OUTPUT_FILE = Path(__file__).parent.parent / "src/lib/interview-context.ts"


def load_transcripts():
    """Load all transcript files."""
    transcripts = []
    
    for filename in sorted(os.listdir(TRANSCRIPTS_DIR)):
        if not filename.endswith(".txt"):
            continue
        
        filepath = os.path.join(TRANSCRIPTS_DIR, filename)
        with open(filepath, "r") as f:
            content = f.read().strip()
            if content:
                transcripts.append({
                    "filename": filename,
                    "content": content
                })
    
    return transcripts


def consolidate_with_gpt(transcripts: list) -> list:
    """Use GPT-4 to categorize and structure transcripts into knowledge segments."""
    
    client = OpenAI()
    
    # Combine all transcripts
    combined = "\n\n---\n\n".join([
        f"[{t['filename']}]\n{t['content']}" 
        for t in transcripts
    ])
    
    prompt = f"""You are helping structure personal interview context for a voice assistant.

Below are transcripts of someone talking about their experience. Extract and organize this into structured knowledge segments.

For each segment, provide:
1. id: A unique identifier (e.g., "interview-compass-overview", "interview-education")
2. category: One of "professional", "education", "personal", "projects"
3. subcategory: More specific (e.g., "current_role", "previous_roles", "skills", "side_projects")
4. content: The information rewritten in first person ("I", "my"), conversational, 2-4 sentences
5. keywords: Array of relevant search terms

Focus on:
- Current role and responsibilities
- Past experience highlights
- Technical skills and expertise
- Projects and achievements
- Education background
- Personal interests/hobbies

Output as JSON array of segments. Make the content natural and conversational - this will be spoken by a voice assistant.

TRANSCRIPTS:
{combined}

Output JSON array only, no markdown:"""

    response = client.chat.completions.create(
        model="gpt-4.1",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=4000
    )
    
    result = response.choices[0].message.content.strip()
    
    # Parse JSON (handle potential markdown wrapping)
    if result.startswith("```"):
        result = result.split("```")[1]
        if result.startswith("json"):
            result = result[4:]
    
    return json.loads(result)


def generate_typescript(segments: list) -> str:
    """Generate TypeScript file with interview context segments."""
    
    ts_content = '''// Auto-generated from interview transcripts
// Run: python scripts/consolidate_transcripts.py

import { KnowledgeChunk } from "./knowledge-segments";

export const interviewContext: KnowledgeChunk[] = [
'''
    
    for seg in segments:
        # Escape backticks and quotes in content
        content = seg["content"].replace("`", "'").replace("\\", "\\\\")
        keywords = json.dumps(seg["keywords"])
        
        ts_content += f'''  {{
    id: "{seg["id"]}",
    category: "{seg["category"]}",
    subcategory: "{seg["subcategory"]}",
    content: `{content}`,
    keywords: {keywords},
  }},
'''
    
    ts_content += "];\n"
    
    return ts_content


def main():
    # Check API key
    if not os.environ.get("OPENAI_API_KEY"):
        print("❌ Error: OPENAI_API_KEY not set")
        print("   Run: export OPENAI_API_KEY='your-key-here'")
        exit(1)
    
    print("📂 Loading transcripts...")
    transcripts = load_transcripts()
    print(f"   Found {len(transcripts)} transcript files")
    
    if not transcripts:
        print("❌ No transcripts found")
        exit(1)
    
    print("\n🤖 Processing with GPT-4...")
    segments = consolidate_with_gpt(transcripts)
    print(f"   Generated {len(segments)} knowledge segments")
    
    print("\n📝 Generating TypeScript...")
    ts_content = generate_typescript(segments)
    
    with open(OUTPUT_FILE, "w") as f:
        f.write(ts_content)
    
    print(f"   Saved to: {OUTPUT_FILE}")
    
    print("\n✅ Done! Next steps:")
    print("   1. Review the generated file")
    print("   2. Import into knowledge-segments.ts")
    print("   3. Test with the voice assistant")


if __name__ == "__main__":
    main()

