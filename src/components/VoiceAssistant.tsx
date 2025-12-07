"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  VoiceClient,
  VoiceStatus,
  TranscriptEntry,
} from "@/lib/voice-client";

const suggestedQuestions = [
  "What does Kyle do at Red Ventures?",
  "Tell me about his AI experience",
  "What's his background?",
];

export function VoiceAssistant() {
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [transcripts, setTranscripts] = useState<TranscriptEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentFunction, setCurrentFunction] = useState<string | null>(null);
  const clientRef = useRef<VoiceClient | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const transcriptContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll transcript container smoothly (not the full page)
  useEffect(() => {
    if (transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTo({
        top: transcriptContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [transcripts]);

  const handleStatusChange = useCallback((newStatus: VoiceStatus) => {
    console.log("[VoiceAssistant] 📊 Status changed:", newStatus);
    setStatus(newStatus);
    if (newStatus !== "error") {
      setError(null);
    }
  }, []);

  const handleTranscript = useCallback((entry: TranscriptEntry) => {
    console.log("[VoiceAssistant] 📝 Transcript:", entry.role, entry.text);
    setTranscripts((prev) => [...prev, entry]);
  }, []);

  const handleError = useCallback((errorMessage: string) => {
    console.error("[VoiceAssistant] ❌ Error received:", errorMessage);
    setError(errorMessage);
  }, []);

  const handleFunctionCall = useCallback((name: string) => {
    setCurrentFunction(name);
    setTimeout(() => setCurrentFunction(null), 2000);
  }, []);

  const toggleConnection = useCallback(async () => {
    console.log("[VoiceAssistant] 🎤 toggleConnection called, current status:", status);
    console.log("[VoiceAssistant] clientRef.current?.isActive():", clientRef.current?.isActive());
    
    if (clientRef.current?.isActive()) {
      console.log("[VoiceAssistant] Disconnecting existing connection");
      clientRef.current.disconnect();
      clientRef.current = null;
    } else {
      console.log("[VoiceAssistant] Creating new VoiceClient and connecting...");
      try {
        clientRef.current = new VoiceClient({
          onStatusChange: handleStatusChange,
          onTranscript: handleTranscript,
          onError: handleError,
          onFunctionCall: handleFunctionCall,
        });
        console.log("[VoiceAssistant] VoiceClient created, calling connect()");
        await clientRef.current.connect();
        console.log("[VoiceAssistant] ✅ connect() promise resolved");
      } catch (error) {
        console.error("[VoiceAssistant] ❌ Error in toggleConnection:", error);
      }
    }
  }, [handleStatusChange, handleTranscript, handleError, handleFunctionCall, status]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clientRef.current?.disconnect();
    };
  }, []);

  const getStatusText = () => {
    if (currentFunction) {
      const functionLabels: Record<string, string> = {
        search_knowledge: "Searching knowledge base...",
        capture_contact: "Saving contact info...",
      };
      return functionLabels[currentFunction] || "Processing...";
    }

    switch (status) {
      case "idle":
        return "Click to start conversation";
      case "connecting":
        return "Connecting...";
      case "connected":
        return "Ready - speak anytime";
      case "listening":
        return "Listening...";
      case "speaking":
        return "Speaking...";
      case "processing":
        return "Processing...";
      case "error":
        return error || "Connection error";
      default:
        return "";
    }
  };

  const isActive = status !== "idle" && status !== "error";

  return (
    <section id="ask" className="relative z-10 py-20 px-6 lg:px-12">
      <div className="mx-auto max-w-[700px]">
        {/* Section Header - Centered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="section-title mb-4">Ask Me Anything</p>
          <h2 className="text-4xl md:text-5xl font-semibold mb-6">
            Have a Conversation
          </h2>
          <p className="text-text-secondary text-lg">
            Click the orb to start a voice conversation with my AI assistant. Ask about my experience, skills, or what I&apos;m working on.
          </p>
        </motion.div>

        {/* Voice Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Voice Orb */}
          <div className="relative w-[200px] h-[200px] mx-auto mb-10">
            {/* Orb Button */}
            <button
              onClick={toggleConnection}
              disabled={status === "connecting"}
              className={`w-full h-full rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 relative z-[2] ${
                status === "connecting" ? "opacity-50 cursor-wait" : ""
              }`}
              style={{
                background: "radial-gradient(circle at 30% 30%, rgba(0, 240, 255, 0.3), rgba(123, 97, 255, 0.2) 50%, rgba(10, 10, 15, 0.8))",
                border: isActive ? "2px solid #00f0ff" : "2px solid rgba(0, 240, 255, 0.3)",
                boxShadow: isActive ? "0 0 80px rgba(0, 240, 255, 0.4)" : "0 0 30px rgba(0, 240, 255, 0.15)",
                animation: isActive ? "orbPulse 2s ease-in-out infinite" : "none",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`w-12 h-12 transition-colors duration-300 ${
                  isActive ? "text-white" : "text-accent"
                }`}
              >
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </button>

            {/* Expanding Rings - only show when active */}
            {isActive && (
              <>
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/20 pointer-events-none"
                  style={{ animation: "ringExpand 2s ease-out infinite" }}
                />
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/20 pointer-events-none"
                  style={{ animation: "ringExpand 2s ease-out infinite 0.5s" }}
                />
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/20 pointer-events-none"
                  style={{ animation: "ringExpand 2s ease-out infinite 1s" }}
                />
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/20 pointer-events-none"
                  style={{ animation: "ringExpand 2s ease-out infinite 1.5s" }}
                />
              </>
            )}
          </div>

          {/* Waveform Visualization */}
          <div
            className={`flex items-center justify-center gap-1 h-10 mb-8 transition-opacity duration-300 ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
          >
            {Array.from({ length: 11 }).map((_, i) => (
              <div
                key={i}
                className="w-1 bg-accent rounded-sm"
                style={{
                  animation: isActive
                    ? `waveformActive 0.5s ease-in-out infinite ${i * 0.1}s`
                    : `waveformIdle 1.5s ease-in-out infinite ${i * 0.1}s`,
                  height: "8px",
                }}
              />
            ))}
          </div>

          {/* Status Text */}
          <p
            className={`font-mono text-sm mb-3 min-h-[24px] ${
              status === "error" ? "text-red-400" : isActive ? "text-accent" : "text-text-secondary"
            }`}
          >
            {getStatusText()}
          </p>

          {/* Error message with fallback contact options */}
          {error && (
            <p className="text-xs text-text-secondary mb-4 max-w-md mx-auto">
              Voice AI temporarily unavailable. You can reach Kyle via{" "}
              <a 
                href="mailto:kylenewman1214@gmail.com" 
                className="text-accent hover:underline"
              >
                email
              </a>
              {" or "}
              <a 
                href="https://linkedin.com/in/kylenewman2023" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                LinkedIn
              </a>
              .
            </p>
          )}

          {/* Suggested Topics */}
          {status === "idle" && transcripts.length === 0 && (
            <>
              <p className="text-text-secondary mb-4">Try asking:</p>
              <div className="flex flex-wrap gap-3 justify-center mb-10">
                {suggestedQuestions.map((question) => (
                  <button
                    key={question}
                    className="px-5 py-3 glass rounded-full text-text-secondary text-sm transition-all duration-300 hover:border-accent hover:text-accent hover:-translate-y-0.5"
                  >
                    &ldquo;{question}&rdquo;
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Transcript Area */}
          <AnimatePresence>
            {transcripts.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="glass rounded-2xl overflow-hidden mb-8"
              >
                <div ref={transcriptContainerRef} className="p-6 max-h-96 overflow-y-auto">
                  <div className="space-y-4">
                    {transcripts.map((entry, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${
                          entry.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                            entry.role === "user"
                              ? "bg-accent/20 text-white"
                              : "bg-background-secondary text-text-primary"
                          }`}
                        >
                          <p className="text-xs text-text-secondary mb-1">
                            {entry.role === "user" ? "You" : "Kyle's AI"}
                          </p>
                          <p className="text-sm">{entry.text}</p>
                        </div>
                      </motion.div>
                    ))}
                    <div ref={transcriptEndRef} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footnote */}
          <p className="text-s text-text-secondary opacity-60">
            Just ask to leave a message for Kyle directly
          </p>
        </motion.div>
      </div>
    </section>
  );
}
