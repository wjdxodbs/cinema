"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { tmdbNextPageParam } from "@/lib/utils";
import type { Movie, TvShow, PaginatedResponse } from "@/types/tmdb";

/** Route Handler(/api/search)를 통해 영화+TV 통합 검색 요청 */
async function fetchSearch(query: string, page: number): Promise<PaginatedResponse<Movie | TvShow>> {
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&page=${page}`);
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}

/** 검색 결과 무한스크롤 조회 훅 (검색어가 비어있으면 비활성화) */
export function useSearch(query: string) {
  return useInfiniteQuery({
    queryKey: ["search", query],
    queryFn: ({ pageParam }) => fetchSearch(query, pageParam),
    initialPageParam: 1,
    getNextPageParam: tmdbNextPageParam,
    enabled: query.trim().length > 0,
  });
}
