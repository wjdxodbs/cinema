"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getPopularTv, getTvByGenre, getTvGenres } from "@/lib/tmdb";

export function usePopularTv() {
  return useInfiniteQuery({
    queryKey: ["tv", "popular"],
    queryFn: ({ pageParam }) => getPopularTv(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });
}

export function useTvByGenre(genreId: number | null) {
  return useInfiniteQuery({
    queryKey: ["tv", "genre", genreId],
    queryFn: ({ pageParam }) => getTvByGenre(genreId!, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    enabled: genreId !== null,
  });
}

export function useTvGenres() {
  return useQuery({
    queryKey: ["genres", "tv"],
    queryFn: getTvGenres,
    staleTime: Infinity,
  });
}
