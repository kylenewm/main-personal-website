"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { SocialIcons } from "./SocialIcons";
import { useEffect, useState } from "react";

const phrases = [
  "Building conversational AI at scale",
  "Shipping ML products that matter",
];

function useTypingAnimation(phrases: string[], typingSpeed = 80, deleteSpeed = 40, pauseDuration = 2000) {
  const [displayedText, setDisplayedText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      if (displayedText.length < currentPhrase.length) {
        timeout = setTimeout(() => {
          setDisplayedText(currentPhrase.slice(0, displayedText.length + 1));
        }, typingSpeed);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1));
        }, deleteSpeed);
      } else {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, phraseIndex, isDeleting, phrases, typingSpeed, deleteSpeed, pauseDuration]);

  return displayedText;
}

export function Hero() {
  const typedText = useTypingAnimation(phrases);

  return (
    <section className="relative min-h-screen flex items-center z-10">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 lg:grid-cols-2 gap-20 px-6 lg:px-12 py-32 lg:py-24">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col justify-center"
        >
          {/* Title with highlight effect */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-8"
          >
            AI Product
            <br />
            <span className="highlight-text">Manager</span>
          </motion.h1>

          {/* Typed Text Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="font-mono text-lg text-accent mb-6 min-h-[28px]"
          >
            {typedText}
            <span
              className="inline-block w-0.5 h-[1.2em] bg-accent ml-0.5 align-text-bottom"
              style={{ animation: "blink 1s step-end infinite" }}
            />
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="text-lg leading-relaxed text-text-secondary mb-10 max-w-xl"
          >
            I build and ship ML/AI systems that power key products and workflows. At{" "}
            <strong className="text-white">Red Ventures</strong>, I&apos;m focused on
            improving and scaling an AI sales agent that supports millions of inbound calls.
          </motion.p>

          {/* Social Icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          >
            <SocialIcons />
          </motion.div>
        </motion.div>

        {/* Right - Photo Frame */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
          className="flex items-center justify-center lg:justify-end order-first lg:order-last"
        >
          <div className="relative">
            {/* Photo Frame with Gradient Border */}
            <div
              className="relative w-[280px] h-[340px] md:w-[380px] md:h-[460px] rounded-3xl p-[2px]"
              style={{
                background: "linear-gradient(135deg, #00f0ff, rgba(123, 97, 255, 0.5))",
                boxShadow: "0 0 30px rgba(0, 240, 255, 0.15)",
              }}
            >
              <div className="w-full h-full rounded-[22px] overflow-hidden bg-background relative group">
                <Image
                  src="/profile.png"
                  alt="Kyle Newman"
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  priority
                />
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
