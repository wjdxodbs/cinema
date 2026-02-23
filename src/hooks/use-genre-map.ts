"use client";

import { useMovieGenres } from "@/hooks/use-movies";
import { useTvGenres } from "@/hooks/use-tv";

export function useGenreMap(type: "movie" | "tv" | "all" = "all") {
  const { data: movieGenres } = useMovieGenres();
  const { data: tvGenres } = useTvGenres();

  const movie =
    type !== "tv"
      ? Object.fromEntries(movieGenres?.genres?.map((g) => [g.id, g.name]) ?? [])
      : {};
  const tv =
    type !== "movie"
      ? Object.fromEntries(tvGenres?.genres?.map((g) => [g.id, g.name]) ?? [])
      : {};
  return { ...movie, ...tv };
}
