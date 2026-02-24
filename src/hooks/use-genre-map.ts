"use client";

import { useMovieGenres } from "@/hooks/use-movies";
import { useTvGenres } from "@/hooks/use-tv";

/** 장르 ID → 이름 매핑 객체를 반환하는 훅 (예: { 28: "액션", 12: "모험" }) */
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
