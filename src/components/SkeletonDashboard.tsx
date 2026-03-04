import { motion } from "framer-motion";

const SkeletonDashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 mt-8"
    >
      {/* Profile skeleton */}
      <div className="glass-card p-6 max-w-sm mx-auto">
        <div className="flex flex-col items-center gap-4">
          <div className="skeleton-dark w-28 h-28 rounded-full" />
          <div className="skeleton-dark w-32 h-5" />
          <div className="skeleton-dark w-48 h-4" />
          <div className="flex gap-4">
            <div className="skeleton-dark w-20 h-4" />
            <div className="skeleton-dark w-20 h-4" />
          </div>
        </div>
      </div>
      {/* Repo skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass-card p-4 space-y-3">
            <div className="skeleton-dark w-3/4 h-5" />
            <div className="skeleton-dark w-full h-3" />
            <div className="skeleton-dark w-1/2 h-3" />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default SkeletonDashboard;
