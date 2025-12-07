"""
Transcript processing pipeline:
1. Combine raw transcripts
2. Clean with GPT-4.1 (fix errors, remove filler, keep ALL content)
3. Split into detailed chunks

Usage:
    python3 scripts/build_transcript_pipeline.py
"""

import os
import json
from pathlib import Path
from openai import OpenAI

# Paths
PROJECT_ROOT = Path(__file__).parent.parent
TRANSCRIPTS_DIR = PROJECT_ROOT / "transcripts"
OUTPUT_DIR = PROJECT_ROOT / "data" / "processed"

# Load .env
env_path = PROJECT_ROOT / ".env"
if env_path.exists():
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, value = line.split("=", 1)
                os.environ[key] = value.strip('"').strip("'")


def step1_combine_raw():
    """Combine all transcripts into one raw file."""
    print("\n📄 Step 1: Combining raw transcripts...")
    
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    transcripts = []
    for filename in sorted(TRANSCRIPTS_DIR.iterdir()):
        if not filename.suffix == ".txt":
            continue
        
        with open(filename, "r") as f:
            content = f.read().strip()
            if content:
                transcripts.append(f"--- {filename.name} ---\n{content}")
    
    raw_content = "\n\n".join(transcripts)
    raw_path = OUTPUT_DIR / "raw_transcript.txt"
    
    with open(raw_path, "w") as f:
        f.write(raw_content)
    
    print(f"   Combined {len(transcripts)} files")
    print(f"   Saved to: {raw_path}")
    print(f"   Total length: {len(raw_content):,} characters")
    
    return raw_content


def step2_clean_transcript(raw_content: str):
    """Clean transcript with GPT-4.1 - fix errors, remove filler, keep ALL content."""
    print("\n🧹 Step 2: Cleaning transcript with GPT-4.1...")
    
    client = OpenAI()
    
    # Split into chunks if too long (GPT-4.1 has 128k context but let's be safe)
    max_chunk_size = 30000  # characters
    chunks = []
    
    if len(raw_content) > max_chunk_size:
        # Split by transcript boundaries
        parts = raw_content.split("\n\n---")
        current_chunk = ""
        
        for part in parts:
            if len(current_chunk) + len(part) > max_chunk_size:
                if current_chunk:
                    chunks.append(current_chunk)
                current_chunk = part
            else:
                current_chunk += "\n\n---" + part if current_chunk else part
        
        if current_chunk:
            chunks.append(current_chunk)
    else:
        chunks = [raw_content]
    
    print(f"   Processing {len(chunks)} chunk(s)...")
    
    cleaned_parts = []
    for i, chunk in enumerate(chunks):
        print(f"   Cleaning chunk {i+1}/{len(chunks)}...")
        
        response = client.chat.completions.create(
            model="gpt-4.1-2025-04-14",
            messages=[{
                "role": "system",
                "content": """You are cleaning interview transcripts. Your job:

1. FIX transcription errors (misheard words, wrong names, etc.)
2. REMOVE filler words (um, uh, like, you know, basically, etc.)
3. FIX grammar and sentence structure for clarity
4. KEEP ALL substantive content - do NOT summarize or remove information
5. Maintain first-person voice ("I", "my")
6. Preserve the natural conversational tone

Output the cleaned transcript. Do not add commentary."""
            }, {
                "role": "user", 
                "content": f"Clean this transcript:\n\n{chunk}"
            }],
            temperature=0.3,
            max_tokens=16000
        )
        
        cleaned_parts.append(response.choices[0].message.content)
    
    clean_content = "\n\n".join(cleaned_parts)
    clean_path = OUTPUT_DIR / "clean_transcript.txt"
    
    with open(clean_path, "w") as f:
        f.write(clean_content)
    
    print(f"   Saved to: {clean_path}")
    print(f"   Clean length: {len(clean_content):,} characters")
    
    return clean_content


