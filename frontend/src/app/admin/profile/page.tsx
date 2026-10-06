"use client";

import { useEffect, useState } from "react";
import { PortfolioAPI } from "@/services/api";
import { Profile } from "@/types";
import {
  User, Mail, Phone, MapPin, Globe, GitFork, Link2,
  Link as LinkIcon2, FileText, CheckCircle, AlertCircle, Loader2, Save,
  Cpu, Folder, Briefcase, Sparkles, Shield, Terminal, Lock, Key, ShieldCheck
} from "lucide-react";
import { AdminPageHeader, AdminCard } from "@/components/admin/admin-ui";
import { extractProfileStats, embedProfileStats, DEFAULT_BIO, HeroStatsData } from "@/lib/profile-stats";

interface AdminProfileForm extends Partial<Profile>, HeroStatsData {}

const EMPTY_PROFILE: AdminProfileForm = {
  name: "Karanraj",
  display_name: "Karanraj",
  headline: "Cyber Security Enthusiast | Ethical Hacking",
  bio: DEFAULT_BIO,
  location: "Tamil Nadu, India",
  email: "",
  phone: "",
  resume_url: "",
  github_url: "",
  linkedin_url: "",
  portfolio_url: "",
  twitter_url: "",
  years_experience: "2+",
  projects_count: "1+",
  technologies_count: "15+",
  repos_count: "10+",
  badge_text: "Open to Opportunities",
  greeting_text: "Hello, I'm",
  hero_badge_1: "Cyber Security",
  hero_badge_2: "Ethical Hacking",
  security_focus: "Penetration Testing & Defense",
};

type SaveStatus = "idle" | "saving" | "success" | "error";

