import { useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Download, Share2, Code2, Star, GitFork, Users, Zap } from "lucide-react";
import html2canvas from "html2canvas";
import { computeStats } from "@/utils/scoring";
import { generateRoast } from "@/utils/realityCheck";
import type { GitHubData } from "@/services/github";

interface ResumeCardProps {
  data: GitHubData;
}

/* ── Helpers ── */

function inferStack(languages: Record<string, number>): string {
  const frontend = ["JavaScript", "TypeScript", "CSS", "HTML", "Vue", "Svelte"];
  const backend = ["Python", "Java", "Go", "Rust", "C#", "PHP", "Ruby", "C", "C++"];
  const devops = ["Shell", "Dockerfile", "HCL", "Nix"];
  const data = ["Jupyter Notebook", "R", "Julia"];

  let fCount = 0, bCount = 0, dCount = 0, dtCount = 0;
  Object.entries(languages).forEach(([lang, n]) => {
    if (frontend.includes(lang)) fCount += n;
    if (backend.includes(lang)) bCount += n;
    if (devops.includes(lang)) dCount += n;
    if (data.includes(lang)) dtCount += n;
  });

  const max = Math.max(fCount, bCount, dCount, dtCount);
  if (max === 0) return "Generalist";
  if (fCount === max) return "Frontend Engineer";
  if (bCount === max) return "Backend Engineer";
  if (dCount === max) return "DevOps Engineer";
  return "Data Engineer";
}

function gradeFromScore(score: number): string {
  if (score >= 85) return "S";
  if (score >= 70) return "A+";
  if (score >= 55) return "A";
  if (score >= 40) return "B+";
  if (score >= 25) return "B";
  return "C";
}

function commitInsight(events: GitHubData["events"]): string {
  const pushes = events.filter((e) => e.type === "PushEvent").length;
  if (pushes > 30) return "Commit Stream: Consistent Pulse Detected";
  if (pushes > 10) return "System Activity: Intermittent Bursts Detected";
  if (pushes > 3) return "Signal Faint: Occasional Transmissions";
  return "Status: Deep Hibernation Mode";
}

function topPercentile(score: number): number {
  // Map impact 0-100 to percentile — higher impact = lower percentile (better)
  return Math.max(1, Math.min(99, 100 - score));
}

/* ── Component ── */

const ResumeCard = ({ data }: ResumeCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const stats = useMemo(() => computeStats(data), [data]);
  const stack = useMemo(() => inferStack(stats.languages), [stats.languages]);
  const grade = useMemo(() => gradeFromScore(stats.impactScore), [stats.impactScore]);
  const insight = useMemo(() => commitInsight(data.events), [data.events]);
  const percentile = useMemo(() => topPercentile(stats.impactScore), [stats.impactScore]);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#000",
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement("a");
      link.download = `${stats.username}-resume.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  const handleShare = () => {
    const text = `Check out my Developer DNA on XamHub! 🚀\n\n🏆 Top ${percentile}% | ⭐ ${stats.totalStars} stars | 📦 ${stats.totalRepos} repos\n\nGet yours at ${window.location.origin}`;
    window.open(
      `https://x.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="flex flex-col items-center gap-5"
    >
      {/* ── The Card ── */}
      <div
        ref={cardRef}
        className="resume-card relative w-full max-w-[600px] rounded-2xl overflow-hidden"
        style={{
          background: "rgba(10, 15, 30, 0.75)",
          backdropFilter: "blur(15px)",
          WebkitBackdropFilter: "blur(15px)",
        }}
      >
        {/* Neon circuit border */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none resume-border-glow" />

        {/* Grid constellation bg */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none resume-grid-bg" />

        {/* Content */}
        <div className="relative z-10 p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <p className="text-xs font-mono tracking-[0.3em] uppercase text-primary/70 mb-1">
              // system.resume.generate()
            </p>
            <h2 className="text-xl sm:text-2xl font-bold neon-text text-card-foreground">
              👨‍💻 Developer Resume
            </h2>
          </div>

          {/* Two-column body */}
          <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-6">
            {/* Left: Profile */}
            <div className="flex flex-col items-center text-center gap-3">
              {/* Avatar with scanning ring */}
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 rounded-full border-2 border-primary/30 resume-scan-ring" />
                <img
                  src={data.user.avatar_url}
                  alt={stats.username}
                  className="w-full h-full rounded-full object-cover border-2 border-primary/50"
                  crossOrigin="anonymous"
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-card-foreground">{stats.name}</p>
                <p className="text-xs text-muted-foreground font-mono">@{stats.username}</p>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-primary/30 text-primary/80 bg-primary/5">
                {stack}
              </span>

              {/* Top language pill */}
              <span className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-full bg-primary/15 text-primary border border-primary/25 neon-text">
                <Code2 className="w-3 h-3" />
                {stats.topLanguage}
              </span>
            </div>

            {/* Right: Stats */}
            <div className="flex flex-col gap-3">
              {/* Stat rows */}
              <div className="grid grid-cols-2 gap-3">
                <StatBlock icon={<GitFork className="w-3.5 h-3.5" />} label="Repositories" value={stats.totalRepos} />
                <StatBlock icon={<Star className="w-3.5 h-3.5" />} label="Total Stars" value={stats.totalStars} />
                <StatBlock icon={<Users className="w-3.5 h-3.5" />} label="Followers" value={stats.followers} />
                <StatBlock icon={<Zap className="w-3.5 h-3.5" />} label="Impact Score" value={`${stats.impactScore}/100`} />
              </div>

              {/* OS Grade */}
              <div className="flex items-center gap-3 mt-1 p-3 rounded-xl border border-primary/20 bg-primary/5">
                <span className="text-xs text-muted-foreground font-mono">Open Source Grade</span>
                <span className="ml-auto text-lg font-bold text-primary neon-text">{grade}</span>
              </div>

              {/* Global Rank badge */}
              <div className="resume-rank-badge flex items-center justify-center gap-2 p-3 rounded-xl border border-primary/30 bg-primary/10">
                <span className="text-2xl sm:text-3xl font-bold text-primary neon-text">
                  Top {percentile}%
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-primary/10 text-center">
            <p className="text-xs font-mono text-muted-foreground mb-2">
              ▸ {insight}
            </p>
            <p className="text-[10px] font-mono text-primary/40 tracking-wider">
              Powered by <span className="text-primary/60">XamHub</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── Control Panel (outside card) ── */}
      <div className="flex gap-3">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-5 py-2.5 text-sm rounded-2xl border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 hover:border-primary/50 transition-all font-mono"
        >
          <Download className="w-4 h-4" />
          Download PNG
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-5 py-2.5 text-sm rounded-2xl border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 hover:border-primary/50 transition-all font-mono"
        >
          <Share2 className="w-4 h-4" />
          Share to X
        </button>
      </div>
    </motion.div>
  );
};

/* ── Stat Block ── */

function StatBlock({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-1 p-2.5 rounded-xl border border-glass-border bg-card/40">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-[10px] font-mono uppercase tracking-wider">{label}</span>
      </div>
      <span className="text-sm font-bold text-card-foreground">{value}</span>
    </div>
  );
}

export default ResumeCard;
