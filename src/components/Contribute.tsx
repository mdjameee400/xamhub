import { motion } from "framer-motion";
import { Github, Heart, Star, Bell } from "lucide-react";

interface ContributeProps {
    isMobile?: boolean;
}

const Contribute = ({ isMobile }: ContributeProps) => {
    const repoUrl = "https://github.com/mdjameee400/xamhub";
    const profileUrl = "https://www.supportkori.com/mdjamee400";

    return (
        <motion.div
            initial={{ opacity: 0, x: isMobile ? 0 : 50, y: isMobile ? 20 : 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: isMobile ? 0.2 : 1 }}
            className={isMobile
                ? "w-full max-w-xl mx-auto px-4 xl:hidden"
                : "xl:fixed xl:right-8 xl:top-8 z-40 w-[280px] hidden xl:block"
            }
        >
            <div className={`glass-card ${isMobile ? 'p-5' : 'p-6'} border-primary/20 bg-primary/5 backdrop-blur-2xl relative overflow-hidden group shadow-[0_0_40px_rgba(0,0,0,0.3)]`}>
                {/* Animated accent gradient */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[60px] rounded-full group-hover:bg-primary/20 transition-colors duration-500" />

                <div className="relative z-10 space-y-4">
                    {/* Notice Board Header - Only show full on desktop or if not simplified mobile */}
                    <div className="flex items-center justify-between pb-3 border-b border-primary/10">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-primary/10">
                                <Bell className="w-3.5 h-3.5 text-primary animate-bounce fill-primary/20" />
                            </div>
                            <h3 className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-primary/80">
                                Mission Board
                            </h3>
                        </div>
                        {isMobile && <span className="text-[9px] font-mono text-muted-foreground opacity-30">v1.0.4</span>}
                    </div>

                    <div className={`${isMobile ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'space-y-4'}`}>
                        <div className="space-y-1.5 self-center">
                            <h4 className="text-sm font-bold text-card-foreground tracking-tight">
                                Support XamHub
                            </h4>
                            <p className="text-[10px] leading-relaxed text-muted-foreground/80">
                                Help us keep the engine running. Every star or contribution fuels our futuristic vision.
                            </p>
                        </div>

                        <div className="flex flex-col gap-2">
                            {/* Dark Button - Contribute */}
                            <motion.a
                                href={repoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ x: 4, backgroundColor: "rgba(10, 15, 29, 0.9)" }}
                                className="flex items-center gap-3 p-2 rounded-xl bg-[#0a0f1d] border border-white/5 text-white transition-all shadow-lg"
                            >
                                <div className="p-1 rounded-md bg-white/5">
                                    <Github className="w-3.5 h-3.5 text-neutral-400" />
                                </div>
                                <span className="text-[10px] font-medium tracking-tight">Contribute & Star</span>
                            </motion.a>

                            {/* Light Button - Sponsor */}
                            <motion.a
                                href={profileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ x: 4, backgroundColor: "#f9fafb" }}
                                className="flex items-center gap-3 p-2 rounded-xl bg-white text-black transition-all shadow-xl"
                            >
                                <div className="p-1 rounded-md bg-red-50">
                                    <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500/20" />
                                </div>
                                <span className="text-[10px] font-bold tracking-tight">Support Project</span>
                            </motion.a>
                        </div>
                    </div>

                    {/* Subtle Footer Link - Only on desktop */}
                    {!isMobile && (
                        <div className="pt-2 flex items-center justify-between border-t border-primary/5">
                            <motion.a
                                href={`${repoUrl}/stargazers`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-[10px] font-mono text-primary/60 hover:text-primary transition-colors uppercase tracking-widest"
                            >
                                <Star className="w-3 h-3" />
                                <span>Track Stargazers</span>
                            </motion.a>
                            <span className="text-[9px] font-mono text-muted-foreground opacity-30">v1.0.4</span>
                        </div>
                    )}

                    {/* Compact Mobile Footer */}
                    {isMobile && (
                        <div className="pt-1 flex items-center justify-center sm:justify-start">
                            <motion.a
                                href={`${repoUrl}/stargazers`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-[9px] font-mono text-primary/60 hover:text-primary transition-colors uppercase tracking-widest"
                            >
                                <Star className="w-2.5 h-2.5" />
                                <span>Track Stargazers</span>
                            </motion.a>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default Contribute;
