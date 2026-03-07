import { useMemo } from "react";
import { motion } from "framer-motion";
import { Flame, TrendingUp, Zap, Info } from "lucide-react";
import { format, parseISO, isSameDay } from "date-fns";
import type { ContributionCalendar, ContributionDay } from "@/services/github";

interface StreakMapProps {
    calendar: ContributionCalendar;
    years: number[];
    onYearChange: (year: number) => void;
    currentYear?: number;
}

interface DayWithStreak extends ContributionDay {
    streakDay?: number;
    isConnectedToPrev?: boolean;
}

const StreakMap = ({ calendar, years, onYearChange, currentYear }: StreakMapProps) => {
    // 1. Calculate streaks on flattened data first
    const processedDaysMap = useMemo(() => {
        const flattened = calendar.weeks.flatMap((w) => w.contributionDays);
        const map = new Map<string, DayWithStreak>();
        let currentStreakCount = 0;

        flattened.forEach((day, i) => {
            if (day.contributionCount > 0) {
                currentStreakCount++;
                const isConnectedToPrev = i > 0 && flattened[i - 1].contributionCount > 0;
                map.set(day.date, { ...day, streakDay: currentStreakCount, isConnectedToPrev });
            } else {
                currentStreakCount = 0;
                map.set(day.date, { ...day });
            }
        });
        return map;
    }, [calendar]);

    // 2. Reconstruct weeks with streak data
    const weeksWithData = useMemo(() => {
        return calendar.weeks.map(week => ({
            ...week,
            contributionDays: week.contributionDays.map(day => processedDaysMap.get(day.date) || day)
        }));
    }, [calendar, processedDaysMap]);

    // 3. Calculate stats
    const stats = useMemo(() => {
        let longest = 0;
        processedDaysMap.forEach(d => {
            if ((d.streakDay || 0) > longest) longest = d.streakDay || 0;
        });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Sort dates to find current streak
        const sortedDates = Array.from(processedDaysMap.keys()).sort();
        let current = 0;

        for (let i = sortedDates.length - 1; i >= 0; i--) {
            const day = processedDaysMap.get(sortedDates[i])!;
            const dDate = new Date(day.date);
            dDate.setHours(0, 0, 0, 0);

            if (day.contributionCount > 0) {
                current = day.streakDay || 0;
                break;
            } else {
                // Check if streak is still fresh (today or yesterday)
                const diffDays = Math.floor((today.getTime() - dDate.getTime()) / (1000 * 60 * 60 * 24));
                if (diffDays > 1) break;
            }
        }

        const totalCommitsSum = Array.from(processedDaysMap.values()).reduce((sum, day) => sum + (day.commitCount || 0), 0);

        return { current, longest, totalCommitsSum };
    }, [processedDaysMap]);

    // 4. Month labels aligned to columns
    const monthLabels = useMemo(() => {
        const labels: { name: string; weekIndex: number }[] = [];
        let curMonth = -1;

        weeksWithData.forEach((week, i) => {
            const date = new Date(week.contributionDays[0].date);
            const m = date.getMonth();
            if (m !== curMonth) {
                labels.push({ name: format(date, "MMM"), weekIndex: i });
                curMonth = m;
            }
        });
        return labels;
    }, [weeksWithData]);

    return (
        <div className="glass-card p-6 overflow-hidden relative border-orange-500/60 shadow-[0_0_50px_rgba(255,100,0,0.25)] ring-2 ring-orange-500/30 transition-all duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 border-b border-white/5 pb-4">
                <div>
                    <h3 className="text-xl font-bold neon-text flex items-center gap-2">
                        <div className="relative">
                            <Flame className="w-6 h-6 text-orange-500 fill-orange-500/20" />
                            <motion.div
                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full"
                            />
                        </div>
                        Streak Heatmap
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">Real-time thermal monitoring of developer output</p>
                </div>

                <div className="flex gap-2">
                    <StatBox label="Yearly Total Commits" value={calendar.totalCommits || stats.totalCommitsSum || 0} unit="COMMITS" color="orange" icon={<Flame className="w-3 h-3" />} />
                    <StatBox label="Current Streak" value={stats.current} unit="DAYS" color="primary" icon={<Zap className="w-3 h-3" />} />
                    <StatBox label="Max Streak" value={stats.longest} unit="DAYS" color="primary" icon={<TrendingUp className="w-3 h-3" />} />
                </div>
            </div>

            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                {years.sort((a, b) => b - a).map(year => (
                    <button
                        key={year}
                        onClick={() => onYearChange(year)}
                        className={`px-3 py-1 text-[10px] font-mono rounded-full border transition-all ${currentYear === year || (!currentYear && year === years[0])
                            ? "border-orange-500/50 bg-orange-500/10 text-orange-400"
                            : "border-glass-border bg-white/5 text-muted-foreground hover:text-card-foreground"
                            }`}
                    >
                        {year}
                    </button>
                ))}
            </div>

            <div className="relative py-2 pb-6 min-h-[140px] flex items-center justify-center">
                {weeksWithData.length > 0 ? (
                    <div className="flex justify-between gap-[3px] w-full">
                        {weeksWithData.map((week, weekIndex) => (
                            <div key={weekIndex} className="grid grid-rows-7 gap-[3px]">
                                {week.contributionDays.map((day, dayIndex) => (
                                    <DayCell key={day.date} day={day} dayIndex={dayIndex} />
                                ))}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 px-6 border-2 border-dashed border-white/10 rounded-2xl bg-white/5 w-full">
                        <Info className="w-8 h-8 text-orange-500/50 mx-auto mb-3" />
                        <p className="text-sm font-bold text-card-foreground">No Heatmap Data Available</p>
                        <p className="text-[10px] text-muted-foreground mt-1 max-w-[280px] mx-auto uppercase tracking-wider">
                            {import.meta.env.VITE_GITHUB_TOKEN
                                ? "This user might have no activity in the selected period."
                                : "Add VITE_GITHUB_TOKEN to show your contribution thermal map."}
                        </p>
                    </div>
                )}

                {/* Dynamic Month Labels aligned to grid columns */}
                {weeksWithData.length > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-4 mt-3">
                        {monthLabels.map((m, i) => (
                            <span
                                key={i}
                                className="absolute text-[9px] font-mono text-white/80 font-bold uppercase whitespace-nowrap"
                                style={{ left: `${(m.weekIndex / weeksWithData.length) * 100}%` }}
                            >
                                {m.name}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-6 flex items-center justify-between text-[10px] text-white/60 border-t border-glass-border/30 pt-4 font-mono uppercase tracking-wider">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-neutral-800" />
                        <span>Idle (0)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-orange-600" />
                        <span>Ember (1-9)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.4)]" />
                        <span>Inferno (10+)</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Info className="w-3 h-3 text-orange-500" />
                    <span className="opacity-80">Biometric Hover Active</span>
                </div>
            </div>

            {/* Background Flare */}
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />
        </div>
    );
};

const StatBox = ({ label, value, unit, color, icon }: { label: string; value: number; unit: string; color: string; icon: React.ReactNode }) => (
    <div className={`px-4 py-3 rounded-2xl bg-black/40 border border-white/5 min-w-[120px] shadow-sm hover:border-orange-500/40 transition-all duration-300 group/stat`}>
        <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-2 mb-2 group-hover/stat:text-white transition-colors">
            {icon} {label}
        </p>
        <p className={`text-2xl font-black leading-none flex items-baseline gap-1.5 ${color === "orange" ? "text-orange-500 drop-shadow-[0_0_8px_rgba(255,100,0,0.4)]" : "text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.4)]"}`}>
            {value} <span className="text-[10px] font-bold text-muted-foreground uppercase">{unit}</span>
        </p>
    </div>
);

const DayCell = ({ day, dayIndex }: { day: DayWithStreak; dayIndex: number }) => {
    const hasCommits = day.contributionCount > 0;
    const intensity = day.contributionCount;

    // Fire animation variants
    const fireVariants = {
        flicker: {
            scale: [1, 1.1, 0.9, 1.2, 1],
            opacity: [0.8, 1, 0.7, 1, 0.8],
            filter: [
                "drop-shadow(0 0 2px rgba(255,100,0,0.4))",
                "drop-shadow(0 0 6px rgba(255,150,0,0.6))",
                "drop-shadow(0 0 3px rgba(240,50,0,0.5))",
            ],
            transition: {
                duration: 0.5 + Math.random() * 0.5,
                repeat: Infinity,
                ease: "easeInOut" as any
            }
        }
    };

    return (
        <div className="aspect-square w-full sm:w-[14px] sm:h-[14px] relative group cursor-crosshair">
            {/* Base Layer */}
            <div
                className={`w-full h-full rounded-[2px] border transition-all duration-300 ${hasCommits
                    ? "bg-orange-500/10 border-orange-500/20 shadow-[inset_0_0_8px_rgba(255,100,0,0.1)]"
                    : "bg-white/5 border-transparent hover:border-white/10"
                    }`}
            />

            {/* Heat Line (Streak connection) */}
            {day.isConnectedToPrev && (
                <div
                    className={`absolute z-0 pointer-events-none bg-orange-500 shadow-[0_0_8px_rgba(255,100,0,0.5)] ${dayIndex === 0
                        ? "w-1 h-[1px] -left-[2px] top-1/2 -translate-y-1/2 opacity-20"
                        : "w-[1px] h-1 -top-[2px] left-1/2 -translate-x-1/2"
                        }`}
                />
            )}

            {/* The Flame */}
            {hasCommits && (
                <motion.div
                    variants={fireVariants}
                    animate="flicker"
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                    <Flame
                        className={`w-[10px] h-[10px] fill-current shadow-orange-500/50 ${intensity >= 10 ? "text-orange-400" : "text-orange-600 opacity-80"}`}
                        strokeWidth={2}
                    />

                    {/* Intense core for high counts */}
                    {intensity >= 10 && (
                        <div className="absolute w-1 h-2 bg-white blur-[2px] rounded-full opacity-40 animate-pulse" />
                    )}
                </motion.div>
            )}

            {/* Glassmorphism Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-[100] invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                <div className="relative">
                    <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-3 rounded-xl shadow-2xl min-w-[160px] relative z-10">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono text-muted-foreground opacity-70">
                                {format(parseISO(day.date), "EEE, MMM do")}
                            </span>
                            {hasCommits && (
                                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-orange-500/10 text-[8px] font-black text-orange-400 border border-orange-500/20">
                                    STREAK_ACTIVE
                                </span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-baseline py-1 border-b border-white/5">
                                <span className="text-[11px] text-muted-foreground">Commits</span>
                                <span className="text-sm font-black text-orange-500">{day.commitCount || 0}</span>
                            </div>
                            <div className="flex justify-between items-baseline py-1 border-b border-white/5">
                                <span className="text-[11px] text-muted-foreground">Total Activity</span>
                                <span className="text-sm font-bold text-card-foreground">{day.contributionCount}</span>
                            </div>
                            {hasCommits && (
                                <div className="flex justify-between items-baseline pt-1 border-t border-white/5">
                                    <span className="text-xs text-muted-foreground">Streak Index</span>
                                    <span className="text-sm font-bold text-orange-500">Day {day.streakDay}</span>
                                </div>
                            )}
                        </div>

                        {/* Aesthetic progress bar */}
                        {hasCommits && (
                            <div className="mt-2 w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min((intensity / 20) * 100, 100)}%` }}
                                    className="h-full bg-orange-500"
                                />
                            </div>
                        )}
                    </div>

                    {/* Tooltip Arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-[1px] border-8 border-transparent border-t-black/60 z-10" />

                    {/* Tooltip Glow */}
                    {hasCommits && (
                        <div className="absolute inset-0 bg-orange-500/20 blur-xl -z-10 rounded-xl" />
                    )}
                </div>
            </div>
        </div>
    );
};

export default StreakMap;
