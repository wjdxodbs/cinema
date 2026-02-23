"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { tmdbNextPageParam } from "@/lib/utils";
import type { Movie, PaginatedResponse, Genre } from "@/types/tmdb";

async function fetchMovies(page: number, genreId?: number): Promise<PaginatedResponse<Movie>> {
  const params = new URLSearchParams({ page: String(page) });
  if (genreId) params.set("genre", String(genreId));
  const res = await fetch(`/api/movies?${params}`);
  if (!res.ok) throw new Error("Failed to fetch movies");
  return res.json();
}

async function fetchMovieGenres(): Promise<{ genres: Genre[] }> {
  const res = await fetch("/api/genres?type=movie");
  if (!res.ok) throw new Error("Failed to fetch genres");
  return res.json();
}

export function usePopularMovies() {
  return useInfiniteQuery({
    queryKey: ["movies", "popular"],
    queryFn: ({ pageParam }) => fetchMovies(pageParam),
    initialPageParam: 1,
    getNextPageParam: tmdbNextPageParam,
  });
}

export function useMoviesByGenre(genreId: number | null) {
  return useInfiniteQuery({
    queryKey: ["movies", "genre", genreId],
    queryFn: ({ pageParam }) => fetchMovies(pageParam, genreId!),
    initialPageParam: 1,
    getNextPageParam: tmdbNextPageParam,
    enabled: genreId !== null,
  });
}

export function useMovieGenres() {
  return useQuery({
    queryKey: ["genres", "movie"],
    queryFn: fetchMovieGenres,
    staleTime: Infinity,
  });
}
