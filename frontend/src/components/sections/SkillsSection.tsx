"use client";

import { motion } from "framer-motion";
import { Section, MassSectionHeader } from "@/components/ui/section";
import { Skill } from "@/types";
import { Cpu, Shield, Terminal, Network, Code, Server, Wrench, Lock } from "lucide-react";

interface CategoryMeta {
  label: string;
  icon: string;
  color: string;
  order: number;
}

const CATEGORY_META: Record<string, CategoryMeta> = {
  "Security & Defense": { label: "Security & Penetration Testing", icon: "🛡️", color: "#00ff9d", order: 1 },
  "Network & Systems": { label: "Network & Systems Security", icon: "🌐", color: "#00f0ff", order: 2 },
  "Programming & Scripting": { label: "Programming & Scripting", icon: "💻", color: "#38bdf8", order: 3 },
  "Mobile & Web": { label: "Mobile & Web Security", icon: "📱", color: "#818cf8", order: 4 },
  "Databases & Cloud": { label: "Databases & Infrastructure", icon: "🗄️", color: "#34d399", order: 5 },
  "Security Tools": { label: "Security Tools & Linux", icon: "🛠️", color: "#22d3ee", order: 6 },
  "Other": { label: "Specialized Competencies", icon: "⚡", color: "#94a3b8", order: 99 },
};

function getEffectiveCategory(skill: Skill): string {
  const raw = (skill.category || "").trim();
  const name = (skill.name || "").toLowerCase().trim();

  // If already set to a recognized category
  if (raw && raw !== "Other" && raw !== "Select category...") {
    if (/security|penetration|ethical|hacking|soc|forensic/i.test(raw)) return "Security & Defense";
    if (/network|system|linux|os/i.test(raw)) return "Network & Systems";
    if (/prog|script|lang|code/i.test(raw)) return "Programming & Scripting";
    if (/mobile|web|front/i.test(raw)) return "Mobile & Web";
    if (/data|cloud|infra|back/i.test(raw)) return "Databases & Cloud";
    if (/tool|devops/i.test(raw)) return "Security Tools";
  }

  // Automatic smart classifier by skill name
  if (/security|penetration|metasploit|wireshark|nmap|burp|owasp|soc|forensics|crypto|reverse|malware|kali/i.test(name)) {
    return "Security & Defense";
  }
  if (/network|tcp|ip|dns|firewall|linux|ubuntu|bash|shell|server/i.test(name)) {
    return "Network & Systems";
  }
  if (/python|c\+\+|c(?!\+)|java(?!\s*script)|golang|rust|ruby/i.test(name)) {
    return "Programming & Scripting";
  }
  if (/flutter|dart|react|next|javascript|typescript|html|css|mobile|android|ios/i.test(name)) {
    return "Mobile & Web";
  }
  if (/sql|mongo|postgres|redis|firebase|docker|aws|cloud|backend|node|express/i.test(name)) {
    return "Databases & Cloud";
  }
  if (/git|github|postman|vs\s*code|jira|figma/i.test(name)) {
    return "Security Tools";
  }

  return "Other";
}

function getCategoryConfig(category: string): CategoryMeta {
  return CATEGORY_META[category] || {
    label: category,
    icon: "⚡",
    color: "#00ff9d",
    order: 50,
  };
}

export function SkillsSection({ skills }: { skills: Skill[] }) {
  if (!skills || skills.length === 0) return null;

  // 1. Deduplicate skills by name (keep highest proficiency)
  const uniqueMap = new Map<string, Skill>();
  skills.forEach((skill) => {
    const key = skill.name.toLowerCase().trim();
    if (!uniqueMap.has(key) || skill.proficiency > (uniqueMap.get(key)?.proficiency || 0)) {
      uniqueMap.set(key, skill);
    }
  });
  const cleanSkills = Array.from(uniqueMap.values());

  // 2. Group into smart categories
  const grouped = cleanSkills.reduce((acc, skill) => {
    const cat = getEffectiveCategory(skill);
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  // Sort skills within each category by proficiency (descending)
  Object.values(grouped).forEach((list) => {
    list.sort((a, b) => b.proficiency - a.proficiency);
  });

  // 3. Sort categories in logical order
  const sortedCategories = Object.keys(grouped).sort((a, b) => {
    const orderA = getCategoryConfig(a).order;
    const orderB = getCategoryConfig(b).order;
    return orderA - orderB;
  });

  return (
    <Section id="skills">
      <MassSectionHeader
        badge="Technical Arsenal & Weaponry"
        titleWhite="Technical"
        titleGradient="Arsenal"
        subtitle="Core competencies, defense toolsets, and scripting languages leveraged in security research and systems analysis."
        watermark="ARSENAL"
        icon={<Cpu size={14} />}
      />

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '26px', marginTop: '16px' }}>
        {sortedCategories.map((category, catIdx) => {
          const config = getCategoryConfig(category);
          const catSkills = grouped[category];

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: catIdx * 0.07, duration: 0.4 }}
              className="skill-group-card rounded-3xl border border-white/10 bg-[var(--glass-bg)] hover:border-[#00ff9d]/40 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.6),0_0_20px_rgba(0,255,157,0.1)] flex flex-col justify-between"
              style={{ padding: '28px 24px' }}
            >
              {/* Category Header */}
              <div className="flex items-center gap-3" style={{ marginBottom: '24px' }}>
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg border border-white/10 flex-shrink-0 shadow-[0_0_15px_rgba(0,0,0,0.4)]"
                  style={{ background: `${config.color}15`, borderColor: `${config.color}35` }}
                >
                  <span>{config.icon}</span>
                </div>
                <h3 className="text-base md:text-lg font-bold text-white tracking-tight leading-snug">{config.label}</h3>
                <span className="ml-auto text-[10px] font-mono font-bold text-slate-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full flex-shrink-0">
                  {catSkills.length}
                </span>
              </div>

              {/* Skill Bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {catSkills.map((skill, skillIdx) => (
                  <div key={skill.id || skill.name}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs md:text-sm font-semibold text-slate-200">{skill.name}</span>
                      <span
                        className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/5"
                        style={{ color: config.color }}
                      >
                        {skill.proficiency}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-[#05080e] border border-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.proficiency}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, delay: catIdx * 0.05 + skillIdx * 0.03, ease: "easeOut" }}
                        className="h-full rounded-full relative overflow-hidden"
                        style={{
                          background: `linear-gradient(90deg, ${config.color} 0%, #00f0ff 100%)`,
                          boxShadow: `0 0 10px ${config.color}80`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
