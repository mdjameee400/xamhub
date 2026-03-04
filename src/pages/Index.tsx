import { motion } from "framer-motion";
import Background from "@/components/Background";
import SearchBar from "@/components/SearchBar";
import ProfilePanel from "@/components/ProfilePanel";
import RepoGrid from "@/components/RepoGrid";
import Analytics from "@/components/Analytics";
import SkeletonDashboard from "@/components/SkeletonDashboard";
import { useGitHub } from "@/hooks/useGitHub";

const Index = () => {
  const { data, loading, error, analyze } = useGitHub();

  return (
    <div className="min-h-screen relative">
      <Background />
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight neon-text text-card-foreground">
            Xam<span className="text-primary">Hub</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Futuristic GitHub Developer Analytics
          </p>
        </motion.div>

        {/* Search */}
        <SearchBar onSearch={analyze} loading={loading} />

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-4 mt-6 text-center text-destructive text-sm max-w-xl mx-auto border-destructive/30"
          >
            {error}
          </motion.div>
        )}

        {/* Loading */}
        {loading && <SkeletonDashboard />}

        {/* Dashboard */}
        {data && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="mt-8 space-y-8"
          >
            {/* Profile + Analytics row */}
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
              <ProfilePanel user={data.user} />
              <Analytics repos={data.repos} events={data.events} />
            </div>

            {/* Repos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-lg font-semibold text-card-foreground mb-4 neon-text">
                Repositories
              </h2>
              <RepoGrid repos={data.repos} />
            </motion.div>
          </motion.div>
        )}

        {/* Empty state */}
        {!data && !loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-16 text-muted-foreground text-sm"
          >
            Enter a GitHub username to explore their developer universe
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Index;
