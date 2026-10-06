"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Section, MassSectionHeader } from "@/components/ui/section";
import { Project } from "@/types";
import { Code, ExternalLink, Star, Shield, Terminal, Globe, ArrowUpRight, Cpu } from "lucide-react";

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const [activeFilter, setActiveFilter] = useState("All");

  if (!projects || projects.length === 0) return null;

  // Build filter tabs from project types
  const types = ["All", ...Array.from(new Set(projects.map((p) => p.type || "Other").filter(Boolean)))];

  const filtered = activeFilter === "All" ? projects : projects.filter((p) => (p.type || "Other") === activeFilter);

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

  const formatFilterLabel = (t: string) => {
    if (t.toLowerCase() === "all") return "All Projects";
    return t.charAt(0).toUpperCase() + t.slice(1);
  };

  return (
    <Section id="projects" className="bg-white/[0.015]">
      {/* Section Header */}
      <MassSectionHeader
        badge="Security & Development Portfolio"
        titleWhite="Featured"
        titleGradient="Projects"
        subtitle="A selection of security implementations, defensive architectures, and high-performance software projects."
        watermark="PROJECTS"
        icon={<Terminal size={14} />}
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center items-center" style={{ gap: '12px', marginBottom: '48px' }}>
        {types.map((type) => {
          const isActive = activeFilter === type;
          return (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`px-6 py-2 rounded-full text-xs font-mono font-bold tracking-wider transition-all duration-300 cursor-pointer ${
                isActive
                  ? "bg-gradient-to-r from-[#00ff9d] to-[#00f0ff] text-black shadow-[0_0_24px_rgba(0,255,157,0.45)] scale-105"
                  : "bg-[#080d16] text-slate-300 border border-white/10 hover:border-[#00ff9d]/40 hover:text-white"
              }`}
            >
              {formatFilterLabel(type)}
            </button>
          );
        })}
      </div>

      {/* Projects Grid */}
      <motion.div
        key={activeFilter}
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        style={{ gap: '32px' }}
      >
        {filtered.map((project, index) => {
          return (
            <motion.div key={project.id || index} variants={item} className="h-full">
              <div className="project-card group h-full flex flex-col rounded-3xl overflow-hidden border border-white/10 bg-[var(--glass-bg)] hover:border-[#00ff9d]/45 transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_24px_48px_rgba(0,0,0,0.7),0_0_25px_rgba(0,255,157,0.15)]">
                {/* Project Image / Banner */}
                <div className="relative h-48 overflow-hidden bg-[#060a12]">
                  {project.image_url ? (
                    <>
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-108"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17] via-black/40 to-transparent" />
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#060a12] via-[#09101d] to-[#04070e] flex flex-col items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#00ff9d_1px,transparent_1px)] [background-size:16px_16px]" />
                      <div className="relative z-10 w-14 h-14 rounded-2xl bg-[#00ff9d]/10 border border-[#00ff9d]/25 flex items-center justify-center text-[#00ff9d] shadow-[0_0_20px_rgba(0,255,157,0.2)] group-hover:scale-110 transition-transform">
                        <Terminal size={24} />
                      </div>
                      <span className="relative z-10 text-[10px] font-mono uppercase tracking-widest text-slate-400 mt-2">
                        {project.type || "System Module"}
                      </span>
                    </div>
                  )}

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-center pointer-events-none">
                    {project.featured ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00ff9d]/20 border border-[#00ff9d]/40 text-[#00ff9d] text-xs font-mono font-bold backdrop-blur-md shadow-[0_0_12px_rgba(0,255,157,0.25)]">
                        <Star size={11} fill="currentColor" />
                        Featured
                      </span>
                    ) : <div />}

                    {project.type && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00f0ff]/15 border border-[#00f0ff]/30 text-[#00f0ff] text-xs font-mono font-semibold backdrop-blur-md">
                        <Globe size={11} />
                        {project.type}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-6" style={{ padding: '24px 22px' }}>
                  <div className="flex justify-between items-start mb-2.5 gap-2">
                    <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-[#00ff9d] transition-colors leading-snug">
                      {project.title}
                    </h3>
                    <div className="flex gap-1.5 flex-shrink-0">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noreferrer"
                          title="View Repository"
                          className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#00ff9d]/15 border border-white/10 hover:border-[#00ff9d]/40 flex items-center justify-center text-slate-300 hover:text-[#00ff9d] transition-all hover:scale-105"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Code size={15} />
                        </a>
                      )}
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noreferrer"
                          title="Live Deployment"
                          className="w-8 h-8 rounded-full bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff] transition-all hover:scale-105 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink size={15} />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-xs md:text-sm text-slate-400 flex-1 leading-relaxed mb-4 font-sans">
                    {project.short_description || (project.description ? project.description.substring(0, 130) + "..." : "Engineered with clean code and robust system security.")}
                  </p>

                  {/* Tech stack tags */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span key={tech.id} className="tech-tag text-[10px]">
                          {tech.technology}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </Section>
  );
}
