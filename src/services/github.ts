export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  location: string | null;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
  html_url: string;
  blog: string | null;
  company: string | null;
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
  size: number;
  fork: boolean;
  html_url: string;
  topics: string[];
  homepage?: string | null;
}

export interface GitHubEvent {
  id: string;
  type: string;
  created_at: string;
  repo: { name: string };
  payload: Record<string, unknown>;
}

export interface GitHubFollower {
  login: string;
  avatar_url: string;
}

export interface GitHubData {
  user: GitHubUser;
  repos: GitHubRepo[];
  events: GitHubEvent[];
  followers: GitHubFollower[];
}

const BASE = "https://api.github.com";

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (res.status === 403) {
    const rateLimitReset = res.headers.get("X-RateLimit-Reset");
    const resetDate = rateLimitReset ? new Date(Number(rateLimitReset) * 1000) : null;
    throw new Error(
      `GitHub API rate limit exceeded.${resetDate ? ` Resets at ${resetDate.toLocaleTimeString()}.` : ""}`
    );
  }
  if (res.status === 404) throw new Error("User not found.");
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
}

export async function fetchGitHubData(username: string): Promise<GitHubData> {
  const [user, repos, events, followers] = await Promise.all([
    fetchJSON<GitHubUser>(`${BASE}/users/${username}`),
    fetchJSON<GitHubRepo[]>(`${BASE}/users/${username}/repos?per_page=100&sort=updated`),
    fetchJSON<GitHubEvent[]>(`${BASE}/users/${username}/events?per_page=50`),
    fetchJSON<GitHubFollower[]>(`${BASE}/users/${username}/followers?per_page=100`),
  ]);
  return { user, repos, events, followers };
}
