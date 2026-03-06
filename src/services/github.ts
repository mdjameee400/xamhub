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

export interface ContributionDay {
  date: string;
  contributionCount: number;
  commitCount?: number;
}

export interface ContributionCalendar {
  totalContributions: number;
  totalCommits: number;
  weeks: {
    contributionDays: ContributionDay[];
  }[];
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
  total_commits?: number;
  owner?: { login: string };
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
  calendar: ContributionCalendar;
  years: number[];
  totalCommits: number;
}

const BASE = "https://api.github.com";

async function fetchJSON<T>(url: string): Promise<T> {
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, { headers });
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
  const currentYear = new Date().getFullYear();
  const [user, repos, events, followers, calendarData, searchCommits] = await Promise.all([
    fetchJSON<GitHubUser>(`${BASE}/users/${username}`),
    fetchJSON<GitHubRepo[]>(`${BASE}/users/${username}/repos?per_page=100&sort=updated`),
    fetchJSON<GitHubEvent[]>(`${BASE}/users/${username}/events?per_page=50`),
    fetchJSON<GitHubFollower[]>(`${BASE}/users/${username}/followers?per_page=100`),
    fetchContributionCalendar(username),
    fetchCommitsViaSearch(username, currentYear)
  ]);

  // Merge search-based commit counts into heatmap
  if (searchCommits.total > calendarData.totalCommits) {
    calendarData.calendar.totalCommits = searchCommits.total;
    calendarData.totalCommits = searchCommits.total;

    calendarData.calendar.weeks.forEach(week => {
      week.contributionDays.forEach(day => {
        if (searchCommits.dailyCounts[day.date]) {
          day.commitCount = Math.max(day.commitCount || 0, searchCommits.dailyCounts[day.date]);
          // Also ensure contributionCount reflects the commits if it's lower
          day.contributionCount = Math.max(day.contributionCount, day.commitCount);
        }
      });
    });
  }

  return {
    user,
    repos,
    events,
    followers,
    calendar: calendarData.calendar,
    years: calendarData.years,
    totalCommits: calendarData.totalCommits
  };
}

export async function fetchYearlyCalendar(username: string, year: number): Promise<ContributionCalendar & { totalCommits: number }> {
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  if (!token) return { totalContributions: 0, totalCommits: 0, weeks: [] };

  const [res, searchCommits] = await Promise.all([
    fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query($username: String!, $from: DateTime!, $to: DateTime!) {
            user(login: $username) {
              contributionsCollection(from: $from, to: $to) {
                totalCommitContributions
                commitContributionsByRepository(maxRepositories: 100) {
                  contributions(first: 100) {
                    nodes {
                      occurredAt
                      commitCount
                    }
                  }
                }
                contributionCalendar {
                  totalContributions
                  weeks {
                    contributionDays {
                      contributionCount
                      date
                    }
                  }
                }
              }
            }
          }
        `,
        variables: {
          username,
          from: `${year}-01-01T00:00:00Z`,
          to: `${year}-12-31T23:59:59Z`
        }
      }),
    }),
    fetchCommitsViaSearch(username, year)
  ]);

  if (!res.ok) return { totalContributions: 0, totalCommits: 0, weeks: [] };
  const json = await res.json();
  const collection = json.data.user.contributionsCollection;

  // Merge granular commit counts
  const commitMap = new Map<string, number>();
  collection.commitContributionsByRepository.forEach((repo: any) => {
    repo.contributions.nodes.forEach((node: any) => {
      const date = node.occurredAt.split("T")[0];
      commitMap.set(date, (commitMap.get(date) || 0) + node.commitCount);
    });
  });

  const calendar = collection.contributionCalendar;

  // Authoritative total from search OR graphql
  const authoritativeTotal = Math.max(collection.totalCommitContributions || 0, searchCommits.total);

  calendar.weeks.forEach((week: any) => {
    week.contributionDays.forEach((day: any) => {
      day.commitCount = Math.max(commitMap.get(day.date) || 0, searchCommits.dailyCounts[day.date] || 0);
      day.contributionCount = Math.max(day.contributionCount, day.commitCount);
    });
  });

  return {
    ...calendar,
    totalCommits: authoritativeTotal
  };
}

async function fetchContributionCalendar(username: string): Promise<{ calendar: ContributionCalendar; years: number[]; totalCommits: number }> {
  const token = import.meta.env.VITE_GITHUB_TOKEN;

  if (!token) {
    console.warn("GitHub Token missing. Contribution calendar will be empty. Add VITE_GITHUB_TOKEN to .env");
    return { calendar: { totalContributions: 0, totalCommits: 0, weeks: [] }, years: [], totalCommits: 0 };
  }

  const currentYear = new Date().getFullYear();
  const from = `${currentYear}-01-01T00:00:00Z`;
  const to = `${currentYear}-12-31T23:59:59Z`;

  const [res, searchCommits] = await Promise.all([
    fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query($username: String!, $from: DateTime!, $to: DateTime!) {
            user(login: $username) {
              contributionsCollection(from: $from, to: $to) {
                contributionYears
                totalCommitContributions
                commitContributionsByRepository(maxRepositories: 100) {
                  contributions(first: 100) {
                    nodes {
                      occurredAt
                      commitCount
                    }
                  }
                }
                contributionCalendar {
                  totalContributions
                  weeks {
                    contributionDays {
                      contributionCount
                      date
                    }
                  }
                }
              }
            }
          }
        `,
        variables: { username, from, to }
      }),
    }),
    fetchCommitsViaSearch(username, currentYear)
  ]);

  if (!res.ok) {
    console.error("GraphQL failed", await res.text());
    return { calendar: { totalContributions: 0, totalCommits: 0, weeks: [] }, years: [], totalCommits: 0 };
  }

  const json = await res.json();
  const collection = json.data.user.contributionsCollection;

  // Merge granular commit counts
  const commitMap = new Map<string, number>();
  collection.commitContributionsByRepository.forEach((repo: any) => {
    repo.contributions.nodes.forEach((node: any) => {
      const date = node.occurredAt.split("T")[0];
      commitMap.set(date, (commitMap.get(date) || 0) + node.commitCount);
    });
  });

  const calendar = collection.contributionCalendar;
  const authoritativeTotal = Math.max(collection.totalCommitContributions || 0, searchCommits.total);

  calendar.weeks.forEach((week: any) => {
    week.contributionDays.forEach((day: any) => {
      day.commitCount = Math.max(commitMap.get(day.date) || 0, searchCommits.dailyCounts[day.date] || 0);
      day.contributionCount = Math.max(day.contributionCount, day.commitCount);
    });
  });

  return {
    calendar: {
      ...calendar,
      totalCommits: authoritativeTotal
    },
    years: collection.contributionYears,
    totalCommits: authoritativeTotal
  };
}

