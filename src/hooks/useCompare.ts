import { useState } from "react";
import { fetchGitHubData, type GitHubData } from "@/services/github";

export function useCompare() {
  const [dataA, setDataA] = useState<GitHubData | null>(null);
  const [dataB, setDataB] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const compare = async (userA: string, userB: string) => {
    setLoading(true);
    setError(null);
    setDataA(null);
    setDataB(null);
    try {
      const [a, b] = await Promise.all([
        fetchGitHubData(userA),
        fetchGitHubData(userB),
      ]);
      setDataA(a);
      setDataB(b);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return { dataA, dataB, loading, error, compare };
}
