import type { GitHubRepo, GitHubEvent } from "@/services/github";

// ── Roast Engine ──

const LANGUAGE_ROASTS: Record<string, string[]> = {
  JavaScript: [
    "JavaScript: Because debugging builds character.",
    "JS dev detected. How's the 'undefined is not a function' life treating you?",
    "You chose JavaScript. Bold move in a world with TypeScript.",
  ],
  TypeScript: [
    "TypeScript: Because you got tired of JavaScript's trust issues.",
    "Types everywhere... but can you type 'touching grass'?",
    "You use TypeScript. At least your bugs are well-documented.",
  ],
  Python: [
    "Python: Where indentation errors are a lifestyle.",
    "A Python dev. Let me guess — you've started 12 ML projects and finished zero.",
    "Python: The 'I'll learn a real language later' of programming.",
  ],
  Java: [
    "Java: Writing AbstractSingletonProxyFactoryBean since 1995.",
    "You code in Java? My condolences to your keyboard.",
    "Java: Because sometimes you just want to write 47 lines to print 'Hello World'.",
  ],
  Go: [
    "Go: Where error handling is 50% of your codebase.",
    "if err != nil { panic('another Go dev detected') }",
  ],
  Rust: [
    "Rust: Fighting the borrow checker since day one.",
    "A Rust dev! How's the 'lifetime elision' existential crisis going?",
  ],
  PHP: [
    "PHP: Because someone has to maintain WordPress.",
    "PHP in your repos? Brave. Very brave.",
  ],
  Ruby: [
    "Ruby: The language that peaked with Rails.",
    "A Ruby dev? What year is it in your timeline?",
  ],
  CSS: [
    "CSS as your top language? You center divs for a living.",
    "Favorite language: CSS. The S stands for Suffering.",
  ],
  HTML: [
    "HTML as a top language... that's not even a programming language, friend.",
  ],
  Shell: [
    "Shell scripts? You either run servers or you're a masochist. Maybe both.",
  ],
};

const COMMIT_ROASTS = [
  "Started strong... then disappeared like my motivation on Monday.",
  "Your commit history looks like a ghost town with WiFi.",
  "Commits rarer than a solar eclipse. Impressive consistency.",
  "Your repos are basically digital tumbleweeds at this point.",
  "Git log: 'Initial commit'... and that's it. A true minimalist.",
];

const ACTIVE_ROASTS = [
  "You actually commit code. That already puts you ahead of 90% of GitHub.",
  "Surprisingly active. Are you okay? Do you go outside?",
  "Your commit frequency suggests either passion or procrastination. Probably both.",
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export interface RoastResult {
  abandonedLine: string | null;
  languageRoast: string;
  commitRoast: string;
  topLanguage: string;
}

export function generateRoast(repos: GitHubRepo[], events: GitHubEvent[]): RoastResult {
  const sixMonthsAgo = Date.now() - 180 * 24 * 60 * 60 * 1000;
  const abandoned = repos.filter((r) => new Date(r.updated_at).getTime() < sixMonthsAgo);
  const abandonedPct = repos.length > 0 ? abandoned.length / repos.length : 0;

  const abandonedLine =
    abandonedPct > 0.3
      ? `You have ${repos.length} repositories... but ${abandoned.length} of them are abandoned 😅`
      : null;

  // Top language
  const langCounts: Record<string, number> = {};
  repos.forEach((r) => {
    if (r.language) langCounts[r.language] = (langCounts[r.language] || 0) + 1;
  });
  const topLang = Object.entries(langCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Unknown";

  const langRoasts = LANGUAGE_ROASTS[topLang] || [
    `${topLang}: A language so niche, even StackOverflow doesn't have answers.`,
  ];

  const recentPushes = events.filter((e) => e.type === "PushEvent");
  const isActive = recentPushes.length > 5;

  return {
    abandonedLine,
    languageRoast: pickRandom(langRoasts),
    commitRoast: pickRandom(isActive ? ACTIVE_ROASTS : COMMIT_ROASTS),
    topLanguage: topLang,
  };
}

// ── Addiction Meter ──

export interface AddictionResult {
  score: number; // 0-10
  commitsPerWeek: number;
  lateNightPct: number;
  isAddict: boolean;
}

export function calculateAddiction(events: GitHubEvent[]): AddictionResult {
  const pushEvents = events.filter((e) => e.type === "PushEvent");

  // Commits per week (events span ~90 days max, but API returns last 50)
  const totalCommits = pushEvents.reduce((sum, e) => {
    const commits = (e.payload as { commits?: unknown[] }).commits;
    return sum + (commits?.length || 0);
  }, 0);

  // Estimate time span from events
  const dates = pushEvents.map((e) => new Date(e.created_at).getTime());
  const span = dates.length > 1 ? (Math.max(...dates) - Math.min(...dates)) / (1000 * 60 * 60 * 24 * 7) : 1;
  const commitsPerWeek = Math.round((totalCommits / Math.max(span, 1)) * 10) / 10;

  // Late night commits (11 PM - 5 AM)
  const lateNight = pushEvents.filter((e) => {
    const hour = new Date(e.created_at).getHours();
    return hour >= 23 || hour < 5;
  });
  const lateNightPct = pushEvents.length > 0 ? Math.round((lateNight.length / pushEvents.length) * 100) : 0;

  // Score calculation
  let score = 0;
  if (commitsPerWeek > 30) score += 4;
  else if (commitsPerWeek > 15) score += 3;
  else if (commitsPerWeek > 7) score += 2;
  else if (commitsPerWeek > 3) score += 1;

  if (lateNightPct > 50) score += 4;
  else if (lateNightPct > 30) score += 3;
  else if (lateNightPct > 15) score += 2;
  else if (lateNightPct > 5) score += 1;

  // Bonus for sheer volume
  if (totalCommits > 100) score += 2;
  else if (totalCommits > 50) score += 1;

  score = Math.min(10, score);

  return {
    score,
    commitsPerWeek,
    lateNightPct,
    isAddict: score >= 8,
  };
}
