import { motion } from "framer-motion";
import { Github, Heart, Star, Code2 } from "lucide-react";

const Contribute = () => {
    const repoUrl = "https://github.com/mdjameee400/xamhub";
    const profileUrl = "https://github.com/mdjameee400";

    return (
        <section className="mt-20 mb-16 flex flex-col items-center gap-8 px-4">
            <div className="flex flex-col items-center text-center space-y-3">
                <h3 className="text-xl font-semibold text-card-foreground font-display">
                    Support the Mission
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                    Help us keep the project alive by contributing your code or supporting our open-source efforts.
                </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
                {/* Dark Button - Contribute & Star */}
                <motion.a
                    href={repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 px-6 py-3 rounded-xl bg-[#0a0f1d] border border-white/5 text-white font-medium shadow-2xl transition-all hover:bg-[#111827] hover:border-white/10"
                >
                    <Github className="w-5 h-5 text-neutral-400" />
                    <div className="flex flex-col items-start leading-tight">
                        <span className="text-[13px]">Contribute & Star</span>
                    </div>
                </motion.a>

                {/* Light Button - Donate / Sponsor */}
                <motion.a
                    href={profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white text-black font-medium shadow-xl transition-all hover:bg-neutral-50"
                >
                    <Heart className="w-5 h-5 text-red-500 fill-red-500/20" />
                    <div className="flex flex-col items-start leading-tight">
                        <span className="text-[13px]">Sponsor / Donate</span>
                    </div>
                </motion.a>

                {/* Subtle Github Star Count Link */}
                <motion.a
                    href={`${repoUrl}/stargazers`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -2 }}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-mono text-muted-foreground hover:text-primary transition-colors"
                >
                    <Star className="w-3.5 h-3.5" />
                    <span>Star Hub</span>
                </motion.a>
            </div>
        </section>
    );
};

export default Contribute;
