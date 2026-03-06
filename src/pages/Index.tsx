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
import Contribute from "@/components/Contribute";
import StreakMap from "@/components/StreakMap";
import { useGitHub } from "@/hooks/useGitHub";
import { useCompare } from "@/hooks/useCompare";

type Mode = "analyze" | "compare";

const Index = () => {
  const [mode, setMode] = useState<Mode>("analyze");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const github = useGitHub();
  const compare = useCompare();

  const handleYearChange = async (year: number) => {
    setSelectedYear(year);
    await github.switchYear(year);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden text-neutral-200">
      <Background />
      <div className="relative z-10 flex-1 max-w-6xl mx-auto w-full px-4 py-8 sm:py-12 flex flex-col">
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
            className={`px-5 py-2.5 text-sm rounded-2xl border transition-all ${mode === "analyze"
              ? "neon-button border-primary/40"
              : "bg-card/40 border-glass-border text-muted-foreground hover:text-card-foreground"
              }`}
          >
            Analyze
          </button>
          <button
            onClick={() => setMode("compare")}
            className={`px-5 py-2.5 text-sm rounded-2xl border transition-all ${mode === "compare"
              ? "neon-button border-primary/40"
              : "bg-card/40 border-glass-border text-muted-foreground hover:text-card-foreground"
              }`}
          >
            Compare
          </button>
        </div>

        {/* Mobile/Tab Mission Board */}
        <div className="mb-8">
          <Contribute isMobile />
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

            {/* Streak Map Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <StreakMap
                calendar={github.data.calendar}
                years={github.data.years}
                onYearChange={handleYearChange}
                currentYear={selectedYear || github.data.years[0]}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h2 className="text-lg font-semibold text-card-foreground mb-4 neon-text">Repositories</h2>
              <RepoGrid repos={github.data.repos} username={github.data.user.login} />
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

        {/* Empty state / Prototype Skeleton */}
        {((mode === "analyze" && !github.data && !github.loading && !github.error) ||
          (mode === "compare" && !compare.dataA && !compare.loading && !compare.error)) && (
            <div className="mt-12 space-y-12">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 0.5 }}
                className="text-center text-muted-foreground text-sm space-y-2"
              >
                <p className="font-display tracking-[0.2em] uppercase text-[10px] text-primary/60">Ready for data ingestion</p>
                <p>Enter {mode === "analyze" ? "a GitHub username" : "two usernames"} to generate a {mode === "analyze" ? "full developer universe analysis" : "comparative report"}</p>
              </motion.div>

              {/* Skeleton Preview */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 0.15 }}
                className="pointer-events-none select-none"
              >
                <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 mb-8">
                  <div className="glass-card h-[380px] p-6 space-y-4">
                    <div className="w-24 h-24 rounded-full bg-white/10 mx-auto" />
                    <div className="w-1/2 h-4 bg-white/10 mx-auto" />
                    <div className="w-3/4 h-3 bg-white/10 mx-auto" />
                    <div className="space-y-2 mt-8">
                      <div className="w-full h-8 bg-white/5 rounded-lg" />
                      <div className="w-full h-8 bg-white/5 rounded-lg" />
                      <div className="w-full h-8 bg-white/5 rounded-lg" />
                    </div>
                  </div>
                  <div className="glass-card p-6">
                    <div className="flex justify-between mb-8">
                      <div className="w-32 h-6 bg-white/10" />
                      <div className="w-20 h-6 bg-white/10" />
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-end h-[180px]">
                      <div className="h-[40%] bg-white/5 rounded-t-lg" />
                      <div className="h-[70%] bg-white/5 rounded-t-lg" />
                      <div className="h-[90%] bg-white/5 rounded-t-lg" />
                      <div className="h-[50%] bg-white/5 rounded-t-lg" />
                    </div>
                  </div>
                </div>

                <div className="glass-card h-[300px] p-6 flex flex-col justify-center items-center gap-4">
                  <div className="w-20 h-20 rounded-xl border border-white/10" />
                  <div className="w-64 h-4 bg-white/10" />
                  <div className="flex gap-4">
                    <div className="w-32 h-10 bg-white/5 rounded-xl" />
                    <div className="w-32 h-10 bg-white/5 rounded-xl" />
                  </div>
                </div>
              </motion.div>
            </div>
          )}

      </div>

      <Contribute />

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-4 py-8 mt-auto border-t border-glass-border/30">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-[0.2em]">
            // XamHub.v1.0.core.stable
          </p>
          <p className="text-[10px] text-muted-foreground font-mono">
            © {new Date().getFullYear()} XamHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
