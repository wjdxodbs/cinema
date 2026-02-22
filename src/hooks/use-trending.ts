"use client";

import { useQuery } from "@tanstack/react-query";
import { getTrending } from "@/lib/tmdb";

export function useTrending(
  mediaType: "movie" | "tv" | "all" = "all",
  timeWindow: "day" | "week" = "week"
) {
  return useQuery({
    queryKey: ["trending", mediaType, timeWindow],
    queryFn: () => getTrending(mediaType, timeWindow),
  });
}
