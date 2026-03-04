import { motion } from "framer-motion";
import { MapPin, Calendar, ExternalLink, Users } from "lucide-react";
import type { GitHubUser } from "@/services/github";

interface ProfilePanelProps {
  user: GitHubUser;
}

const ProfilePanel = ({ user }: ProfilePanelProps) => {
  const accountAge = () => {
    const created = new Date(user.created_at);
    const now = new Date();
    const years = now.getFullYear() - created.getFullYear();
    const months = now.getMonth() - created.getMonth();
    if (years > 0) return `${years}y ${months >= 0 ? months : 12 + months}m`;
    return `${months >= 0 ? months : 12 + months}m`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, type: "spring" }}
      whileHover={{ y: -8 }}
      className="glass-card-glow p-6 animate-float-slow"
    >
      <div className="flex flex-col items-center text-center gap-4">
        <div className="relative">
          <div className="w-28 h-28 rounded-full neon-ring p-1">
            <img
              src={user.avatar_url}
              alt={user.login}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-card-foreground">
            {user.name || user.login}
          </h2>
          <p className="text-sm text-muted-foreground font-mono">@{user.login}</p>
        </div>

        {user.bio && (
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            {user.bio}
          </p>
        )}

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4 text-primary" />
            <strong className="text-card-foreground">{user.followers}</strong> followers
          </span>
          <span>
            <strong className="text-card-foreground">{user.following}</strong> following
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full mt-2">
          <Stat label="Repos" value={user.public_repos} />
          <Stat label="Account Age" value={accountAge()} />
        </div>

        <div className="flex flex-col gap-1.5 text-xs text-muted-foreground mt-2">
          {user.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> {user.location}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> Joined {new Date(user.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
          </span>
        </div>

        <a
          href={user.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="neon-button text-sm mt-2 flex items-center gap-2"
        >
          <ExternalLink className="w-4 h-4" /> View Profile
        </a>
      </div>
    </motion.div>
  );
};

const Stat = ({ label, value }: { label: string; value: string | number }) => (
  <div className="bg-muted/30 rounded-xl p-3 text-center">
    <div className="text-lg font-semibold text-card-foreground neon-text">{value}</div>
    <div className="text-xs text-muted-foreground">{label}</div>
  </div>
);

export default ProfilePanel;
