import { useMemo } from "react";
import { motion } from "framer-motion";
import { Shield, FileText, GitCommit, Activity, AlertTriangle, Trophy, TrendingUp } from "lucide-react";
import type { GitHubRepo, GitHubEvent } from "@/services/github";
import { analyzeAllRepos, computePercentiles, type RepoRisk, type DeveloperPercentile } from "@/utils/repoRisk";

interface Props {
  repos: GitHubRepo[];
  events: GitHubEvent[];
}

/* ── Progress Ring ── */
const ProgressRing = ({ value, size = 56, stroke = 4, label }: { value: number; size?: number; stroke?: number; label: string }) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const color =
    value >= 70 ? "hsl(var(--primary))" : value >= 40 ? "hsl(40, 90%, 55%)" : "hsl(var(--destructive))";

  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--glass-border))" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />
      </svg>
      <span className="text-[10px] text-muted-foreground text-center leading-tight">{label}</span>
      <span className="text-xs font-semibold text-card-foreground">{value}%</span>
    </div>
  );
};

/* ── Severity Badge ── */
const SeverityBadge = ({ label, severity }: { label: string; severity: "safe" | "warning" | "danger" }) => {
  const styles = {
    safe: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    warning: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    danger: "bg-red-500/15 text-red-400 border-red-500/30",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-lg border ${styles[severity]}`}>
      {label}
    </span>
  );
};

/* ── Main Component ── */
const RepoHealthAssessment = ({ repos, events }: Props) => {
  const risks = useMemo(() => analyzeAllRepos(repos, events), [repos, events]);
  const topRisks = risks.slice(0, 6);

  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
  const languages: Record<string, number> = {};
  repos.forEach((r) => { if (r.language) languages[r.language] = (languages[r.language] || 0) + 1; });

  const percentiles = useMemo(() => computePercentiles(repos, totalStars, languages), [repos, totalStars]);

  const avgHealth = risks.length > 0 ? Math.round(risks.reduce((s, r) => s + r.overallHealth, 0) / risks.length) : 0;
  const allWarnings = risks.flatMap((r) => r.warnings).slice(0, 5);

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.h2 variants={item} className="text-lg font-semibold text-card-foreground neon-text flex items-center gap-2">
        <Shield className="w-5 h-5 text-primary" />
        Repo Health & Risk Assessment
      </motion.h2>

      {/* Overview Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Overall Health */}
        <motion.div variants={item} whileHover={{ y: -8 }} className="glass-card p-5 flex flex-col items-center gap-3">
          <h3 className="text-sm font-semibold text-card-foreground">Overall Portfolio Health</h3>
          <ProgressRing value={avgHealth} size={80} stroke={5} label="Health Score" />
          <p className="text-[10px] text-muted-foreground text-center">
            Across {repos.length} repositories
          </p>
        </motion.div>

        {/* Warnings */}
        <motion.div variants={item} whileHover={{ y: -8 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-card-foreground flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Risk Warnings
          </h3>
          {allWarnings.length > 0 ? (
            <div className="space-y-2">
              {allWarnings.map((w, i) => (
                <p key={i} className="text-[11px] text-amber-300/80 leading-relaxed">⚠ {w}</p>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No major risks detected ✓</p>
          )}
        </motion.div>

        {/* Percentile Rankings */}
        <motion.div variants={item} whileHover={{ y: -8 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-card-foreground flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-primary" />
            Developer Rankings
          </h3>
          {percentiles.length > 0 ? (
            <div className="space-y-2.5">
              {percentiles.map((p, i) => (
                <div key={i} className="flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="text-xs text-card-foreground">
                    Top <span className="text-primary font-semibold">{p.percentile}%</span> {p.label}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Keep building to earn rankings!</p>
          )}
        </motion.div>
      </div>

      {/* Per-Repo Risk Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topRisks.map((risk, i) => (
          <motion.a
            key={risk.repoName}
            href={risk.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            variants={item}
            whileHover={{ y: -8 }}
            className="glass-card p-4 flex flex-col gap-3 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-card-foreground group-hover:text-primary transition-colors truncate">
                {risk.repoName}
              </h4>
              <span className={`text-xs font-mono font-bold ${
                risk.overallHealth >= 70 ? "text-emerald-400" : risk.overallHealth >= 40 ? "text-amber-400" : "text-red-400"
              }`}>
                {risk.overallHealth}%
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <ProgressRing value={risk.activityScore} size={40} stroke={3} label="Activity" />
              <ProgressRing value={risk.securityScore} size={40} stroke={3} label="Security" />
              <ProgressRing value={risk.documentationScore} size={40} stroke={3} label="Docs" />
              <ProgressRing value={risk.commitQualityScore} size={40} stroke={3} label="Commits" />
            </div>

            <div className="flex flex-wrap gap-1">
              {risk.badges.slice(0, 4).map((b, j) => (
                <SeverityBadge key={j} label={b.label} severity={b.severity} />
              ))}
            </div>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
};

export default RepoHealthAssessment;
