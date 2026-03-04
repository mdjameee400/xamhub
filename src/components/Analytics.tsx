import { useMemo } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Star, GitPullRequest, AlertCircle, GitCommit } from "lucide-react";
import type { GitHubRepo, GitHubEvent } from "@/services/github";

interface AnalyticsProps {
  repos: GitHubRepo[];
  events: GitHubEvent[];
}

const NEON_COLORS = [
  "hsl(213, 94%, 55%)",
  "hsl(213, 70%, 45%)",
  "hsl(222, 60%, 40%)",
  "hsl(200, 80%, 50%)",
  "hsl(230, 60%, 50%)",
  "hsl(190, 70%, 45%)",
  "hsl(240, 50%, 55%)",
  "hsl(210, 60%, 35%)",
];

const Analytics = ({ repos, events }: AnalyticsProps) => {
  const langData = useMemo(() => {
    const counts: Record<string, number> = {};
    repos.forEach((r) => {
      if (r.language) counts[r.language] = (counts[r.language] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [repos]);

  const topStarred = useMemo(
    () => [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 3),
    [repos]
  );

  const recentEvents = useMemo(
    () =>
      events
        .filter((e) => ["PushEvent", "PullRequestEvent", "IssuesEvent", "CreateEvent"].includes(e.type))
        .slice(0, 8),
    [events]
  );

  const eventIcon = (type: string) => {
    switch (type) {
      case "PushEvent": return <GitCommit className="w-4 h-4 text-primary" />;
      case "PullRequestEvent": return <GitPullRequest className="w-4 h-4 text-primary" />;
      case "IssuesEvent": return <AlertCircle className="w-4 h-4 text-primary" />;
      default: return <GitCommit className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Language Distribution */}
      <motion.div variants={item} whileHover={{ y: -8 }} className="glass-card p-5">
        <h3 className="text-sm font-semibold text-card-foreground mb-3">Language Distribution</h3>
        {langData.length > 0 ? (
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={langData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {langData.map((_, i) => (
                    <Cell key={i} fill={NEON_COLORS[i % NEON_COLORS.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "hsl(222, 47%, 9%)",
                    border: "1px solid hsl(213, 40%, 22%)",
                    borderRadius: "12px",
                    color: "hsl(213, 31%, 85%)",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No language data</p>
        )}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {langData.map((d, i) => (
            <span key={d.name} className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <span className="w-2 h-2 rounded-full" style={{ background: NEON_COLORS[i % NEON_COLORS.length] }} />
              {d.name}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Top Starred */}
      <motion.div variants={item} whileHover={{ y: -8 }} className="glass-card p-5">
        <h3 className="text-sm font-semibold text-card-foreground mb-3">Top Starred Repos</h3>
        <div className="space-y-3">
          {topStarred.map((repo, i) => (
            <motion.a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ x: 4 }}
              className={`block p-3 rounded-xl border transition-all ${
                i === 0 ? "glass-card-glow border-primary/30" : "bg-muted/20 border-glass-border"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-card-foreground truncate">{repo.name}</span>
                <span className="flex items-center gap-1 text-xs text-primary">
                  <Star className="w-3.5 h-3.5" /> {repo.stargazers_count}
                </span>
              </div>
              {repo.description && (
                <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1">{repo.description}</p>
              )}
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* Activity Timeline */}
      <motion.div variants={item} whileHover={{ y: -8 }} className="glass-card p-5">
        <h3 className="text-sm font-semibold text-card-foreground mb-3">Recent Activity</h3>
        <div className="space-y-2.5 relative">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-glass-border" />
          {recentEvents.length > 0 ? (
            recentEvents.map((ev) => (
              <div key={ev.id} className="flex items-start gap-3 relative">
                <div className="z-10 mt-0.5 bg-card rounded-full">{eventIcon(ev.type)}</div>
                <div className="min-w-0">
                  <span className="text-xs text-card-foreground">
                    {ev.type.replace("Event", "")}
                  </span>
                  <p className="text-[10px] text-muted-foreground truncate">{ev.repo.name}</p>
                  <p className="text-[10px] text-muted-foreground/60">
                    {new Date(ev.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-muted-foreground pl-6">No recent activity</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Analytics;
