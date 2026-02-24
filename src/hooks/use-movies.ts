"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { tmdbNextPageParam } from "@/lib/utils";
import type { Movie, PaginatedResponse, Genre } from "@/types/tmdb";

/** Route Handler(/api/movies)를 통해 영화 목록 요청 (장르 필터 선택 가능) */
async function fetchMovies(page: number, genreId?: number): Promise<PaginatedResponse<Movie>> {
  const params = new URLSearchParams({ page: String(page) });
  if (genreId) params.set("genre", String(genreId));
  const res = await fetch(`/api/movies?${params}`);
  if (!res.ok) throw new Error("Failed to fetch movies");
  return res.json();
}

/** Route Handler(/api/genres)를 통해 영화 장르 목록 요청 */
async function fetchMovieGenres(): Promise<{ genres: Genre[] }> {
  const res = await fetch("/api/genres?type=movie");
  if (!res.ok) throw new Error("Failed to fetch genres");
  return res.json();
}

/** 인기 영화 무한스크롤 조회 훅 */
export function usePopularMovies() {
  return useInfiniteQuery({
    queryKey: ["movies", "popular"],
    queryFn: ({ pageParam }) => fetchMovies(pageParam),
    initialPageParam: 1,
    getNextPageParam: tmdbNextPageParam,
  });
}

/** 특정 장르별 영화 무한스크롤 조회 훅 (genreId가 null이면 비활성화) */
export function useMoviesByGenre(genreId: number | null) {
  return useInfiniteQuery({
    queryKey: ["movies", "genre", genreId],
    queryFn: ({ pageParam }) => fetchMovies(pageParam, genreId!),
    initialPageParam: 1,
    getNextPageParam: tmdbNextPageParam,
    enabled: genreId !== null,
  });
}

/** 영화 장르 목록 조회 훅 (한 번 로드 후 캐시 유지) */
export function useMovieGenres() {
  return useQuery({
    queryKey: ["genres", "movie"],
    queryFn: fetchMovieGenres,
    staleTime: Infinity,
  });
}
