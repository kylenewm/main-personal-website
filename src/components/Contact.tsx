"use client";

import { motion } from "framer-motion";

export function Contact() {
  return (
    <>
      {/* Connect Section */}
      <section id="connect" className="relative z-10 py-20 px-6 lg:px-12">
        <div className="mx-auto max-w-[600px] text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="section-title mb-4">Let&apos;s Connect</p>
            <h2 className="text-4xl md:text-5xl font-semibold mb-6">
              Get In Touch
            </h2>
            <p className="text-text-secondary text-lg mb-8">
              Interested in working together or just want to chat about AI, technology, or anything else? Feel free to reach out.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:kylenewman1214@gmail.com"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-accent text-background font-mono text-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,240,255,0.3)]"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                Send an Email
              </a>
              <a
                href="https://linkedin.com/in/kylenewman2023"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-transparent border border-white/20 text-white font-mono text-sm transition-all duration-300 hover:border-accent hover:text-accent"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 lg:px-12 border-t border-white/5">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-text-secondary text-sm">
            © {new Date().getFullYear()} Kyle Newman. Built with curiosity.
          </p>
          <div className="flex gap-6">
            <a
              href="https://github.com/kylenewm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary text-sm hover:text-accent transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/kylenewman2023"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary text-sm hover:text-accent transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
