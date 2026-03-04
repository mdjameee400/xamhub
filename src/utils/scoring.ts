import type { GitHubData } from "@/services/github";

export interface UserStats {
  username: string;
  avatar: string;
  name: string;
  followers: number;
  following: number;
  totalRepos: number;
  totalStars: number;
  averageStars: number;
  totalForks: number;
  accountAgeDays: number;
  accountAgeLabel: string;
  languages: Record<string, number>;
  topLanguage: string;
  topRepo: { name: string; stars: number; url: string } | null;
  recentActivityCount: number;
  impactScore: number;
  freshnessIndex: number;
  summary: string;
}

function daysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}

function ageLabel(days: number): string {
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  if (years > 0) return `${years}y ${months}m`;
  return `${months}m`;
}

export function computeStats(data: GitHubData): UserStats {
  const { user, repos, events } = data;

  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
  const totalForks = repos.reduce((s, r) => s + r.forks_count, 0);
  const averageStars = repos.length > 0 ? Math.round((totalStars / repos.length) * 10) / 10 : 0;

  const languages: Record<string, number> = {};
  repos.forEach((r) => {
    if (r.language) languages[r.language] = (languages[r.language] || 0) + 1;
  });
  const topLanguage = Object.entries(languages).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  const sorted = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count);
  const topRepo = sorted[0]
    ? { name: sorted[0].name, stars: sorted[0].stargazers_count, url: sorted[0].html_url }
    : null;

  const ageDays = daysSince(user.created_at);

  // Recent activity: events in last 30 days
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const recentActivityCount = events.filter((e) => new Date(e.created_at).getTime() > thirtyDaysAgo).length;

  // Developer Impact Score (0-100)
  const starScore = Math.min(totalStars / 50, 30);
  const repoScore = Math.min(repos.length / 5, 20);
  const followerScore = Math.min(user.followers / 20, 25);
  const activityScore = Math.min(recentActivityCount / 5, 15);
  const diversityScore = Math.min(Object.keys(languages).length * 2, 10);
  const impactScore = Math.round(Math.min(starScore + repoScore + followerScore + activityScore + diversityScore, 100));

  // Freshness Index (0-100) — how active/current
  const reposUpdatedRecently = repos.filter((r) => daysSince(r.updated_at) < 90).length;
  const freshnessIndex = Math.round(
    Math.min(
      (recentActivityCount / 50) * 40 + (reposUpdatedRecently / Math.max(repos.length, 1)) * 40 + (repos.length > 0 ? 20 : 0),
      100
    )
  );

  // Auto summary
  const summaryParts: string[] = [];
  if (impactScore >= 70) summaryParts.push("High-impact developer");
  else if (impactScore >= 40) summaryParts.push("Active developer");
  else summaryParts.push("Growing developer");

  summaryParts.push(`specializing in ${topLanguage}`);
  if (totalStars > 100) summaryParts.push(`with ${totalStars} total stars`);
  if (freshnessIndex > 60) summaryParts.push("and very active recently");
  else if (freshnessIndex > 30) summaryParts.push("with moderate recent activity");

  const summary = summaryParts.join(" ") + ".";

  return {
    username: user.login,
    avatar: user.avatar_url,
    name: user.name || user.login,
    followers: user.followers,
    following: user.following,
    totalRepos: user.public_repos,
    totalStars,
    averageStars,
    totalForks,
    accountAgeDays: ageDays,
    accountAgeLabel: ageLabel(ageDays),
    languages,
    topLanguage,
    topRepo,
    recentActivityCount,
    impactScore,
    freshnessIndex,
    summary,
  };
}

// Normalize a value 0-100 for radar chart
export function normalizeForRadar(value: number, max: number): number {
  return Math.min(Math.round((value / max) * 100), 100);
}
