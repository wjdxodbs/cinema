"use client";

import { useQuery } from "@tanstack/react-query";
import type { TrendingResponse } from "@/types/tmdb";

async function fetchTrending(
  mediaType: "movie" | "tv" | "all",
  timeWindow: "day" | "week"
): Promise<TrendingResponse> {
  const params = new URLSearchParams({ mediaType, timeWindow });
  const res = await fetch(`/api/trending?${params}`);
  if (!res.ok) throw new Error("Failed to fetch trending");
  return res.json();
}

export function useTrending(
  mediaType: "movie" | "tv" | "all" = "all",
  timeWindow: "day" | "week" = "week"
) {
  return useQuery({
    queryKey: ["trending", mediaType, timeWindow],
    queryFn: () => fetchTrending(mediaType, timeWindow),
  });
}
