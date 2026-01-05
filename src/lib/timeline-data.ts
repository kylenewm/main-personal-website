export interface TimelineEntry {
  id: string;
  year: string;
  title: string;
  organization: string;
  organizationUrl?: string;
  date: string;
  description: string;
  type: "work" | "education" | "project";
}

export const timelineData: TimelineEntry[] = [
  {
    id: "rv-pm",
    year: "2025",
    title: "AI Product Manager",
    organization: "Red Ventures",
    organizationUrl: "https://redventures.com",
    date: "July 2025 - Present",
    description:
      "Led the core conversational platform for a virtual sales agent, owning the roadmap, driving scalability improvements, and supporting implementation across new businesses for millions of sales calls. Currently leading R&D efforts to overhaul the architecture to enable end-to-end AI-driven sales calls, from lead qualification through close.",
    type: "work",
  },
  {
    id: "rv-ds",
    year: "2024",
    title: "Associate Data Scientist",
    organization: "Red Ventures",
    organizationUrl: "https://redventures.com",
    date: "July 2024 - June 2025",
    description:
      "Optimized AI agents through prompt engineering, dialogue design, and model orchestration, materially improving conversion performance while strengthening third-party integrations across the platform.",
    type: "work",
  },
  {
    id: "rv-analyst",
    year: "2023",
    title: "Data Analyst",
    organization: "Red Ventures (CNET)",
    organizationUrl: "https://cnet.com",
    date: "May 2023 - July 2024",
    description:
      "Contributed to analytics and data science work at CNET, supporting data strategy, KPI definition, and reporting across major initiatives. Built data pipelines and dashboards, and partnered with product and engineering to support ML-driven personalization efforts.",
    type: "work",
  },
  {
    id: "cu-degrees",
    year: "2023",
    title: "M.S. Data Science & B.A. Mathematics",
    organization: "University of Colorado Boulder",
    organizationUrl: "https://colorado.edu",
    date: "Graduated May 2023",
    description: "Focus in machine learning, big data, NLP, and mathematics with a concentration in statistics.",
    type: "education",
  },
];
