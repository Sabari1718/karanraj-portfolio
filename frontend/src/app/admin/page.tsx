"use client";

import { useEffect, useState } from "react";
import { PortfolioAPI } from "@/services/api";
import { Folder, Award, MessageSquare, ArrowRight, Briefcase, GraduationCap, Sparkles, ExternalLink } from "lucide-react";
import Link from "next/link";
import { AdminPageHeader, AdminCard } from "@/components/admin/admin-ui";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    messages: 0,
    experience: 0,
    education: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsRes, skillsRes, messagesRes, expRes, eduRes] = await Promise.all([
          PortfolioAPI.getProjects(true),
          PortfolioAPI.getSkills(),
          PortfolioAPI.getMessages(),
          PortfolioAPI.getExperience(),
          PortfolioAPI.getEducation(),
        ]);

        let unreadCount = 0;
        if (messagesRes.success && messagesRes.data) {
          unreadCount = messagesRes.data.filter((m: any) => !m.is_read).length;
        }

        setStats({
          projects: projectsRes.success ? (projectsRes.data || []).length : 0,
          skills: skillsRes.success ? (skillsRes.data || []).length : 0,
          messages: unreadCount,
          experience: expRes.success ? (expRes.data || []).length : 0,
          education: eduRes.success ? (eduRes.data || []).length : 0,
        });
      } catch (err) {
        console.error("Error fetching stats", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="admin-space-y-8 admin-fade-in">

      {/* Page Header */}
      <AdminPageHeader
        badge="Mission Control"
        title="Admin"
        titleAccent="Dashboard"
        subtitle="Manage your developer portfolio content, track client messages, and configure live deployments."
        icon={<Sparkles size={11} />}
        action={
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-live-btn"
          >
            <span>Live Portfolio</span>
            <ExternalLink size={14} />
          </a>
        }
      />

      {/* KPI Stats Grid */}
      <div className="admin-stats-grid">
        <StatCard
          label="Featured Projects"
          count={stats.projects}
          href="/admin/projects"
          icon={<Folder size={20} />}
          color="#00E5FF"
        />
        <StatCard
          label="Skills & Frameworks"
          count={stats.skills}
          href="/admin/skills"
          icon={<Award size={20} />}
          color="#38BDF8"
        />
        <StatCard
          label="Work Milestones"
          count={stats.experience}
          href="/admin/experience"
          icon={<Briefcase size={20} />}
          color="#A78BFA"
        />
        <StatCard
          label="Unread Messages"
          count={stats.messages}
          href="/admin/messages"
          icon={<MessageSquare size={20} />}
          color="#34D399"
          badge={stats.messages > 0 ? "Needs Reply" : "Inbox Clear"}
        />
      </div>

      {/* Management Hub */}
      <AdminCard
        title="Portfolio Management Hub"
        subtitle="Quick shortcuts to modify live portfolio modules with zero downtime."
      >
        <div className="admin-actions-grid">
          <ActionCard
            title="Profile & Identity"
            desc="Update name, bio, social handles, and resume URL."
            href="/admin/profile"
          />
          <ActionCard
            title="Hero Stat Counters ⚡"
            desc="Configure years of experience, project counts, tech & repo stats."
            href="/admin/profile#hero-stats"
          />
          <ActionCard
            title="Projects & Showcase"
            desc="Add new builds, screenshots, live URLs & GitHub links."
            href="/admin/projects"
          />
          <ActionCard
            title="Career Experience"
            desc="Manage work timeline, responsibilities & tech stacks."
            href="/admin/experience"
          />
          <ActionCard
            title="Education & Degrees"
            desc="Manage academic history, CGPA grades & institutions."
            href="/admin/education"
          />
          <ActionCard
            title="Technical Skills"
            desc="Tune proficiency ratings and skill categories."
            href="/admin/skills"
          />
          <ActionCard
            title="Navigation Menu"
            desc="Toggle nav links and customize resume download button."
            href="/admin/navbar"
          />
        </div>
      </AdminCard>
    </div>
  );
}

/* ── Stat Card ───────────────────────────────────────────────────── */
function StatCard({
  label,
  count,
  href,
  icon,
  color,
  badge,
}: {
  label: string;
  count: number;
  href: string;
  icon: React.ReactNode;
  color: string;
  badge?: string;
}) {
  return (
    <Link href={href} className="admin-stat-card">
      <div className="admin-stat-card__top">
        <div
          className="admin-stat-card__icon"
          style={{
            background: `${color}15`,
            color,
            borderColor: `${color}30`,
          }}
        >
          {icon}
        </div>
        {badge ? (
          <span className="admin-stat-card__badge">{badge}</span>
        ) : (
          <ArrowRight size={16} className="admin-stat-card__arrow" />
        )}
      </div>
      <div className="admin-stat-card__bottom">
        <div className="admin-stat-card__count">{count}</div>
        <p className="admin-stat-card__label">{label}</p>
      </div>
    </Link>
  );
}

/* ── Action Card ─────────────────────────────────────────────────── */
function ActionCard({ title, desc, href }: { title: string; desc: string; href: string }) {
  return (
    <Link href={href} className="admin-action-card">
      <div className="admin-action-card__header">
        <h4 className="admin-action-card__title">{title}</h4>
        <ArrowRight size={14} className="admin-action-card__arrow" />
      </div>
      <p className="admin-action-card__desc">{desc}</p>
    </Link>
  );
}
