import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const Preloader = () => {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(() => setLoading(false), 500);
                    return 100;
                }
                return prev + Math.random() * 15;
            });
        }, 150);

        return () => clearInterval(timer);
    }, []);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.8, ease: "circOut" }}
                    className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-4"
                >
                    {/* Neon Grid Background */}
                    <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
                        style={{
                            backgroundImage: `linear-gradient(hsl(var(--neon-blue)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--neon-blue)) 1px, transparent 1px)`,
                            backgroundSize: '40px 40px'
                        }}
                    />

                    <div className="relative flex flex-col items-center max-w-xs w-full">
                        {/* Animated Logo/Symbol */}
                        <motion.div
                            animate={{
                                rotate: 360,
                                boxShadow: ["0 0 20px rgba(59, 130, 246, 0.2)", "0 0 40px rgba(59, 130, 246, 0.5)", "0 0 20px rgba(59, 130, 246, 0.2)"]
                            }}
                            transition={{ rotate: { duration: 4, repeat: Infinity, ease: "linear" }, boxShadow: { duration: 2, repeat: Infinity } }}
                            className="w-16 h-16 rounded-xl border-2 border-primary/50 flex items-center justify-center mb-8 relative"
                        >
                            <div className="w-8 h-8 border-2 border-primary rounded-sm opacity-80" />
                        </motion.div>

                        {/* Loading Text */}
                        <div className="text-center space-y-2 w-full">
                            <h2 className="text-xl font-bold tracking-widest uppercase neon-text text-primary">
                                Initializing System
                            </h2>
                            <div className="flex justify-between font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                                <span>Modules: Loading</span>
                                <span>{Math.round(progress)}%</span>
                            </div>

                            {/* Progress Bar */}
                            <div className="h-[2px] w-full bg-primary/10 rounded-full overflow-hidden relative">
                                <motion.div
                                    className="absolute inset-y-0 left-0 bg-primary shadow-[0_0_10px_#3b82f6]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                />
                            </div>

                            <p className="text-[10px] font-mono text-primary/40 mt-4 animate-pulse">
                                ▸ AUTHENTICATING_NEURAL_RECORDS...
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Preloader;
