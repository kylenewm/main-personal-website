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
      "Leading product strategy for conversational AI at scale, including roadmap ownership, R&D initiatives for next-generation voice AI, and driving platform scalability improvements.",
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
      "Optimized AI agents through prompt engineering and model orchestration, while improving quality and implementation of third-party integrations across the platform.",
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
      "Owned data strategy for CNET's site-wide redesign, driving KPI alignment across user engagement and revenue. Built data pipelines and dashboards while spearheading ML personalization initiatives.",
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
