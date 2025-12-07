import dynamic from "next/dynamic";
import { NeuralBackground } from "@/components/NeuralBackground";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";

// Lazy load below-the-fold components
const Timeline = dynamic(() => import("@/components/Timeline").then(mod => ({ default: mod.Timeline })), {
  loading: () => <div className="min-h-[400px]" />,
});

const VoiceAssistant = dynamic(() => import("@/components/VoiceAssistant").then(mod => ({ default: mod.VoiceAssistant })), {
  loading: () => <div className="min-h-[400px]" />,
});

const Projects = dynamic(() => import("@/components/Projects").then(mod => ({ default: mod.Projects })), {
  loading: () => <div className="min-h-[400px]" />,
});

const Contact = dynamic(() => import("@/components/Contact").then(mod => ({ default: mod.Contact })), {
  loading: () => <div className="min-h-[200px]" />,
});

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background text-white">
      <NeuralBackground />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Timeline />
        <VoiceAssistant />
        <Projects />
        <Contact />
      </div>
    </main>
  );
}
