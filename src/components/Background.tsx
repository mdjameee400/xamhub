const Background = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" style={{ backgroundColor: "hsl(0 0% 0%)" }}>
      {/* Breathing radial gradient */}
      <div
        className="absolute inset-0 animate-breathe"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, hsl(222 65% 12% / 0.8), hsl(222 65% 6% / 0.4), transparent)",
        }}
      />
      {/* Floating orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full animate-orb-drift opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, hsl(213 94% 55% / 0.15), transparent 70%)" }}
      />
      <div
        className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full animate-orb-drift opacity-20 blur-3xl"
        style={{
          background: "radial-gradient(circle, hsl(213 94% 40% / 0.12), transparent 70%)",
          animationDelay: "-5s",
        }}
      />
      <div
        className="absolute top-2/3 left-1/2 w-64 h-64 rounded-full animate-orb-drift opacity-15 blur-3xl"
        style={{
          background: "radial-gradient(circle, hsl(222 60% 20% / 0.2), transparent 70%)",
          animationDelay: "-10s",
        }}
      />
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(213 94% 55% / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(213 94% 55% / 0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
};

export default Background;
