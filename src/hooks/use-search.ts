"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { tmdbNextPageParam } from "@/lib/utils";
import type { Movie, TvShow, PaginatedResponse } from "@/types/tmdb";

async function fetchSearch(query: string, page: number): Promise<PaginatedResponse<Movie | TvShow>> {
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&page=${page}`);
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}

export function useSearch(query: string) {
  return useInfiniteQuery({
    queryKey: ["search", query],
    queryFn: ({ pageParam }) => fetchSearch(query, pageParam),
    initialPageParam: 1,
    getNextPageParam: tmdbNextPageParam,
    enabled: query.trim().length > 0,
  });
}
