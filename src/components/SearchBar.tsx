import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (username: string) => void;
  loading: boolean;
}

const SearchBar = ({ onSearch, loading }: SearchBarProps) => {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !loading) onSearch(value.trim());
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="flex items-center gap-3 w-full max-w-xl mx-auto"
    >
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter GitHub username..."
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-card/60 backdrop-blur-xl border border-glass-border text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all font-mono text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={loading || !value.trim()}
        className="neon-button disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
            Analyzing
          </span>
        ) : (
          "Analyze"
        )}
      </button>
    </motion.form>
  );
};

export default SearchBar;