export default function ProfileAdmin() {
  const [form, setForm] = useState<AdminProfileForm>(EMPTY_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await PortfolioAPI.getProfile();
      if (res.success && res.data) {
        const { stats: extractedStats, cleanBio } = extractProfileStats(res.data);
        setForm((prev) => ({
          ...EMPTY_PROFILE,
          ...res.data,
          bio: cleanBio || prev.bio || DEFAULT_BIO,
          location: res.data.location || prev.location || "Tamil Nadu, India",
          years_experience: extractedStats.years_experience || prev.years_experience || "2+",
          projects_count: extractedStats.projects_count || prev.projects_count || "1+",
          technologies_count: extractedStats.technologies_count || prev.technologies_count || "15+",
          repos_count: extractedStats.repos_count || prev.repos_count || "10+",
          badge_text: extractedStats.badge_text || prev.badge_text || "Open to Opportunities",
          greeting_text: extractedStats.greeting_text || prev.greeting_text || "Hello, I'm",
          hero_badge_1: extractedStats.hero_badge_1 || prev.hero_badge_1 || "Cyber Security",
          hero_badge_2: extractedStats.hero_badge_2 || prev.hero_badge_2 || "Ethical Hacking",
          security_focus: extractedStats.security_focus || prev.security_focus || "Penetration Testing & Defense",
        }));
      }
    } catch {
      // profile might not exist yet — use empty form
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (saveStatus !== "idle") setSaveStatus("idle");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name?.trim()) {
      setSaveStatus("error");
      setErrorMsg("Full name is required.");
      return;
    }
    setSaveStatus("saving");
    setErrorMsg("");

    // Send dual-layer payload so both existing and updated backend persist the stats & badges
    const payload = {
      ...form,
      bio: embedProfileStats(form.bio, form),
    };

    try {
      const res = await PortfolioAPI.updateProfile(payload);
      if (res.success) {
        setSaveStatus("success");
        setForm((prev) => ({ ...prev, ...form }));
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("error");
        setErrorMsg(res.message || "Failed to save profile.");
      }
    } catch {
      setSaveStatus("error");
      setErrorMsg("Network error. Could not reach the server.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#00ff9d]" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-12">
      <AdminPageHeader
        badge="SECURITY IDENTITY"
        title="Profile"
        titleAccent="Settings"
        subtitle="Configure your cyber security credentials, public headline, hero badges, location, metrics, and communications."
        icon={<Shield size={14} />}
      />

      <form onSubmit={handleSave} className="flex flex-col gap-8">
        
        {/* ── 1. IDENTITY ─────────────────────────────── */}
        <AdminCard
          title="Identity & Core Credentials"
          subtitle="Primary personal details displayed across navigation, hero banner, and metadata."
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field
                label="Full Name"
                name="name"
                value={form.name ?? ""}
                onChange={handleChange}
                placeholder="Karanraj"
                required
                icon={<User size={16} />}
                helperText="Primary name displayed in the hero and page title"
              />
              <Field
                label="Display Name"
                name="display_name"
                value={form.display_name ?? ""}
                onChange={handleChange}
                placeholder="Karanraj"
                icon={<Terminal size={16} />}
                helperText="Shown on brand logo, header chip, and credentials"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Field
                  label="Headline (Role & Specialization)"
                  name="headline"
                  value={form.headline ?? ""}
                  onChange={handleChange}
                  placeholder="e.g. Cyber Security Enthusiast | Ethical Hacker"
                  helperText="Controls the dynamic role shown directly below your name on the homepage"
                />
                <div className="flex flex-wrap gap-1.5 -mt-2 mb-2">
                  <span className="text-[10px] text-slate-500 self-center font-mono uppercase">Presets:</span>
                  {[
                    "Cyber Security Enthusiast",
                    "Cyber Security Student | Ethical Hacking Enthusiast",
                    "SOC Analyst | Threat Hunter",
                    "Penetration Tester | Security Researcher"
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, headline: preset }))}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 hover:bg-[#00ff9d]/20 text-slate-300 hover:text-[#00ff9d] border border-white/10 hover:border-[#00ff9d]/40 transition-all cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <Field
                label="Operational Location"
                name="location"
                value={form.location ?? ""}
                onChange={handleChange}
                placeholder="e.g. Tamil Nadu, India"
                icon={<MapPin size={16} />}
                helperText="Shown with geographic radar pin directly on the hero"
              />
            </div>
          </div>
        </AdminCard>

        {/* ── 2. SECURITY PROFILE & HERO BADGES ──────── */}
        <AdminCard
          title="Security Profile & Hero Image Badges"
          subtitle="Configure the two floating dynamic badges rendered around your profile image on the homepage."
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Field
                  label="Hero Floating Badge #1 (Primary Expertise)"
                  name="hero_badge_1"
                  value={form.hero_badge_1 ?? "Cyber Security"}
                  onChange={handleChange}
                  placeholder="e.g. Cyber Security"
                  icon={<ShieldCheck size={16} />}
                  helperText="Top-right floating badge on homepage hero avatar"
                />
                <div className="flex flex-wrap gap-1.5 -mt-2 mb-2">
                  <span className="text-[10px] text-slate-500 self-center font-mono uppercase">Presets:</span>
                  {[
                    "Cyber Security",
                    "Ethical Hacking",
                    "SOC Analyst",
                    "Penetration Testing",
                    "Network Security"
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, hero_badge_1: preset }))}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 hover:bg-[#00f0ff]/20 text-slate-300 hover:text-[#00f0ff] border border-white/10 hover:border-[#00f0ff]/40 transition-all cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Field
                  label="Hero Floating Badge #2 (Secondary Focus)"
                  name="hero_badge_2"
                  value={form.hero_badge_2 ?? "Ethical Hacking"}
                  onChange={handleChange}
                  placeholder="e.g. Ethical Hacking"
                  icon={<Terminal size={16} />}
                  helperText="Bottom-left floating badge on homepage hero avatar"
                />
                <div className="flex flex-wrap gap-1.5 -mt-2 mb-2">
                  <span className="text-[10px] text-slate-500 self-center font-mono uppercase">Presets:</span>
                  {[
                    "Ethical Hacking",
                    "Penetration Testing",
                    "Digital Forensics",
                    "Web Security",
                    "Linux & Python"
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, hero_badge_2: preset }))}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 hover:bg-[#00ff9d]/20 text-slate-300 hover:text-[#00ff9d] border border-white/10 hover:border-[#00ff9d]/40 transition-all cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Field
              label="Cybersecurity Focus & Specialization"
              name="security_focus"
              value={form.security_focus ?? "Penetration Testing & Defense"}
              onChange={handleChange}
              placeholder="e.g. Defensive Operations, Web Application Auditing, Threat Intelligence"
              icon={<Lock size={16} />}
              helperText="Internal classification and metadata for portfolio positioning"
            />
          </div>
        </AdminCard>

        {/* ── 3. HERO CONFIGURATION ───────────────────── */}
        <AdminCard
          title="Hero Banner & Status Configuration"
          subtitle="Customize the recruiter availability pill, terminal greeting tag, and hero biography."
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Field
                  label="Availability / Security Clearance Badge"
                  name="badge_text"
                  value={form.badge_text ?? "Open to Opportunities"}
                  onChange={handleChange}
                  placeholder="e.g. Open to Opportunities"
                  helperText="Displays in pulsing pill above your name on the homepage"
                  icon={<Sparkles size={16} />}
                />
                <div className="flex flex-wrap gap-1.5 -mt-2 mb-2">
                  <span className="text-[10px] text-slate-500 self-center font-mono uppercase">Presets:</span>
                  {[
                    "Open to Opportunities",
                    "Available for Security Roles",
                    "Open to SOC Roles",
                    "Ready for Deployment"
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, badge_text: preset }))}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 hover:bg-[#00ff9d]/20 text-slate-300 hover:text-[#00ff9d] border border-white/10 hover:border-[#00ff9d]/40 transition-all cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Field
                  label="Terminal Greeting / Subheading"
                  name="greeting_text"
                  value={form.greeting_text ?? "Hello, I'm"}
                  onChange={handleChange}
                  placeholder="e.g. Hello, I'm"
                  helperText="Displays in terminal prompt tag above your name"
                  icon={<Terminal size={16} />}
                />
                <div className="flex flex-wrap gap-1.5 -mt-2 mb-2">
                  <span className="text-[10px] text-slate-500 self-center font-mono uppercase">Presets:</span>
                  {[
                    "Hello, I'm",
                    "Security Clearance: Verified",
                    "Security Researcher",
                    "SOC Analyst"
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, greeting_text: preset }))}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 hover:bg-[#00f0ff]/20 text-slate-300 hover:text-[#00f0ff] border border-white/10 hover:border-[#00f0ff]/40 transition-all cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs md:text-sm font-mono font-semibold text-slate-200 tracking-wide">
                  Hero Introduction & Bio Tagline
                </label>
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, bio: DEFAULT_BIO }))}
                  className="text-[11px] text-[#00ff9d] hover:underline cursor-pointer font-mono"
                >
                  ↺ Reset to cyber security default
                </button>
              </div>
              <textarea
                name="bio"
                value={form.bio ?? ""}
                onChange={handleChange}
                rows={4}
                placeholder="Introduce yourself, your security philosophy, and key domains of expertise..."
                className="w-full bg-[#05080e] border border-white/10 rounded-xl p-4 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#00ff9d] focus:ring-1 focus:ring-[#00ff9d]/30 transition-all resize-none leading-relaxed font-sans"
              />
              <p className="text-[11px] text-slate-500 ml-1 font-mono">
                This exact text displays directly under your location pin on the homepage hero.
              </p>
            </div>
          </div>
        </AdminCard>

        {/* ── 4. HOME PAGE HERO COUNTERS & METRICS ───── */}
        <AdminCard 
          title="Hero Numerical Metrics & Counters" 
          subtitle="Configure the 4 telemetry counters displayed beneath the hero content."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Field
              label="Years Experience"
              name="years_experience"
              value={form.years_experience !== undefined && form.years_experience !== null ? String(form.years_experience) : "2+"}
              onChange={handleChange}
              placeholder="2+"
              icon={<Briefcase size={16} />}
              helperText="e.g. 2+"
            />
            <Field
              label="Security Projects"
              name="projects_count"
              value={form.projects_count !== undefined && form.projects_count !== null ? String(form.projects_count) : "1+"}
              onChange={handleChange}
              placeholder="1+"
              icon={<Folder size={16} />}
              helperText="e.g. 1+"
            />
            <Field
              label="Arsenal / Tools"
              name="technologies_count"
              value={form.technologies_count !== undefined && form.technologies_count !== null ? String(form.technologies_count) : "15+"}
              onChange={handleChange}
              placeholder="15+"
              icon={<Cpu size={16} />}
              helperText="e.g. 15+"
            />
            <Field
              label="Security Repos"
              name="repos_count"
              value={form.repos_count !== undefined && form.repos_count !== null ? String(form.repos_count) : "10+"}
              onChange={handleChange}
              placeholder="10+"
              icon={<GitFork size={16} />}
              helperText="e.g. 10+"
            />
          </div>

          {/* Live Interactive Cyber Preview */}
          <div className="mt-8 pt-6 border-t border-white/5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00ff9d] animate-pulse" />
                Live Telemetry Preview:
              </p>
              <span className="text-[11px] text-[#00ff9d] font-mono font-medium">[ Real-time sync ]</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#05070a] border border-[#00ff9d]/15">
              <div className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00f0ff]">
                  {form.years_experience || "2+"}
                </div>
                <div className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider mt-1.5">
                  Years Experience
                </div>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00f0ff]">
                  {form.projects_count || "1+"}
                </div>
                <div className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider mt-1.5">
                  Projects Built
                </div>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00f0ff]">
                  {form.technologies_count || "15+"}
                </div>
                <div className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider mt-1.5">
                  Technologies
                </div>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] to-[#00f0ff]">
                  {form.repos_count || "10+"}
                </div>
                <div className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider mt-1.5">
                  GitHub Repos
                </div>
              </div>
            </div>
          </div>
        </AdminCard>

        {/* ── 5. CONTACT & DISPATCH ───────────────────── */}
        <AdminCard title="Contact Channels & Transmission" subtitle="Details used for hire inquiries and communication buttons.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field
              label="Encrypted Contact Email"
              name="email"
              value={form.email ?? ""}
              onChange={handleChange}
              placeholder="karanraj@example.com"
              type="email"
              icon={<Mail size={16} />}
            />
            <Field
              label="Direct Phone / Comms"
              name="phone"
              value={form.phone ?? ""}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              type="tel"
              icon={<Phone size={16} />}
            />
            <div className="md:col-span-2">
              <Field
                label="Resume URL / Security Dossier"
                name="resume_url"
                value={form.resume_url ?? ""}
                onChange={handleChange}
                placeholder="https://drive.google.com/..."
                type="url"
                icon={<FileText size={16} />}
                helperText="Link for the Resume button on the homepage hero banner"
              />
            </div>
          </div>
        </AdminCard>

        {/* ── 6. SOCIAL PROFILES ──────────────────────── */}
        <AdminCard title="Social Links & Repositories" subtitle="Public technical links shown in hero and contact sections.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field
              label="GitHub Profile URL"
              name="github_url"
              value={form.github_url ?? ""}
              onChange={handleChange}
              placeholder="https://github.com/username"
              type="url"
              icon={<GitFork size={16} />}
            />
            <Field
              label="LinkedIn Profile URL"
              name="linkedin_url"
              value={form.linkedin_url ?? ""}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
              type="url"
              icon={<Link2 size={16} />}
            />
            <Field
              label="Portfolio URL"
              name="portfolio_url"
              value={form.portfolio_url ?? ""}
              onChange={handleChange}
              placeholder="https://karanraj.dev"
              type="url"
              icon={<Globe size={16} />}
            />
            <Field
              label="Twitter / X Profile URL"
              name="twitter_url"
              value={form.twitter_url ?? ""}
              onChange={handleChange}
              placeholder="https://twitter.com/username"
              type="url"
              icon={<LinkIcon2 size={16} />}
            />
          </div>
        </AdminCard>

        {/* ── Status & Save Actions ─────────────────────── */}
        {saveStatus === "error" && (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs md:text-sm font-mono font-medium">
            <AlertCircle size={18} className="shrink-0" />
            <span>ERROR: {errorMsg}</span>
          </div>
        )}
        {saveStatus === "success" && (
          <div className="flex items-center gap-3 p-4 bg-[#00ff9d]/10 border border-[#00ff9d]/30 rounded-xl text-[#00ff9d] text-xs md:text-sm font-mono font-medium shadow-[0_0_20px_rgba(0,255,157,0.15)]">
            <CheckCircle size={18} className="shrink-0" />
            <span>[ SYSTEM CONFIRMED ] Profile settings saved to MySQL successfully.</span>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saveStatus === "saving"}
            className="flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-[#00ff9d] to-[#00f0ff] text-black font-extrabold rounded-xl hover:scale-105 hover:shadow-[0_0_25px_rgba(0,255,157,0.45)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 font-mono text-sm cursor-pointer"
          >
            {saveStatus === "saving" ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>SAVING TO MYSQL...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>SAVE PROFILE CONFIGURATION</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Reusable sub-components ──────────────────────────────────────────────────

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  icon,
  helperText,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  icon?: React.ReactNode;
  helperText?: string;
}) {
  return (
    <div className="flex flex-col mb-4">
      <label className="block text-xs font-mono font-semibold text-slate-200 mb-2 ml-1">
        {label}
        {required && <span className="text-[#00ff9d] ml-1">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full bg-[#05080e] border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00ff9d] focus:ring-1 focus:ring-[#00ff9d]/30 transition-all font-sans text-sm"
          style={{ 
            paddingTop: '12px', 
            paddingBottom: '12px', 
            paddingLeft: icon ? '42px' : '16px', 
            paddingRight: '16px' 
          }}
        />
      </div>
      {helperText && (
        <p className="text-[11px] text-slate-500 mt-1.5 ml-1 font-mono">{helperText}</p>
      )}
    </div>
  );
}
