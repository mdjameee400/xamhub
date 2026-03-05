import { motion } from "framer-motion";
import { Github, Heart, Star, Bell } from "lucide-react";

const Contribute = () => {
    const repoUrl = "https://github.com/mdjameee400/xamhub";
    const profileUrl = "https://github.com/mdjameee400";

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="xl:fixed xl:right-8 xl:top-8 z-40 w-full max-w-sm xl:w-[280px]"
        >
            <div className="glass-card p-6 border-primary/20 bg-primary/5 backdrop-blur-2xl relative overflow-hidden group shadow-[0_0_40px_rgba(0,0,0,0.3)]">
                {/* Animated accent gradient */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[60px] rounded-full group-hover:bg-primary/20 transition-colors duration-500" />

                <div className="relative z-10 space-y-5">
                    {/* Notice Board Header */}
                    <div className="flex items-center gap-2 pb-3 border-b border-primary/10">
                        <div className="p-1.5 rounded-lg bg-primary/10">
                            <Bell className="w-3.5 h-3.5 text-primary animate-bounce fill-primary/20" />
                        </div>
                        <h3 className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-primary/80">
                            Mission Board
                        </h3>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <h4 className="text-sm font-bold text-card-foreground tracking-tight">
                                Support XamHub
                            </h4>
                            <p className="text-[11px] leading-relaxed text-muted-foreground">
                                Help us keep the engine running. Every star or contribution fuels our futuristic vision.
                            </p>
                        </div>

                        <div className="flex flex-col gap-2.5">
                            {/* Dark Button - Contribute */}
                            <motion.a
                                href={repoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ x: 4, backgroundColor: "rgba(10, 15, 29, 0.9)" }}
                                className="flex items-center gap-3 p-3 rounded-xl bg-[#0a0f1d] border border-white/5 text-white transition-all shadow-lg"
                            >
                                <div className="p-1.5 rounded-md bg-white/5">
                                    <Github className="w-4 h-4 text-neutral-400" />
                                </div>
                                <span className="text-[12px] font-medium tracking-tight">Contribute & Star</span>
                            </motion.a>

                            {/* Light Button - Sponsor */}
                            <motion.a
                                href={profileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ x: 4, backgroundColor: "#f9fafb" }}
                                className="flex items-center gap-3 p-3 rounded-xl bg-white text-black transition-all shadow-xl"
                            >
                                <div className="p-1.5 rounded-md bg-red-50">
                                    <Heart className="w-4 h-4 text-red-500 fill-red-500/20" />
                                </div>
                                <span className="text-[12px] font-bold tracking-tight">Sponsor Project</span>
                            </motion.a>
                        </div>

                        {/* Subtle Footer Link */}
                        <div className="pt-2 flex items-center justify-between">
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
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Contribute;
