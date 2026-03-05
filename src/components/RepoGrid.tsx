import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  GitFork,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  Calendar,
  History,
  Tag,
  X,
  Code2
} from "lucide-react";
import type { GitHubRepo } from "@/services/github";

interface RepoGridProps {
  repos: GitHubRepo[];
}

const ITEMS_PER_PAGE = 6;

const RepoGrid = ({ repos }: RepoGridProps) => {
  const [sortBy, setSortBy] = useState<"stars" | "updated" | "name" | "created">("updated");
  const [filterLang, setFilterLang] = useState<string>("all");
  const [showForked, setShowForked] = useState(true);
  const [page, setPage] = useState(0);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);

  const languages = useMemo(() => {
    const langs = new Set(repos.map((r) => r.language).filter(Boolean) as string[]);
    return ["all", ...Array.from(langs).sort()];
  }, [repos]);

  const filtered = useMemo(() => {
    let r = [...repos];
    if (!showForked) r = r.filter((x) => !x.fork);
    if (filterLang !== "all") r = r.filter((x) => x.language === filterLang);
    r.sort((a, b) => {
      if (sortBy === "stars") return b.stargazers_count - a.stargazers_count;
      if (sortBy === "updated") return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      if (sortBy === "created") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return a.name.localeCompare(b.name);
    });
    return r;
  }, [repos, sortBy, filterLang, showForked]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <select
          value={sortBy}
          onChange={(e) => { setSortBy(e.target.value as "stars" | "updated" | "name" | "created"); setPage(0); }}
          className="bg-card/60 backdrop-blur border border-glass-border rounded-xl px-3 py-2 text-sm text-card-foreground focus:outline-none focus:border-primary/50 cursor-pointer"
        >
          <option value="updated">🕐 Recently Worked</option>
          <option value="created">📅 Date Published</option>
          <option value="stars">⭐ Stars</option>
          <option value="name">🔤 Name</option>
        </select>
        <select
          value={filterLang}
          onChange={(e) => { setFilterLang(e.target.value); setPage(0); }}
          className="bg-card/60 backdrop-blur border border-glass-border rounded-xl px-3 py-2 text-sm text-card-foreground focus:outline-none focus:border-primary/50 cursor-pointer"
        >
          {languages.map((l) => (
            <option key={l} value={l}>{l === "all" ? "All Languages" : l}</option>
          ))}
        </select>
        <button
          onClick={() => { setShowForked(!showForked); setPage(0); }}
          className={`px-3 py-2 text-sm rounded-xl border transition-all ${showForked ? "bg-primary/20 border-primary/40 text-primary" : "bg-card/60 border-glass-border text-muted-foreground"
            }`}
        >
          {showForked ? "Hide Forks" : "Show Forks"}
        </button>
        <span className="text-xs text-muted-foreground ml-auto">{filtered.length} repos</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {paginated.map((repo, i) => (
            <motion.div
              key={repo.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 25 }}
              whileHover={{ y: -8 }}
              onClick={() => setSelectedRepo(repo)}
              className="glass-card p-5 flex flex-col gap-3 cursor-pointer group relative overflow-hidden"
            >
              {/* Background gradient accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/10 transition-colors" />

              <div className="flex justify-between items-start pr-2">
                <h3 className="font-bold text-lg text-card-foreground group-hover:text-primary transition-colors truncate max-w-[80%]">
                  {repo.name}
                </h3>
                {repo.homepage && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="p-1.5 rounded-lg bg-primary/10 text-primary"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </motion.div>
                )}
              </div>

              {repo.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed min-h-[32px]">
                  {repo.description}
                </p>
              )}

              <div className="flex flex-wrap gap-2 mt-auto pt-3">
                {repo.language && (
                  <span className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-lg bg-primary/5 text-primary border border-primary/10">
                    {repo.language}
                  </span>
                )}
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Star className="w-3 h-3 text-yellow-500/50" /> {repo.stargazers_count}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <GitFork className="w-3 h-3" /> {repo.forks_count}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2 pt-3 border-t border-glass-border/30">
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
                  {new Date(repo.updated_at).toLocaleDateString()}
                </span>
                {repo.homepage && (
                  <span className="text-[10px] text-primary/80 font-mono animate-pulse">
                    LIVE_DEMO_AVAILABLE
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="neon-button !px-4 !py-2.5 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="px-4 py-2 bg-card/40 rounded-xl border border-glass-border min-w-[80px] text-center">
            <span className="text-xs text-muted-foreground font-mono font-bold">
              {page + 1} <span className="opacity-30 mx-1">/</span> {totalPages}
            </span>
          </div>
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
            className="neon-button !px-4 !py-2.5 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Repository Detail Modal */}
      <AnimatePresence>
        {selectedRepo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRepo(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl glass-card overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="relative p-6 sm:p-8 border-b border-glass-border/30 bg-primary/5">
                <div className="absolute top-0 right-0 p-4">
                  <button
                    onClick={() => setSelectedRepo(null)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-card-foreground transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
                      <Code2 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight text-card-foreground">
                        {selectedRepo.name}
                      </h2>
                      {selectedRepo.language && (
                        <span className="text-xs font-mono text-primary/60 uppercase tracking-widest">
                          {selectedRepo.language} ENGINE
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                    {selectedRepo.description || "No mission brief provided for this repository."}
                  </p>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="glass-card p-4 flex flex-col gap-1 items-center justify-center text-center bg-white/[0.02]">
                    <Star className="w-4 h-4 text-yellow-500 mb-1" />
                    <span className="text-lg font-bold">{selectedRepo.stargazers_count}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Stars</span>
                  </div>
                  <div className="glass-card p-4 flex flex-col gap-1 items-center justify-center text-center bg-white/[0.02]">
                    <GitFork className="w-4 h-4 text-primary mb-1" />
                    <span className="text-lg font-bold">{selectedRepo.forks_count}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Forks</span>
                  </div>
                  <div className="glass-card p-4 flex flex-col gap-1 items-center justify-center text-center bg-white/[0.02]">
                    <AlertCircle className="w-4 h-4 text-destructive mb-1" />
                    <span className="text-lg font-bold">{selectedRepo.open_issues_count}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Issues</span>
                  </div>
                  <div className="glass-card p-4 flex flex-col gap-1 items-center justify-center text-center bg-white/[0.02]">
                    <History className="w-4 h-4 text-neutral-400 mb-1" />
                    <span className="text-lg font-bold">{(selectedRepo.size / 1024).toFixed(1)}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Megabytes</span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-primary/60 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" /> Project Timeline
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Inception</span>
                        <span className="font-mono">{new Date(selectedRepo.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Last Uplink</span>
                        <span className="font-mono text-primary/80">{new Date(selectedRepo.updated_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-primary/60 flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5" /> Metadata Tags
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedRepo.topics && selectedRepo.topics.length > 0 ? (
                        selectedRepo.topics.map(topic => (
                          <span key={topic} className="px-2 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] text-card-foreground">
                            #{topic}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground italic">No tags detected.</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 sm:p-8 border-t border-glass-border/30 bg-black/40 mt-auto flex flex-col sm:flex-row gap-4">
                <motion.a
                  href={selectedRepo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#0a0f1d] border border-white/5 text-white font-bold text-sm shadow-xl transition-all"
                >
                  <Github className="w-4 h-4" />
                  Access Repository
                </motion.a>

                {selectedRepo.homepage && (
                  <motion.a
                    href={selectedRepo.homepage.startsWith('http') ? selectedRepo.homepage : `https://${selectedRepo.homepage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-black font-bold text-sm shadow-xl transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Launch Live Demo
                  </motion.a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RepoGrid;
