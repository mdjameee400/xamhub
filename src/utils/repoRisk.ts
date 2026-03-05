import type { GitHubRepo, GitHubEvent } from "@/services/github";

export interface RepoRisk {
  repoName: string;
  repoUrl: string;
  activityScore: number; // 0-100, higher = healthier
  securityScore: number;
  documentationScore: number;
  commitQualityScore: number;
  overallHealth: number;
  warnings: string[];
  badges: RiskBadge[];
}

export interface RiskBadge {
  label: string;
  severity: "safe" | "warning" | "danger";
}

export interface DeveloperPercentile {
  label: string;
  percentile: number;
}

function daysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}

function analyzeActivity(repo: GitHubRepo): { score: number; badges: RiskBadge[]; warnings: string[] } {
  const days = daysSince(repo.updated_at);
  const badges: RiskBadge[] = [];
  const warnings: string[] = [];

  let score = 100;
  if (days > 730) {
    score = 10;
    badges.push({ label: "Dead Project", severity: "danger" });
    warnings.push(`Repository "${repo.name}" has a high abandonment risk — no updates in ${Math.floor(days / 365)}+ years.`);
  } else if (days > 365) {
    score = 30;
    badges.push({ label: "Stale", severity: "warning" });
    warnings.push(`Repository "${repo.name}" hasn't been updated in over a year.`);
  } else if (days > 180) {
    score = 55;
    badges.push({ label: "Aging", severity: "warning" });
  } else if (days > 90) {
    score = 75;
  } else {
    badges.push({ label: "Active", severity: "safe" });
  }
  return { score, badges, warnings };
}

function analyzeSecurity(repo: GitHubRepo): { score: number; badges: RiskBadge[]; warnings: string[] } {
  const badges: RiskBadge[] = [];
  const warnings: string[] = [];
  let score = 50; // baseline — no security file detection via REST API

  // Heuristics: open issues may indicate unresolved vulnerabilities
  if (repo.open_issues_count > 50) {
    score -= 20;
    badges.push({ label: "High Open Issues", severity: "warning" });
    warnings.push(`"${repo.name}" has ${repo.open_issues_count} open issues — potential unresolved security concerns.`);
  } else if (repo.open_issues_count > 20) {
    score -= 10;
  }

  // If repo has many stars but lots of issues, flag it
  if (repo.stargazers_count > 10 && repo.open_issues_count > repo.stargazers_count * 0.5) {
    badges.push({ label: "Security Risk", severity: "danger" });
    score -= 15;
  }

  // Topics-based heuristic
  const secTopics = ["security", "vulnerability", "cve", "audit"];
  if (repo.topics?.some((t) => secTopics.includes(t.toLowerCase()))) {
    badges.push({ label: "Security Aware", severity: "safe" });
    score += 20;
  }

  return { score: Math.max(0, Math.min(100, score)), badges, warnings };
}

function analyzeDocumentation(repo: GitHubRepo): { score: number; badges: RiskBadge[]; warnings: string[] } {
  const badges: RiskBadge[] = [];
  const warnings: string[] = [];

  let score = 40; // default without README content inspection

  // Size heuristic: very small repos likely lack docs
  if (repo.size < 5) {
    score = 15;
    badges.push({ label: "Low Documentation", severity: "danger" });
    warnings.push(`"${repo.name}" is very small (${repo.size} KB) — likely lacks proper documentation.`);
  } else if (repo.size < 50) {
    score = 35;
    badges.push({ label: "Minimal Docs", severity: "warning" });
  } else {
    score = 65;
  }

  // Description presence
  if (repo.description && repo.description.length > 30) {
    score += 15;
  } else if (!repo.description) {
    score -= 10;
    badges.push({ label: "No Description", severity: "warning" });
  }

  // Topics = better documented
  if (repo.topics && repo.topics.length >= 3) {
    score += 10;
    badges.push({ label: "Well Tagged", severity: "safe" });
  }

  return { score: Math.max(0, Math.min(100, score)), badges, warnings };
}

