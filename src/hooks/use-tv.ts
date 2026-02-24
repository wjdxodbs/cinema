"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { tmdbNextPageParam } from "@/lib/utils";
import type { TvShow, PaginatedResponse, Genre } from "@/types/tmdb";

/** Route Handler(/api/tv)를 통해 TV 프로그램 목록 요청 (장르 필터 선택 가능) */
async function fetchTv(page: number, genreId?: number): Promise<PaginatedResponse<TvShow>> {
  const params = new URLSearchParams({ page: String(page) });
  if (genreId) params.set("genre", String(genreId));
  const res = await fetch(`/api/tv?${params}`);
  if (!res.ok) throw new Error("Failed to fetch tv shows");
  return res.json();
}

/** Route Handler(/api/genres)를 통해 TV 장르 목록 요청 */
async function fetchTvGenres(): Promise<{ genres: Genre[] }> {
  const res = await fetch("/api/genres?type=tv");
  if (!res.ok) throw new Error("Failed to fetch genres");
  return res.json();
}

/** 인기 TV 프로그램 무한스크롤 조회 훅 */
export function usePopularTv() {
  return useInfiniteQuery({
    queryKey: ["tv", "popular"],
    queryFn: ({ pageParam }) => fetchTv(pageParam),
    initialPageParam: 1,
    getNextPageParam: tmdbNextPageParam,
  });
}

/** 특정 장르별 TV 프로그램 무한스크롤 조회 훅 (genreId가 null이면 비활성화) */
export function useTvByGenre(genreId: number | null) {
  return useInfiniteQuery({
    queryKey: ["tv", "genre", genreId],
    queryFn: ({ pageParam }) => fetchTv(pageParam, genreId!),
    initialPageParam: 1,
    getNextPageParam: tmdbNextPageParam,
    enabled: genreId !== null,
  });
}

/** TV 장르 목록 조회 훅 (한 번 로드 후 캐시 유지) */
export function useTvGenres() {
  return useQuery({
    queryKey: ["genres", "tv"],
    queryFn: fetchTvGenres,
    staleTime: Infinity,
  });
}
