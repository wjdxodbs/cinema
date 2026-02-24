"use client";

import { useQuery } from "@tanstack/react-query";
import type { TrendingResponse } from "@/types/tmdb";

/** Route Handler(/api/trending)를 통해 트렌딩 미디어 목록 요청 */
async function fetchTrending(
  mediaType: "movie" | "tv" | "all",
  timeWindow: "day" | "week"
): Promise<TrendingResponse> {
  const params = new URLSearchParams({ mediaType, timeWindow });
  const res = await fetch(`/api/trending?${params}`);
  if (!res.ok) throw new Error("Failed to fetch trending");
  return res.json();
}

/** 트렌딩 미디어 조회 훅 (미디어 타입·기간별 필터링) */
export function useTrending(
  mediaType: "movie" | "tv" | "all" = "all",
  timeWindow: "day" | "week" = "week"
) {
  return useQuery({
    queryKey: ["trending", mediaType, timeWindow],
    queryFn: () => fetchTrending(mediaType, timeWindow),
  });
}