function analyzeCommitQuality(repo: GitHubRepo, events: GitHubEvent[]): { score: number; badges: RiskBadge[]; warnings: string[] } {
  const badges: RiskBadge[] = [];
  const warnings: string[] = [];

  const repoEvents = events.filter((e) => e.repo.name.endsWith(`/${repo.name}`) && e.type === "PushEvent");

  if (repoEvents.length === 0) {
    return { score: 40, badges: [{ label: "No Recent Commits", severity: "warning" }], warnings: [] };
  }

  let score = 60;
  const commitCount = repoEvents.reduce((sum, e) => {
    const commits = (e.payload as { commits?: unknown[] }).commits;
    return sum + (commits?.length || 0);
  }, 0);

  if (commitCount > 10) {
    score += 20;
    badges.push({ label: "Active Commits", severity: "safe" });
  } else if (commitCount > 3) {
    score += 10;
  } else {
    badges.push({ label: "Poor Commit Structure", severity: "warning" });
    warnings.push(`"${repo.name}" has very few recent commits — may indicate poor commit practices.`);
  }

  return { score: Math.max(0, Math.min(100, score)), badges, warnings };
}

export function analyzeRepoRisk(repo: GitHubRepo, events: GitHubEvent[]): RepoRisk {
  const activity = analyzeActivity(repo);
  const security = analyzeSecurity(repo);
  const documentation = analyzeDocumentation(repo);
  const commitQuality = analyzeCommitQuality(repo, events);

  const overallHealth = Math.round(
    activity.score * 0.3 + security.score * 0.2 + documentation.score * 0.25 + commitQuality.score * 0.25
  );

  return {
    repoName: repo.name,
    repoUrl: repo.html_url,
    activityScore: activity.score,
    securityScore: security.score,
    documentationScore: documentation.score,
    commitQualityScore: commitQuality.score,
    overallHealth,
    warnings: [...activity.warnings, ...security.warnings, ...documentation.warnings, ...commitQuality.warnings],
    badges: [...activity.badges, ...security.badges, ...documentation.badges, ...commitQuality.badges],
  };
}

export function analyzeAllRepos(repos: GitHubRepo[], events: GitHubEvent[]): RepoRisk[] {
  return repos.map((repo) => analyzeRepoRisk(repo, events)).sort((a, b) => a.overallHealth - b.overallHealth);
}

export function computePercentiles(repos: GitHubRepo[], totalStars: number, languages: Record<string, number>): DeveloperPercentile[] {
  const percentiles: DeveloperPercentile[] = [];

  // Stars-based percentile (rough heuristic)
  if (totalStars > 1000) percentiles.push({ label: "Open Source Contributors", percentile: 2 });
  else if (totalStars > 500) percentiles.push({ label: "Open Source Contributors", percentile: 5 });
  else if (totalStars > 100) percentiles.push({ label: "Open Source Contributors", percentile: 10 });
  else if (totalStars > 50) percentiles.push({ label: "Open Source Contributors", percentile: 20 });
  else if (totalStars > 10) percentiles.push({ label: "Open Source Contributors", percentile: 35 });

  // Language-specific percentile
  const topLang = Object.entries(languages).sort((a, b) => b[1] - a[1])[0];
  if (topLang) {
    const repoCount = topLang[1];
    if (repoCount > 30) percentiles.push({ label: `${topLang[0]} Developers`, percentile: 5 });
    else if (repoCount > 15) percentiles.push({ label: `${topLang[0]} Developers`, percentile: 10 });
    else if (repoCount > 8) percentiles.push({ label: `${topLang[0]} Developers`, percentile: 20 });
    else if (repoCount > 3) percentiles.push({ label: `${topLang[0]} Developers`, percentile: 35 });
  }

  // Repo count percentile
  if (repos.length > 100) percentiles.push({ label: "Prolific Developers", percentile: 3 });
  else if (repos.length > 50) percentiles.push({ label: "Prolific Developers", percentile: 12 });
  else if (repos.length > 20) percentiles.push({ label: "Prolific Developers", percentile: 25 });

  return percentiles;
}
