import { useMemo } from "react";
import { motion } from "framer-motion";
import { Flame, Moon, Zap } from "lucide-react";
import { calculateAddiction } from "@/utils/realityCheck";
import type { GitHubEvent } from "@/services/github";

interface AddictionMeterProps {
  events: GitHubEvent[];
}

const CircularGauge = ({ score, max = 10 }: { score: number; max?: number }) => {
  const radius = 70;
  const stroke = 8;
  const circumference = 2 * Math.PI * radius;
  const pct = score / max;
  const offset = circumference * (1 - pct);

  const color =
    score >= 8 ? "hsl(0, 84%, 60%)" : score >= 5 ? "hsl(38, 92%, 50%)" : "hsl(213, 94%, 55%)";

  return (
    <div className="relative w-44 h-44 mx-auto">
      <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="hsl(222, 30%, 14%)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
          style={{
            filter: `drop-shadow(0 0 8px ${color})`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
          className="text-3xl font-bold font-mono text-card-foreground"
        >
          {score}
        </motion.span>
        <span className="text-xs text-muted-foreground">/10</span>
      </div>
    </div>
  );
};

const AddictionMeter = ({ events }: AddictionMeterProps) => {
  const addiction = useMemo(() => calculateAddiction(events), [events]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="glass-card p-5 flex flex-col"
    >
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-card-foreground">GitHub Addiction Meter</h3>
      </div>

      <CircularGauge score={addiction.score} />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mt-5">
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/20 border border-glass-border">
          <Flame className="w-4 h-4 text-primary shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Commits/Week</p>
            <p className="text-sm font-mono font-semibold text-card-foreground">{addiction.commitsPerWeek}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/20 border border-glass-border">
          <Moon className="w-4 h-4 text-primary shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Late Night</p>
            <p className="text-sm font-mono font-semibold text-card-foreground">{addiction.lateNightPct}%</p>
          </div>
        </div>
      </div>

      {/* Addict Badge */}
      {addiction.isAddict && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, type: "spring" }}
          className="mt-5 mx-auto relative"
        >
          <div className="px-4 py-2 rounded-2xl border border-primary/50 bg-primary/10 text-center relative overflow-hidden">
            <div
              className="absolute inset-0 rounded-2xl animate-pulse"
              style={{
                background:
                  "linear-gradient(135deg, hsl(213 94% 55% / 0.15), hsl(280 80% 60% / 0.1), hsl(213 94% 55% / 0.15))",
                boxShadow:
                  "0 0 20px hsl(213 94% 55% / 0.3), inset 0 0 20px hsl(213 94% 55% / 0.1)",
              }}
            />
            <p className="relative text-xs font-bold font-mono text-primary tracking-wider">
              ⚡ CERTIFIED CODE ADDICT ⚡
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AddictionMeter;
