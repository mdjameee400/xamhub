import { motion } from "framer-motion";

const SkeletonDashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12 mt-8 relative"
    >
      <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full opacity-20 pointer-events-none" />

      {/* Search Header Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        {/* Profile Card Skeleton */}
        <div className="glass-card p-6 flex flex-col items-center gap-6 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-pulse" />
          <div className="w-28 h-28 rounded-full bg-white/10 animate-pulse border-2 border-white/5" />
          <div className="space-y-3 w-full flex flex-col items-center">
            <div className="w-32 h-6 bg-white/10 rounded-lg animate-pulse" />
            <div className="w-48 h-4 bg-white/5 rounded-lg animate-pulse" />
          </div>
          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="h-16 bg-white/5 rounded-xl animate-pulse" />
            <div className="h-16 bg-white/5 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* Analytics Skeleton */}
        <div className="glass-card p-6 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div className="w-32 h-6 bg-white/10 rounded-lg animate-pulse" />
            <div className="w-24 h-4 bg-white/5 rounded-lg animate-pulse" />
          </div>
          <div className="flex-1 grid grid-cols-6 gap-2 items-end min-h-[200px]">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-primary/10 rounded-t-lg animate-pulse"
                style={{ height: `${20 + Math.random() * 60}%`, animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="space-y-4">
        <div className="w-32 h-6 bg-white/10 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card p-5 space-y-4 relative overflow-hidden">
              <div className="flex justify-between">
                <div className="w-1/2 h-5 bg-white/10 rounded animate-pulse" />
                <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />
              </div>
              <div className="w-full h-3 bg-white/5 rounded animate-pulse" />
              <div className="w-2/3 h-3 bg-white/5 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SkeletonDashboard;
