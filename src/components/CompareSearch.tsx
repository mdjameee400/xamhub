import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ArrowLeftRight } from "lucide-react";

interface CompareSearchProps {
  onCompare: (userA: string, userB: string) => void;
  loading: boolean;
}

const CompareSearch = ({ onCompare, loading }: CompareSearchProps) => {
  const [userA, setUserA] = useState("");
  const [userB, setUserB] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userA.trim() && userB.trim() && !loading) {
      onCompare(userA.trim(), userB.trim());
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-2xl mx-auto"
    >
      <div className="relative flex-1 w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={userA}
          onChange={(e) => setUserA(e.target.value)}
          placeholder="Username A"
          className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-card/60 backdrop-blur-xl border border-glass-border text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all font-mono text-sm"
        />
      </div>

      <ArrowLeftRight className="w-5 h-5 text-primary shrink-0 hidden sm:block" />

      <div className="relative flex-1 w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={userB}
          onChange={(e) => setUserB(e.target.value)}
          placeholder="Username B"
          className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-card/60 backdrop-blur-xl border border-glass-border text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all font-mono text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !userA.trim() || !userB.trim()}
        className="neon-button disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap w-full sm:w-auto"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
            Comparing
          </span>
        ) : (
          "Compare"
        )}
      </button>
    </motion.form>
  );
};

export default CompareSearch;
