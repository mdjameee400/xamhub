import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, GitFork, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import type { GitHubRepo } from "@/services/github";

interface RepoGridProps {
  repos: GitHubRepo[];
}

const ITEMS_PER_PAGE = 6;

const RepoGrid = ({ repos }: RepoGridProps) => {
  const [sortBy, setSortBy] = useState<"stars" | "updated" | "name">("stars");
  const [filterLang, setFilterLang] = useState<string>("all");
  const [showForked, setShowForked] = useState(true);
  const [page, setPage] = useState(0);

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
          onChange={(e) => { setSortBy(e.target.value as "stars" | "updated" | "name"); setPage(0); }}
          className="bg-card/60 backdrop-blur border border-glass-border rounded-xl px-3 py-2 text-sm text-card-foreground focus:outline-none focus:border-primary/50"
        >
          <option value="stars">⭐ Stars</option>
          <option value="updated">🕐 Updated</option>
          <option value="name">🔤 Name</option>
        </select>
        <select
          value={filterLang}
          onChange={(e) => { setFilterLang(e.target.value); setPage(0); }}
          className="bg-card/60 backdrop-blur border border-glass-border rounded-xl px-3 py-2 text-sm text-card-foreground focus:outline-none focus:border-primary/50"
        >
          {languages.map((l) => (
            <option key={l} value={l}>{l === "all" ? "All Languages" : l}</option>
          ))}
        </select>
        <button
          onClick={() => { setShowForked(!showForked); setPage(0); }}
          className={`px-3 py-2 text-sm rounded-xl border transition-all ${
            showForked ? "bg-primary/20 border-primary/40 text-primary" : "bg-card/60 border-glass-border text-muted-foreground"
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
            <motion.a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 25 }}
              whileHover={{ y: -8 }}
              className="glass-card p-4 flex flex-col gap-2 cursor-pointer group"
            >
              <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors truncate">
                {repo.name}
              </h3>
              {repo.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">{repo.description}</p>
              )}
              <div className="flex flex-wrap gap-2 mt-auto pt-2">
                {repo.language && (
                  <span className="text-xs px-2 py-0.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                    {repo.language}
                  </span>
                )}
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="w-3 h-3" /> {repo.stargazers_count}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <GitFork className="w-3 h-3" /> {repo.forks_count}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <AlertCircle className="w-3 h-3" /> {repo.open_issues_count}
                </span>
              </div>
              <div className="text-[10px] text-muted-foreground/60 mt-1">
                Updated {new Date(repo.updated_at).toLocaleDateString()} · {(repo.size / 1024).toFixed(1)} MB
              </div>
            </motion.a>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="neon-button !px-3 !py-2 disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-muted-foreground font-mono">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
            className="neon-button !px-3 !py-2 disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default RepoGrid;