def step3_split_chunks(clean_content: str):
    """Split into detailed chunks for retrieval."""
    print("\n✂️ Step 3: Splitting into chunks...")
    
    client = OpenAI()
    
    response = client.chat.completions.create(
        model="gpt-4.1-2025-04-14",
        messages=[{
            "role": "system",
            "content": """You are splitting a transcript into chunks for a voice assistant's knowledge base.

Create chunks that are:
1. DETAILED - keep all the substantive content, don't summarize
2. SELF-CONTAINED - each chunk should make sense on its own
3. FOCUSED - each chunk should cover one topic/story/experience
4. 2-5 paragraphs each - long enough to be useful, short enough for retrieval

For each chunk, provide:
- id: unique identifier (e.g., "compass-sales-bot", "education-cu-boulder")
- category: one of "professional", "education", "personal", "projects"
- topic: brief description of what this chunk covers
- content: the full detailed content (NOT a summary)

Output as JSON array. Keep ALL the detail from the original."""
        }, {
            "role": "user",
            "content": f"Split this transcript into detailed chunks:\n\n{clean_content}"
        }],
        temperature=0.3,
        max_tokens=16000,
        response_format={"type": "json_object"}
    )
    
    result = json.loads(response.choices[0].message.content)
    chunks = result.get("chunks", result.get("knowledge_chunks", []))
    
    # If result is the array directly
    if isinstance(result, list):
        chunks = result
    
    chunks_path = OUTPUT_DIR / "chunks.json"
    with open(chunks_path, "w") as f:
        json.dump(chunks, f, indent=2)
    
    print(f"   Created {len(chunks)} chunks")
    print(f"   Saved to: {chunks_path}")
    
    return chunks


def step4_generate_typescript(chunks: list):
    """Generate TypeScript file for the knowledge base."""
    print("\n📝 Step 4: Generating TypeScript...")
    
    ts_content = '''// Auto-generated from interview transcripts
// Source: data/processed/clean_transcript.txt
// Run: python3 scripts/build_transcript_pipeline.py

export interface InterviewChunk {
  id: string;
  category: "professional" | "education" | "personal" | "projects";
  topic: string;
  content: string;
}

export const interviewChunks: InterviewChunk[] = [
'''
    
    for chunk in chunks:
        content = chunk.get("content", "").replace("`", "'").replace("\\", "\\\\")
        topic = chunk.get("topic", "").replace('"', '\\"')
        
        ts_content += f'''  {{
    id: "{chunk.get('id', 'unknown')}",
    category: "{chunk.get('category', 'professional')}",
    topic: "{topic}",
    content: `{content}`,
  }},
'''
    
    ts_content += "];\n"
    
    output_path = PROJECT_ROOT / "src" / "lib" / "interview-chunks.ts"
    with open(output_path, "w") as f:
        f.write(ts_content)
    
    print(f"   Saved to: {output_path}")
    
    return output_path


def main():
    if not os.environ.get("OPENAI_API_KEY"):
        print("❌ Error: OPENAI_API_KEY not set")
        exit(1)
    
    print("🚀 Transcript Processing Pipeline")
    print("=" * 50)
    
    # Step 1: Combine raw
    raw_content = step1_combine_raw()
    
    # Step 2: Clean
    clean_content = step2_clean_transcript(raw_content)
    
    # Step 3: Split into chunks
    chunks = step3_split_chunks(clean_content)
    
    # Step 4: Generate TypeScript
    step4_generate_typescript(chunks)
    
    print("\n" + "=" * 50)
    print("✅ Pipeline complete!")
    print("\nOutput files:")
    print(f"   - data/processed/raw_transcript.txt (original)")
    print(f"   - data/processed/clean_transcript.txt (cleaned)")
    print(f"   - data/processed/chunks.json (structured)")
    print(f"   - src/lib/interview-chunks.ts (for app)")


if __name__ == "__main__":
    main()

