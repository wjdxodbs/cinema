"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getMoviesByGenre, getMovieGenres, getPopularMovies } from "@/lib/tmdb";

export function usePopularMovies() {
  return useInfiniteQuery({
    queryKey: ["movies", "popular"],
    queryFn: ({ pageParam }) => getPopularMovies(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });
}

export function useMoviesByGenre(genreId: number | null) {
  return useInfiniteQuery({
    queryKey: ["movies", "genre", genreId],
    queryFn: ({ pageParam }) => getMoviesByGenre(genreId!, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    enabled: genreId !== null,
  });
}

export function useMovieGenres() {
  return useQuery({
    queryKey: ["genres", "movie"],
    queryFn: getMovieGenres,
    staleTime: Infinity,
  });
}
