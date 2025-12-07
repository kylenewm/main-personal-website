import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#0a0a0f",
          secondary: "#12121a",
        },
        foreground: "#ffffff",
        accent: {
          DEFAULT: "#00f0ff",
          purple: "#7b61ff",
          pink: "#ff6b9d",
        },
        text: {
          primary: "#ffffff",
          secondary: "#8a8a9a",
        },
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
      },
      animation: {
        "cursor-blink": "blink 1s step-end infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "morph-blob": "morphBlob 20s ease-in-out infinite",
        "beam-sweep": "beamSweep 2s ease-out forwards",
        "float": "float 4s ease-in-out infinite",
        "ring-expand": "ringExpand 2s ease-out infinite",
        "waveform-idle": "waveformIdle 1.5s ease-in-out infinite",
        "waveform-active": "waveformActive 0.5s ease-in-out infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0, 240, 255, 0.4)" },
          "50%": { boxShadow: "0 0 40px rgba(0, 240, 255, 0.8)" },
        },
        morphBlob: {
          "0%, 100%": {
            borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
            transform: "translateY(-50%) rotate(0deg) scale(1)",
          },
          "25%": {
            borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%",
            transform: "translateY(-50%) rotate(90deg) scale(1.1)",
          },
          "50%": {
            borderRadius: "50% 60% 30% 60% / 30% 40% 70% 50%",
            transform: "translateY(-50%) rotate(180deg) scale(0.95)",
          },
          "75%": {
            borderRadius: "60% 40% 60% 30% / 70% 50% 40% 60%",
            transform: "translateY(-50%) rotate(270deg) scale(1.05)",
          },
        },
        beamSweep: {
          "0%": { top: "-100%" },
          "100%": { top: "100%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        ringExpand: {
          "0%": {
            width: "200px",
            height: "200px",
            opacity: "0.6",
          },
          "100%": {
            width: "400px",
            height: "400px",
            opacity: "0",
          },
        },
        waveformIdle: {
          "0%, 100%": { height: "8px", opacity: "0.3" },
          "50%": { height: "12px", opacity: "0.5" },
        },
        waveformActive: {
          "0%, 100%": { height: "8px" },
          "50%": { height: "40px" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
