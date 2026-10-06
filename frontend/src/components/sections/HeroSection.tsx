"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Profile } from "@/types";
import {
  Download,
  ArrowDown,
  MapPin,
  Shield,
  ShieldCheck,
  Terminal,
  Lock,
  Cpu,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { getFileUrl } from "@/services/api";
import { CountUp } from "@/components/ui/CountUp";
import { extractProfileStats } from "@/lib/profile-stats";

interface Props {
  profile: Profile | null;
  projectCount: number;
}

export function HeroSection({ profile, projectCount }: Props) {
  const profileImageUrl = profile?.profile_image ? getFileUrl(profile.profile_image) : null;
  const { stats: profileStats, cleanBio } = extractProfileStats(profile);

  // Dynamic titles parsed directly from Admin profile.headline
  const rawHeadline = profile?.headline?.trim();
  const titles = rawHeadline
    ? rawHeadline.includes("|")
      ? rawHeadline.split("|").map((s) => s.trim()).filter(Boolean)
      : rawHeadline.includes(",")
      ? rawHeadline.split(",").map((s) => s.trim()).filter(Boolean)
      : [rawHeadline]
    : ["Cyber Security Specialist", "Ethical Hacker", "Security Researcher"];

  // Dynamic hero badges from Admin
  const badge1 = profileStats.hero_badge_1 || "Cyber Security";
  const badge2 = profileStats.hero_badge_2 || "Ethical Hacking";

  // Parse number and suffix from strings like "2+", "1+", "15+", or number
  const parseStat = (
    val: string | number | undefined | null,
    fallbackNum: number,
    fallbackSuffix = "+"
  ) => {
    if (val === undefined || val === null || String(val).trim() === "") {
      return { value: fallbackNum, suffix: fallbackSuffix };
    }
    const str = String(val).trim();
    const numMatch = str.match(/\d+/);
    const suffixMatch = str.match(/[^\d\s]+/);

    const num = numMatch ? parseInt(numMatch[0], 10) : fallbackNum;
    const suffix = suffixMatch ? suffixMatch[0] : (str.includes("+") ? "+" : "");

    return { value: num, suffix: suffix || (str.match(/^\d+$/) ? "+" : "") };
  };

  const expStat = parseStat(profileStats.years_experience, 2, "+");
  const projStat = parseStat(profileStats.projects_count, projectCount || 1, "+");
  const techStat = parseStat(profileStats.technologies_count, 15, "+");
  const repoStat = parseStat(profileStats.repos_count, 10, "+");

  const stats = [
    { label: "Years Experience", value: expStat.value, suffix: expStat.suffix },
    { label: "Security Projects", value: projStat.value, suffix: projStat.suffix },
    { label: "Arsenal / Tools", value: techStat.value, suffix: techStat.suffix },
    { label: "Security Repos", value: repoStat.value, suffix: repoStat.suffix },
  ];

  return (
    <section id="home" className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="hero-bg-blob hero-blob-1" />
      <div className="hero-bg-blob hero-blob-2" />
      <div className="hero-bg-grid" />

      <div className="container mx-auto px-6 py-28 md:py-36 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-20">

          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 text-center lg:text-left"
          >
            {/* Availability / Security Status Pill */}
            {profileStats.badge_text && (
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00ff9d]/10 border border-[#00ff9d]/30 text-[#00ff9d] text-xs font-mono font-semibold mb-6 shadow-[0_0_16px_rgba(0,255,157,0.15)]"
              >
                <span className="w-2 h-2 rounded-full bg-[#00ff9d] animate-pulse" />
                <span className="tracking-wide uppercase">{profileStats.badge_text}</span>
              </motion.div>
            )}

            {/* Terminal Greeting Tag */}
            <div className="flex justify-center lg:justify-start mb-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#061017] border border-[#00f0ff]/30 text-[#00f0ff] font-mono text-xs md:text-sm shadow-[0_0_15px_rgba(0,240,255,0.12)] backdrop-blur-md">
                <Terminal size={14} className="text-[#00ff9d] animate-pulse flex-shrink-0" />
                <span className="text-slate-500 font-bold">//</span>
                <span className="font-bold tracking-wider text-slate-200 uppercase">
                  {profileStats.greeting_text || "Hello, I'm"}
                </span>
              </div>
            </div>

            {/* Name */}
            <h1 className="hero-developer-name text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-3 leading-tight tracking-tight">
              {profile?.display_name || profile?.name || "Karanraj"}
            </h1>

            {/* Dynamic Headline / Role from Admin */}
            <AnimatedTitles titles={titles} />

            {/* Location */}
            {profile?.location && (
              <div
                className="flex items-center gap-2.5 justify-center lg:justify-start text-[var(--text-secondary)]"
                style={{ marginTop: '20px', marginBottom: '20px' }}
              >
                <div className="w-7 h-7 rounded-full bg-[#00ff9d]/10 border border-[#00ff9d]/25 flex items-center justify-center text-[#00ff9d] shadow-[0_0_10px_rgba(0,255,157,0.2)]">
                  <MapPin size={13} />
                </div>
                <span className="text-xs md:text-sm font-mono uppercase tracking-wider text-slate-300">
                  {profile.location}
                </span>
              </div>
            )}

            {/* Bio */}
            <p
              className="text-base md:text-lg text-[var(--text-secondary)] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal"
              style={{ marginBottom: '28px' }}
            >
              {cleanBio || "Dedicated Cyber Security Enthusiast & Ethical Hacker focused on securing network infrastructures, identifying vulnerabilities, and developing resilient digital defense mechanisms."}
            </p>

            {/* CTA Buttons */}
            <div
              className="hero-cta-group"
              style={{ gap: '16px', marginTop: '8px', marginBottom: '40px' }}
            >
              <a href="#contact">
                <Button size="lg" className="hire-btn rounded-full font-bold text-sm md:text-base flex items-center justify-center gap-2">
                  <ShieldCheck size={18} />
                  Connect / Hire Me
                </Button>
              </a>
              <a href="#projects">
                <Button size="lg" className="view-work-btn rounded-full font-bold text-sm md:text-base flex items-center justify-center gap-2">
                  <Terminal size={16} />
                  View Security Projects
                </Button>
              </a>
              {profile?.resume_url && (
                <a href={profile.resume_url} target="_blank" rel="noreferrer">
                  <Button size="lg" className="resume-btn rounded-full font-semibold text-sm md:text-base flex items-center justify-center gap-2">
                    Resume <Download size={15} />
                  </Button>
                </a>
              )}
            </div>

            {/* Stats Row */}
            <div
              className="hero-stats-grid"
              style={{ gap: '14px', marginTop: '12px', marginBottom: '16px' }}
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.08 }}
                  className="stat-card group"
                >
                  <div className="text-2xl md:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00f0ff]">
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-[10px] md:text-xs font-mono font-semibold text-slate-400 mt-1.5 uppercase tracking-wider leading-tight group-hover:text-[#00ff9d] transition-colors">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Cyber Security Profile Image Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex-shrink-0 flex justify-center"
          >
            <div className="profile-photo-wrapper group">
              {/* Ambient Radar Glow */}
              <div className="profile-photo-ambient-glow" />

              {/* Radar Orbit Targeting Ring */}
              <div className="profile-photo-tech-outer" />

              {/* Neon Cyber Ring */}
              <div className="profile-photo-ring" />

              {/* Photo Container */}
              <div className="profile-photo-inner">
                <img
                  src={profileImageUrl || "https://ui-avatars.com/api/?name=Karanraj&background=05070A&color=00FF9D&size=400"}
                  alt={profile?.name || "Karanraj"}
                  className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://ui-avatars.com/api/?name=" +
                      encodeURIComponent(profile?.name || "K") +
                      "&background=05070A&color=00FF9D&size=400";
                  }}
                />
              </div>

              {/* Security Status Tag */}
              <div className="profile-code-chip">
                <span className="chip-dot" />
                <span className="font-mono text-[10px] md:text-[11px] font-bold tracking-wider text-[#00ff9d] uppercase">
                  [ SYSTEM SECURE ]
                </span>
              </div>

              {/* Dynamic Floating Badges (Admin Controlled) */}
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
                className="floating-badge floating-badge-1"
              >
                <Shield size={16} className="text-[#00f0ff]" />
                <span className="text-xs font-mono font-bold text-white tracking-wide">
                  {badge1}
                </span>
              </motion.div>

              <motion.div
                animate={{ y: [4, -4, 4] }}
                transition={{ repeat: Infinity, duration: 3.6, ease: "easeInOut" }}
                className="floating-badge floating-badge-2"
              >
                <Terminal size={16} className="text-[#00ff9d]" />
                <span className="text-xs font-mono font-bold text-white tracking-wide">
                  {badge2}
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1.2 }}
          className="hidden 2xl:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-slate-500 pointer-events-none"
        >
          <span className="text-[10px] tracking-[0.25em] font-mono uppercase font-semibold text-[#00ff9d]/70">
            SEC://SCROLL_DOWN
          </span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
            <ArrowDown size={15} className="text-[#00ff9d]" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function AnimatedTitles({ titles }: { titles: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (titles.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % titles.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [titles.length]);

  return (
    <div className="hero-role-wrapper flex items-center justify-center lg:justify-start min-h-[3.5rem] md:min-h-[4rem] mb-3">
      <div className="hero-role-inner flex items-center gap-1.5 sm:gap-2">
        <span className="hero-role-tag">&lt;</span>
        <div className="overflow-hidden py-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={titles[index] || index}
              initial={{ y: 24, opacity: 0, filter: "blur(3px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: -24, opacity: 0, filter: "blur(3px)" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <span className="hero-developer-title">
                {titles[index] || "Cyber Security Specialist"}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
        <span className="hero-role-tag">/&gt;</span>
        <span className="hero-dev-cursor" />
      </div>
    </div>
  );
}
