"use client";

import { motion } from "framer-motion";
import { Section, MassSectionHeader } from "@/components/ui/section";
import { Card, CardContent } from "@/components/ui/card";
import { Experience, Education } from "@/types";
import { Briefcase, GraduationCap, Calendar, MapPin, Award, Building, ShieldCheck, Terminal } from "lucide-react";

export function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  if (!experiences || experiences.length === 0) return null;

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };
  const item = { hidden: { opacity: 0, x: -30 }, show: { opacity: 1, x: 0, transition: { duration: 0.5 } } };

  const getDuration = (exp: Experience) => {
    const start = exp.start_date ? new Date(exp.start_date) : null;
    const end = exp.currently_working ? new Date() : (exp.end_date ? new Date(exp.end_date) : null);
    if (!start || !end) return "";
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    const yrs = Math.floor(months / 12);
    const mos = months % 12;
    if (yrs === 0) return `${mos} mo`;
    if (mos === 0) return `${yrs} yr`;
    return `${yrs} yr ${mos} mo`;
  };

  return (
    <Section id="experience">
      <MassSectionHeader
        badge="Career & Field Work"
        titleWhite="Professional"
        titleGradient="Experience"
        subtitle="Security roles, systems engineering, and defensive operations across my technical journey."
        watermark="EXPERIENCE"
        icon={<Briefcase size={14} />}
      />

      <div className="max-w-3xl mx-auto">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative"
        >
          {/* Timeline line with Cyber Gradient */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#00ff9d] via-[#00f0ff]/30 to-transparent hidden sm:block" />

          <div className="flex flex-col">
            {experiences.map((exp, i) => (
              <motion.div key={exp.id || i} variants={item} className="relative sm:pl-20" style={{ marginBottom: '64px' }}>
                {/* Timeline cyber dot */}
                <div className="absolute left-0 top-6 w-12 h-12 rounded-full bg-[#05070a] border-2 border-[#00ff9d] hidden sm:flex items-center justify-center shadow-[0_0_15px_rgba(0,255,157,0.35)]">
                  {exp.logo_url ? (
                    <img src={exp.logo_url} alt={exp.company} className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <ShieldCheck size={18} className="text-[#00ff9d]" />
                  )}
                </div>

                <Card className="exp-card hover:border-[#00ff9d]/40 transition-all duration-400 group">
                  <CardContent style={{ padding: '36px' }}>
                    <div className="flex flex-wrap justify-between items-start" style={{ gap: '16px', marginBottom: '20px' }}>
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-[#00ff9d] transition-colors mb-1.5">{exp.role}</h3>
                        <h4 className="text-base md:text-lg text-[#00f0ff] font-medium font-mono">{exp.company}</h4>
                      </div>
                      {Boolean(exp.currently_working) ? (
                        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#00ff9d]/15 border border-[#00ff9d]/30 text-[#00ff9d] flex-shrink-0 shadow-[0_0_10px_rgba(0,255,157,0.2)]">
                          [ ACTIVE ]
                        </span>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap text-xs md:text-sm font-mono text-slate-400" style={{ gap: '16px', marginBottom: '16px' }}>
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-[#00ff9d]" />
                        <span>
                          {exp.start_date ? new Date(exp.start_date).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "?"} —{" "}
                          {Boolean(exp.currently_working) ? "Present" : exp.end_date ? new Date(exp.end_date).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Present"}
                        </span>
                        {getDuration(exp) && (
                          <span className="px-2 py-0.5 rounded-full bg-white/5 text-xs text-slate-300">{getDuration(exp)}</span>
                        )}
                      </div>
                      {exp.location && (
                        <div className="flex items-center gap-1.5">
                          <MapPin size={13} className="text-[#00f0ff]" />
                          <span>{exp.location}</span>
                        </div>
                      )}
                    </div>

                    {exp.description && (
                      <p className="text-sm text-slate-300 leading-relaxed font-sans">{exp.description}</p>
                    )}

                    {exp.technologies && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {exp.technologies.split(",").map((tech) => (
                          <span key={tech.trim()} className="tech-tag">
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

export function EducationSection({ education }: { education: Education[] }) {
  if (!education || education.length === 0) return null;

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };
  const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

  return (
    <Section id="education" className="bg-white/[0.015]">
      {/* Section Header */}
      <MassSectionHeader
        badge="Academic Foundations"
        titleWhite="Education &"
        titleGradient="Qualifications"
        subtitle="Academic degree milestones that shaped my software engineering and computing foundations."
        watermark="EDUCATION"
        icon={<GraduationCap size={14} />}
      />

      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ gap: '28px' }}
        >
          {education.map((edu, i) => {
            const startYear = edu.start_date ? new Date(edu.start_date).getFullYear() : "";
            const endYear = edu.end_date ? new Date(edu.end_date).getFullYear() : "Present";
            const dateStr = startYear ? `${startYear} — ${endYear}` : endYear;

            return (
              <motion.div key={edu.id || i} variants={item} className="h-full flex">
                <Card className="edu-card w-full flex flex-col justify-between group hover:border-[#00f0ff]/40 transition-all duration-400">
                  <CardContent style={{ padding: '32px 28px' }} className="flex flex-col flex-1">
                    {/* Top row: Icon & Dates */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/25 flex items-center justify-center text-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.15)] group-hover:scale-105 transition-transform">
                        <GraduationCap size={20} />
                      </div>
                      <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                        {dateStr}
                      </span>
                    </div>

                    {/* Degree & Field */}
                    <div className="flex-1">
                      <h4 className="text-lg md:text-xl font-bold text-white group-hover:text-[#00f0ff] transition-colors mb-1.5">
                        {edu.degree} {edu.field ? `in ${edu.field}` : ""}
                      </h4>
                      <h5 className="text-sm font-mono text-[#00ff9d] mb-3 flex items-center gap-1.5">
                        <Building size={13} />
                        {edu.institution}
                      </h5>

                      {edu.grade && (
                        <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#00f0ff] bg-[#00f0ff]/10 border border-[#00f0ff]/20 px-2.5 py-1 rounded-lg mb-3">
                          <Award size={12} />
                          <span>Grade: {edu.grade}</span>
                        </div>
                      )}

                      {edu.description && (
                        <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-sans mt-2">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </Section>
  );
}
