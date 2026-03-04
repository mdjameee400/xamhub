import { useState } from "react";
import { fetchGitHubData, type GitHubData } from "@/services/github";

export function useGitHub() {
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (username: string) => {
    if (!username.trim()) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const result = await fetchGitHubData(username.trim());
      setData(result);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, analyze };
}
