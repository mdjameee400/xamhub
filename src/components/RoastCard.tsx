import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Terminal, Share2 } from "lucide-react";
import { generateRoast, type RoastResult } from "@/utils/realityCheck";
import type { GitHubRepo, GitHubEvent } from "@/services/github";

interface RoastCardProps {
  repos: GitHubRepo[];
  events: GitHubEvent[];
  username: string;
}

function useTypingAnimation(lines: string[], speed = 30, lineDelay = 600) {
  const [displayed, setDisplayed] = useState<string[]>([]);

  useEffect(() => {
    setDisplayed([]);
    let lineIdx = 0;
    let charIdx = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const type = () => {
      if (lineIdx >= lines.length) return;
      const currentLine = lines[lineIdx];

      if (charIdx <= currentLine.length) {
        setDisplayed((prev) => {
          const next = [...prev];
          next[lineIdx] = currentLine.slice(0, charIdx);
          return next;
        });
        charIdx++;
        timeout = setTimeout(type, speed);
      } else {
        lineIdx++;
        charIdx = 0;
        timeout = setTimeout(type, lineDelay);
      }
    };

    timeout = setTimeout(type, 400);
    return () => clearTimeout(timeout);
  }, [lines, speed, lineDelay]);

  return displayed;
}

const RoastCard = ({ repos, events, username }: RoastCardProps) => {
  const roast: RoastResult = useMemo(() => generateRoast(repos, events), [repos, events]);

  const terminalLines = useMemo(() => {
    const lines: string[] = [];
    lines.push(`> scanning @${username}...`);
    lines.push(`> primary language: ${roast.topLanguage}`);
    if (roast.abandonedLine) lines.push(`> ${roast.abandonedLine}`);
    lines.push(`> ${roast.languageRoast}`);
    lines.push(`> ${roast.commitRoast}`);
    lines.push(`> analysis complete. have a nice day... or don't. 🤷`);
    return lines;
  }, [roast, username]);

  const displayed = useTypingAnimation(terminalLines);

  const handleShare = () => {
    const text = `🔥 XamHub just roasted my GitHub:\n\n${roast.languageRoast}\n${roast.commitRoast}\n\nGet yours at ${window.location.origin}`;
    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card overflow-hidden"
    >
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-glass-border bg-muted/30">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-destructive/70" />
          <span className="w-3 h-3 rounded-full bg-accent/70" />
          <span className="w-3 h-3 rounded-full bg-primary/70" />
        </div>
        <div className="flex items-center gap-1.5 ml-2">
          <Terminal className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-mono text-muted-foreground">roast-engine v1.0</span>
        </div>
        <button
          onClick={handleShare}
          className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono text-primary hover:bg-primary/10 border border-primary/20 hover:border-primary/40 transition-all"
        >
          <Share2 className="w-3 h-3" />
          Share
        </button>
      </div>

      {/* Terminal body */}
      <div className="p-4 font-mono text-sm space-y-1.5 min-h-[180px] bg-background/40">
        {displayed.map((line, i) => (
          <div key={i} className="flex">
            <span
              className={
                line?.startsWith("> scanning")
                  ? "text-primary"
                  : line?.startsWith("> primary")
                  ? "text-muted-foreground"
                  : line?.startsWith("> analysis")
                  ? "text-primary/70"
                  : "text-card-foreground"
              }
            >
              {line}
            </span>
            {i === displayed.length - 1 && (
              <span className="inline-block w-2 h-4 bg-primary ml-0.5 animate-pulse" />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default RoastCard;
