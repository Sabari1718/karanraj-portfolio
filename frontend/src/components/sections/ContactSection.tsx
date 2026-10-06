"use client";

import { useState } from "react";
import { Section, MassSectionHeader } from "@/components/ui/section";
import { PortfolioAPI } from "@/services/api";
import { Send, Mail, MapPin, Phone, ExternalLink, ShieldCheck, Terminal, CheckCircle2, AlertCircle } from "lucide-react";
import { SocialLink, Profile } from "@/types";
import { motion } from "framer-motion";

const LinkedinIcon = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const GithubIcon = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

export function ContactSection({
  profile,
  socialLinks,
}: {
  profile: Profile | null;
  socialLinks: SocialLink[];
}) {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await PortfolioAPI.submitContact(formData);
      if (res.success) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const contactInfo = [
    profile?.email ? { icon: Mail, label: "Encrypted Email", value: profile.email, href: `mailto:${profile.email}` } : null,
    profile?.location ? { icon: MapPin, label: "Operational Region", value: profile.location, href: null } : null,
    profile?.phone ? { icon: Phone, label: "Direct Comms", value: profile.phone, href: `tel:${profile.phone}` } : null,
  ].filter(Boolean) as { icon: any; label: string; value: string; href: string | null }[];

  return (
    <Section id="contact" className="bg-white/[0.015]">
      <MassSectionHeader
        badge="Encrypted Direct Channel"
        titleWhite="Transmit"
        titleGradient="Message"
        subtitle="Initiate contact for security roles, technical research, vulnerability assessments, or engineering inquiries."
        watermark="TRANSMIT"
        icon={<Terminal size={14} />}
      />

      <div className="grid lg:grid-cols-5 max-w-6xl mx-auto" style={{ gap: '48px' }}>
        {/* Left: Security Info & Identity */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-2 flex flex-col gap-6"
        >
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Initiate Secure Connection</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Open to full-time cybersecurity opportunities, defensive operations, SOC internships, and security research collaboration.
            </p>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-4 mt-2">
            {contactInfo.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#080d16] border border-white/5 hover:border-[#00ff9d]/30 transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-[#00ff9d]/10 flex items-center justify-center text-[#00ff9d] group-hover:scale-105 transition-transform flex-shrink-0">
                  <Icon size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">{label}</p>
                  {href ? (
                    <a href={href} className="text-xs md:text-sm font-semibold text-slate-200 hover:text-[#00ff9d] transition-colors">{value}</a>
                  ) : (
                    <p className="text-xs md:text-sm font-semibold text-slate-200">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Social Profiles */}
          <div className="pt-4 border-t border-white/5">
            <p className="text-[11px] font-mono text-slate-400 uppercase tracking-widest font-semibold mb-3">
              Official Profiles
            </p>
            <div className="flex flex-wrap gap-2.5">
              <a
                href={profile?.github_url || "https://github.com/karanraj"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:border-[#00ff9d]/50 hover:bg-[#00ff9d]/10 transition-all text-xs font-mono font-semibold"
              >
                <GithubIcon size={15} />
                <span>GitHub</span>
                <ExternalLink size={11} className="opacity-50" />
              </a>

              <a
                href={profile?.linkedin_url || "https://linkedin.com/in/karanraj"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:border-[#00f0ff]/50 hover:bg-[#00f0ff]/10 transition-all text-xs font-mono font-semibold"
              >
                <LinkedinIcon size={15} className="text-[#00f0ff]" />
                <span>LinkedIn</span>
                <ExternalLink size={11} className="opacity-50" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Right: Cyber Transmission Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-3"
        >
          <div className="rounded-3xl border border-white/10 bg-[var(--glass-bg)] p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/5">
              <div className="flex items-center gap-2 text-xs font-mono text-[#00ff9d]">
                <Terminal size={14} />
                <span>TERMINAL://COMMS_BUFFER</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">[ READY ]</span>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-300 mb-1.5">
                    Sender Name <span className="text-[#00ff9d]">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Alex Mercer"
                    className="w-full bg-[#05080e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00ff9d] focus:ring-1 focus:ring-[#00ff9d]/30 transition-all font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-300 mb-1.5">
                    Sender Email <span className="text-[#00ff9d]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="alex@company.com"
                    className="w-full bg-[#05080e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00ff9d] focus:ring-1 focus:ring-[#00ff9d]/30 transition-all font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-slate-300 mb-1.5">
                  Subject / Topic
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Security Analyst Position / Consultation"
                  className="w-full bg-[#05080e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00ff9d] focus:ring-1 focus:ring-[#00ff9d]/30 transition-all font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-slate-300 mb-1.5">
                  Message Payload <span className="text-[#00ff9d]">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Detail your inquiry, opportunity, or collaboration proposal..."
                  className="w-full bg-[#05080e] border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00ff9d] focus:ring-1 focus:ring-[#00ff9d]/30 transition-all resize-none font-sans"
                />
              </div>

              {status === "success" && (
                <div className="flex items-center gap-2 p-3 bg-[#00ff9d]/10 border border-[#00ff9d]/30 rounded-xl text-[#00ff9d] text-xs font-mono">
                  <CheckCircle2 size={16} className="shrink-0" />
                  <span>TRANSMISSION SUCCESSFUL. Payload delivered securely to database.</span>
                </div>
              )}

              {status === "error" && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-mono">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>TRANSMISSION ERROR. Please verify your connection or reach out via direct email.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="mt-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00ff9d] to-[#00f0ff] text-black font-extrabold text-sm tracking-wider uppercase font-mono shadow-[0_0_20px_rgba(0,255,157,0.35)] hover:shadow-[0_0_30px_rgba(0,255,157,0.55)] transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {status === "loading" ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>ENCRYPTING & TRANSMITTING...</span>
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    <span>DISPATCH MESSAGE</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
