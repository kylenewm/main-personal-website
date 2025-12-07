"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

interface Project {
  id: string;
  title: string;
  status: "Live" | "In Progress" | "In Review";
  description: string;
  features: string[];
  githubUrl?: string;
  imageUrl?: string;
}

const projects: Project[] = [
  {
    id: "ai-briefing",
    title: "AI Morning Briefing",
    status: "In Progress",
    description:
      "An automated daily briefing system that delivers personalized AI insights every weekday at 9:30 AM ET. Intelligently curates AI articles, summarizes podcasts, and processes newsletters into a single, digestible morning update.",
    features: [
      "Automated daily briefing at 9:30 AM ET",
      "AI article curation and summarization",
      "Podcast processing and insights",
      "Newsletter aggregation",
    ],
    githubUrl: "https://github.com/kylenewm/pm-automation-suite",
    imageUrl: "/projects/ai-briefing.png",
  },
  {
    id: "slack-intelligence",
    title: "Slack Intelligence",
    status: "In Progress",
    description:
      "An AI-powered workflow automation system that transforms Slack message overload into actionable insights. Processes 100+ daily messages to prioritize, categorize, and create tasks automatically.",
    features: [
      "Real-time message prioritization via OpenAI",
      "Smart notification summaries",
      "Automated task creation for urgent items",
      "AI-generated Jira tickets with context",
    ],
    githubUrl: "https://github.com/kylenewm/pm-automation-suite",
    imageUrl: "/projects/slack-intelligence.png",
  },
];

export function Projects() {
  return (
    <section id="projects" className="relative z-10 py-20 px-6 lg:px-12">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="section-title mb-4">Personal Projects</p>
          <h2 className="text-4xl md:text-5xl font-semibold mb-6">
            Building Tools to Work Smarter
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            AI-powered automation to streamline my day-to-day and compound my productivity over time.
          </p>
        </motion.div>

        {/* Projects - Full width stacked */}
        <div className="space-y-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="glass rounded-2xl overflow-hidden transition-all duration-500 hover:border-accent/30 hover:shadow-[0_0_40px_rgba(0,240,255,0.1)]">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr]">
          {/* Left - Content */}
          <div className="p-8 lg:p-10 flex flex-col justify-center">
            {/* Badge */}
            <span className="inline-block w-fit px-4 py-1.5 text-[0.7rem] font-mono uppercase tracking-wider text-accent bg-accent/10 border border-accent/30 rounded-full mb-5">
              {project.status}
            </span>

            {/* Title */}
            <h3 className="text-2xl lg:text-3xl font-bold mb-4 group-hover:text-accent transition-colors duration-300">
              {project.title}
            </h3>

            {/* Description */}
            <p className="text-text-secondary leading-relaxed mb-6">
              {project.description}
            </p>

            {/* Features */}
            <div className="mb-6">
              <p className="font-mono text-sm text-accent mb-3">Key Features</p>
              <ul className="space-y-2">
                {project.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                    <svg className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Link */}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-sm text-accent hover:gap-3 transition-all duration-300 group/link"
              >
                View on GitHub
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            )}
          </div>

          {/* Right - Image */}
          <div className="relative min-h-[300px] lg:min-h-[400px] bg-gradient-to-br from-background-secondary to-background flex items-center justify-center border-t lg:border-t-0 lg:border-l border-white/5">
            {/* Decorative glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {project.imageUrl && !imageError ? (
              <div className="relative w-full h-full p-6 lg:p-8">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  className="object-contain drop-shadow-2xl"
                  onError={() => setImageError(true)}
                />
              </div>
            ) : (
              <div className="text-center p-8">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-text-secondary text-sm">Screenshot coming soon</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
