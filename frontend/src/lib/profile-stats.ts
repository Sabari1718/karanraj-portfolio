import { Profile } from "@/types";

export interface HeroStatsData {
  years_experience?: string | number | null;
  projects_count?: string | number | null;
  technologies_count?: string | number | null;
  repos_count?: string | number | null;
  badge_text?: string | null;
  greeting_text?: string | null;
  hero_badge_1?: string | null;
  hero_badge_2?: string | null;
  security_focus?: string | null;
}

export const DEFAULT_BIO =
  "Dedicated Cyber Security Enthusiast & Ethical Hacker focused on securing network infrastructures, identifying vulnerabilities, and developing resilient digital defense mechanisms.";

/**
 * Extracts hero stat metrics, badge text, greeting, hero badges, and bio from profile.
 * Prefers direct column values if available, otherwise seamlessly extracts
 * from metadata embedded in bio.
 */
export function extractProfileStats(profile: Profile | null) {
  const stats: HeroStatsData = {
    years_experience: profile?.years_experience,
    projects_count: profile?.projects_count,
    technologies_count: profile?.technologies_count,
    repos_count: profile?.repos_count,
    badge_text: profile?.badge_text,
    greeting_text: profile?.greeting_text,
    hero_badge_1: (profile as any)?.hero_badge_1 || null,
    hero_badge_2: (profile as any)?.hero_badge_2 || null,
    security_focus: (profile as any)?.security_focus || null,
  };

  let cleanBio = profile?.bio || "";

  if (cleanBio && cleanBio.includes("<!--STATS:")) {
    try {
      const match = cleanBio.match(/<!--STATS:([\s\S]*?)-->/);
      if (match && match[1]) {
        const parsed = JSON.parse(match[1]);
        if (!stats.years_experience && parsed.years_experience) {
          stats.years_experience = parsed.years_experience;
        }
        if (!stats.projects_count && parsed.projects_count) {
          stats.projects_count = parsed.projects_count;
        }
        if (!stats.technologies_count && parsed.technologies_count) {
          stats.technologies_count = parsed.technologies_count;
        }
        if (!stats.repos_count && parsed.repos_count) {
          stats.repos_count = parsed.repos_count;
        }
        if (!stats.badge_text && parsed.badge_text) {
          stats.badge_text = parsed.badge_text;
        }
        if (!stats.greeting_text && parsed.greeting_text) {
          stats.greeting_text = parsed.greeting_text;
        }
        if (!stats.hero_badge_1 && parsed.hero_badge_1) {
          stats.hero_badge_1 = parsed.hero_badge_1;
        }
        if (!stats.hero_badge_2 && parsed.hero_badge_2) {
          stats.hero_badge_2 = parsed.hero_badge_2;
        }
        if (!stats.security_focus && parsed.security_focus) {
          stats.security_focus = parsed.security_focus;
        }
      }
      cleanBio = cleanBio.replace(/<!--STATS:[\s\S]*?-->/g, "").trim();
    } catch {
      // if JSON parsing fails, just leave cleanBio as is
    }
  }

  return {
    stats: {
      years_experience: stats.years_experience || "2+",
      projects_count: stats.projects_count || "1+",
      technologies_count: stats.technologies_count || "15+",
      repos_count: stats.repos_count || "10+",
      badge_text: stats.badge_text || "Open to Opportunities",
      greeting_text: stats.greeting_text || "Hello, I'm",
      hero_badge_1: stats.hero_badge_1 || "Cyber Security",
      hero_badge_2: stats.hero_badge_2 || "Ethical Hacking",
      security_focus: stats.security_focus || "Penetration Testing & Defense",
    },
    cleanBio: cleanBio || DEFAULT_BIO,
  };
}

/**
 * Embeds stats metadata into the bio string.
 * This guarantees that even if the backend is running a version without
 * new table columns, the stats, badge, greeting, and hero badges are 100% saved into MySQL.
 */
export function embedProfileStats(
  rawBio: string | null | undefined,
  stats: HeroStatsData
): string {
  const clean = (rawBio || "").replace(/<!--STATS:[\s\S]*?-->/g, "").trim();
  const payload = JSON.stringify({
    years_experience: stats.years_experience || "2+",
    projects_count: stats.projects_count || "1+",
    technologies_count: stats.technologies_count || "15+",
    repos_count: stats.repos_count || "10+",
    badge_text: stats.badge_text || "Open to Opportunities",
    greeting_text: stats.greeting_text || "Hello, I'm",
    hero_badge_1: stats.hero_badge_1 || "Cyber Security",
    hero_badge_2: stats.hero_badge_2 || "Ethical Hacking",
    security_focus: stats.security_focus || "Penetration Testing & Defense",
  });

  return clean ? `${clean}\n\n<!--STATS:${payload}-->` : `<!--STATS:${payload}-->`;
}
