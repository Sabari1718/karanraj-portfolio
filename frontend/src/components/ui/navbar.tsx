"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Briefcase,
  GraduationCap,
  Terminal,
  Cpu,
  Mail,
  Menu,
  X,
  Lock,
} from "lucide-react";

interface Props {
  settings?: any;
}

const NAV_LINKS = [
  { name: "About", href: "#home", id: "home", color: "#00ff9d", icon: Shield },
  { name: "Experience", href: "#experience", id: "experience", color: "#00f0ff", icon: Briefcase },
  { name: "Education", href: "#education", id: "education", color: "#38bdf8", icon: GraduationCap },
  { name: "Projects", href: "#projects", id: "projects", color: "#00ff9d", icon: Terminal },
  { name: "Skills", href: "#skills", id: "skills", color: "#818cf8", icon: Cpu },
  { name: "Contact", href: "#contact", id: "contact", color: "#00f0ff", icon: Mail },
];

export function Navbar({ settings }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const sections = ["home", "experience", "education", "projects", "skills", "contact"];
    const observers: IntersectionObserver[] = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.35 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  // Hide on admin routes
  if (pathname && pathname.startsWith("/admin")) return null;

  const navSettings = settings || {};
  const logoName = navSettings.logo_name || "Karanraj Portfolio";

  return (
    <header
      className={cn(
        "w-full z-[100] sticky top-0 transition-all duration-300 pointer-events-none",
        scrolled
          ? "bg-[#05070a]/92 backdrop-blur-2xl border-b border-[#00ff9d]/10 py-2.5 shadow-2xl"
          : "bg-transparent py-4"
      )}
    >
      <nav
        className={cn(
          "navbar max-w-6xl w-11/12 mx-auto relative pointer-events-auto transition-all duration-300 flex justify-between items-center",
          scrolled ? "mt-0 mb-0" : "mt-2"
        )}
      >
        {/* Cyber Security Logo */}
        <Link
          href="/"
          onClick={() => setMobileMenuOpen(false)}
          className="group flex items-center gap-2.5 cursor-pointer select-none"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00ff9d]/20 to-[#00f0ff]/10 border border-[#00ff9d]/35 flex items-center justify-center shadow-[0_0_15px_rgba(0,255,157,0.25)] group-hover:scale-105 transition-transform">
            <Shield size={16} className="text-[#00ff9d]" />
          </div>
          <span className="font-display text-lg md:text-xl font-black text-white tracking-tight flex items-center gap-1 group-hover:text-[#00ff9d] transition-colors">
            {logoName === "Sabari Portfolio" || logoName === "Karanraj Portfolio" ? (
              <>
                Karanraj<span className="text-[#00ff9d] drop-shadow-[0_0_8px_rgba(0,255,157,0.7)] font-mono text-base">.sec</span>
              </>
            ) : (
              logoName
            )}
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9d] shadow-[0_0_8px_#00ff9d] animate-pulse ml-0.5" />
          </span>
        </Link>

        {/* Desktop Cyber Navigation Dock */}
        <div
          className="hidden md:flex items-center gap-1.5 lg:gap-2.5 bg-[#080d16]/90 backdrop-blur-2xl border border-[#00ff9d]/15 p-1.5 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.7),0_0_20px_rgba(0,255,157,0.06)]"
          onMouseLeave={() => setHoveredLink(null)}
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            const isHovered = hoveredLink === link.id;
            const Icon = link.icon;

            return (
              <motion.a
                key={link.name}
                href={link.href}
                onClick={() => setActiveSection(link.id)}
                onMouseEnter={() => setHoveredLink(link.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className={cn(
                  "relative px-4 lg:px-4.5 py-2 rounded-full text-xs font-mono font-semibold transition-all duration-200 flex items-center gap-2 select-none cursor-pointer",
                  isActive
                    ? "text-white font-bold"
                    : "text-slate-300 hover:text-white"
                )}
              >
                {/* Active Electric Cyber Capsule */}
                {isActive && (
                  <motion.div
                    layoutId="active-nav-capsule"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `linear-gradient(135deg, ${link.color}25 0%, ${link.color}08 100%)`,
                      borderColor: link.color,
                      borderWidth: "1.5px",
                      borderStyle: "solid",
                      boxShadow: `0 0 20px ${link.color}45, 0 0 35px ${link.color}15, inset 0 0 10px ${link.color}25`,
                    }}
                    transition={{ type: "spring", stiffness: 420, damping: 28 }}
                  />
                )}

                {/* Hover Glow Pill */}
                {!isActive && isHovered && (
                  <motion.div
                    layoutId="hover-nav-capsule"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `${link.color}12`,
                      borderColor: `${link.color}40`,
                      borderWidth: "1px",
                      borderStyle: "solid",
                      boxShadow: `0 0 14px ${link.color}30`,
                    }}
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                  />
                )}

                {/* Micro Icon */}
                <Icon
                  size={14}
                  className="relative z-10 transition-all duration-200"
                  style={{
                    color: isActive || isHovered ? link.color : "#94a3b8",
                    filter: isActive ? `drop-shadow(0 0 6px ${link.color})` : "none",
                  }}
                />

                {/* Label */}
                <span
                  className="relative z-10 tracking-wider text-[11px] uppercase"
                  style={{
                    color: isActive ? "#ffffff" : (isHovered ? link.color : undefined),
                    textShadow: isActive ? `0 0 12px ${link.color}70` : "none",
                  }}
                >
                  {link.name}
                </span>

                {/* Active Micro Pulsing Dot */}
                {isActive && (
                  <span
                    className="relative z-10 w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{
                      backgroundColor: link.color,
                      boxShadow: `0 0 8px ${link.color}`,
                    }}
                  />
                )}
              </motion.a>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="md:hidden text-white hover:text-[#00ff9d] transition-colors p-2.5 rounded-2xl bg-white/5 border border-white/10 shadow-lg"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </motion.button>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="absolute top-[125%] left-0 w-full bg-[#05070a]/98 backdrop-blur-2xl border border-[#00ff9d]/20 rounded-2xl p-3 flex flex-col gap-2 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(0,255,157,0.1)] md:hidden pointer-events-auto z-50"
            >
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.id;
                const Icon = link.icon;
                return (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => {
                      setActiveSection(link.id);
                      setMobileMenuOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-mono font-semibold transition-all duration-200 cursor-pointer",
                      isActive ? "text-white" : "text-slate-300 hover:text-white hover:bg-white/5"
                    )}
                    style={{
                      background: isActive
                        ? `linear-gradient(135deg, ${link.color}25 0%, ${link.color}08 100%)`
                        : undefined,
                      borderColor: isActive ? link.color : "transparent",
                      borderWidth: "1.5px",
                      borderStyle: "solid",
                      boxShadow: isActive ? `0 0 16px ${link.color}35` : "none",
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all"
                      style={{
                        background: `${link.color}15`,
                        borderColor: `${link.color}40`,
                        color: link.color,
                        boxShadow: isActive ? `0 0 10px ${link.color}50` : "none",
                      }}
                    >
                      <Icon size={15} />
                    </div>
                    <span className="flex-1 text-left tracking-wider uppercase">{link.name}</span>
                    {isActive && (
                      <span
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{
                          backgroundColor: link.color,
                          boxShadow: `0 0 8px ${link.color}`,
                        }}
                      />
                    )}
                  </motion.a>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
