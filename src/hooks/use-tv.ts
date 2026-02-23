"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { tmdbNextPageParam } from "@/lib/utils";
import type { TvShow, PaginatedResponse, Genre } from "@/types/tmdb";

async function fetchTv(page: number, genreId?: number): Promise<PaginatedResponse<TvShow>> {
  const params = new URLSearchParams({ page: String(page) });
  if (genreId) params.set("genre", String(genreId));
  const res = await fetch(`/api/tv?${params}`);
  if (!res.ok) throw new Error("Failed to fetch tv shows");
  return res.json();
}

async function fetchTvGenres(): Promise<{ genres: Genre[] }> {
  const res = await fetch("/api/genres?type=tv");
  if (!res.ok) throw new Error("Failed to fetch genres");
  return res.json();
}

export function usePopularTv() {
  return useInfiniteQuery({
    queryKey: ["tv", "popular"],
    queryFn: ({ pageParam }) => fetchTv(pageParam),
    initialPageParam: 1,
    getNextPageParam: tmdbNextPageParam,
  });
}

export function useTvByGenre(genreId: number | null) {
  return useInfiniteQuery({
    queryKey: ["tv", "genre", genreId],
    queryFn: ({ pageParam }) => fetchTv(pageParam, genreId!),
    initialPageParam: 1,
    getNextPageParam: tmdbNextPageParam,
    enabled: genreId !== null,
  });
}

export function useTvGenres() {
  return useQuery({
    queryKey: ["genres", "tv"],
    queryFn: fetchTvGenres,
    staleTime: Infinity,
  });
}
