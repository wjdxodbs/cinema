"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { searchMulti } from "@/lib/tmdb";

export function useSearch(query: string) {
  return useInfiniteQuery({
    queryKey: ["search", query],
    queryFn: ({ pageParam }) => searchMulti(query, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    enabled: query.trim().length > 0,
  });
}
