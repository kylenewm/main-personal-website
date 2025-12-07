"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToConnect = () => {
    document.getElementById("connect")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass py-4" : "py-6"
      }`}
      style={{
        background: scrolled
          ? "rgba(18, 18, 26, 0.8)"
          : "linear-gradient(to bottom, rgba(10, 10, 15, 0.9), transparent)",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 lg:px-12">
        {/* Logo with pulsing dot */}
        <Link
          href="/"
          className="flex items-center gap-2 font-mono text-lg font-bold text-accent tracking-tight"
        >
          <span
            className="w-2 h-2 bg-accent rounded-full"
            style={{ animation: "pulse 2s ease-in-out infinite" }}
          />
          Kyle Newman
        </Link>

        {/* Navigation Links */}
        <ul className="hidden md:flex items-center gap-10">
          <NavLink href="#journey">Journey</NavLink>
          <NavLink href="#ask">Ask Me</NavLink>
          <NavLink href="#projects">Projects</NavLink>
          <NavLink href="#connect">Contact</NavLink>
        </ul>

        {/* Connect Button */}
        <button
          onClick={scrollToConnect}
          className="font-mono text-xs uppercase tracking-wider px-6 py-3 border border-accent text-accent relative overflow-hidden btn-fill transition-all duration-300 hover:text-background"
        >
          Connect
        </button>
      </div>
    </motion.nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <a
        href={href}
        className="font-mono text-xs uppercase tracking-wider text-text-secondary hover:text-white transition-colors nav-underline"
      >
        {children}
      </a>
    </li>
  );
}
