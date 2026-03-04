import { useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { Star, GitFork, Users, BookOpen, Zap, TrendingUp, Award, Clock, Sparkles } from "lucide-react";
import type { GitHubData } from "@/services/github";
import { computeStats, normalizeForRadar, type UserStats } from "@/utils/scoring";

interface CompareViewProps {
  dataA: GitHubData;
  dataB: GitHubData;
}

const BLUE_A = "hsl(213, 94%, 55%)";
const CYAN_B = "hsl(170, 80%, 50%)";
const PIE_COLORS_A = ["hsl(213,94%,55%)", "hsl(213,70%,45%)", "hsl(222,60%,40%)", "hsl(200,80%,50%)", "hsl(230,60%,50%)"];
const PIE_COLORS_B = ["hsl(170,80%,50%)", "hsl(160,70%,42%)", "hsl(180,60%,38%)", "hsl(150,70%,45%)", "hsl(190,60%,48%)"];

const CompareView = ({ dataA, dataB }: CompareViewProps) => {
  const a = useMemo(() => computeStats(dataA), [dataA]);
  const b = useMemo(() => computeStats(dataB), [dataB]);

  const radarData = useMemo(() => {
    const maxFollowers = Math.max(a.followers, b.followers, 1);
    const maxStars = Math.max(a.totalStars, b.totalStars, 1);
    const maxRepos = Math.max(a.totalRepos, b.totalRepos, 1);
    const maxActivity = Math.max(a.recentActivityCount, b.recentActivityCount, 1);
    return [
      { metric: "Followers", A: normalizeForRadar(a.followers, maxFollowers), B: normalizeForRadar(b.followers, maxFollowers) },
      { metric: "Stars", A: normalizeForRadar(a.totalStars, maxStars), B: normalizeForRadar(b.totalStars, maxStars) },
      { metric: "Repos", A: normalizeForRadar(a.totalRepos, maxRepos), B: normalizeForRadar(b.totalRepos, maxRepos) },
      { metric: "Impact", A: a.impactScore, B: b.impactScore },
      { metric: "Freshness", A: a.freshnessIndex, B: b.freshnessIndex },
      { metric: "Activity", A: normalizeForRadar(a.recentActivityCount, maxActivity), B: normalizeForRadar(b.recentActivityCount, maxActivity) },
    ];
  }, [a, b]);

  const langDataA = useMemo(() =>
    Object.entries(a.languages).sort((x, y) => y[1] - x[1]).slice(0, 5).map(([name, value]) => ({ name, value })),
    [a]
  );
  const langDataB = useMemo(() =>
    Object.entries(b.languages).sort((x, y) => y[1] - x[1]).slice(0, 5).map(([name, value]) => ({ name, value })),
    [b]
  );

  const barData = useMemo(() => [
    { metric: "Stars", [a.username]: a.totalStars, [b.username]: b.totalStars },
    { metric: "Repos", [a.username]: a.totalRepos, [b.username]: b.totalRepos },
    { metric: "Followers", [a.username]: a.followers, [b.username]: b.followers },
    { metric: "Forks", [a.username]: a.totalForks, [b.username]: b.totalForks },
  ], [a, b]);

  const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
  const item: Variants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 25 } } };

  const tooltipStyle = {
    contentStyle: { background: "hsl(222,47%,9%)", border: "1px solid hsl(213,40%,22%)", borderRadius: "12px", color: "#e2e8f0", fontSize: "12px" },
    itemStyle: { color: "#e2e8f0" },
    labelStyle: { color: "#e2e8f0" },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 mt-8">
      {/* User Cards Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UserCard stats={a} color={BLUE_A} variants={item} />
        <UserCard stats={b} color={CYAN_B} variants={item} />
      </div>

      {/* Tier 1: Core Stats Comparison */}
      <motion.div variants={item} className="glass-card p-5">
        <h3 className="text-sm font-semibold text-card-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" /> Head-to-Head Stats
        </h3>
        <div className="space-y-3">
          <StatRow label="Followers" valA={a.followers} valB={b.followers} icon={<Users className="w-3.5 h-3.5" />} />
          <StatRow label="Total Repos" valA={a.totalRepos} valB={b.totalRepos} icon={<BookOpen className="w-3.5 h-3.5" />} />
          <StatRow label="Total Stars" valA={a.totalStars} valB={b.totalStars} icon={<Star className="w-3.5 h-3.5" />} />
          <StatRow label="Avg Stars" valA={a.averageStars} valB={b.averageStars} icon={<Star className="w-3.5 h-3.5" />} />
          <StatRow label="Total Forks" valA={a.totalForks} valB={b.totalForks} icon={<GitFork className="w-3.5 h-3.5" />} />
          <StatRow label="Account Age" valA={a.accountAgeLabel} valB={b.accountAgeLabel} icon={<Clock className="w-3.5 h-3.5" />} numA={a.accountAgeDays} numB={b.accountAgeDays} />
          <StatRow label="Top Language" valA={a.topLanguage} valB={b.topLanguage} icon={<Zap className="w-3.5 h-3.5" />} />
        </div>
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Radar Chart */}
        <motion.div variants={item} whileHover={{ y: -6 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-card-foreground mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" /> Radar Comparison
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(213,40%,18%)" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name={a.username} dataKey="A" stroke={BLUE_A} fill={BLUE_A} fillOpacity={0.2} strokeWidth={2} />
                <Radar name={b.username} dataKey="B" stroke={CYAN_B} fill={CYAN_B} fillOpacity={0.2} strokeWidth={2} />
                <Tooltip {...tooltipStyle} />
                <Legend wrapperStyle={{ color: "#e2e8f0", fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Bar Chart */}
        <motion.div variants={item} whileHover={{ y: -6 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-card-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" /> Stats Breakdown
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(213,40%,15%)" />
                <XAxis dataKey="metric" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey={a.username} fill={BLUE_A} radius={[4, 4, 0, 0]} />
                <Bar dataKey={b.username} fill={CYAN_B} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Language Breakdown Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LangPieCard username={a.username} data={langDataA} colors={PIE_COLORS_A} variants={item} tooltipStyle={tooltipStyle} />
        <LangPieCard username={b.username} data={langDataB} colors={PIE_COLORS_B} variants={item} tooltipStyle={tooltipStyle} />
      </div>

      {/* Tier 2: Top Repo Highlight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TopRepoCard stats={a} color={BLUE_A} variants={item} />
        <TopRepoCard stats={b} color={CYAN_B} variants={item} />
      </div>

      {/* Tier 2: Activity Comparison */}
      <motion.div variants={item} className="glass-card p-5">
        <h3 className="text-sm font-semibold text-card-foreground mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" /> Activity (Last 30 Days)
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <ActivityBlock username={a.username} count={a.recentActivityCount} color={BLUE_A} />
          <ActivityBlock username={b.username} count={b.recentActivityCount} color={CYAN_B} />
        </div>
      </motion.div>

      {/* Tier 3: Impact & Freshness Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ScoreCard stats={a} color={BLUE_A} variants={item} />
        <ScoreCard stats={b} color={CYAN_B} variants={item} />
      </div>

      {/* Tier 3: Auto Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div variants={item} whileHover={{ y: -6 }} className="glass-card p-5">
          <h3 className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Summary — {a.username}</h3>
          <p className="text-sm text-card-foreground leading-relaxed">{a.summary}</p>
        </motion.div>
        <motion.div variants={item} whileHover={{ y: -6 }} className="glass-card p-5">
          <h3 className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Summary — {b.username}</h3>
          <p className="text-sm text-card-foreground leading-relaxed">{b.summary}</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

// ---- Sub-components ----

const UserCard = ({ stats, color, variants }: { stats: UserStats; color: string; variants: Variants }) => (
  <motion.div variants={variants} whileHover={{ y: -8 }} className="glass-card-glow p-5 flex items-center gap-4">
    <div className="w-16 h-16 rounded-full p-0.5 shrink-0" style={{ boxShadow: `0 0 15px ${color}40, 0 0 30px ${color}20` }}>
      <img src={stats.avatar} alt={stats.username} className="w-full h-full rounded-full object-cover" />
    </div>
    <div className="min-w-0">
      <h3 className="text-lg font-semibold text-card-foreground truncate">{stats.name}</h3>
      <p className="text-xs text-muted-foreground font-mono">@{stats.username}</p>
      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Star className="w-3 h-3" style={{ color }} /> {stats.totalStars}</span>
        <span>·</span>
        <span>{stats.totalRepos} repos</span>
        <span>·</span>
        <span>{stats.followers} followers</span>
      </div>
    </div>
  </motion.div>
);

const StatRow = ({ label, valA, valB, icon, numA, numB }: {
  label: string; valA: string | number; valB: string | number; icon: React.ReactNode; numA?: number; numB?: number;
}) => {
  const nA = numA ?? (typeof valA === "number" ? valA : 0);
  const nB = numB ?? (typeof valB === "number" ? valB : 0);
  const winner = nA > nB ? "A" : nB > nA ? "B" : null;

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-muted-foreground w-5">{icon}</span>
      <span className={`flex-1 text-right font-mono ${winner === "A" ? "text-primary font-semibold" : "text-card-foreground"}`}>
        {valA}
      </span>
      <span className="text-xs text-muted-foreground w-24 text-center">{label}</span>
      <span className={`flex-1 font-mono ${winner === "B" ? "font-semibold" : "text-card-foreground"}`} style={winner === "B" ? { color: "hsl(170,80%,50%)" } : {}}>
        {valB}
      </span>
    </div>
  );
};

const LangPieCard = ({ username, data, colors, variants, tooltipStyle }: {
  username: string; data: { name: string; value: number }[]; colors: string[];
  variants: Variants; tooltipStyle: Record<string, unknown>;
}) => (
  <motion.div variants={variants} whileHover={{ y: -6 }} className="glass-card p-5">
    <h3 className="text-sm font-semibold text-card-foreground mb-2">Languages — {username}</h3>
    {data.length > 0 ? (
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={3} dataKey="value" animationDuration={800}>
              {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} stroke="transparent" />)}
            </Pie>
            <Tooltip {...tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    ) : <p className="text-xs text-muted-foreground">No data</p>}
    <div className="flex flex-wrap gap-1.5 mt-1">
      {data.map((d, i) => (
        <span key={d.name} className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <span className="w-2 h-2 rounded-full" style={{ background: colors[i % colors.length] }} />{d.name}
        </span>
      ))}
    </div>
  </motion.div>
);

const TopRepoCard = ({ stats, color, variants }: { stats: UserStats; color: string; variants: Variants }) => (
  <motion.div variants={variants} whileHover={{ y: -6 }} className="glass-card-glow p-5">
    <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Top Repo — {stats.username}</h3>
    {stats.topRepo ? (
      <a href={stats.topRepo.url} target="_blank" rel="noopener noreferrer" className="block group">
        <p className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">{stats.topRepo.name}</p>
        <span className="flex items-center gap-1 text-sm mt-1" style={{ color }}>
          <Star className="w-4 h-4" /> {stats.topRepo.stars} stars
        </span>
      </a>
    ) : (
      <p className="text-xs text-muted-foreground">No repos</p>
    )}
  </motion.div>
);

const ActivityBlock = ({ username, count, color }: { username: string; count: number; color: string }) => (
  <div className="text-center">
    <p className="text-3xl font-bold neon-text" style={{ color }}>{count}</p>
    <p className="text-xs text-muted-foreground mt-1">{username}</p>
    <p className="text-[10px] text-muted-foreground/60">events in 30 days</p>
  </div>
);

const ScoreCard = ({ stats, color, variants }: { stats: UserStats; color: string; variants: Variants }) => (
  <motion.div variants={variants} whileHover={{ y: -6 }} className="glass-card p-5">
    <h3 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">{stats.username}</h3>
    <div className="grid grid-cols-2 gap-4">
      <div className="text-center">
        <Award className="w-5 h-5 mx-auto mb-1" style={{ color }} />
        <p className="text-2xl font-bold" style={{ color }}>{stats.impactScore}</p>
        <p className="text-[10px] text-muted-foreground">Impact Score</p>
      </div>
      <div className="text-center">
        <Zap className="w-5 h-5 mx-auto mb-1" style={{ color }} />
        <p className="text-2xl font-bold" style={{ color }}>{stats.freshnessIndex}</p>
        <p className="text-[10px] text-muted-foreground">Freshness Index</p>
      </div>
    </div>
  </motion.div>
);

export default CompareView;
