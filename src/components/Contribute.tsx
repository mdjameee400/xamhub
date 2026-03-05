import { motion } from "framer-motion";
import { Github, Star, GitPullRequest, Heart } from "lucide-react";

const Contribute = () => {
    const repoUrl = "https://github.com/mdjameee400/xamhub";

    return (
        <section className="mt-24 mb-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="glass-card p-8 sm:p-12 relative overflow-hidden group"
            >
                {/* Animated Background Element */}
                <div className="absolute top-0 right-0 -transtion-y-1/2 translate-x-1/2 w-64 h-64 bg-primary/10 blur-[100px] rounded-full group-hover:bg-primary/20 transition-colors duration-700" />

                <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-[10px] uppercase tracking-[0.2em] font-mono mb-2">
                        <Heart className="w-3 h-3 fill-primary animate-pulse" />
                        Open Source Initiative
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-card-foreground font-display">
                        Built by the community, <br className="hidden sm:block" />
                        <span className="text-primary neon-text">for the community.</span>
                    </h2>

                    <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
                        XamHub is an open-source project dedicated to providing developers with cinematic insights into their journey.
                        Want to help improve the algorithm or add a new feature? Your contribution can shape the future of developer analytics.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 pt-4">
                        <motion.a
                            href={repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-black font-semibold text-sm transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                        >
                            <Github className="w-4 h-4" />
                            View Repository
                        </motion.a>

                        <motion.a
                            href={`${repoUrl}/stargazers`}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-primary/40 bg-primary/10 text-primary font-semibold text-sm transition-all hover:bg-primary/20 hover:border-primary/60"
                        >
                            <Star className="w-4 h-4 fill-primary/20" />
                            Star on GitHub
                        </motion.a>

                        <motion.a
                            href={`${repoUrl}/pulls`}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-glass-border bg-card/40 text-muted-foreground hover:text-card-foreground font-semibold text-sm transition-all"
                        >
                            <GitPullRequest className="w-4 h-4" />
                            Contribute
                        </motion.a>
                    </div>

                    <div className="pt-8 grid grid-cols-2 sm:grid-cols-3 gap-8 w-full max-w-lg opacity-40 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700">
                        <div className="flex flex-col items-center space-y-1">
                            <span className="text-xs font-mono">100% Free</span>
                        </div>
                        <div className="flex flex-col items-center space-y-1">
                            <span className="text-xs font-mono">MIT Licensed</span>
                        </div>
                        <div className="hidden sm:flex flex-col items-center space-y-1">
                            <span className="text-xs font-mono">GitHub API v3</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default Contribute;