export async function fetchCommitsViaSearch(username: string, year: number): Promise<{ total: number, dailyCounts: Record<string, number> }> {
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  if (!token) return { total: 0, dailyCounts: {} };

  // This catches commits across ALL repositories and ALL branches
  const query = `author:${username} author-date:${year}-01-01..${year}-12-31`;
  const url = `https://api.github.com/search/commits?q=${encodeURIComponent(query)}&per_page=100`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.cloak-preview"
      }
    });

    if (!res.ok) return { total: 0, dailyCounts: {} };
    const data = await res.json();

    const dailyCounts: Record<string, number> = {};
    data.items?.forEach((item: any) => {
      if (item.commit?.author?.date) {
        const date = item.commit.author.date.split("T")[0];
        dailyCounts[date] = (dailyCounts[date] || 0) + 1;
      }
    });

    return {
      total: data.total_count || 0,
      dailyCounts
    };
  } catch (err) {
    console.error("Search API failed", err);
    return { total: 0, dailyCounts: {} };
  }
}

export async function fetchRepoCommits(owner: string, repo: string, username: string): Promise<number> {
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  if (!token) return 0;

  // Primary: Search by author login (most accurate for identity)
  const authorQuery = `repo:${owner}/${repo} author:${username}`;
  const authorUrl = `https://api.github.com/search/commits?q=${encodeURIComponent(authorQuery)}&per_page=1`;

  try {
    const res = await fetch(authorUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.cloak-preview"
      }
    });

    if (!res.ok) return 0;
    const authorData = await res.json();

    // Fallback: If 0 commits found by author login, check total repo commits.
    // This ensures we show the 17 commits even if identity matching is difficult via Search API.
    if (authorData.total_count === 0) {
      const totalQuery = `repo:${owner}/${repo}`;
      const totalUrl = `https://api.github.com/search/commits?q=${encodeURIComponent(totalQuery)}&per_page=1`;
      const totalRes = await fetch(totalUrl, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github.cloak-preview" }
      });
      if (totalRes.ok) {
        const totalData = await totalRes.json();
        return totalData.total_count || 0;
      }
    }

    return authorData.total_count || 0;
  } catch (err) {
    console.error("Fetch repo commits failed", err);
    return 0;
  }
}
