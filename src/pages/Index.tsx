import { useState } from "react";
import { motion } from "framer-motion";
import Background from "@/components/Background";
import SearchBar from "@/components/SearchBar";
import ProfilePanel from "@/components/ProfilePanel";
import RepoGrid from "@/components/RepoGrid";
import Analytics from "@/components/Analytics";
import RepoHealthAssessment from "@/components/RepoHealthAssessment";
import RoastCard from "@/components/RoastCard";
import AddictionMeter from "@/components/AddictionMeter";
import ResumeCard from "@/components/ResumeCard";
import SkeletonDashboard from "@/components/SkeletonDashboard";
import CompareSearch from "@/components/CompareSearch";
import CompareView from "@/components/CompareView";
import { useGitHub } from "@/hooks/useGitHub";
import { useCompare } from "@/hooks/useCompare";

type Mode = "analyze" | "compare";

const Index = () => {
  const [mode, setMode] = useState<Mode>("analyze");
  const github = useGitHub();
  const compare = useCompare();

  return (
    <div className="min-h-screen relative">
      <Background />
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight neon-text text-card-foreground">
            Xam<span className="text-primary">Hub</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Futuristic GitHub Developer Analytics
          </p>
        </motion.div>

        {/* Mode Toggle */}
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setMode("analyze")}
            className={`px-5 py-2.5 text-sm rounded-2xl border transition-all ${
              mode === "analyze"
                ? "neon-button border-primary/40"
                : "bg-card/40 border-glass-border text-muted-foreground hover:text-card-foreground"
            }`}
          >
            Analyze
          </button>
          <button
            onClick={() => setMode("compare")}
            className={`px-5 py-2.5 text-sm rounded-2xl border transition-all ${
              mode === "compare"
                ? "neon-button border-primary/40"
                : "bg-card/40 border-glass-border text-muted-foreground hover:text-card-foreground"
            }`}
          >
            Compare
          </button>
        </div>

        {/* Search */}
        {mode === "analyze" ? (
          <SearchBar onSearch={github.analyze} loading={github.loading} />
        ) : (
          <CompareSearch onCompare={compare.compare} loading={compare.loading} />
        )}

        {/* Errors */}
        {(mode === "analyze" ? github.error : compare.error) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-4 mt-6 text-center text-destructive text-sm max-w-xl mx-auto border-destructive/30"
          >
            {mode === "analyze" ? github.error : compare.error}
          </motion.div>
        )}

        {/* Loading */}
        {(mode === "analyze" ? github.loading : compare.loading) && <SkeletonDashboard />}

        {/* Analyze Dashboard */}
        {mode === "analyze" && github.data && !github.loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="mt-8 space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
              <ProfilePanel user={github.data.user} />
              <Analytics repos={github.data.repos} events={github.data.events} />
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h2 className="text-lg font-semibold text-card-foreground mb-4 neon-text">Repositories</h2>
              <RepoGrid repos={github.data.repos} />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <RepoHealthAssessment repos={github.data.repos} events={github.data.events} />
            </motion.div>

            {/* Developer Resume Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <h2 className="text-lg font-semibold text-card-foreground mb-4 neon-text flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
                Developer Resume
              </h2>
              <ResumeCard data={github.data} />
            </motion.div>

            {/* System Diagnostics */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
              <h2 className="text-lg font-semibold text-card-foreground mb-4 neon-text flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
                System Diagnostics
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
                <RoastCard repos={github.data.repos} events={github.data.events} username={github.data.user.login} />
                <AddictionMeter events={github.data.events} />
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Compare Dashboard */}
        {mode === "compare" && compare.dataA && compare.dataB && !compare.loading && (
          <CompareView dataA={compare.dataA} dataB={compare.dataB} />
        )}

        {/* Empty state */}
        {((mode === "analyze" && !github.data && !github.loading && !github.error) ||
          (mode === "compare" && !compare.dataA && !compare.loading && !compare.error)) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-16 text-muted-foreground text-sm"
          >
            {mode === "analyze"
              ? "Enter a GitHub username to explore their developer universe"
              : "Enter two GitHub usernames to compare their developer profiles"}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Index;
