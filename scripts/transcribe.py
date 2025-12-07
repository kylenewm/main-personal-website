"""
Batch transcribe audio files using AssemblyAI.

Usage:
    1. Set your API key: export ASSEMBLYAI_API_KEY="your-key-here"
    2. Run: python scripts/transcribe.py --input /path/to/audio/folder --output /path/to/transcripts

The script will transcribe all audio files (.m4a, .mp3, .wav, .aac, .flac) 
in the input folder and save transcripts as .txt files in the output folder.
"""

import os
import argparse
import assemblyai as aai


def main():
    parser = argparse.ArgumentParser(description="Batch transcribe audio files")
    parser.add_argument("--input", "-i", required=True, help="Folder containing audio files")
    parser.add_argument("--output", "-o", required=True, help="Folder to save transcripts")
    parser.add_argument("--speakers", "-s", action="store_true", help="Enable speaker diarization")
    args = parser.parse_args()

    # Get API key from environment
    api_key = os.environ.get("ASSEMBLYAI_API_KEY")
    if not api_key:
        print("❌ Error: ASSEMBLYAI_API_KEY environment variable not set")
        print("   Run: export ASSEMBLYAI_API_KEY='your-key-here'")
        exit(1)

    aai.settings.api_key = api_key

    # Create output folder
    os.makedirs(args.output, exist_ok=True)

    # Configure transcription
    config = aai.TranscriptionConfig(
        speaker_labels=args.speakers,
        speech_model=aai.SpeechModel.best
    )
    transcriber = aai.Transcriber(config=config)

    # Supported audio formats
    audio_extensions = (".m4a", ".mp3", ".wav", ".aac", ".flac", ".webm", ".ogg")

    # Get list of audio files
    audio_files = [
        f for f in os.listdir(args.input)
        if f.lower().endswith(audio_extensions)
    ]

    if not audio_files:
        print(f"No audio files found in {args.input}")
        exit(0)

    print(f"Found {len(audio_files)} audio file(s) to transcribe\n")

    # Process each file
    for i, filename in enumerate(audio_files, 1):
        filepath = os.path.join(args.input, filename)
        print(f"[{i}/{len(audio_files)}] Transcribing: {filename}")

        try:
            transcript = transcriber.transcribe(filepath)

            if transcript.status == aai.TranscriptStatus.error:
                print(f"    ❌ Error: {transcript.error}")
                continue

            # Prepare output
            base = os.path.splitext(filename)[0]
            output_path = os.path.join(args.output, f"{base}.txt")

            with open(output_path, "w") as f:
                if args.speakers and transcript.utterances:
                    # Write with speaker labels
                    for utterance in transcript.utterances:
                        f.write(f"Speaker {utterance.speaker}: {utterance.text}\n\n")
                else:
                    # Write plain text
                    f.write(transcript.text)

            print(f"    ✅ Saved: {output_path}")

        except Exception as e:
            print(f"    ❌ Error: {e}")

    print("\n✅ All done!")


if __name__ == "__main__":
    main()

